import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import postsAPI from "../services/postService";
import likeAPI from "../services/likeService";

export interface Post {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  likes: number;
  dislikes: number;
  userAction?: "LIKE" | "DISLIKE" | null;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
}

interface PostsState {
  posts: Post[];
  userPosts: Post[];
  loading: boolean;
  userPostsLoading: boolean;
  error: string | null;
  hasMore: boolean;
  userPostsHasMore: boolean;
  currentPage: number;
  userPostsCurrentPage: number;
}

// Async thunks
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({
    page = 1,
    reset = false,
  }: { page?: number; reset?: boolean } = {}) => {
    const response = await postsAPI.getPosts(page, 10);
    return { posts: response, page, reset };
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async ({
    userId,
    page = 1,
    reset = false,
  }: {
    userId: string;
    page?: number;
    reset?: boolean;
  }) => {
    const response = await postsAPI.getUserPosts(userId, page, 10);
    return { posts: response, page, reset };
  }
);

export const deletePostAsync = createAsyncThunk(
  "posts/deletePost",
  async (postId: string) => {
    await postsAPI.deletePost(postId);
    return postId;
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData: {
    title: string;
    description: string;
    image: File;
    userId: string;
  }) => {
    const response = await postsAPI.createPost(postData);
    return response;
  }
);

export const likePostAsync = createAsyncThunk(
  "posts/likePost",
  async (postId: string) => {
    await likeAPI.likePost(postId);
    return postId;
  }
);

export const dislikePostAsync = createAsyncThunk(
  "posts/dislikePost",
  async (postId: string) => {
    await likeAPI.dislikePost(postId);
    return postId;
  }
);

const initialState: PostsState = {
  posts: [],
  userPosts: [],
  loading: false,
  userPostsLoading: false,
  error: null,
  hasMore: true,
  userPostsHasMore: true,
  currentPage: 1,
  userPostsCurrentPage: 1,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        if (post.userAction === "LIKE") {
          post.likes -= 1;
          post.userAction = null;
        } else {
          if (post.userAction === "DISLIKE") {
            post.dislikes -= 1;
          }
          post.likes += 1;
          post.userAction = "LIKE";
        }
      }
    },
    dislikePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        if (post.userAction === "DISLIKE") {
          post.dislikes -= 1;
          post.userAction = null;
        } else {
          if (post.userAction === "LIKE") {
            post.likes -= 1;
          }
          post.dislikes += 1;
          post.userAction = "DISLIKE";
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPosts: (state) => {
      state.posts = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    resetUserPosts: (state) => {
      state.userPosts = [];
      state.userPostsCurrentPage = 1;
      state.userPostsHasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const { posts, page, reset } = action.payload;
        if (reset || page === 1) {
          state.posts = posts;
        } else {
          state.posts = [...state.posts, ...posts];
        }
        state.currentPage = page;
        state.hasMore = posts.length === 10;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })
      // Fetch user posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.userPostsLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPostsLoading = false;
        const { posts, page, reset } = action.payload;
        if (reset || page === 1) {
          state.userPosts = posts;
        } else {
          state.userPosts = [...state.userPosts, ...posts];
        }
        state.userPostsCurrentPage = page;
        state.userPostsHasMore = posts.length === 10;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.userPostsLoading = false;
        state.error = action.error.message || "Failed to fetch user posts";
      })
      // Delete post
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        state.userPosts = state.userPosts.filter(
          (post) => post.id !== action.payload
        );
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        const newPost: Post = {
          ...action.payload,
          likes: 0,
          dislikes: 0,
          userAction: null,
        };
        state.posts.unshift(newPost);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create post";
      })
      // Like post
      .addCase(likePostAsync.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload);
        if (post) {
          if (post.userAction === "LIKE") {
            post.likes -= 1;
            post.userAction = null;
          } else {
            if (post.userAction === "DISLIKE") {
              post.dislikes -= 1;
            }
            post.likes += 1;
            post.userAction = "LIKE";
          }
        }
      })
      // Dislike post
      .addCase(dislikePostAsync.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload);
        if (post) {
          if (post.userAction === "DISLIKE") {
            post.dislikes -= 1;
            post.userAction = null;
          } else {
            if (post.userAction === "LIKE") {
              post.likes -= 1;
            }
            post.dislikes += 1;
            post.userAction = "DISLIKE";
          }
        }
      });
  },
});

export const { likePost, dislikePost, clearError, resetPosts, resetUserPosts } =
  postsSlice.actions;
export default postsSlice.reducer;
