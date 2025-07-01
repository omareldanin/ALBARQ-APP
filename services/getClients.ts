import { api } from "@/api";

export interface Client {
  id: number;
  name: string;
}

export interface GetClientsResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: Client[];
}

export const getClientsService = async () => {
  const response = await api.get<GetClientsResponse>("/clients", {
    params: {
      deleted: false,
      minified: true,
    },
  });
  return response.data;
};
