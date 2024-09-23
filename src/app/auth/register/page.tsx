import Link from "next/link";
import RegisterForm from "@/components/register-form";
import Socials from "@/components/socials";

export default function RegisterPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8 text-white">
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight">
            Create a new account
          </h2>
          <p>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="hover:underline"
              prefetch={false}
            >
              Log in
            </Link>
          </p>
        </div>
        <Socials />
        <div className="flex items-center justify-between gap-x-2">
          <span className="w-24 h-[1px] bg-neutral-800" />
          <p className="text-center text-sm text-neutral-400">
            Or continue with
          </p>
          <span className="w-24 h-[1px] bg-neutral-800" />
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
