import { OrderSheet } from "@/lib/readExcel";

import styles from "@/styles/ordersStyles";
import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import { LayoutAnimation, Pressable, Text, View } from "react-native";

interface Props {
  order: OrderSheet;
  index: number;
}
export const SheetOrderItem = ({ order, index }: Props) => {
  const [expanded, setExpanded] = useState(true);

  const formatNumber = (value: string | number) => {
    return new Intl.NumberFormat("en-US").format(Number(value));
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.order, expanded ? styles.expanded : styles.collapsed]}>
      <Pressable style={styles.head} onPress={toggleExpand}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Cairo",
              fontSize: 15,
            }}
          >
            {index + 1}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        <View style={[styles.infoItem, styles.infoItemBorder]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Entypo name="location-pin" size={24} color="#A91101" />
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 13,
                marginRight: 10,
              }}
            >
              العنوان :
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 13,
                marginRight: 10,
              }}
            >
              {order.Governorate + " - " + order.city}
              {order.address ? " - " + order.address : null}
            </Text>
          </View>
        </View>
        <View style={[styles.infoItem, styles.infoItemBorder]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome5 name="money-bill-wave" size={18} color="#A91101" />
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 13,
                marginRight: 10,
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
                marginRight: 10,
              }}
            >
              {formatNumber(order.total)}
            </Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="user" size={24} color="#A91101" />
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 13,
                marginRight: 10,
              }}
            >
              {"افتراضي"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 13,
                marginRight: 10,
              }}
            >
              {order.phoneNumber}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
