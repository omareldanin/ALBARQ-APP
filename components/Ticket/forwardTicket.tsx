import { useDepartments } from "@/hooks/useDepartments";
import { useForwardTicket } from "@/hooks/useTicket";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NativeSearchableSelect from "../AddOptions/dropDown";

interface ConfirmDialogProps {
  visible: boolean;
  id?: number;
  onCancel: () => void;
}
const ForwardTicket: React.FC<ConfirmDialogProps> = ({
  visible,
  onCancel,
  id,
}) => {
  const { mutate: forwardTicket, isPending } = useForwardTicket();
  const [department, setDepartment] = useState("");

  const {
    data: departments = {
      data: [],
    },
  } = useDepartments({ page: 1, size: 100000 });

  const onConfirm = () => {
    if (!department || department === "") {
      return;
    }
    const fm = new FormData();
    fm.append("ticketId", id + "");
    fm.append("departmentId", department);

    forwardTicket(fm, {
      onSuccess: () => {
        onCancel();
      },
    });
  };
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>تحويل التذكره</Text>
          <NativeSearchableSelect
            options={departments.data.map((l) => ({
              value: l.id + "",
              label: l.name,
            }))}
            label="اختر القسم"
            setValue={(value) => {
              setDepartment(value);
            }}
            value={
              department
                ? departments.data.find((s) => s.id === +department)?.name
                : null
            }
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>إلغاء</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              {isPending ? (
                <ActivityIndicator size={"small"} color={"#fff"} />
              ) : (
                <Text style={styles.confirmText}>تأكيد</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    marginRight: 5,
    backgroundColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
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
});

export default ForwardTicket;
