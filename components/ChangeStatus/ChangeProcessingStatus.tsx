import { APIError } from "@/api";
import { queryClient } from "@/lib/queryClient";
import { editOrderService } from "@/services/editOrder";
import styles from "@/styles/filter";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import ConfirmDialog from "../Confirm/Confirm";

interface Props {
  isVisible: boolean;
  close: () => void;
  receiptNumber: string | undefined;
}

export const ChangeProcessingStatus = ({
  isVisible,
  close,
  receiptNumber,
}: Props) => {
  const [showOptions, setShowOptions] = useState(false);
  const [status, setSelectedStatus] = useState("");

  const { mutate: editOrder, isPending: isloadingSend } = useMutation({
    mutationFn: () => {
      return editOrderService({
        id: receiptNumber || "",
        data: {
          processingStatus: status,
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
      queryClient.invalidateQueries({
        queryKey: ["orderDetails", receiptNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      close();
    },
    onError: (error: AxiosError<APIError>) => {
      close();
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: error.response?.data.message || "الرجاء التأكد من البيانات",
        position: "top",
      });
    },
  });

  return (
    <View style={styles.container}>
      <Modal
        isVisible={isVisible}
        onBackdropPress={close}
        onBackButtonPress={close}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={close}
        backdropOpacity={0.4}
        backdropTransitionOutTiming={0} // prevent flicker on close
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={[styles.modalContent, { minHeight: 200 }]}>
          <View>
            <Text
              style={{
                fontFamily: "CairoBold",
                color: "#a91101",
                marginBottom: 10,
              }}
            >
              تغيير حاله المعالجه
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 30,
              padding: 10,
            }}
          >
            <Pressable
              style={{
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                setShowOptions(true);
                setSelectedStatus("not_processed");
              }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,
                  backgroundColor: "#fff",
                  borderRadius: 22.5,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "red",
                  borderWidth: 1,
                  marginBottom: 10,
                }}
              >
                <Ionicons name="close-sharp" size={24} color="red" />
              </View>
              <Text style={{ color: "red", fontFamily: "Cairo" }}>
                غير معالج
              </Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                setShowOptions(true);

                setSelectedStatus("processed");
              }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,
                  backgroundColor: "#fff",
                  borderRadius: 22.5,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "grey",
                  borderWidth: 1,
                  marginBottom: 10,
                }}
              >
                <FontAwesome5 name="check" size={18} color="grey" />
              </View>
              <Text style={{ color: "grey", fontFamily: "Cairo" }}>معالج</Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                setShowOptions(true);

                setSelectedStatus("confirmed");
              }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,
                  backgroundColor: "#fff",
                  borderRadius: 22.5,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "green",
                  borderWidth: 1,
                  marginBottom: 10,
                }}
              >
                <FontAwesome5 name="check-double" size={20} color="green" />
              </View>
              <Text style={{ color: "green", fontFamily: "Cairo" }}>معالج</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ConfirmDialog
        visible={showOptions}
        title="تغير حاله المعالجه"
        message="هل انت من متأكد من تغيير الحاله؟"
        onConfirm={() => {
          editOrder();
          setShowOptions(false);
        }}
        onCancel={() => {
          setShowOptions(false);
        }}
      />
    </View>
  );
};
