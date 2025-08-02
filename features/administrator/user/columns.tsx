import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

// Import UI components from shadcn/ui
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import Icons
import {
  User as UserIcon,
  Briefcase,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Trash2,
} from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";
import { User } from "@/shared-api/hooks/users/useUsers";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={row.original.avatarUrl ?? ""}
            alt={row.original.name}
          />
          <AvatarFallback>
            {row.original.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;

      const variantMap: Record<User["role"], "default" | "secondary"> = {
        RECRUITER: "default",
        MEMBER: "secondary",
      };

      const iconMap: Record<User["role"], React.ReactNode> = {
        RECRUITER: <Briefcase className="w-4 h-4 mr-1" />,
        MEMBER: <UserIcon className="w-4 h-4 mr-1" />,
      };

      return (
        <Badge variant={variantMap[role]} className="capitalize">
          {iconMap[role]}
          {role.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isVerified",
    header: "Status",
    cell: ({ row }) => {
      const isVerified = row.original.isVerified;

      return isVerified ? (
        <Badge variant="secondary" className="text-green-600 border-green-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          Verified
        </Badge>
      ) : (
        <Badge variant="destructive">
          <XCircle className="w-4 h-4 mr-1" />
          Not Verified
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      // Format date to a relative time string (e.g., "about 3 months ago")
      return formatDistanceToNow(date, { addSuffix: true });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/admin/users/details/${user.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </Link>
            </DropdownMenuItem>
            {user.cvUrl && (
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link
                  href={user.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>View CV</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
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
