import { useChatStore } from "@/store/chatStore";
import { getSocket } from "@/store/socket";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/chatStyles";
import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/ar"; // Import Arabic locale
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

dayjs.extend(relativeTime);
dayjs.locale("ar"); // Set locale globally to Arabic

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [unRead, setUnRead] = useState(false);
  const { chats, fetchChats, refreshChats, loading, pageCounts, markChatSeen } =
    useChatStore();

  useEffect(() => {
    fetchChats({
      page,
      size: 30,
      status: undefined,
      unRead: unRead ? "true" : undefined,
    });
  }, [page, unRead]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("newMessage", (data) => {
      refreshChats({ page, size: 30, status: undefined });
    });

    // return () => {
    //   socket.off("newMessage");
    // };
  }, []);

  const formatTimeAgo = (createdAt: Date | string) => {
    return dayjs(createdAt).fromNow();
  };

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
            الرسائل
          </Text>
        </View>
        <View style={styles.navbarItem}></View>
      </View>
      <View style={styles.buttonsContainer}>
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
          onPress={() => setUnRead(false)}
        >
          <Text
            style={[
              styles.buttonText,
              !unRead ? styles.active : null,
              { backgroundColor: theme === "dark" ? "#15202b" : "#fff" },
            ]}
          >
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
          onPress={() => setUnRead(true)}
        >
          <Text
            style={[
              styles.buttonText,
              unRead ? styles.active : null,
              { backgroundColor: theme === "dark" ? "#15202b" : "#fff" },
            ]}
          >
            غير مقروء
          </Text>
        </Pressable>
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 150 }}
          data={chats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.chatContainer,
                { borderColor: theme === "dark" ? "#15202b" : "#f7f7f7" },
              ]}
              onPress={() => {
                markChatSeen(item.id);
                router.push({
                  pathname: "/chatRoom",
                  params: {
                    receiptNumber: item.receiptNumber,
                    orderId: item.orderId,
                  },
                });
              }}
            >
              <View style={styles.chat}>
                <View style={styles.icon}>
                  <Feather name="box" size={24} color="#fff" />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: "CairoBold",
                      color: theme === "dark" ? "#fff" : "#000",
                    }}
                  >
                    {item.receiptNumber ? item.receiptNumber : item.orderId}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Cairo",
                      color: theme === "dark" ? "#ccc" : "grey",
                      fontSize: 12,
                    }}
                  >
                    {item.lastMessage.image
                      ? "صوره"
                      : item.lastMessage.content.length > 30
                        ? item.lastMessage.content.slice(0, 30) + "..."
                        : item.lastMessage.content}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end", gap: 5 }}>
                {item.unseenMessages > 0 ? (
                  <View
                    style={{
                      backgroundColor: "red",
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      alignItems: "center",
                      paddingTop: 3,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 10 }}>
                      {item.unseenMessages}
                    </Text>
                  </View>
                ) : null}
                <Text
                  style={{
                    fontFamily: "Cairo",
                    color: theme === "dark" ? "#ccc" : "grey",
                    fontSize: 10,
                  }}
                >
                  {formatTimeAgo(item.lastMessage.createdAt)}
                </Text>
              </View>
            </Pressable>
          )}
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            if (pageCounts > page) {
              setPage(page + 1);
            }
          }}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator size="small" color={"#a91101"} />
            ) : null
          }
          style={{
            direction: "rtl",
            flex: 1,
            marginTop: 0,
          }}
        />
      </View>
    </View>
  );
}
