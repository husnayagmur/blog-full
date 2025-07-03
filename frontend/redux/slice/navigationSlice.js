// redux/slice/navigationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeNav: '/',
  showCategoryDropdown: false,
  showUserDropdown: false, 
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActiveNav(state, action) {
      state.activeNav = action.payload;
    },
    toggleCategoryDropdown(state) {
      state.showCategoryDropdown = !state.showCategoryDropdown;
    },
    closeCategoryDropdown(state) {
      state.showCategoryDropdown = false;
    },
    toggleUserDropdown(state) {
      state.showUserDropdown = !state.showUserDropdown;
    },
    closeUserDropdown(state) {
      state.showUserDropdown = false;
    },
  },
});

export const {
  setActiveNav,
  toggleCategoryDropdown,
  closeCategoryDropdown,
  toggleUserDropdown,
  closeUserDropdown,
} = navigationSlice.actions;

export default navigationSlice.reducer;
