import { createAsyncThunk } from "@reduxjs/toolkit";
import { getChromeLocal } from "@/services/db/localDdOperations";
import { setBehavior } from "../behaviorSlice";

export const loadBehaviorState = createAsyncThunk(
  "behavior/loadState",
  async (_, { dispatch }) => {
    const data = await getChromeLocal("behavior");
    if (data) {
      dispatch(setBehavior(data));
    }
  }
);
