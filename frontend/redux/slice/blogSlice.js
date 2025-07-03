import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/blogs`);
      return response.data; // burada imageUrl içeren bloglar var
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Bloglar yüklenemedi');
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
  extraReducers: builder => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default blogSlice.reducer;
