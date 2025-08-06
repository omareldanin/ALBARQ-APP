import { useStoreStore } from "@/store/storeStore";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/addOrder";
import { Entypo, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { APIError } from "@/api";
import ConfirmDialog from "@/components/Confirm/Confirm";
import ModalMultiDropdown from "@/components/CustomDropdown/MultiDropdown";
import FloatingLabelInput from "@/components/FloatingLabelInput/FloatingLabelInput";
import { orderStatusArray } from "@/lib/orderStatusArabicNames";
import { queryClient } from "@/lib/queryClient";
import { clientAssistantPermissionsArray } from "@/services/createEmployee";
import { deleteEmployeeService } from "@/services/deleteEmployee";
import { editEmployeeService } from "@/services/editEmployee";
import { Employee } from "@/services/getEmployeesService";
import { useAuth } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function EditEmployee() {
  const router = useRouter();
  const { companyID, branchId } = useAuth();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const { stores } = useStoreStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { employee } = useLocalSearchParams();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [date, setDate] = useState<{
    id: number;
    name: string;
    phone: string;
    storesIDs: string[];
    orderStatus: string[];
    clientAssistantRole: string[];
    role: string;
    password: string;
    confirmPassword: string;
  }>({
    id: 0,
    name: "",
    phone: "",
    storesIDs: [],
    orderStatus: [],
    clientAssistantRole: [],
    role: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (employee) {
      const parsedEmployee = JSON.parse(employee + "") as Employee;
      setDate({
        id: parsedEmployee.id,
        name: parsedEmployee.name,
        phone: parsedEmployee.phone,
        storesIDs: parsedEmployee.managedStores.map((s) => s.id + ""),
        orderStatus: parsedEmployee.orderStatus,
        clientAssistantRole: parsedEmployee.permissions,
        role: parsedEmployee.clientAssistantRole,
        password: "",
        confirmPassword: "",
      });
      if (parsedEmployee.avatar) {
        setSelectedImage(parsedEmployee.avatar);
      }
    }
  }, [employee]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    const part1 = cleaned.slice(0, 4);
    const part2 = cleaned.slice(4, 7);
    const part3 = cleaned.slice(7, 11);
    return [part1, part2, part3].filter(Boolean).join(" ");
  };

  const { mutate: createEmployeeAction, isPending } = useMutation({
    mutationFn: (data: FormData) => {
      return editEmployeeService({ data: data, id: date.id });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "تم بنجاح ✅",
        text2: "تم تعديل الموظف بنجاح 🎉",
        position: "top",
      });
    },
    onError: (error: AxiosError<APIError>) => {
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: error.response?.data.message || "الرجاء التأكد من البيانات",
        position: "top",
      });
    },
  });

  const submitHandler = () => {
    if (date.password !== date.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: "الرقم كلمة المرور غير متطابقه",
        position: "top",
      });
      return;
    }
    if (date.name.length < 6) {
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: "الاسم يجب الا يقل عن 6 احرف",
        position: "top",
      });
      return;
    }
    if (date.phone.length < 11) {
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: "رقم الهاتف يجب ان يكون 11 رقم",
        position: "top",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", date.name);
    formData.append("username", date.phone);
    formData.append("phone", date.phone);
    formData.append("branchID", branchId);
    formData.append("companyID", companyID);
    formData.append("role", "CLIENT_ASSISTANT");
    formData.append("clientAssistantRole", date.role);
    formData.append("permissions", JSON.stringify(date.clientAssistantRole));
    formData.append("storesIDs", JSON.stringify(date.storesIDs));
    formData.append("orderStatus", JSON.stringify(date.orderStatus));

    if (date.password.length > 0) {
      formData.append("password", date.password);
    }
    if (selectedImage) {
      formData.append("avatar", {
        uri: selectedImage,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);
    } else {
      formData.append("avatar", "undefined");
    }

    createEmployeeAction(formData);
  };

  const { mutate: deleteEmployee, isPending: isloadingDelete } = useMutation({
    mutationFn: (id: number) => deleteEmployeeService({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
      Toast.show({
        type: "success",
        text1: "تم بنجاح ✅",
        text2: "تم حذف الموظف بنجاح 🎉",
        position: "top",
      });
      router.back();
    },
    onError: (error: AxiosError<APIError>) => {
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: error.response?.data.message || "الرجاء التأكد من البيانات",
        position: "top",
      });
    },
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
      ]}
    >
      <StatusBar backgroundColor="#a91101" translucent={false} />
      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-right-circle" size={25} color="#fff" />
          </Pressable>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 18 }}
          >
            تعديل موظف
          </Text>
        </View>
        <View style={styles.navbarItem}></View>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={"padding"}
          style={{
            flex: 1,
            backgroundColor: theme === "dark" ? "#31404e" : "#fff",
          }}
        >
          <ScrollView
            style={{ flex: 1, padding: 10, marginBottom: insets.bottom }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 30,
            }}
          >
            <Pressable style={styles.formGroupImage} onPress={pickImage}>
              <Image
                source={
                  selectedImage
                    ? { uri: selectedImage }
                    : require("../assets/images/images.png")
                }
                resizeMode="cover"
                style={styles.image}
              />
              <View style={styles.icon}>
                <Entypo name="camera" size={24} color="grey" />
              </View>
            </Pressable>
            <View style={styles.formGroup}>
              <FloatingLabelInput
                label="الأسم"
                value={date.name}
                onChangeText={(v) => setDate((pre) => ({ ...pre, name: v }))}
              />
            </View>
            <View style={styles.formGroup}>
              <FloatingLabelInput
                label="الهاتف"
                value={formatPhone(date.phone)}
                onChangeText={(value) => {
                  const cleaned = value.replace(/[^0-9]/g, "");

                  setDate((pre) => ({ ...pre, phone: cleaned }));
                }}
                length={13}
              />
            </View>
            <View style={styles.formGroup}>
              <FloatingLabelInput
                label="الدور"
                value={date.role}
                onChangeText={(v) => setDate((pre) => ({ ...pre, role: v }))}
              />
            </View>
            <View style={styles.formGroup}>
              <ModalMultiDropdown
                placeholder="المتاجر"
                data={stores.map((s) => ({
                  value: s.id + "",
                  label: s.name,
                }))}
                onSelect={(v) => {
                  setDate((pre) => ({ ...pre, storesIDs: v }));
                }}
                selectedValues={date.storesIDs}
              />
            </View>
            <View style={styles.formGroup}>
              <ModalMultiDropdown
                placeholder="الحالات المسنوده"
                data={orderStatusArray}
                onSelect={(v) => {
                  setDate((pre) => ({ ...pre, orderStatus: v }));
                }}
                selectedValues={date.orderStatus}
              />
            </View>
            <View style={styles.formGroup}>
              <ModalMultiDropdown
                placeholder="الصلاحيات"
                data={clientAssistantPermissionsArray}
                onSelect={(v) => {
                  setDate((pre) => ({ ...pre, clientAssistantRole: v }));
                }}
                selectedValues={date.clientAssistantRole}
              />
            </View>
            <View style={styles.formGroup}>
              <FloatingLabelInput
                label="كلمه المرور"
                value={date.password}
                onChangeText={(v) =>
                  setDate((pre) => ({ ...pre, password: v }))
                }
                secureTextEntry={true}
              />
            </View>
            <View style={styles.formGroup}>
              <FloatingLabelInput
                label="تأكيد كلمه المرور"
                value={date.confirmPassword}
                onChangeText={(v) =>
                  setDate((pre) => ({ ...pre, confirmPassword: v }))
                }
                secureTextEntry={true}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <Pressable
                style={[styles.button, { flex: 1, backgroundColor: "grey" }]}
                disabled={isloadingDelete}
                onPress={() => {
                  setShowConfirmDelete(true);
                }}
              >
                {isloadingDelete ? (
                  <ActivityIndicator size={"small"} color={"#fff"} />
                ) : (
                  <Text style={styles.buttonText}>حذف</Text>
                )}
              </Pressable>
              <Pressable
                style={[styles.button, { flex: 1 }]}
                disabled={isPending}
                onPress={submitHandler}
              >
                {isPending ? (
                  <ActivityIndicator size={"small"} color={"#fff"} />
                ) : (
                  <Text style={styles.buttonText}>حفظ</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <ConfirmDialog
        visible={showConfirmDelete}
        title={"حذف الموظف"}
        message={"هل انت متاكد من حذف هذا الموظف؟"}
        onConfirm={() => {
          setShowConfirmDelete(false);

          deleteEmployee(date.id);
        }}
        onCancel={() => {
          setShowConfirmDelete(false);
        }}
      />
    </View>
  );
}
