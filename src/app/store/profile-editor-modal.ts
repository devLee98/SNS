import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import type { EditableProfile } from "@/lib/types";

const initialState = {
  isOpen: false,
  profile: null as EditableProfile | null,
};

const useProfileEditorModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (profile: EditableProfile) => set({ isOpen: true, profile }),
        close: () => set({ isOpen: false, profile: null }),
      },
    })),
    { name: "profileeditormodalstore" },
  ),
);

export const useOpenProfileEditorModal = () => {
  const open = useProfileEditorModalStore((state) => state.actions.open);
  return open;
};

export const useCloseProfileEditorModal = () => {
  const close = useProfileEditorModalStore((state) => state.actions.close);
  return close;
};

export const useProfileEditorModal = () => {
  const store = useProfileEditorModalStore();
  return store;
};
