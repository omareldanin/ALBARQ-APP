import { api } from "@/api";

export interface ChangeReportStatusPayload {
  confirmed: boolean;
}

export const editReportService = async (
  reportId: number,
  payload: ChangeReportStatusPayload
) => {
  const response = await api.patch(`${"/reports/"}${reportId}`, payload);
  return response.data;
};
