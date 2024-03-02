import { SignUp, useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/LoadingPage";

export default function SignUpPage() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <LoadingPage />;

  if (isSignedIn) return undefined;

  return (
    <main className="flex h-screen items-center justify-center">
      <SignUp />
    </main>
  );
}
