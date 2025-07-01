import styles from "@/styles/tickets";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Statistics() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 19 }}
          >
            التذاكر
          </Text>
        </View>
        <View style={styles.navbarItem}></View>
      </View>
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
        <Text style={{ fontSize: 22, marginBottom: 10 }}>☹️</Text>
        <Text style={{ fontSize: 18, fontFamily: "Cairo" }}>لا يوجد تذاكر</Text>
      </View>
    </View>
  );
}
