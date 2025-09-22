import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/mdx";

export default function RootRedirect() {
  redirect(`/${DEFAULT_LOCALE}`);
}
