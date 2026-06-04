// obsidianThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getChromeLocal } from "@/services/background";

export const loadObsidianState = createAsyncThunk(
  "obsidian/loadState",
  async () => {
    const connected = await getChromeLocal("obsidianConnected") || false;
    const folders = await getChromeLocal("obsidianFolders") || [];
    const vaultNames = await getChromeLocal("obsidianVaultNames") || [];
    return { connected, folders, vaultNames };
  }
);
