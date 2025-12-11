🚚 FreightReader.io — Technical Overview

Goal:

Turn messy freight PDFs (Bills of Lading, Proofs of Delivery, Rate Confirmations) into clean, structured CSV/JSON in <30 seconds.

Users:
Independent Freight Brokers, Dispatchers, and Back-Office Clerks (1–10 person shops).

🧩 Product Summary

Problem:
Brokers waste hours manually typing PDF data into TMS systems.
Many PDFs are scanned images, not text-based, so normal OCR fails.

Solution:
FreightReader.io auto-extracts BOL data (Shipper, Consignee, PRO #, Weight, Notes) from any PDF — digital or scanned — and exports clean CSVs mapped for TMS systems like AscendTMS, McLeod, and Rose Rocket.

⚙️ Architecture Overview
Layer	Technology	Purpose
Framework	Next.js 15 (App Router)	Unified frontend + backend API routes.
Language	TypeScript	End-to-end type safety.
Runtime	Vercel Edge / Serverless Functions	Zero-config deployment.
Async Jobs	Inngest	Handles long Claude API jobs (no 60s timeouts).
Database	Supabase (Postgres)	Store document metadata and results.
Storage	Supabase Storage	Store raw PDFs and CSV/JSON outputs.
Auth	Supabase Auth	Email magic link or passwordless login.
Billing	LemonSqueezy	Hosted checkout & subscription management.
AI Engine	Claude 3.5 Sonnet (Text + Vision)	Data extraction for digital + scanned PDFs.
Validation	Zod	Enforces schema on Claude JSON output.
Frontend	React 18 + Next.js	Upload, history, and export interface.
Styling	CSS Modules + clsx	Fast, scoped, zero runtime styling.
Headless UI	Radix Primitives	Accessible dialogs, dropdowns, toasts.
Networking	TanStack React Query	Caching, polling, and async job status.
File Upload	react-dropzone + Supabase signed URLs	Direct client-side uploads.
Error Tracking	Sentry	Catch API and client exceptions.
Analytics	Plausible or PostHog	Privacy-safe product analytics.
🧠 Data Flow (End-to-End)

Upload

User uploads a PDF using react-dropzone.

App requests a signed URL from /api/upload-url (Supabase).

File uploads directly to Supabase Storage.

Job Start

Frontend calls /api/start-parse with { fileUrl, userId }.

API triggers inngest.send("parse.requested", { fileUrl, userId }).

Response returns { jobId } immediately.

Background Parsing (Inngest Function)

Downloads the PDF.

Runs pdf-parse for digital text extraction.

If output text < 50 chars → converts to images → sends to Claude Vision.

Claude returns structured JSON (shipper, consignee, etc.).

JSON validated with freightSchema (Zod).

Result + metadata stored in Supabase (status = "done").

Frontend Polling

React Query polls /api/status?jobId=... every 3s.

When status === "done", displays result and updates history.

History View

/api/history returns all user docs.

Results can be exported to CSV or JSON.

Users can “Pin” files to prevent 30-day auto-deletion.

Billing

LemonSqueezy checkout sets plan tier.

Webhook updates Supabase users table (plan = "pro" | "basic").

Usage limits enforced via row count per user.