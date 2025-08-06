import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  title: string;
  onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
}
export default function DateInput({ title, onChange }: Props) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  return (
    <View style={{ marginBottom: 15 }}>
      <Pressable
        onPress={() => setShow(true)}
        style={{
          padding: 15,
          borderRadius: 8,
          backgroundColor: "#fff",
          borderColor: "#DADADA",
          borderWidth: 1,
        }}
      >
        <Text
          style={{
            color: "grey",
          }}
        >
          {title}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={date ? date : new Date()}
          mode="date"
          display="default" // can be 'spinner', 'calendar', etc.
          onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
            setShow(false);
            onChange(event, selectedDate);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}
