import { useMemo, useState } from "react";
import { Trash2, ChevronDown, ChevronRight, Pencil } from "lucide-react";

type Status = "draft" | "active";

type Entity<T> = {
  id: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  data: T;
};

type RetailerProgramData = Record<string, any> & {
  retailerName?: string;
  programName?: string;
  programCode?: string;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "—";
  }
}

type RetailerGroup = {
  retailerName: string;
  programs: Entity<RetailerProgramData>[];
};

export function RetailerProgramList({
  programs,
  onSelect,
  onDelete,
}: {
  programs: Entity<RetailerProgramData>[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [retailerFilter, setRetailerFilter] = useState<string>("all");

  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  /** Retailer dropdown options */
  const retailerOptions = useMemo(() => {
    const s = new Set<string>();
    for (const p of programs) {
      const r = (p.data?.retailerName || "").trim();
      if (r) s.add(r);
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [programs]);

  /** Filtering + search */
  const filteredPrograms = useMemo(() => {
    const q = search.trim().toLowerCase();

    return programs
      .filter((p) =>
        retailerFilter === "all"
          ? true
          : (p.data?.retailerName || "") === retailerFilter,
      )
      .filter((p) => {
        if (!q) return true;

        const d = p.data || ({} as RetailerProgramData);

        const haystack = [
          d.programName || "",
          d.retailerName || "",
          d.programCode || "",
          p.id,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      });
  }, [programs, search, retailerFilter]);

  /** Group by retailer */
  const groupedRetailers = useMemo<RetailerGroup[]>(() => {
    const map = new Map<string, Entity<RetailerProgramData>[]>();

    for (const p of filteredPrograms) {
      const retailer = (p.data?.retailerName || "—").trim() || "—";
      const arr = map.get(retailer) ?? [];
      arr.push(p);
      map.set(retailer, arr);
    }

    return Array.from(map.entries())
      .map(([retailerName, programs]) => ({
        retailerName,
        programs: programs.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
      }))
      .sort((a, b) => a.retailerName.localeCompare(b.retailerName));
  }, [filteredPrograms]);

  /** Pagination */
  const totalPages = Math.max(1, Math.ceil(groupedRetailers.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageGroups = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return groupedRetailers.slice(start, start + pageSize);
  }, [groupedRetailers, safePage, pageSize]);

  if (page !== safePage) setPage(safePage);

  const toggleRetailer = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search retailer, program name, program code…"
            className="w-96 max-w-full px-3 py-2 border border-slate-300 rounded text-sm"
          />

          <select
            value={retailerFilter}
            onChange={(e) => {
              setRetailerFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-slate-300 rounded text-sm bg-white"
          >
            <option value="all">All retailers</option>
            {retailerOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>{filteredPrograms.length} programs</span>

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
      {groupedRetailers.length === 0 ? (
        <div className="border border-dashed border-slate-300 rounded-lg p-8 text-center">
          <p className="text-sm text-slate-500">No Retailer Programs found</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-slate-700">
                  Retailer / Program
                </th>
                <th className="text-left px-4 py-3 text-xs text-slate-700">
                  Program Code
                </th>
                <th className="text-left px-4 py-3 text-xs text-slate-700">
                  Updated
                </th>
                <th className="text-right px-4 py-3 text-xs text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            {pageGroups.map((group) => {
              const isOpen = expanded.has(group.retailerName);

              return (
                <tbody
                  key={group.retailerName}
                  className="divide-y divide-slate-200"
                >
                  {/* Retailer row */}
                  <tr
                    className="bg-slate-50 cursor-pointer"
                    onClick={() => toggleRetailer(group.retailerName)}
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        {group.retailerName}
                        <span className="text-xs text-slate-500">
                          ({group.programs.length})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600"></td>
                    <td className="px-4 py-3 text-slate-600"></td>
                    <td className="px-4 py-3 text-right">
                      {group.programs.length === 1 && (
                        <div
                          className="inline-flex items-center gap-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(group.programs[0].id);
                            }}
                            title="Edit"
                            className="text-slate-600 hover:text-slate-800"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingDeleteId(group.programs[0].id);
                            }}
                            title="Delete"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* Program rows */}
                  {isOpen &&
                    group.programs.map((p) => {
                      const d = p.data || ({} as RetailerProgramData);

                      return (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="pl-6 text-slate-900">
                              {d.programName || "—"}
                            </div>
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {d.programCode || "—"}
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {formatDate(p.updatedAt)}
                          </td>

                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center gap-3">
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
              );
            })}
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Delete Retailer Program?
            </h3>

            <p className="text-sm text-slate-600 mb-6">
              This action cannot be undone and may impact existing or future
              orders.
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
