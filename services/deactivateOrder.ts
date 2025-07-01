import { api } from "@/api";

export const deactivateOrderService = async ({ id }: { id: string }) => {
  const response = await api.patch(`/orders/${id}/deactivate`);
  return response.data;
};
