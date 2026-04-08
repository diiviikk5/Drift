// @ts-check

import { exec as execCb, execFile as execFileCb } from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { env } from "node:process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execCb);
const execFile = promisify(execFileCb);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __root = path.resolve(path.join(__dirname, ".."));
const targetDir = path.join(__root, "target");

const arch =
	process.env.RUST_TARGET_TRIPLE?.split("-")[0] ??
	(process.arch === "arm64" ? "aarch64" : "x86_64");

async function main() {
	await fs.mkdir(targetDir, { recursive: true });

	const cargoEnv = [
		`FFMPEG_DIR = { relative = true, force = true, value = "target/native-deps" }`,
	];
	let cargoBuildSection = "";

	if (process.platform === "darwin") {
		const NATIVE_DEPS_VERSION = "v0.25";
		const NATIVE_DEPS_URL = `https://github.com/spacedriveapp/native-deps/releases/download/${NATIVE_DEPS_VERSION}`;

		const NATIVE_DEPS_ASSETS = {
			x86_64: "native-deps-x86_64-darwin-apple.tar.xz",
			aarch64: "native-deps-aarch64-darwin-apple.tar.xz",
		};

		const nativeDepsTar = NATIVE_DEPS_ASSETS[arch];
		const nativeDepsTarPath = path.join(targetDir, nativeDepsTar);
		let downloadedNativeDeps = false;

		if (!(await fileExists(nativeDepsTarPath))) {
			console.log(`Downloading ${nativeDepsTar}`);
			const nativeDepsBytes = await fetch(`${NATIVE_DEPS_URL}/${nativeDepsTar}`)
				.then((r) => r.blob())
				.then((b) => b.arrayBuffer());
			await fs.writeFile(nativeDepsTarPath, Buffer.from(nativeDepsBytes));
			console.log("Downloaded native deps");
			downloadedNativeDeps = true;
		} else console.log(`Using cached ${nativeDepsTar}`);

		const nativeDepsFolder = `native-deps`;
		const nativeDepsDir = path.join(targetDir, nativeDepsFolder);
		const frameworkDir = path.join(nativeDepsDir, "Spacedrive.framework");
		if (downloadedNativeDeps || !(await fileExists(nativeDepsDir))) {
			await fs.mkdir(nativeDepsDir, { recursive: true });
			await execFile("tar", ["xf", nativeDepsTarPath, "-C", nativeDepsDir]);
			console.log(`Extracted ${nativeDepsFolder}`);
		} else console.log(`Using cached ${nativeDepsFolder}`);

		await trimMacOSFramework(frameworkDir);
		console.log("Trimmed .framework");

		console.log("Signing .framework libraries");
		await signMacOSFrameworkLibs(frameworkDir);
		console.log("Signed .framework libraries");

		const frameworkTargetDir = path.join(
			targetDir,
			"Frameworks",
			"Spacedrive.framework",
		);
		await fs.rm(frameworkTargetDir, { recursive: true }).catch(() => {});
		await fs.cp(
			frameworkDir,
			path.join(targetDir, "Frameworks", "Spacedrive.framework"),
			{ recursive: true },
		);

		// alternative to specifying dylibs as linker args
		await fs.mkdir(path.join(targetDir, "/debug"), { recursive: true });
		for (const name of await fs.readdir(path.join(nativeDepsDir, "lib"))) {
			await fs.copyFile(
				path.join(nativeDepsDir, "lib", name),
				path.join(targetDir, "debug", name),
			);
		}
		console.log("Copied ffmpeg dylibs to target/debug");
	} else if (process.platform === "win32") {
		const FFMPEG_VERSION = "7.1";
		const FFMPEG_ZIP_NAME = `ffmpeg-${FFMPEG_VERSION}-full_build-shared`;
		const FFMPEG_ZIP_URL = `https://github.com/GyanD/codexffmpeg/releases/download/${FFMPEG_VERSION}/${FFMPEG_ZIP_NAME}.zip`;

		await fs.mkdir(targetDir, { recursive: true });

		let downloadedFfmpeg = false;
		const ffmpegZip = `ffmpeg-${FFMPEG_VERSION}.zip`;
		const ffmpegZipPath = path.join(targetDir, ffmpegZip);
		if (!(await fileExists(ffmpegZipPath))) {
			const ffmpegZipBytes = await fetch(FFMPEG_ZIP_URL)
				.then((r) => r.blob())
				.then((b) => b.arrayBuffer());
			await fs.writeFile(ffmpegZipPath, Buffer.from(ffmpegZipBytes));
			console.log(`Downloaded ${ffmpegZip}`);
			downloadedFfmpeg = true;
		} else console.log(`Using cached ${ffmpegZip}`);

		const ffmpegDir = path.join(targetDir, "ffmpeg");
		if (!(await fileExists(ffmpegDir)) || downloadedFfmpeg) {
			await exec(
				`Expand-Archive -Path "${ffmpegZipPath}" -DestinationPath "${targetDir}" -Force`,
				{ shell: "powershell.exe" },
			);
			await fs.rm(ffmpegDir, { recursive: true, force: true }).catch(() => {});
			await fs.rename(path.join(targetDir, FFMPEG_ZIP_NAME), ffmpegDir);
			console.log("Extracted ffmpeg");
		} else console.log("Using cached ffmpeg");

		for (const profile of ["debug", "release"]) {
			await fs.mkdir(path.join(targetDir, profile), { recursive: true });
			for (const name of await fs.readdir(path.join(ffmpegDir, "bin"))) {
				await fs.copyFile(
					path.join(ffmpegDir, "bin", name),
					path.join(targetDir, profile, name),
				);
			}
		}
		console.log("Copied ffmpeg DLLs to target/debug and target/release");

		if (!(await fileExists(path.join(targetDir, "native-deps"))))
			await fs.mkdir(path.join(targetDir, "native-deps"), { recursive: true });

		await fs.cp(
			path.join(ffmpegDir, "lib"),
			path.join(targetDir, "native-deps", "lib"),
			{
				recursive: true,
				force: true,
			},
		);
		await fs.cp(
			path.join(ffmpegDir, "include"),
			path.join(targetDir, "native-deps", "include"),
			{
				recursive: true,
				force: true,
			},
		);
		console.log("Copied ffmpeg/lib and ffmpeg/include to target/native-deps");

		const libclangPath = await resolveWindowsLibclangPath();
		if (libclangPath) {
			cargoEnv.push(`LIBCLANG_PATH = "${libclangPath.replaceAll("\\", "/")}"`);
		}

		const cmakePath = await resolveWindowsCmakePath();
		if (cmakePath) {
			cargoEnv.push(`CMAKE = "${cmakePath.replaceAll("\\", "/")}"`);
		}

		const cargoTargetDir = "D:/DriftBuild/cargo-target/drift-v2";
		const tempDir = "D:/DriftBuild/tmp";
		await fs.mkdir(cargoTargetDir, { recursive: true });
		await fs.mkdir(tempDir, { recursive: true });

		cargoBuildSection = `\n[build]\ntarget-dir = "${cargoTargetDir}"\n`;
		cargoEnv.push(`TMP = "${tempDir}"`);
		cargoEnv.push(`TEMP = "${tempDir}"`);
	} else {
		await fs.mkdir(path.join(targetDir, "native-deps"), { recursive: true });
	}

	const cargoConfigContents = `[env]\n${cargoEnv.join("\n")}\n${cargoBuildSection}`;

	await fs.mkdir(path.join(__root, ".cargo"), { recursive: true });
	await fs.writeFile(
		path.join(__root, ".cargo/config.toml"),
		cargoConfigContents,
	);
}

main();

async function trimMacOSFramework(frameworkDir) {
	const headersDir = path.join(frameworkDir, "Headers");
	const librariesDir = path.join(frameworkDir, "Libraries");

	const libraries = await fs.readdir(librariesDir);

	const unnecessaryLibraries = libraries.filter(
		(v) =>
			!(
				v.startsWith("libav") ||
				v.startsWith("libsw") ||
				v.startsWith("libpostproc")
			),
	);

	for (const lib of unnecessaryLibraries) {
		await fs.rm(path.join(librariesDir, lib), { recursive: true });
	}

	const headers = await fs.readdir(headersDir);

	const unnecessaryHeaders = headers.filter(
		(v) =>
			!(
				v.startsWith("libav") ||
				v.startsWith("libsw") ||
				v.startsWith("libpostproc")
			),
	);

	for (const header of unnecessaryHeaders) {
		await fs.rm(path.join(headersDir, header), { recursive: true });
	}

	const modelsPath = path.join(frameworkDir, "Resources", "Models");
	if (await fileExists(modelsPath))
		await fs.rm(modelsPath, {
			recursive: true,
		});
}

async function signMacOSFrameworkLibs(frameworkDir) {
	const signId = env.APPLE_SIGNING_IDENTITY || "-";
	const keychain = env.APPLE_KEYCHAIN ? `--keychain ${env.APPLE_KEYCHAIN}` : "";

	// Sign dylibs (Required for them to work on macOS 13+)
	await fs
		.readdir(path.join(frameworkDir, "Libraries"), {
			recursive: true,
			withFileTypes: true,
		})
		.then((files) =>
			Promise.all(
				files
					.filter((entry) => entry.isFile() && entry.name.endsWith(".dylib"))
					.map((entry) =>
						exec(
							`codesign ${keychain} -s "${signId}" -f "${path.join(
								entry.parentPath,
								entry.name,
							)}"`,
						),
					),
			),
		);
}

async function fileExists(path) {
	return await fs
		.access(path)
		.then(() => true)
		.catch(() => false);
}

async function resolveWindowsLibclangPath() {
	const vswherePath = path.join(
		env["ProgramFiles(x86)"] ?? "C:/Program Files (x86)",
		"Microsoft Visual Studio",
		"Installer",
		"vswhere.exe",
	);

	if (await fileExists(vswherePath)) {
		const { stdout: vcInstallDir } = await exec(
			`& "${vswherePath}" -latest -property installationPath`,
			{ shell: "powershell.exe" },
		);

		const visualStudioLibclang = path.join(
			vcInstallDir.trim(),
			"VC/Tools/LLVM/x64/bin/libclang.dll",
		);

		if (await fileExists(visualStudioLibclang)) return visualStudioLibclang;
	}

	const llvmBinPath = path.join("C:/Program Files/LLVM/bin", "libclang.dll");
	if (await fileExists(llvmBinPath)) return llvmBinPath;

	const localLibclangCandidates = [
		"D:/DriftBuild/python-libclang/clang/native/libclang.dll",
		path.join(__root, "target", "python-libclang", "clang", "native", "libclang.dll"),
	];

	for (const candidate of localLibclangCandidates) {
		if (await fileExists(candidate)) return candidate;
	}

	try {
		const { stdout } = await execFile("python", [
			"-c",
			"from pathlib import Path; import clang.native; print(Path(clang.native.__file__).with_name('libclang.dll'))",
		]);
		const pythonLibclangPath = stdout.trim();
		if (pythonLibclangPath && (await fileExists(pythonLibclangPath))) {
			return pythonLibclangPath;
		}
	} catch {}

	console.warn(
		"Unable to locate libclang.dll automatically. Install LLVM or python libclang before building the desktop app.",
	);
	return null;
}

async function resolveWindowsCmakePath() {
	const candidates = [
		"C:/Program Files/CMake/bin/cmake.exe",
		"D:/DriftBuild/python-cmake/cmake/data/bin/cmake.exe",
		"D:/DriftBuild/python-cmake/bin/cmake.exe",
		path.join(__root, "target", "python-cmake", "cmake", "data", "bin", "cmake.exe"),
		path.join(__root, "target", "python-cmake", "bin", "cmake.exe"),
	];

	for (const candidate of candidates) {
		if (await fileExists(candidate)) return candidate;
	}

	try {
		const { stdout } = await execFile("python", [
			"-c",
			"import cmake, pathlib; print(pathlib.Path(cmake.CMAKE_BIN_DIR) / 'cmake.exe')",
		]);
		const pythonCmakePath = stdout.trim();
		if (pythonCmakePath && (await fileExists(pythonCmakePath))) {
			return pythonCmakePath;
		}
	} catch {}

	console.warn(
		"Unable to locate cmake.exe automatically. Install CMake or python cmake before building the desktop app.",
	);
	return null;
}
