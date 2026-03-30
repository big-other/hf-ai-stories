"use client";

import { useEffect } from "react";

export default function IframeResizer() {
  useEffect(() => {
    // Only run in iframe context
    if (window === window.parent) return;

    function postHeight() {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: "stories-resize", height }, "*");
    }

    // Post height on load and on any DOM changes
    postHeight();

    const observer = new MutationObserver(postHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    window.addEventListener("resize", postHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", postHeight);
    };
  }, []);

  return null;
}
