import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChromeLocal } from "@/services/db/localDdOperations";
import { setInterpreter } from "../interpreterSlice";

export const loadInterpreterState = createAsyncThunk(
  "interpreter/loadState",
  async (_, { dispatch }) => {
    const data = await getChromeLocal("interpreter");
    if (data) {
      dispatch(setInterpreter(data));
    }
  }
);
