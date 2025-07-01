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

interface Props {
  data: { label: string; value: string }[];
  onSelect: (value: string) => void;
  placeholder: string;
}
const ModalDropdown = ({ data, onSelect, placeholder }: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredOptions = data.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleSelect = (value: string, label: string) => {
    setSelectedValue(label);
    onSelect(value);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>{selectedValue || placeholder}</Text>
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
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item.value, item.label)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeText}>إالغاء</Text>
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
    backgroundColor: "#fff",
    borderColor: "#f7f7f7",
    borderWidth: 1,
    color: "grey",
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
    height: "50%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f9f8f8",
  },
  optionText: {
    fontSize: 16,
    textAlign: "right",
    fontFamily: "Cairo",
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
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
});

export default ModalDropdown;
