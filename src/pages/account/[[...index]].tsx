import { UserProfile } from "@clerk/nextjs";
import { ACCOUNT_ROUTE } from "~/utils/routing";

export default function AccountPage() {
  return (
    // The pb-12 is so that the Clerk badge never goes off of the edge of the
    // screen as it is positioned at the bottom on small screens.
    <main className="flex justify-center pb-12 pt-4 sm:pt-8 lg:pt-12">
      <UserProfile routing="path" path={ACCOUNT_ROUTE} />
    </main>
  );
}
