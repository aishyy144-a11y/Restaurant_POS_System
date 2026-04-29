import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  const savedTheme = sessionStorage.getItem("theme");
  return savedTheme || "light"; // default to light
};

const initialState = {
  theme: getInitialTheme(), // "dark" or "light"
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      sessionStorage.setItem("theme", state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      sessionStorage.setItem("theme", action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;

