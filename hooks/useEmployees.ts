import {
  type Filters,
  getEmployeesService,
} from "@/services/getEmployeesService";
import { useQuery } from "@tanstack/react-query";

export interface EmployeesFilters extends Filters {
  branch_id?: string | null;
  location_id?: string | null;
  phone?: string;
  name?: string;
}

export const useEmployees = (
  { page = 1, size = 10 }: EmployeesFilters = {
    page: 1,
    size: 10,
  }
) => {
  return useQuery({
    queryKey: ["employees", { page }],
    queryFn: () => getEmployeesService(page, size),
  });
};
