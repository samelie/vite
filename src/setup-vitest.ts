/// <reference types="vite/client" />

import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import "urlpattern-polyfill";
import "vitest-canvas-mock";

expect.extend(matchers);

/**
 * This is the only place in the codebase where it's allowed since here we are
 * enabling it for all tests.
 *
 * All tests use fake timers. To advance time you can use any of the built in
 * utilities in vitest (e.g. advanceTimersByTime, runAllTimers,
 * advanceTimersToNextTimer, etc) or the "advanceTimers" method from
 * /test/utils.tsx
 */
vi.useFakeTimers();

/**
 * Import meta defaults
 */
Object.assign(import.meta.env, {
    PROD: true,
    DEV: false,
    VITE_BASE_URL: "/",
});

Object.assign(globalThis, {
    fetch: () => {
        throw new Error("Cannot use fetch in tests!");
    },
    HTMLDocument: globalThis.Document,
    reportError: () => {},
    TextEncoder,
    TextDecoder,
    Headers: class Headers {
        get = vi.fn();
        append = vi.fn();
    },
    AudioContext: class AudioContext {
        close = () => {};
        createMediaElementSource = () => {};
        createMediaStreamSource = () => {};
        createMediaStreamDestination = () => {};
        createMediaStreamTrackSource = () => {};
        getOutputTimestamp = () => {};
        resume = () => {};
        suspend = () => {};
    },
    ImageData: class ImageData {
        data: Uint8ClampedArray;
        width: number;
        height: number;
        constructor(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.data = new Uint8ClampedArray(width * height * 4);
        }
    },
});

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (_query: unknown) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: false,
        // media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
    }),
});

// Pointer Capture not yet implemented in jsdom
// https://github.com/jsdom/jsdom/pull/2666
Object.assign(globalThis.EventTarget.prototype, {
    setPointerCapture: () => {},
    releasePointerCapture: () => {},
});

Object.assign(globalThis.URL, {
    createObjectURL: () => undefined,
});

function xhrMockClass() {
    return {
        open: vi.fn(),
        send: () => {
            throw new Error(
                "XMLHttpRequest network calls are not allowed in unit tests",
            );
        },
        setRequestHeader: vi.fn(),
    };
}

Object.assign(window, {
    XMLHttpRequest: vi.fn().mockImplementation(xhrMockClass),
    requestIdleCallback: (cb: Function) => setTimeout(cb, 0),
});

// Allow re-assigning window.location properties in tests
Object.defineProperty(window, "location", {
    value: new URL("https://localhost:3000/tests"),
    configurable: true,
});

globalThis.location.assign = vi.fn();

vi.stubGlobal(
    "ResizeObserver",
    vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    })),
);
vi.stubGlobal(
    "BroadcastChannel",
    vi.fn(() => ({
        onmessage: vi.fn(),
        postMessage: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    })),
);
