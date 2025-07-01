// app/login.tsx
import { APIError } from "@/api";
import { queryClient } from "@/lib/queryClient";
import { SignInRequest, signInService } from "@/services/signInService";
import { useAuth } from "@/store/authStore";
import styles from "@/styles/loginStyles";
import { MaterialIcons } from "@expo/vector-icons"; // or Ionicons, FontAwesome, etc.
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Flow } from "react-native-animated-spinkit";
import Toast from "react-native-toast-message";

export default function Login() {
  const { setAuth } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneIsFocused, setPhoneIsFocused] = useState(false);
  const [passwordIsFocused, setPasswordIsFocused] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const router = useRouter();
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
      router.navigate("/(tabs)");
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
        style={{ flex: 1, backgroundColor: "#fff" }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // adjust if needed
      >
        <ScrollView
          style={styles.container}
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
          <View style={styles.form}>
            <Text style={styles.text}>إبدأ في اداره طلباتك !</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="phone"
                size={20}
                color={phoneIsFocused ? "#A91101" : "#DADADA"}
                style={styles.icon}
              />
              <TextInput
                placeholder="رقم الهاتف"
                onFocus={() => setPhoneIsFocused(true)}
                onBlur={() => setPhoneIsFocused(false)}
                onChangeText={setUsername}
                style={[styles.input, phoneIsFocused && styles.inputFocused]}
                value={username}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                placeholderTextColor={"grey"}
                importantForAutofill="no"
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="lock"
                size={20}
                color={passwordIsFocused ? "#A91101" : "#DADADA"}
                style={styles.icon}
              />
              <TextInput
                placeholder="كلمه المرور"
                secureTextEntry
                onChangeText={setPassword}
                onFocus={() => setPasswordIsFocused(true)}
                onBlur={() => setPasswordIsFocused(false)}
                value={password}
                style={[styles.input, passwordIsFocused && styles.inputFocused]}
                ref={passwordRef}
                placeholderTextColor={"grey"}
                importantForAutofill="no"
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
