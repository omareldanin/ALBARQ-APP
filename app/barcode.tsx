import { APIError } from "@/api";
import { editOrderService } from "@/services/editOrder";
import { useStatisticsStore } from "@/store/statisticsStore";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function BarcodeScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { forAdd, received } = useLocalSearchParams();

  const router = useRouter();
  const isFocused = useIsFocused();
  const [cameraKey, setCameraKey] = useState(0);
  const { refreshStatistics } = useStatisticsStore();
  useEffect(() => {
    if (isFocused) {
      // Force remount camera when screen focuses
      setCameraKey((prev) => prev + 1);
      setScanned(false); // allow retry if parsing failed
    }
  }, [isFocused]);

  const { mutate: sendOrders, isPending: isloadingSend } = useMutation({
    mutationFn: (receiptNumber: string) => {
      return editOrderService({
        id: receiptNumber,
        data: {
          confirmed: true,
          status: "WITH_RECEIVING_AGENT",
        },
      });
    },
    onSuccess: () => {
      setScanned(false);
      Toast.show({
        type: "success",
        text1: "تم بنجاح ✅",
        text2: "تم الاستلام بنجاح 🎉",
        position: "top",
      });
      refreshStatistics();
    },
    onError: (error: AxiosError<APIError>) => {
      setScanned(false);
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: error.response?.data.message || "الرجاء التأكد من البيانات",
        position: "top",
      });
    },
  });

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, { marginTop: 200, padding: 20 }]}>
        <Text style={styles.message}>اعطاء صلاحيه للكاميرا</Text>
        <Button onPress={requestPermission} title="إعطاء" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      {isloadingSend ? (
        <ActivityIndicator size={"large"} color={"red"} />
      ) : null}
      <CameraView
        key={cameraKey} // force remount
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        facing={facing}
        onBarcodeScanned={(props) => {
          if (scanned) return; // prevent double navigation
          setScanned(true);

          try {
            const data = JSON.parse(props.data);
            if (received) {
              sendOrders(data.id);
            } else if (forAdd) {
              router.push({
                pathname: "/addOrder",
                params: {
                  receiptNumber: data.id,
                },
              });
            } else {
              router.push({
                pathname: "/orders",
                params: {
                  receiptNumber: data.id,
                },
              });
            }
          } catch (e) {
            console.warn("Invalid QR code");
            setScanned(false); // allow retry if parsing failed
          }
        }}
      />

      {/* Overlay edges */}
      <View pointerEvents="none" style={styles.overlay}>
        <View style={styles.edgeTopLeft} />
        <View style={styles.edgeTopRight} />
        <View style={styles.edgeBottomLeft} />
        <View style={styles.edgeBottomRight} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse-sharp" size={34} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const EDGE_SIZE = 60;
const EDGE_WIDTH = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  overlay: {
    position: "absolute",
    top: "25%",
    left: "10%",
    right: "10%",
    bottom: "25%",
    borderColor: "transparent",
  },
  edgeTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: EDGE_SIZE,
    height: EDGE_SIZE,
    borderTopWidth: EDGE_WIDTH,
    borderLeftWidth: EDGE_WIDTH,
    borderColor: "#00FF00",
  },
  edgeTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: EDGE_SIZE,
    height: EDGE_SIZE,
    borderTopWidth: EDGE_WIDTH,
    borderRightWidth: EDGE_WIDTH,
    borderColor: "#00FF00",
  },
  edgeBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: EDGE_SIZE,
    height: EDGE_SIZE,
    borderBottomWidth: EDGE_WIDTH,
    borderLeftWidth: EDGE_WIDTH,
    borderColor: "#00FF00",
  },
  edgeBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: EDGE_SIZE,
    height: EDGE_SIZE,
    borderBottomWidth: EDGE_WIDTH,
    borderRightWidth: EDGE_WIDTH,
    borderColor: "#00FF00",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 25,
  },
});
