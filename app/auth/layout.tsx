import VerifyDialog from "@/components/VerifyDialog";
import SignLayout from "@/features/auth/components/SignLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SignLayout>
      {children}
      <VerifyDialog />
    </SignLayout>
  );
}
