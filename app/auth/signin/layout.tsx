import SignLayout from "@/features/auth/components/SignLayout";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SignLayout>{children}</SignLayout>;
}
