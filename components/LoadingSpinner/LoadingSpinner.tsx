import { Image, StyleSheet, View } from "react-native";
import { Fold } from "react-native-animated-spinkit";

export const LoadingSpinner = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo-light2.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Fold size={50} color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A91101",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 170,
    height: 200,
    marginBottom: 30,
    objectFit: "contain",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
  },
});
