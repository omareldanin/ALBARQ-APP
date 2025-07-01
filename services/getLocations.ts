import { api } from "@/api";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";

export interface Location {
  id: number;
  name: string;
  governorate: keyof typeof governorateArabicNames;
}

export interface GetLocationsResponse {
  status: string;
  page: number;
  pagesCount: number;
  data: Location[];
}

export const getLocationsService = async () => {
  const response = await api.get<GetLocationsResponse>("/locations", {
    params: {
      minified: true,
    },
  });
  return response.data;
};
