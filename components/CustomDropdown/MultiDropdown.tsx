import { useThemeStore } from "@/store/themeStore";
import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Option {
  label: string;
  value: string;
}

interface Props {
  data: Option[];
  onSelect: (values: string[]) => void;
  placeholder: string;
  selectedValues: string[];
}

const ModalMultiDropdown = ({
  data,
  onSelect,
  placeholder,
  selectedValues,
}: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { theme } = useThemeStore();
  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleToggleSelection = (value: string) => {
    const updated = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onSelect(updated);
  };

  const filteredOptions = data.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const getSelectedLabels = () =>
    data
      .filter((item) => selectedValues.includes(item.value))
      .map((item) => item.label)
      .join(", ");

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#31404e" : "#fff" },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            borderColor: theme === "dark" ? "grey" : "#f7f7f7",
          },
        ]}
        onPress={toggleModal}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color:
                selectedValues.length > 0 && theme === "dark"
                  ? "#ccc"
                  : selectedValues.length > 0
                    ? "#000"
                    : "grey",
            },
          ]}
        >
          {selectedValues.length > 0 ? getSelectedLabels() : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="ابحث..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                const isSelected = selectedValues.includes(item.value);
                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleToggleSelection(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonText: {
    color: "#000",
    textAlign: "right",
    fontFamily: "Cairo",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    height: "60%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionSelected: {
    backgroundColor: "#e0f7fa",
  },
  optionText: {
    fontSize: 16,
    textAlign: "right",
    fontFamily: "Cairo",
    color: "#000",
  },
  optionTextSelected: {
    color: "#00796B",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e74c3c",
    borderRadius: 5,
  },
  closeText: {
    color: "white",
    textAlign: "center",
  },
});

export default ModalMultiDropdown;
