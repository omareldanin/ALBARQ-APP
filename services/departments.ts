import { api } from "@/api";

type employee = {
  user: {
    id: number;
    name: string;
  };
};
export interface Department {
  id: number;
  name: string;
  createdBy: string;
  employees: employee[];
}

export interface GetDepartmentResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: Department[];
}

export const getDepartmentService = async ({ page = 1, size = 10 }) => {
  const response = await api.get<GetDepartmentResponse>("/department", {
    params: {
      page,
      size,
    },
  });
  return response.data;
};
