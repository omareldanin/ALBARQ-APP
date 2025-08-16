import { useNotificationStore } from "@/store/notification";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/ordersStyles";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
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
  const [page, setPage] = useState(1);
  const [unRead, setUnRead] = useState(false);
  const {
    markOneAsSeen,
    fetchNotifications,
    allNotifications,
    pagesCount,
    loading,
    markAllAsSeen,
  } = useNotificationStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    fetchNotifications(page, 25, unRead);
  }, [page, fetchNotifications, unRead]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
      ]}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-right-circle" size={25} color="#fff" />
          </Pressable>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 18 }}>
            الاشعارات
          </Text>
        </View>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => markAllAsSeen()}>
            <FontAwesome5 name="check-double" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
      <View
        style={[
          styles.buttonsContainer,
          { paddingHorizontal: 10, direction: "rtl" },
        ]}>
        <Pressable
          style={[
            styles.filterButton,
            !unRead ? styles.active : null,
            {
              backgroundColor: theme === "dark" ? "#15202b" : "#fff",
              borderColor: !unRead
                ? "#a91101"
                : theme === "dark"
                  ? "grey"
                  : "#f7f7f7",
            },
          ]}
          onPress={() => {
            setPage(1);
            setUnRead(false);
          }}>
          <Text
            style={[
              styles.buttonText,
              {
                backgroundColor: theme === "dark" ? "#15202b" : "#fff",
                color: "grey",
              },
              !unRead ? styles.active : null,
            ]}>
            الكل
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            unRead ? styles.active : null,
            {
              backgroundColor: theme === "dark" ? "#15202b" : "#fff",
              borderColor: unRead
                ? "#a91101"
                : theme === "dark"
                  ? "grey"
                  : "#f7f7f7",
            },
          ]}
          onPress={() => {
            setPage(1);

            setUnRead(true);
          }}>
          <Text
            style={[
              styles.buttonText,
              {
                backgroundColor: theme === "dark" ? "#15202b" : "#fff",
                color: "grey",
              },
              unRead ? styles.active : null,
            ]}>
            غير مقروء
          </Text>
        </Pressable>
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          data={allNotifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.notification,
                {
                  borderColor: theme === "dark" ? "#31404e" : "#f7f7f7",
                  backgroundColor: theme === "dark" ? "#a9110170" : "#a9110120",
                },
              ]}
              onPress={() => {
                if (!item.seen) {
                  markOneAsSeen(item.id);
                }
                if (item.orderId) {
                  router.push({
                    pathname: "/orderDetails",
                    params: {
                      id: item.orderId,
                    },
                  });
                }
              }}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#fff" : "#000",
                  textAlign: "left",
                }}>
                {item.title}
              </Text>
              {!item.seen ? <Text style={styles.seen}></Text> : null}
            </Pressable>
          )}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (page < pagesCount) {
              setPage((prev) => prev + 1);
            }
          }}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator size="small" color={"#a91101"} />
            ) : null
          }
          style={{
            flex: 1,
            marginTop: 0,
            direction: "rtl",
          }}
        />
      </View>
    </View>
  );
}
