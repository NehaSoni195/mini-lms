import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

type Props = {
  item: any;
  instructor: any;
  onPress: () => void;
};

export default function CourseCard({ item, instructor, onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
      <Image
        source={{
          uri: `https://dummyjson.com/image/400x220/008080/ffffff?text=${encodeURIComponent(
            item.title,
          )}`,
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.instructorContainer}>
            <Image
              source={{
                uri: instructor?.picture?.medium,
              }}
              style={styles.avatar}
            />

            <View>
              <Text style={styles.instructorName}>
                {instructor?.name?.first} {instructor?.name?.last}
              </Text>

              <Text style={styles.category}>{item.category}</Text>
            </View>
          </View>

          <View style={styles.priceBadge}>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 18,
    overflow: "hidden",

    // modern soft shadow
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#e5e5e5",
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  description: {
    marginTop: 8,
    color: "#666",
    lineHeight: 20,
    fontSize: 13,
  },

  bottomRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  instructorContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
    backgroundColor: "#eee",
  },

  instructorName: {
    fontWeight: "700",
    fontSize: 14,
    color: "#111",
  },

  category: {
    color: "#777",
    marginTop: 2,
    textTransform: "capitalize",
    fontSize: 12,
  },

  priceBadge: {
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
});
