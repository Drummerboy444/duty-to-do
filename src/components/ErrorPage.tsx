import { ErrorCallout } from "./ErrorCallout";

export const ErrorPage = ({ message }: { message: string }) => {
  return (
    <main className="flex justify-center px-8 py-12 sm:px-16 lg:px-24">
      <ErrorCallout message={message} />
    </main>
  );
};
