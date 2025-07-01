import { api } from "@/api";

export interface Branch {
  id: number;
  name: string;
}

export interface GetRepositoriesResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: Branch[];
}

export const getBranchesService = async () => {
  const response = await api.get<GetRepositoriesResponse>("/branches", {
    params: {
      minified: true,
    },
  });
  return response.data;
};
