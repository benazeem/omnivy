import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChromeLocal } from "@/services/background";

export const loadNotionState = createAsyncThunk(
  "notion/loadState",
  async () => {
    const connected = await getChromeLocal("notionConnection") || false;
    const folders = await getChromeLocal("notionFolders") || [];
    const userInfo = await getChromeLocal("notionUserInfo") || null;
    return { connected, folders, userInfo };
  }
);
