import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  enrollCourse,
  getEnrolledCourses,
} from "../../utils/enrollmentStorage";

import { getBookmarks, toggleBookmark } from "../../utils/bookmarkStorage";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../hooks/useAuth";

export default function CourseDetailsScreen() {
  const params = useLocalSearchParams();

  const course = JSON.parse(params.course as string);
  const instructor = JSON.parse(params.instructor as string);

  const [bookmarked, setBookmarked] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const { user } = useAuth();

  const userId = user?._id;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    if (!userId) return;

    const bookmarks = await getBookmarks(userId);
    const enrolledCourses = await getEnrolledCourses(userId);

    setBookmarked(bookmarks.includes(course.id));

    setEnrolled(enrolledCourses.some((item: any) => item.id === course.id));
  };

  const handleBookmark = async () => {
    if (!userId) return;

    const updated = await toggleBookmark(userId, course.id);

    setBookmarked(updated.includes(course.id));
  };

  const handleEnroll = async () => {
    if (!userId) return;

    await enrollCourse(userId, course);

    setEnrolled(true);

    Alert.alert("Success", "Successfully enrolled!");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* IMAGE */}
      <Image
        source={{
          uri: `https://dummyjson.com/image/800x400/008080/ffffff?text=${encodeURIComponent(
            course.title,
          )}`,
        }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.title}>{course.title}</Text>

          <TouchableOpacity onPress={handleBookmark} style={styles.bookmark}>
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color="#111"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.instructor}>
          Instructor: {instructor.name.first} {instructor.name.last}
        </Text>

        <Text style={styles.description}>{course.description}</Text>

        <TouchableOpacity
          style={[styles.enrollBtn, enrolled && { backgroundColor: "#1a8f3c" }]}
          onPress={handleEnroll}
        >
          <Text style={styles.enrollText}>
            {enrolled ? "Enrolled" : "Enroll Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  image: {
    width: "100%",
    height: 260,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    marginRight: 10,
    color: "#111",
  },

  bookmark: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
  },

  instructor: {
    marginTop: 12,
    fontWeight: "600",
    color: "#444",
  },

  description: {
    marginTop: 16,
    color: "#666",
    lineHeight: 22,
    fontSize: 14,
  },

  enrollBtn: {
    marginTop: 30,
    backgroundColor: "#111",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  enrollText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
