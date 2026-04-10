import { Button } from "@cap/ui-solid";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { ErrorBoundary, type ParentProps } from "solid-js";

export function CapErrorBoundary(props: ParentProps) {
	return (
		<ErrorBoundary
			fallback={(e: Error) => {
				console.error(e);
				return (
					<div class="w-full h-full flex flex-col justify-center items-center bg-gray-2 border-gray-3 max-h-screen overflow-hidden transition-[border-radius] duration-200 text-[--text-secondary] gap-y-4 max-sm:gap-y-2 px-8 text-center">
						<div class="text-[--text-primary] text-3xl max-sm:text-2xl font-semibold tracking-[0.22em] uppercase">
							Drift
						</div>
						<h1 class="text-[--text-primary] text-3xl max-sm:text-xl font-bold">
							Drift hit an error
						</h1>
						<p class="mb-2 max-sm:text-sm">
							Something went wrong while loading the desktop app.
						</p>
						<div class="flex flex-row gap-4 max-sm:flex-col max-sm:gap-2">
							<Button
								onClick={() => {
									writeText(`${e.toString()}\n\n${e.stack}`);
								}}
							>
								Copy Error to Clipboard
							</Button>
							<Button
								onClick={() => {
									location.reload();
								}}
								variant="gray"
							>
								Reload
							</Button>
							<Button
								onClick={() => {
									const tauriInternals = (window as typeof window & {
										__TAURI_INTERNALS__?: {
											metadata?: { currentWindow?: { label?: string } };
										};
									}).__TAURI_INTERNALS__;

									if (tauriInternals?.metadata?.currentWindow?.label) {
										getCurrentWebviewWindow().close();
									}
								}}
								variant="destructive"
							>
								Close
							</Button>
						</div>

						{import.meta.env.DEV && (
							<div class="h-0 text-sm">
								<pre class="text-left mt-8">{`${e.toString()}\n\n${e.stack
									?.toString()
									.split("\n")
									.slice(0, 10)
									.join("\n")}`}</pre>
							</div>
						)}
					</div>
				);
			}}
		>
			{props.children}
		</ErrorBoundary>
	);
}
