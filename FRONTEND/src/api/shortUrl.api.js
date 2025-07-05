import axiosInstance from "../utils/axiosInstance";

export const createShortUrl = async (url,slug) => {
    const { data } = await axiosInstance.post("/api/create", { url,slug });
    return data.shortUrl
}

export const deleteShortUrl = async (id) => {
    const res = await axiosInstance.delete(`/api/create/${id}`);
    return res.data;
  };