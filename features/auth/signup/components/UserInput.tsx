import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";
import { UserSchema } from "../schema";

const UserInput = () => {
  const form = useFormContext<UserSchema>();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="grid relative ">
              <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">First Name</FormLabel>
              <FormControl>
                <Input
                  id="firstName"
                  placeholder="Enter your First Name"
                  type="text"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">Last Name</FormLabel>
              <FormControl>
                <Input
                  id="lastName"
                  placeholder="Enter your Last Name "
                  type="text"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
 
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
<div  className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="grid gap-3 relative">
            <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">Email</FormLabel>
            <FormControl>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>
 
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className="grid gap-3 relative">
            <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">Phone</FormLabel>
            <FormControl>
              <Input
                id="phone"
                placeholder="08xxxxxxxx"
                type="number"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>
 
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
</div>

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="grid gap-3 relative ">
               <FormLabel htmlFor="confirmPassword"className="after:content-['*'] after:ml-1 after:text-red-500"> Password</FormLabel>
            <FormControl>
              <Input
                id="password"
                placeholder="Enter your password"
                type="password"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>
        
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="grid gap-3">
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <FormControl>
              <Input
                id="password"
                placeholder="********"
                type="password"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage  className="text-xs"/>
          </FormItem>
        )}
      />
    </>
  );
};

export default UserInput;
