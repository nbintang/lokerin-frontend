import { use } from "react";

export default function Applicant({
  params,
}: {
  params: Promise<{ applicantId: string }>;
}) {
  const { applicantId } = use(params);
  return <div></div>;
}
