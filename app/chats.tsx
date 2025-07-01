import { useAuth } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { getSocket } from "@/store/socket";
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
  const { id } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { chats, fetchChats, refreshChats, loading, pageCounts, markChatSeen } =
    useChatStore();

  useEffect(() => {
    fetchChats({ page, size: 30, status: undefined });
  }, [page]);

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
    <View style={styles.container}>
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
      <FlatList
        contentContainerStyle={{ paddingBottom: 150 }}
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.chatContainer}
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
                <Text style={{ fontFamily: "CairoBold" }}>
                  {item.receiptNumber ? item.receiptNumber : item.orderId}
                </Text>
                <Text
                  style={{ fontFamily: "Cairo", color: "grey", fontSize: 12 }}
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
                style={{ fontFamily: "Cairo", color: "grey", fontSize: 10 }}
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
          loading ? <ActivityIndicator size="small" color={"#a91101"} /> : null
        }
        style={{
          flex: 1,
          marginTop: 0,
          direction: "rtl",
          padding: 10,
        }}
      />
    </View>
  );
}
