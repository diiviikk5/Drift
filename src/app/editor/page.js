import { RecordingProvider } from "@/context/RecordingContext";
import TimelineEditor from "../components/editor/TimelineEditor";

export const metadata = {
    title: "Drift Editor | Timeline",
    description: "Edit your recordings with precision. Adjust zoom keyframes and export in multiple formats.",
};

export default function EditorPage() {
    return (
        <RecordingProvider>
            <TimelineEditor />
        </RecordingProvider>
    );
}
