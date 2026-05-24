
import AsyncStorage from "@react-native-async-storage/async-storage";

const getKey = (userId: string) =>
  `ENROLLED_COURSES_${userId}`;

export const getEnrolledCourses = async (userId: string) => {
  const data = await AsyncStorage.getItem(getKey(userId));
  return data ? JSON.parse(data) : [];
};

export const enrollCourse = async (
  userId: string,
  course: any
) => {
  const courses = await getEnrolledCourses(userId);

  const exists = courses.find(
    (item: any) => item.id === course.id
  );

  if (!exists) {
    const updated = [...courses, course];

    await AsyncStorage.setItem(
      getKey(userId),
      JSON.stringify(updated)
    );

    return updated;
  }

  return courses;
};

