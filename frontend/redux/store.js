import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slice/blogSlice';
import navigationReducer from './slice/navigationSlice';
import authorsReducer from './slice/authorSlice'
import authReducer from './../redux/slice/authSlice';
import commentsReducer from './../redux/slice/commentSlice'
import adminCommentsReducer from './slice/admin/adminCommentsSlice';
import adminBlogsReducer from './slice/admin/adminBlogsSlice';
import likesReducer from './slice/admin/adminLikeSlice';
export const store = configureStore({
  reducer: {
    blog: blogReducer,
    navigation: navigationReducer,
    authors: authorsReducer,
    auth: authReducer,
    comments: commentsReducer,
    adminComments: adminCommentsReducer,
    adminBlogs: adminBlogsReducer,
    likes: likesReducer,
  },
});
