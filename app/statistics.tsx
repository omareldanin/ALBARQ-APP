import { TickItem } from "@/components/Ticket/Ticket";
import { Filters } from "@/components/TicketsFilter/TicketsFilter";
import { useGetAllTickets } from "@/hooks/useTicket";
import { Ticket, TicketFilters } from "@/services/ticketService";
import { useAuth } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/tickets";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

import { Fold } from "react-native-animated-spinkit";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Statistics() {
  const insets = useSafeAreaInsets();
  const { role } = useAuth();
  const [openFilters, setOpenFilters] = useState(false);
  const [ticketsDate, setTicketsData] = useState<Ticket[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useThemeStore();
  const [filters, setFilters] = useState<TicketFilters>({
    page: 1,
    size: 10,
    status: undefined,
    userTickets: "false",
    forwarded: "false",
    closed: "false",
  });

  const {
    data: tickets = {
      data: [],
      count: 0,
      pagesCount: 0,
      page: 0,
    },
    isLoading,
    isRefetching,
    refetch,
  } = useGetAllTickets(filters);

  useEffect(() => {
    if (role === "INQUIRY_EMPLOYEE" && filters.userTickets !== "true") {
      setFilters((pre) => ({ ...pre, userTickets: "true" }));
    }
  }, [role]);

  useEffect(() => {
    if (!tickets?.data) return;
    setTicketsData((prev) => {
      // If it's page 1 or refetch, reset data
      if (filters.page === 1 || !filters.page) {
        return tickets.data;
      }

      // Append unique orders only
      const existingIds = new Set(prev.map((o) => o.id));
      const newTickets = tickets.data.filter((o) => !existingIds.has(o.id));

      return [...prev, ...newTickets];
    });
  }, [tickets, filters]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
      ]}
    >
      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 19 }}
          >
            التذاكر
          </Text>
        </View>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => setOpenFilters(true)}>
            <AntDesign name="filter" size={25} color="#fff" />
          </Pressable>
        </View>
      </View>
      {isLoading && ticketsDate.length === 0 ? (
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

      {tickets.data.length === 0 && !isLoading ? (
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
            لا يوجد تذاكر
          </Text>
        </View>
      ) : null}
      <View
        style={{
          direction: "rtl",
          padding: 10,
          paddingBottom: 0,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: theme === "dark" ? "#ccc" : "grey",
            fontFamily: "CairoBold",
            fontSize: 16,
            textAlign: I18nManager.isRTL ? "right" : "left",
          }}
        >
          التذاكر{" "}
          {filters.userTickets === "true"
            ? "المستلمه"
            : filters.forwarded === "true"
              ? "المحوله"
              : filters.closed === "true"
                ? "المغلقه"
                : "المفتوحه"}
        </Text>
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 150 }}
          data={ticketsDate}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setTicketsData([]);
                setFilters((pre) => ({ ...pre, page: 1 }));
                refetch();
              }}
            />
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TickItem ticket={item} />}
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            if (filters.page && tickets.pagesCount > filters.page) {
              setFilters((pre) => ({
                ...pre,
                page: filters.page ? filters.page + 1 : 1,
              }));
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
            direction: "rtl",
          }}
        />
      </View>

      <Filters
        isVisible={openFilters}
        close={() => setOpenFilters(false)}
        ticketFilters={filters}
        setFilters={setFilters}
        setTicketsData={setTicketsData}
      />
    </View>
  );
}
