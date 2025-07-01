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
  order: {
    paddingTop: 15,
    paddingBottom: 0,
    padding: 15,
    position: "relative",
    backgroundColor: "#fff",
    borderColor: "#f7f7f7",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
    paddingTop: 10,
  },
  info: {
    marginTop: 15,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  infoItemBorder: {
    borderColor: "#f7f7f7",
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  collapsed: {
    height: 110,
  },
  expanded: {
    height: "auto",
  },
  selectButtons: {},
  orderHead: {
    direction: "rtl",
    marginTop: 10,
    padding: 10,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
});

export default styles;
