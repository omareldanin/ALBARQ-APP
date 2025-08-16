import { Filters } from "@/components/Filters/ReportsFilter";
import { ReportItem } from "@/components/Report/Report";
import { useReports } from "@/hooks/useReports";
import { Report, ReportsFilters, ReportsMetaData } from "@/services/getReports";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/reports";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { Fold } from "react-native-animated-spinkit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export const ordersFilterInitialState: ReportsFilters = {
  page: 1,
  size: 10,
  end_date: undefined,
  start_date: undefined,
  store_id: "",
};
export default function Reports() {
  const insets = useSafeAreaInsets();
  // const [page, setPage] = useState(1);
  const [reportsDate, setReportsData] = useState<Report[]>([]);
  const [openFilters, setOpenFilters] = useState(false);

  const { theme } = useThemeStore();
  const [filters, setFilters] = useState<ReportsFilters>({
    ...ordersFilterInitialState,
  });
  const {
    data: reports = {
      data: {
        reports: [],
        reportsMetaData: {} as ReportsMetaData,
      },
      pagesCount: 0,
    },
    isLoading,
    isRefetching,
  } = useReports({
    ...filters,
  });

  useEffect(() => {
    if (!reports?.data?.reports) return;

    setReportsData((prev) => {
      // If it's page 1 or refetch, reset data
      if (filters.page === 1) {
        return reports.data.reports;
      }

      // Append unique orders only
      const existingIds = new Set(prev.map((o) => o.id));
      const newOrders = reports.data.reports.filter(
        (o) => !existingIds.has(o.id)
      );
      return [...prev, ...newOrders];
    });
  }, [reports]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
      ]}>
      {isLoading && !isRefetching ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            width: "100%",
          }}>
          <Fold size={50} color="#A91101" />
        </View>
      ) : null}
      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 19 }}>
            التقارير
          </Text>
        </View>
        <View style={styles.navbarItem}>
          <Pressable onPress={() => setOpenFilters(true)}>
            <AntDesign name="filter" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
      {reports.data.reports.length === 0 && !isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            width: "100%",
          }}>
          <Text style={{ fontSize: 22, marginBottom: 10 }}>☹️</Text>
          <Text style={{ fontSize: 18, fontFamily: "Cairo" }}>
            لا يوجد تقارير
          </Text>
        </View>
      ) : null}
      <View style={{ flex: 1, padding: 10 }}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 150 }}
          data={reportsDate}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ReportItem report={item} />}
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            if (reports.pagesCount > filters.page) {
              setFilters((pre) => ({ ...pre, page: filters.page + 1 }));
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
        orderFilters={filters}
        setFilters={setFilters}
        setReportsData={setReportsData}
      />
    </View>
  );
}
