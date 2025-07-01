import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import RootStackContent from "./RootStackContent";
// import { RootStackContent } from "./RootStackContent";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Cairo: require("../assets/fonts/Cairo-Regular.ttf"),
    CairoBold: require("../assets/fonts/Cairo-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "green", zIndex: 5555 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "bold",
          fontFamily: "CairoBold",
        }}
        text2Style={{ fontFamily: "Cairo" }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: "red", zIndex: 55555 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "bold",
          fontFamily: "CairoBold",
        }}
        text2Style={{ fontSize: 12, fontFamily: "Cairo" }}
      />
    ),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <RootStackContent />
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
