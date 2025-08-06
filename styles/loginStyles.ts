import { I18nManager, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    height: 320, // use fixed height
  },
  image: {
    width: "100%",
    height: "100%",
  },

  form: {
    direction: "rtl",
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: -30,
    padding: 20,
    height: "100%",
  },
  text: {
    fontFamily: "CairoBold",
    fontSize: 22,
    marginTop: 20,
    marginBottom: 35,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  inputContainer: {
    position: "relative",
    marginBottom: 15,
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 14,
  },
  input: {
    textAlign: "right", // aligns cursor/text to the right
    writingDirection: "rtl", // supports RTL characters properly
    paddingRight: 35,
    direction: "rtl",
    height: 50,
    borderColor: "#DADADA",
    color: "grey",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    transitionDuration: "300ms",
  },
  inputFocused: {
    borderColor: "#A91101",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    // padding: 13,
    backgroundColor: "#A91101",
    textAlign: "center",
    height: 52,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontFamily: "CairoBold",
  },
});

export default styles;
