import { useStoreStore } from "@/store/storeStore";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/addOrder";
import { Entypo, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { APIError } from "@/api";
import ModalMultiDropdown from "@/components/CustomDropdown/MultiDropdown";
import FloatingLabelInput from "@/components/FloatingLabelInput/FloatingLabelInput";
import { orderStatusArray } from "@/lib/orderStatusArabicNames";
import {
  clientAssistantPermissionsArray,
  createEmployeeService,
} from "@/services/createEmployee";
import { useAuth } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function AddEmployee() {
  const router = useRouter();
  const { companyID, branchId } = useAuth();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const { stores } = useStoreStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [date, setDate] = useState<{
    name: string;
    phone: string;
    storesIDs: string[];
    orderStatus: string[];
    clientAssistantRole: string[];
    role: string;
    password: string;
    confirmPassword: string;
  }>({
    name: "",
    phone: "",
    storesIDs: [],
    orderStatus: [],
    clientAssistantRole: [],
    role: "",
    password: "",
    confirmPassword: "",
  });

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
      return createEmployeeService(data);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "تم بنجاح ✅",
        text2: "تم إضافه الموظف بنجاح 🎉",
        position: "top",
      });
      setDate({
        name: "",
        phone: "",
        storesIDs: [],
        orderStatus: [],
        clientAssistantRole: [],
        role: "",
        password: "",
        confirmPassword: "",
      });
      setSelectedImage(null);
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
    formData.append("password", date.password);
    formData.append("orderStatus", JSON.stringify(date.orderStatus));

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
            اضافه موظف
          </Text>
        </View>
        <View style={styles.navbarItem}></View>
      </View>
      <KeyboardAvoidingView
        behavior={"padding"}
        style={{
          flex: 1,
          backgroundColor: theme === "dark" ? "#31404e" : "#fff",
        }}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={{ flex: 1, padding: 10, marginBottom: 20 }}
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
              onChangeText={(v) => setDate((pre) => ({ ...pre, password: v }))}
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
          <View>
            <Pressable
              style={[styles.button]}
              disabled={isPending}
              onPress={submitHandler}
            >
              {isPending ? (
                <ActivityIndicator size={"small"} color={"#fff"} />
              ) : (
                <Text style={styles.buttonText}>إنشاء</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
