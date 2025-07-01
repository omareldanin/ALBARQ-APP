import { ChangeProcessingStatus } from "@/components/ChangeStatus/ChangeProcessingStatus";
import { ChangeStatus } from "@/components/ChangeStatus/ChangeStatus";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { orderStatusColors } from "@/lib/orderStatusArabicNames";
import { useAuth } from "@/store/authStore";
import styles from "@/styles/ordersStyles";
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Fold } from "react-native-animated-spinkit";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StatusStatics() {
  const [showDetails, setShowDetails] = useState(true);
  const [showChangeModel, setShowChangeModel] = useState(false);
  const [showChangeProcessing, setShowChangeProcessing] = useState(false);
  const { name, role } = useAuth();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: order, isLoading } = useOrderDetails(id.toString());

  const formatNumber = (value: string | undefined) => {
    return new Intl.NumberFormat("en-US").format(Number(value));
  };

  const formatDate = (value: Date | string | undefined) => {
    if (!value) return "";

    const date = new Date(value);

    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(date);
  };

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
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar translucent backgroundColor={"transparent"} />

      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-right-circle" size={25} color="#fff" />
          </Pressable>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 17 }}
          >
            طلب رقم {"  -  " + order?.data.receiptNumber}
          </Text>
        </View>
        <View style={styles.navbarItem}>
          {role === "INQUIRY_EMPLOYEE" ? (
            <Pressable
              style={{
                width: 35,
                height: 35,
                backgroundColor: "#fff",
                borderRadius: 17.5,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setShowChangeProcessing(true)}
            >
              {order?.data.processingStatus === "not_processed" ? (
                <Ionicons name="close-sharp" size={24} color="red" />
              ) : order?.data.processingStatus === "processed" ? (
                <FontAwesome5 name="check" size={18} color="grey" />
              ) : (
                <FontAwesome5 name="check-double" size={20} color="green" />
              )}
            </Pressable>
          ) : null}
          {/* <MaterialCommunityIcons name="qrcode-scan" size={24} color="#fff" /> */}
        </View>
      </View>
      <View
        style={[
          styles.buttonsContainer,
          { padding: 10, paddingTop: 0, marginBottom: 0, direction: "rtl" },
        ]}
      >
        <Pressable
          style={[
            styles.button,
            { backgroundColor: "#fff" },
            showDetails ? styles.active : null,
          ]}
          onPress={() => setShowDetails(true)}
        >
          <Text
            style={[
              styles.buttonText,
              { color: "grey" },
              showDetails ? styles.active : null,
            ]}
          >
            تفاصيل الطلب
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: "#fff" },
            !showDetails ? styles.active : null,
          ]}
          onPress={() => setShowDetails(false)}
        >
          <Text
            style={[
              styles.buttonText,
              { color: "grey" },
              !showDetails ? styles.active : null,
            ]}
          >
            تتبع الطلب
          </Text>
        </Pressable>
      </View>

      {showDetails ? (
        <ScrollView
          style={styles.orderDetails}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View
            style={[
              styles.orderHead,
              {
                borderColor: "#f7f7f7",
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
                  color: "grey",
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
                      order?.data.status as keyof typeof orderStatusColors
                    ],
                }}
              >
                {order?.data.formedStatus}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: "grey",
                }}
              >
                التاريخ :
              </Text>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 12,
                  color: "#000",
                }}
              >
                {formatDate(order?.data.createdAt)}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: "grey",
                }}
              >
                السعر الكلي :
              </Text>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 13,
                  color: "#000",
                }}
              >
                {formatNumber(order?.data.totalCost)}
              </Text>
            </View>
          </View>
          <View style={styles.orderItem}>
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 13,
                color: "grey",
              }}
            >
              اسم المستلم :
            </Text>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 11,
              }}
            >
              {order?.data.recipientName || "لا يوجد"}
            </Text>
          </View>
          <View
            style={[
              styles.orderItem,
              {
                borderColor: "#f7f7f7",
                borderBottomWidth: 1,
                marginBottom: 10,
                paddingBottom: 10,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 13,
                color: "grey",
              }}
            >
              رقم الهاتف :
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 13,
                }}
              >
                {order?.data.recipientPhones[0]}
              </Text>
              <Pressable
                onPress={() =>
                  Linking.openURL(`tel:${order?.data.recipientPhones[0]}`)
                }
              >
                <Feather name="phone" size={20} color="grey" />
              </Pressable>
              <Pressable
                onPress={() => {
                  const message = `مرحبا 👋
معك ${name} من شركه التوصيل
بخصوص الطلب رقم ${order?.data.receiptNumber}
هل انت جاهز للأستلام ؟
ارسل موقعك `;
                  Linking.openURL(
                    formatToWhatsAppLink(
                      order?.data.recipientPhones[0] || "",
                      message
                    ) || ""
                  );
                }}
              >
                <FontAwesome name="whatsapp" size={22} color="grey" />
              </Pressable>
            </View>
          </View>
          <View style={[styles.orderItem]}>
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 13,
                color: "grey",
              }}
            >
              العنوان :
            </Text>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 11,
              }}
            >
              {governorateArabicNames[
                order?.data.governorate as keyof typeof governorateArabicNames
              ] +
                " - " +
                order?.data.location?.name}
              {order?.data.recipientAddress
                ? " - " + order.data.recipientAddress
                : null}
            </Text>
          </View>
          <View style={[styles.orderItem]}>
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 13,
                color: "grey",
              }}
            >
              ملاحظات :
            </Text>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 11,
              }}
            >
              {order?.data.notes || "لا يوجد"}
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
                color: "grey",
              }}
            >
              تفاصيل :
            </Text>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 11,
              }}
            >
              {order?.data.details || "لا يوجد"}
            </Text>
          </View>
          {role === "DELIVERY_AGENT" &&
          !order?.data.client?.showNumbers ? null : (
            <>
              <View
                style={[
                  styles.orderItem,
                  order?.data.client?.phone
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
                    color: "grey",
                  }}
                >
                  العميل :
                </Text>
                <Text
                  style={{
                    fontFamily: "CairoBold",
                    fontSize: 11,
                  }}
                >
                  {order?.data.client?.name + " | " + order?.data.store.name}
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
                    color: "grey",
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
                    {order?.data.client?.phone}
                  </Text>
                  <Pressable
                    onPress={() =>
                      Linking.openURL(`tel:${order?.data.client?.phone}`)
                    }
                  >
                    <Feather name="phone" size={20} color="grey" />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      const message = `مرحبا 👋
معك ${name} من شركه التوصيل
بخصوص الطلب رقم ${order?.data.receiptNumber}
التاريخ : ${formatDate(order?.data.createdAt)}
الحاله : ${order?.data.formedStatus}
السعر الكلي : ${order?.data.totalCost}
الفرع : ${order?.data.branch?.name}`;
                      Linking.openURL(
                        formatToWhatsAppLink(
                          order?.data.client?.phone || "",
                          message
                        ) || ""
                      );
                    }}
                  >
                    <FontAwesome name="whatsapp" size={22} color="grey" />
                  </Pressable>
                </View>
              </View>
            </>
          )}
          {role === "CLIENT" &&
          !order?.data.client?.showDeliveryNumber ? null : order?.data
              .deliveryAgent ? (
            <>
              <View
                style={[
                  styles.orderItem,
                  order?.data.deliveryAgent?.phone
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
                    color: "grey",
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
                  {order?.data.deliveryAgent?.name}
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
                    color: "grey",
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
                    {order?.data.deliveryAgent?.phone}
                  </Text>
                  <Pressable
                    onPress={() =>
                      Linking.openURL(`tel:${order?.data.deliveryAgent?.phone}`)
                    }
                  >
                    <Feather name="phone" size={20} color="grey" />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      const message = `مرحبا 👋
معك ${name} من شركه التوصيل
بخصوص الطلب رقم ${order?.data.receiptNumber}
التاريخ : ${formatDate(order?.data.createdAt)}
الحاله : ${order?.data.formedStatus}
السعر الكلي : ${order?.data.totalCost}
الفرع : ${order?.data.branch?.name}`;
                      Linking.openURL(
                        formatToWhatsAppLink(
                          order?.data.deliveryAgent?.phone || "",
                          message
                        ) || ""
                      );
                    }}
                  >
                    <FontAwesome name="whatsapp" size={22} color="grey" />
                  </Pressable>
                </View>
              </View>
            </>
          ) : null}

          <Text style={styles.h2}>الدعم والمتابعه</Text>
          {order?.orderInquiryEmployees.length === 0 ? (
            <Text>لا يوجد</Text>
          ) : null}
          {order?.orderInquiryEmployees.map((employee) => {
            return (
              <View key={employee.id}>
                <View style={styles.orderItem}>
                  <Text
                    style={{
                      fontFamily: "Cairo",
                      fontSize: 13,
                      color: "grey",
                    }}
                  >
                    اسم الموظف :
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CairoBold",
                      fontSize: 11,
                    }}
                  >
                    {employee.name}
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
                      color: "grey",
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
                      {employee?.phone}
                    </Text>
                    <Pressable
                      onPress={() => Linking.openURL(`tel:${employee?.phone}`)}
                    >
                      <Feather name="phone" size={20} color="grey" />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        const message = `مرحبا 👋
معك ${name} من شركه التوصيل
بخصوص الطلب رقم ${order?.data.receiptNumber}
التاريخ : ${formatDate(order.data.createdAt)}
الحاله : ${order.data.formedStatus}
السعر الكلي : ${order.data.totalCost}
الفرع : ${order.data.branch?.name}`;
                        Linking.openURL(
                          formatToWhatsAppLink(
                            employee?.phone || "",
                            message
                          ) || ""
                        );
                      }}
                    >
                      <FontAwesome name="whatsapp" size={22} color="grey" />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.orderTimeLine}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {order?.orderTimeline.map((item, index) => {
            return (
              <View key={item.id} style={styles.orderTimeLineItem}>
                <Text style={styles.orderTimeLineItemText}>{item.message}</Text>
                <Text style={{ fontSize: 12, color: "grey", marginBottom: 10 }}>
                  بواسطه : {item.by.name}
                </Text>
                {index + 1 === order.orderTimeline.length ? null : (
                  <Entypo
                    name="arrow-with-circle-down"
                    size={24}
                    color="green"
                  />
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
      {role === "CLIENT" ||
      role === "INQUIRY_EMPLOYEE" ||
      role === "DELIVERY_AGENT" ||
      role === "CLIENT_ASSISTANT" ? (
        <TouchableOpacity
          style={[styles.floatingButton, { bottom: 250, zIndex: 11 }]}
          onPress={() =>
            router.push({
              pathname: "/chatRoom",
              params: {
                receiptNumber: order?.data.receiptNumber,
                orderId: order?.data.id,
              },
            })
          }
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="white" />
        </TouchableOpacity>
      ) : null}
      <View style={styles.total}>
        <View style={[styles.orderItem]}>
          <Text
            style={{
              fontFamily: "Cairo",
              fontSize: 13,
              color: "grey",
            }}
          >
            رسوم التوصيل :
          </Text>
          <Text
            style={{
              fontFamily: "CairoBold",
              fontSize: 11,
            }}
          >
            {formatNumber(order?.data.deliveryCost + "")} د
          </Text>
        </View>
        <View
          style={[
            styles.orderItem,
            { borderBottomWidth: 1, borderColor: "#f7f7f7", paddingBottom: 10 },
          ]}
        >
          <Text
            style={{
              fontFamily: "Cairo",
              fontSize: 13,
              color: "grey",
            }}
          >
            المبلغ المستلم :
          </Text>
          <Text
            style={{
              fontFamily: "CairoBold",
              fontSize: 11,
            }}
          >
            {formatNumber(order?.data.paidAmount)} د
          </Text>
        </View>
        <View style={[styles.orderItem]}>
          <Text
            style={{
              fontFamily: "Cairo",
              fontSize: 13,
              color: "grey",
            }}
          >
            صافي العميل :
          </Text>
          <Text
            style={{
              fontFamily: "CairoBold",
              fontSize: 11,
            }}
          >
            {formatNumber(order?.data.clientNet)} د
          </Text>
        </View>
        {role === "DELIVERY_AGENT" || role === "INQUIRY_EMPLOYEE" ? (
          <Pressable
            style={{ backgroundColor: "#a91101", padding: 10, borderRadius: 8 }}
            onPress={() => setShowChangeModel(true)}
          >
            <Text style={[styles.buttonText, { color: "#fff", fontSize: 15 }]}>
              تغير الحاله
            </Text>
          </Pressable>
        ) : null}
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
      ) : null}
      <ChangeStatus
        isVisible={showChangeModel}
        close={() => setShowChangeModel(false)}
        receiptNumber={order?.data.receiptNumber + ""}
      />
      <ChangeProcessingStatus
        isVisible={showChangeProcessing}
        close={() => setShowChangeProcessing(false)}
        receiptNumber={order?.data.receiptNumber + ""}
      />
    </View>
  );
}
