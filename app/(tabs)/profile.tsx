import ConfirmDialog from "@/components/Confirm/Confirm";
import { useAuth } from "@/store/authStore";
import styles from "@/styles/profile";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Linking, Pressable, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const { logout, name } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const handleOpenURL = async () => {
    const url = "https://www.facebook.com/profile.php?id=61577125421729";
    // تحقق من إمكانية فتح الرابط
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  };
  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.profile}>
        <Image
          source={require("../../assets/images/images.png")}
          resizeMode="cover"
          style={styles.image}
        />
        <Text style={{ marginTop: 15, fontFamily: "Cairo", fontSize: 16 }}>
          {name}
        </Text>
      </View>
      <View style={styles.item}>
        <Pressable style={{ flexDirection: "row", gap: 10 }}>
          <AntDesign name="user" size={24} color="grey" />
          <Text style={styles.itemText}>تحرير الملف الشخصي</Text>
        </Pressable>
        <AntDesign name="left" size={20} color="grey" />
      </View>
      <View style={styles.item}>
        <Pressable
          style={{ flexDirection: "row", gap: 10 }}
          onPress={() => router.navigate("/barcode")}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="grey" />
          <Text style={styles.itemText}>البحث عن منتجات</Text>
        </Pressable>
        <AntDesign name="left" size={20} color="grey" />
      </View>
      <View style={styles.item}>
        <Pressable
          style={{ flexDirection: "row", gap: 10 }}
          onPress={handleOpenURL}
        >
          <MaterialCommunityIcons name="hours-24" size={24} color="grey" />
          <Text style={styles.itemText}>المساعده والدعم</Text>
        </Pressable>
        <AntDesign name="left" size={20} color="grey" />
      </View>
      <View style={styles.item}>
        <Pressable
          style={{ flexDirection: "row", gap: 10 }}
          onPress={() => router.navigate("/about")}
        >
          <Ionicons name="help-circle-outline" size={24} color="grey" />
          <Text style={styles.itemText}>حول</Text>
        </Pressable>
        <AntDesign name="left" size={20} color="grey" />
      </View>
      <View style={styles.item}>
        <Pressable
          style={{ flexDirection: "row", gap: 10 }}
          onPress={() => router.navigate("/privacy")}
        >
          <MaterialIcons name="privacy-tip" size={24} color="grey" />
          <Text style={styles.itemText}>سياسه الخصوصيه</Text>
        </Pressable>
        <AntDesign name="left" size={20} color="grey" />
      </View>
      <Pressable
        style={{ flexDirection: "row", gap: 10 }}
        onPress={() => setIsDialogVisible(true)}
      >
        <MaterialIcons name="logout" size={24} color="red" />
        <Text style={[styles.itemText, { color: "red" }]}>تسجيل خروج</Text>
      </Pressable>
      <ConfirmDialog
        visible={isDialogVisible}
        title="تسجيل خروج"
        message="هل انت متأكد من تسجيل الخروج!!"
        onConfirm={() => logout()}
        onCancel={() => setIsDialogVisible(false)}
      />
    </View>
  );
}
