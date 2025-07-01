import { api } from "@/api";
import { AxiosError } from "axios";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";

export const getReportPDFService = async (reportID: number, name: string) => {
  try {
    const response = await api.get(`/reports/${reportID}/pdf`, {
      responseType: "arraybuffer",
    });

    const contentType = response.headers["content-type"];
    if (contentType === "application/pdf") {
      const base64Data = Buffer.from(response.data, "binary").toString(
        "base64"
      );

      const fileUri = `${FileSystem.documentDirectory}${name}.pdf`;

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
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const data = JSON.parse(new TextDecoder().decode(error.response?.data));
      throw data;
    }
  }
};
