import ConfirmDialog from "@/components/Confirm/Confirm";
import CloseTicket from "@/components/Ticket/closeTicket";
import SendResponse from "@/components/Ticket/ConfirmTake";
import ForwardTicket from "@/components/Ticket/forwardTicket";
import { useGetOneTicket, useTakeTicket } from "@/hooks/useTicket";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import {
  orderStatusArabicNames,
  orderStatusColors,
} from "@/lib/orderStatusArabicNames";
import { orderSecondaryStatusArabicNames } from "@/services/orderSecondaryStatusArabicNames";
import { useAuth } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/tickets";
import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Fold } from "react-native-animated-spinkit";
import { RefreshControl } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TicketDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { name, role } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirmTake, setShowConfirmTake] = useState(false);
  const [showSendRes, setShowSendRes] = useState(false);
  const [showforwardTicket, setShowForward] = useState(false);
  const [showCLoseTicket, setShowCLose] = useState(false);
  const { mutate: takeTicket, isPending: isLoadingTake } = useTakeTicket();
  const { theme } = useThemeStore();

  const { data: ticketRes, isLoading, isError, refetch } = useGetOneTicket(+id);

  const isValidIraqNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, ""); // حذف أي رموز غير أرقام
    return /^07[0-9]{9}$/.test(cleaned);
  };

  const formatToWhatsAppLink = (phone: string, text: string): string | null => {
    if (!isValidIraqNumber(phone)) return null;
    const cleaned = phone.replace(/\D/g, "");
    const iraqNumber = "964" + cleaned.substring(1); // إزالة 0 الأولى وإضافة 964
    return `https://wa.me/${iraqNumber}?text=${encodeURIComponent(text)}`;
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
      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-right-circle" size={25} color="#fff" />
          </Pressable>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 17 }}
          >
            تذكرة رقم {"  -  " + ticketRes?.data?.id}
          </Text>
        </View>
        <View style={styles.navbarItem}>
          <Pressable
            style={{
              width: 35,
              height: 35,
              backgroundColor: "#fff",
              borderRadius: 17.5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {ticketRes?.data?.closed ? (
              <Entypo name="lock" size={20} color="red" />
            ) : (
              <Entypo name="lock-open" size={20} color="green" />
            )}
          </Pressable>
        </View>
      </View>
      {isLoading ? (
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
      ) : isError ? (
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
          <Text>حدث خطأ ما</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.orderDetails}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                refetch();
              }}
            />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View
            style={[
              styles.orderHead,
              {
                borderColor: theme === "dark" ? "#15202b" : "#f7f7f7",
                borderBottomWidth: 1,
                marginBottom: 10,
              },
            ]}
          >
            <View style={[styles.orderItem, { flexDirection: "column" }]}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#ccc" : "grey",
                  marginBottom: 10,
                }}
              >
                وصف المشكله
              </Text>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 12,
                  color: theme === "dark" ? "#fff" : "#000",
                }}
              >
                {ticketRes?.data?.content}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.orderHead,
              {
                borderColor: theme === "dark" ? "#15202b" : "#f7f7f7",
                borderBottomWidth: 1,
                marginBottom: 10,
              },
            ]}
          >
            <View style={styles.orderItem}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#ccc" : "grey",
                }}
              >
                تم الانشاء بواسطه :
              </Text>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 13,
                  color: theme === "dark" ? "#fff" : "#000",
                }}
              >
                {ticketRes?.data?.createdBy.name}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#ccc" : "grey",
                }}
              >
                موظف الدعم :
              </Text>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 13,
                  color: ticketRes?.data?.Employee ? "#000" : "red",
                }}
              >
                {ticketRes?.data?.Employee
                  ? ticketRes?.data.Employee.user.name
                  : "غير مستلمه"}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.orderHead,
              {
                borderColor: theme === "dark" ? "#15202b" : "#f7f7f7",
                borderBottomWidth: 1,
                marginBottom: 10,
              },
            ]}
          >
            <View style={styles.orderItem}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#ccc" : "grey",
                }}
              >
                رقم الوصل :
              </Text>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 13,
                  color: theme === "dark" ? "#fff" : "#000",
                }}
              >
                {ticketRes?.data?.Order.receiptNumber}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#ccc" : "grey",
                }}
              >
                الحاله :
              </Text>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 11,
                  color:
                    orderStatusColors[
                      ticketRes?.data?.Order
                        .status as keyof typeof orderStatusColors
                    ],
                }}
              >
                {ticketRes?.data?.Order?.status
                  ? orderStatusArabicNames[ticketRes?.data?.Order?.status]
                  : ""}
                {ticketRes?.data?.Order.secondaryStatus
                  ? " - " +
                    orderSecondaryStatusArabicNames[
                      ticketRes?.data?.Order.secondaryStatus
                    ]
                  : ""}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#ccc" : "grey",
                }}
              >
                العنوان :
              </Text>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 12,
                  color: theme === "dark" ? "#fff" : "#000",
                }}
              >
                {governorateArabicNames[
                  ticketRes?.data?.Order
                    .governorate as keyof typeof governorateArabicNames
                ] +
                  " - " +
                  ticketRes?.data?.Order.location?.name}
                {ticketRes?.data?.Order.recipientAddress
                  ? " - " + ticketRes?.data.Order.recipientAddress
                  : null}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#ccc" : "grey",
                }}
              >
                الفرع :
              </Text>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 12,
                  color: theme === "dark" ? "#fff" : "#000",
                }}
              >
                {ticketRes?.data?.Order.branch.name}
              </Text>
            </View>
          </View>
          {role === "DELIVERY_AGENT" &&
          !ticketRes?.data?.Order.client?.showNumbers ? null : (
            <>
              <View
                style={[
                  styles.orderItem,
                  ticketRes?.data?.Order.client?.user.phone
                    ? {}
                    : {
                        borderColor: theme === "dark" ? "#15202b" : "#f7f7f7",
                        borderBottomWidth: 1,
                        paddingBottom: 12,
                      },
                ]}
              >
                <Text
                  style={{
                    fontFamily: "Cairo",
                    fontSize: 13,
                    color: theme === "dark" ? "#ccc" : "grey",
                  }}
                >
                  العميل :
                </Text>
                <Text
                  style={{
                    fontFamily: "CairoBold",
                    fontSize: 11,
                    color: theme === "dark" ? "#fff" : "#000",
                  }}
                >
                  {ticketRes?.data?.Order?.client?.user.name}
                </Text>
              </View>
              <View
                style={[
                  styles.orderItem,
                  {
                    borderColor: theme === "dark" ? "#15202b" : "#f7f7f7",
                    borderBottomWidth: 1,
                    paddingBottom: 12,
                  },
                ]}
              >
                <Text
                  style={{
                    fontFamily: "Cairo",
                    fontSize: 13,
                    color: theme === "dark" ? "#ccc" : "grey",
                  }}
                >
                  رقم الهاتف :
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "CairoBold",
                      fontSize: 13,
                      color: theme === "dark" ? "#fff" : "#000",
                    }}
                  >
                    {ticketRes?.data?.Order.client?.user.phone}
                  </Text>
                  <Pressable
                    onPress={() =>
                      Linking.openURL(
                        `tel:${ticketRes?.data?.Order?.client?.user.phone}`
                      )
                    }
                  >
                    <Feather
                      name="phone"
                      size={20}
                      color={theme === "dark" ? "#fff" : "grey"}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      const message = `مرحبا 👋
معك ${name} من شركه التوصيل
بخصوص الطلب رقم ${ticketRes?.data?.Order.receiptNumber}
الحاله : ${orderStatusArabicNames[ticketRes?.data?.Order.status || "DELIVERED"]}
الفرع : ${ticketRes?.data?.Order.branch?.name}`;
                      Linking.openURL(
                        formatToWhatsAppLink(
                          ticketRes?.data?.Order.client?.user.phone || "",
                          message
                        ) || ""
                      );
                    }}
                  >
                    <FontAwesome
                      name="whatsapp"
                      size={22}
                      color={theme === "dark" ? "#fff" : "grey"}
                    />
                  </Pressable>
                </View>
              </View>
            </>
          )}

          {role === "CLIENT" &&
          !ticketRes?.data?.Order.client?.showDeliveryNumber ? null : ticketRes
              ?.data?.Order.deliveryAgent ? (
            <>
              <View
                style={[
                  styles.orderItem,
                  ticketRes?.data.Order.deliveryAgent?.user.phone
                    ? {}
                    : {
                        borderColor: "#f7f7f7",
                        borderBottomWidth: 1,
                        paddingBottom: 12,
                      },
                ]}
              >
                <Text
                  style={{
                    fontFamily: "Cairo",
                    fontSize: 13,
                    color: theme === "dark" ? "#ccc" : "grey",
                  }}
                >
                  المندوب :
                </Text>
                <Text
                  style={{
                    fontFamily: "CairoBold",
                    fontSize: 11,
                  }}
                >
                  {ticketRes?.data.Order.deliveryAgent?.user.name}
                </Text>
              </View>
              <View
                style={[
                  styles.orderItem,
                  {
                    borderColor: "#f7f7f7",
                    borderBottomWidth: 1,
                    paddingBottom: 12,
                  },
                ]}
              >
                <Text
                  style={{
                    fontFamily: "Cairo",
                    fontSize: 13,
                    color: theme === "dark" ? "#ccc" : "grey",
                  }}
                >
                  رقم الهاتف :
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "CairoBold",
                      fontSize: 13,
                    }}
                  >
                    {ticketRes?.data.Order.deliveryAgent?.user.phone}
                  </Text>
                  <Pressable
                    onPress={() =>
                      Linking.openURL(
                        `tel:${ticketRes?.data.Order.deliveryAgent?.user.phone}`
                      )
                    }
                  >
                    <Feather
                      name="phone"
                      size={20}
                      color={theme === "dark" ? "#fff" : "grey"}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      const message = `مرحبا 👋
معك ${name} من شركه التوصيل
بخصوص الطلب رقم ${ticketRes?.data?.Order.receiptNumber}
الحاله : ${orderStatusArabicNames[ticketRes?.data?.Order.status || "DELIVERED"]}
الفرع : ${ticketRes?.data?.Order.branch?.name}`;
                      Linking.openURL(
                        formatToWhatsAppLink(
                          ticketRes?.data.Order.deliveryAgent?.user.phone || "",
                          message
                        ) || ""
                      );
                    }}
                  >
                    <FontAwesome
                      name="whatsapp"
                      size={22}
                      color={theme === "dark" ? "#fff" : "grey"}
                    />
                  </Pressable>
                </View>
              </View>
            </>
          ) : null}
          <View>
            <Text
              style={{
                fontFamily: "CairoBold",
                color: "#a91101",
                fontSize: 16,
                direction: "rtl",
                marginBottom: 15,
              }}
            >
              الردود
            </Text>
          </View>
          {ticketRes?.data.ticketResponse.map((res) => (
            <View
              style={{
                direction: "rtl",
                marginBottom: 10,
                borderColor: theme === "dark" ? "#15202b" : "#f7f7f7",
                borderBottomWidth: 1,
                paddingBottom: 10,
              }}
              key={res.id}
            >
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 14,
                  marginBottom: 5,
                  color: theme === "dark" ? "#fff" : "#000",
                }}
              >
                {res.content}
              </Text>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 10,
                  color: theme === "dark" ? "#ccc" : "grey",
                }}
              >
                بواسطه : {res.createdBy.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
      {ticketRes?.data.closed ? null : (
        <View
          style={[
            styles.total,
            {
              borderColor: theme === "dark" ? "#15202b" : "#f7f7f7",
            },
          ]}
        >
          <View style={[styles.buttonsContainer, { marginBottom: 5 }]}>
            {role === "INQUIRY_EMPLOYEE" ? (
              <Pressable
                style={{
                  backgroundColor: "#3bb2f6",
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  maxWidth: "49%",
                  opacity: ticketRes?.data.Employee ? 0.5 : 1,
                }}
                disabled={ticketRes?.data.Employee ? true : false}
                onPress={() => setShowConfirmTake(true)}
              >
                {isLoadingTake ? (
                  <ActivityIndicator size={"small"} color={"#fff"} />
                ) : (
                  <Text
                    style={[styles.buttonText, { color: "#fff", fontSize: 15 }]}
                  >
                    استلام
                  </Text>
                )}
              </Pressable>
            ) : null}
            <Pressable
              style={{
                backgroundColor: "#a855f7",
                padding: 10,
                borderRadius: 5,
                flex: 1,
                opacity: ticketRes?.data.Employee ? 1 : 0.5,
              }}
              disabled={ticketRes?.data.Employee ? false : true}
              onPress={() => setShowSendRes(true)}
            >
              <Text
                style={[styles.buttonText, { color: "#fff", fontSize: 15 }]}
              >
                رد
              </Text>
            </Pressable>
          </View>
          {role === "INQUIRY_EMPLOYEE" ? (
            <View style={styles.buttonsContainer}>
              <Pressable
                style={{
                  backgroundColor: "#f59e0b",
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  opacity: ticketRes?.data.Employee ? 1 : 0.5,
                }}
                disabled={ticketRes?.data.Employee ? false : true}
                onPress={() => setShowForward(true)}
              >
                <Text
                  style={[styles.buttonText, { color: "#fff", fontSize: 15 }]}
                >
                  تحويل
                </Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  opacity: ticketRes?.data.Employee ? 1 : 0.5,
                }}
                disabled={ticketRes?.data.Employee ? false : true}
                onPress={() => setShowCLose(true)}
              >
                <Text
                  style={[styles.buttonText, { color: "#fff", fontSize: 15 }]}
                >
                  اغلاق
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      )}
      <ConfirmDialog
        visible={showConfirmTake}
        title="استلام التذكره"
        message="هل انت متأكد من استلام التذكره؟"
        onConfirm={() => {
          takeTicket(ticketRes?.data.id);
          setShowConfirmTake(false);
        }}
        onCancel={() => setShowConfirmTake(false)}
      />
      <SendResponse
        visible={showSendRes}
        onCancel={() => setShowSendRes(false)}
        id={ticketRes?.data.id}
      />
      <ForwardTicket
        visible={showforwardTicket}
        onCancel={() => setShowForward(false)}
        id={ticketRes?.data.id}
      />
      <CloseTicket
        visible={showCLoseTicket}
        id={ticketRes?.data.id}
        onCancel={() => setShowCLose(false)}
      />
    </View>
  );
}
