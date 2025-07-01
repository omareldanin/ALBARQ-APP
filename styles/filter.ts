import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#A91101",
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 10,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 350,
    maxHeight: "80%",
    direction: "rtl",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    textAlign: "right", // aligns cursor/text to the right
    writingDirection: "rtl", // supports RTL characters properly
    paddingRight: 15,
    direction: "rtl",
    height: 50,
    borderColor: "#DADADA",
    color: "grey",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    transitionDuration: "300ms",
  },
  inputFocused: {
    borderColor: "#A91101",
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  placeholder: {
    color: "#999",
  },
  selectedText: {
    color: "#000",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
    borderColor: "#f7f7f7",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
  },
});
export default styles;
