import { Report, ReportsFilters } from "@/services/getReports";
import { useStoreStore } from "@/store/storeStore";
import styles from "@/styles/filter";
import { Text, View } from "react-native";
import Modal from "react-native-modal";
import NativeSearchableSelect from "../AddOptions/dropDown";
import DateInput from "./DateInput";

interface Props {
  isVisible: boolean;
  orderFilters: ReportsFilters;

  close: () => void;
  setFilters: React.Dispatch<React.SetStateAction<ReportsFilters>>;
  setReportsData: React.Dispatch<React.SetStateAction<Report[]>>;
}

export const Filters = ({
  isVisible,
  close,
  orderFilters,
  setFilters,
  setReportsData,
}: Props) => {
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
        animationOut="slideOutDown">
        <View style={styles.modalContent}>
          <View>
            <Text
              style={{
                fontFamily: "CairoBold",
                color: "#a91101",
                marginBottom: 10,
                textAlign: "center",
              }}>
              تصفيه
            </Text>

            <DateInput
              title={
                orderFilters.start_date
                  ? orderFilters.start_date?.toISOString().split("T")[0]
                  : "من تاريخ"
              }
              onChange={(date) => {
                setReportsData([]);
                setFilters((pre) => ({ ...pre, start_date: date }));
              }}
              reset={() =>
                setFilters((pre) => ({ ...pre, start_date: undefined }))
              }
            />
            <DateInput
              title={
                orderFilters.end_date
                  ? orderFilters.end_date?.toISOString().split("T")[0]
                  : "الي تاريخ"
              }
              onChange={(date) => {
                setReportsData([]);
                setFilters((pre) => ({ ...pre, end_date: date, page: 1 }));
              }}
              reset={() =>
                setFilters((pre) => ({ ...pre, end_date: undefined, page: 1 }))
              }
            />
            <NativeSearchableSelect
              options={stores.map((s) => ({
                value: s.id + "",
                label: s.name,
              }))}
              label="اختر المتجر"
              setValue={(value) => {
                setFilters((pre) => ({ ...pre, store_id: value, page: 1 }));
              }}
              value={
                orderFilters.store_id
                  ? stores.find((s) => s.id === +orderFilters.store_id!)?.name
                  : null
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
