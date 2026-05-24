import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

import { useEffect, useState } from "react";

import { getCourses, getInstructors } from "../../services/course.service";

import CourseCard from "../../components/CourseCard";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const coursesResponse = await getCourses();
      const instructorsResponse = await getInstructors();

      setCourses(coursesResponse);
      setFilteredCourses(coursesResponse);
      setInstructors(instructorsResponse);
    } catch (error) {
      console.log("HOME ERROR", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);

    if (text.trim() === "") {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter((item) =>
      item.title?.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredCourses(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="school" size={28} color="#111" />

        <Text style={styles.heading}>Mini LMS</Text>

        <TouchableOpacity onPress={() => console.log("Menu clicked")}>
          <Ionicons name="menu" size={30} color="#111" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeading}>Explore top courses & instructors</Text>

      <TextInput
        placeholder="Search courses..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No Courses Found</Text>
        )}
        renderItem={({ item, index }) => {
          const instructor = instructors?.[index % instructors.length];

          return (
            <CourseCard
              item={item}
              instructor={instructor}
              onPress={() =>
                router.push({
                  pathname: "/course/[id]",
                  params: {
                    course: JSON.stringify(item),
                    instructor: JSON.stringify(instructor),
                  },
                })
              }
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  subHeading: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
    marginBottom: 16,
  },

  searchInput: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 18,
    fontSize: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
    color: "#666",
  },
});
