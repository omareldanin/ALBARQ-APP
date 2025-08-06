import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import {
  orderStatusArabicNames,
  orderStatusColors,
} from "@/lib/orderStatusArabicNames";
import { Order } from "@/services/getOrders";
import { orderSecondaryStatusArabicNames } from "@/services/orderSecondaryStatusArabicNames";
import { useAuth } from "@/store/authStore";

import { useDeactivateOrder } from "@/hooks/useDeactivateOrder";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/ordersStyles";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import ConfirmDialog from "../Confirm/Confirm";

interface Props {
  order: Order;
  checked: boolean | undefined;
  showCheckBox: boolean | undefined;
  setSelectedOrder: React.Dispatch<React.SetStateAction<string[]>>;
  removeFromData: (id: string) => void;
}
export const OrderItem = ({
  order,
  checked,
  setSelectedOrder,
  showCheckBox,
  removeFromData,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { theme } = useThemeStore();

  const router = useRouter();
  const { name, role } = useAuth();

  const date = new Date(order.createdAt);

  const formatNumber = (value: string | number) => {
    return new Intl.NumberFormat("en-US").format(Number(value));
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleCopy = async () => {
    const message = `مرحبا 👋
معك ${name} من شركه التوصيل
بخصوص الطلب رقم ${order.receiptNumber}
التاريخ : ${date.toLocaleString()}
الحاله : ${order.formedStatus}
السعر الكلي : ${order.totalCost}
الفرع : ${order.branch?.name}`;

    await Clipboard.setStringAsync(message);
    Toast.show({
      type: "success",
      text1: "نسخ معلومات الطلب ✅",
      text2: "",
      position: "top",
    });
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

  const { mutate: deleteOrder, isPending } = useDeactivateOrder();

  const handleDelete = () => {
    deleteOrder(order.id, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "تم بنجاح ✅",
          text2: "تم الحذف بنجاح 🎉",
          position: "top",
        });
        removeFromData(order.id);
      },
    });
  };

  return (
    <View
      style={[
        styles.order,
        expanded ? styles.expanded : styles.collapsed,
        {
          backgroundColor: theme === "dark" ? "#15202b" : "#fff",
          borderColor: theme === "dark" ? "#31404e" : "#f7f7f7",
        },
      ]}
    >
      <Pressable style={styles.head} onPress={toggleExpand}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showCheckBox ? (
            <Pressable
              style={{ width: 30, height: 30, justifyContent: "center" }}
              onPress={() => {
                if (checked) {
                  setSelectedOrder((pre) =>
                    pre.filter((item) => item !== order.id)
                  );
                } else {
                  setSelectedOrder((pre) => [...pre, order.id]);
                }
              }}
            >
              <Ionicons
                name={checked ? "checkbox" : "square-outline"}
                size={24}
                color={checked ? "#a91101" : "grey"}
              />
            </Pressable>
          ) : null}
          <Text
            style={{
              fontFamily: "CairoBold",
              fontSize: 11,
              color: orderStatusColors[order.status],
            }}
          >
            {orderStatusArabicNames[order.status]}
            {order.secondaryStatus
              ? " - " + orderSecondaryStatusArabicNames[order.secondaryStatus]
              : null}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Cairo",
              fontSize: 13,
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            {order.receiptNumber}
          </Text>
          <Pressable
            style={{
              width: 30,
              height: 35,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
            onPress={toggleExpand}
          >
            {expanded ? (
              <FontAwesome5 name="angle-up" size={22} color="#A91101" />
            ) : (
              <FontAwesome5 name="angle-down" size={22} color="grey" />
            )}
          </Pressable>
        </View>
      </Pressable>
      <View style={styles.info}>
        <View
          style={[
            styles.infoItem,
            styles.infoItemBorder,
            { borderColor: theme === "dark" ? "#31404e" : "#f7f7f7" },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Fontisto name="date" size={20} color="#A91101" />
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 13,
                color: theme === "dark" ? "#ccc" : "#000",
              }}
            >
              التاريخ :
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 11,
                color: theme === "dark" ? "#fff" : "#000",
              }}
            >
              {date.toLocaleString()}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.infoItem,
            styles.infoItemBorder,
            { borderColor: theme === "dark" ? "#31404e" : "#f7f7f7" },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Entypo name="location-pin" size={24} color="#A91101" />
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 13,
                color: theme === "dark" ? "#ccc" : "#000",
              }}
            >
              العنوان :
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 11,
                marginRight: 10,
                color: theme === "dark" ? "#fff" : "#000",
              }}
            >
              {governorateArabicNames[order.governorate] +
                " - " +
                order.location?.name}
              {order.recipientAddress && order.recipientAddress.length > 20
                ? " - " + order.recipientAddress.slice(1, 20) + "..."
                : order.recipientAddress
                  ? " - " + order.recipientAddress
                  : null}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.infoItem,
            styles.infoItemBorder,
            { borderColor: theme === "dark" ? "#31404e" : "#f7f7f7" },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <FontAwesome5 name="money-bill-wave" size={18} color="#A91101" />
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 13,
                color: theme === "dark" ? "#ccc" : "#000",
              }}
            >
              السعر الكلي :
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 13,
                color: theme === "dark" ? "#fff" : "#000",
                marginRight: 10,
              }}
            >
              {formatNumber(order.totalCost)}
            </Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <AntDesign name="user" size={24} color="#A91101" />
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 13,
                color: theme === "dark" ? "#ccc" : "#000",
              }}
            >
              {order.recipientName ? order.recipientName : "لا يوجد"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <Pressable
              onPress={() => Linking.openURL(`tel:${order.recipientPhones[0]}`)}
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
بخصوص الطلب رقم ${order.receiptNumber}
هل انت جاهز للأستلام ؟
ارسل موقعك `;
                const link = formatToWhatsAppLink(
                  order?.recipientPhones[0] || "",
                  message
                );
                if (link) {
                  Linking.openURL(link);
                }
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
        {role === "DELIVERY_AGENT" && !order.client.showNumbers ? null : (
          <View style={styles.infoItem}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <FontAwesome5 name="store" size={20} color="#A91101" />
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#ccc" : "#000",
                }}
              >
                {order.client.name}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <Pressable
                onPress={() => Linking.openURL(`tel:${order.client.phone}`)}
              >
                <Feather
                  name="phone"
                  size={20}
                  color={theme === "dark" ? "#fff" : "grey"}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  const date = new Date(order.createdAt);
                  const message = `مرحبا 👋
معك ${name} من شركه التوصيل
بخصوص الطلب رقم ${order.receiptNumber}
التاريخ : ${date.toLocaleString()}
الحاله : ${order.formedStatus}
السعر الكلي : ${order.totalCost}`;
                  Linking.openURL(
                    formatToWhatsAppLink(order.client.phone, message) || ""
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
        )}
        {(role === "CLIENT" || role === "CLIENT_ASSISTANT") &&
        !order.client.showDeliveryNumber ? null : order.deliveryAgent ? (
          <View style={styles.infoItem}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <MaterialCommunityIcons
                name="truck-delivery-outline"
                size={22}
                color="#A91101"
              />
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 13,
                  color: theme === "dark" ? "#ccc" : "#000",
                }}
              >
                {order.deliveryAgent?.name}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <Pressable
                onPress={() =>
                  Linking.openURL(`tel:${order.deliveryAgent?.phone}`)
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
                  const date = new Date(order.createdAt);
                  const message = `مرحبا 👋
معك ${name} من شركه التوصيل
بخصوص الطلب رقم ${order.receiptNumber}
التاريخ : ${date.toLocaleString()}
الحاله : ${order.formedStatus}
السعر الكلي : ${order.totalCost}`;
                  Linking.openURL(
                    formatToWhatsAppLink(
                      order.deliveryAgent?.phone || "",
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
        ) : null}
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.button} onPress={handleCopy}>
          <Text style={[styles.buttonText, { color: "#000" }]}>نسخ</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: "#a91101", borderColor: "#a91101" },
          ]}
          onPress={() => {
            router.push({
              pathname: "/orderDetails",
              params: {
                id: order.receiptNumber,
              },
            });
          }}
        >
          <Text style={styles.buttonText}>التفاصيل</Text>
        </Pressable>
        {(role === "CLIENT" || role === "CLIENT_ASSISTANT") &&
        (order.status === "REGISTERED" || order.status === "READY_TO_SEND") ? (
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Pressable
              style={[
                styles.button,
                { backgroundColor: "#06bcee", paddingHorizontal: 10, flex: 0 },
              ]}
              onPress={() => {
                router.push({
                  pathname: "/editOrder",
                  params: {
                    id: order.id,
                    receiptNumber: order.receiptNumber,
                  },
                });
              }}
            >
              <Feather name="edit" size={24} color="#fff" />
            </Pressable>
            <Pressable
              style={[
                styles.button,
                { backgroundColor: "red", paddingHorizontal: 10, flex: 0 },
              ]}
              onPress={() => setShowConfirmDelete(true)}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator size={"small"} color={"#fff"} />
              ) : (
                <MaterialCommunityIcons
                  name="delete-forever"
                  size={24}
                  color="#fff"
                />
              )}
            </Pressable>
          </View>
        ) : null}
      </View>
      {/* {role === "RECEIVING_AGENT" && order.status === "READY_TO_SEND" ? (
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: "green",
              marginBottom: 10,
              marginTop: 10,
              borderColor: "green",
            },
          ]}
          onPress={() => {
            setShowOptions(true);
          }}
          disabled={isloadingSend}
        >
          {isloadingSend ? (
            <ActivityIndicator size={"small"} color={"#fff"} />
          ) : (
            <Text style={styles.buttonText}>استلام الطلب</Text>
          )}
        </Pressable>
      ) : null} */}
      <ConfirmDialog
        visible={showOptions || showConfirmDelete}
        title={showConfirmDelete ? "حذف الطلب" : "استلام الطلب"}
        message={
          showConfirmDelete
            ? "هل انت متأكد من حذف الطلب"
            : "هل انت متاكد من استلام الطلب من العميل؟"
        }
        onConfirm={() => {
          if (showConfirmDelete) {
            handleDelete();
            setShowConfirmDelete(false);
          } else {
            setShowOptions(false);
          }
        }}
        onCancel={() => {
          if (showConfirmDelete) {
            setShowConfirmDelete(false);
          } else {
            setShowOptions(false);
          }
        }}
      />
    </View>
  );
};
