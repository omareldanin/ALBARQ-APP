import { APIError } from "@/api";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import { queryClient } from "@/lib/queryClient";
import { editOrderService } from "@/services/editOrder";
import { useAuth } from "@/store/authStore";
import { useStatisticsStore } from "@/store/statisticsStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import ModalDropdown from "../CustomDropdown/CustomDropdown";
import InlineDropdown from "../CustomDropdown/InlineDropdown";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  receiptNumber: string | undefined;
  status: keyof typeof orderStatusArabicNames;
  onCancel: () => void;
  onClose: () => void;
}

const ConfirmStatus: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  onCancel,
  status,
  receiptNumber,
  onClose,
}) => {
  const [notes, setNotes] = useState("");
  const [paidAmount, setPaidAmount] = useState<string | undefined>(undefined);
  const { role } = useAuth();
  const { refreshStatistics } = useStatisticsStore();
  const { mutate: editOrder, isPending: isloadingSend } = useMutation({
    mutationFn: () => {
      return editOrderService({
        id: receiptNumber || "",
        data: {
          status,
          notes,
          paidAmount: paidAmount === undefined ? undefined : +paidAmount,
        },
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "تم بنجاح ✅",
        text2: "تم التعديل بنجاح 🎉",
        position: "top",
      });
      refreshStatistics();
      queryClient.invalidateQueries({
        queryKey: ["orderDetails", receiptNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      onCancel();
    },
    onError: (error: AxiosError<APIError>) => {
      onCancel();
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: error.response?.data.message || "الرجاء التأكد من البيانات",
        position: "top",
      });
    },
  });
  const onConfirm = () => {
    if (status === "POSTPONED" && notes === "") {
      onCancel();
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: "اختر وقت التأجيل",
        position: "top",
      });
      setNotes("");
      return;
    }
    if (status === "RETURNED" && notes === "") {
      onCancel();
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: "اختر وقت التأجيل",
        position: "top",
      });
      return;
    }
    editOrder();
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.title}>{title}</Text>
            {status === "POSTPONED" ? (
              <InlineDropdown
                placeholder="اختر وقت التأجيل"
                data={[
                  { label: "مؤجل غدا", value: "مؤجل غدا" },
                  { label: "مؤجل قضاء", value: "مؤجل قضاء" },
                  { label: "مؤجل ليلا", value: "مؤجل ليلا" },
                ]}
                onSelect={(value) => setNotes(value)}
              />
            ) : null}
            {status === "RETURNED" ? (
              <ModalDropdown
                placeholder="اختر السبب"
                data={[
                  {
                    value: "لا يرد بعد المعالجة",
                    label: "لا يرد بعد المعالجة",
                  },
                  { value: "رفض الطلب", label: "رفض الطلب" },
                  { value: "حظر المندوب", label: "حظر المندوب" },
                  { value: "مسافر", label: "مسافر" },
                  { value: "تالف", label: "تالف" },
                  { value: "تم الوصول والرفض", label: "تم الوصول والرفض" },
                  { value: "خطأ بالعنوان", label: "خطأ بالعنوان" },
                  { value: "مستلم مسبقاً", label: "مستلم مسبقاً" },
                  { value: "خطأ بالتجهيز", label: "خطأ بالتجهيز" },
                  { value: "إلغاء الحجز", label: "إلغاء الحجز" },
                  { value: "لم يعالج الطلب", label: "لم يعالج الطلب" },
                  { value: "كاذب", label: "كاذب" },
                  { value: "مكرر", label: "مكرر" },
                ]}
                onSelect={(value) => setNotes(value)}
              />
            ) : null}
            {status === "PROCESSING" ? (
              <ModalDropdown
                placeholder="اختر السبب"
                data={[
                  { value: "لا يرد مع رسالة", label: "لا يرد مع رسالة" },
                  { value: "مغلق", label: "مغلق" },
                  { value: "نقص رقم", label: "نقص رقم" },
                  { value: "لا يمكن الاتصال به", label: "لا يمكن الاتصال به" },
                  { value: "زيادة رقم", label: "زيادة رقم" },
                  { value: "الرقم غير معرف", label: "الرقم غير معرف" },
                  { value: "غير داخل بالخدمة", label: "غير داخل بالخدمة" },
                  { value: "لم يطلب", label: "لم يطلب" },
                  { value: "تعديل سعر", label: "تعديل سعر" },
                ]}
                onSelect={(value) => setNotes(value)}
              />
            ) : null}
            {(role === "INQUIRY_EMPLOYEE" && status === "DELIVERED") ||
            (role === "INQUIRY_EMPLOYEE" && status === "REPLACED") ||
            (role === "INQUIRY_EMPLOYEE" && status === "PARTIALLY_RETURNED") ? (
              <TextInput
                placeholder="المبلغ المستلم"
                onChangeText={setPaidAmount}
                style={[styles.input, { marginBottom: 10 }]}
                value={paidAmount}
                placeholderTextColor={"#000"}
              />
            ) : null}
            {status !== "POSTPONED" &&
            status !== "RETURNED" &&
            status !== "PROCESSING" ? (
              <TextInput
                placeholder="ملاحظات"
                onChangeText={setNotes}
                style={[styles.input]}
                value={notes}
                placeholderTextColor={"#000"}
              />
            ) : null}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  onClose();
                  setNotes("");
                }}
              >
                <Text style={styles.cancelText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  {
                    opacity:
                      (status === "POSTPONED" && notes === "") ||
                      (status === "RETURNED" && notes === "") ||
                      (status === "PROCESSING" && notes === "")
                        ? 0.5
                        : 1,
                  },
                ]}
                onPress={onConfirm}
                disabled={
                  (status === "POSTPONED" && notes === "") ||
                  (status === "RETURNED" && notes === "") ||
                  (status === "PROCESSING" && notes === "")
                }
              >
                {isloadingSend ? (
                  <ActivityIndicator size={"small"} color={"#fff"} />
                ) : (
                  <Text style={styles.confirmText}>تأكيد</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    marginRight: 5,
    backgroundColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
  },
  input: {
    textAlign: "right", // aligns cursor/text to the right
    writingDirection: "rtl", // supports RTL characters properly
    paddingRight: 15,
    direction: "rtl",
    height: 50,
    borderColor: "#f7f7f7",
    color: "#000",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontFamily: "Cairo",
  },
  confirmButton: {
    flex: 1,
    padding: 10,
    marginLeft: 5,
    backgroundColor: "#A91101",
    borderRadius: 5,
    alignItems: "center",
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ConfirmStatus;
