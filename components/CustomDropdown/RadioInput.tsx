import { useThemeStore } from "@/store/themeStore";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  data: { label: string; value: string }[];
  onSelect: (value: string) => void;
  value?: string;
}

export default function MyRadioGroup({ data, onSelect, value }: Props) {
  const { theme } = useThemeStore();
  return (
    <View style={styles.container}>
      {data.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioContainer}
          onPress={() => {
            onSelect(opt.value);
          }}
        >
          <View style={styles.radioCircle}>
            {value === opt.value && <View style={styles.radioDot} />}
          </View>
          <Text
            style={[
              styles.radioLabel,
              { color: theme === "dark" ? "#fff" : "#000" },
            ]}
          >
            {opt.label}
          </Text>
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
    gap: 15,
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
    fontSize: 16,
  },
});
