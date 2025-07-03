import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BACKEND_URL = 'http://localhost:5000'

export const fetchAuthors = createAsyncThunk(
  'authors/fetchAuthors',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/auth/users`)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue('Yazarlar yüklenirken hata oluştu.')
    }
  }
)

const authorsSlice = createSlice({
  name: 'authors',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.map(author => ({
          ...author,
          description: author.bio || 'Bu yazar hakkında açıklama bulunmamaktadır.',
          buttonText: `${author.name}'ın yazılarına git`,
        }))
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Bir hata oluştu.'
      })
  },
})

export default authorsSlice.reducer
