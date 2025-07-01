import { api } from "@/api";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";

export interface ordersStatisticsByStatus {
  status: keyof typeof orderStatusArabicNames;
  name: string;
  icon: string;
  inside: boolean;
  totalCost: string;
  count: number;
}
export interface OrdersStatistics {
  ordersStatisticsByStatus: {
    status: keyof typeof orderStatusArabicNames;
    name: string;
    icon: string;
    inside: boolean;
    totalCost: string;
    count: number;
  }[];
  ordersStatisticsByGovernorate: {
    governorate: keyof typeof governorateArabicNames;
    totalCost: string;
    count: number;
  }[];
  allOrdersStatistics: {
    totalCost: string;
    count: number;
  };
  allOrdersStatisticsWithoutClientReport: {
    totalCost: string;
    count: number;
  };
  allOrdersStatisticsWithoutDeliveryReport: {
    totalCost: number;
    deliveryCost: number;
    count: number;
  };
  todayOrdersStatistics: {
    totalCost: string;
    count: number;
  };
}

export interface OrdersStatisticsResponse {
  status: string;
  data: OrdersStatistics;
}

export interface OrdersStatusStatisticsResponse {
  status: string;
  data: {
    status: keyof typeof orderStatusArabicNames;
    name: string;
    icon: string;
    inside: boolean;
    totalCost: string;
    count: number;
  }[];
}

export const getOrdersStatisticsService = async () => {
  const response =
    await api.get<OrdersStatisticsResponse>("/orders/statistics");
  return response.data;
};

export const getStatusStatisticsService = async (status: string) => {
  const response = await api.get<OrdersStatusStatisticsResponse>(
    "/orders/statusStatistics",
    {
      params: {
        status: status,
      },
    }
  );

  return response.data;
};

export interface ClientsStatisticsResponse {
  status: string;
  data: {
    count: number;
    clientId: number;
    clientName: string | undefined;
  }[];
}

export const getStatusCLientsService = async (status: string) => {
  const response = await api.get<ClientsStatisticsResponse>(
    "/orders/clientStatistics",
    {
      params: {
        status: status,
      },
    }
  );

  return response.data;
};
