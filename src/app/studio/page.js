import { RecordingProvider } from "@/context/RecordingContext";
import RecordingStudio from "../components/studio/RecordingStudio";

export const metadata = {
    title: "Drift Studio | Record",
    description: "Professional screen recording with cinematic zoom effects. Free, privacy-first.",
};

export default function StudioPage() {
    return (
        <RecordingProvider>
            <RecordingStudio />
        </RecordingProvider>
    );
}
