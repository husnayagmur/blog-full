import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchLikes = createAsyncThunk(
  'likes/fetchLikes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/likes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Beğeniler alınamadı');
    }
  }
);

const likesSlice = createSlice({
  name: 'likes',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likesSlice.reducer;
