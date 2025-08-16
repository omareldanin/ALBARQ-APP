import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import type {
  OrdersFilter as IOrdersFilter,
  Order,
} from "@/services/getOrders";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  I18nManager,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface Props {
  options: { value: string; label: string }[];
  label: string;
  setFilters: React.Dispatch<React.SetStateAction<IOrdersFilter>>;
  setOrdersData: React.Dispatch<React.SetStateAction<Order[]>>;
  filters: IOrdersFilter;
  filterKey: string;
  value: string | undefined;
}

export default function NativeSearchableSelect({
  options,
  label,
  filters,
  setFilters,
  filterKey,
  setOrdersData,
  value,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: string) => {
    setOrdersData([]);
    if (filterKey === "government") {
      setSelectedValue(item);
      setSelected(
        governorateArabicNames[item as keyof typeof governorateArabicNames]
      );
      setFilters((pre) => ({ ...pre, governorate: item, page: 1 }));
    }
    if (filterKey === "location") {
      setSelectedValue(item);
      setFilters((pre) => ({ ...pre, location_id: item, page: 1 }));
    }
    if (filterKey === "store") {
      setSelectedValue(item);
      setFilters((pre) => ({ ...pre, store_id: item, page: 1 }));
    }
    if (filterKey === "processing") {
      setSelectedValue(item);
      setFilters((pre) => ({ ...pre, processingStatus: item, page: 1 }));
    }
    setModalVisible(false);
    setSearch(""); // reset search
  };

  const reset = () => {
    if (filterKey === "government") {
      setOrdersData([]);
      setFilters((pre) => ({ ...pre, governorate: "", page: 1 }));
    }
    if (filterKey === "location") {
      setOrdersData([]);
      setFilters((pre) => ({ ...pre, location_id: "", page: 1 }));
    }
    if (filterKey === "store") {
      setOrdersData([]);
      setFilters((pre) => ({ ...pre, store_id: "", page: 1 }));
    }
    if (filterKey === "processing") {
      setOrdersData([]);
      setFilters((pre) => ({ ...pre, processingStatus: "", page: 1 }));
    }
  };
  return (
    <View style={styles.container}>
      <Pressable style={styles.selectBox} onPress={() => setModalVisible(true)}>
        <Text style={styles.selectText}>{value || label}</Text>
      </Pressable>
      {selectedValue && (
        <Pressable
          style={{
            position: "absolute",
            [!I18nManager.isRTL ? "left" : "right"]: 10,
            top: 12,
            zIndex: 1000,
            width: 40,
          }}
          onPress={() => {
            reset();
            setSelectedValue(null);
          }}>
          <Feather name="x" size={24} color="grey" />
        </Pressable>
      )}

      <Modal animationType="slide" visible={modalVisible} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="ابحث..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.optionItem}
                  onPress={() => handleSelect(item.value)}>
                  <Text>{item.label}</Text>
                </Pressable>
              )}
              ListEmptyComponent={<Text>لا يوجد</Text>}
            />
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeBtn}>
              <Text style={styles.closeText}>الغاء</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 0, marginBottom: 15 },
  selectBox: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderColor: "#DADADA",
    color: "grey",
    borderWidth: 1,
  },
  selectText: {
    textAlign: "left",
    color: "grey",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    maxHeight: "80%",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  optionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeBtn: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  closeText: {
    color: "#A91101",
    fontWeight: "bold",
  },
});
