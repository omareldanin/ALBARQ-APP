import { api } from "@/api";

export const deleteEmployeeService = async ({ id }: { id: number }) => {
  const response = await api.delete("/employees/" + id);
  return response.data;
};
