import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import {
  ChevronDown,
  FileText,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Truck,
  Upload,
} from "lucide-react";

import { useHistory, useJobStatus, useUpload } from "../clientToServer/hooks";
import {
  Button,
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogFooter,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
  Input,
  showToast,
} from "../components";

const featureList = [
  "Upload freight PDFs (BOLs, PODs, rate cons)",
  "OCR + Claude vision for scanned docs",
  "Zod-validated JSON ready for TMS import",
  "React Query polling for job status",
];

export default function HomePage() {
  const [freightType, setFreightType] = useState("Bill of Lading");
  const [referenceId, setReferenceId] = useState("");
  const [activeJobId, setActiveJobId] = useState<string | undefined>();

  const { data: history, isLoading: historyLoading } = useHistory();
  const upload = useUpload();
  const jobStatus = useJobStatus(activeJobId);

  useEffect(() => {
    if (!activeJobId && history?.length) {
      setActiveJobId(history[0].id);
    }
  }, [activeJobId, history]);

  const jobStatusDisplay = useMemo(() => {
    if (!jobStatus.data) {
      return "Idle";
    }
    return jobStatus.data.status === "complete"
      ? "Complete"
      : `Processing (${jobStatus.data.progress}%)`;
  }, [jobStatus.data]);

  const updateReference = (event: ChangeEvent<HTMLInputElement>) =>
    setReferenceId(event.target.value);

  const queueUpload = () => {
    upload.mutate(
      {
        name: `${freightType.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`,
        sizeKB: 512 + Math.ceil(Math.random() * 300),
      },
      {
        onSuccess: ({ jobId }) => {
          setActiveJobId(jobId);
          showToast({
            title: "Upload queued",
            description: `Job ${jobId} created.`,
            tone: "success",
          });
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : String(error);
          showToast({
            title: "Upload failed",
            description: message,
            tone: "error",
          });
        },
      }
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 20% 20%, #111827, #0b1224 45%, #060a16 100%)",
        color: "#e5e7eb",
        fontFamily:
          "Inter, 'IBM Plex Sans', system-ui, -apple-system, sans-serif",
        padding: "3rem 1.5rem",
      }}
    >
      <section
        style={{
          maxWidth: "980px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "22px",
          padding: "2.8rem",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.45)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "320px" }}>
            <p
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 0.95rem",
                borderRadius: "999px",
                background: "rgba(16, 185, 129, 0.12)",
                color: "#34d399",
                fontWeight: 600,
                letterSpacing: "0.01em",
                marginBottom: "1rem",
                fontSize: "0.95rem",
              }}
            >
              FreightReader.io · Component preview
            </p>
            <h1
              style={{
                fontSize: "2.8rem",
                lineHeight: 1.1,
                marginBottom: "1rem",
                color: "#f9fafb",
                letterSpacing: "-0.03em",
              }}
            >
              Turn messy freight PDFs into structured data in seconds.
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.6,
                color: "rgba(229, 231, 235, 0.8)",
                marginBottom: "1.75rem",
              }}
            >
              These components run on Radix primitives for accessibility and
              consistent focus handling. Use them as the foundation for the
              upcoming upload and review flows.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              {featureList.map((item) => (
                <div
                  key={item}
                  style={{
                    padding: "0.9rem 1rem",
                    borderRadius: "14px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(255, 255, 255, 0.03)",
                    fontWeight: 600,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              flexBasis: "360px",
              flexShrink: 0,
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "1.5rem",
              display: "grid",
              gap: "1rem",
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800 }}>
                  Radix component demo
                </h2>
                <p
                  style={{
                    margin: "0.1rem 0 0",
                    color: "rgba(229, 231, 235, 0.75)",
                    fontSize: "0.95rem",
                  }}
                >
                  Dialog + dropdown + toasts wired up.
                </p>
              </div>
              <Sparkles color="#38bdf8" size={22} />
            </div>

            <Input
              label="Reference"
              placeholder="Load number or PO"
              leadingIcon={<Truck size={16} />}
              value={referenceId}
              onChange={updateReference}
              hint="Used to match uploads to shipments."
            />

            <Dropdown>
              <DropdownTrigger asChild>
                <Button
                  appearance="secondary"
                  icon={<ChevronDown size={16} />}
                  iconPosition="right"
                  style={{ width: "100%" }}
                >
                  {freightType}
                </Button>
              </DropdownTrigger>
              <DropdownContent align="start">
                <DropdownLabel>Freight doc type</DropdownLabel>
                <DropdownItem
                  icon={<FileText size={16} />}
                  onSelect={() => setFreightType("Bill of Lading")}
                >
                  Bill of Lading
                </DropdownItem>
                <DropdownItem
                  icon={<ReceiptText size={16} />}
                  onSelect={() => setFreightType("Rate confirmation")}
                >
                  Rate confirmation
                </DropdownItem>
                <DropdownItem
                  icon={<ShieldCheck size={16} />}
                  onSelect={() => setFreightType("Proof of delivery")}
                >
                  Proof of delivery
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  tone="danger"
                  inset
                  icon={<Upload size={16} />}
                  onSelect={() => setFreightType("Other attachment")}
                >
                  Other attachment
                </DropdownItem>
              </DropdownContent>
            </Dropdown>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <Button
                icon={<Upload size={16} />}
                onClick={queueUpload}
                style={{ flex: 1, minWidth: "160px" }}
                isLoading={upload.isPending}
              >
                Queue upload
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    appearance="ghost"
                    icon={<ShieldCheck size={16} />}
                    style={{ minWidth: "160px" }}
                  >
                    Radix Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent
                  title="Radix Dialog accessibility check"
                  description="Focus is trapped while open and returns to the trigger on close."
                >
                  <p
                    style={{
                      margin: "0 0 0.6rem",
                      color: "rgba(229, 231, 235, 0.8)",
                      lineHeight: 1.5,
                    }}
                  >
                    This dialog uses Radix primitives plus our styles. Try
                    tabbing through the controls or pressing Escape to close.
                  </p>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button appearance="ghost">Cancel</Button>
                    </DialogClose>
                    <Button
                      icon={<Sparkles size={16} />}
                      onClick={() =>
                        showToast({
                          title: "Dialog acknowledged",
                          description: "Radix Dialog wiring looks good.",
                          tone: "info",
                        })
                      }
                    >
                      Looks good
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                paddingTop: "1rem",
                display: "grid",
                gap: "0.6rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0, fontSize: "1rem" }}>Query data demo</h3>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(229, 231, 235, 0.7)",
                  }}
                >
                  {historyLoading ? "Loading history…" : "Cached"}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "0.4rem",
                  maxHeight: "180px",
                  overflowY: "auto",
                }}
              >
                {history?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveJobId(item.id)}
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      padding: "0.65rem 0.75rem",
                      background:
                        activeJobId === item.id
                          ? "rgba(59, 130, 246, 0.12)"
                          : "rgba(255, 255, 255, 0.03)",
                      color: "#e5e7eb",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.7rem",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{item.name}</span>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        color:
                          item.status === "complete"
                            ? "#34d399"
                            : "rgba(229, 231, 235, 0.8)",
                      }}
                    >
                      {item.status}
                    </span>
                  </button>
                ))}
                {!history?.length && (
                  <p style={{ color: "rgba(229, 231, 235, 0.7)" }}>
                    Queue an upload to populate history.
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.02)",
                }}
              >
                <div>
                  <p style={{ margin: 0, color: "rgba(229, 231, 235, 0.8)" }}>
                    Active job
                  </p>
                  <strong>{activeJobId ?? "None"}</strong>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, color: "rgba(229, 231, 235, 0.8)" }}>
                    Status
                  </p>
                  <strong>{jobStatusDisplay}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
