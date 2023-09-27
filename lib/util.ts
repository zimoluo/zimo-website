import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { SyntheticEvent } from "react";
import { marked } from "marked";
import katex from "katex";

let JSDOM: typeof import("jsdom").JSDOM | null = null;

if (typeof window === "undefined") {
  JSDOM = require("jsdom").JSDOM;
}

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const imageFallback =
  (fallbackSrc: string) => (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;

    // Set to fallback source
    target.src = fallbackSrc;
    target.srcset = fallbackSrc;
  };

const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

export const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

export const formatDate = (dateStr: string) => {
  const today = dayjs();
  const eventDate = dayjs(dateStr);

  const daysDifference = today.diff(eventDate, "day");
  const hoursDifference = today.diff(eventDate, "hour");
  const minutesDifference = today.diff(eventDate, "minute");

  if (minutesDifference < 0) {
    return "In the future";
  }

  if (minutesDifference <= 0) {
    return "Just now";
  }

  if (minutesDifference < 60) {
    return `${minutesDifference} minute${
      minutesDifference === 1 ? "" : "s"
    } ago`;
  }

  if (hoursDifference < 24) {
    return `${hoursDifference} hour${hoursDifference === 1 ? "" : "s"} ago`;
  }

  if (daysDifference < 15) {
    return `${daysDifference} day${daysDifference === 1 ? "" : "s"} ago`;
  }

  return eventDate.format("MMM D, YYYY");
};

export async function markdownToHtml(markdown: string): Promise<string> {
  const renderer = new marked.Renderer();
  renderer.code = (code, language) => {
    if (language === "math") {
      return katex.renderToString(code, {
        throwOnError: false,
      });
    }
    return `<pre><code>${code}</code></pre>`;
  };

  marked.setOptions({
    renderer: renderer,
  });

  const htmlContent: string = marked(markdown);
  return htmlContent;
}

function updateImgElements(
  doc: Document,
  defaultHeight: string,
  defaultWidth: string
) {
  const imgElements: HTMLCollectionOf<HTMLImageElement> =
    doc.getElementsByTagName("img");
  for (let i = 0; i < imgElements.length; i++) {
    const img: HTMLImageElement = imgElements[i];

    if (!img.hasAttribute("height")) {
      img.setAttribute("height", defaultHeight);
    }

    if (!img.hasAttribute("width")) {
      img.setAttribute("width", defaultWidth);
    }
  }
}

export function updateImageAttributes(
  htmlContent: string,
  defaultHeight: string = "320",
  defaultWidth: string = "40"
): string {
  let updatedHtmlContent: string;

  if (typeof window !== "undefined") {
    // Client-side code
    const parser: DOMParser = new DOMParser();
    const doc: Document = parser.parseFromString(htmlContent, "text/html");
    updateImgElements(doc, defaultHeight, defaultWidth);
    updatedHtmlContent = doc.documentElement.outerHTML;
  } else {
    // Server-side code
    if (JSDOM) {
      const dom = new JSDOM(htmlContent);
      const doc: Document = dom.window.document;
      updateImgElements(doc, defaultHeight, defaultWidth);
      updatedHtmlContent = dom.serialize();
    } else {
      updatedHtmlContent = htmlContent;
    }
  }

  return updatedHtmlContent;
}

export const formatAltText = (key: string) => {
  return key
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const applyImageViewerTransition = (
  element: HTMLElement,
  transform: string,
  duration: number,
  onComplete: () => void
) => {
  element.style.transition = `transform ${duration}s ease-out`;
  element.style.transform = transform;

  const onTransitionEnd = () => {
    element.style.transition = "none";
    element.removeEventListener("transitionend", onTransitionEnd);
    onComplete();
  };

  element.addEventListener("transitionend", onTransitionEnd);
};

export function imagesParser(input: ImagesData): ImagesData {
  const { url, text = [], aspectRatio } = input;
  let outputText: string[] = [];

  const urlLength = url.length;
  const textLength = text.length;

  if (urlLength === textLength) {
    outputText = text;
  } else if (textLength > urlLength) {
    outputText = text.slice(0, urlLength);
  } else {
    outputText = [...text, ...new Array(urlLength - textLength).fill("")];
  }

  return {
    url,
    text: outputText,
    aspectRatio,
  };
}

export const calculateGridViewTransformStyle = (
  index: number,
  gridLength: number
) => {
  return `translate(${
    ((index % gridLength) / gridLength - 0.5 + 0.5 / gridLength) * 100
  }%, ${
    (Math.floor(index / gridLength) / gridLength - 0.5 + 0.5 / gridLength) * 100
  }%) scale(${1 / gridLength - 0.008})`;
};

// Global state to keep track of active popups
let activePopups: any[] = [];

// Function to add a popup to the active popups list
export const addActivePopup = (popupInstance: any): void => {
  activePopups.push(popupInstance);
};

// Function to remove a popup from the active popups list
export const removeActivePopup = (popupInstance: any): void => {
  const index = activePopups.indexOf(popupInstance);
  if (index !== -1) {
    activePopups.splice(index, 1);
  }
};

// Function to check if the popup is the current active one
export const isActivePopup = (popupInstance: any): boolean => {
  return (
    activePopups.length > 0 &&
    activePopups[activePopups.length - 1] === popupInstance
  );
};

// Function to clear all active popups (use with caution)
export const clearActivePopups = (): void => {
  activePopups = [];
};

// Safely retrieve an item from localStorage
export const safeGetItem = (key: string): string | null => {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
  } catch (e) {
    console.error(`Error getting item ${key} from localStorage: `, e);
  }
  return null;
};

// Safely set an item in localStorage
export const safeSetItem = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    console.error(`Error setting item ${key} to localStorage: `, e);
  }
};
