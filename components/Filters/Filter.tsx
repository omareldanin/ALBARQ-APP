import {
  governorateArabicNames,
  governorateArray,
} from "@/lib/governorateArabicNames ";
import type {
  OrdersFilter as IOrdersFilter,
  Order,
} from "@/services/getOrders";
import { useLocationStore } from "@/store/locationStore";
import { useStoreStore } from "@/store/storeStore";
import styles from "@/styles/filter";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import NativeSearchableSelect from "./dropDown";

interface Props {
  isVisible: boolean;
  orderFilters: IOrdersFilter;

  close: () => void;
  setFilters: React.Dispatch<React.SetStateAction<IOrdersFilter>>;
  setOrdersData: React.Dispatch<React.SetStateAction<Order[]>>;
}

const processingStatus = [
  {
    value: "not_processed",
    label: "غير معالج",
  },
  {
    value: "processed",
    label: "معالج",
  },
  {
    value: "confirmed",
    label: "مؤكد",
  },
];
export const Filters = ({
  isVisible,
  close,
  orderFilters,
  setFilters,
  setOrdersData,
}: Props) => {
  const { locations } = useLocationStore();
  const { stores } = useStoreStore();
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

            {/* <DateInput
              title={orderFilters.start_date?.toLocaleString() || "من تاريخ"}
              onChange={(e, date) => {
                setOrdersData([]);
                setFilters((pre) => ({ ...pre, start_date: date }));
              }}
            /> */}
            <TextInput
              placeholder="رقم الهاتف , رقم الوصل , الاسم"
              style={[styles.input]}
              value={orderFilters.search}
              placeholderTextColor={"grey"}
              returnKeyType="next"
              onChangeText={(text) => {
                setOrdersData([]);
                setFilters((pre) => ({ ...pre, search: text, page: 1 }));
              }}
            />
            <NativeSearchableSelect
              options={governorateArray}
              label="المحافظه"
              filters={orderFilters}
              setFilters={setFilters}
              setOrdersData={setOrdersData}
              filterKey={"government"}
              value={
                orderFilters.governorate
                  ? governorateArabicNames[
                      orderFilters.governorate as keyof typeof governorateArabicNames
                    ]
                  : "ألمحافظه"
              }
            />
            <NativeSearchableSelect
              options={locations
                .filter(
                  (i) =>
                    orderFilters.governorate !== "" &&
                    orderFilters.governorate === i.governorate
                )
                .map((l) => ({
                  value: l.id + "",
                  label: l.name,
                }))}
              label="المنطفه"
              filters={orderFilters}
              setFilters={setFilters}
              setOrdersData={setOrdersData}
              filterKey={"location"}
              value={
                locations.find(
                  (l) =>
                    orderFilters.location_id &&
                    l.id === +orderFilters.location_id
                )?.name || "المنطقه"
              }
            />
            <NativeSearchableSelect
              options={stores.map((l) => ({
                value: l.id + "",
                label: l.name,
              }))}
              label="المتجر"
              filters={orderFilters}
              setFilters={setFilters}
              setOrdersData={setOrdersData}
              filterKey={"store"}
              value={
                stores.find(
                  (l) =>
                    orderFilters.store_id && l.id === +orderFilters.store_id
                )?.name || "المتجر"
              }
            />
            <NativeSearchableSelect
              options={processingStatus}
              label="حاله المعالجه"
              filters={orderFilters}
              setFilters={setFilters}
              setOrdersData={setOrdersData}
              filterKey={"processing"}
              value={
                processingStatus.find(
                  (l) => l.value === orderFilters.processingStatus
                )?.label || "حاله المعالجه"
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
