import React, { useCallback, useEffect, useRef, useState } from "react";
import { RotatedPixels } from "./video/RotatedPixels";

type WasmInstance = typeof import("../pkg/index.js");

function useWasm() {
	const [error, setError] = useState<Error | undefined>(undefined);
	const [wasmInstance, setWasmInstance] = useState<WasmInstance | undefined>(
		undefined
	);
	const [loading, setLoading] = useState(true);
	const initialize = useCallback(async () => {
		try {
			setLoading(true);
			setError(undefined);
			const wasm = await import("../pkg/index.js");
			setWasmInstance(wasm);
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		error,
		loading,
		initialize,
		wasmInstance,
	};
}

function App() {
	const { error, loading, initialize, wasmInstance } = useWasm();

	useEffect(() => {
		async function loadWasm() {
			await initialize();
		}
		loadWasm();
	}, []);

	if (error) {
		console.error(error);
		return <p>Something went wrong.</p>;
	}

	if (loading) {
		return <p>Loading wasm.</p>;
	}

	if (wasmInstance) {
		return <RotatedPixels />;
	}

	return <div></div>;
}

export default App;
