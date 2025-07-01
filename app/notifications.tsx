import { useNotifications } from "@/hooks/useNotification";
import { Notifications } from "@/services/notification";
import { useNotificationStore } from "@/store/notification";
import styles from "@/styles/ordersStyles";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notificationDate, setnotificationDate] = useState<Notifications[]>([]);
  const [page, setPage] = useState(1);
  const { markAllAsSeen } = useNotificationStore();
  const {
    data: notifications = {
      data: [],
      pagesCount: 0,
    },
    isRefetching,
  } = useNotifications(page);

  useEffect(() => {
    if (page === 1) {
      // New fetch or refresh — replace data
      setnotificationDate(notifications.data);
      markAllAsSeen();
    } else {
      // Load more — append data
      setnotificationDate((prev) => [...prev, ...notifications.data]);
    }
  }, [notifications, page]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-right-circle" size={25} color="#fff" />
        </Pressable>
        <View style={styles.navbarItem}>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 18 }}
          >
            الاشعارات
          </Text>
        </View>
        <View style={styles.navbarItem}></View>
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        data={notificationDate}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.notification}
            onPress={() => {
              if (item.orderId) {
                router.push({
                  pathname: "/orderDetails",
                  params: {
                    id: item.orderId,
                  },
                });
              }
            }}
          >
            <Text style={{ fontFamily: "Cairo", fontSize: 13 }}>
              {item.title}
            </Text>
          </Pressable>
        )}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (page < notifications.pagesCount && !isRefetching) {
            setPage((prev) => prev + 1);
          }
        }}
        ListFooterComponent={
          isRefetching ? (
            <ActivityIndicator size="small" color={"#a91101"} />
          ) : null
        }
        style={{
          flex: 1,
          marginTop: 0,
          paddingTop: 10,
          direction: "rtl",
          padding: 10,
        }}
      />
    </View>
  );
}
