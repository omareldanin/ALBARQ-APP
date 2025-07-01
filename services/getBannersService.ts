import { api } from "@/api";

export interface Banner {
  id: number;
  title: string;
  content: string;
  image: string;
  url: string;
  createdAt: string;
  company: {
    id: number;
    name: string;
  };
}

export interface GetBannersResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: Banner[];
}

export const getBannersService = async () => {
  const response = await api.get<GetBannersResponse>("/banners");
  return response.data;
};
