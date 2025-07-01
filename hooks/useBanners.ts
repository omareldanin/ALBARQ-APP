import { getBannersService } from "@/services/getBannersService";
import { useQuery } from "@tanstack/react-query";

export const useBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () => getBannersService(),
  });
};
