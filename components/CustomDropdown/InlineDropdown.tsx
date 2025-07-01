import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  data: { label: string; value: string }[];
  onSelect: (value: string) => void;
  placeholder: string;
}

const InlineDropdown = ({ data, onSelect, placeholder }: Props) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  useEffect(() => {
    if (data.length === 1) {
      setSelectedValue(data[0].label);
    }
  }, [data]);
  const handleSelect = (value: string, label: string) => {
    setSelectedValue(label);
    onSelect(value);
    toggleDropdown();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        <Text style={styles.buttonText}>{selectedValue || placeholder}</Text>
      </TouchableOpacity>
      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <FlatList
            data={data}
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
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
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
  dropdown: {
    position: "absolute",
    width: "100%",
    top: "100%",
    marginTop: 5,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    maxHeight: 300,
    zIndex: 222,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f7f7f7",
  },
  optionText: {
    fontSize: 16,
    textAlign: "right",
    fontFamily: "Cairo",
  },
});

export default InlineDropdown;
