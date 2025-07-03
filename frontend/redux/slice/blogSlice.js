import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

// Blogları getirme
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // localStorage yerine redux state'den al

      const res = await axios.get(`${BACKEND_URL}/api/blogs`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}, // token yoksa headers boş
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Bloglar yüklenemedi'
      );
    }
  }
);

// Beğeni toggle
export const toggleLike = createAsyncThunk(
  'blog/toggleLike',
  async (blogId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      if (!token) throw new Error('Token bulunamadı');

      const res = await axios.post(`${BACKEND_URL}/api/likes/${blogId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { blogId, liked: res.data.liked };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Beğeni işlemi başarısız');
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    blogs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Bloglar getiriliyor
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
  state.loading = false;
  state.blogs = action.payload.map(blog => {
    console.log('imageUrl backendden gelen:', blog.imageUrl);
    const fullImageUrl = blog.imageUrl
      ? (blog.imageUrl.startsWith('http')
        ? blog.imageUrl
        : `${BACKEND_URL}${blog.imageUrl}`)
      : '/default-blog-image.jpg';
    console.log('Tam imageUrl:', fullImageUrl);

    return {
      ...blog,
      imageUrl: fullImageUrl,
    };
  });
})

      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Beğeni toggle işlemi
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { blogId, liked } = action.payload;
        const blog = state.blogs.find((b) => b._id === blogId);

        if (blog) {
          blog.likeCount = liked
            ? (blog.likeCount || 0) + 1
            : Math.max(0, (blog.likeCount || 0) - 1);
          blog.userLiked = liked;
        }
      });
  },
});

export default blogSlice.reducer;
