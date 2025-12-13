Pre-OCR Preprocessing Microservice Spec (Rust + PDFium)
Objective

For scanned PDFs, render each page to an OCR/Vision-optimized grayscale JPEG and return signed URLs (preferred) or direct bytes (fallback). Must be fast, deterministic, and scalable.

Service Contract
Endpoint

POST /v1/render

Request (preferred)
{
"pdf_url": "https://signed-url-to-pdf",
"dpi": 300,
"max_width_px": 2500,
"jpeg_quality": 90,
"grayscale": true,
"pages": "all" // or [1,2,3]
}

Request (fallback)

multipart/form-data with file=@document.pdf plus the same params.

Response
{
"job_id": "uuid",
"page_count": 7,
"images": [
{
"page": 1,
"width": 2500,
"height": 3235,
"content_type": "image/jpeg",
"url": "https://signed-url-to-image-1"
}
]
}

Errors:

400 invalid PDF / params

413 too large (size/page limit)

422 render failure

500 unexpected

Rendering & Image Pipeline
Page Render (PDFium)

Read page dimensions in points (72/inch)

Render scale: scale = dpi / 72 (default dpi=300)

Render to RGBA bitmap

Post-processing (Rust)

For each page, sequentially:

Grayscale (8-bit luminance)

Downscale only if oversized

if width > max_width_px resize to max_width_px using Lanczos3

never upscale

JPEG encode

quality = jpeg_quality (default 90)

output is baseline JPEG (widely compatible)

Output handling (recommended)

Upload each JPEG to object storage (S3/R2/GCS)

Return signed URLs with TTL (e.g., 15–60 min)

Do not return large byte arrays in the HTTP response unless explicitly requested

Page processing strategy

Process page-by-page, streaming uploads, no “collect all buffers” in memory.

Limits & Guardrails

Max PDF size (configurable): e.g. 25–50MB

Max pages: e.g. 15 (hard cap)

Max render DPI: 300 (cap to prevent memory blowups)

Reject encrypted PDFs unless you support password input

Deployment Requirements
Container

Multi-stage Docker build

Inject prebuilt libpdfium.so (linux x64) at build time

Dynamic link at runtime

Runtime (Cloud Run recommended)

Scale to zero

Concurrency: low (e.g., 1–4) depending on memory

Memory: 1–2GB

Timeout: 60–300s (depending on max pages)

Observability

Log: request id, page count, per-page render ms, upload ms, output sizes

Metrics: p95 latency, error rates, OOM/restarts

Return a job_id for correlation

Orchestration Integration Spec (Next.js/Vercel + Inngest)
Decision Gate

Extract text from PDF in Node (pdf-parse)

If text length ≥ threshold (e.g., 50) → skip preprocessing

Else → call microservice

Handoff Options

Preferred: send pdf_url (presigned) to microservice
Fallback: stream the raw PDF bytes to microservice

After Receive

Microservice returns images[] signed URLs

Node job forwards those URLs to OCR/Vision model (Claude/GPT/etc.)

No PDF rendering happens on Vercel

Security

Microservice authenticates requests (HMAC header or service token)

Only accepts signed URLs from your storage domain (optional allowlist)

Signed output URLs short-lived
