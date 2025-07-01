import styles from "@/styles/filter";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Modal from "react-native-modal";
import ConfirmOrder from "./Confirm";

interface Props {
  isVisible: boolean;
  close: () => void;
}

export const ReceiveOptions = ({ isVisible, close }: Props) => {
  const [showAddReceiptNumber, setShowAddReceiptNumber] = useState(false);

  const router = useRouter();
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
        <View style={styles.modalContent}>
          <View>
            <Text
              style={{
                fontFamily: "CairoBold",
                color: "#a91101",
                marginBottom: 10,
              }}
            >
              استلام طلبات
            </Text>
          </View>
          <Pressable
            style={styles.option}
            onPress={() => {
              setShowAddReceiptNumber(true);
            }}
          >
            <AntDesign name="pluscircleo" size={24} color="#a91101" />
            <Text
              style={{
                fontFamily: "Cairo",
              }}
            >
              يدوى
            </Text>
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => {
              router.push({
                pathname: "/barcode",
                params: {
                  received: "true",
                },
              });
            }}
          >
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={24}
              color="#a91101"
            />
            <Text
              style={{
                fontFamily: "Cairo",
              }}
            >
              مسح ملصقات
            </Text>
          </Pressable>
        </View>
      </Modal>
      <ConfirmOrder
        visible={showAddReceiptNumber}
        onClose={() => setShowAddReceiptNumber(false)}
        onCancel={() => close()}
      />
    </View>
  );
};
