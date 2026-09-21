"use client";

import { useCallback, useEffect, useState } from "react";

type Patient = {
  id: number | string;
  patientCode?: string | null;
  fullName: string;
  whatsappNumber: string;
  location: string;
  status: "prospective" | "active" | "inactive" | "archived";
  preferredConsultation?: string | null;
  lastInquiryAt?: string | null;
  inquiryCount: number;
};
type Dashboard = {
  patients: Patient[];
  stats: {
    total: number;
    prospective: number;
    active: number;
    inquiries: number;
  };
};

const statusStyle: Record<
  Patient["status"],
  { background: string; color: string; label: string }
> = {
  prospective: {
    background: "#fff3d6",
    color: "#8a5a00",
    label: "Prospective",
  },
  active: { background: "#dff7e9", color: "#14753e", label: "Active" },
  inactive: { background: "#e9eef2", color: "#4d6473", label: "Inactive" },
  archived: { background: "#f1e7f7", color: "#71408b", label: "Archived" },
};
const cardData = [
  {
    key: "total" as const,
    label: "Total patients",
    background: "linear-gradient(135deg,#173f5f,#20639b)",
    icon: "P",
  },
  {
    key: "prospective" as const,
    label: "Prospective",
    background: "linear-gradient(135deg,#d97706,#f59e0b)",
    icon: "N",
  },
  {
    key: "active" as const,
    label: "Active patients",
    background: "linear-gradient(135deg,#16835d,#22a879)",
    icon: "A",
  },
  {
    key: "inquiries" as const,
    label: "Total inquiries",
    background: "linear-gradient(135deg,#0d7483,#16a3a1)",
    icon: "I",
  },
];

export function PatientDashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [applied, setApplied] = useState({ search: "", status: "" });
  const [data, setData] = useState<Dashboard>({
    patients: [],
    stats: { total: 0, prospective: 0, active: 0, inquiries: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/patient-dashboard?${new URLSearchParams(applied)}`,
        { credentials: "include" },
      );
      if (!response.ok) throw new Error("Unable to load patients.");
      setData(await response.json());
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to load patients.",
      );
    } finally {
      setLoading(false);
    }
  }, [applied]);
  useEffect(() => {
    void load();
  }, [load]);
  function filter(event: React.FormEvent) {
    event.preventDefault();
    setApplied({ search, status });
  }
  function reset() {
    setSearch("");
    setStatus("");
    setApplied({ search: "", status: "" });
  }

  return (
    <div style={{ padding: 32, maxWidth: 1500, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 26,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Patient Dashboard</h1>
          <p style={{ margin: "8px 0 0", color: "var(--theme-elevation-600)" }}>
            View patients, enquiry activity and current status.
          </p>
        </div>
        <a
          className="btn btn--style-primary"
          href="/admin/collections/patients/create"
        >
          Add patient
        </a>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 16,
          marginBottom: 26,
        }}
      >
        {cardData.map((card) => (
          <div
            key={card.key}
            style={{
              padding: 22,
              borderRadius: 14,
              color: "#fff",
              background: card.background,
              boxShadow: "0 10px 24px rgba(22,52,74,.14)",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                borderRadius: 10,
                background: "rgba(255,255,255,.18)",
                fontWeight: 800,
              }}
            >
              {card.icon}
            </div>
            <strong style={{ display: "block", marginTop: 17, fontSize: 30 }}>
              {data.stats[card.key].toLocaleString()}
            </strong>
            <span style={{ opacity: 0.9 }}>{card.label}</span>
          </div>
        ))}
      </div>
      <form
        onSubmit={filter}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 14,
          alignItems: "end",
          padding: 20,
          marginBottom: 24,
          border: "1px solid var(--theme-elevation-150)",
          borderRadius: 10,
          background: "var(--theme-elevation-50)",
        }}
      >
        <label style={{ display: "grid", gap: 7 }}>
          <span>Search patient</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, WhatsApp number or location"
          />
        </label>
        <label style={{ display: "grid", gap: 7 }}>
          <span>Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="prospective">Prospective</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <button className="btn btn--style-primary" type="submit">
          Search
        </button>
        <button
          className="btn btn--style-secondary"
          type="button"
          onClick={reset}
        >
          Reset
        </button>
      </form>
      {error ? (
        <div style={{ padding: 16, color: "var(--theme-error-600)" }}>
          {error}
        </div>
      ) : null}
      <div
        style={{
          overflowX: "auto",
          border: "1px solid var(--theme-elevation-150)",
          borderRadius: 10,
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", minWidth: 950 }}
        >
          <thead>
            <tr>
              {[
                "Patient",
                "Patient ID",
                "WhatsApp",
                "Location",
                "Status",
                "Preference",
                "Inquiries",
                "Last inquiry",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  style={{
                    padding: 14,
                    textAlign: "left",
                    borderBottom: "1px solid var(--theme-elevation-150)",
                    background: "var(--theme-elevation-50)",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ padding: 30, textAlign: "center" }}>
                  Loading patients…
                </td>
              </tr>
            ) : data.patients.length ? (
              data.patients.map((patient) => {
                const badge = statusStyle[patient.status];
                return (
                  <tr key={patient.id}>
                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid var(--theme-elevation-100)",
                        fontWeight: 700,
                      }}
                    >
                      {patient.fullName}
                    </td>
                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid var(--theme-elevation-100)",
                        fontFamily: "monospace",
                      }}
                    >
                      {patient.patientCode || "—"}
                    </td>
                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid var(--theme-elevation-100)",
                      }}
                    >
                      {patient.whatsappNumber}
                    </td>
                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid var(--theme-elevation-100)",
                      }}
                    >
                      {patient.location}
                    </td>
                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid var(--theme-elevation-100)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: 999,
                          background: badge.background,
                          color: badge.color,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid var(--theme-elevation-100)",
                      }}
                    >
                      {patient.preferredConsultation === "video"
                        ? "Video"
                        : patient.preferredConsultation === "physical"
                          ? "Physical"
                          : "Not specified"}
                    </td>
                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid var(--theme-elevation-100)",
                      }}
                    >
                      {patient.inquiryCount}
                    </td>
                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid var(--theme-elevation-100)",
                      }}
                    >
                      {patient.lastInquiryAt
                        ? new Date(patient.lastInquiryAt).toLocaleString(
                            "en-PK",
                            { dateStyle: "medium", timeStyle: "short" },
                          )
                        : "—"}
                    </td>
                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid var(--theme-elevation-100)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <a
                          href={`/patient-record/${patient.id}`}
                          style={{
                            padding: "8px 11px",
                            borderRadius: 7,
                            background: "#20639b",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          View details
                        </a>
                        <a
                          href={`/admin/collections/patient-inquiries?where[patient][equals]=${patient.id}`}
                          style={{
                            padding: "8px 11px",
                            borderRadius: 7,
                            background: "#168b86",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          View inquiries
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} style={{ padding: 30, textAlign: "center" }}>
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
