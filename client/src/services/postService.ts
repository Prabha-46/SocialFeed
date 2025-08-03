import api from "./api";

export const postsAPI = {
  getPosts: async (page = 1, limit = 10) => {
    const response = await api.get(`/post?page=${page}&limit=${limit}`);
    return response.data.posts;
  },
  getUserPosts: async (userId: string, page = 1, limit = 10) => {
    const response = await api.get(
      `/post?userId=${userId}&page=${page}&limit=${limit}`
    );
    return response.data.posts;
  },
  createPost: async (postData: {
    title: string;
    description: string;
    image: File;
    userId: string;
  }) => {
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("description", postData.description);
    formData.append("image", postData.image);
    formData.append("userId", postData.userId);
    const response = await api.post("/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  deletePost: async (postId: string) => {
    const response = await api.delete(`/post/${postId}`);
    return response.data;
  },
};

export default postsAPI;
