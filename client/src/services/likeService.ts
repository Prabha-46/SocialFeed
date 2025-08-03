import api from "./api";

export const likeAPI = {
  likePost: async (postId: string) => {
    const response = await api.post(`/like/like/${postId}`);
    return response.data;
  },
  dislikePost: async (postId: string) => {
    const response = await api.post(`/like/dislike/${postId}`);
    return response.data;
  },
};

export default likeAPI;
