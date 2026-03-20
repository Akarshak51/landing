"use client";

import { useState, useRef, useEffect } from "react";

const toneOptions = ["bold", "friendly", "corporate", "playful"];

const fields = [
  {
    key: "company_name",
    label: "Company Name",
    placeholder: "e.g. Stripe, Notion, Acme Inc.",
    type: "text"
  },
  {
    key: "website_url",
    label: "Website URL",
    placeholder: "https://yourcompany.com (optional)",
    type: "text"
  },
  {
    key: "short_description",
    label: "Short Description",
    placeholder: "1-3 lines describing what you do...",
    type: "textarea",
    rows: 3
  },
  {
    key: "target_audience",
    label: "Target Audience",
    placeholder: "e.g. D2C brands, SaaS founders, enterprise teams",
    type: "text"
  },
  {
    key: "research_notes_raw",
    label: "Website Text / Research Notes",
    placeholder:
      "Paste website copy or any info: features, pricing, testimonials, product names, metrics...",
    type: "textarea",
    rows: 5
  }
];

export default function LandingPageAgent() {
  const [form, setForm] = useState({
    company_name: "",
    website_url: "",
    short_description: "",
    target_audience: "",
    tone: "bold",
    research_notes_raw: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "content" | "html">(
    "preview"
  );
  const [error, setError] = useState("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleChange = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const generate = async () => {
    if (!form.company_name || !form.short_description) {
      setError("Please fill in at least Company Name and Short Description.");
      return;
    }
    setError("");
    setStatus("loading");
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const serverError =
          data && typeof data.error === "string" ? data.error : null;

        throw new Error(
          serverError ?? `Failed to generate page (HTTP ${response.status})`
        );
      }

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response from generation API");
      }

      setResult(data);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong generating the page. Please try again."
      );
      setStatus("error");
    }
  };

  const downloadHTML = () => {
    if (!result?.html) return;
    const blob = new Blob([result.html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${form.company_name
      .replace(/\s+/g, "-")
      .toLowerCase()}-landing-page.html`;
    a.click();
  };

  const copyJSON = () => {
    if (!result?.content) return;
    navigator.clipboard.writeText(JSON.stringify(result.content, null, 2));
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "#0a0a0f",
        minHeight: "100vh",
        color: "#e8e6f0",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", background: "radial-gradient(circle at 20% 20%, rgba(108,99,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(155,89,245,0.06) 0%, transparent 50%)", zIndex: 0 }} />
      <style dangerouslySetInnerHTML={{ __html: String.raw`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #3a3a5c; border-radius: 3px; }
        .field-label { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #8b89a8; margin-bottom: 7px; display: block; }
        input, textarea { width: 100%; background: #13131f; border: 1px solid #2a2a42; border-radius: 12px; color: #e8e6f0; font-family: inherit; font-size: 14px; padding: 14px 16px; transition: all 0.3s ease; resize: vertical; outline: none; }
        input:focus, textarea:focus { border-color: #6c63ff; box-shadow: 0 0 0 4px rgba(108,99,255,0.15); transform: translateY(-1px); }
        input::placeholder, textarea::placeholder { color: #44425a; }
        .tone-btn { padding: 10px 20px; border-radius: 10px; border: 1px solid #2a2a42; background: #13131f; color: #8b89a8; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; font-family: inherit; }
        .tone-btn:hover { border-color: #6c63ff; color: #c4c0ff; transform: translateY(-2px); }
        .tone-btn.active { background: linear-gradient(135deg, rgba(108,99,255,0.2), rgba(155,89,245,0.2)); border-color: #6c63ff; color: #a89dff; box-shadow: 0 4px 15px rgba(108,99,255,0.2); }
        .generate-btn { width: 100%; padding: 18px; border-radius: 14px; border: none; background: linear-gradient(135deg, #6c63ff, #9b59f5); color: white; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; letter-spacing: 0.02em; position: relative; overflow: hidden; }
        .generate-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transform: translateX(-100%); transition: transform 0.5s ease; }
        .generate-btn:hover::before { transform: translateX(100%); }
        .generate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(108,99,255,0.4); }
        .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .tab-btn { padding: 10px 22px; border-radius: 10px; border: none; background: transparent; color: #8b89a8; font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; }
        .tab-btn.active { background: linear-gradient(135deg, #1e1e30, #252540); color: #c4c0ff; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .tab-btn:hover:not(.active) { color: #c4c0ff; transform: translateY(-1px); }
        .action-btn { padding: 10px 20px; border-radius: 10px; border: 1px solid #2a2a42; background: #13131f; color: #8b89a8; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; font-family: inherit; display: flex; align-items: center; gap: 8px; }
        .action-btn:hover { border-color: #6c63ff; color: #c4c0ff; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(108,99,255,0.15); }
        .metric-card { background: linear-gradient(135deg, #13131f, #181825); border: 1px solid #2a2a42; border-radius: 14px; padding: 20px 24px; transition: all 0.3s ease; }
        .metric-card:hover { transform: translateY(-4px); border-color: #6c63ff; box-shadow: 0 8px 25px rgba(108,99,255,0.15); }
        .metric-value { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; background: linear-gradient(135deg, #a89dff, #c4bfff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .metric-label { font-size: 12px; color: #8b89a8; margin-top: 6px; letter-spacing: 0.05em; }
        .pillar-card { background: linear-gradient(135deg, #13131f, #181825); border: 1px solid #2a2a42; border-radius: 14px; padding: 20px 24px; transition: all 0.3s ease; }
        .pillar-card:hover { transform: translateY(-4px); border-color: #6c63ff; box-shadow: 0 8px 25px rgba(108,99,255,0.15); }
        .pillar-tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #6c63ff; background: rgba(108,99,255,0.12); border-radius: 6px; padding: 4px 10px; margin-bottom: 12px; }
        .proof-chip { background: linear-gradient(135deg, #13131f, #181825); border: 1px solid #2a2a42; border-radius: 12px; padding: 16px 20px; transition: all 0.3s ease; }
        .proof-chip:hover { transform: translateX(4px); border-color: #6c63ff; }
        .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        pre { white-space: pre-wrap; word-break: break-all; font-size: 12px; color: #a89dff; font-family: 'Fira Code', monospace; }
        .glow-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; background: radial-gradient(circle at 20% 20%, rgba(108,99,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(155,89,245,0.06) 0%, transparent 50%); z-index: 0; }
        .panel-left { background: linear-gradient(180deg, rgba(19,19,31,0.95), rgba(10,10,15,0.98)); }
      ` }} />

      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #1e1e30",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "linear-gradient(180deg, rgba(19,19,31,0.95), rgba(10,10,15,0.9))",
          backdropFilter: "blur(10px)",
          position: "relative",
          zIndex: 10
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(135deg, #6c63ff, #9b59f5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            boxShadow: "0 4px 20px rgba(108,99,255,0.3)"
          }}
        >
          ⚡
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 18,
              color: "#e8e6f0"
            }}
          >
            LandingForge
          </div>
          <div style={{ fontSize: 12, color: "#6c63ff", fontWeight: 500 }}>
            AI-Powered 3D Landing Pages
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          minHeight: "calc(100vh - 65px)"
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            borderRight: "1px solid #1e1e30",
            padding: "32px 28px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 22,
            background: "linear-gradient(180deg, rgba(19,19,31,0.9), rgba(13,13,21,0.95))"
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 20,
                marginBottom: 4
              }}
            >
              Generate Your Page
            </div>
            <div style={{ fontSize: 13, color: "#8b89a8", lineHeight: 1.5 }}>
              Fill in your company details and paste website text if available.
            </div>
          </div>

          {fields.map((f) => (
            <div key={f.key}>
              <label className="field-label">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  rows={f.rows}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                />
              )}
            </div>
          ))}

          <div>
            <label className="field-label">Tone</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {toneOptions.map((t) => (
                <button
                  key={t}
                  className={`tone-btn${form.tone === t ? " active" : ""}`}
                  onClick={() => handleChange("tone", t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "#ff4b4b15",
                border: "1px solid #ff4b4b40",
                borderRadius: 10,
                padding: "12px 16px",
                fontSize: 13,
                color: "#ff8080"
              }}
            >
              {error}
            </div>
          )}

          <button
            className="generate-btn"
            onClick={generate}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10
                }}
              >
                <span className="spinner" /> Generating your page...
              </span>
            ) : (
              "âœ¦ Generate Landing Page"
            )}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {status === "idle" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                padding: 40
              }}
            >
              <div style={{ fontSize: 56 }}>âœ¦</div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 24,
                  textAlign: "center"
                }}
              >
                Your landing page will appear here
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#8b89a8",
                  textAlign: "center",
                  maxWidth: 380,
                  lineHeight: 1.6
                }}
              >
                Fill the form, paste website text, then click{" "}
                <strong style={{ color: "#a89dff" }}>
                  Generate Landing Page
                </strong>
                .
              </div>
            </div>
          )}

          {status === "loading" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                padding: 40
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  border: "3px solid #2a2a42",
                  borderTop: "3px solid #6c63ff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }}
              />
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 20
                }}
              >
                Crafting your page...
              </div>
            </div>
          )}

          {status === "done" && result && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  borderBottom: "1px solid #1e1e30",
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", gap: 4 }}>
                  {(["preview", "content", "html"] as const).map((tab) => (
                    <button
                      key={tab}
                      className={`tab-btn${activeTab === tab ? " active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === "preview"
                        ? "ðŸ–¥ Preview"
                        : tab === "content"
                        ? "ðŸ“‹ Content JSON"
                        : "< / > HTML"}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {activeTab === "content" && (
                    <button className="action-btn" onClick={copyJSON}>
                      ðŸ“‹ Copy JSON
                    </button>
                  )}
                  <button className="action-btn" onClick={downloadHTML}>
                    â¬‡ Download HTML
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, overflow: "hidden" }}>
                {activeTab === "preview" && result.html && (
                  <iframe
                    ref={iframeRef}
                    srcDoc={result.html}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    title="Landing Page Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                )}

                {activeTab === "content" && result.content && (
                  <div style={{ padding: 24, overflowY: "auto", height: "100%" }}>
                    <div style={{ marginBottom: 24 }}>
                      <div
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 800,
                          fontSize: 22
                        }}
                      >
                        {result.content.company?.name}
                      </div>
                      <div style={{ fontSize: 14, color: "#a89dff", marginTop: 4 }}>
                        {result.content.company?.tagline}
                      </div>
                      <div style={{ fontSize: 13, color: "#8b89a8", marginTop: 6 }}>
                        {result.content.company?.one_line}
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#44425a",
                          marginBottom: 12
                        }}
                      >
                        Key Metrics
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                          gap: 10
                        }}
                      >
                        {result.content.hero?.big_numbers?.map(
                          (n: any, i: number) => (
                            <div key={i} className="metric-card">
                              <div className="metric-value">{n.value}</div>
                              <div className="metric-label">{n.label}</div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#44425a",
                          marginBottom: 12
                        }}
                      >
                        Pillars
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10
                        }}
                      >
                        {result.content.pillars?.map((p: any, i: number) => (
                          <div key={i} className="pillar-card">
                            <div className="pillar-tag">{p.tag}</div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 14,
                                marginBottom: 6
                              }}
                            >
                              {p.title}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "#8b89a8",
                                lineHeight: 1.5
                              }}
                            >
                              {p.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#44425a",
                          marginBottom: 12
                        }}
                      >
                        Proof Points
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {result.content.proof?.map((p: any, i: number) => (
                          <div key={i} className="proof-chip">
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 13,
                                color: "#a89dff"
                              }}
                            >
                              {p.metric}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "#8b89a8",
                                marginTop: 3
                              }}
                            >
                              {p.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "html" && result.html && (
                  <div
                    style={{
                      padding: 20,
                      overflowY: "auto",
                      height: "100%",
                      background: "#0d0d18"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: 12
                      }}
                    >
                      <button
                        className="action-btn"
                        onClick={() =>
                          navigator.clipboard.writeText(result.html)
                        }
                      >
                        ðŸ“‹ Copy HTML
                      </button>
                    </div>
                    <pre style={{ color: "#7c9e7c", fontSize: 11 }}>
                      {result.html}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {status === "error" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                padding: 40
              }}
            >
              <div style={{ fontSize: 40 }}>âš ï¸</div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 18
                }}
              >
                Generation failed
              </div>
              <div style={{ fontSize: 13, color: "#8b89a8", textAlign: "center" }}>
                {error}
              </div>
              <button
                className="generate-btn"
                style={{ maxWidth: 220 }}
                onClick={generate}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



