import { useEmployees } from "@/hooks/useEmployees";
import { Employee } from "@/services/getEmployeesService";
import { useAuth } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/employees";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StatusBar,
  Text,
  View,
} from "react-native";
import { Fold } from "react-native-animated-spinkit";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Orders() {
  const { role } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useThemeStore();
  const [employeesData, setEmployeesData] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: employees = {
      data: [],
      pagesCount: 0,
    },
    isLoading,
    isRefetching,
    refetch,
  } = useEmployees({
    page,
    size: 100,
  });

  useEffect(() => {
    if (!employees?.data) return;

    setEmployeesData((prev) => {
      // If it's page 1 or refetch, reset data
      if (page === 1) {
        return employees.data;
      }

      // Append unique orders only
      const existingIds = new Set(prev.map((o) => o.id));
      const newOrders = employees.data.filter((o) => !existingIds.has(o.id));
      return [...prev, ...newOrders];
    });
  }, [employees, page]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
      ]}
    >
      <StatusBar translucent backgroundColor={"transparent"} />
      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-right-circle" size={25} color="#fff" />
          </Pressable>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 18 }}
          >
            الموظفين
          </Text>
        </View>
        <View style={styles.navbarItem}></View>
      </View>
      {isLoading && !isRefetching ? (
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
          <Fold size={50} color="#A91101" />
        </View>
      ) : null}
      {employees.data.length === 0 && !isLoading ? (
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
          <Text style={{ fontSize: 18, fontFamily: "Cairo" }}>
            لا يوجد موظفين
          </Text>
        </View>
      ) : null}
      <FlatList
        contentContainerStyle={{ paddingBottom: 150 }}
        data={employeesData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            key={item.id}
            style={[
              styles.employee,
              {
                backgroundColor: theme === "dark" ? "#15202b" : "#fff",
                borderColor: theme === "dark" ? "#31404e" : "#f7f7f7",
              },
            ]}
          >
            <View style={styles.item}>
              <Image
                source={
                  item.avatar
                    ? { uri: item.avatar }
                    : require("../assets/images/images.png")
                }
                resizeMode="cover"
                style={styles.image}
              />
              <Text
                style={[
                  styles.itemText,
                  { color: theme === "dark" ? "#fff" : "#000" },
                ]}
              >
                {item.name}
              </Text>
            </View>
            <View style={styles.item}>
              <Text
                style={[styles.itemText, { color: "#00F218", fontSize: 12 }]}
              >
                {item.clientAssistantRole}
              </Text>
              <Pressable
                style={{ width: 20, alignItems: "flex-end" }}
                onPress={() => {
                  router.push({
                    pathname: "/editEmployee",
                    params: {
                      employee: JSON.stringify(item),
                    },
                  });
                }}
              >
                <FontAwesome5
                  name="angle-left"
                  size={24}
                  color={theme === "dark" ? "#fff" : "#000"}
                />
              </Pressable>
            </View>
          </View>
        )}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setPage(1);
              refetch();
            }}
          />
        }
        onEndReached={() => {
          if (employees.pagesCount > page) {
            setPage(page + 1);
          }
        }}
        ListFooterComponent={
          isRefetching ? (
            <ActivityIndicator size="small" color={"#a91101"} />
          ) : null
        }
        style={{
          flex: 1,
          marginTop: 10,
          paddingTop: 10,
          paddingHorizontal: 10,
        }}
      />
      <Pressable
        style={[
          styles.button,
          { marginBottom: insets.bottom + 10, margin: 10 },
        ]}
        onPress={() => router.navigate("/addEmployee")}
      >
        <Text style={styles.buttonText}>اضافه موظف</Text>
      </Pressable>
    </View>
  );
}
