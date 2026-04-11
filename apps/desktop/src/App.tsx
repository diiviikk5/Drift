import { Route, Router, useCurrentMatches } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import {
	getCurrentWebviewWindow,
	type WebviewWindow,
} from "@tauri-apps/api/webviewWindow";
import { message } from "@tauri-apps/plugin-dialog";
import { createEffect, lazy, onCleanup, onMount, Suspense } from "solid-js";
import { Toaster } from "solid-toast";

import "@cap/ui-solid/main.css";
import "unfonts.css";
import "./styles/theme.css";

import { CapErrorBoundary } from "./components/CapErrorBoundary";
import { generalSettingsStore } from "./store";
import { initAnonymousUser } from "./utils/analytics";
import { type AppTheme, commands } from "./utils/tauri";
import titlebar from "./utils/titlebar-state";

const WindowChromeLayout = lazy(() => import("./routes/(window-chrome)"));
const NewMainPage = lazy(() => import("./routes/(window-chrome)/new-main"));
const SetupPage = lazy(() => import("./routes/(window-chrome)/setup"));
const SettingsLayout = lazy(() => import("./routes/(window-chrome)/settings"));
const SettingsGeneralPage = lazy(
	() => import("./routes/(window-chrome)/settings/general"),
);
const SettingsRecordingsPage = lazy(
	() => import("./routes/(window-chrome)/settings/recordings"),
);
const SettingsScreenshotsPage = lazy(
	() => import("./routes/(window-chrome)/settings/screenshots"),
);
const SettingsHotkeysPage = lazy(
	() => import("./routes/(window-chrome)/settings/hotkeys"),
);
const SettingsChangelogPage = lazy(
	() => import("./routes/(window-chrome)/settings/changelog"),
);
const SettingsFeedbackPage = lazy(
	() => import("./routes/(window-chrome)/settings/feedback"),
);
const SettingsExperimentalPage = lazy(
	() => import("./routes/(window-chrome)/settings/experimental"),
);
const SettingsLicensePage = lazy(
	() => import("./routes/(window-chrome)/settings/license"),
);
const SettingsIntegrationsPage = lazy(
	() => import("./routes/(window-chrome)/settings/integrations"),
);
const SettingsS3ConfigPage = lazy(
	() => import("./routes/(window-chrome)/settings/integrations/s3-config"),
);
const UpgradePage = lazy(() => import("./routes/(window-chrome)/upgrade"));
const UpdatePage = lazy(() => import("./routes/(window-chrome)/update"));
const CameraPage = lazy(() => import("./routes/camera"));
const CaptureAreaPage = lazy(() => import("./routes/capture-area"));
const DebugPage = lazy(() => import("./routes/debug"));
const EditorPage = lazy(() => import("./routes/editor"));
const InProgressRecordingPage = lazy(
	() => import("./routes/in-progress-recording"),
);
const ModeSelectPage = lazy(() => import("./routes/mode-select"));
const NotificationsPage = lazy(() => import("./routes/notifications"));
const RecordingsOverlayPage = lazy(() => import("./routes/recordings-overlay"));
const ScreenshotEditorPage = lazy(() => import("./routes/screenshot-editor"));
const TargetSelectOverlayPage = lazy(
	() => import("./routes/target-select-overlay"),
);
const WindowCaptureOccluderPage = lazy(
	() => import("./routes/window-capture-occluder"),
);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		},
		mutations: {
			onError: (e) => {
				message(`Error\n${e}`);
			},
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Suspense fallback={<LoadingScreen />}>
				<Inner />
			</Suspense>
		</QueryClientProvider>
	);
}

function Inner() {
	const currentWindow = getSafeCurrentWebviewWindow();

	if (currentWindow) {
		createThemeListener(currentWindow);
	}

	onMount(() => {
		initAnonymousUser();
	});

	return (
		<>
			<Toaster
				position="bottom-right"
				containerStyle={{
					"margin-top": titlebar.height,
				}}
				toastOptions={{
					duration: 3500,
					style: {
						padding: "8px 16px",
						"border-radius": "15px",
						"border-color": "var(--gray-200)",
						"border-width": "1px",
						"font-size": "1rem",
						"background-color": "var(--gray-50)",
						color: "var(--text-secondary)",
					},
				}}
			/>
			<CapErrorBoundary>
				<Router
					root={(props) => {
						const matches = useCurrentMatches();

						onMount(() => {
							for (const match of matches()) {
								if (match.route.info?.AUTO_SHOW_WINDOW === false) return;
							}

							if (location.pathname !== "/camera") {
								currentWindow?.show();
							}
						});

						return (
							<Suspense fallback={<LoadingScreen />}>{props.children}</Suspense>
						);
					}}
				>
					<Route path="/" component={WindowChromeLayout}>
						<Route path="/" component={NewMainPage} />
						<Route path="/setup" component={SetupPage} />
						<Route path="/settings" component={SettingsLayout}>
							<Route path="/" component={SettingsGeneralPage} />
							<Route path="/general" component={SettingsGeneralPage} />
							<Route path="/recordings" component={SettingsRecordingsPage} />
							<Route path="/screenshots" component={SettingsScreenshotsPage} />
							<Route path="/hotkeys" component={SettingsHotkeysPage} />
							<Route path="/changelog" component={SettingsChangelogPage} />
							<Route path="/feedback" component={SettingsFeedbackPage} />
							<Route
								path="/experimental"
								component={SettingsExperimentalPage}
							/>
							<Route path="/license" component={SettingsLicensePage} />
							<Route
								path="/integrations"
								component={SettingsIntegrationsPage}
							/>
							<Route
								path="/integrations/s3-config"
								component={SettingsS3ConfigPage}
							/>
						</Route>
						<Route path="/upgrade" component={UpgradePage} />
						<Route path="/update" component={UpdatePage} />
					</Route>
					<Route path="/camera" component={CameraPage} />
					<Route path="/capture-area" component={CaptureAreaPage} />
					<Route path="/debug" component={DebugPage} />
					<Route path="/editor" component={EditorPage} />
					<Route
						path="/in-progress-recording"
						component={InProgressRecordingPage}
					/>
					<Route path="/mode-select" component={ModeSelectPage} />
					<Route path="/notifications" component={NotificationsPage} />
					<Route path="/recordings-overlay" component={RecordingsOverlayPage} />
					<Route path="/screenshot-editor" component={ScreenshotEditorPage} />
					<Route
						path="/target-select-overlay"
						component={TargetSelectOverlayPage}
					/>
					<Route
						path="/window-capture-occluder"
						component={WindowCaptureOccluderPage}
					/>
				</Router>
			</CapErrorBoundary>
		</>
	);
}

function getSafeCurrentWebviewWindow() {
	const tauriInternals = (
		window as typeof window & {
			__TAURI_INTERNALS__?: {
				metadata?: { currentWindow?: { label?: string } };
			};
		}
	).__TAURI_INTERNALS__;

	if (!tauriInternals?.metadata?.currentWindow?.label) {
		return null;
	}

	return getCurrentWebviewWindow();
}

function createThemeListener(currentWindow: WebviewWindow) {
	const generalSettings = generalSettingsStore.createQuery();

	createEffect(() => {
		update(generalSettings.data?.theme ?? null);
	});

	onMount(async () => {
		const unlisten = await currentWindow.onThemeChanged((_) =>
			update(generalSettings.data?.theme),
		);
		onCleanup(() => unlisten?.());
	});

	function update(appTheme: AppTheme | null | undefined) {
		if (location.pathname === "/camera") return;

		if (appTheme === undefined || appTheme === null) return;

		const isDark =
			appTheme === "dark" ||
			(appTheme === "system" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);

		try {
			if (appTheme === "system") {
				localStorage.removeItem("drift-theme");
			} else {
				localStorage.setItem("drift-theme", appTheme);
			}
		} catch {}

		commands.setTheme(appTheme).then(() => {
			document.documentElement.classList.toggle("dark", isDark);
		});
	}
}

function LoadingScreen() {
	if (
		location.pathname === "/target-select-overlay" ||
		location.pathname === "/window-capture-occluder" ||
		location.pathname === "/recordings-overlay"
	) {
		return <div class="h-screen w-screen bg-transparent" />;
	}

	return (
		<div class="flex h-screen w-screen items-center justify-center bg-[#0d111a]/95 p-6">
			<div class="drift-panel flex min-w-[18rem] items-center gap-4 rounded-[28px] px-6 py-5">
				<div class="h-11 w-11 animate-spin rounded-full border-[3px] border-white/40 border-t-[#ff7a18]" />
				<div class="flex flex-col">
					<span class="text-[0.68rem] uppercase tracking-[0.24em] text-[--text-tertiary]">
						Drift
					</span>
					<span class="text-base font-semibold text-[--text-primary]">
						Loading desktop workspace
					</span>
				</div>
			</div>
		</div>
	);
}
