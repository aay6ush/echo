"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/lib/uploadthings";
import Image from "next/image";
import axios from "axios";
import { useEffect } from "react";
import { Server } from "@prisma/client";

const formSchema = z.object({
  serverName: z.string().min(2, {
    message: "Server name must be at least 2 characters.",
  }),
  serverLogo: z.string().optional(),
});

type EditServerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: Server;
};

export function EditServerModal({
  open,
  onOpenChange,
  server,
}: EditServerModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverName: "",
      serverLogo: "",
    },
  });

  useEffect(() => {
    form.setValue("serverLogo", server.image);
    form.setValue("serverName", server.name);
  }, [form, server]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("hello", server.id);
      await axios.patch(`/api/server/${server.id}`, values);
    } catch (error) {
      console.error(error);
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] z-50">
        <DialogHeader>
          <DialogTitle>Edit the server</DialogTitle>
          <DialogDescription>Change the server name and logo</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="serverLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Logo</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      {field.value ? (
                        <Image
                          src={field.value}
                          alt="Server logo preview"
                          width={200}
                          height={200}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-secondary" />
                      )}

                      <UploadButton
                        endpoint="serverLogo"
                        onClientUploadComplete={(res) => {
                          const fileUrl = res[0]?.url;
                          if (fileUrl) {
                            field.onChange(fileUrl);
                          }
                        }}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter server name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
