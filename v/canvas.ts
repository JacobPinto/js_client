/**
 * CameraState Interface
 * Represents the 3D camera state captured from mouse interactions on the canvas.
 * This data is sent to the server to write camera.json
 */
export interface CameraState {
  pan: { x: number; y: number };
  zoom: number;
  rotate: { azimuth: number; elevation: number };
}

/**
 * Canvas Component - Client-side rendering viewport
 * 
 * Implements Step 1 & 3 of the rendering pipeline:
 * Step 1: Captures mouse interactions (pan, zoom, rotate)
 * Step 3: Renders output.jpeg from server with 80ms refresh
 * 
 * Data flow:
 * User mouse input → Canvas captures → CameraState
 * → onStateChange callback → Controller → Server → camera.json
 */
export class Canvas {
  private _container: HTMLElement;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _img: HTMLImageElement | null = null;
  private _writing: boolean = false;
  private _writeTimer: NodeJS.Timeout | null = null;

  private _state: CameraState = {
    pan: { x: 0, y: 0 },
    zoom: 1.0,
    rotate: { azimuth: 0.0, elevation: 0.0 },
  };

  private _drag: {
    type: "pan" | "rotate";
    startX: number;
    startY: number;
    startPanX?: number;
    startPanY?: number;
    startRot?: number;
    startElev?: number;
  } | null = null;

  private _onStateChange: ((state: CameraState) => void) | null = null;

  constructor() {
    this._container = document.createElement("div");
    this._container.className =
      "flex flex-col flex-1 overflow-hidden bg-gray-900 border-t border-gray-700";

    // Hint text
    const hint = document.createElement("div");
    hint.className =
      "absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-950/80 backdrop-blur px-4 py-2 rounded-lg text-xs text-gray-400 pointer-events-none z-10 border border-gray-700 shadow-lg whitespace-nowrap";
    hint.textContent =
      "Left-drag: pan  •  Scroll: zoom  •  Right-drag: azimuth/elevation";
    this._container.appendChild(hint);

    // Canvas
    this._canvas = document.createElement("canvas");
    this._canvas.className =
      "flex-1 block mx-auto my-auto cursor-crosshair bg-gray-800";
    this._canvas.style.display = "block";

    const ctx = this._canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");
    this._ctx = ctx;

    this._container.appendChild(this._canvas);

    this._setupMouseHandlers();
    this._loadImage();
    this._startImageRefresh();
  }

  private _loadImage(): void {
    const img = new Image();
    img.onload = () => {
      this._img = img;
      this._canvas.width = img.naturalWidth;
      this._canvas.height = img.naturalHeight;
      this._drawImage();
    };
    img.onerror = () => {
      console.error("Unable to load output.jpeg");
    };
    // Cache-busting: append timestamp to force fresh fetch from server
    // This ensures we always get the latest render even if server headers allow caching
    img.src =
  "camera/output.jpeg?t=" +
  Date.now();
  }

  private _startImageRefresh(): void {
    // Server render engine generates new output.jpeg after camera.json is updated
    setInterval(() => {
      this._loadImage();
    }, 80); // Refresh every 80ms
  }

  private _drawImage(): void {
    if (!this._img) return;
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.drawImage(this._img, 0, 0);
  }

  private _setupMouseHandlers(): void {
    this._canvas.addEventListener("contextmenu", (e) => e.preventDefault());

    // Mouse down: start pan or rotate based on button
    this._canvas.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (e.button === 0) {
        // Left button → pan (move view around)
        this._drag = {
          type: "pan",
          startX: e.clientX,
          startY: e.clientY,
          startPanX: this._state.pan.x,
          startPanY: this._state.pan.y,
        };
        this._canvas.style.cursor = "grab";
      } else if (e.button === 2) {
        // Right button → rotate (change camera angle)
        this._drag = {
          type: "rotate",
          startX: e.clientX,
          startY: e.clientY,
          startRot: this._state.rotate.azimuth,
          startElev: this._state.rotate.elevation,
        };
        this._canvas.style.cursor = "move";
      }
    });

    // Mouse move: update pan or rotate values while dragging
    window.addEventListener("mousemove", (e) => {
      if (!this._drag) return;

      if (this._drag.type === "pan") {
        this._state.pan.x =
          this._drag.startPanX! + (e.clientX - this._drag.startX);
        this._state.pan.y =
          this._drag.startPanY! + (e.clientY - this._drag.startY);
      } else if (this._drag.type === "rotate") {
        // 1 px horizontal drag = 0.3 degrees azimuth; vertical = elevation
        this._state.rotate.azimuth =
          this._drag.startRot! + (e.clientX - this._drag.startX) * 0.3;
        this._state.rotate.elevation =
          this._drag.startElev! + (e.clientY - this._drag.startY) * 0.3;
      }

      this._scheduleWrite();
    });

    // Mouse up: stop dragging
    window.addEventListener("mouseup", () => {
      this._drag = null;
      this._canvas.style.cursor = "crosshair";
    });

    // Scroll → zoom
    this._canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        // Scroll up (e.deltaY < 0) = zoom in (multiply by 1.05)
        // Scroll down (e.deltaY > 0) = zoom out (divide by 1.05)
        const factor = e.deltaY < 0 ? 1.05 : 1 / 1.05;
        this._state.zoom = Math.max(
          0.01,
          Math.min(100, this._state.zoom * factor),
        );
        this._scheduleWrite();
      },
      { passive: false },
    );
  }

  private _scheduleWrite(): void {
    if (this._writeTimer) clearTimeout(this._writeTimer);
    this._writeTimer = setTimeout(() => {
      this._onStateChange?.(this._state);
    }, 80); // 80ms debounce
  }

  public getState(): CameraState {
    return { ...this._state };
  }

  public setState(state: Partial<CameraState>): void {
    this._state = { ...this._state, ...state };
    this._drawImage();
  }

  public reset(): void {
    this._state = {
      pan: { x: 0, y: 0 },
      zoom: 1.0,
      rotate: { azimuth: 0.0, elevation: 0.0 },
    };
    this._scheduleWrite();
  }

  public onStateChange(callback: (state: CameraState) => void): void {
    this._onStateChange = callback;
  }

  public getElement(): HTMLElement {
    return this._container;
  }
}
