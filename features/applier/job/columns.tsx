import { ColumnDef } from "@tanstack/react-table";
import { Jobs } from "@/shared-api/hooks/jobs/useJobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Briefcase, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { Marquee } from "@/components/magicui/marquee";
import Link from "next/link";
import { formatSalaryRangePublic } from "@/helpers/concurrency-converter";
import useHandleWarningDialog from "@/hooks/useHandleWarningDialog";
import { useApplyJob } from "@/shared-api/hooks/applied-job/useApplyJob";

export const applierJobColumns: ColumnDef<Jobs>[] = [
  {
    accessorKey: "role.name", // boleh pakai ini juga untuk sorting, tapi tergantung lib
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
      <Badge
        variant="secondary"
        className="max-w-[150px] flex items-center space-x-1"
      >
        <MapPin className="w-4 h-4 flex-shrink-0" />
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
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      const setOpenDialog = useHandleWarningDialog((s) => s.setOpenDialog);
      const { mutate } = useApplyJob(row.original.id);
      const handleApplyJob = async () =>
        setOpenDialog({
          title: "Apply Job",
          description: "Are you sure you want to apply for this job?",
          onConfirm: () => mutate(),
          isOpen: true,
          buttonVariants: "default",
        });
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
              <Link href={`/applier/dashboard/jobs/${row.original.id}`}>
                <Info />
                Job detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleApplyJob}>
              <Briefcase />
              Apply job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
