import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    maxHeight: "100%",
  },
  navbar: {
    backgroundColor: "#A91101",
    width: "100%",
    paddingTop: 15,
    paddingBottom: 15,
    padding: 10,
    zIndex: 11100,
    flexDirection: "row",
    justifyContent: "space-between",
    direction: "rtl",
  },
  navbarItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    direction: "rtl",
  },
  input: {
    textAlign: "right", // aligns cursor/text to the right
    writingDirection: "rtl", // supports RTL characters properly
    paddingRight: 15,
    direction: "rtl",
    height: 50,
    borderColor: "#f7f7f7",
    color: "#000",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontFamily: "Cairo",
  },
  inputFocused: {
    borderColor: "#A91101",
  },
  form: {
    padding: 10,
    flex: 1,
  },
  formGroup: {
    position: "relative",
    marginBottom: 15,
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    // padding: 13,
    backgroundColor: "#A91101",
    textAlign: "center",
    height: 50,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontFamily: "CairoBold",
  },
});

export default styles;
