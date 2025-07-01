import {
  closeTicketService,
  createTicketService,
  forwardTicketService,
  getAllTicketService,
  sendResponseService,
  takeTicketService,
  TicketFilters,
} from "@/services/ticketService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => {
      return createTicketService(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
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
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
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
    },
  });
};

export const useTakeTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => {
      return takeTicketService(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    },
  });
};
