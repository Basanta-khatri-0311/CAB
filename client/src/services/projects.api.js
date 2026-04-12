export const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:5500/api";

export const fetchProjects = async () => {
  const res = await fetch(`${BASE_URL}/projects`);
  return res.json();
};

export const fetchProjectById = async (id) => {
  const res = await fetch(`${BASE_URL}/projects/${id}`);
  return res.json();
};