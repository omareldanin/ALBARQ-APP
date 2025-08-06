import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/addOrder";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StatusBar, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const data = [
  "المواد الكحولية والمخدرة",
  "الحبوب بكافة أنواعها",
  "المواد المساعدة للإشتعال",
  "كاميرات التجسس والدرونات",
  "الوثائق والسيم كارت",
  "أي منتج منتهي الصلاحية وغير قابل للاستخدام",
  "جميع المواد الممنوعة بكافة أنواعها وأشكالها والمذكورة في القانون العراقي.",
];

export default function Privacy() {
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
            سياسه الخصوصيه
          </Text>
        </View>
        <View style={styles.navbarItem}></View>
      </View>
      <View style={{ direction: "rtl", padding: 20, marginTop: 30 }}>
        <Text
          style={{
            fontFamily: "CairoBold",
            fontSize: 16,
            color: theme === "dark" ? "#ccc" : "#000",
          }}
        >
          حول تطبيق البرق
        </Text>
        <Text
          style={{
            fontFamily: "Cairo",
            color: theme === "dark" ? "#fff" : "grey",
            marginTop: 20,
            lineHeight: 30,
          }}
        >
          نود أن نعلمكم أن تبليغات الشركة الرسمية من خلال التطبيق الخاص بها وأن
          الشركة لا تتعامل بأي منتج أو مادة مخالفة للقانون ويتحمل الطرف المرسل
          (البائع) محتوى البضاعة في حال وجود مخالفة أو مساءلة قانونية ونشير لكم
          بعض الممنوعات في ادناه:
        </Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        style={{ direction: "rtl", paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <Text
            style={{
              fontSize: 16,
              marginVertical: 8,
              writingDirection: "rtl",
              color: theme === "dark" ? "#ccc" : "#000",
            }}
          >
            • {item}
          </Text>
        )}
      />
    </View>
  );
}
