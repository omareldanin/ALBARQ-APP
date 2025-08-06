import { APIError } from "@/api";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { validateToken } from "@/services/signInService";
import { useAuth } from "@/store/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootStackContent() {
  const { isLoggedIn, setAuth } = useAuth();
  const router = useRouter();
  // ✅ Safe to call inside the provider

  const [tokensLoaded, setTokensLoaded] = useState(false);
  const [localToken, setLocalToken] = useState<string | null>(null);
  const [localRefresh, setLocalRefresh] = useState<string | null>(null);

  const { mutateAsync: validateTokens, isPending: isloading } = useMutation({
    mutationFn: () => {
      return validateToken();
    },
    onSuccess: () => {
      setAuth({
        token: localToken || "",
        refreshToken: localRefresh || "",
        status: "success",
      });
      router.navigate("/(tabs)");
    },
    onError: (error: AxiosError<APIError>) => {
      router.navigate("/login");
    },
  });

  // 1. Load tokens first
  useEffect(() => {
    const loadTokens = async () => {
      const token = await AsyncStorage.getItem("token");
      const refresh = await AsyncStorage.getItem("refreshToken");

      setLocalToken(token);
      setLocalRefresh(refresh);
      setTokensLoaded(true);

      await validateTokens();
    };

    loadTokens();
  }, []);

  if (!tokensLoaded || isloading) {
    return <LoadingSpinner />;
  }

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="orders" />
          <Stack.Screen
            name="notifications"
            options={{
              title: "Notifications",
              presentation: "card",
              animation: "slide_from_left", // 🔑 Slide from left
              animationDuration: 350,
            }}
          />
        </Stack.Protected>
        <Stack.Screen name="login" />
      </Stack>
    </GestureHandlerRootView>
  );
}
