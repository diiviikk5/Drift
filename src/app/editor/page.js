import { redirect } from "next/navigation";

export const metadata = {
    title: "Drift Desktop | Download",
    description: "Edit your recordings with precision. Adjust zoom keyframes and export in multiple formats with Drift Desktop.",
};

export default function EditorPage() {
    redirect("/#install");
}
