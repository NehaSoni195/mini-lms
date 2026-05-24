import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName = "ellipse";

        if (route.name === "index") iconName = "home";
        else if (route.name === "courses") iconName = "book";
        else if (route.name === "profile") iconName = "person";

        return (
          <TouchableOpacity
            key={route.name}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconWrapper,
                isFocused && styles.activeIconWrapper,
              ]}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? "#fff" : "#666"}
              />
            </View>

            <Text style={[styles.label, isFocused && styles.activeLabel]}>
              {route.name === "index"
                ? "Home"
                : route.name === "courses"
                  ? "Courses"
                  : "Profile"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapper: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: "#f4f6f8",
  },

  activeIconWrapper: {
    backgroundColor: "#111",
  },

  label: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
    fontWeight: "500",
  },

  activeLabel: {
    color: "#111",
    fontWeight: "700",
  },
});
