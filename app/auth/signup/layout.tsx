import SignLayout from "@/features/auth/components/SignLayout";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SignLayout>{children}</SignLayout>;
}
