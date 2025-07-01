import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
}

const ConfirmOrder: React.FC<ConfirmDialogProps> = ({
  visible,
  onClose,
  onCancel,
}) => {
  const [receiptNumber, setReceiptNumber] = useState<string | undefined>(
    undefined
  );

  const router = useRouter();

  const onConfirm = () => {
    router.push({
      pathname: "/orders",
      params: {
        receiptNumber: receiptNumber,
      },
    });
    onCancel();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>بحث برقم الوصل</Text>
          <TextInput
            placeholder="رقم الوصل"
            onChangeText={setReceiptNumber}
            style={[styles.input, { marginBottom: 10 }]}
            value={receiptNumber}
            placeholderTextColor={"#000"}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                onClose();
              }}
            >
              <Text style={styles.cancelText}>إلغاء</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                {
                  opacity:
                    receiptNumber === undefined || receiptNumber === ""
                      ? 0.5
                      : 1,
                },
              ]}
              onPress={onConfirm}
              disabled={receiptNumber === undefined || receiptNumber === ""}
            >
              <Text style={styles.confirmText}>تأكيد</Text>
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

export default ConfirmOrder;
