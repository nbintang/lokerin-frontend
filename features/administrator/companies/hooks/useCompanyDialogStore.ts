import { createDialogStore } from "@/hooks/createDialogStore";
import { Company } from "@/shared-api/hooks/companies/useCompanies";

export const useCompanyDialogStore = createDialogStore<Company>();