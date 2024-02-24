import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignInPage() {
  const { resolvedTheme } = useTheme();

  return (
    <main>
      <div className="flex h-screen items-center justify-center">
        <SignIn
          {...(resolvedTheme === "dark"
            ? { appearance: { baseTheme: dark } }
            : {})}
        />
      </div>
    </main>
  );
}
