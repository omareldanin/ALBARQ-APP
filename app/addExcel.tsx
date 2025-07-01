import { APIError } from "@/api";
import InlineDropdown from "@/components/CustomDropdown/InlineDropdown";
import { SheetOrderItem } from "@/components/Order/SheetOrder";
import { useOrderSheet } from "@/hooks/useOrderSheet";
import { handlePickExcel, OrderSheet } from "@/lib/readExcel";
import { CreateOrderItem, createOrderService } from "@/services/addOrder";
import { useLocationStore } from "@/store/locationStore";
import { useStoreStore } from "@/store/storeStore";
import styles from "@/styles/addOrder";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Flow, Fold } from "react-native-animated-spinkit";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const governorateMapArabicToEnglish: Record<string, string> = {
  الأنبار: "AL_ANBAR",
  بابل: "BABIL",
  بغداد: "BAGHDAD",
  البصرة: "BASRA",
  "ذي قار": "DHI_QAR",
  القادسية: "AL_QADISIYYAH",
  ديالى: "DIYALA",
  دهوك: "DUHOK",
  أربيل: "ERBIL",
  كربلاء: "KARBALA",
  كركوك: "KIRKUK",
  ميسان: "MAYSAN",
  المثنى: "MUTHANNA",
  النجف: "NAJAF",
  نينوى: "NINAWA",
  "صلاح الدين": "SALAH_AL_DIN",
};

export default function AddOrderExcel() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

  const [orderDate, setOrderData] = useState<OrderSheet[]>([]);
  const { locations } = useLocationStore();
  const { stores } = useStoreStore();

  useEffect(() => {
    if (stores.length === 1) {
      setSelectedStore(stores[0].id);
    }
  }, [stores]);

  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: (data: CreateOrderItem[]) => {
      return createOrderService(data);
    },
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "تم بنجاح ✅",
        text2: "تم اضافه الطلبات بنجاح 🎉",
        position: "top",
      });
      setOrderData([]);
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

  const { mutateAsync: downloadSheet, isPending: isLoadingExcel } =
    useOrderSheet();

  const handleCreateOrders = () => {
    if (!selectedStore) {
      Toast.show({
        type: "error",
        text1: "ادخل المتجر ❌",
        text2: "",
        position: "top",
      });
      return;
    }
    const data = orderDate.map((order) => ({
      withProducts: false,
      storeID: Number(selectedStore),
      locationID: locations?.find((location) => location.name === order.city)
        ?.id,
      governorate: governorateMapArabicToEnglish[order.Governorate],
      notes: order.notes,
      recipientPhone: order.phoneNumber,
      recipientAddress: order.address,
      totalCost: Number(order.total),
    }));
    createOrder(data);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-right-circle" size={25} color="#fff" />
          </Pressable>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 18 }}
          >
            اضافه ملف
          </Text>
        </View>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => downloadSheet()}>
            <AntDesign name="download" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
      {isLoadingExcel ? (
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
      ) : null}
      <View style={{ flex: 1, padding: 10 }}>
        <FlatList
          data={[{ key: "form" }]}
          renderItem={() => (
            <>
              <View style={styles.formGroup}>
                <InlineDropdown
                  data={stores.map((s) => ({
                    value: s.id + "",
                    label: s.name,
                  }))}
                  placeholder="اختر المتجر"
                  onSelect={(value) => {
                    setOrderData((pre) => ({ ...pre, storeID: +value }));
                  }}
                />
              </View>
              <View style={{ direction: "rtl" }}>
                {orderDate.map((order, index) => (
                  <SheetOrderItem key={index} order={order} index={index} />
                ))}
              </View>
            </>
          )}
          keyboardShouldPersistTaps="handled"
          style={styles.form}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 30,
          }}
        />
        {orderDate.length === 0 ? (
          <Pressable
            style={styles.button}
            onPress={() => {
              handlePickExcel((orders) => {
                setOrderData(orders);
              });
            }}
            disabled={isPending}
          >
            <Text style={styles.buttonText}>تحميل ملف</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.button}
            onPress={() => {
              handleCreateOrders();
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Flow size={40} color="#fff" style={{ margin: "auto" }} />
            ) : (
              <Text style={styles.buttonText}>ارسال الطلبات</Text>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
