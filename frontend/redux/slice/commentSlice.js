// src/redux/slice/commentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Yorumları getir
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (blogId, thunkAPI) => {
    const res = await fetch(`http://localhost:5000/api/comments/${blogId}`);
    if (!res.ok) throw new Error('Yorumlar yüklenemedi');
    return await res.json();
  }
);

// Yorum ekleme thunk'ı
export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ blogId, content }, thunkAPI) => {
    // Redux store'dan token'ı al (veya localStorage'dan)
    const state = thunkAPI.getState();
    const token = state.auth?.token || localStorage.getItem('token');

    if (!token) {
      return thunkAPI.rejectWithValue('Kullanıcı giriş yapmamış.');
    }

    const res = await fetch(`http://localhost:5000/api/comments/${blogId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,  // Token header'da gönderiliyor
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return thunkAPI.rejectWithValue(errorData.message || 'Yorum eklenemedi');
    }

    const data = await res.json();
    return data.comment;
  }
);


export const addReply = createAsyncThunk(
  'comments/addReply',
  async ({ commentId, content }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth?.token || localStorage.getItem('token');

    if (!token) {
      return thunkAPI.rejectWithValue('Kullanıcı giriş yapmamış.');
    }

    // Burada parentComment alanı gönderiyoruz (commentId)
    const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, 
  },
  body: JSON.stringify({ content, parentComment: commentId }),
});

if (!res.ok) {
  const errorData = await res.json();
  return thunkAPI.rejectWithValue(errorData.message || 'Cevap eklenemedi');
}

const data = await res.json();
return { commentId, reply: data.comment }; // <<--- sadece yorum objesini dön

  }
);


const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    list: [],
    loading: false,
    error: null,
    posting: false,
    postingReplyId: null,
    replyErrors: {},
    replyBoxes: {},
    replyTexts: {},
  },
  reducers: {
    toggleReplyBox: (state, action) => {
      const id = action.payload;
      state.replyBoxes[id] = !state.replyBoxes[id];
    },
    setReplyText: (state, action) => {
      const { commentId, text } = action.payload;
      state.replyTexts[commentId] = text;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchComments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addComment.pending, state => {
        state.posting = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.posting = false;
        state.list.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.posting = false;
        state.error = action.error.message;
      })
      .addCase(addReply.pending, (state, action) => {
        state.postingReplyId = action.meta.arg.commentId;
        state.replyErrors[action.meta.arg.commentId] = null;
      })
      .addCase(addReply.fulfilled, (state, action) => {
  const { commentId, reply } = action.payload;
  const target = state.list.find(comment => comment._id === commentId);
  if (target) {
    target.replies = [...(target.replies || []), reply];
  }
  state.postingReplyId = null;

  // Reply yazı alanını temizle
  state.replyTexts[commentId] = '';
  // Reply kutusunu kapat
  state.replyBoxes[commentId] = false;

  // Eğer replyErrors varsa temizle
  if (state.replyErrors[commentId]) {
    delete state.replyErrors[commentId];
  }
})

      .addCase(addReply.rejected, (state, action) => {
        const commentId = action.meta.arg.commentId;
        state.postingReplyId = null;
        state.replyErrors[commentId] = action.error.message;
      });
  },
});

export const { toggleReplyBox, setReplyText } = commentSlice.actions;
export default commentSlice.reducer;
