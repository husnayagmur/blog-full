import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/comments';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.token;

      if (!token) {
        return thunkAPI.rejectWithValue('Token bulunamadı.');
      }

      const response = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Yorumlar alınamadı.');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.token;

      if (!token) {
        return thunkAPI.rejectWithValue('Token bulunamadı.');
      }

      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Yorum silinemedi.');
    }
  }
);

const adminCommentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((comment) => comment._id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default adminCommentsSlice.reducer;
