"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import FormSuccess from "./form-success";
import { useEffect, useState, useTransition } from "react";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "../../actions/reset-password";
import { ResetPasswordSchema } from "@/lib/schema";
import FormSuccess from "./form-success";
// import { ResetPasswordSchema } from "@/lib/schemas";
// import { resetPassword } from "@/actions/reset-password";

export default function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");

  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider."
      : "";

  useEffect(() => {
    if (urlError) {
      setSuccess(false);
      setMessage(urlError);
    }
  }, [urlError]);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    setSuccess(null);
    setMessage("");

    startTransition(async () => {
      const result = await resetPassword(values);

      if (result) {
        setSuccess(result.success);
        setMessage(result.message);
      } else {
        setSuccess(false);
        setMessage("An unexpected error occurred.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="john@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {success !== null && (
          <FormSuccess success={success} message={message} />
        )}
        <Button disabled={isPending} type="submit" className="w-full" size="lg">
          {isPending ? (
            <span className="animate-spin">
              <Loader className="size-5" />
            </span>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    </Form>
  );
}
