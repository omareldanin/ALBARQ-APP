import { APIError } from "@/api";
import { getReportPDFService } from "@/services/getReportPDF";
import { Report } from "@/services/getReports";

import { editReportService } from "@/services/editReportService";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/reports";
import { AntDesign, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Pressable,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import ConfirmDialog from "../Confirm/Confirm";

interface Props {
  report: Report;
}
export const ReportItem = ({ report }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [confirmed, setConfirmed] = useState(report.confirmed);
  const date = new Date(report.createdAt);
  const { theme } = useThemeStore();
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const { mutate: savePdf, isPending: isloadingPrint } = useMutation({
    mutationFn: () => {
      const date = new Date();
      return getReportPDFService(report.id, `كشف ${date.toDateString()}`);
    },
    onSuccess: () => {},
    onError: (error: AxiosError<APIError>) => {
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: error.response?.data.message || "الرجاء التأكد من البيانات",
        position: "top",
      });
    },
  });
  const { mutate: confirmReport, isPending: isConfirmLoading } = useMutation({
    mutationFn: () => {
      return editReportService(report.id, { confirmed: true });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "تم بنجاح",
        text2: "تم استلام الكشف بنجاح",
        position: "top",
      });
      setConfirmed(true);
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
  const handleConfirm = () => {
    // Your delete logic here
    confirmReport();
    setIsDialogVisible(false);
  };

  return (
    <View
      style={[
        styles.order,
        expanded ? styles.expanded : styles.collapsed,
        {
          backgroundColor: theme === "dark" ? "#15202b" : "#fff",
          borderColor: theme === "dark" ? "#15202b" : "#f7f7f7",
        },
      ]}>
      <Pressable style={styles.head} onPress={toggleExpand}>
        <View
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 15 }}>
          <FontAwesome6
            name="clipboard-list"
            size={22}
            color={report.secondaryType === "DELIVERED" ? "green" : "#a91101"}
          />
          <View style={{ alignItems: "flex-start" }}>
            <Text
              style={{
                fontFamily: "CairoBold",
                color: theme === "dark" ? "#fff" : "#000",
              }}>
              {report.id}
            </Text>
            <Text
              style={{
                fontSize: 11,
                marginTop: 5,
                fontFamily: "Cairo",
                color:
                  report.secondaryType === "DELIVERED" ? "green" : "#a91101",
              }}>
              {report.secondaryType === "DELIVERED" ? "واصل" : "راجع"}
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontFamily: "Cairo",
                color: "grey",
                fontSize: 11,
              }}>
              {confirmed ? "تم الاستلام" : "لم يتم الاستلام"}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            style={{
              width: 25,
              height: 35,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
            onPress={() => savePdf()}>
            {isloadingPrint ? (
              <ActivityIndicator size="small" color={"#a91101"} />
            ) : (
              <AntDesign
                name="download"
                size={19}
                color={theme === "dark" ? "#fff" : "#000"}
              />
            )}
          </Pressable>
          <Pressable
            style={{
              width: 30,
              height: 35,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
            onPress={toggleExpand}>
            {expanded ? (
              <FontAwesome5 name="angle-up" size={22} color="#A91101" />
            ) : (
              <FontAwesome5 name="angle-down" size={22} color="grey" />
            )}
          </Pressable>
        </View>
      </Pressable>
      <View style={styles.info}>
        <View style={[styles.infoItem]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 14,
                marginRight: 10,
                color: theme === "dark" ? "#ccc" : "#000",
              }}>
              التاريخ :
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 13,
                marginRight: 10,
                color: theme === "dark" ? "#fff" : "#000",
              }}>
              {date.toLocaleString()}
            </Text>
          </View>
        </View>
        {report.type === "CLIENT" ? (
          <View style={[styles.infoItem]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 14,
                  marginRight: 10,
                  color: theme === "dark" ? "#ccc" : "#000",
                }}>
                العميل :
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 13,
                  marginRight: 10,
                  color: theme === "dark" ? "#fff" : "#000",
                }}>
                {report.clientReport?.client.name}
              </Text>
            </View>
          </View>
        ) : null}
        {report.type === "DELIVERY_AGENT" ? (
          <View style={[styles.infoItem]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "Cairo",
                  fontSize: 14,
                  marginRight: 10,
                  color: theme === "dark" ? "#ccc" : "#000",
                }}>
                العميل :
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  fontSize: 13,
                  marginRight: 10,
                  color: theme === "dark" ? "#fff" : "#000",
                }}>
                {report.deliveryAgentReport?.deliveryAgent.name}
              </Text>
            </View>
          </View>
        ) : null}
        <View style={[styles.infoItem]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 14,
                marginRight: 10,
                color: theme === "dark" ? "#ccc" : "#000",
              }}>
              عدد الطلبات :
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 13,
                marginRight: 10,
                color: theme === "dark" ? "#fff" : "#000",
              }}>
              {report.baghdadOrdersCount + report.governoratesOrdersCount}
            </Text>
          </View>
        </View>
        <View style={[styles.infoItem]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 14,
                marginRight: 10,
                color: theme === "dark" ? "#ccc" : "#000",
              }}>
              عدد طلبات بغداد :
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 13,
                marginRight: 10,
                color: theme === "dark" ? "#fff" : "#000",
              }}>
              {report.baghdadOrdersCount}
            </Text>
          </View>
        </View>
        <View style={[styles.infoItem]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 14,
                marginRight: 10,
                color: theme === "dark" ? "#ccc" : "#000",
              }}>
              عدد طلبات المحافظات :
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 13,
                marginRight: 10,
                color: theme === "dark" ? "#fff" : "#000",
              }}>
              {report.governoratesOrdersCount}
            </Text>
          </View>
        </View>
        <View style={[styles.infoItem]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 14,
                marginRight: 10,
                color: theme === "dark" ? "#ccc" : "#000",
              }}>
              حاله الكشف :
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "CairoBold",
                fontSize: 13,
                marginRight: 10,
                color: report.status === "PAID" ? "green" : "red",
              }}>
              {report.status === "PAID" ? "مدفوع" : "غير مدفوع"}
            </Text>
          </View>
        </View>
        <View style={[styles.infoItem]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Cairo",
                fontSize: 14,
                marginRight: 10,
                color: theme === "dark" ? "#ccc" : "#000",
              }}>
              استلام الكشف :
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              style={{
                backgroundColor: "#a91101",
                alignItems: "center",
                direction: "rtl",
                width: 100,
                height: 30,
                justifyContent: "center",
                borderRadius: 5,
                opacity: confirmed ? 0.7 : 1,
              }}
              onPress={() => setIsDialogVisible(true)}
              disabled={confirmed || isConfirmLoading}>
              {isConfirmLoading ? (
                <ActivityIndicator size="small" color={"#a91101"} />
              ) : (
                <Text
                  style={{
                    fontFamily: "CairoBold",
                    fontSize: 13,
                    marginRight: 10,
                    color: "#fff",
                    textAlign: "center",
                  }}>
                  {confirmed ? "مستلم" : "استلام"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
      <ConfirmDialog
        visible={isDialogVisible}
        title="استلام"
        message="تأكد من مراجعه الكشف قبل الاستلام!!"
        onConfirm={handleConfirm}
        onCancel={() => setIsDialogVisible(false)}
      />
    </View>
  );
};
