import { getAllWindows } from "@tauri-apps/api/window";
import { Show } from "solid-js";
import { createCurrentRecordingQuery } from "~/utils/queries";

export default function () {
	const currentRecording = createCurrentRecordingQuery();

	getAllWindows().then((w) =>
		w.forEach((w) => {
			if (w.label === "camera" || w.label === "in-progress-recording")
				w.setFocus();
		}),
	);

	const bounds = () => {
		if (!currentRecording.data) return;
		const target = currentRecording.data.target;
		if (typeof target === "object" && "window" in target) {
			return target.window.bounds;
		}
		if (typeof target === "object" && "area" in target) {
			return target.area.bounds;
		}
	};

	return (
		<Show when={bounds()}>
			{(bounds) => {
				getAllWindows().then((w) =>
					w.forEach((w) => {
						if (w.label === "camera" || w.label === "in-progress-recording")
							w.setFocus();
					}),
				);

				return (
					<div class="size-full absolute inset-0 *:absolute *:bg-black/50 *:pointer-events-none">
						{(() => {
							const { size, position } = bounds();
							return (
								<>
									<div class="top-0 left-0 w-full" style={{ height: `${position.y}px` }} />
									<div
										class="left-0 bottom-0 w-full"
										style={{ top: `${position.y + size.height}px` }}
									/>
									<div
										class="left-0"
										style={{
											top: `${position.y}px`,
											width: `${position.x}px`,
											height: `${size.height}px`,
										}}
									/>
									<div
										class="right-0"
										style={{
											top: `${position.y}px`,
											left: `${position.x + size.width}px`,
											height: `${size.height}px`,
										}}
									/>
								</>
							);
						})()}
					</div>
				);
			}}
		</Show>
	);
}
