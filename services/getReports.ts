import { api } from "@/api";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { reportStatusArabicNames } from "@/lib/reportStatusArabicNames";
import { reportTypeArabicNames } from "@/lib/reportTypeArabicNames";

export interface Report {
  id: number;
  secondaryType: string;
  status: keyof typeof reportStatusArabicNames;
  createdBy: {
    id: number;
    name: string;
  };
  type: keyof typeof reportTypeArabicNames;
  createdAt: string;
  companyNet: number;
  updatedAt: string;
  confirmed: boolean;
  companyReport: {
    reportNumber: string;
    company: {
      id: number;
      name: string;
    };
    baghdadDeliveryCost: number;
    governoratesDeliveryCost: number;
    companyReportOrders: {
      id: number;
      receiptNumber: string;
      companyReportReportNumber: string;
    }[];
  } | null;

  clientReport: {
    reportNumber: string;
    client: {
      id: number;
      name: string;
      phone: string;
    };
    store: {
      id: number;
      name: string;
    };
    branch: {
      id: number;
      name: string;
    } | null;
    baghdadDeliveryCost: number;
    governoratesDeliveryCost: number;
    clientReportOrders: {
      id: number;
      receiptNumber: string;
      clientReportReportNumber: string;
    }[];
  } | null;

  repositoryReport: {
    reportNumber: string;
    targetRepositoryId: number;
    targetRepositoryName: string;
    repository: {
      id: number;
      name: string;
    };
    repositoryReportOrders: {
      id: number;
      receiptNumber: string;
      repositoryReportReportNumber: string;
    }[];
  } | null;

  branchReport: {
    reportNumber: string;
    branch: {
      id: number;
      name: string;
    };
    deliveryAgentDeliveryCost: number;
    branchReportOrders: {
      id: number;
      receiptNumber: string;
      branchReportReportNumber: string;
    }[];
  } | null;
  governorateReport: {
    reportNumber: string;
    governorate: keyof typeof governorateArabicNames;
    deliveryAgentDeliveryCost: number;
    governorateReportOrders: {
      id: number;
      receiptNumber: string;
      governorateReportReportNumber: string;
    }[];
  } | null;
  deliveryAgentReport: {
    reportNumber: string;
    deliveryAgent: {
      id: number;
      name: string;
    };
    deliveryAgentDeliveryCost: number;
    deliveryAgentReportOrders: {
      id: number;
      receiptNumber: string;
      deliveryAgentReportReportNumber: string;
    }[];
  } | null;
  baghdadOrdersCount: number;
  governoratesOrdersCount: number;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: {
    id: number;
    name: string;
  };
}

export interface ReportsMetaData {
  reportsCount: number;
  totalCost: number;
  paidAmount: number;
  deliveryCost: number;
  baghdadOrdersCount: number;
  governoratesOrdersCount: number;
  clientNet: number;
  deliveryAgentNet: number;
  companyNet: number;
}

export interface GetReportsResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: {
    reports: Report[];
    reportsMetaData: ReportsMetaData;
  };
}

export interface ReportsFilters {
  page?: number;
  size?: number;
  start_date?: Date | string | null;
  sort?: string;
  end_date?: Date | string | null;
  client_id?: string;
  store_id?: string;
  governorate?: string;
  status?: string;
  type?: string;
  types?: (keyof typeof reportTypeArabicNames)[];
  created_by_id?: string;
  company_id?: string;
}

export const getReportsService = async (
  {
    start_date,
    end_date,
    client_id,
    store_id,
    governorate,
    status,
    type,
    page = 1,
    size = 10,
    created_by_id,
    types,
  }: ReportsFilters = { page: 1, size: 10 }
) => {
  const response = await api.get<GetReportsResponse>("/reports", {
    params: {
      start_date: start_date || undefined,
      end_date: end_date || undefined,
      client_id: client_id || undefined,
      store_id: store_id || undefined,
      governorate: governorate || undefined,
      status: status || undefined,
      type: type || undefined,
      page,
      size,
      created_by_id: created_by_id || undefined,
      types: types?.join(",") || undefined,
      deleted: false,
    },
  });
  return response.data;
};
