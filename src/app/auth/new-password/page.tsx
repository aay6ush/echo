import NewPasswordForm from "@/components/new-password-form";
import Link from "next/link";

export default function NewPasswordPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8 text-white">
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight">
            Enter a new password
          </h2>
          <p>
            Go back to{" "}
            <Link
              href="/auth/login"
              className="hover:underline"
              prefetch={false}
            >
              Log in
            </Link>
          </p>
        </div>

        <NewPasswordForm />
      </div>
    </div>
  );
}
