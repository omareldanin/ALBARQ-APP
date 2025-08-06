import { api } from "@/api";

export interface IEditEmployeePayload {
  data: FormData;
  id: number;
}

export const editEmployeeService = async ({
  data,
  id,
}: IEditEmployeePayload) => {
  const response = await api.patch<FormData>("/employees/" + id, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
