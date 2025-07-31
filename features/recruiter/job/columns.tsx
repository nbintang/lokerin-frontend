import { ColumnDef } from "@tanstack/react-table"; 
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Calendar, Pen, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { Marquee } from "@/components/magicui/marquee";
import Link from "next/link";
import useHandleWarningDialog from "@/hooks/useHandleWarningDialog";
import { useDeleteJob } from "@/shared-api/hooks/jobs/useDeleteJob"; 
import { Jobs } from "@/shared-api/hooks/jobs/useJobs"; 
import { formatSalaryRangePublic } from "@/helpers/concurrency-converter"; 
export const recruiterJobColumns: ColumnDef<Jobs>[] = [
  {
    accessorKey: "role.name",
    header: "Position",
    cell: ({ row }) => <span>{row.original.role?.name ?? "-"}</span>,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={row.original.company.logoUrl}
            alt={row.original.company.name}
          />
          <AvatarFallback>{row.original.company.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="ml-2">{row.original.company.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <Badge       className="max-w-[150px] flex items-center space-x-1">
        <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
        <Marquee className="p-0 truncate">{row.original.location}</Marquee>
      </Badge>
    ),
  },
  {
    accessorKey: "salaryRange",
    header: "Salary",
    cell: ({ row }) => (
      <Badge variant="outline">
        {formatSalaryRangePublic(row.original.salaryRange)}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Posted",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          {formatDistanceToNow(date, { addSuffix: true })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      const setOpenDialog = useHandleWarningDialog(
        (state) => state.setOpenDialog
      );
      const { mutate } = useDeleteJob(row.original.id);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/recruiter/dashboard/jobs/${row.original.id}`}>
                <Pen />
                Edit Job
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setOpenDialog({
                  isOpen: true,
                  title: "Delete Job",
                  description: "Are you sure you want to delete this job?",
                  onConfirm: () => mutate(),
                })
              }
              variant="destructive"
              className="cursor-pointer  "
            >
              <Trash2 />
              Delete Job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
