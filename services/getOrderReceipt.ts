import { api } from "@/api";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";

export const downloadAndOpenPdf = async (
  ordersIDs: string[],
  fileName: string
) => {
  try {
    const response = await api.post(
      "/orders/receipts",
      { ordersIDs },
      {
        responseType: "arraybuffer",
      }
    );

    const contentType = response.headers["content-type"];
    if (contentType === "application/pdf") {
      const base64Data = Buffer.from(response.data, "binary").toString(
        "base64"
      );

      const fileUri = `${FileSystem.documentDirectory}${fileName}.pdf`;

      // Save the file
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Open the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        // Fallback for Android or if no sharing available
        await WebBrowser.openBrowserAsync(fileUri);
      }
    }
  } catch (error) {
    console.error("Error downloading or opening PDF:", error);
  }
};
