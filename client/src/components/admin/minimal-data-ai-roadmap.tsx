'use client';
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Pencil, Trash2, Plus } from "lucide-react";

/**
 * Interactive Data & AI Roadmap (Light • Embedded)
 * ------------------------------------------------
 * Fix: previous error was caused by stray/mismatched JSX near the header
 * (extra text and orphaned tags). This rewrite balances all tags, removes
 * the stray nodes, and keeps the minimal feature set you've asked for.
 *
 * Features
 * - Concept-only checklist with hover-only edit icon
 * - Inline concept editor (rename, add/replace URL, delete)
 * - Add new concept to any skill
 * - Local persistence via localStorage
 * - Section-scoped light theme tokens so it stays light on dark pages
 *
 * Dev: Includes lightweight runtime smoke tests (console-only) so
 * regressions are easier to catch without a test runner.
 */

// ---------- Types ----------

type Concept = { id: string; title: string; url?: string };

type Skill = { id: string; title: string; description?: string; concepts: Concept[] };

type Category = { id: string; title: string; summary?: string; skills: Skill[] };

type RoadmapData = { title: string; subtitle?: string; categories: Category[] };

// ---------- Seed Data ----------

const seedData: RoadmapData = {
  title: "Data & AI Roadmap",
  categories: [
    {
      id: "core-data",
      title: "Core Data & Analytics",
      skills: [
        {
          id: "data-eng",
          title: "Data Architecture & Engineering",
          concepts: [
            { id: "k-de-arch", title: "Lakehouse vs Warehouse vs Data Lake" },
            { id: "k-de-sql", title: "SQL & Query Optimization" },
            { id: "k-de-modeling", title: "Data Modeling (Dimensional, Data Vault)" },
            { id: "k-de-files", title: "File Formats & Partitioning (Parquet, ORC, Iceberg/Delta)" },
            { id: "k-de-elt", title: "ELT/ETL Patterns & Orchestration (Airflow/Prefect)" },
            { id: "k-de-dbt", title: "dbt & Analytics Engineering" },
            { id: "k-de-stream", title: "Streaming & CDC (Kafka, Debezium)" },
            { id: "k-de-spark", title: "Spark & Distributed Compute Basics" },
            { id: "k-de-quality", title: "Data Quality, Testing, Contracts, Lineage" },
            { id: "k-de-catalog", title: "Catalog & Discovery (Data Catalog/Glossary)" },
            { id: "k-de-security", title: "Security & Access (RBAC/ABAC, Tokenization)" },
            { id: "k-de-cost", title: "Cost & Performance Tuning (Compute/Storage)" },
            { id: "k-de-ci", title: "CI/CD for Data (Git, CI, Environments)" },
            { id: "k-de-iac", title: "Infra as Code, Containers & K8s (basics)" },
            { id: "k-de-medallion", title: "Medallion Architecture & DQ SLAs" },
          ],
        },
        {
          id: "governance",
          title: "Data Management & Governance",
          concepts: [
            { id: "k-gov-mdm", title: "Domains, MDM, Golden Records" },
            { id: "k-gov-privacy", title: "Privacy & Compliance (GDPR/CCPA/HIPAA/PCI)" },
            { id: "k-gov-pii", title: "PII Handling, De‑identification, Consent" },
            { id: "k-gov-policy", title: "Policies, Stewardship & Governance Operating Model" },
            { id: "k-gov-quality", title: "Data Quality Policies, SLAs, Lineage" },
            { id: "k-gov-access", title: "Access Controls, Audit Logging" },
            { id: "k-gov-sharing", title: "Data Sharing Agreements & Contracts" },
            { id: "k-gov-retention", title: "Retention & Data Lifecycle Management" },
          ],
        },
        {
          id: "bi",
          title: "Analytics & BI",
          concepts: [
            { id: "k-bi-kpi", title: "KPI Trees & Metric Definitions" },
            { id: "k-bi-sem", title: "Semantic/Metric Layer (dbt/LookML/Power BI)" },
            { id: "k-bi-viz", title: "Data Visualization & Dashboard Design Principles" },
            { id: "k-bi-sql", title: "Analytical SQL (Windows, Time Series)" },
            { id: "k-bi-forecast", title: "Forecasting Basics & Accuracy" },
            { id: "k-bi-exp", title: "Experimentation (A/B), Causal Thinking" },
            { id: "k-bi-perf", title: "BI Performance Tuning & Governance" },
            { id: "k-bi-story", title: "Executive Storytelling & Insight Framing" },
          ],
        },
      ],
    },
    {
      id: "ai",
      title: "AI & Advanced Analytics",
      skills: [
        {
          id: "ml",
          title: "ML & AI Fundamentals",
          concepts: [
            { id: "k-ml-task", title: "Supervised vs Unsupervised; Bias/Variance" },
            { id: "k-ml-fe", title: "Feature Engineering & Regularization" },
            { id: "k-ml-val", title: "Train/Val/Test; Leakage & Robust Evaluation" },
            { id: "k-ml-metrics", title: "Metrics (ROC/AUC, F1, MAE/MAPE)" },
            { id: "k-ml-int", title: "Model Interpretability (SHAP/LIME)" },
            { id: "k-ml-ts", title: "Time Series Basics" },
            { id: "k-ml-recs", title: "Recommenders Basics" },
            { id: "k-ml-nlp", title: "Embeddings, Tokenization, Vector Semantics" },
          ],
        },
        {
          id: "mlops",
          title: "MLOps & Lifecycle",
          concepts: [
            { id: "k-mo-version", title: "Versioning (Data/Code/Model) & Reproducibility" },
            { id: "k-mo-exp", title: "Experiment Tracking & Model Registry" },
            { id: "k-mo-deploy", title: "Deployment Patterns (Batch/Online/Serverless)" },
            { id: "k-mo-monitor", title: "Monitoring (Data/Concept Drift), Alerting" },
            { id: "k-mo-cicd", title: "CI/CD for ML & Rollbacks" },
            { id: "k-mo-feature", title: "Feature Stores & Real‑Time Features" },
            { id: "k-mo-eval", title: "Online Testing (Shadow, A/B, Bandits)" },
            { id: "k-mo-gov", title: "Model Governance/Compliance & Lifecycle Policies" },
          ],
        },
        {
          id: "genai",
          title: "GenAI & RAG",
          concepts: [
            { id: "k-ga-llm", title: "LLM Basics (Tokens, Context, Temperature)" },
            { id: "k-ga-rag", title: "RAG: Chunking, Embeddings, Retrieval & Re‑ranking" },
            { id: "k-ga-eval", title: "Eval Harnesses (Groundedness, Factuality)" },
            { id: "k-ga-safety", title: "Safety, Guardrails, Red‑teaming" },
            { id: "k-ga-latency", title: "Latency/Cost Optimization & Caching" },
            { id: "k-ga-privacy", title: "Privacy, PII Handling, Data Residency" },
            { id: "k-ga-agents", title: "Tools/Agents, Multi‑turn State" },
          ],
        },
      ],
    },
    {
      id: "consulting",
      title: "Consulting & Business",
      skills: [
        {
          id: "strategy",
          title: "Data/AI Strategy & Roadmaps",
          concepts: [
            { id: "k-st-vision", title: "Value Tree: Vision → Outcomes → KPIs" },
            { id: "k-st-operating", title: "Operating Model & Capability Maturity" },
            { id: "k-st-portfolio", title: "Portfolio & Investment Planning" },
            { id: "k-st-roadmap", title: "Prioritization & 12–18mo Roadmaps" },
            { id: "k-st-org", title: "Org Design, Data Product Thinking" },
          ],
        },
        {
          id: "industry",
          title: "Industry Depth",
          concepts: [
            { id: "k-in-models", title: "Domain Data Models & Critical Systems" },
            { id: "k-in-reg", title: "Regulatory Frameworks (sector‑specific)" },
            { id: "k-in-use", title: "Canonical Use Cases & ROI Levers" },
            { id: "k-in-standards", title: "Data Exchange Standards & Interop" },
            { id: "k-in-vendors", title: "Vendor Landscape & Partnerships" },
          ],
        },
        {
          id: "value",
          title: "Value Realization",
          concepts: [
            { id: "k-vr-baseline", title: "Baseline & Benchmarking" },
            { id: "k-vr-okr", title: "OKRs & Benefits Tracking" },
            { id: "k-vr-roi", title: "ROI/TCO & Financial Modeling" },
            { id: "k-vr-adoption", title: "Adoption Metrics & Change Impact" },
          ],
        },
      ],
    },
    {
      id: "leadership",
      title: "Leadership & Delivery",
      skills: [
        {
          id: "advisory",
          title: "Client Advisory & Stakeholders",
          concepts: [
            { id: "k-ad-story", title: "C‑suite Storytelling & Structured Recs" },
            { id: "k-ad-influence", title: "Influence, Objection Handling, Negotiation" },
            { id: "k-ad-risk", title: "Risk Framing & Responsible AI Narrative" },
            { id: "k-ad-map", title: "Stakeholder Mapping & Success Criteria" },
          ],
        },
        {
          id: "program",
          title: "Program & Change Mgmt",
          concepts: [
            { id: "k-pm-methods", title: "Delivery Methods (Agile/Hybrid)" },
            { id: "k-pm-gov", title: "Program Governance & RACI" },
            { id: "k-pm-roadmap", title: "Roadmap, Risks & Issues Mgmt" },
            { id: "k-pm-comms", title: "Comms, Training & Adoption" },
            { id: "k-pm-vendor", title: "Vendor Mgmt & SOWs" },
          ],
        },
        {
          id: "talent",
          title: "Team Leadership",
          concepts: [
            { id: "k-tl-hiring", title: "Hiring Loops, Leveling & Rubrics" },
            { id: "k-tl-perf", title: "Performance & Feedback Cadence" },
            { id: "k-tl-mentor", title: "Mentorship & Growth Plans" },
            { id: "k-tl-capacity", title: "Capacity Planning & Sourcing" },
            { id: "k-tl-culture", title: "Team Culture & Responsible AI" },
          ],
        },
      ],
    },
    {
      id: "trends",
      title: "Emerging & Strategic",
      skills: [
        {
          id: "monetization",
          title: "Data Monetization",
          concepts: [
            { id: "k-dm-opps", title: "Opportunity Sizing & Market Fit" },
            { id: "k-dm-product", title: "Data Products, APIs & Platforming" },
            { id: "k-dm-pricing", title: "Pricing, Packaging, Licensing" },
            { id: "k-dm-legal", title: "Legal, IP & Agreements" },
          ],
        },
        {
          id: "responsible",
          title: "Responsible AI",
          concepts: [
            { id: "k-ra-bias", title: "Bias/Fairness & Explainability" },
            { id: "k-ra-privacy", title: "Privacy, Security & Red‑teaming" },
            { id: "k-ra-govern", title: "AI Governance, Model Cards & Reviews" },
          ],
        },
        {
          id: "ecosystem",
          title: "Ecosystem & Partnerships",
          concepts: [
            { id: "k-ec-hypers", title: "Hyperscalers & Co‑sell Motions" },
            { id: "k-ec-isv", title: "ISV/Startup Landscape & Alliances" },
            { id: "k-ec-gto", title: "GTM & Partner‑led Delivery" },
          ],
        },
      ],
    },
  ],
};

// ---------- Local Storage ----------

const LS_STATUS_KEY = "roadmap_min_status"; // { [conceptId]: boolean }
const LS_CONCEPT_LINKS_KEY = "roadmap_min_concept_links"; // { [conceptId]: { url: string } }
const LS_DATA_KEY = "roadmap_min_data"; // persisted editable categories

function useLocalStorageState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

// ---------- Utils ----------

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- Component ----------

export default function MinimalDataAIRoadmap() {
  // Force light mode while this component is mounted
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const hadDark = root.classList.contains('dark');
    if (hadDark) root.classList.remove('dark');
    const prevColorScheme = root.style.colorScheme;
    root.style.colorScheme = 'light';
    return () => {
      root.style.colorScheme = prevColorScheme;
      if (hadDark) root.classList.add('dark');
    };
  }, []);

  const [data, setData] = useLocalStorageState<RoadmapData>(LS_DATA_KEY, seedData);
  const [status, setStatus] = useLocalStorageState<Record<string, boolean>>(LS_STATUS_KEY, {});
  const [conceptLinks, setConceptLinks] = useLocalStorageState<Record<string, { url: string }>>(LS_CONCEPT_LINKS_KEY, {});

  // Concept editor state
  const [editingConceptId, setEditingConceptId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState<string>("");
  const [tempUrl, setTempUrl] = useState<string>("");
  const [addingSkillId, setAddingSkillId] = useState<string | null>(null);
  const [newConceptTitle, setNewConceptTitle] = useState<string>("");
  const [newConceptUrl, setNewConceptUrl] = useState<string>("");

  const overall = useMemo(() => {
    const ids: string[] = [];
    data.categories.forEach((c) => c.skills.forEach((s) => s.concepts.forEach((k) => ids.push(k.id))));
    if (!ids.length) return { done: 0, total: 0, pct: 0 };
    const done = ids.filter((id) => status[id]).length;
    return { done, total: ids.length, pct: Math.round((done / ids.length) * 100) };
  }, [data, status]);

  // Concept helpers
  const startEditConcept = (conceptId: string, currentTitle: string, initialUrl?: string) => {
    setEditingConceptId(conceptId);
    setTempTitle(currentTitle);
    setTempUrl(initialUrl || conceptLinks[conceptId]?.url || "");
  };
  const saveConcept = (conceptId: string) => {
    const title = tempTitle.trim();
    const url = tempUrl.trim();
    if (!title) return;
    setData((d) => ({
      ...d,
      categories: d.categories.map((cat) => ({
        ...cat,
        skills: cat.skills.map((skill) => ({
          ...skill,
          concepts: skill.concepts.map((c) => (c.id === conceptId ? { ...c, title } : c)),
        })),
      })),
    }));
    setConceptLinks((m) => {
      const next = { ...m } as Record<string, { url: string }>;
      if (url) next[conceptId] = { url };
      else delete next[conceptId];
      return next;
    });
    setEditingConceptId(null);
    setTempTitle("");
    setTempUrl("");
  };
  const deleteConcept = (conceptId: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Delete this item?')) return;
    setData((d) => ({
      ...d,
      categories: d.categories.map((cat) => ({
        ...cat,
        skills: cat.skills.map((skill) => ({
          ...skill,
          concepts: skill.concepts.filter((c) => c.id !== conceptId),
        })),
      })),
    }));
    setStatus((s) => { const n = { ...s }; delete n[conceptId]; return n; });
    setConceptLinks((m) => { const n = { ...m } as Record<string, { url: string }>; delete n[conceptId]; return n; });
    if (editingConceptId === conceptId) { setEditingConceptId(null); setTempTitle(""); setTempUrl(""); }
  };
  const addConcept = (skillId: string) => {
    const title = newConceptTitle.trim();
    const url = newConceptUrl.trim();
    if (!title) return;
    const id = newId('k');
    setData((d) => ({
      ...d,
      categories: d.categories.map((cat) => ({
        ...cat,
        skills: cat.skills.map((s) => (s.id === skillId ? { ...s, concepts: [...s.concepts, { id, title }] } : s)),
      })),
    }));
    if (url) setConceptLinks((m) => ({ ...m, [id]: { url } }));
    setAddingSkillId(null); setNewConceptTitle(""); setNewConceptUrl("");
  };

  // ---------- Dev Smoke Tests (console only) ----------
  useEffect(() => {
    try {
      // uniqueness of concept ids
      const all = new Set<string>();
      data.categories.forEach((c) => c.skills.forEach((s) => s.concepts.forEach((k) => {
        if (all.has(k.id)) throw new Error(`Duplicate concept id: ${k.id}`);
        all.add(k.id);
      })));

      // slugify tests
      console.assert(slugify('Hello World!') === 'hello-world', 'slugify basic');
      console.assert(slugify('A  B   C') === 'a-b-c', 'slugify whitespace collapse');

      // newId shape
      const nid = newId('x');
      console.assert(/^x-[a-z0-9]{6}$/i.test(nid), 'newId shape');

      // data presence
      console.assert(data.categories.length > 0, 'has categories');

      // status mapping is boolean-only
      Object.values(status).forEach((v) => console.assert(typeof v === 'boolean', 'status boolean'));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[roadmap smoke tests] failed:', err);
    }
    // We intentionally do not depend on status/links to avoid noisy logs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <section
      aria-label="Data & AI Roadmap"
      className="mx-auto max-w-2xl px-6 py-2 bg-white text-slate-900 [color-scheme:light]"
      style={{
        ['--background' as any]: '0 0% 100%', ['--foreground' as any]: '222.2 84% 4.9%',
        ['--card' as any]: '0 0% 100%', ['--card-foreground' as any]: '222.2 84% 4.9%',
        ['--popover' as any]: '0 0% 100%', ['--popover-foreground' as any]: '222.2 84% 4.9%',
        ['--primary' as any]: '222.2 47.4% 11.2%', ['--primary-foreground' as any]: '210 40% 98%',
        ['--secondary' as any]: '210 40% 96.1%', ['--secondary-foreground' as any]: '222.2 47.4% 11.2%',
        ['--muted' as any]: '210 40% 96.1%', ['--muted-foreground' as any]: '215.4 16.3% 46.9%',
        ['--accent' as any]: '210 40% 96.1%', ['--accent-foreground' as any]: '222.2 47.4% 11.2%',
        ['--destructive' as any]: '0 84.2% 60.2%', ['--destructive-foreground' as any]: '210 40% 98%',
        ['--border' as any]: '214.3 31.8% 91.4%', ['--input' as any]: '214.3 31.8% 91.4%', ['--ring' as any]: '215 20.2% 65.1%', ['--radius' as any]: '0.5rem',
      }}
    >
      {/* header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm tracking-wide text-slate-500">Data & AI Roadmap</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{overall.done}/{overall.total}</span>
          </div>
        </div>
      </div>

      {data.categories.map((cat) => (
        <div key={cat.id} id={slugify(cat.title)} className="mb-2">
          <Accordion type="single" collapsible>
            <AccordionItem value={cat.id}>
              <AccordionTrigger className="py-1 text-base font-medium hover:no-underline">
                <div className="w-full">{cat.title}</div>
              </AccordionTrigger>
              <AccordionContent className="pt-1">
                <div className="space-y-1">
                  {cat.skills.length ? (
                    cat.skills.map((skill) => (
                      <details key={skill.id} className="group">
                        <summary className="cursor-pointer list-none py-1 text-[15px] text-slate-700 hover:text-slate-900">{skill.title}</summary>
                        <div className="ml-4 mt-1 divide-y divide-slate-100">
                          {skill.concepts.map((k) => {
                            const savedUrl = conceptLinks[k.id]?.url || k.url;
                            const isEditing = editingConceptId === k.id;
                            return (
                              <div key={k.id} className="flex items-start justify-between py-1.5">
                                {!isEditing && (
                                  <label className="flex items-start gap-2">
                                    <Checkbox checked={!!status[k.id]} onCheckedChange={(v) => setStatus((s) => ({ ...s, [k.id]: Boolean(v) }))} />
                                    <span className="text-sm">
                                      {savedUrl ? (
                                        <a href={savedUrl} target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700">{k.title}</a>
                                      ) : (
                                        k.title
                                      )}
                                    </span>
                                  </label>
                                )}
                                {!isEditing && (
                                  <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button onClick={() => startEditConcept(k.id, k.title, savedUrl)} className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center" aria-label={`Edit ${k.title}`} title="Edit">
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                )}
                                {isEditing && (
                                  <div className="col-span-2 mt-1 w-full">
                                    <div className="ml-6 flex flex-wrap items-center gap-2">
                                      <Input placeholder="Concept title" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} className="h-8 flex-1 min-w-[10rem]" onKeyDown={(e) => { if (e.key === 'Enter') saveConcept(k.id); }} />
                                      <Input placeholder="Resource URL (optional)" value={tempUrl} onChange={(e) => setTempUrl(e.target.value)} className="h-8 flex-1 min-w-[12rem]" onKeyDown={(e) => { if (e.key === 'Enter') saveConcept(k.id); }} />
                                      <Button size="sm" className="h-8 px-3" onClick={() => saveConcept(k.id)}>Save</Button>
                                      <Button size="sm" variant="ghost" className="h-8 px-3" onClick={() => { setEditingConceptId(null); setTempTitle(''); setTempUrl(''); }}>Cancel</Button>
                                      <Button size="sm" variant="ghost" className="h-8 px-3 text-red-600 hover:text-red-700" onClick={() => deleteConcept(k.id)}>
                                        <Trash2 className="h-3.5 w-3.5 mr-1" />Delete
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="ml-4 mt-2">
                          {addingSkillId === skill.id ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <Input placeholder="New concept" value={newConceptTitle} onChange={(e) => setNewConceptTitle(e.target.value)} className="h-8 flex-1 min-w-[10rem]" />
                              <Input placeholder="URL (optional)" value={newConceptUrl} onChange={(e) => setNewConceptUrl(e.target.value)} className="h-8 flex-1 min-w-[12rem]" />
                              <Button size="sm" className="h-8 px-3" onClick={() => addConcept(skill.id)}>Add</Button>
                              <Button size="sm" variant="ghost" className="h-8 px-3" onClick={() => { setAddingSkillId(null); setNewConceptTitle(''); setNewConceptUrl(''); }}>Cancel</Button>
                            </div>
                          ) : (
                            <button onClick={() => setAddingSkillId(skill.id)} className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
                              <Plus className="h-3.5 w-3.5" /> Add item
                            </button>
                          )}
                        </div>
                      </details>
                    ))
                  ) : (
                    <div className="ml-1 py-2 text-sm text-slate-500">No skills yet.</div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </section>
  );
}
