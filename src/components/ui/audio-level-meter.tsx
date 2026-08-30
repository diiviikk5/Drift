interface AudioLevelMeterProps {
	level: number; // 0-100
	className?: string;
}

const bars = [
	{ threshold: 10, height: "30%" },
	{ threshold: 25, height: "45%" },
	{ threshold: 45, height: "60%" },
	{ threshold: 65, height: "75%" },
	{ threshold: 85, height: "90%" },
];

function getBarColor(level: number, threshold: number) {
	if (!level || level < threshold) return "bg-white/10";
	if (threshold > 80) return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
	if (threshold > 60) return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]";
	return "bg-[#DCFE50] shadow-[0_0_8px_rgba(220,254,80,0.5)]";
}

export function AudioLevelMeter({ level, className = "" }: AudioLevelMeterProps) {
	return (
		<div className={`flex items-end justify-between gap-1.5 h-6 ${className}`}>
			{bars.map((bar, index) => (
				<div
					key={index}
					className={`flex-1 rounded-sm transition-all duration-100 ease-out ${getBarColor(level, bar.threshold)}`}
					style={{
						height: level >= bar.threshold ? bar.height : "15%",
						opacity: level >= bar.threshold ? 1 : 0.4,
					}}
				/>
			))}
		</div>
	);
}
