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

const applicantStatus: ApplicantResponse["status"][] = [
  "REJECTED",
  "ACCEPTED",
  "REVIEWED",
  "APPLIED",
];
const statuSchema = z.object({ status: z.enum(applicantStatus) });
export default function SelectStatusDialog() {
  const { open, setOpen, status, id, jobId } = useHandleSelectStatusDialog(
    useShallow((state) => ({
      open: state.isOpen,
      setOpen: state.setOpen,
      status: state.applicant.status,
      id: state.applicant.id,
      jobId: state.applicant.jobId,
    }))
  );
  const form = useForm({
    resolver: zodResolver(statuSchema),
    defaultValues: { status },
  });

  const { mutateAsync, isPending } = useUpdateApplicantStatus(id, jobId);
  const onSubmit = async ({ status }: z.infer<typeof statuSchema>) => {
    form.setValue("status", status);
    const data = { status };
    await mutateAsync(data);
    setOpen({
      isOpen: false,
      applicant: {
        jobId,
        status,
        id: id,
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
            id: id,
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
                isPending
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
