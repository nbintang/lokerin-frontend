"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useHandleSelectStatusDialog from "@/hooks/useHandleSelectStatusDialog";
import { useShallow } from "zustand/shallow";
import z from "zod";
import { ApplicantResponse } from "@/shared-api/hooks/job-applicants/useApplicant";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useUpdateApplicantStatus } from "@/shared-api/hooks/job-applicants/useUpdateApplicantStatus";
import { useUpdateApplicantsStatus } from "@/shared-api/hooks/job-applicants/useUpdateApplicantsStatus";
import { useParams, useRouter } from "next/navigation";

const applicantStatus: ApplicantResponse["status"][] = [
  "REJECTED",
  "ACCEPTED",
  "REVIEWED",
  "APPLIED",
];
const statuSchema = z.object({ status: z.enum(applicantStatus) });
export default function SelectStatusDialog() {
  const { open, setOpen, status, jobId, applicantIds } =
    useHandleSelectStatusDialog(
      useShallow((state) => ({
        open: state.isOpen,
        setOpen: state.setOpen,
        status: state.applicant.status,
        jobId: state.applicant.jobId,
        applicantIds: state.applicant.ids,
      }))
    );
  const router = useRouter();
  const { applicantId } = useParams();
  const form = useForm<z.infer<typeof statuSchema>>({
    resolver: zodResolver(statuSchema),
    defaultValues: { status },
  });
  const { mutateAsync: updateStatus, isPending } = useUpdateApplicantStatus(
    applicantId?.toString() ?? "",
    jobId ?? ""
  );
  const { mutateAsync: updateStatusBulk, isPending: isPendingBulk } =
    useUpdateApplicantsStatus(jobId ?? "");
  const onSubmit = async ({ status }: z.infer<typeof statuSchema>) => {
    form.setValue("status", status);
    // console.log(status);
    if (Array.isArray(applicantIds) && applicantIds.length > 0) {
      await updateStatusBulk({ status, applicantIds });
    } else {
      await updateStatus({ status });
      router.push("/dashboard");
    }

    setOpen({
      isOpen: false,
      applicant: {
        jobId,
        status,
        id: applicantId?.toString(),
      },
    });
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(open) =>
        setOpen({
          isOpen: open,
          applicant: {
            jobId,
            status: status,
            id: applicantId?.toString(),
            ids: applicantIds,
          },
        })
      }
    >
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Change Applicant Status</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full gap-y-3">
          {applicantStatus.map((statusOption) => (
            <Button
              key={statusOption}
              type="button"
              variant={statusOption === status ? "default" : "outline"}
              onClick={() => onSubmit({ status: statusOption })}
              disabled={
                statusOption === status ||
                form.formState.isSubmitting ||
                isPending ||
                isPendingBulk
              }
            >
              {statusOption}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
