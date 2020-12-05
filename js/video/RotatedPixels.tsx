import React, { useEffect, useMemo, useRef, useState } from "react";
import { Media } from "./media";

export function RotatedPixels() {
	const [err, setErr] = useState("");
	const targetCanvas = useRef<HTMLCanvasElement | null>(null);
	const media = useMemo(() => new Media(), []);

	useEffect(() => {
		if (targetCanvas.current) {
			media.connect(targetCanvas.current).catch((err) => {
				setErr(err);
			});
		}
	}, [targetCanvas]);

	if (err.length) {
		return <p>{err}</p>;
	} else {
		return (
			<>
				<canvas
					ref={targetCanvas}
					width={640}
					height={480}
					style={{ border: "2px solid red" }}
				></canvas>
				<button
					onClick={(e) => {
						e.preventDefault();
						media.disconnect();
					}}
				>
					Stop
				</button>

				<button
					onClick={(e) => {
						e.preventDefault();
						if (targetCanvas.current) {
							media.connect(targetCanvas.current);
						}
					}}
				>
					Start
				</button>
			</>
		);
	}
}
