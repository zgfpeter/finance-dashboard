// store/modalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalType } from "@/lib/types/dashboard";

interface ModalState {
  type: ModalType;
  data?: any; // data passed into the modal
}

const initialState: ModalState = {
  type: "none",
  data: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ type: ModalType; data?: any }>
    ) => {
      state.type = action.payload.type;
      state.data = action.payload.data ?? null;
    },
    closeModal: (state) => {
      state.type = "none";
      state.data = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
