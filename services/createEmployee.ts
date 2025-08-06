import { api } from "@/api";

const clientAssistantPermissions = {
  ADD_ORDER: "اضافه الطلبات",
  PRINT_ORDER: "طباعه الطلبات",
  SEND_ORDER: "ارسال للشحن",
  MESSAGES: "الرسائل",
  MANAGE_ORDERS: "متابعه الطلبات",
  MANAGE_REPORTS: "اداره الكشوفات",
  MANAGE_TICKETS: "اداره التذاكر",
};

export const clientAssistantPermissionsArray: {
  label: string;
  value: string;
}[] = Object.entries(clientAssistantPermissions).map(([value, label]) => ({
  label,
  value,
}));

export const createEmployeeService = async (data: FormData) => {
  const response = await api.post<FormData>("/employees", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
