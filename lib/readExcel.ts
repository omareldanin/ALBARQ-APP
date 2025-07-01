import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";

interface SheetFile {
  [key: string]: any;
}

export interface OrderSheet {
  address: string;
  city: string;
  notes: string;
  phoneNumber: string;
  total: string | number;
  Governorate: string;
}

export const handlePickExcel = async (
  setOrders: (orders: OrderSheet[]) => void
) => {
  try {
    // 1️⃣ Pick file
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      copyToCacheDirectory: true,
    });

    if (!result.assets) return;

    const asset = result.assets[0];

    // 2️⃣ Read file as base64
    const fileUri = asset.uri;
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 3️⃣ Parse with XLSX
    const workbook = XLSX.read(fileBase64, { type: "base64" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json: SheetFile[] = XLSX.utils.sheet_to_json(sheet);

    // 4️⃣ Transform
    const transformedJson: OrderSheet[] = json.map((order) => ({
      address: order.العنوان,
      city: order.المنطقة,
      notes: order.الملاحظات,
      phoneNumber: order["رقم الهاتف"].toString().startsWith("0")
        ? order["رقم الهاتف"]
        : "0" + order["رقم الهاتف"],
      total: order["المبلغ الكلي"],
      Governorate: order.المحافظة,
    }));

    setOrders(transformedJson);
  } catch (error) {
    console.error("Error reading Excel file:", error);
  }
};
