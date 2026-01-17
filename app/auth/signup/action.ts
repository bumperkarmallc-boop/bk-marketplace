"use server";

export async function signupAction(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const terms = formData.get("terms");

  // Simple validation for now
  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (!terms) {
    return { error: "You must agree to the terms." };
  }

  // Temporary success (later will save to DB)
  return { success: true };
}
