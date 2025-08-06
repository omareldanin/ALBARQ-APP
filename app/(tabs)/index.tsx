import { AddOptions } from "@/components/AddOptions/AddOptions";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import ConfirmOrder from "@/components/ReceiveOptions/Confirm";
import { ReceiveOptions } from "@/components/ReceiveOptions/ReceiveOptions";
import ImageSlider from "@/components/Slider/Slider";
import { useAuth } from "@/store/authStore";
import { useBannerStore } from "@/store/bannerStore";
import { useBranchStore } from "@/store/branchStore";
import { useChatStore } from "@/store/chatStore";
import { useClientStore } from "@/store/clientStore";
import { useLocationStore } from "@/store/locationStore";
import { useNotificationStore } from "@/store/notification";
import { getSocket } from "@/store/socket";
import { useStatisticsStore } from "@/store/statisticsStore";
import { useStoreStore } from "@/store/storeStore";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/homeStyles";
import { AntDesign, Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const { id, role, permissions } = useAuth();
  const { banners, loading, fetchBanners, refreshBanners } = useBannerStore();
  const { fetchClients, refreshClients } = useClientStore();
  const { fetchLocations, refreshLocations } = useLocationStore();
  const { fetchBranches, refreshBranches } = useBranchStore();
  const { fetchStores, refreshStores } = useStoreStore();
  const [showAddOptions, setShowAddOption] = useState(false);
  const [showReceivingOptions, setShowReceivingOption] = useState(false);
  const { theme } = useThemeStore();

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    statistics,
    loading: loadingStatistics,
    fetchStatistics,
    refreshStatistics,
  } = useStatisticsStore();
  const [showTodayNumber, setShowTodayNumber] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showAddReceiptNumber, setShowAddReceiptNumber] = useState(false);

  const { unSeenCount, fetchNotifications, refreshNotifications } =
    useNotificationStore();

  const { fetchChats, totalUnSeened } = useChatStore();

  useEffect(() => {
    setSearchText("");
    setShowSearch(false);
    fetchStatistics();
    fetchBanners();
    fetchClients();
    fetchLocations();
    fetchBranches();
    fetchStores();
    fetchNotifications(1, 25, false);
    if (
      role === "CLIENT" ||
      role === "INQUIRY_EMPLOYEE" ||
      role === "DELIVERY_AGENT" ||
      role === "CLIENT_ASSISTANT"
    ) {
      fetchChats({ page: 1, size: 30, status: undefined });
    }
  }, [role]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("saveUserId", { userId: id });

    socket.on("newUpdate", () => {
      onRefresh();
    });

    socket.on("newMessage", async (data) => {
      await refreshNotifications();
      await fetchChats({ page: 1, size: 30, status: undefined });
    });
    return () => {
      socket.off("newMessage");
      socket.off("newUpdate");
    };
  }, [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshBanners(); // Re-fetch banners and update Zustand store
      await refreshStatistics(); // Re-fetch banners and update Zustand store
    } finally {
      setRefreshing(false);
      await refreshClients();
      await refreshLocations();
      await refreshBranches();
      await refreshStores();
      await refreshNotifications();
      if (
        role === "CLIENT" ||
        role === "INQUIRY_EMPLOYEE" ||
        role === "DELIVERY_AGENT" ||
        role === "CLIENT_ASSISTANT"
      ) {
        await fetchChats({ page: 1, size: 30, status: undefined });
      }
    }
  }, []);

  if ((loading && !refreshing) || (loadingStatistics && !refreshing)) {
    return <LoadingSpinner />;
  }

  const formatNumber = (value: string | number) => {
    return new Intl.NumberFormat("en-US").format(Number(value));
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={"light-content"}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        style={[
          styles.container,
          { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
        ]}
      >
        {showSearch ? (
          <View style={[styles.searchContainer, { top: insets.top }]}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="ابحث..."
              style={styles.searchInput}
              autoFocus
              placeholderTextColor="#999"
              onSubmitEditing={() => {
                router.push({
                  pathname: "/orders",
                  params: {
                    search: searchText,
                  },
                });
                setSearchText("");
                setShowSearch(false);
              }}
            />
            <Pressable
              onPress={() => {
                setShowSearch(false);
                setSearchText("");
              }}
            >
              <AntDesign name="close" size={22} color="#a91101" />
            </Pressable>
          </View>
        ) : (
          <View style={[styles.navbar, { top: insets.top }]}>
            <Pressable
              style={styles.navbarItem}
              onPress={() => router.navigate("/barcode")}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={24}
                color="#fff"
              />
            </Pressable>
            <View style={styles.navbarItem}>
              <Pressable
                style={styles.bell}
                onPress={() => router.navigate("/notifications")}
              >
                {unSeenCount > 0 ? (
                  <Text style={styles.bellNumber}>
                    {unSeenCount > 99 ? "+99" : unSeenCount}
                  </Text>
                ) : null}
                <FontAwesome6 name="bell" size={22} color="#fff" />
              </Pressable>
              <Pressable onPress={() => setShowSearch(true)}>
                <AntDesign name="search1" size={22} color="#fff" />
              </Pressable>
            </View>
          </View>
        )}

        {banners.length > 0 ? <ImageSlider banners={banners} /> : null}
        {role !== "RECEIVING_AGENT" &&
        role !== "INQUIRY_EMPLOYEE" &&
        role !== "CLIENT_ASSISTANT" ? (
          <>
            <View style={styles.buttonsContainer}>
              <Pressable
                style={[
                  styles.button,
                  showTodayNumber ? styles.active : null,
                  {
                    backgroundColor: theme === "dark" ? "#15202b" : "#fff",
                    borderColor: showTodayNumber
                      ? "#a91101"
                      : theme === "dark"
                        ? "grey"
                        : "#f7f7f7",
                  },
                ]}
                onPress={() => setShowTodayNumber(true)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    showTodayNumber ? styles.active : null,
                    { backgroundColor: theme === "dark" ? "#15202b" : "#fff" },
                  ]}
                  allowFontScaling={false}
                >
                  طلبات اليوم
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  !showTodayNumber ? styles.active : null,
                  {
                    backgroundColor: theme === "dark" ? "#15202b" : "#fff",
                    borderColor: !showTodayNumber
                      ? "#a91101"
                      : theme === "dark"
                        ? "grey"
                        : "#f7f7f7",
                  },
                ]}
                onPress={() => setShowTodayNumber(false)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    !showTodayNumber ? styles.active : null,
                    { backgroundColor: theme === "dark" ? "#15202b" : "#fff" },
                  ]}
                  allowFontScaling={false}
                >
                  المبلغ الصافي
                </Text>
              </Pressable>
            </View>
          </>
        ) : null}
        {role !== "INQUIRY_EMPLOYEE" ? (
          <View
            style={[
              styles.controlsContainers,
              { backgroundColor: theme === "dark" ? "#a9110170" : "#a9110121" },
            ]}
          >
            {role !== "RECEIVING_AGENT" &&
            role !== "INQUIRY_EMPLOYEE" &&
            role !== "CLIENT_ASSISTANT" ? (
              <View style={styles.numbers}>
                <View style={styles.number}>
                  <Feather name="box" size={26} color="#A91101" />
                  <Text
                    style={[
                      styles.numberText,
                      { color: theme === "dark" ? "#fff" : "#000" },
                    ]}
                    allowFontScaling={false}
                  >
                    {showTodayNumber
                      ? formatNumber(
                          statistics?.todayOrdersStatistics.count + ""
                        )
                      : formatNumber(
                          statistics?.allOrdersStatisticsWithoutClientReport
                            .count + ""
                        )}{" "}
                    طلبات
                  </Text>
                </View>
                <View style={styles.number}>
                  <FontAwesome6
                    name="money-bill-trend-up"
                    size={24}
                    color="#A91101"
                  />
                  <Text
                    style={[
                      styles.numberText,
                      { color: theme === "dark" ? "#fff" : "#000" },
                    ]}
                    allowFontScaling={false}
                  >
                    {showTodayNumber
                      ? formatNumber(
                          statistics?.todayOrdersStatistics.totalCost + ""
                        )
                      : formatNumber(
                          statistics?.allOrdersStatisticsWithoutClientReport
                            .totalCost + ""
                        )}{" "}
                    دينار
                  </Text>
                </View>
              </View>
            ) : null}
            {role === "RECEIVING_AGENT" ? (
              <View style={[styles.controls]}>
                <Pressable
                  style={[styles.buttonContainer, { marginVertical: 5 }]}
                  onPress={() => setShowReceivingOption(true)}
                >
                  <View style={styles.icon}>
                    <MaterialCommunityIcons
                      name="qrcode-scan"
                      size={24}
                      color="#a91101"
                    />
                  </View>
                  <Text
                    style={[
                      styles.btnText,
                      {
                        width: 100,
                        fontSize: 15,
                        color: theme === "dark" ? "#fff" : "#000",
                      },
                    ]}
                    allowFontScaling={false}
                  >
                    إستلام شحنات
                  </Text>
                </Pressable>
              </View>
            ) : role === "CLIENT" || role === "CLIENT_ASSISTANT" ? (
              <View style={styles.controls}>
                {role === "CLIENT" ||
                (role === "CLIENT_ASSISTANT" &&
                  permissions?.includes("ADD_ORDER")) ? (
                  <Pressable
                    style={styles.buttonContainer}
                    onPress={() => setShowAddOption(true)}
                  >
                    <View style={styles.icon}>
                      <Image
                        source={require("../../assets/images/add.png")}
                        resizeMode="contain"
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                    </View>
                    <Text
                      style={[
                        styles.btnText,
                        { color: theme === "dark" ? "#fff" : "#000" },
                      ]}
                      allowFontScaling={false}
                    >
                      إضافه شحنه
                    </Text>
                  </Pressable>
                ) : null}
                {role === "CLIENT" ||
                (role === "CLIENT_ASSISTANT" &&
                  permissions?.includes("PRINT_ORDER")) ? (
                  <Pressable
                    style={styles.buttonContainer}
                    onPress={() =>
                      router.push({
                        pathname: "/orders",
                        params: {
                          status: "REGISTERED",
                          printed: "false",
                        },
                      })
                    }
                  >
                    <View style={styles.icon}>
                      <Image
                        source={require("../../assets/images/printer.png")}
                        resizeMode="contain"
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                    </View>
                    <Text
                      style={[
                        styles.btnText,
                        { color: theme === "dark" ? "#fff" : "#000" },
                      ]}
                      allowFontScaling={false}
                    >
                      طباعه
                    </Text>
                  </Pressable>
                ) : null}
                {role === "CLIENT" ||
                (role === "CLIENT_ASSISTANT" &&
                  permissions?.includes("SEND_ORDER")) ? (
                  <Pressable
                    style={styles.buttonContainer}
                    onPress={() =>
                      router.push({
                        pathname: "/orders",
                        params: {
                          status: "REGISTERED",
                          printed: "true",
                        },
                      })
                    }
                  >
                    <View style={styles.icon}>
                      <Image
                        source={require("../../assets/images/delivery-truck.png")}
                        resizeMode="contain"
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                    </View>
                    <Text
                      style={[
                        styles.btnText,
                        { color: theme === "dark" ? "#fff" : "#000" },
                      ]}
                      allowFontScaling={false}
                    >
                      إرسال للشحن
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}
            {role === "DELIVERY_AGENT" ? (
              <View style={styles.controls}>
                <Pressable style={styles.buttonContainer}>
                  <Text
                    style={[
                      styles.btnText,
                      {
                        width: "auto",
                        fontSize: 12,
                        color: theme === "dark" ? "#fff" : "#000",
                      },
                    ]}
                    allowFontScaling={false}
                  >
                    صافي المندوب
                  </Text>
                  <Text
                    style={[
                      styles.btnText,
                      {
                        fontSize: 12,
                        fontFamily: "CairoBold",
                        color: theme === "dark" ? "#fff" : "#000",
                      },
                    ]}
                  >
                    {formatNumber(
                      statistics?.allOrdersStatisticsWithoutDeliveryReport
                        .deliveryCost + ""
                    )}
                  </Text>
                </Pressable>
                <Pressable style={styles.buttonContainer}>
                  <Text
                    style={[
                      styles.btnText,
                      {
                        width: "auto",
                        fontSize: 12,
                        color: theme === "dark" ? "#fff" : "#000",
                      },
                    ]}
                    allowFontScaling={false}
                  >
                    صافي الفرع
                  </Text>
                  <Text
                    style={[
                      styles.btnText,
                      {
                        fontSize: 12,
                        fontFamily: "CairoBold",
                        color: theme === "dark" ? "#fff" : "#000",
                      },
                    ]}
                    allowFontScaling={false}
                  >
                    {(
                      (statistics?.allOrdersStatisticsWithoutDeliveryReport
                        ?.totalCost ?? 0) -
                      (statistics?.allOrdersStatisticsWithoutDeliveryReport
                        ?.deliveryCost ?? 0)
                    ).toLocaleString()}
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        ) : null}
        <View style={styles.statistics}>
          {statistics?.ordersStatisticsByStatus.map((status) => (
            <Pressable
              key={status.status}
              style={[
                styles.item,
                {
                  backgroundColor: theme === "dark" ? "#15202b" : "#fff",
                  borderColor: theme === "dark" ? "#31404e" : "#f7f7f7",
                  shadowColor: theme === "dark" ? "#000" : "#ccc",
                },
              ]}
              onPress={() => {
                if (role === "RECEIVING_AGENT") {
                  router.push({
                    pathname: "/statusClients",
                    params: {
                      status: status.status,
                    },
                  });
                } else if (status.inside) {
                  router.push({
                    pathname: "/statusStatistics",
                    params: {
                      status: status.status,
                    },
                  });
                } else {
                  router.push({
                    pathname: "/orders",
                    params: {
                      status: status.status,
                    },
                  });
                }
              }}
            >
              <Image
                source={{ uri: `${status.icon}?v=1` }}
                resizeMode="contain"
                style={styles.statusIcon}
              />
              <Text
                style={[
                  styles.statusCount,
                  { color: theme === "dark" ? "#fff" : "#000" },
                ]}
              >
                {formatNumber(status.count + "")}
              </Text>
              <View style={styles.statusName}>
                <Text
                  style={[
                    styles.statusNameText,
                    { color: theme === "dark" ? "#fff" : "#000" },
                  ]}
                >
                  {status.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <AddOptions
        isVisible={showAddOptions}
        close={() => setShowAddOption(false)}
      />

      <ReceiveOptions
        isVisible={showReceivingOptions}
        close={() => setShowReceivingOption(false)}
        openAdd={() => setShowAddReceiptNumber(true)}
      />

      <ConfirmOrder
        visible={showAddReceiptNumber}
        onClose={() => setShowAddReceiptNumber(false)}
        onCancel={() => close()}
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
