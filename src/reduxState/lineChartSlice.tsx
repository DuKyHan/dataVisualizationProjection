import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";
import axios from "axios";

interface lineChartType {
  payload: {};
  selectedCountry: string;
  isLoading: boolean;
  isError: SerializedError;
}

const initialState: lineChartType = {
  payload: [],
  selectedCountry: "",
  isLoading: false,
  isError: "" as SerializedError,
};

interface Payload {
  countryCode: string;
}
export const getCountryData = createAsyncThunk(
  "api/getCountryData",
  async (payload: Payload, thunkAPI) => {
    const response = await axios.get(
      `https://disease.sh/v3/covid-19/historical/${payload.countryCode}?lastdays=all`
    );
    return response.data.timeline;
  }
);

const lineChartSlice = createSlice({
  name: "lineChartSlice",
  initialState,
  reducers: {
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
  },
  extraReducers: (build) => {
    build.addCase(getCountryData.pending, (state, action) => {
      state.isLoading = true;
    });

    build.addCase(getCountryData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.payload = action.payload;
    });

    build.addCase(getCountryData.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = action.error;
    });
  },
});

export const { setSelectedCountry } = lineChartSlice.actions;
export default lineChartSlice.reducer;
