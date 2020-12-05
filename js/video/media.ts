export class Media {
	private readonly videoElement: HTMLVideoElement;
	private readonly bufferCanvas: HTMLCanvasElement;

	private targetCanvas?: HTMLCanvasElement;
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
	}

	public async connect(targetCanvas: HTMLCanvasElement) {
		this.targetCanvas = targetCanvas;
		const videoSteam = await this.getVideoStream();

		if (!videoSteam) {
			return Promise.reject(
				"Unable to fetch video feed. Are you sure your device has a camera?"
			);
		}
		// Play the video stream
		this.videoElement.srcObject = videoSteam;
		this.videoElement.play();
		// Move pixels from video onto buffer canvas
		// const bufferCtx = this.bufferCanvas.getContext("2d");
		const bufferCtx = this.targetCanvas.getContext("2d");

		if (!bufferCtx) {
			return Promise.reject(
				"Unable to render video. Are you sure your web browser is modern?"
			);
		}

		this.renderVideo(bufferCtx);
	}

	private renderVideo(ctx: CanvasRenderingContext2D): void {
		const renderVideo = () => {
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

			ctx.drawImage(this.videoElement, 0, 0);
		};

		this.animId = window.requestAnimationFrame(() => renderVideo());
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
