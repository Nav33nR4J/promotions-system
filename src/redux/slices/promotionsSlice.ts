import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

export interface Promotion {
  id?: number;
  promo_code: string;
  title: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  start_at: string;
  end_at: string;
  status?: "ACTIVE" | "INACTIVE";
  usage_limit?: number;
  usage_count?: number;
}

interface PromotionsState {
  promotions: Promotion[];
  selectedPromotion: Promotion | null;
  loading: boolean;
  error?: string;
  filter: string;
}

const initialState: PromotionsState = {
  promotions: [],
  selectedPromotion: null,
  loading: false,
  error: undefined,
  filter: "all",
};

// Fetch promotions with optional filter
export const fetchPromotions = createAsyncThunk(
  "promotions/fetch",
  async (filter?: string) => {
    const query = filter && filter !== "all" ? `?filter=${filter}` : "";
    const res = await api.get(`/promotions${query}`);
    return res.data.data as Promotion[];
  }
);

// Create a new promotion
export const createPromotion = createAsyncThunk(
  "promotions/create",
  async (data: Promotion) => {
    const res = await api.post("/promotions", data);
    return res.data.data as Promotion;
  }
);

// Update an existing promotion
export const updatePromotion = createAsyncThunk(
  "promotions/update",
  async ({ id, data }: { id: number; data: Partial<Promotion> }) => {
    const res = await api.put(`/promotions/${id}`, data);
    return res.data.data as Promotion;
  }
);

// Toggle promotion status (active/inactive)
export const togglePromotionStatus = createAsyncThunk(
  "promotions/toggleStatus",
  async (id: number) => {
    const res = await api.patch(`/promotions/${id}/toggle`);
    return res.data.data as Promotion;
  }
);

// Delete a promotion
export const deletePromotion = createAsyncThunk(
  "promotions/delete",
  async (id: number) => {
    await api.delete(`/promotions/${id}`);
    return id;
  }
);

// Get promotion by ID
export const getPromotionById = createAsyncThunk(
  "promotions/getById",
  async (id: number) => {
    const res = await api.get(`/promotions/${id}`);
    return res.data.data as Promotion;
  }
);

const promotionsSlice = createSlice({
  name: "promotions",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    },
    clearSelectedPromotion: (state) => {
      state.selectedPromotion = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch promotions
    builder
      .addCase(fetchPromotions.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = action.payload;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Create promotion
    builder
      .addCase(createPromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions.push(action.payload);
      })
      .addCase(createPromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Update promotion
    builder
      .addCase(updatePromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePromotion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.promotions.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.promotions[index] = action.payload;
        }
      })
      .addCase(updatePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Toggle status
    builder
      .addCase(togglePromotionStatus.pending, (state, action) => {
        // Optimistic update: toggle the status immediately in the UI
        const id = action.meta.arg;
        const index = state.promotions.findIndex((p) => p.id === id);
        if (index !== -1) {
          const currentStatus = state.promotions[index].status;
          state.promotions[index].status = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        }
      })
      .addCase(togglePromotionStatus.fulfilled, (state, action) => {
        const index = state.promotions.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.promotions[index] = action.payload;
        }
      })
      .addCase(togglePromotionStatus.rejected, (state, action) => {
        // Revert optimistic update on failure
        const id = action.meta.arg;
        const index = state.promotions.findIndex((p) => p.id === id);
        if (index !== -1) {
          const currentStatus = state.promotions[index].status;
          state.promotions[index].status = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        }
        state.error = action.error.message;
      });

    // Delete promotion
    builder
      .addCase(deletePromotion.fulfilled, (state, action) => {
        state.promotions = state.promotions.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePromotion.rejected, (state, action) => {
        state.error = action.error.message;
      });

    // Get by ID
    builder
      .addCase(getPromotionById.fulfilled, (state, action) => {
        state.selectedPromotion = action.payload;
      });
  },
});

export const { setFilter, clearError, clearSelectedPromotion } = promotionsSlice.actions;
export default promotionsSlice.reducer;

