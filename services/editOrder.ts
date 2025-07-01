import { api } from "@/api";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";

export interface EditOrderPayload {
  withProducts?: boolean;
  totalCost?: number;
  recipientName?: string;
  recipientPhone?: string;
  recipientAddress?: string;
  notes?: string;
  details?: string;
  deliveryType?: string;
  governorate?: string;
  locationID?: number;
  storeID?: number;
  products?: {
    productID: number;
    quantity: number;
    colorID: number;
    sizeID: number;
  }[];
  receiptNumber?: string;
  clientOrderReceiptId?: string;
  confirmed?: boolean;
  status?: keyof typeof orderStatusArabicNames;
}

export const editOrderService = async ({
  data,
  id,
}: {
  data: EditOrderPayload;
  id: string;
}) => {
  const response = await api.patch<EditOrderPayload>("/orders/" + id, data);
  return response.data;
};

export const sendOrderToShipping = async (ordersIDs: string[]) => {
  const response = await api.post("/orders/sendOrders", {
    ordersIDs,
  });
  return response.data;
};
