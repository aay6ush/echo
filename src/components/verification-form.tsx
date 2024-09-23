"use client";

import Link from "next/link";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { verification } from "../../actions/verification";
import FormSuccess from "./form-success";
// import FormSuccess from "./form-success";
// import { verification } from "@/actions/verification";

export default function VerificationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");

  const onSubmit = useCallback(() => {
    if (!token) {
      setSuccess(false);
      setMessage("Missing token!");
      return;
    }
    verification(token)
      .then((res) => {
        setSuccess(res.success);
        setMessage(res.message);
      })
      .catch((err) => {
        setSuccess(false);
        setMessage("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8 text-white">
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight">
            Confirming your verification
          </h2>
          <p>
            Go back to{" "}
            <Link href="/sign-in" className="hover:underline" prefetch={false}>
              Log in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-y-5 items-center justify-center">
          {success !== null ? (
            <FormSuccess success={success} message={message} />
          ) : (
            <BeatLoader />
          )}
        </div>
      </div>
    </div>
  );
}
