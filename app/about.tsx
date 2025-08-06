import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/addOrder";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StatusBar, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function About() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeStore();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
      ]}
    >
      <StatusBar barStyle={"light-content"} />

      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-right-circle" size={25} color="#fff" />
          </Pressable>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 18 }}
          >
            حول التطبيق
          </Text>
        </View>
        <View style={styles.navbarItem}></View>
      </View>
      <View style={{ direction: "rtl", padding: 20, marginTop: 60 }}>
        <Text
          style={{
            fontFamily: "CairoBold",
            fontSize: 16,
            color: theme === "dark" ? "#ccc" : "#000",
          }}
        >
          من نحن؟
        </Text>
        <Text
          style={{
            fontFamily: "Cairo",
            color: theme === "dark" ? "#fff" : "grey",
            marginTop: 20,
            lineHeight: 40,
          }}
        >
          شركه توصيل مختصة بتوصيل الطلبات بسرعه ودقة الشركه عراقيه مسجله رسميا
          في وزاره التجاره -دائرة سمجل الشركات ولديها فروع في كافه محافظات
          العراق
        </Text>
      </View>
    </View>
  );
}
