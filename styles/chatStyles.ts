import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    maxHeight: "100%",
    paddingBottom: 0,
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
  },
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    paddingBottom: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#f7f7f7",
  },
  chat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    backgroundColor: "#A91101",
    padding: 10,
    borderRadius: 30,
    elevation: 5, // for Android shadow
    shadowColor: "#000", // for iOS shadow
  },
  messageContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  message: {
    maxWidth: "80%",
    padding: 10,
    paddingBottom: 15,
    marginBottom: 10,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
  },
  form: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputContainer: {
    flexGrow: 1,
    position: "relative",
  },
  input: {
    textAlign: "right", // aligns cursor/text to the right
    height: 50,
    borderColor: "#DADADA",
    color: "grey",
    borderWidth: 1,
    borderRadius: 8,
    transitionDuration: "300ms",
    paddingLeft: 30,
  },
  inputFocused: {
    borderColor: "#A91101",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 13,
    width: 50,
    backgroundColor: "#A91101",
    textAlign: "center",
    height: 52,
  },
  button2: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 13,
    flexGrow: 1,
    backgroundColor: "#A91101",
    textAlign: "center",
    height: 52,
  },
  camera: {
    position: "absolute",
    left: 10,
    top: 12,
    zIndex: 555,
  },
  imageLoader: {
    position: "absolute",
    top: 90,
    left: 0,
    right: 0,
    height: "90%",
    zIndex: 1000,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
});
export default styles;
