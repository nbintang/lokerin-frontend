import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Info,
  Briefcase,
} from "lucide-react"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Marquee } from "@/components/magicui/marquee";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import Link from "next/link";
import { AppliedJobResponse } from "@/shared-api/hooks/applied-job/useAppliedJob";

export const appliedJobColumns: ColumnDef<AppliedJobResponse>[] = [
  {
    accessorKey: "roleName",
    header: "Position",
    accessorFn: (row) => row.job.role.name,
    cell: ({ cell }) => cell.getValue<string>(),
  },
  {
    accessorKey: "companyName",
    header: "Company",
    accessorFn: (row) => row.job.company.name,
    cell: ({ row }) => (
      <div className="flex items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={row.original.job.company.logoUrl}
            alt={row.original.job.company.name}
          />
          <AvatarFallback>
            {row.original.job.company.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="ml-2">{row.original.job.company.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    accessorFn: (row) => row.job.location,
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className="max-w-[150px] flex items-center space-x-1"
      >
        <MapPin className="w-4 h-4 flex-shrink-0" />
        <Marquee className="p-0 truncate">{row.original.job.location}</Marquee>
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ cell }) => {
      const status = cell.getValue<AppliedJobResponse["status"]>();
      const variantMap: Record<
        AppliedJobResponse["status"],
        "default" | "secondary" | "destructive" | "outline"
      > = {
        APPLIED: "default",
        REVIEWED: "outline",
        ACCEPTED: "secondary",
        REJECTED: "destructive",
      };
      const iconMap: Record<AppliedJobResponse["status"], React.ReactNode> = {
        APPLIED: <Clock className="w-4 h-4 mr-1" />,
        REVIEWED: <Eye className="w-4 h-4 mr-1" />,
        ACCEPTED: <CheckCircle className="w-4 h-4 mr-1" />,
        REJECTED: <XCircle className="w-4 h-4 mr-1" />,
      };
      return (
        <Badge variant={variantMap[status]}>
          {iconMap[status]}
          {status.charAt(0) + status.toLowerCase().slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "appliedAt",
    header: "Applied",
    accessorFn: (row) => row.createdAt,
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      return formatDistanceToNow(date, { addSuffix: true });
    },
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
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
              <Link href={`/applier/dashboard/applied-jobs/details/${row.original.id}`}>
                <Info />
                See details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
