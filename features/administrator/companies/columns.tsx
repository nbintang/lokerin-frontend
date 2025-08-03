import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, ExternalLink, Trash2 } from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";
import { Company } from "@/shared-api/hooks/companies/useCompanies";

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: "Company",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={row.original.logoUrl} alt={row.original.name} />
          <AvatarFallback>
            {row.original.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p className="font-medium truncate">{row.original.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const websiteUrl = row.original.website;
      return (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          <span>{websiteUrl.replace(/^(https?:\/\/)?(www\.)?/, "")}</span>
        </a>
      );
    },
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
    cell: ({ row }) => {
      const company = row.original;
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
              <Link href={`/admin/companies/${company.id}`}>
                <Eye   />
                <span>View Details</span>
              </Link>
            </DropdownMenuItem>
 
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" className="cursor-pointer">
              <Trash2 />
             Delete Company
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
