import { getStatusCLientsService } from "@/services/getOrdersStatisticsService";
import { useQuery } from "@tanstack/react-query";

export const useStatusClients = (status: string) => {
  return useQuery({
    queryKey: ["statusClients", status],
    queryFn: () => getStatusCLientsService(status),
  });
};
