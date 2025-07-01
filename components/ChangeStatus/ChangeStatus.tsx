import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import { useAuth } from "@/store/authStore";
import styles from "@/styles/filter";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Modal from "react-native-modal";
import ConfirmStatus from "../ConfirmStatus/ConfirmStatus";

interface Props {
  isVisible: boolean;
  close: () => void;
  receiptNumber: string | undefined;
}

export const ChangeStatus = ({ isVisible, close, receiptNumber }: Props) => {
  const [showOptions, setShowOptions] = useState(false);
  const [status, setSelectedStatus] = useState("");
  const { orderStatus } = useAuth();
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
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          style={styles.modalContent}
        >
          <View>
            <Text
              style={{
                fontFamily: "CairoBold",
                color: "#a91101",
                marginBottom: 10,
              }}
            >
              تغيير الحاله
            </Text>
          </View>
          {orderStatus?.map((status) => (
            <Pressable
              style={styles.option}
              key={status}
              onPress={() => {
                setSelectedStatus(status);
                setShowOptions(true);
              }}
            >
              <Text
                style={{
                  fontFamily: "Cairo",
                }}
              >
                {
                  orderStatusArabicNames[
                    status as keyof typeof orderStatusArabicNames
                  ]
                }
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Modal>
      <ConfirmStatus
        visible={showOptions}
        title="تغيير الحاله"
        receiptNumber={receiptNumber}
        onCancel={() => {
          setShowOptions(false);
          close();
        }}
        onClose={() => {
          setShowOptions(false);
        }}
        status={status as keyof typeof orderStatusArabicNames}
      />
    </View>
  );
};
