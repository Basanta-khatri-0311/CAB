import API from "../api/axios";

export const fetchProjects = async () => {
  const res = await API.get("/projects");
  return res.data;
};

export const fetchProjectById = async (id) => {
  const res = await API.get(`/projects/${id}`);
  return res.data;
};