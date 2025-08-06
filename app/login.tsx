// app/login.tsx
import { APIError } from "@/api";
import FloatingLabelInput from "@/components/FloatingLabelInput/FloatingLabelInput";
import { queryClient } from "@/lib/queryClient";
import { SignInRequest, signInService } from "@/services/signInService";
import { useAuth } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/loginStyles";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Flow } from "react-native-animated-spinkit";
import Toast from "react-native-toast-message";

export default function Login() {
  const { setAuth } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { theme } = useThemeStore();

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ password, username }: SignInRequest) => {
      return signInService({ password, username });
    },
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "تم بنجاح ✅",
        text2: "تم تسجيل الدخول بنجاح 🎉",
        position: "top",
      });

      queryClient.invalidateQueries({
        queryKey: ["validateToken"],
      });
      router.replace("/(tabs)");
      setAuth(data);
    },
    onError: (error: AxiosError<APIError>) => {
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: error.response?.data.message || "الرجاء التأكد من البيانات",
        position: "top",
      });
    },
  });

  const submitHandler = () => {
    if (username.length < 8) {
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: "قم بإدخال الرقم بشكل صحيح",
        position: "top",
      });
      return;
    }
    if (password === "") {
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: "قم بإدخال كلمه المرور",
        position: "top",
      });
      return;
    }
    const performLogin = () => {
      login({
        password: password,
        username: username,
      });
    };

    performLogin();
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={"padding"}
        style={{
          flex: 1,
          backgroundColor: theme === "dark" ? "#31404e" : "#fff",
        }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // adjust if needed
      >
        <ScrollView
          style={[
            styles.container,
            { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
          ]}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 30,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <ImageBackground
              source={require("../assets/images/login-bk2.png")}
              resizeMode="cover"
              style={styles.image}
            ></ImageBackground>
          </View>
          <View
            style={[
              styles.form,
              { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: theme === "dark" ? "#f7f7f7" : "#000" },
              ]}
            >
              إبدأ في اداره طلباتك !
            </Text>
            <View style={styles.inputContainer}>
              <FloatingLabelInput
                label="رقم الهاتف"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View style={styles.inputContainer}>
              <FloatingLabelInput
                label="كلمة المرور"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>
            <Pressable
              style={styles.button}
              onPress={() => submitHandler()}
              disabled={isPending}
            >
              {isPending ? (
                <Flow size={40} color="#fff" style={{ margin: "auto" }} />
              ) : (
                <Text style={styles.buttonText}>تسجيل الدخول</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
