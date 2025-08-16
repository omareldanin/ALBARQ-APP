import {
  orderStatusArabicNames,
  orderStatusColors,
} from "@/lib/orderStatusArabicNames";
import { useAuth } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import styles from "@/styles/filter";
import { Pressable, ScrollView, Text, View } from "react-native";
import Modal from "react-native-modal";

interface Props {
  isVisible: boolean;
  close: () => void;
  showConfirm: (status: string) => void;
}

export const ChangeStatus = ({ isVisible, close, showConfirm }: Props) => {
  const { orderStatus } = useAuth();
  const { theme } = useThemeStore();
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
        animationOut="slideOutDown">
        <ScrollView
          style={[
            styles.statusModel,
            { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
          ]}
          contentContainerStyle={{ paddingBottom: 100 }}>
          <View>
            <Text
              style={{
                fontFamily: "CairoBold",
                color: "#a91101",
                marginBottom: 20,
                textAlign: "center",
              }}>
              تغيير الحاله
            </Text>
          </View>
          {orderStatus?.map((status) => (
            <Pressable
              style={[
                styles.option,
                {
                  justifyContent: "center",
                  borderColor:
                    orderStatusColors[status as keyof typeof orderStatusColors],
                  backgroundColor:
                    orderStatusColors[status as keyof typeof orderStatusColors],
                },
              ]}
              key={status}
              onPress={() => {
                close();
                setTimeout(() => {
                  showConfirm(status);
                }, 100);
              }}>
              <Text
                style={{
                  fontFamily: "CairoBold",
                  color: "#fff",
                }}>
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
    </View>
  );
};
