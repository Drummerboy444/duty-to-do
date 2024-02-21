import { UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { api } from "~/utils/api";

export default function Home() {
  const x = api.post.hello.useQuery({ text: "Something" });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1>This is a Header</h1>
        <UserButton afterSignOutUrl="/" />
      </main>
    </>
  );
}
