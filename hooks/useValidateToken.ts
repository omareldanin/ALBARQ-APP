import { validateToken } from "@/services/signInService";
import { useQuery } from "@tanstack/react-query";

export const useValidateToken = () => {
  return useQuery({
    queryKey: ["validateToken"],
    queryFn: () => validateToken(),
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    retry: false,
  });
};
