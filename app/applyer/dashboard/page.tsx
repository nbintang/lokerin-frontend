import { jwtDecode } from "@/shared-api/helpers/jwtDecode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function () {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return redirect("/auth/signin");
  const user = jwtDecode(token);
  if (user.role === "MEMBER") await redirect("/applyer/dashboard/jobs");
  return null;
}
