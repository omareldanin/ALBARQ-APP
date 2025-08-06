import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    maxHeight: "100%",
    direction: "rtl",
    padding: 20,
  },
  profile: {
    alignItems: "center",
    marginBottom: 25,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  item: {
    flexDirection: "row",
    marginBottom: 25,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  itemText: {
    fontFamily: "Cairo",
    color: "grey",
    fontSize: 15,
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
  },
  navbarItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  item2: {
    fontSize: 16,
    marginVertical: 8,
    writingDirection: "rtl", // لضبط اتجاه الكتابة للعربية
  },
});

export default styles;
