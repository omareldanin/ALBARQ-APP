import { api } from "@/api";
import { AxiosError } from "axios";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";

export const downloadExcelSheet = async () => {
  try {
    const response = await api.get(`/orders/getOrdersSheet`, {
      responseType: "arraybuffer",
    });

    const contentType = response.headers["content-type"];

    if (
      contentType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      // 1️⃣ Convert arraybuffer to base64
      const base64 = Buffer.from(response.data, "binary").toString("base64");

      // 2️⃣ Define file path
      const fileUri = `${FileSystem.documentDirectory}orders.xlsx`;

      // 3️⃣ Write file
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 4️⃣ Share / open the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        // fallback: open in browser or alert
        await WebBrowser.openBrowserAsync(fileUri);
      }

      return;
    } else {
      throw new Error("Unexpected content type: " + contentType);
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const data = JSON.parse(new TextDecoder().decode(error.response?.data));
      throw data;
    } else {
      console.error("Download error:", error);
      throw error;
    }
  }
};
