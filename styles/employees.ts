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
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  employee: {
    paddingTop: 15,
    paddingBottom: 15,
    padding: 15,
    position: "relative",
    backgroundColor: "#fff",
    borderColor: "#f7f7f7",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  itemText: {
    fontFamily: "CairoBold",
    fontSize: 13,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    // padding: 13,
    backgroundColor: "#a91101",
    textAlign: "center",
    height: 48,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontFamily: "CairoBold",
  },
});

export default styles;
