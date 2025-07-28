"use client";

import { Marquee } from "@/components/magicui/marquee";
import { AsyncSelect } from "@/components/ui/async-select";
import { AsyncSelectRoles } from "@/components/ui/async-select-roles";
import { Button } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { lokerinAPI } from "@/shared-api/config/api";
import { useCreateJob } from "@/shared-api/hooks/jobs/useCreateJob";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

export const salaryRanges = [
  "0-100000",
  "100000-200000",
  "200000-300000",
  "300000-400000",
  "400000-500000",
  "500000-600000",
  "600000-700000",
  "700000-800000",
  "800000-900000",
  "900000-1000000",
  "1000000-1100000",
  "1100000-1200000",
  "1200000-1300000",
  "1300000-1400000",
  "1400000-1500000",
  "1500000-1600000",
  "1600000-1700000",
  "1700000-1800000",
  "1800000-1900000",
  "1900000-2000000",
  "2000000-2100000",
  "2100000-2200000",
  "2200000-2300000",
  "2300000-2400000",
  "2400000-2500000",
  "2500000-999999999", // More than 2500000
];
const salaryRangeOptions = salaryRanges.map((range) => {
  const [min, max] = range.split("-").map(Number);

  if (range === "2500000-999999999") {
    return { label: "More than 2.500.000", value: range };
  }

  return {
    label: `${min.toLocaleString("id-ID")} - ${max.toLocaleString("id-ID")}`,
    value: range,
  };
});

type NominatimResponse = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    highway: string;
    road: string;
    city_block: string;
    neighbourhood: string;
    suburb: string;
    city: string;
    "ISO3166-2-lvl4": string;
    region: string;
    "ISO3166-2-lvl3": string;
    postcode: string;
    country: string;
    country_code: string;
  };
  boundingbox: Array<string>;
};

const newJobSchema = z.object({
  role: z.string().min(3, "Role must be at least 3 characters").max(50),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be at most 230 characters"),
  location: z.string(),
  salaryRange: z.enum(salaryRangeOptions.map((option) => option.value)),
});

type NewJob = z.infer<typeof newJobSchema>;
export default function NewJob() {
  const form = useForm<NewJob>({
    resolver: zodResolver(newJobSchema),
    defaultValues: {
      description: "",
      location: "",
      salaryRange: "Less than 100000",
      role: "",
    },
  });
  const { mutate, isPending } = useCreateJob();
  const onSubmit = async (data: NewJob) => {
    console.log(data);
    mutate(data);
  };
  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormDescription>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Eligendi quod consectetur ut.
              </FormDescription>
              <FormControl>
                <AsyncSelectRoles<{
                  id: string;
                  name: string;
                  createdAt: string;
                  updatedAt: string;
                }>
                  fetcher={async (query, page = 1, limit = 10) => {
                    const response = await lokerinAPI.get<{
                      roles: Array<{
                        id: string;
                        name: string;
                        createdAt: string;
                        updatedAt: string;
                      }>;
                      page: number;
                      limit: number;
                      total: number;
                    }>(`/roles`, {
                      params: {
                        name: query,
                        page,
                        limit,
                      },
                    });
                    return response.data;
                  }}
                  renderOption={(role) => (
                    <div className="flex flex-col">
                      <span className="font-medium">{role.name}</span>
                    </div>
                  )}
                  getOptionValue={(role) => role.name}
                  getDisplayValue={(role) => (
                    <div className="flex items-center gap-2 text-left">
                      <div className="font-medium">{role.name}</div>
                    </div>
                  )}
                  notFound={(name, onSelect) => (
                    <div className="flex justify-center items-center flex-col h-[90px]">
                      <div className="text-xs text-muted-foreground">
                        Role "{name}" not found
                      </div>
                      <CommandItem
                        className="!bg-transparent justify-center"
                        onSelect={() => onSelect(name)}
                      >
                        <Button variant="ghost">Create new role</Button>
                      </CommandItem>
                    </div>
                  )}
                  label="Role"
                  placeholder="Search roles..."
                  pageSize={10}
                  queryKey="roles"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormDescription>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque
                eius quisquam quidem!
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque eius quisquam quidem!"
                  className="resize-none min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="sm:col-span-2 max-w-full">
                <FormLabel>Location</FormLabel>
                <FormDescription>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Itaque eius quisquam quidem!
                </FormDescription>
                <FormControl>
                  <AsyncSelect<NominatimResponse>
                    fetcher={async (query) => {
                      const response = await axios.get(
                        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=id&accept-language=id`,
                        { params: { q: query } }
                      );
                      return response.data;
                    }}
                    getDisplayValue={(option) => (
                      <div
                        className={cn(
                          option.display_name.length > 80
                            ? "max-w-[200px] md:max-w-[400px] lg:max-w-none"
                            : "line-clamp-0"
                        )}
                      >
                        <p className="truncate">{option.display_name}</p>
                      </div>
                    )}
                    getOptionValue={(option) => `${option.display_name} ${option.name} ${option.place_id}`}
                    renderOption={(option) => (
                      <div className="flex items-center gap-3">
                        <Marquee className="p-0">
                          <div className="  whitespace-nowrap ">
                            {option.display_name}
                          </div>
                        </Marquee>
                      </div>
                    )}
                    label="Location"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salaryRange"
            render={({ field }) => (
              <FormItem className="sm:col-span-1">
                <FormLabel>Salary Range</FormLabel>
                <FormDescription>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                </FormDescription>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue   >
                        {field.value
                          ? salaryRangeOptions.find(
                              (option) => option.value === field.value
                            )?.label
                          : "Select a salary range"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectGroup>
                        {salaryRangeOptions.map((range, index) => (
                          <SelectItem key={index} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full sm:max-w-sm"
          disabled={form.formState.isSubmitting || isPending}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save
        </Button>
      </form>
    </Form>
  );
}
