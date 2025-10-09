import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const insertCart = createAsyncThunk(
  "cart/insertCart",
  async ({ productID, amount = 1 }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/dossier-statistic/insert-product",
        null,
        {
          params: { productID, amount },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi server");
    }
  }
);

const cartRedux = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    lastAction: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(insertCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(insertCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lastAction = action.payload;
      })
      .addCase(insertCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default cartRedux.reducer;
