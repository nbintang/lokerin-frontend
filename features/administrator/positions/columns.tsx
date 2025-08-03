import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useHandleWarningDialog from "@/hooks/useHandleWarningDialog";
import { useDeleteRole } from "@/shared-api/hooks/roles/useDeleteRole";
import { Role } from "@/shared-api/hooks/roles/useRoles";
import { IconDotsVertical } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";

export const positionColumns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Position",
  },
  {
    accessorKey: "createdAt",
    header: "Date Added",
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      return formatDistanceToNow(date, { addSuffix: true });
    },
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      const { mutate } = useDeleteRole(row.original.id);
      const setOpenWarningDialog = useHandleWarningDialog(
        (s) => s.setOpenDialog
      );
      const handleDelete = () =>
        setOpenWarningDialog({
          isOpen: true,
          title: "Delete Position",
          description: "Are you sure you want to delete this position?",
          onConfirm: () => mutate(),
        });
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 />
              Delete Position
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
