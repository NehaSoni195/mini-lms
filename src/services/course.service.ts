
import api from "./api";

export const getCourses = async () => {
  const res = await api.get("/public/randomproducts");

  console.log("COURSES API", res.data);

  return res.data.data.data || [];
};

export const getInstructors = async () => {
  const res = await api.get("/public/randomusers");

  console.log("INSTRUCTORS API", res.data);

  return res.data.data.data || [];
};

