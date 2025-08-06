import { api } from "@/api";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import { orderSecondaryStatusArabicNames } from "./orderSecondaryStatusArabicNames";

export interface Ticket {
  id: number;
  clientId: number;
  companyId: number;
  closed: boolean;
  forwarded: boolean;
  content: string;
  Department: {
    id: number;
    name: string;
  };
  Employee: {
    user: {
      id: number;
      name: string;
    };
  };
  Order: {
    receiptNumber: string;
    status: keyof typeof orderStatusArabicNames;
    secondaryStatus: keyof typeof orderSecondaryStatusArabicNames;
    recipientAddress: string;
    governorate: keyof typeof governorateArabicNames;
    location: {
      id: number;
      name: string;
    };
    recipientPhones: string[];
    branch: {
      id: number;
      name: string;
    };
    client: {
      showNumbers?: boolean;
      showDeliveryNumber?: boolean;
      user: {
        id: number;
        name: string;
        phone: string;
      };
    };
    deliveryAgent: {
      user: {
        id: number;
        name: string;
        phone: string;
      };
    };
  };
  createdBy: {
    id: number;
    name: string;
  };
  ticketResponse: {
    id: number;
    content: string;
    createdBy: {
      id: number;
      name: string;
    };
  }[];
  Client: {
    user: {
      id: number;
      name: string;
      phone: string;
    };
  };
}

export interface GetTicketResponse {
  status: string;
  page: number;
  pagesCount: number;
  count?: number;
  data: Ticket[];
}

export interface TicketFilters {
  page?: number;
  size?: number;
  status?: keyof typeof orderStatusArabicNames;
  closed?: string;
  forwarded?: string;
  userTickets?: string;
}
export const createTicketService = async (data: FormData) => {
  const response = await api.post<FormData>("/ticket", data);
  return response.data;
};

export const sendResponseService = async (data: FormData) => {
  const response = await api.post<FormData>("/ticket-response", data);
  return response.data;
};

export const closeTicketService = async (data: FormData) => {
  const response = await api.patch<FormData>(
    "/ticket/" + data.get("ticketId"),
    data
  );
  return response.data;
};

export const forwardTicketService = async (data: FormData) => {
  const response = await api.patch<FormData>(
    "/forward-ticket/" + data.get("ticketId"),
    data
  );
  return response.data;
};

export const takeTicketService = async (id: number | undefined) => {
  const response = await api.post("/take-ticket/" + id);
  return response.data;
};

export const getAllTicketService = async (
  {
    page = 1,
    size = 10,
    status,
    closed,
    forwarded,
    userTickets,
  }: TicketFilters = { size: 10, page: 1 }
) => {
  const response = await api.get<GetTicketResponse>("/ticket", {
    params: {
      page,
      size,
      status: status || undefined,
      closed: closed || undefined,
      forwarded: forwarded || undefined,
      userTickets: userTickets || undefined,
    },
  });
  return response.data;
};

export const getOneTicket = async (id: number) => {
  const response = await api.get<{ status: string; data: Ticket }>(
    "/ticket/" + id
  );
  return response.data;
};
