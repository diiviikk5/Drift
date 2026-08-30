import { useEffect, useState } from "react";

export function CountdownOverlay() {
	const [value, setValue] = useState<number | null>(null);

	useEffect(() => {
		const unsubscribe = window.electronAPI.onCountdownOverlayValue((nextValue) => {
			setValue(nextValue);
		});

		return () => unsubscribe();
	}, []);

	if (value === null) {
		return null;
	}

	return (
		<div className="w-screen h-screen bg-transparent flex items-center justify-center pointer-events-none select-none">
			<div className="relative flex items-center justify-center w-48 h-48 rounded-full bg-[#0c0c14]/85 border-2 border-[#DCFE50]/40 shadow-[0_0_50px_rgba(220,254,80,0.35)] backdrop-blur-2xl animate-pulse">
				<div
					className="text-[#DCFE50] text-[96px] font-black leading-none tabular-nums font-mono"
					style={{ textShadow: "0 0 30px rgba(220, 254, 80, 0.6)" }}
				>
					{value}
				</div>
			</div>
		</div>
	);
}
