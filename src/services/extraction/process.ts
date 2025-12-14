import type { ExtractedData, RawPageExtraction } from "@/types/documents";
import { normalizeExtraction } from "./normalize";

type PageImage = {
  page: number;
  dataUrl: string;
  contentType: string;
};

const PDF_MIME = "application/pdf";

const loadPdfJs = async () => {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
  const workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  return pdfjs;
};

const renderPdf = async (file: File, dpi = 300): Promise<PageImage[]> => {
  const pdfjs = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({
    data: arrayBuffer,
    isEvalSupported: false,
    disableFontFace: true,
  });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: dpi / 72 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to get canvas context for PDF render.");
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport }).promise;

  return [
    {
      page: 1,
      dataUrl: canvas.toDataURL("image/png"),
      contentType: "image/png",
    },
  ];
};

const readImageFile = (file: File): Promise<PageImage[]> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (!result) {
        reject(new Error("Unable to read image."));
        return;
      }
      resolve([
        {
          page: 1,
          dataUrl: result,
          contentType: file.type || "image/jpeg",
        },
      ]);
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });

const fileToImages = (file: File) => {
  if (file.type === PDF_MIME || file.name.toLowerCase().endsWith(".pdf")) {
    return renderPdf(file);
  }
  return readImageFile(file);
};

const extractBase64 = (dataUrl: string) => dataUrl.split(",").pop() ?? "";

const postToClaude = async (page: PageImage, controller?: AbortController) => {
  const response = await fetch("/api/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: controller?.signal,
    body: JSON.stringify({
      page: page.page,
      image: extractBase64(page.dataUrl),
      contentType: page.contentType,
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Claude extraction failed.");
  }

  const parsed = (await response.json()) as RawPageExtraction;
  return { ...parsed, page: page.page };
};

export const extractDocument = async (file: File): Promise<ExtractedData> => {
  const pages = await fileToImages(file);
  const controller = "AbortController" in window ? new AbortController() : undefined;
  const timeout = setTimeout(() => controller?.abort("Timed out"), 28_000);

  try {
    const rawPages: RawPageExtraction[] = [];
    for (const page of pages.slice(0, 1)) {
      const pageResult = await postToClaude(page, controller);
      rawPages.push(pageResult);
    }
    return normalizeExtraction(rawPages);
  } finally {
    clearTimeout(timeout);
  }
};
