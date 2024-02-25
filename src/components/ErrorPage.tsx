import { ErrorCallout } from "./ErrorCallout";

export const ErrorPage = ({ message }: { message: string }) => {
  return (
    <main className="flex justify-center p-24">
      <ErrorCallout message={message} />
    </main>
  );
};
