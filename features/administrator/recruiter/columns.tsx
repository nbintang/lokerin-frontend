import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

// Import UI components from shadcn/ui
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Eye, Trash2, User as UserIcon } from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";
import { Recruiter } from "@/shared-api/hooks/recruiters/useRecruiters";
import useHandleWarningDialog from "@/hooks/useHandleWarningDialog";
import { useDeleteRecruiter } from "@/shared-api/hooks/recruiters/useDeleteRecruiter";

export const recruiterColumns: ColumnDef<Recruiter>[] = [
  {
    accessorKey: "user.name",
    header: "Name",
    cell: ({ row }) => {
      const recruiter = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={recruiter.user.avatarUrl ?? ""}
              alt={recruiter.user.name}
            />
            <AvatarFallback>
              {recruiter.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{recruiter.user.name}</span>
        </div>
      );
    },
  },
  {
    header: "Position",
    accessorKey: "position.name",
    cell: ({ row }) => {
      return (
        <div>
          <span className="font-medium">{row.original.position.name}</span>
        </div>
      );
    },
  },
  {
    header: "Company",
    accessorKey: "company.name",
    cell: ({ row }) => {
      const recruiter = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={recruiter.company.logoUrl ?? ""}
              alt={recruiter.company.name}
            />
            <AvatarFallback>
              {recruiter.company.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button variant={"link"} className="p-0 m-0" asChild>
            <Link
              href={`/administrator/dashboard/companies/${recruiter.company.id}`}
            >
              {recruiter.company.name}
            </Link>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Recruiter Since",
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      // Format date to a relative time string
      return formatDistanceToNow(date, { addSuffix: true });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const recruiter = row.original;
      const setOpenWarningDialog = useHandleWarningDialog(
        (s) => s.setOpenDialog
      );
      const { mutate } = useDeleteRecruiter(row.original.id);
      const handleDelete = () =>
        setOpenWarningDialog({
          isOpen: true,
          title: "Delete Recruiter And User Account",
          description: "This will contains the user account. are you sure you want to delete this recruiter?",
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
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link
                href={`/administrator/dashboard/users/${recruiter.user.id}`}
              >
                <UserIcon />
                <span>View User Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer  "
              onClick={handleDelete}
            >
              <Trash2 />
              Delete Recruiter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
