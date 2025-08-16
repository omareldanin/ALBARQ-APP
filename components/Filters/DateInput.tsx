import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { I18nManager, Modal, Pressable, Text, View } from "react-native";

import DatePicker from "react-native-ui-datepicker";

interface Props {
  title: string;
  onChange: (selectedDate?: Date) => void;
  reset: () => void;
}
export default function DateInput({ title, onChange, reset }: Props) {
  const [date, setDate] = useState(dayjs());
  const [show, setShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [pickerReady, setPickerReady] = useState(false);

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setPickerReady(true), 50);
      return () => clearTimeout(t);
    } else {
      setPickerReady(false);
    }
  }, [show]);

  return (
    <View style={{ marginBottom: 15 }}>
      <Pressable
        onPress={() => setShow(true)}
        style={{
          padding: 15,
          borderRadius: 8,
          backgroundColor: "#fff",
          borderColor: "#ccc",
          borderWidth: 1,
        }}>
        <Text
          style={{
            color: "grey",
            textAlign: "left",
          }}>
          {title}
        </Text>
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
      {show && pickerReady && (
        <Modal transparent={true} animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "#00000088",
              padding: 10,
            }}>
            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 10,
              }}>
              <DatePicker
                mode="single"
                onChange={(event) => {
                  console.log(event.date);
                  if (event.date) {
                    const clearedDate = new Date(event.date.toString());
                    setSelectedValue(clearedDate.toDateString());
                    setDate(dayjs(event.date));
                    onChange(clearedDate);
                  }
                }}
                date={date}
                styles={{
                  selected: {
                    color: "#a91101",
                  },
                  selected_label: {
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 15,
                    backgroundColor: "#a91101",
                    paddingHorizontal: 15,
                    paddingVertical: 12,
                    borderRadius: 5,
                  },
                }}
              />
              <Pressable onPress={() => setShow(false)}>
                <Text>Done</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
