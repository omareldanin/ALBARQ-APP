import { ReportItem } from "@/components/Report/Report";
import { useReports } from "@/hooks/useReports";
import { Report, ReportsMetaData } from "@/services/getReports";
import styles from "@/styles/reports";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Fold } from "react-native-animated-spinkit";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Reports() {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [reportsDate, setReportsData] = useState<Report[]>([]);

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
    page,
  });

  useEffect(() => {
    if (!reports?.data?.reports) return;

    setReportsData((prev) => {
      // If it's page 1 or refetch, reset data
      if (page === 1) {
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
    <View style={styles.container}>
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
      <View style={[styles.navbar, { paddingTop: insets.top + 20 }]}>
        <View style={styles.navbarItem}>
          <Text
            style={{ color: "#fff", fontFamily: "CairoBold", fontSize: 19 }}
          >
            التقارير
          </Text>
        </View>
        <View style={styles.navbarItem}></View>
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: 150 }}
        data={reportsDate}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ReportItem report={item} />}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          if (reports.pagesCount > page) {
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
          direction: "rtl",
          padding: 10,
        }}
      />
    </View>
  );
}
