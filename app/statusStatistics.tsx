import { useAuth } from "@/store/authStore";
import { getSocket } from "@/store/socket";
import { useStatusStatisticsStore } from "@/store/statusStatisticsStore";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/ordersStyles";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  StatusBar,
  Text,
  View,
} from "react-native";
import { Fold } from "react-native-animated-spinkit";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StatusStatics() {
  const { id } = useAuth();
  const { status } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useThemeStore();
  const {
    statusStatistics,
    loading: loadingStatistics,
    fetchStatistics,
    refreshStatistics,
  } = useStatusStatisticsStore();

  useEffect(() => {
    if (status) {
      fetchStatistics(status.toString());
    }
  }, [status]);

  const formatNumber = (value: string | number) => {
    return new Intl.NumberFormat("en-US").format(Number(value));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshStatistics(status.toString()); // Re-fetch banners and update Zustand store
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("saveUserId", { userId: id });

    socket.on("newUpdate", () => {
      onRefresh();
    });

    return () => {
      socket.off("newUpdate");
    };
  }, [id]);

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
            الحالات
          </Text>
        </View>
        <View style={styles.navbarItem}>
          <Pressable
            style={styles.navbarItem}
            onPress={() => router.navigate("/barcode")}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
      {loadingStatistics && !refreshing ? (
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
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{
            marginTop: 15,
            direction: "rtl",
          }}
        >
          {statusStatistics?.map((status) => (
            <Pressable
              key={status.status}
              style={[
                styles.item2,
                {
                  backgroundColor: theme === "dark" ? "#15202b" : "#fff",
                  borderColor: theme === "dark" ? "#31404e" : "#f7f7f7",
                },
              ]}
              onPress={() => {
                router.push({
                  pathname: "/orders",
                  params: {
                    status: status.status,
                  },
                });
              }}
            >
              <Image
                source={{ uri: `${status.icon}?v=1` }}
                resizeMode="contain"
                style={styles.statusIcon2}
              />

              <View style={styles.statusName}>
                <Text
                  style={[
                    styles.statusNameText,
                    { fontSize: 13, color: theme === "dark" ? "#fff" : "#000" },
                  ]}
                >
                  {status.name}
                </Text>
              </View>
              <Text
                style={[
                  styles.statusCount,
                  { color: theme === "dark" ? "#fff" : "#000" },
                ]}
              >
                {formatNumber(status.count + "")}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
