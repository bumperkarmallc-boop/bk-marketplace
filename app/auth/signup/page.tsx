import { redirect } from "next/navigation";

// This older signup page never saved anything and did not compile.
// The working signup page is /signup, so send visitors there.
export default function OldSignupPage() {
  redirect("/signup");
}
