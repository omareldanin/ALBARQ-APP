import { api } from "@/api";

export interface Store {
  id: number;
  name: string;
}

export interface GetStoresResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: Store[];
}

export const getStoresService = async () => {
  const response = await api.get<GetStoresResponse>("/stores", {
    params: {
      deleted: false,
      minified: true,
    },
  });
  return response.data;
};
