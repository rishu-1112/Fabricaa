import { useEffect, useState } from "react";
import { sampleProducts } from "../data/sampleCatalog";
import { getCatalog, isDemoMode } from "./catalog";

const sample = { products: sampleProducts, status: "sample" };
const loading = { products: [], status: "loading" };

export default function useCatalog(showSamples = false) {
  const [catalog, setCatalog] = useState(loading);
  const [attempt, setAttempt] = useState(0);
  const demo = isDemoMode || showSamples;

  useEffect(() => {
    if (demo) return;
    const controller = new AbortController();
    getCatalog(controller.signal).then((products) => {
      if (!controller.signal.aborted) {
        setCatalog({ products, status: products.length ? "ready" : "empty" });
      }
    }).catch(() => {
      if (!controller.signal.aborted) setCatalog({ products: [], status: "unavailable" });
    });
    return () => controller.abort();
  }, [demo, attempt]);

  function retry() {
    setCatalog(loading);
    setAttempt((current) => current + 1);
  }

  return { ...(demo ? sample : catalog), retry };
}
