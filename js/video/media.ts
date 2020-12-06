import { PixelRotator } from "../../pkg/index.js";

type WasmInstance = typeof import("../../pkg/index.js");

export class Media {
	private readonly videoElement: HTMLVideoElement;
	private readonly bufferCanvas: HTMLCanvasElement;

	private pixelRotator!: PixelRotator;
	private animId: number = -1;

	constructor() {
		this.videoElement = (() => {
			const vid = document.createElement("video");
			vid.width = 640;
			vid.height = 480;
			vid.setAttribute("crossOrigin", "anonymous");
			return vid;
		})();
		this.bufferCanvas = (() => {
			const canvas = document.createElement("canvas");
			canvas.width = 640;
			canvas.height = 480;
			return canvas;
		})();
	}

	public disconnect() {
		if (this.animId > -1) {
			window.cancelAnimationFrame(this.animId);
		}
		this.videoElement.pause();
		this.videoElement.srcObject = null;
	}

	public async connect(targetCanvas: HTMLCanvasElement) {
		// Get Target Buffer
		const targetCtx = targetCanvas.getContext("2d");
		if (!targetCtx) {
			return Promise.reject(
				"Unable to render video. Are you sure your web browser is modern?"
			);
		}

		// Get Buffer Ctx
		const bufferCtx = this.bufferCanvas.getContext("2d");
		if (!bufferCtx) {
			return Promise.reject(
				"Unable to render video. Are you sure your web browser is modern?"
			);
		}

		// Get WASM
		try {
			const wasm: WasmInstance = await import("../../pkg/index");
			this.pixelRotator = new wasm.PixelRotator(bufferCtx, targetCtx);
		} catch (error) {
			console.error(error);
			return Promise.reject("Unable to load wasm");
		}

		// Get Video Stream
		const videoSteam = await this.getVideoStream();
		if (!videoSteam) {
			return Promise.reject(
				"Unable to fetch video feed. Are you sure your device has a camera?"
			);
		}
		// Play the video stream
		this.videoElement.srcObject = videoSteam;
		this.videoElement.play();

		this.renderVideo(bufferCtx);
	}

	private renderVideo(bufferCtx: CanvasRenderingContext2D): void {
		const renderVideo = (now: number) => {
			this.animId = window.requestAnimationFrame(renderVideo);

			if (this.videoElement.readyState < this.videoElement.HAVE_CURRENT_DATA) {
				return;
			}

			if (
				this.videoElement.videoHeight <= 0 ||
				this.videoElement.videoWidth <= 0
			) {
				return;
			}
			// Move pixels from video onto buffer canvas
			bufferCtx.drawImage(this.videoElement, 0, 0);

			// Rust get pixels from bufferCtx
			// Rust move maipulated pixels to targetCtx

			// targetCtx.putImageData(
			// 	new ImageData(
			// 		this.pixelRotator.rotate_pixels(
			// 			bufferCtx.getImageData(0, 0, 640, 480).data
			// 		),
			// 		640,
			// 		480
			// 	),
			// 	0,
			// 	0
			// );
		};

		this.animId = window.requestAnimationFrame(renderVideo);
	}

	private async getVideoStream(): Promise<MediaStream | null> {
		let stream = null;
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 640 },
					height: { ideal: 480 },
				},
			});
		} catch (error) {
			console.error(error);
		}

		return stream;
	}
}
