import { APIError } from "@/api";
import NativeSearchableSelect from "@/components/AddOptions/dropDown";
import MyRadioGroup from "@/components/CustomDropdown/RadioInput";
import FloatingLabelInput from "@/components/FloatingLabelInput/FloatingLabelInput";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import {
  governorateArabicNames,
  governorateArray,
} from "@/lib/governorateArabicNames ";
import { queryClient } from "@/lib/queryClient";
import { EditOrderPayload, editOrderService } from "@/services/editOrder";
import { useLocationStore } from "@/store/locationStore";
import { useStoreStore } from "@/store/storeStore";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/addOrder";
import { Feather } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { Flow, Fold } from "react-native-animated-spinkit";
import { ScrollView } from "react-native-gesture-handler";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function EditOrder() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { receiptNumber, id } = useLocalSearchParams();
  const { theme } = useThemeStore();

  const [orderDate, setOrderData] = useState<EditOrderPayload>({
    recipientPhone: "",
    recipientName: undefined,
    governorate: "",
    storeID: undefined,
    locationID: undefined,
    recipientAddress: "",
    details: "",
    totalCost: undefined,
    deliveryType: "NORMAL",
    withProducts: false,
  });

  const { data: order, isLoading } = useOrderDetails(receiptNumber.toString());

  const { locations } = useLocationStore();
  const { stores } = useStoreStore();

  useEffect(() => {
    if (order) {
      setOrderData({
        storeID: order.data.store.id,
        recipientPhone: order.data.recipientPhones[0],
        recipientName: order.data.recipientName,
        governorate: order.data.governorate,
        locationID: order.data.location.id,
        recipientAddress: order.data.recipientAddress,
        details: order.data.details,
        totalCost: +order.data.totalCost,
        deliveryType: order.data.deliveryType,
        withProducts: false,
      });
    }
    if (stores.length === 1) {
      setOrderData((pre) => ({ ...pre, storeID: stores[0].id }));
    }
  }, [stores, order]);

  const { mutate: editOrder, isPending: isloadingEdit } = useMutation({
    mutationFn: () => {
      return editOrderService({
        data: orderDate,
        id: id + "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      Toast.show({
        type: "success",
        text1: "تم بنجاح ✅",
        text2: "تم التعديل بنجاح 🎉",
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
    if (stores.length !== 1 && !orderDate.storeID) {
      Toast.show({
        type: "error",
        text1: "ادخل المتجر ❌",
        text2: "",
        position: "top",
      });
      return;
    }
    if (orderDate.recipientPhone === "") {
      Toast.show({
        type: "error",
        text1: "ادخل رقم الهاتف ❌",
        text2: "",
        position: "top",
      });
      return;
    }
    if (!orderDate.governorate) {
      Toast.show({
        type: "error",
        text1: "ادخل المحافظه ❌",
        text2: "",
        position: "top",
      });
      return;
    }
    if (!orderDate.locationID) {
      Toast.show({
        type: "error",
        text1: "ادخل المنطقه ❌",
        text2: "",
        position: "top",
      });
      return;
    }
    if (orderDate.totalCost === undefined) {
      Toast.show({
        type: "error",
        text1: "ادخل السعر الكلي ❌",
        text2: "",
        position: "top",
      });
      return;
    }

    editOrder();
  };

  const formatPhone = (phone: string) => {
    if (phone.length < 5) {
      return `${phone.slice(0, 4)}`;
    } else if (phone.length > 4 && phone.length < 8) {
      return `${phone.slice(0, 4)}-${phone.slice(4, 7)}`;
    } else {
      return `${phone.slice(0, 4)}-${phone.slice(4, 7)}-${phone.slice(7, 11)}`;
    }
  };

  const formatNumber = (value: string | number) => {
    return new Intl.NumberFormat("en-US").format(Number(value));
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          width: "100%",
        }}
      >
        <Fold size={50} color="#A91101" />
      </View>
    );
  }
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
            تعديل طلب {order ? " - " + order.data.receiptNumber : ""}
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
          style={{ flex: 1, padding: 10 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 30,
          }}
        >
          <View>
            <View style={styles.formGroup}>
              <NativeSearchableSelect
                options={stores.map((s) => ({
                  value: s.id + "",
                  label: s.name,
                }))}
                label="اختر المتجر"
                setValue={(value) => {
                  setOrderData((pre) => ({ ...pre, storeID: +value }));
                }}
                value={
                  orderDate.storeID
                    ? stores.find((s) => s.id === orderDate?.storeID)?.name
                    : null
                }
              />
            </View>
            <View style={styles.formGroup}>
              <FloatingLabelInput
                label="اسم الزبون"
                onChangeText={(value) =>
                  setOrderData((pre) => ({ ...pre, recipientName: value }))
                }
                value={orderDate.recipientName || ""}
              />
            </View>
            <View style={styles.formGroup}>
              <FloatingLabelInput
                label="هاتف الزبون"
                onChangeText={(value) => {
                  const cleaned = value.replace(/[^0-9]/g, "");

                  setOrderData((pre) => ({ ...pre, recipientPhone: cleaned }));
                }}
                value={
                  orderDate.recipientPhone
                    ? formatPhone(orderDate.recipientPhone)
                    : ""
                }
                length={13}
              />
            </View>
            <View style={styles.formGroup}>
              <NativeSearchableSelect
                options={governorateArray}
                label="اختر المحافظه"
                setValue={(value) => {
                  setOrderData((pre) => ({
                    ...pre,
                    governorate: value,
                    locationID: undefined,
                  }));
                }}
                value={
                  orderDate.governorate
                    ? governorateArabicNames[
                        orderDate.governorate as keyof typeof governorateArabicNames
                      ]
                    : null
                }
              />
            </View>
            <View style={styles.formGroup}>
              <NativeSearchableSelect
                options={locations
                  .filter(
                    (i) =>
                      orderDate.governorate !== "" &&
                      orderDate.governorate === i.governorate
                  )
                  .map((l) => ({
                    value: l.id + "",
                    label: l.name,
                  }))}
                label="اختر المنطقه"
                setValue={(value) => {
                  setOrderData((pre) => ({ ...pre, locationID: +value }));
                }}
                value={
                  orderDate.locationID
                    ? locations.find((s) => s.id === orderDate?.locationID)
                        ?.name
                    : null
                }
              />
            </View>
            <View style={styles.formGroup}>
              <FloatingLabelInput
                label="اقرب نقطه داله"
                onChangeText={(value) =>
                  setOrderData((pre) => ({ ...pre, recipientAddress: value }))
                }
                value={orderDate.recipientAddress || ""}
              />
            </View>
            <View style={styles.formGroup}>
              <FloatingLabelInput
                label="السعر الكلي"
                onChangeText={(value) => {
                  const cleaned = value.replace(/[^0-9]/g, "");
                  setOrderData((pre) => ({
                    ...pre,
                    totalCost: cleaned === "" ? undefined : Number(cleaned),
                  }));
                }}
                value={
                  orderDate.totalCost === undefined
                    ? ""
                    : formatNumber(orderDate.totalCost) + ""
                }
                length={7}
              />
            </View>
            <View style={styles.formGroup}>
              <FloatingLabelInput
                label="تفاصيل الطلب"
                onChangeText={(value) =>
                  setOrderData((pre) => ({ ...pre, details: value }))
                }
                value={orderDate.details || ""}
              />
            </View>
            <View style={styles.formGroup}>
              <MyRadioGroup
                data={[
                  { value: "NORMAL", label: "عادي" },
                  { value: "REPLACEMENT", label: "استبدال" },
                ]}
                onSelect={(value) =>
                  setOrderData((pre) => ({ ...pre, deliveryType: value }))
                }
                value={orderDate.deliveryType}
              />
            </View>
            <Pressable
              style={styles.button}
              onPress={() => submitHandler()}
              disabled={isloadingEdit}
            >
              {isloadingEdit ? (
                <Flow size={40} color="#fff" style={{ margin: "auto" }} />
              ) : (
                <Text style={styles.buttonText}>حفظ</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
