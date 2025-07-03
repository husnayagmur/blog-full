import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/blogs';

export const fetchBlogs = createAsyncThunk(
  'adminBlogs/fetchBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Bloglar alınamadı.');
    }
  }
);

export const addBlog = createAsyncThunk(
  'adminBlogs/addBlog',
  async (formData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.token;

      if (!token) {
        return thunkAPI.rejectWithValue('Token bulunamadı.');
      }

      const res = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Blog eklenemedi.');
    }
  }
);

export const updateBlog = createAsyncThunk(
  'adminBlogs/updateBlog',
  async ({ id, formData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.token;

      if (!token) {
        return thunkAPI.rejectWithValue('Token bulunamadı.');
      }

      const res = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data; // güncellenmiş blog
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Blog güncellenemedi.');
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'adminBlogs/deleteBlog',
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.token;

      if (!token) {
        return thunkAPI.rejectWithValue('Token bulunamadı.');
      }

      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Blog silinemedi.');
    }
  }
);

const adminBlogsSlice = createSlice({
  name: 'adminBlogs',
  initialState: {
    blogs: [],
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload);
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      });
  },
});

export default adminBlogsSlice.reducer;
