import styles from "@/styles/filter";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { I18nManager, Pressable, Text, View } from "react-native";
import Modal from "react-native-modal";

interface Props {
  isVisible: boolean;
  close: () => void;
  openAdd: () => void;
}

export const ReceiveOptions = ({ isVisible, close, openAdd }: Props) => {
  const router = useRouter();
  return (
    <View style={styles.container} pointerEvents="box-none">
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
                textAlign: I18nManager.isRTL ? "right" : "left",
              }}
            >
              استلام طلبات
            </Text>
          </View>
          <Pressable
            style={styles.option}
            onPress={() => {
              close();
              setTimeout(() => {
                openAdd();
              }, 100);
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
              close();
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
    </View>
  );
};
