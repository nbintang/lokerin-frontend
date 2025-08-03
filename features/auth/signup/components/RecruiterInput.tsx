import React from "react";
import { useFormContext } from "react-hook-form";
import { RecruiterSchema } from "../schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AsyncSelect } from "@/components/ui/async-select";
import {
  CompaniesResponse,
  Company,
  useCompanies,
} from "@/shared-api/hooks/companies/useCompanies";
import { lokerinAPI } from "@/shared-api/config/api";
import { AsyncSelectCompanies } from "@/components/ui/async-select-companies";
import { CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { AsyncSelectRoles } from "@/components/ui/async-select-roles";

const RecruiterInput = () => {
  const form = useFormContext<RecruiterSchema>();

  return (
    <>
      <FormField
        control={form.control}
        name="about"
        render={({ field }) => (
          <FormItem className="grid relative ">
            <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">About You</FormLabel>
            <FormControl>
              <Textarea
                rows={4}
                id="about"
                placeholder="Enter about yourself"
                className="resize-none"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>
      
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="companyId"
        render={({ field }) => (
          <FormItem className="grid relative ">
            <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">Company</FormLabel>
            <FormControl>
              <AsyncSelectCompanies<Company>
                fetcher={async (query, page = 1, limit = 10) => {
                  const res = await lokerinAPI.get<CompaniesResponse>(
                    "/companies",
                    {
                      params: {
                        name: query,
                        page,
                        limit,
                      },
                    }
                  );
                  return res.data;
                }}
                renderOption={(company) => (
                  <div className="flex flex-col">
                    <span className="font-medium">{company.name}</span>
                  </div>
                )}
                getOptionValue={(company) => company.id}
                getDisplayValue={(company) => (
                  <div className="flex items-center gap-2 text-left">
                    <div className="font-medium">{company.name}</div>
                  </div>
                )}
                notFound={(name) => (
                  <div className="flex justify-center items-center flex-col h-[90px]">
                    <div className="text-xs text-muted-foreground">
                      Company "{name}" not found
                    </div>
                  </div>
                )}
                label="Company"
                placeholder="Search company..."
                pageSize={10}
                queryKey="companies"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>
 
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">Position</FormLabel>
            <FormDescription>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              quod consectetur ut.
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
                label="Position"
                placeholder="Search position..."
                pageSize={10}
                queryKey="roles"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default RecruiterInput;
