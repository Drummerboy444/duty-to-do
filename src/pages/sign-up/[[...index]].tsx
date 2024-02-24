import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignUpPage() {
  const { resolvedTheme } = useTheme();

  return (
    <main>
      <div className="flex h-screen items-center justify-center">
        <SignUp
          {...(resolvedTheme === "dark"
            ? { appearance: { baseTheme: dark } }
            : {})}
        />
      </div>
    </main>
  );
}
