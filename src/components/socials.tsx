"use client";

import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "../../route";

export default function Socials() {
  const handleClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex gap-x-3">
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => handleClick("google")}
      >
        <FcGoogle className="size-6 mr-2" />
        Google
      </Button>
      <Button className="w-full" onClick={() => handleClick("github")}>
        <FaGithub className="size-6 mr-2" />
        GitHub
      </Button>
    </div>
  );
}
