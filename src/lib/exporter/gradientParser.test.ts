import { describe, expect, it } from "vitest";
import {
	getLinearGradientPoints,
	getRadialGradientShape,
	parseCssGradient,
	resolveLinearGradientAngle,
} from "./gradientParser";

describe("parseCssGradient", () => {
	it("parses rgba-based gradient presets without splitting inside color functions", () => {
		const parsed = parseCssGradient(
			"linear-gradient( 111.6deg,  rgba(114,167,232,1) 9.4%, rgba(253,129,82,1) 43.9%, rgba(253,129,82,1) 54.8%, rgba(249,202,86,1) 86.3% )",
		);

		expect(parsed?.type).toBe("linear");
		expect(parsed?.descriptor).toBe("111.6deg");
		expect(parsed?.stops).toHaveLength(4);
		expect(parsed?.stops.map((stop) => stop.color)).toEqual([
			"rgba(114,167,232,1)",
			"rgba(253,129,82,1)",
			"rgba(253,129,82,1)",
			"rgba(249,202,86,1)",
		]);
		expect(parsed?.stops[0]?.offset).toBeCloseTo(0.094);
		expect(parsed?.stops[1]?.offset).toBeCloseTo(0.439);
		expect(parsed?.stops[2]?.offset).toBeCloseTo(0.548);
		expect(parsed?.stops[3]?.offset).toBeCloseTo(0.863);
	});

	it("fills missing stop positions for simple hex gradients", () => {
		const parsed = parseCssGradient("linear-gradient(135deg, #FBC8B4, #2447B1)");

		expect(parsed?.stops).toEqual([
			{ color: "#FBC8B4", offset: 0 },
			{ color: "#2447B1", offset: 1 },
		]);
	});
});

describe("gradient geometry", () => {
	it("maps linear directions to canvas endpoints", () => {
		const angle = resolveLinearGradientAngle("to right");
		const points = getLinearGradientPoints(angle, 1920, 1080);

		expect(points.x0).toBeCloseTo(0);
		expect(points.y0).toBeCloseTo(540);
		expect(points.x1).toBeCloseTo(1920);
		expect(points.y1).toBeCloseTo(540);
	});

	it("uses radial positions from the descriptor", () => {
		const shape = getRadialGradientShape("circle farthest-corner at 10% 20%", 1000, 500);

		expect(shape.cx).toBe(100);
		expect(shape.cy).toBe(100);
		expect(shape.radius).toBeCloseTo(Math.hypot(900, 400));
	});
});
