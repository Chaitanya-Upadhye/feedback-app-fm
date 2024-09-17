import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import stylesheet from "~/tailwind.css";
import { Database } from "./types/supabase";
import { getSupabase } from "./supabase";
import { cache } from "./utils/cache.server";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };
  const { data: categories } = await getSupabase({ request })
    .from("category")
    .select("*");
  cache.set("categories", categories);
  return json({ env, categories });
};
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className=" font-jost bg-mainBg h-full ">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { env } = useLoaderData<typeof loader>();

  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );
  return <Outlet context={{ supabase }} />;
}
