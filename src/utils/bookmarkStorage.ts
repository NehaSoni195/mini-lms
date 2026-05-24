
import AsyncStorage from "@react-native-async-storage/async-storage";

const getKey = (userId: string) =>
  `BOOKMARKED_COURSES_${userId}`;

export const getBookmarks = async (userId: string) => {
  const data = await AsyncStorage.getItem(getKey(userId));
  return data ? JSON.parse(data) : [];
};

export const toggleBookmark = async (
  userId: string,
  courseId: number
) => {
  const bookmarks = await getBookmarks(userId);

  let updated = [];

  if (bookmarks.includes(courseId)) {
    updated = bookmarks.filter((id: number) => id !== courseId);
  } else {
    updated = [...bookmarks, courseId];
  }

  await AsyncStorage.setItem(
    getKey(userId),
    JSON.stringify(updated)
  );

  return updated;
};

