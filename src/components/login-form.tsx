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
import { useEffect, useState, useTransition } from "react";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LoginSchema } from "@/lib/schema";
import login from "../../actions/login";
import FormSuccess from "./form-success";
// import { LoginSchema } from "@/lib/schemas";
// import login from "@/actions/login";

export default function LoginForm() {
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

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    setSuccess(null);
    setMessage("");

    startTransition(async () => {
      login(values)
        .then((result) => {
          if (result) {
            setSuccess(result.success);
            setMessage(result.message);
          }
        })
        .catch((error) => {
          setSuccess(false);
          setMessage("An unexpected error occurred.");
        });
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
                  placeholder="johndoe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center -mb-2">
                Password
                <Button variant="link" asChild>
                  <Link href="/auth/reset-password">Forgot password?</Link>
                </Button>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  type="password"
                  placeholder="******"
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
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
}
