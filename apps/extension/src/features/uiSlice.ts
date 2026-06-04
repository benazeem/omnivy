import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FontSize, Theme, AccentColor, FontFamily, UIDensity } from "@/types"; 
import { loadUIState } from "./index"; 

type uiState = {
  fontSize: FontSize;
  theme: Theme;
  backgroundImageUrl: string | null;
  obsidianInputInterface?: boolean;
  accentColor: AccentColor;
  fontFamily: FontFamily;
  uiDensity: UIDensity;
  reduceMotion: boolean;
  glassmorphism: boolean;
  smoothScrolling: boolean;
  customCSS: string;
};

const initialState: uiState = {
  fontSize: "text-base",
  theme: "system",
  backgroundImageUrl: null,
  obsidianInputInterface: true,
  accentColor: "indigo",
  fontFamily: "sans",
  uiDensity: "comfortable",
  reduceMotion: false,
  glassmorphism: true,
  smoothScrolling: true,
  customCSS: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFontSize(state, action: PayloadAction<FontSize>) {
      state.fontSize = action.payload;
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    setBackgroundImageUrl(state, action: PayloadAction<string | null>) {
      state.backgroundImageUrl = action.payload;
    },
    setObsidianInputInterface(state, action: PayloadAction<boolean>) {
      state.obsidianInputInterface = action.payload;
    },
    setAccentColor(state, action: PayloadAction<AccentColor>) {
      state.accentColor = action.payload;
    },
    setFontFamily(state, action: PayloadAction<FontFamily>) {
      state.fontFamily = action.payload;
    },
    setUIDensity(state, action: PayloadAction<UIDensity>) {
      state.uiDensity = action.payload;
    },
    setReduceMotion(state, action: PayloadAction<boolean>) {
      state.reduceMotion = action.payload;
    },
    setGlassmorphism(state, action: PayloadAction<boolean>) {
      state.glassmorphism = action.payload;
    },
    setSmoothScrolling(state, action: PayloadAction<boolean>) {
      state.smoothScrolling = action.payload;
    },
    setCustomCSS(state, action: PayloadAction<string>) {
      state.customCSS = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUIState.fulfilled, (state, action) => {
      state.fontSize = action.payload.fontSize;
      state.theme = action.payload.theme;
      state.backgroundImageUrl = action.payload.backgroundImageUrl;
      state.obsidianInputInterface = action.payload.obsidianInputInterface;
      state.accentColor = action.payload.accentColor ?? "indigo";
      state.fontFamily = action.payload.fontFamily ?? "sans";
      state.uiDensity = action.payload.uiDensity ?? "comfortable";
      state.reduceMotion = action.payload.reduceMotion ?? false;
      state.glassmorphism = action.payload.glassmorphism ?? true;
      state.smoothScrolling = action.payload.smoothScrolling ?? true;
      state.customCSS = action.payload.customCSS ?? "";
    })
  },
});

export const {
  setFontSize,
  setTheme,
  setBackgroundImageUrl,
  setObsidianInputInterface,
  setAccentColor,
  setFontFamily,
  setUIDensity,
  setReduceMotion,
  setGlassmorphism,
  setSmoothScrolling,
  setCustomCSS,
} = uiSlice.actions;

export default uiSlice.reducer;
