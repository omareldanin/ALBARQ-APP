import { useState } from "react";
import {
  FlatList,
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
  setValue: (value: string) => void;
  value?: string | null;
}

export default function NativeSearchableSelect({
  options,
  label,
  setValue,
  value,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (value: string, label: string) => {
    setValue(value);
    setModalVisible(false);
    setSearch(""); // reset search
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.selectBox} onPress={() => setModalVisible(true)}>
        <Text style={styles.selectText}>{value || label}</Text>
      </Pressable>
      {/* <Pressable
        style={{
          position: "absolute",
          [!I18nManager.isRTL ? "left" : "right"]: 0,
          top: 12,
          zIndex: 1000,
          width: 40,
        }}
        onPress={reset}
      >
        <Feather name="x" size={24} color="grey" />
      </Pressable> */}

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
                  onPress={() => handleSelect(item.value, item.label)}
                >
                  <Text>{item.label}</Text>
                </Pressable>
              )}
              ListEmptyComponent={<Text>لا يوجد</Text>}
            />
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>الغاء</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 0, marginBottom: 0, direction: "rtl" },
  selectBox: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderColor: "#f7f7f7",
    color: "grey",
    borderWidth: 1,
  },
  selectText: {
    color: "grey",
    fontFamily: "Cairo",
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
