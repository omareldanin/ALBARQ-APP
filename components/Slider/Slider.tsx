import { Banner } from "@/services/getBannersService";
import { useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
const { width } = Dimensions.get("window");

const images = [
  require("../../assets/images/login-bk2.png"),
  require("../../assets/images/login-bk2.png"),
  require("../../assets/images/login-bk2.png"),
];

type Props = {
  banners: Banner[];
};

export default function ImageSlider({ banners }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={width}
        height={250}
        autoPlay={true}
        data={banners.map((b) => b.image)}
        scrollAnimationDuration={500}
        autoPlayInterval={3000}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#A91101",
    width: 20,
    height: 10,
  },
});
