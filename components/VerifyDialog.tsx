"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useShallow } from "zustand/shallow";

import { CheckCircle, Loader2, BadgeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useHandleVerifyDialog from "@/hooks/useHandleVerifyDialog";

export default function VerifyDialog() {
  const { isOpen, message, isLoading, isSuccess, isError } =
    useHandleVerifyDialog(
      useShallow((state) => ({
        key: state.key,
        isOpen: state.isOpen,
        setOpenDialog: state.setOpenDialog,
        message: state.description,
        isLoading: state.isLoading,
        isSuccess: state.isSuccess,
        isError: state.isError,
      }))
    );
  useEffect(() => {
    if (isSuccess || isError) {
      useHandleVerifyDialog.getState().closeDialog(3);
    }
  }, [isSuccess, isError]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          useHandleVerifyDialog.getState().closeDialog();
        }
      }}
    >
      <DialogContent
        showCloseButton={isError ? true : false}
        className="max-w-md"
        onInteractOutside={(e) => {
          if (!isError) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <div
            className={cn(
              "flex items-center justify-center size-12 mx-auto rounded-full  h-28 mb-1"
            )}
          >
            {isLoading ? (
              <Loader2 className="size-8 animate-spin text-blue-400" />
            ) : isSuccess ? (
              <div className="bg-green-100 text-green-600 rounded-full size-12 flex items-center justify-center">
                <CheckCircle className="size-8" />
              </div>
            ) : isError ? (
              <div className="bg-red-100 text-red-500 rounded-full size-12 flex items-center justify-center">
                <BadgeX className="size-8" />
              </div>
            ) : null}
          </div>
          <DialogTitle className="text-center text-2xl">
            {isSuccess
              ? "Success!"
              : isError
              ? "Failed to Process"
              : "Processing..."}
          </DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
