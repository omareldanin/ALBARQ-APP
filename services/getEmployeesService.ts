import { api } from "@/api";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";

export interface Employee {
  id: number;
  name: string;
  username: string;
  phone: string;
  clientAssistantRole: string;
  salary: number;
  emergency?: boolean | undefined;
  avatar: string | null;
  idCard: string | null;
  residencyCard: string | null;
  orderStatus: (keyof typeof orderStatusArabicNames)[];
  permissions: string[];
  branch: {
    id: number;
    name: string;
    email: string;
    phone: string;
    governorate: string;
    createdAt: string;
    updatedAt: string;
  };
  deliveryCost: number;
  company: {
    id: number;
    name: string;
    logo: string | null;
  };
  repository: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    branchId: string;
  };
  deleted?: boolean;
  deletedBy?: {
    id: number;
    name: string;
  };
  deletedAt?: string;
  managedStores: {
    id: number;
    name: string;
  }[];
  inquiryBranches: {
    id: number;
    name: string;
  }[];
  inquiryLocations: {
    id: number;
    name: string;
  }[];
  inquiryCompanies: {
    id: number;
    name: string;
  }[];
  inquiryStores: {
    id: number;
    name: string;
  }[];
  inquiryClients: {
    id: number;
    name: string;
  }[];
  inquiryGovernorates: string[];
  inquiryStatuses: string[];
  createdBy: {
    id: number;
    name: string;
  } | null;
}

export interface GetEmployeesResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: Employee[];
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

export const getEmployeesService = async (page: number, size: number) => {
  const response = await api.get<GetEmployeesResponse>("/employees", {
    params: {
      page,
      size,
      deleted: false,
    },
  });

  return response.data;
};
