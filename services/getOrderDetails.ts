import { api } from "@/api";
import type { deliveryTypesArabicNames } from "@/lib/deliveryTypesArabicNames";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";

export interface OrderDetails {
  id: string;
  formedStatus: string;
  deliveryCost: number;
  totalCost: string;
  clientNet: string;
  paidAmount: string;
  totalCostInUSD: string;
  processingStatus: string;
  paidAmountInUSD: string;
  discount: string;
  receiptNumber: number;
  quantity: number;
  weight: number;
  recipientName: string;
  recipientPhones: string[];
  recipientAddress: string;
  notes: string;
  details: string;
  status: keyof typeof orderStatusArabicNames;
  deliveryType: keyof typeof deliveryTypesArabicNames;
  deliveryDate: string | null;
  createdAt: Date;
  updatedAt: Date;
  client: {
    id: number;
    name: string;
    phone: string;
    showNumbers: boolean;
    showDeliveryNumber: boolean;
  } | null;
  deliveryAgent: {
    id: number;
    name: string;
    phone: string;
  } | null;
  orderProducts: {
    quantity: number;
    product: Product;
    color: Color;
    size: Color;
  }[];
  governorate: keyof typeof governorateArabicNames;
  location: Location;
  store: Location;
  branch: {
    id: number;
    name: string;
  } | null;
  repository: {
    id: number;
    name: string;
  } | null;
  confirmed: boolean;
}

export interface Color {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  title: string;
  price: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  stock: number;
  weight: number;
  categoryId: string;
}

export interface Location {
  id: number;
  name: string;
}
export interface GetOrderDetailsResponse {
  status: string;
  data: OrderDetails;
  orderTimeline: OrderTimeline[];
  orderInquiryEmployees: orderInquiryEmployee[];
}

export type OrderTimelineType =
  | "STATUS_CHANGE"
  | "DELIVERY_AGENT_CHANGE"
  | "CURRENT_LOCATION_CHANGE"
  | "PAID_AMOUNT_CHANGE"
  | "REPOSITORY_CHANGE"
  | "BRANCH_CHANGE"
  | "CLIENT_CHANGE"
  | "STATUS_CHANGE"
  | "REPORT_CREATE"
  | "REPORT_DELETE"
  | "ORDER_DELIVERY"
  | "OTHER";

export const orderTimelineTypeArabicNames = {
  STATUS_CHANGE: "تغيير حالة الطلب",
  DELIVERY_AGENT_CHANGE: "تغيير مندوب التوصيل",
  CURRENT_LOCATION_CHANGE: "تغيير الموقع الحالي",
  ORDER_DELIVERY: "توصيل الطلب",
  REPORT_CREATE: "إنشاء كشف",
  REPORT_DELETE: "حذف كشف",
  PAID_AMOUNT_CHANGE: "تغيير المبلغ المدفوع",
  REPOSITORY_CHANGE: "تغيير المخزن",
  BRANCH_CHANGE: "تغيير الفرع",
  CLIENT_CHANGE: "تغيير العميل",
  OTHER: "أخرى",
};

export interface OrderTimeline {
  id: number;
  new: keyof typeof orderStatusArabicNames | number | string;
  old: keyof typeof orderStatusArabicNames | number | string;
  by: {
    id: number;
    name: string;
    role: string;
  };
  date: string;
  type: OrderTimelineType;
  message: string | null;
}
export interface orderInquiryEmployee {
  id: number;
  name: string;
  phone: string;
  avatar: string;
  role: string;
}

export const getOrderDetailsService = async (id: string) => {
  const response = await api.get<GetOrderDetailsResponse>("/orders/" + id);
  return response.data;
};
