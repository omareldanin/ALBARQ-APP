import { useCreateTicket } from "@/hooks/useTicket";
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

interface ConfirmDialogProps {
  visible: boolean;
  id?: string;
  onCancel: () => void;
}
const CreateTicket: React.FC<ConfirmDialogProps> = ({
  visible,
  onCancel,
  id,
}) => {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const { mutate: createTicket, isPending } = useCreateTicket();

  const onConfirm = () => {
    if (!message || message === "") {
      return;
    }
    const fm = new FormData();
    fm.append("orderId", id + "");
    fm.append("content", message);
    createTicket(fm, {
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
          <Text style={styles.title}>إنشاء تذكره</Text>
          <TextInput
            placeholder="اوصف مشكلتك"
            onChangeText={setMessage}
            style={[styles.input, { marginBottom: 10, height: 100 }]}
            value={message}
            multiline
            numberOfLines={5} // optional: how tall the field is
            placeholderTextColor={"#000"}
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>إلغاء</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              {isPending ? (
                <ActivityIndicator size={"small"} color={"#fff"} />
              ) : (
                <Text style={styles.confirmText}>إنشاء</Text>
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

export default CreateTicket;
