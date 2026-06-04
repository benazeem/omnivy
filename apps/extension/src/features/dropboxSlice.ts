import type { Folder, UserInfo } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadDropboxState } from "./index";

interface DropboxState {
  connected: boolean;
  folders: Folder[];
  userInfo: UserInfo | null;
  loading: boolean;
}

const initialState: DropboxState = {
  connected: false,
  folders: [],
  userInfo: null,
  loading: true,
};

const dropboxSlice = createSlice({
  name: "dropbox",
  initialState,
  reducers: {
    setDropboxConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    setDropboxFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;
    },
    setDropboxUserInfo(state, action: PayloadAction<UserInfo | null>) {
      state.userInfo = action.payload;
    },
    resetDropbox() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadDropboxState.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadDropboxState.fulfilled, (state, action) => {
      state.connected = action.payload.connected;
      state.folders = action.payload.folders;
      state.userInfo = action.payload.userInfo;
      state.loading = false;
    });
    builder.addCase(loadDropboxState.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { setDropboxConnected, setDropboxUserInfo, setDropboxFolders, resetDropbox } =
  dropboxSlice.actions;
export default dropboxSlice.reducer;
