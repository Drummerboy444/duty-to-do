import { UserButton } from "@clerk/nextjs";
import { api } from "~/utils/api";

export default function Home() {
  const x = api.activityCollection.test.useQuery();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <h1>This is a Header</h1>
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
