"use client";
import { usePositionDialogStore } from "../hooks/usePositionDialogStore";
import { useShallow } from "zustand/shallow";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { FormDialogLayout } from "@/components/layouts/FormDialogLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateRole } from "@/shared-api/hooks/roles/useCreateRole";

const positionSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
});
export const PositionDialog = () => {
  const { isOpen, data, close } = usePositionDialogStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      data: state.data,
      mode: state.mode,
      close: state.close,
    }))
  );

  const form = useForm<z.infer<typeof positionSchema>>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      name: data?.name || "",
    },
  });

  const { mutate, isPending } = useCreateRole();

  const onSubmit = async (data: z.infer<typeof positionSchema>) => {
    mutate(data);
    form.reset();
    close();
  };

  const isSubmitting = isPending || form.formState.isSubmitting;

  return (
    <FormDialogLayout isOpen={isOpen} onOpenChange={close} title="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position Name</FormLabel>
                <FormDescription>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Assumenda, maxime? Voluptatem, voluptate!
                </FormDescription>
                <FormControl>
                  <Input placeholder="Type new position name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.isDirty && (
            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          )}
        </form>
      </Form>
    </FormDialogLayout>
  );
};
