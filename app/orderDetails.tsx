import { APIError } from "@/api";
import { ChangeProcessingStatus } from "@/components/ChangeStatus/ChangeProcessingStatus";
import { ChangeStatus } from "@/components/ChangeStatus/ChangeStatus";
import ConfirmDialog from "@/components/Confirm/Confirm";
import ConfirmStatus from "@/components/ConfirmStatus/ConfirmStatus";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import {
  orderStatusArabicNames,
  orderStatusColors,
} from "@/lib/orderStatusArabicNames";
import { queryClient } from "@/lib/queryClient";
import { editOrderService } from "@/services/editOrder";
import { useAuth } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/ordersStyles";
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
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
import Toast from "react-native-toast-message";

export default function StatusStatics() {
  const [showDetails, setShowDetails] = useState(true);
  const [showChangeModel, setShowChangeModel] = useState(false);
  // const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [status, setSelectedStatus] = useState("");
  const [showChangeProcessing, setShowChangeProcessing] = useState(false);
  const [showProcessOptions, setShowProcessOptions] = useState(false);
  const [processingStatus, setProcessStatus] = useState("");
  const { name, role, permissions } = useAuth();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useThemeStore();

  const { data: order, isLoading, isError } = useOrderDetails(id.toString());

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

  const { mutate: editOrder } = useMutation({
    mutationFn: () => {
      return editOrderService({
        id: order?.data.receiptNumber + "",
        data: {
          processingStatus: processingStatus,
        },
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "تم بنجاح ✅",
        text2: "تم التعديل بنجاح 🎉",
        position: "top",
      });
      queryClient.invalidateQueries({
        queryKey: ["orderDetails", order?.data.receiptNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      close();
    },
    onError: (error: AxiosError<APIError>) => {
      close();
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
        { paddingBottom: insets.bottom },
        { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
      ]}>
      <StatusBar translucent backgroundColor={"transparent"} />

      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-right-circle" size={25} color="#fff" />
          </Pressable>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 17 }}>
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
              onPress={() => setShowChangeProcessing(true)}>
              {order?.data.processingStatus === "not_processed" ? (
                <Ionicons name="close-sharp" size={24} color="red" />
              ) : order?.data.processingStatus === "processed" ? (
                <FontAwesome5
                  name="check"
                  size={18}
                  color={theme === "dark" ? "#fff" : "grey"}
                />
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
        ]}>
        <Pressable
          style={[
            styles.button,
            showDetails ? styles.active : null,
            {
              backgroundColor: theme === "dark" ? "#15202b" : "#fff",
              borderColor: showDetails
                ? "#a91101"
                : theme === "dark"
                  ? "grey"
                  : "#f7f7f7",
            },
          ]}
          onPress={() => setShowDetails(true)}>
          <Text
            style={[
              styles.buttonText,
              { color: "grey" },
              showDetails ? styles.active : null,
              { backgroundColor: theme === "dark" ? "#15202b" : "#fff" },
            ]}>
            تفاصيل الطلب
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            !showDetails ? styles.active : null,
            {
              backgroundColor: theme === "dark" ? "#15202b" : "#fff",
              borderColor: !showDetails
                ? "#a91101"
                : theme === "dark"
                  ? "grey"
                  : "#f7f7f7",
            },
          ]}
          onPress={() => setShowDetails(false)}>
          <Text
            style={[
              styles.buttonText,
              { color: "grey" },
              !showDetails ? styles.active : null,
              { backgroundColor: theme === "dark" ? "#15202b" : "#fff" },
            ]}>
            تتبع الطلب
          </Text>
        </Pressable>
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
          }}>
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
          }}>
          <Text>حدث خطأ ما</Text>
        </View>
      ) : (
        <>
          {showDetails ? (
            <View style={{ flex: 1, padding: 20 }}>
              <ScrollView
                style={styles.orderDetails}
                contentContainerStyle={{ paddingBottom: 100 }}>
                <View
                  style={[
                    styles.orderHead,
                    {
                      borderColor: theme === "dark" ? "#15202b" : "#f7f7f7",
                      borderBottomWidth: 1,
                      marginBottom: 10,
                    },
                  ]}>
                  <View style={styles.orderItem}>
                    <Text
                      style={{
                        fontFamily: "Cairo",
                        fontSize: 13,
                        color: theme === "dark" ? "#ccc" : "grey",
                      }}>
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
                      }}>
                      {order?.data.formedStatus}
                    </Text>
                  </View>
                  <View style={styles.orderItem}>
                    <Text
                      style={{
                        fontFamily: "Cairo",
                        fontSize: 13,
                        color: theme === "dark" ? "#ccc" : "grey",
                      }}>
                      التاريخ :
                    </Text>
                    <Text
                      style={{
                        fontFamily: "CairoBold",
                        fontSize: 12,
                        color: theme === "dark" ? "#fff" : "#000",
                      }}>
                      {formatDate(order?.data.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.orderItem}>
                    <Text
                      style={{
                        fontFamily: "Cairo",
                        fontSize: 13,
                        color: theme === "dark" ? "#ccc" : "grey",
                      }}>
                      السعر الكلي :
                    </Text>
                    <Text
                      style={{
                        fontFamily: "CairoBold",
                        fontSize: 13,
                        color: theme === "dark" ? "#fff" : "#000",
                      }}>
                      {formatNumber(order?.data.totalCost)}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderItem}>
                  <Text
                    style={{
                      fontFamily: "Cairo",
                      fontSize: 13,
                      color: theme === "dark" ? "#ccc" : "grey",
                    }}>
                    اسم المستلم :
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CairoBold",
                      fontSize: 11,
                      color: theme === "dark" ? "#fff" : "#000",
                    }}>
                    {order?.data.recipientName || "لا يوجد"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.orderItem,
                    {
                      borderColor: theme === "dark" ? "#15202b" : "#f7f7f7",
                      borderBottomWidth: 1,
                      marginBottom: 10,
                      paddingBottom: 10,
                    },
                  ]}>
                  <Text
                    style={{
                      fontFamily: "Cairo",
                      fontSize: 13,
                      color: theme === "dark" ? "#ccc" : "grey",
                    }}>
                    رقم الهاتف :
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 20,
                    }}>
                    <Text
                      style={{
                        fontFamily: "CairoBold",
                        fontSize: 13,
                        color: theme === "dark" ? "#fff" : "#000",
                      }}>
                      {order?.data.recipientPhones[0]}
                    </Text>
                    <Pressable
                      onPress={() =>
                        Linking.openURL(`tel:${order?.data.recipientPhones[0]}`)
                      }>
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
بخصوص الطلب رقم ${order?.data.receiptNumber}
هل انت جاهز للأستلام ؟
ارسل موقعك `;
                        const link = formatToWhatsAppLink(
                          order?.data.recipientPhones[0] || "",
                          message
                        );
                        if (link) {
                          Linking.openURL(link);
                        }
                      }}>
                      <FontAwesome
                        name="whatsapp"
                        size={22}
                        color={theme === "dark" ? "#fff" : "grey"}
                      />
                    </Pressable>
                  </View>
                </View>
                <View style={[styles.orderItem]}>
                  <Text
                    style={{
                      fontFamily: "Cairo",
                      fontSize: 13,
                      color: theme === "dark" ? "#ccc" : "grey",
                    }}>
                    العنوان :
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CairoBold",
                      fontSize: 11,
                      color: theme === "dark" ? "#fff" : "#000",
                    }}>
                    {governorateArabicNames[
                      order?.data
                        .governorate as keyof typeof governorateArabicNames
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
                      color: theme === "dark" ? "#ccc" : "grey",
                    }}>
                    ملاحظات :
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CairoBold",
                      fontSize: 11,
                      color: theme === "dark" ? "#fff" : "#000",
                    }}>
                    {order?.data.notes || "لا يوجد"}
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
                  ]}>
                  <Text
                    style={{
                      fontFamily: "Cairo",
                      fontSize: 13,
                      color: theme === "dark" ? "#ccc" : "grey",
                    }}>
                    تفاصيل :
                  </Text>
                  <Text
                    style={{
                      fontFamily: "CairoBold",
                      fontSize: 11,
                      color: theme === "dark" ? "#fff" : "#000",
                    }}>
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
                              borderColor:
                                theme === "dark" ? "#31404e" : "#f7f7f7",
                              borderBottomWidth: 1,
                              paddingBottom: 12,
                            },
                      ]}>
                      <Text
                        style={{
                          fontFamily: "Cairo",
                          fontSize: 13,
                          color: theme === "dark" ? "#ccc" : "grey",
                        }}>
                        العميل :
                      </Text>
                      <Text
                        style={{
                          fontFamily: "CairoBold",
                          fontSize: 11,
                          color: theme === "dark" ? "#fff" : "#000",
                        }}>
                        {order?.data.client?.name +
                          " | " +
                          order?.data.store.name}
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
                      ]}>
                      <Text
                        style={{
                          fontFamily: "Cairo",
                          fontSize: 13,
                          color: theme === "dark" ? "#ccc" : "grey",
                        }}>
                        رقم الهاتف :
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 20,
                        }}>
                        <Text
                          style={{
                            fontFamily: "CairoBold",
                            fontSize: 13,
                            color: theme === "dark" ? "#fff" : "#000",
                          }}>
                          {order?.data.client?.phone}
                        </Text>
                        <Pressable
                          onPress={() =>
                            Linking.openURL(`tel:${order?.data.client?.phone}`)
                          }>
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
بخصوص الطلب رقم ${order?.data.receiptNumber}
التاريخ : ${formatDate(order?.data.createdAt)}
الحاله : ${order?.data.formedStatus}
السعر الكلي : ${order?.data.totalCost}
الفرع : ${order?.data.branch?.name}`;
                            const link = formatToWhatsAppLink(
                              order?.data.client?.phone || "",
                              message
                            );
                            if (link) {
                              Linking.openURL(link);
                            }
                          }}>
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
                !order?.data.client?.showDeliveryNumber ? null : order?.data
                    .deliveryAgent ? (
                  <>
                    <View
                      style={[
                        styles.orderItem,
                        order?.data.deliveryAgent?.phone
                          ? {}
                          : {
                              borderColor:
                                theme === "dark" ? "#31404e" : "#f7f7f7",
                              borderBottomWidth: 1,
                              paddingBottom: 12,
                            },
                      ]}>
                      <Text
                        style={{
                          fontFamily: "Cairo",
                          fontSize: 13,
                          color: theme === "dark" ? "#ccc" : "grey",
                        }}>
                        المندوب :
                      </Text>
                      <Text
                        style={{
                          fontFamily: "CairoBold",
                          fontSize: 11,
                          color: theme === "dark" ? "#fff" : "#000",
                        }}>
                        {order?.data.deliveryAgent?.name}
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
                      ]}>
                      <Text
                        style={{
                          fontFamily: "Cairo",
                          fontSize: 13,
                          color: theme === "dark" ? "#ccc" : "grey",
                        }}>
                        رقم الهاتف :
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 20,
                        }}>
                        <Text
                          style={{
                            fontFamily: "CairoBold",
                            fontSize: 13,
                            color: theme === "dark" ? "#fff" : "#000",
                          }}>
                          {order?.data.deliveryAgent?.phone}
                        </Text>
                        <Pressable
                          onPress={() =>
                            Linking.openURL(
                              `tel:${order?.data.deliveryAgent?.phone}`
                            )
                          }>
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
                          }}>
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
                            color: theme === "dark" ? "#ccc" : "grey",
                          }}>
                          اسم الموظف :
                        </Text>
                        <Text
                          style={{
                            fontFamily: "CairoBold",
                            fontSize: 11,
                            color: theme === "dark" ? "#fff" : "#000",
                          }}>
                          {employee.name}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.orderItem,
                          {
                            borderColor:
                              theme === "dark" ? "#15202b" : "#f7f7f7",
                            borderBottomWidth: 1,
                            paddingBottom: 12,
                          },
                        ]}>
                        <Text
                          style={{
                            fontFamily: "Cairo",
                            fontSize: 13,
                            color: theme === "dark" ? "#ccc" : "grey",
                          }}>
                          رقم الهاتف :
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 20,
                          }}>
                          <Text
                            style={{
                              fontFamily: "CairoBold",
                              fontSize: 13,
                              color: theme === "dark" ? "#fff" : "#000",
                            }}>
                            {employee?.phone}
                          </Text>
                          <Pressable
                            onPress={() =>
                              Linking.openURL(`tel:${employee?.phone}`)
                            }>
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
                            }}>
                            <FontAwesome
                              name="whatsapp"
                              size={22}
                              color={theme === "dark" ? "#fff" : "grey"}
                            />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ) : (
            <View style={{ flex: 1, padding: 20 }}>
              <ScrollView
                style={styles.orderTimeLine}
                contentContainerStyle={{ paddingBottom: 100 }}>
                {order?.orderTimeline.map((item, index) => {
                  return (
                    <View key={item.id} style={styles.orderTimeLineItem}>
                      <Text
                        style={[
                          styles.orderTimeLineItemText,
                          { color: theme === "dark" ? "red" : "#a91101" },
                        ]}
                        allowFontScaling={false}>
                        {item.message}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme === "dark" ? "#ccc" : "grey",
                          marginBottom: 10,
                        }}>
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
            </View>
          )}
          {role === "CLIENT" ||
          role === "INQUIRY_EMPLOYEE" ||
          role === "DELIVERY_AGENT" ||
          (role === "CLIENT_ASSISTANT" && permissions?.includes("MESSAGES")) ? (
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
              }>
              <Ionicons name="chatbubble-ellipses" size={24} color="white" />
            </TouchableOpacity>
          ) : null}
          <View
            style={[
              styles.total,
              { borderColor: theme === "dark" ? "#15202b" : "#f7f7f7" },
            ]}>
            <View style={[styles.orderItem]}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#ccc" : "grey",
                }}>
                رسوم التوصيل :
              </Text>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 11,
                  color: theme === "dark" ? "#fff" : "#000",
                }}>
                {formatNumber(order?.data.deliveryCost + "")} د
              </Text>
            </View>
            <View
              style={[
                styles.orderItem,
                {
                  borderBottomWidth: 1,
                  borderColor: theme === "dark" ? "#15202b" : "#f7f7f7",
                  paddingBottom: 10,
                },
              ]}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#ccc" : "grey",
                }}>
                المبلغ المستلم :
              </Text>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 11,
                  color: theme === "dark" ? "#fff" : "#000",
                }}>
                {formatNumber(order?.data.paidAmount)} د
              </Text>
            </View>
            <View style={[styles.orderItem]}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#ccc" : "grey",
                }}>
                صافي العميل :
              </Text>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 11,
                  color: theme === "dark" ? "#fff" : "#000",
                }}>
                {formatNumber(order?.data.clientNet)} د
              </Text>
            </View>
            <View style={styles.buttonsContainer}>
              {(role === "DELIVERY_AGENT" &&
                order?.data.status !== "DELIVERED") ||
              role === "INQUIRY_EMPLOYEE" ? (
                <Pressable
                  style={{
                    backgroundColor: "#a91101",
                    padding: 10,
                    borderRadius: 5,
                    flex: 1,
                  }}
                  onPress={() => setShowChangeModel(true)}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: "#fff", fontSize: 15 },
                    ]}>
                    تغير الحاله
                  </Text>
                </Pressable>
              ) : null}
              {/* <Pressable
                style={{
                  backgroundColor: "grey",
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                }}
                onPress={() => setShowCreateTicket(true)}
              >
                <Text
                  style={[styles.buttonText, { color: "#fff", fontSize: 15 }]}
                >
                  إنشاء تذكره
                </Text>
              </Pressable> */}
            </View>
          </View>

          {showChangeModel ? (
            <ChangeStatus
              isVisible={showChangeModel}
              close={() => setShowChangeModel(false)}
              showConfirm={(status) => {
                setShowOptions(true);
                setSelectedStatus(status);
              }}
            />
          ) : null}
          {showChangeProcessing ? (
            <ChangeProcessingStatus
              isVisible={showChangeProcessing}
              close={() => setShowChangeProcessing(false)}
              openConfirm={(status) => {
                setShowProcessOptions(true);
                setProcessStatus(status);
              }}
            />
          ) : null}

          <ConfirmDialog
            visible={showProcessOptions}
            title="تغير حاله المعالجه"
            message="هل انت من متأكد من تغيير الحاله؟"
            onConfirm={() => {
              editOrder();
              setShowProcessOptions(false);
            }}
            onCancel={() => {
              setShowProcessOptions(false);
            }}
          />
          <ConfirmStatus
            visible={showOptions}
            title="تغيير الحاله"
            receiptNumber={order?.data.receiptNumber + ""}
            onCancel={() => {
              setShowOptions(false);
              close();
            }}
            onClose={() => {
              setShowOptions(false);
            }}
            status={status as keyof typeof orderStatusArabicNames}
          />
          {/* <CreateTicket
            id={order?.data.id}
            visible={showCreateTicket}
            onCancel={() => setShowCreateTicket(false)}
          /> */}
        </>
      )}
    </View>
  );
}
