import { UserProfile } from "@clerk/nextjs";
import { ACCOUNT_ROUTE } from "~/utils/routing";

export default function AccountPage() {
  return (
    <main className="flex justify-center py-4 sm:py-8 lg:py-12">
      <UserProfile routing="path" path={ACCOUNT_ROUTE} />
    </main>
  );
}
