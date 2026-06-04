import type { Folder, UserInfo } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadGoogleDriveState } from "./index";

interface GoogleDriveState {
  connected: boolean;
  folders: Folder[];
  userInfo: UserInfo | null;
  loading: boolean;
}

const initialState: GoogleDriveState = {
  connected: false,
  folders: [],
  userInfo: null,
  loading: true,
};

const googleDriveSlice = createSlice({
  name: "googleDrive",
  initialState,
  reducers: {
    setGoogleDriveConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    setGoogleDriveFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;
    },
    setGoogleDriveUserInfo(state, action: PayloadAction<UserInfo | null>) {
      state.userInfo = action.payload;
    },
    resetGoogleDrive() {
      return initialState;
    },
  },
   extraReducers: (builder) => {
    builder.addCase(loadGoogleDriveState.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadGoogleDriveState.fulfilled, (state, action) => {
      state.connected = action.payload.connected;
      state.folders = action.payload.folders;
      state.userInfo = action.payload.userInfo;
      state.loading = false;
    });
    builder.addCase(loadGoogleDriveState.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { setGoogleDriveConnected, setGoogleDriveFolders, setGoogleDriveUserInfo, resetGoogleDrive } =
  googleDriveSlice.actions;
export default googleDriveSlice.reducer;
