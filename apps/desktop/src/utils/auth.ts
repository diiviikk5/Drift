import { createMutation } from "@tanstack/solid-query";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function createSignInMutation() {
	return createMutation(() => ({
		mutationFn: async (_abort: AbortController) => {
			await getCurrentWindow().setFocus();
		},
	}));
}
