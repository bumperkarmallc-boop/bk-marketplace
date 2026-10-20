import { redirect } from "next/navigation";

// This older login page was a form that did nothing.
// The working login page is /login, so send visitors there.
export default function OldLoginPage() {
  redirect("/login");
}
