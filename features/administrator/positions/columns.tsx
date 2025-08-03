import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Roles } from "@/shared-api/hooks/roles/useRoles";
import { IconDotsVertical } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Trash2, UserIcon } from "lucide-react";
import Link from "next/link";

export const positiionColumns: ColumnDef<Roles>[] = [
  {
    accessorKey: "name",
    header: "Position",
  },
  {
    accessorKey: "createdAt",
    header: "Date Added",
  },
  {
    id: "actions",
    header: () => null,
    cell: () => {
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
              <Link href={``}>
                <Eye />
                <span>View Recruiter Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/ `}>
                <UserIcon />
                <span>View User Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer  "
            >
              <Trash2 />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
