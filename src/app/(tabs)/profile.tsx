import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { useCallback, useState } from "react";

import { useFocusEffect } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useAuth } from "../../hooks/useAuth";

import { getEnrolledCourses } from "../../utils/enrollmentStorage";

import { getBookmarks } from "../../utils/bookmarkStorage";

import { getProfileImage, saveProfileImage } from "../../utils/profileStorage";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const [image, setImage] = useState<string | null>(null);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    try {
      const userId = user?._id;

      const enrolled = await getEnrolledCourses(userId);
      const bookmarks = await getBookmarks(userId);

      const savedImage = await getProfileImage();

      setEnrolledCount(enrolled.length);
      setBookmarkCount(bookmarks.length);

      if (savedImage) {
        setImage(savedImage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showMessage = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showMessage("Gallery permission is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      setImage(uri);
      await saveProfileImage(uri);

      showMessage("Profile image updated");
    }
  };
  const formatName = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER CARD */}
      <View style={styles.headerCard}>
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri:
                image ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />

          <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
            <Ionicons name="camera-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{formatName(user?.username)}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="school-outline" size={24} color="#111" />
          <Text style={styles.statValue}>{enrolledCount}</Text>
          <Text style={styles.statLabel}>Enrolled</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="bookmark-outline" size={24} color="#111" />
          <Text style={styles.statValue}>{bookmarkCount}</Text>
          <Text style={styles.statLabel}>Bookmarks</Text>
        </View>
      </View>

      {/* ACCOUNT SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#111" />
            <Text style={styles.infoText}>{formatName(user?.username)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#111" />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#111" />
            <Text style={styles.infoText}>Active Learner</Text>
          </View>
        </View>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutBtn}
        activeOpacity={0.85}
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  headerCard: {
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 30,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  imageWrapper: {
    position: "relative",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#eee",
  },

  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  email: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 24,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 24,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  statValue: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  statLabel: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },

  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 14,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },

  infoText: {
    marginLeft: 14,
    fontSize: 15,
    color: "#333",
  },

  logoutBtn: {
    marginTop: 40,
    marginHorizontal: 20,
    backgroundColor: "#111",
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
