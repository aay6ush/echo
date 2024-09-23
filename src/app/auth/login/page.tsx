import Link from "next/link";
import Socials from "@/components/socials";
import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8 text-white">
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight">
            Log in to your account
          </h2>
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="hover:underline"
              prefetch={false}
            >
              Register
            </Link>
          </p>
        </div>
        <Socials />
        <div className="flex items-center justify-between space-x-2">
          <span className="w-28 h-[1px] bg-neutral-800" />
          <p className="text-center text-sm text-neutral-400">
            Or continue with
          </p>
          <span className="w-28 h-[1px] bg-neutral-800" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
