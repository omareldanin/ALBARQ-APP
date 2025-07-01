import { APIError } from "@/api";
import NativeSearchableSelect from "@/components/AddOptions/dropDown";
import MyRadioGroup from "@/components/CustomDropdown/RadioInput";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import {
  governorateArabicNames,
  governorateArray,
} from "@/lib/governorateArabicNames ";
import { queryClient } from "@/lib/queryClient";
import { EditOrderPayload, editOrderService } from "@/services/editOrder";
import { useLocationStore } from "@/store/locationStore";
import { useStoreStore } from "@/store/storeStore";
import styles from "@/styles/addOrder";
import { Feather } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StatusBar, Text, TextInput, View } from "react-native";
import { Flow, Fold } from "react-native-animated-spinkit";
import { ScrollView } from "react-native-gesture-handler";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function EditOrder() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { receiptNumber, id } = useLocalSearchParams();
  const nameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const totalRef = useRef<TextInput>(null);
  const detailsRef = useRef<TextInput>(null);

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
    const cleaned = phone.replace(/[^0-9]/g, "");
    const part1 = cleaned.slice(0, 4);
    const part2 = cleaned.slice(4, 7);
    const part3 = cleaned.slice(7, 11);
    return [part1, part2, part3].filter(Boolean).join(" ");
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
    <View style={styles.container}>
      <StatusBar backgroundColor="#a91101" translucent={false} />
      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-right-circle" size={25} color="#fff" />
          </Pressable>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 18 }}
          >
            اضافه طلب {order ? " - " + order.data.receiptNumber : ""}
          </Text>
        </View>
        <View style={styles.navbarItem}></View>
      </View>
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
            <TextInput
              placeholder="اسم الزبون"
              onChangeText={(value) =>
                setOrderData((pre) => ({ ...pre, recipientName: value }))
              }
              style={[styles.input]}
              value={orderDate.recipientName}
              placeholderTextColor={"grey"}
              ref={nameRef}
              allowFontScaling={false}
              importantForAutofill="no"
            />
          </View>
          <View style={styles.formGroup}>
            <TextInput
              placeholder="هاتف الزبون xxxx xxx xxxx"
              onChangeText={(value) => {
                const cleaned = value.replace(/[^0-9]/g, "");

                setOrderData((pre) => ({ ...pre, recipientPhone: cleaned }));
              }}
              style={[styles.input]}
              value={
                orderDate.recipientPhone
                  ? formatPhone(orderDate.recipientPhone)
                  : ""
              }
              placeholderTextColor={"grey"}
              ref={phoneRef}
              maxLength={13}
            />
          </View>
          <View style={styles.formGroup}>
            <NativeSearchableSelect
              options={governorateArray}
              label="اختر المحافظه"
              setValue={(value) => {
                setOrderData((pre) => ({ ...pre, governorate: value }));
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
                  ? locations.find((s) => s.id === orderDate?.locationID)?.name
                  : null
              }
            />
          </View>
          <View style={styles.formGroup}>
            <TextInput
              placeholder="اقرب نقطه داله"
              onChangeText={(value) =>
                setOrderData((pre) => ({ ...pre, recipientAddress: value }))
              }
              style={[styles.input]}
              value={orderDate.recipientAddress}
              placeholderTextColor={"grey"}
              ref={addressRef}
            />
          </View>
          <View style={styles.formGroup}>
            <TextInput
              placeholder="السعر الكلي"
              onChangeText={(value) => {
                const cleaned = value.replace(/[^0-9]/g, "");
                setOrderData((pre) => ({
                  ...pre,
                  totalCost: cleaned === "" ? undefined : Number(cleaned),
                }));
              }}
              style={[styles.input]}
              value={
                orderDate.totalCost === undefined
                  ? ""
                  : orderDate.totalCost + ""
              }
              placeholderTextColor={"grey"}
              ref={totalRef}
              maxLength={7}
            />
          </View>
          <View style={styles.formGroup}>
            <TextInput
              placeholder="تفاصيل الطلب"
              onChangeText={(value) =>
                setOrderData((pre) => ({ ...pre, details: value }))
              }
              style={[styles.input]}
              value={orderDate.details}
              placeholderTextColor={"grey"}
              ref={detailsRef}
            />
          </View>
          <View style={styles.formGroup}>
            <MyRadioGroup
              data={[
                { value: "NORMAL", label: "عادى" },
                { value: "REPLACEMENT", label: "استبدال" },
              ]}
              onSelect={(value) =>
                setOrderData((pre) => ({ ...pre, deliveryType: value }))
              }
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
    </View>
  );
}
