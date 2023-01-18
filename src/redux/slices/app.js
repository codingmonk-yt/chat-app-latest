import { createSlice } from "@reduxjs/toolkit";
//
import { dispatch } from "../store";

// ----------------------------------------------------------------------

const initialState = {
  sideBar: {
    open: false,
    type: "CONTACT", // can be CONTACT, STARRED, SHARED
  },
  isLoggedIn: true,
  tab: 0, // [0, 1, 2, 3]
};

const slice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    // Toggle Sidebar
    toggleSideBar(state) {
      state.sideBar.open = !state.sideBar.open;
    },
    updateSideBarType(state, action) {
      state.sideBar.type = action.payload.type;
    },
    updateTab(state, action) {
      state.tab = action.payload.tab;
    }
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function ToggleSidebar() {
  return async () => {
    dispatch(slice.actions.toggleSideBar());
  };
}
export function UpdateSidebarType(type) {
  return async () => {
    dispatch(slice.actions.updateSideBarType({ type }));
  };
}
export function UpdateTab(tab) {
  return async () => {
    dispatch(slice.actions.updateTab({tab}));
  }
}