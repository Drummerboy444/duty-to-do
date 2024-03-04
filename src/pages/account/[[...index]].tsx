import { UserProfile } from "@clerk/nextjs";
import { Button } from "~/components/Button";
import { ACCOUNT_ROUTE } from "~/utils/routing";

const DeleteAccountButton = () => {
  return <Button warn label="Delete account" />;
};

export default function AccountPage() {
  return (
    <main className="flex flex-col items-center gap-4 pb-12 pt-4 sm:pt-8 lg:pt-12">
      <UserProfile routing="path" path={ACCOUNT_ROUTE} />
      <div className="z-10">
        <DeleteAccountButton />
      </div>
    </main>
  );
}
