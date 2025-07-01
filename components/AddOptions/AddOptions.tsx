import styles from "@/styles/filter";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
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
              }}
            >
              اضافه طلبات
            </Text>
          </View>
          <Pressable
            style={styles.option}
            onPress={() => {
              router.navigate("/addOrder");
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
            onPress={() => {
              router.navigate("/addExcel");
            }}
            style={styles.option}
          >
            <AntDesign name="addfile" size={24} color="#a91101" />
            <Text
              style={{
                fontFamily: "Cairo",
              }}
            >
              اكسيل
            </Text>
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => {
              router.push({
                pathname: "/barcode",
                params: {
                  forAdd: "true",
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
              ملصق
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};
