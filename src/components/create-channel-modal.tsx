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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Hash, PlusIcon, Video, Volume2 } from "lucide-react";
import { UploadButton } from "@/lib/uploadthings";
import Image from "next/image";
import axios from "axios";
import { ChannelType } from "@prisma/client";
import { useParams } from "next/navigation";

const formSchema = z.object({
  channelName: z
    .string()
    .min(2, {
      message: "Server name must be at least 2 characters.",
    })
    .refine((value) => value !== "general", {
      message: "Channel name can't be 'general'.",
    }),
  channelType: z.nativeEnum(ChannelType).optional(),
});

export function CreateChannelModal({ open, onOpenChange }) {
  const { serverId } = useParams<{ serverId: string }>(); // Add this line to define params

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: "",
      channelType: ChannelType.TEXT,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        `/api/server/${serverId}/channels`,
        values
      );
      if (response.status !== 200) {
        throw new Error("Failed to create channel");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="channelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Name</FormLabel>
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
            <FormField
              control={form.control}
              name="channelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TEXT">
                          <div className="flex items-center">
                            <Hash className="mr-2 h-4 w-4" />
                            <span>Text</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="VOICE">
                          <div className="flex items-center">
                            <Volume2 className="mr-2 h-4 w-4" />
                            <span>Voice</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="VIDEO">
                          <div className="flex items-center">
                            <Video className="mr-2 h-4 w-4" />
                            <span>Video</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                Create Channel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
