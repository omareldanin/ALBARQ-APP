import { api } from "@/api";

export interface CreateOrderItem {
  withProducts: boolean;
  totalCost?: number;
  recipientName?: string;
  recipientPhone: string;
  recipientAddress: string;
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
}

export type CreateOrderPayload = CreateOrderItem | CreateOrderItem[];

export const createOrderService = async (data: CreateOrderPayload) => {
  const response = await api.post<CreateOrderPayload>("/orders", data);
  return response.data;
};
