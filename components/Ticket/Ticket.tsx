import {
  orderStatusArabicNames,
  orderStatusColors,
} from "@/lib/orderStatusArabicNames";
import { Ticket } from "@/services/ticketService";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/tickets";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { LayoutAnimation, Pressable, Text, View } from "react-native";

interface Props {
  ticket: Ticket;
}
export const TickItem = ({ ticket }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const { theme } = useThemeStore();
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View
      style={[
        styles.order,
        expanded ? styles.expanded : styles.collapsed,
        {
          backgroundColor: theme === "dark" ? "#15202b" : "#fff",
          borderColor: theme === "dark" ? "#15202b" : "#f7f7f7",
        },
      ]}
    >
      <Pressable style={styles.head} onPress={toggleExpand}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {ticket.closed ? (
            <Entypo name="lock" size={20} color="red" />
          ) : (
            <Entypo name="lock-open" size={20} color="green" />
          )}
          <Text
            style={{
              fontFamily: "CairoBold",
              fontSize: 11,
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            تذكره رقم - {ticket.id}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Cairo",
              fontSize: 13,
              color: ticket.Employee ? "green" : "red",
            }}
          >
            {ticket.Employee ? "مستلمه" : "غير مستلمه"}
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
      <View
        style={[
          styles.infoItem,
          { flexDirection: "column", alignItems: "flex-start" },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Cairo",
              fontSize: 13,
              color: theme === "dark" ? "#ccc" : "#000",
            }}
          >
            المشكله
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "CairoBold",
              fontSize: 12,
              marginTop: 10,
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            {ticket.content}
          </Text>
        </View>
      </View>
      <View style={[styles.infoItem]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Cairo",
              fontSize: 13,
              color: theme === "dark" ? "#ccc" : "#000",
            }}
          >
            تم الانشاء بواسطه
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "CairoBold",
              fontSize: 12,
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            {ticket.createdBy.name}
          </Text>
        </View>
      </View>
      <View style={[styles.infoItem]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Cairo",
              fontSize: 13,
              color: theme === "dark" ? "#ccc" : "#000",
            }}
          >
            رقم الوصل
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "CairoBold",
              fontSize: 12,
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            {ticket.Order.receiptNumber}
          </Text>
        </View>
      </View>
      <View style={[styles.infoItem]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Cairo",
              fontSize: 13,
              color: theme === "dark" ? "#ccc" : "#000",
            }}
          >
            حاله الطلب
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "CairoBold",
              fontSize: 12,
              color: orderStatusColors[ticket.Order.status],
            }}
          >
            {orderStatusArabicNames[ticket.Order.status]}
          </Text>
        </View>
      </View>
      <View style={[styles.infoItem]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Cairo",
              fontSize: 13,
              color: theme === "dark" ? "#ccc" : "#000",
            }}
          >
            الفرع
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "CairoBold",
              fontSize: 12,
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            {ticket.Order.branch.name}
          </Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={[
            styles.button,
            { backgroundColor: "#a91101", borderWidth: 0 },
          ]}
          onPress={() => {
            router.push({
              pathname: "/ticketDetails",
              params: {
                id: ticket.id,
              },
            });
          }}
        >
          <Text style={styles.buttonText}>تفاصيل التذكره</Text>
        </Pressable>
      </View>
    </View>
  );
};
