import {
  orderStatusArabicNames,
  orderStatusArray,
} from "@/lib/orderStatusArabicNames";
import { Ticket, TicketFilters } from "@/services/ticketService";
import { useAuth } from "@/store/authStore";
import styles from "@/styles/filter";
import { Text, View } from "react-native";
import Modal from "react-native-modal";
import NativeSearchableSelect from "../AddOptions/dropDown";

interface Props {
  isVisible: boolean;
  ticketFilters: TicketFilters;

  close: () => void;
  setFilters: React.Dispatch<React.SetStateAction<TicketFilters>>;
  setTicketsData: React.Dispatch<React.SetStateAction<Ticket[]>>;
}
const ticketsTypes = [
  {
    value: "user",
    label: "مستلمه",
  },
  {
    value: "open",
    label: "مفتوحه",
  },
  {
    value: "forward",
    label: "محوله",
  },
  {
    value: "closed",
    label: "مغلقة",
  },
];

const clientTicketsTypes = [
  {
    value: "open",
    label: "مفتوحه",
  },
  {
    value: "closed",
    label: "مغلقة",
  },
];
export const Filters = ({
  isVisible,
  close,
  ticketFilters,
  setFilters,
  setTicketsData,
}: Props) => {
  const { role } = useAuth();
  return (
    <View style={styles.container}>
      <Modal
        isVisible={isVisible}
        onBackdropPress={close}
        onBackButtonPress={close}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={close}
        backdropOpacity={0.4}
        backdropTransitionOutTiming={0} // prevent flicker on close
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContent}>
          <View>
            <Text
              style={{
                fontFamily: "CairoBold",
                color: "#a91101",
                marginBottom: 10,
              }}
            >
              تصفيه
            </Text>
          </View>
          <View style={{ marginBottom: 20 }}>
            <NativeSearchableSelect
              options={
                role === "INQUIRY_EMPLOYEE" ? ticketsTypes : clientTicketsTypes
              }
              label="نوع التذاكر"
              setValue={(value) => {
                setTicketsData([]);
                if (value === "user") {
                  setFilters((pre) => ({
                    ...pre,
                    closed: "false",
                    userTickets: "true",
                    forwarded: "false",
                    page: 1,
                  }));
                } else if (value === "forward") {
                  setFilters((pre) => ({
                    ...pre,
                    closed: "false",
                    userTickets: "false",
                    forwarded: "true",
                    page: 1,
                  }));
                } else if (value === "open") {
                  setFilters((pre) => ({
                    ...pre,
                    closed: "false",
                    userTickets: "false",
                    forwarded: "false",
                    page: 1,
                  }));
                } else if (value === "closed") {
                  setFilters((pre) => ({
                    ...pre,
                    closed: "true",
                    userTickets: "false",
                    forwarded: "false",
                    page: 1,
                  }));
                } else {
                  setFilters((pre) => ({
                    ...pre,
                    closed: "false",
                    userTickets: "false",
                    forwarded: "false",
                    page: 1,
                  }));
                }
              }}
              value={
                ticketFilters.userTickets === "true"
                  ? "المستلمه"
                  : ticketFilters.forwarded === "true"
                    ? "المحوله"
                    : ticketFilters.closed === "true"
                      ? "المغلقه"
                      : "المفتوحه"
              }
            />
          </View>
          <NativeSearchableSelect
            options={orderStatusArray}
            label="اختر الحاله"
            setValue={(value) => {
              if (value !== "") {
                setTicketsData([]);
                setFilters((pre) => ({
                  ...pre,
                  status: value as keyof typeof orderStatusArabicNames,
                  page: 1,
                }));
              } else {
                setTicketsData([]);
                setFilters((pre) => ({ ...pre, status: undefined, page: 1 }));
              }
            }}
            value={
              ticketFilters.status
                ? orderStatusArabicNames[ticketFilters.status]
                : null
            }
          />
        </View>
      </Modal>
    </View>
  );
};
