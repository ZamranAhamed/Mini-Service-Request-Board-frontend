import axios from "axios";

const api = axios.create({
  baseURL: "https://globaltna-backend-hq7l.onrender.com",
});

export const getJobs = (filters = {}) => {
  const params = {};

  if (filters.category) {
    params.category = filters.category;
  }

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.search) {
    params.search = filters.search;
  }

  return api.get("/jobs", { params });
};

export const getJobById = (id) => api.get(`/jobs/${id}`);

export const createJob = (data) => api.post("/jobs", data);

export const updateJobStatus = (id, status) =>
  api.patch(`/jobs/${id}/status`, { status });

export const deleteJob = (id) => api.delete(`/jobs/${id}`);

export default api;
