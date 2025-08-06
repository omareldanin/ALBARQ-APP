import styles from "@/styles/filter";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

interface Props {
  isVisible: boolean;
  close: () => void;
  openConfirm: (status: string) => void;
}

export const ChangeProcessingStatus = ({
  isVisible,
  close,
  openConfirm,
}: Props) => {
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
                textAlign: "center",
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
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                close();
                setTimeout(() => {
                  openConfirm("not_processed");
                }, 100);
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
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                close();
                setTimeout(() => {
                  openConfirm("processed");
                }, 100);
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
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                close();
                setTimeout(() => {
                  openConfirm("confirmed");
                }, 100);
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
              <Text style={{ color: "green", fontFamily: "Cairo" }}>مؤكد</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
