import { SignIn, useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/LoadingPage";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <LoadingPage />;

  if (isSignedIn) return undefined;

  return (
    <main className="flex h-screen items-center justify-center">
      <SignIn />
    </main>
  );
}
