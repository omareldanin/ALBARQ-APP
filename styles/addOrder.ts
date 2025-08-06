import { I18nManager, StyleSheet } from "react-native";

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
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  navbarItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    direction: "rtl",
  },
  icon: {
    position: "absolute",
    [!I18nManager.isRTL ? "right" : "left"]: "40%",
    top: 50,
  },
  input: {
    textAlign: "right", // aligns cursor/text to the right
    paddingRight: 15,
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
  formGroupImage: {
    position: "relative",
    marginBottom: 15,
    alignItems: "center",
  },
  label: {
    marginBottom: 4,
    color: "#555",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Cairo",
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
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    direction: "rtl",
    gap: 10,
    marginTop: 10,
  },
});

export default styles;
