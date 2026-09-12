import { redirect } from "next/navigation";

export const metadata = {
    title: "Drift Desktop | Download",
    description: "Professional screen recording with cinematic zoom effects. Free, privacy-first desktop software.",
};

export default function StudioPage() {
    redirect("/#install");
}
