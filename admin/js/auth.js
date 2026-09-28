import { supabase } from "../../js/supabase.js";

export async function getAdminUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  if (user.app_metadata?.role !== "admin") {
    return null;
  }

  return user;
}

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function logout() {
  return await supabase.auth.signOut();
}

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
