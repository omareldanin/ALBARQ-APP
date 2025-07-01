import { registerForPushNotificationsAsync } from "@/components/registerForPushNotificationsAsync/registerForPushNotificationsAsync";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Tabs } from "expo-router";
import { useEffect } from "react";

export default function TabLayout() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#A91101",
          tabBarInactiveTintColor: "#E7E6E4",
          headerPressColor: "transparent",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            paddingTop: 10,
            borderColor: "#E7E6E4",
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
              <AntDesign size={22} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            headerShown: false,
            title: "reports",
            tabBarIcon: ({ color }) => (
              <Ionicons name="receipt-outline" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            headerShown: false,
            title: "statistics",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="ticket" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <AntDesign size={22} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
