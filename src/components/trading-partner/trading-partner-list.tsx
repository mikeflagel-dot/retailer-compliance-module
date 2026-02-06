import { useMemo, useState } from "react";
import { Trash2, Pencil } from "lucide-react";

type Status = "draft" | "active";

type Entity<T> = {
  id: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  data: T;
};

type TradingPartnerFormData = {
  retailer: string;
  programType?: string;
  merchant: string;
  tradingPartnerId: string;
  merchantGs1Prefix?: string;
  merchantIsa?: string;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "—";
  }
}

function formatProgramType(value?: string): string {
  if (!value) return "—";

  switch (value.toLowerCase()) {
    case "b2b":
      return "B2B";
    case "dropship":
      return "Dropship";
    default:
      return value;
  }
}

export function TradingPartnerList({
  partners,
  onSelect,
  onDelete,
}: {
  partners: Entity<TradingPartnerFormData>[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  /** Filtering */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return partners.filter((p) => {
      if (!q) return true;

      const d = p.data || ({} as TradingPartnerFormData);

      const hay = [
        d.retailer,
        d.programType || "",
        d.merchant,
        d.tradingPartnerId,
        d.merchantGs1Prefix || "",
        d.merchantIsa || "",
        p.id,
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [partners, search]);

  /** Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  if (page !== safePage) setPage(safePage);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search retailer, merchant, ISA, GS1…"
          className="w-96 max-w-full px-3 py-2 border border-slate-300 rounded text-sm"
        />

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>{filtered.length} results</span>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-2 border border-slate-300 rounded text-sm bg-white"
          >
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3">Retailer</th>
              <th className="text-left px-4 py-3">Program Type</th>
              <th className="text-left px-4 py-3">Merchant</th>
              <th className="text-left px-4 py-3">Trading Partner Id</th>
              <th className="text-left px-4 py-3">GS1 Prefix</th>
              <th className="text-left px-4 py-3">Updated</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {pageRows.map((p) => {
              const d = p.data || {};

              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{d.retailer || "—"}</td>
                  <td className="px-4 py-3">
                    {formatProgramType(d.programType)}
                  </td>
                  <td className="px-4 py-3">{d.merchant || "—"}</td>
                  <td className="px-4 py-3">{d.tradingPartnerId || "—"}</td>
                  <td className="px-4 py-3">{d.merchantGs1Prefix || "—"}</td>
                  <td className="px-4 py-3">{formatDate(p.updatedAt)}</td>

                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        onClick={() => onSelect(p.id)}
                        title="Edit"
                        className="text-slate-600 hover:text-slate-800"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setPendingDeleteId(p.id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Delete Trading Partner?
            </h3>

            <p className="text-sm text-slate-600 mb-6">
              This action cannot be undone and may impact live integrations.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingDeleteId(null)}
                className="px-4 py-2 text-sm border rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onDelete(pendingDeleteId);
                  setPendingDeleteId(null);
                }}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
