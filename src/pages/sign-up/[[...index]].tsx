import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main>
      <div className="flex h-screen items-center justify-center">
        <SignUp />
      </div>
    </main>
  );
}
