import { APIError } from "@/api";
import { Filters } from "@/components/Filters/Filter";
import { OrderItem } from "@/components/Order/Order";
import { useOrders } from "@/hooks/useOrders";
import { queryClient } from "@/lib/queryClient";
import { sendOrderToShipping } from "@/services/editOrder";
import { downloadAndOpenPdf } from "@/services/getOrderReceipt";
import { Order, OrdersFilter, OrdersMetaData } from "@/services/getOrders";
import { useAuth } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/ordersStyles";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Flow, Fold } from "react-native-animated-spinkit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
export const ordersFilterInitialState: OrdersFilter = {
  order_id: "",
  page: 1,
  size: 10,
  client_id: "",
  delivery_agent_id: "",
  delivery_date: null,
  delivery_type: "",
  end_date: "",
  governorate: "",
  location_id: "",
  pagesCount: 0,
  product_id: "",
  receipt_number: "",
  recipient_address: "",
  recipient_name: "",
  recipient_phone: "",
  search: "",
  sort: "",
  start_date: "",
  statuses: [],
  status: "",
  store_id: "",
  branch_id: "",
  automatic_update_id: "",
  minified: true,
  confirmed: true,
  processed: "0",
  forwarded_by_id: undefined,
};

export default function Orders() {
  const { role, permissions } = useAuth();
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useThemeStore();
  const [ordersDate, setOrdersData] = useState<Order[]>([]);
  const { status, printed, receiptNumber, search, clientId } =
    useLocalSearchParams();
  const [filters, setFilters] = useState<OrdersFilter>({
    ...ordersFilterInitialState,
    processed: undefined,
  });
  const { totalUnSeened } = useChatStore();
  const {
    data: orders = {
      data: {
        orders: [],
        ordersMetaData: {} as OrdersMetaData,
      },
      pagesCount: 0,
    },
    isLoading,
    isRefetching,
  } = useOrders({
    ...filters,
    status: status,
    minified: true,
    printed: printed,
    receipt_number: receiptNumber ? receiptNumber + "" : undefined,
    search: search ? search + "" : undefined,
    confirmed: undefined,
    client_id: clientId ? clientId + "" : undefined,
  });

  useEffect(() => {
    if (!orders?.data?.orders) return;

    setOrdersData((prev) => {
      // If it's page 1 or refetch, reset data
      if (filters.page === 1 || !filters.page) {
        return orders.data.orders;
      }

      // Append unique orders only
      const existingIds = new Set(prev.map((o) => o.id));
      const newOrders = orders.data.orders.filter(
        (o) => !existingIds.has(o.id)
      );
      return [...prev, ...newOrders];
    });
  }, [orders, filters.page]);

  const removeFromData = (id: string) => {
    setOrdersData((pre) => pre.filter((o) => o.id !== id));
  };

  const { mutate: printOrders, isPending: isloadingPrint } = useMutation({
    mutationFn: () => {
      const date = new Date();
      return downloadAndOpenPdf(selectedOrder, `فواتير ${date.toDateString()}`);
    },
    onSuccess: () => {
      setSelectedOrder([]);
      setOrdersData([]);
      queryClient.invalidateQueries({
        queryKey: ["orders"],
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

  const { mutate: sendOrders, isPending: isloadingSend } = useMutation({
    mutationFn: () => {
      const date = new Date();
      return sendOrderToShipping(selectedOrder);
    },
    onSuccess: () => {
      setSelectedOrder([]);
      setOrdersData([]);
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      Toast.show({
        type: "success",
        text1: "تم بنجاح ✅",
        text2: "تم الارسال بنجاح 🎉",
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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
      ]}
    >
      <StatusBar translucent backgroundColor={"transparent"} />
      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-right-circle" size={25} color="#fff" />
          </Pressable>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 18 }}
          >
            الطلبات
          </Text>
        </View>
        <View style={styles.navbarItem}>
          <Pressable
            style={styles.navbarItem}
            onPress={() => router.navigate("/barcode")}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#fff" />
          </Pressable>
          <Pressable style={styles.bell} onPress={() => setOpenFilters(true)}>
            <AntDesign name="filter" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
      {isLoading && !isRefetching ? (
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
      {orders.data.orders.length === 0 && !isLoading ? (
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
          <Text style={{ fontSize: 22, marginBottom: 10 }}>☹️</Text>
          <Text style={{ fontSize: 18, fontFamily: "Cairo" }}>
            لا يوجد طلبات
          </Text>
        </View>
      ) : null}
      {printed ? (
        <View
          style={[
            styles.buttonsContainer,
            { marginTop: 10, padding: 10, paddingBottom: 0, direction: "rtl" },
          ]}
        >
          <Pressable
            style={styles.button}
            onPress={() => {
              if (selectedOrder.length > 0) {
                setSelectedOrder([]);
              } else {
                setSelectedOrder(ordersDate.map((o) => o.id));
              }
            }}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>
              تحديد الكل
              {selectedOrder.length > 0
                ? "  ( " + selectedOrder.length + " )"
                : null}
            </Text>
          </Pressable>
          {printed === "false" ? (
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: "#a91101",
                  opacity: selectedOrder.length === 0 ? 0.6 : 1,
                },
              ]}
              disabled={selectedOrder.length === 0 || isloadingPrint}
              onPress={() => {
                printOrders();
              }}
            >
              {isloadingPrint ? (
                <Flow size={40} color="#fff" style={{ margin: "auto" }} />
              ) : (
                <Text style={styles.buttonText}>طباعه</Text>
              )}
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: "#a91101",
                  opacity: selectedOrder.length === 0 ? 0.6 : 1,
                },
              ]}
              disabled={selectedOrder.length === 0 || isloadingSend}
              onPress={() => {
                sendOrders();
              }}
            >
              {isloadingSend ? (
                <Flow size={40} color="#fff" style={{ margin: "auto" }} />
              ) : (
                <Text style={styles.buttonText}>ارسال للشحن</Text>
              )}
            </Pressable>
          )}
        </View>
      ) : null}
      <View style={{ flex: 1, paddingRight: 10, paddingLeft: 10 }}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 150 }}
          data={ordersDate}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OrderItem
              key={item.id}
              order={item}
              checked={selectedOrder.includes(item.id)}
              setSelectedOrder={setSelectedOrder}
              showCheckBox={printed ? true : false}
              removeFromData={removeFromData}
            />
          )}
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            if (filters.page && orders.pagesCount > filters.page) {
              setFilters((pre) => ({
                ...pre,
                page: filters.page ? filters.page + 1 : 1,
              }));
            }
          }}
          ListFooterComponent={
            isRefetching ? (
              <ActivityIndicator size="small" color={"#a91101"} />
            ) : null
          }
          style={{
            flex: 1,
            marginTop: printed ? 10 : 10,
            paddingTop: printed ? 0 : 10,
            direction: "rtl",
          }}
        />
      </View>

      <Filters
        isVisible={openFilters}
        close={() => setOpenFilters(false)}
        orderFilters={filters}
        setFilters={setFilters}
        setOrdersData={setOrdersData}
      />
      {role === "CLIENT" ||
      role === "INQUIRY_EMPLOYEE" ||
      role === "DELIVERY_AGENT" ||
      (role === "CLIENT_ASSISTANT" && permissions?.includes("MESSAGES")) ? (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.navigate("/chats")}
        >
          {totalUnSeened > 0 ? (
            <Text style={styles.totalUnseen}>
              {totalUnSeened > 99 ? "+99" : totalUnSeened}
            </Text>
          ) : null}
          <Ionicons name="chatbubble-ellipses" size={24} color="white" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
