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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
 
import { Eye, Trash2, User as UserIcon } from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";
import { Recruiter } from "@/shared-api/hooks/recruiters/useRecruiters";


export const recruiterColumns: ColumnDef<Recruiter>[] = [
 
  {
    accessorFn: (row) => row.user.email,
    header: "Email",
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
              <Link href={`/admin/recruiters/details/${recruiter.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Recruiter Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/admin/users/details/${recruiter.user.id}`}>
                <UserIcon className="mr-2 h-4 w-4" />
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
