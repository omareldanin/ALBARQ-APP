import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
];

interface Props {
  data: { label: string; value: string }[];
  onSelect: (value: string) => void;
}

export default function MyRadioGroup({ data, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(data[0].value);

  return (
    <View style={styles.container}>
      {data.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioContainer}
          onPress={() => {
            setSelected(opt.value);
            onSelect(opt.value);
          }}
        >
          <View style={styles.radioCircle}>
            {selected === opt.value && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.radioLabel}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    direction: "rtl",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    width: "50%",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#a91101",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#a91101",
  },
  radioLabel: {
    marginRight: 10,
    fontSize: 16,
  },
});
