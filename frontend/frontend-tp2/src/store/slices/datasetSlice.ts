import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { datasetService } from '../../services/api/datasetService';
import { Dataset } from '../../types/dataset.types';

interface DatasetState {
  datasets: Dataset[];
  currentDataset: Dataset | null;
  loading: boolean;
  error: string | null;
  filters: Record<string, any>;
  hasSearched: boolean; // Pour savoir si une recherche a été effectuée
}

const initialState: DatasetState = {
  datasets: [],
  currentDataset: null,
  loading: false,
  error: null,
  filters: {},
  hasSearched: false,
};

// Actions asynchrones
export const fetchDatasets = createAsyncThunk(
  'datasets/fetchAll',
  async (filters: Record<string, any> = {}, { rejectWithValue }) => {
    try {
      const data = await datasetService.getAll(filters);
      return { data, filters };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des données');
    }
  }
);

export const fetchDatasetById = createAsyncThunk(
  'datasets/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await datasetService.getById(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération du dataset');
    }
  }
);

// Slice
const datasetSlice = createSlice({
  name: 'datasets',
  initialState,
  reducers: {
    clearFilters: (state) => {
      state.filters = {};
      state.hasSearched = false;
    },
    setFilters: (state, action: PayloadAction<Record<string, any>>) => {
      state.filters = action.payload;
      state.hasSearched = true;
    },
  },
  extraReducers: (builder) => {
    // Fetch all datasets
    builder
      .addCase(fetchDatasets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDatasets.fulfilled, (state, action) => {
        state.loading = false;
        state.datasets = action.payload.data;
        state.filters = action.payload.filters;
        state.hasSearched = Object.keys(action.payload.filters).length > 0;
      })
      .addCase(fetchDatasets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch dataset by ID
    builder
      .addCase(fetchDatasetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDatasetById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDataset = action.payload;
      })
      .addCase(fetchDatasetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFilters, setFilters } = datasetSlice.actions;
export default datasetSlice.reducer;