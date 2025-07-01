import { api } from "@/api";
import { deliveryTypesArabicNames } from "@/lib/deliveryTypesArabicNames";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import { orderSecondaryStatusArabicNames } from "./orderSecondaryStatusArabicNames";

export interface Order {
  id: string;
  totalCost: number;
  paidAmount: number;
  totalCostInUSD: number;
  paidAmountInUSD: number;
  discount: number;
  receiptNumber: string;
  quantity: number;
  weight: number;
  recipientName: string;
  recipientPhones: string[];
  recipientAddress: string;
  details: string;
  notes: string;
  formedStatus: string;
  status: keyof typeof orderStatusArabicNames;
  secondaryStatus: keyof typeof orderSecondaryStatusArabicNames;
  deliveryType: keyof typeof deliveryTypesArabicNames;
  clientID: number;
  deliveryAgentID: number;
  deliveryDate: string | null;
  governorate: keyof typeof governorateArabicNames;
  forwardedRepo: number | null;
  forwardedToMainRepo: boolean;
  forwardedToGov: boolean;
  location: {
    id: number;
    name: string;
  } | null;
  repository: {
    id: number;
    name: string;
  } | null;
  locationID: number;
  storeID: number;
  deliveryCost: string;
  branch: {
    id: number;
    name: string;
  } | null;
  clientNet: string;
  companyNet: string;
  deliveryAgent: {
    id: number;
    name: string;
    phone: string;
    deliveryCost: string;
  } | null;
  products: {
    productID: number;
    quantity: number;
    color: string;
    size: string;
  }[];
  deleted?: boolean;
  deletedAt?: string | null;
  deletedBy: {
    id: number;
    name: string;
  };
  clientReport:
    | {
        deleted: boolean;
        id: number;
        clientId: number;
        storeId: number;
        secondaryType: string;
      }[]
    | null;
  repositoryReport:
    | {
        deleted: boolean;
        id: number;
        repositoryId: number;
        secondaryType: string;
      }[]
    | null;
  governorateReport: {
    deleted: boolean;
    id: number;
    governorate: keyof typeof governorateArabicNames;
  };
  branchReport: {
    deleted: boolean;
    id: number;
    branchId: number;
  };
  deliveryAgentReport: {
    deleted: boolean;
    id: number;
    deliveryAgentId: number;
  };
  companyReport: {
    deleted: boolean;
    id: number;
    companyId: number;
    secondaryType: string;
  }[];
  client: {
    id: number;
    name: string;
    phone: string;
    company: string;
    showNumbers: boolean;
    showDeliveryNumber: boolean;
  };
  store: {
    id: number;
    name: string;
  };
  confirmed: boolean;
  inquiryEmployees: OrderInquiryEmployee[];
  forwarded: boolean;
  forwardedAt: string | null;
  forwardedBy: {
    id: number;
    name: string;
  } | null;
  forwardedFrom: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  processed: boolean;
  processedAt: string | null;
  processedBy: {
    id: number;
    name: string;
    phone: string;
  } | null;
}

export interface OrderInquiryEmployee {
  id: number;
  name: string;
  phone: string;
  avatar: string | null;
}

export interface OrdersMetaData {
  count: number;
  totalCost: number;
  paidAmount: number;
  clientNet: number;
  deliveryCost: number;
  countByStatus: {
    status: keyof typeof orderStatusArabicNames;
    count: number;
  }[];
}

export interface GetOrdersResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: {
    orders: Order[];
    count?: number;
    ordersMetaData: OrdersMetaData;
  };
}

export interface Filters {
  page?: number;
  size?: number;
  pagesCount?: number;
  deleted?: boolean;
  minified?: boolean;
  store_id?: string;
  client_id?: string;
  branchId?: string | null;
  type?: string;
}

export interface OrdersFilter extends Filters {
  order_id?: string;
  printed?: string | string[];
  processed?: string | null;
  processingStatus?: string | null;
  receipt_numbers?: string[];
  forwarded_by_id?: string;
  forwarded_from_id?: string;
  search?: string;
  sort?: string;
  start_date?: Date | string | null;
  end_date?: Date | string | null;
  delivery_date?: Date | string | null;
  governorate?: string;
  status?: string | string[];
  secondaryStatus?: string;
  statuses?: string[];
  secondaryStatuses?: string[];
  delivery_type?: string;
  delivery_agent_id?: string;
  client_id?: string;
  store_id?: string;
  product_id?: string;
  location_id?: string;
  receipt_number?: string;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_address?: string;
  deleted?: boolean;
  client_report?: string | null;
  repository_report?: string | null;
  branch_report?: string | null;
  delivery_agent_report?: string | null;
  governorate_report?: string | null;
  company_report?: string | null;
  branch_id?: string | null;
  automatic_update_id?: string | null;
  confirmed?: boolean;
  company_id?: string;
  repository_id?: string | null;
  from?: string;
  forwarded?: boolean;
  forwardedToGov?: boolean;
  getIncoming?: boolean;
  getOutComing?: boolean;
}

export const getOrdersService = async (
  {
    order_id,
    page = 1,
    size = 10,
    search,
    sort,
    start_date,
    end_date,
    delivery_date,
    governorate,
    status,
    delivery_type,
    delivery_agent_id,
    client_id,
    store_id,
    product_id,
    location_id,
    receipt_number,
    recipient_name,
    recipient_phone,
    recipient_address,
    deleted = false,
    statuses,
    branch_id,
    automatic_update_id,
    secondaryStatuses,
    secondaryStatus,
    confirmed = true,
    company_id,
    repository_id,
    from,
    forwarded,
    forwarded_by_id,
    forwarded_from_id,
    receipt_numbers,
    processingStatus,
    printed,
  }: OrdersFilter = { page: 1, size: 20, minified: true }
) => {
  const response = await api.get<GetOrdersResponse>("/orders", {
    params: {
      page,
      size,
      secondaryStatus: secondaryStatus || undefined,
      search: search || undefined,
      sort: sort || undefined,
      start_date: start_date || undefined,
      end_date: end_date || undefined,
      delivery_date: delivery_date || undefined,
      governorate: governorate || undefined,
      status: status || undefined,
      delivery_type: delivery_type || undefined,
      delivery_agent_id: delivery_agent_id || undefined,
      client_id: client_id || undefined,
      store_id: store_id || undefined,
      product_id: product_id || undefined,
      location_id: location_id || undefined,
      receipt_number: receipt_number || undefined,
      recipient_name: recipient_name || undefined,
      recipient_phone: recipient_phone || undefined,
      recipient_address: recipient_address || undefined,
      processingStatus: processingStatus || undefined,
      printed: printed || undefined,
      deleted,
      order_id: order_id ? order_id : undefined,
      statuses: statuses?.join(",") || undefined,
      secondaryStatuses: secondaryStatuses?.join(",") || undefined,
      branch_id: branch_id || undefined,
      automatic_update_id: automatic_update_id || undefined,
      company_id: company_id || undefined,
      repository_id: repository_id || undefined,
      forwarded: forwarded || undefined,
      forwarded_by_id: forwarded_by_id || undefined,
      forwarded_from_id: forwarded_from_id || undefined,
      receipt_numbers: receipt_numbers?.length
        ? receipt_numbers.join(",")
        : undefined,
    },
  });
  return response.data;
};
