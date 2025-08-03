import { useOpenFormDialogStore } from "@/hooks/useOpenFormDialog";
import React from "react";
import { useShallow } from "zustand/shallow";
import { Dialog } from "./ui/dialog";

const OpenFormDialogLayout = ({
    children,
    title,
    
}:{children: React.ReactNode}) => {
  const {
    key,
    isOpen,
    titleSuccess,
    titleError,
    isError,
    isSuccess,
    description,
  } = useOpenFormDialogStore(useShallow((state) => ({
    key: state.key,
    isOpen: state.isOpen,
    titleSuccess: state.titleSuccess,
    titleError: state.titleError,
    isError: state.isError,
    isSuccess: state.isSuccess,
    description: state.description,
  })));

  if(key ===  ) return null
  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => {}}>
    
    </Dialog>
  )
};

export default OpenFormDialogLayout;
