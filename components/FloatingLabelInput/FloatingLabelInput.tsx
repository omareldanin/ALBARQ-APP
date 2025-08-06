import { useThemeStore } from "@/store/themeStore";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  I18nManager,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  length?: number;
  required?: boolean;
}

export default function FloatingLabelInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  length,
  required,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;
  const { theme } = useThemeStore();

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute" as const,
    [!I18nManager.isRTL ? "right" : "left"]: 10,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [12, -10],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 12],
    }),
    color: isFocused ? "#a91101" : "#999",
    backgroundColor: theme === "dark" ? "#31404e" : "#fff",
    paddingHorizontal: 4,
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused
            ? "#a91101"
            : theme === "dark"
              ? "grey"
              : "#f7f7f7",
          backgroundColor: theme === "dark" ? "#31404e" : "#fff",
        },
      ]}
    >
      <Animated.Text style={labelStyle}>
        {required ? label + " * " : label}
      </Animated.Text>

      <TextInput
        secureTextEntry={secureTextEntry && !showPassword}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.input,
          {
            color: theme === "dark" ? "#ccc" : "#000",
          },
        ]}
        placeholder=""
        maxLength={length}
      />

      {secureTextEntry && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <Entypo name="eye-with-line" size={24} color="grey" />
          ) : (
            <AntDesign name="eye" size={24} color="grey" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 3,
    paddingBottom: 3,
    padding: 5,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 50,
  },
  input: {
    fontSize: 15,
    paddingTop: Platform.OS === "ios" ? 10 : 8,
    paddingBottom: Platform.OS === "ios" ? 10 : 5,
    fontFamily: "Cairo",
    textAlign: "right",
    writingDirection: "rtl",
  },
  eyeIcon: {
    position: "absolute",
    [!I18nManager.isRTL ? "left" : "right"]: 10,
    top: "50%",
    transform: [{ translateY: -13 }],
    padding: 5,
    zIndex: 10,
  },
});
