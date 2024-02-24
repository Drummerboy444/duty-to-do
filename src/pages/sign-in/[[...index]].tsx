import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main>
      <div className="flex h-screen items-center justify-center">
        <SignIn />
      </div>
    </main>
  );
}
