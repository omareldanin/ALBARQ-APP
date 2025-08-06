import { APIError } from "@/api";
import {
  closeTicketService,
  createTicketService,
  forwardTicketService,
  getAllTicketService,
  getOneTicket,
  sendResponseService,
  takeTicketService,
  TicketFilters,
} from "@/services/ticketService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Toast from "react-native-toast-message";

export const useGetAllTickets = (filter: TicketFilters, enabled = true) => {
  return useQuery({
    queryKey: [
      "tickets",
      {
        page: filter.page || 1,
        size: 10,
        ...filter,
      },
    ],
    queryFn: () =>
      getAllTicketService({
        page: filter.page || 1,
        size: filter.size || 10,
        ...filter,
      }),

    enabled,
  });
};

export const useGetOneTicket = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ["ticket"],
    queryFn: () => getOneTicket(id),

    enabled,
  });
};

export const useCreateTicket = () => {
  return useMutation({
    mutationFn: (data: FormData) => {
      return createTicketService(data);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "تم بنجاح",
        text2: "تم انشاء التذكره بنجاح",
        position: "top",
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

export const useSendResponse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => {
      return sendResponseService(data);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "تم بنجاح",
        text2: "تم ارسال ردك بنجاح",
        position: "top",
      });
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["ticket"],
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
export const useCloseTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => {
      return closeTicketService(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["ticket"],
      });
      Toast.show({
        type: "success",
        text1: "تم بنجاح",
        text2: "تم اغلاق التذكره بنجاح",
        position: "top",
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

export const useForwardTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => {
      return forwardTicketService(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
      Toast.show({
        type: "success",
        text1: "تم بنجاح",
        text2: "تم تحويل التذكره بنجاح",
        position: "top",
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

export const useTakeTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | undefined) => {
      return takeTicketService(id);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "تم بنجاح",
        text2: "تم استلام التذكره بنجاح",
        position: "top",
      });
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["ticket"],
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
