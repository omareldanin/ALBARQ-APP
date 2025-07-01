import { APIError } from "@/api";
import { deactivateOrderService } from "@/services/deactivateOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import Toast from "react-native-toast-message";

export const useDeactivateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateOrderService({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["statusClients", ""],
      });
    },
    onError: (error: AxiosError<APIError>) => {
      Toast.show({
        type: "error",
        text1: "حدث خطأ ❌",
        text2: error.response?.data.message || "حدث خطأ ما",
        position: "top",
      });
    },
  });
};
