import styles from "@/styles/filter";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { I18nManager, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

interface Props {
  isVisible: boolean;
  close: () => void;
}

export const AddOptions = ({ isVisible, close }: Props) => {
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
                textAlign: I18nManager.isRTL ? "right" : "left",
              }}
            >
              اضافه طلبات
            </Text>
          </View>
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              close();
              setTimeout(() => {
                router.navigate("/addOrder");
              }, 200);
            }}
          >
            <AntDesign name="pluscircleo" size={24} color="#a91101" />
            <Text
              style={{
                fontFamily: "Cairo",
              }}
            >
              يدوي
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              close();
              setTimeout(() => {
                router.navigate("/addExcel");
              }, 200);
            }}
            style={styles.option}
          >
            <AntDesign name="addfile" size={24} color="#a91101" />
            <Text
              style={{
                fontFamily: "Cairo",
              }}
            >
              اكسل
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              close();
              setTimeout(() => {
                router.push({
                  pathname: "/barcode",
                  params: {
                    forAdd: "true",
                  },
                });
              }, 200);
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
              ملصق
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
