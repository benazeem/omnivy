import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChromeLocal } from "@/services/background"; // wherever it's coming from

export const loadUIState = createAsyncThunk("ui/loadState", async () => {
  const fontSize = (await getChromeLocal("omnivyfontsize")) || "text-base";
  const theme = (await getChromeLocal("omnivytheme")) || "system";
  const backgroundImageUrl = (await getChromeLocal("omnivybackgroundimageurl")) || null;
  const obsidianInputInterface = (await getChromeLocal("omnivyinputinterface")) ?? true;
  const accentColor = (await getChromeLocal("omnivyaccentcolor")) || "indigo";
  const fontFamily = (await getChromeLocal("omnivyfontfamily")) || "sans";
  const uiDensity = (await getChromeLocal("omnivyuidensity")) || "comfortable";
  const reduceMotion = (await getChromeLocal("omnivyreducemotion")) ?? false;
  const glassmorphism = (await getChromeLocal("omnivyglassmorphism")) ?? true;
  const smoothScrolling = (await getChromeLocal("omnivysmoothscrolling")) ?? true;
  const customCSS = (await getChromeLocal("omnivycustomcss")) || "";

  return { 
    fontSize, 
    theme, 
    backgroundImageUrl, 
    obsidianInputInterface,
    accentColor,
    fontFamily,
    uiDensity,
    reduceMotion,
    glassmorphism,
    smoothScrolling,
    customCSS
  };
});
