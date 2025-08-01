import {
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
import React from "react";
import { useFormContext } from "react-hook-form";
import { UserSchema } from "../schema";

const RoleForm = () => {
  const form = useFormContext<UserSchema>();
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>What's your role ?</FormLabel>
          <FormDescription>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum
            excepturi blanditiis quasi.
          </FormDescription>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="What's your role?" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="MEMBER">Job Seeker</SelectItem>
                  <SelectItem value="RECRUITER">Recruiter</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RoleForm;
