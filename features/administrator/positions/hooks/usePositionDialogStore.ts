import { createDialogStore } from "@/hooks/createDialogStore"; 
import { Role } from "@/shared-api/hooks/roles/useRoles";

export const usePositionDialogStore = createDialogStore<Role>();