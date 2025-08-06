import { registerForPushNotificationsAsync } from "@/components/registerForPushNotificationsAsync/registerForPushNotificationsAsync";
import { useThemeStore } from "@/store/themeStore";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as SystemUI from "expo-system-ui";

import { Tabs } from "expo-router";
import { useEffect } from "react";

export default function TabLayout() {
  const { theme } = useThemeStore();
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      SystemUI.setBackgroundColorAsync("#15202b"); // for bottom nav color
    } else {
      SystemUI.setBackgroundColorAsync("#fff"); // for bottom nav color
    }
  }, [theme]);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#A91101",
          tabBarInactiveTintColor: "#E7E6E4",
          headerPressColor: "transparent",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: theme === "dark" ? "#15202b" : "#fff",
            paddingTop: 10,
            borderColor: theme === "dark" ? "#31404e" : "#E7E6E4",
            boxShadow: "none",
            direction: "rtl",
          },
          tabBarItemStyle: {
            backgroundColor: "transparent", // ❌ Avoid grey on press
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: "index",
            tabBarIcon: ({ color }) => (
              <AntDesign size={23} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            headerShown: false,
            title: "reports",
            tabBarIcon: ({ color }) => (
              <Ionicons name="receipt-outline" size={23} color={color} />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="statistics"
          options={{
            headerShown: false,
            title: "statistics",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="ticket" size={24} color={color} />
            ),
          }}
        /> */}

        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <AntDesign size={23} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
