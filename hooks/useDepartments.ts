import { getDepartmentService } from "@/services/departments";
import { useQuery } from "@tanstack/react-query";

export function useDepartments({ page = 1, size = 10 }, enabled = true) {
  return useQuery({
    queryKey: ["departments", { page, size }],
    queryFn: () =>
      getDepartmentService({
        page,
        size,
      }),
    enabled,
  });
}
