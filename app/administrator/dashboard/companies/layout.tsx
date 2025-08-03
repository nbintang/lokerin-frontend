import { CompanyDialog } from "@/features/administrator/companies/components/CompanyDialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CompanyDialog />
    </>
  );
}
