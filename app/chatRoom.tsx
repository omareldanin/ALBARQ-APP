import { APIError } from "@/api";
import { useChat } from "@/hooks/useChat";
import { queryClient } from "@/lib/queryClient";
import { sendMessageService } from "@/services/chat";
import { useAuth } from "@/store/authStore";
import { getSocket } from "@/store/socket";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/chatStyles";
import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import "dayjs/locale/ar"; // Import Arabic locale
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { Flow } from "react-native-animated-spinkit";
import { TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ChatRoom() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const { orderId, receiptNumber } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedViewImage, setSelectedViewImage] = useState<string | null>(
    null
  );
  const { theme } = useThemeStore();

  const {
    data: messages = {
      data: [],
    },
    isLoading,
    refetch,
  } = useChat(orderId.toString());

  useEffect(() => {
    const socket = getSocket();

    socket.emit("joinChat", { orderId, userId: id });

    socket.on("newChatMessage", (data) => {
      refetch();
    });

    return () => {
      socket.off("newChatMessage");
    };
  }, [orderId, id]);

  const { mutate: sendMessage, isPending: isLoadingSend } = useMutation({
    mutationFn: (data: FormData) => {
      return sendMessageService(data);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "تم ارسال رسالتك بنجاح",
        text2: "",
        position: "top",
      });
      setMessage("");
      setSelectedImage(null);
      queryClient.invalidateQueries({
        queryKey: ["messages"],
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const submitMessage = () => {
    if (message.trim() === "" && !selectedImage) {
      return;
    }
    let fm = new FormData();
    fm.append("content", message);
    fm.append("orderId", orderId + "");
    if (selectedImage) {
      fm.append("image", {
        uri: selectedImage,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);
    }
    sendMessage(fm);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          backgroundColor: theme === "dark" ? "#31404e" : "#fff",
        },
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
            {receiptNumber ? receiptNumber : orderId}
          </Text>
        </View>
        <View style={styles.navbarItem}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/orderDetails",
                params: {
                  id: receiptNumber,
                },
              })
            }
          >
            <Feather name="external-link" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>

      <Modal visible={modalVisible} transparent={true}>
        <Pressable
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={{ uri: selectedViewImage + "" }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"padding"}
        keyboardVerticalOffset={0}
      >
        <View style={{ flex: 1, padding: 10 }}>
          <FlatList
            inverted
            contentContainerStyle={{
              paddingBottom: 100,
              paddingTop: 10,
            }}
            data={messages.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.messageContainer,
                  item.createdBy?.id === +id
                    ? { alignItems: "flex-start" }
                    : {},
                ]}
                onLongPress={async () => {
                  if (item.content) {
                    await Clipboard.setStringAsync(item.content);
                    Toast.show({
                      type: "success",
                      text1: "تم نسخ الرساله بنجاح ✅",
                      text2: "",
                      position: "top",
                    });
                  }
                }}
                delayLongPress={500} // 1 second = 1000 ms
              >
                <View
                  style={[
                    styles.message,
                    item.createdBy?.id === +id
                      ? { backgroundColor: "#a91101" }
                      : {
                          backgroundColor:
                            theme === "dark" ? "#15202b" : "#f7f7f7",
                        },
                  ]}
                >
                  {item.image ? (
                    <Pressable
                      onPress={() => {
                        setSelectedViewImage(item.image);
                        setModalVisible(true);
                      }}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={{
                          width: 200,
                          height: 200,
                          objectFit: "contain",
                        }}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ) : (
                    <Text
                      style={[
                        { fontFamily: "Cairo" },
                        item.createdBy?.id === +id
                          ? { color: "#fff" }
                          : { color: theme === "dark" ? "#fff" : "#000" },
                      ]}
                    >
                      {item.content}
                    </Text>
                  )}

                  {item.createdBy?.id === +id ? null : (
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: "Cairo",
                        color: theme === "dark" ? "#ccc" : "grey",
                      }}
                    >
                      {item.createdBy?.name}
                    </Text>
                  )}
                </View>
              </Pressable>
            )}
            onEndReachedThreshold={0.2}
            // onEndReached={() => {
            //   if (pageCounts > page) {
            //     setPage(page + 1);
            //   }
            // }}
            ListFooterComponent={
              isLoading ? (
                <ActivityIndicator size="small" color={"#a91101"} />
              ) : null
            }
            style={{
              flex: 1,
              marginTop: 0,
              direction: "rtl",
            }}
          />
          {selectedImage ? (
            <View style={styles.imageLoader}>
              <Image
                source={{ uri: selectedImage }}
                style={{
                  width: "100%",
                  height: "80%",
                  borderRadius: 8,
                  marginTop: 20,
                  objectFit: "contain",
                }}
              />
              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                <Pressable
                  style={styles.button2}
                  onPress={submitMessage}
                  disabled={isLoadingSend}
                >
                  {isLoadingSend ? (
                    <Flow size={25} color="#fff" style={{ margin: "auto" }} />
                  ) : (
                    <FontAwesome name="send" size={20} color="#fff" />
                  )}
                </Pressable>
                <Pressable
                  style={[styles.button2, { backgroundColor: "grey" }]}
                  onPress={() => setSelectedImage(null)}
                  disabled={isLoadingSend}
                >
                  <Text style={{ color: "#fff" }}>إالغاء</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={[styles.form]}>
              <View style={styles.inputContainer}>
                <Pressable style={styles.camera} onPress={pickImage}>
                  <Entypo name="camera" size={24} color="grey" />
                </Pressable>
                <TextInput
                  placeholder="اكتب رسالتك ....."
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme === "dark" ? "#15202b" : "#fff",
                      borderColor: theme === "dark" ? "#31404e" : "#f7f7f7",
                      color: theme === "dark" ? "#f7f7f7" : "grey",
                    },
                  ]}
                  returnKeyType="next"
                  value={message}
                  onChangeText={setMessage}
                  onFocus={() => {
                    console.log(insets);
                  }}
                  placeholderTextColor={theme === "dark" ? "#ccc" : "grey"}
                />
              </View>
              <Pressable
                style={styles.button}
                onPress={submitMessage}
                disabled={isLoadingSend}
              >
                {isLoadingSend ? (
                  <Flow size={25} color="#fff" style={{ margin: "auto" }} />
                ) : (
                  <FontAwesome name="send" size={20} color="#fff" />
                )}
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
