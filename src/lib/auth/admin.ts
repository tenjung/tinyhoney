import { redirect } from "next/navigation";
import { getCurrentUserContext } from "@/lib/auth/user-context";

export async function requireAdmin() {
    const ctx = await getCurrentUserContext();
    if (!ctx.user) {
        redirect("/auth/login");
    }
    if (!ctx.isAdmin) {
        redirect("/");
    }
    return ctx;
}
