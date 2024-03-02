import { SignIn, useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
import { LoadingPage } from "~/components/LoadingPage";
// import { HOME_ROUTE } from "~/utils/routing";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useUser();
  // const router = useRouter();

  if (!isLoaded) return <LoadingPage />;

  if (isSignedIn) return undefined;

  return (
    <main>
      <div className="flex h-screen items-center justify-center">
        <SignIn />
      </div>
    </main>
  );
}
