export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col">
      <div className="px-4 py-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-700 rounded" aria-hidden />
        <div>
          <div className="text-sm font-semibold">ShipBob Toolbob</div>
        </div>
      </div>

      <div className="px-2 py-3 space-y-1">
        <div className="flex items-center gap-2 px-3 py-2 rounded text-slate-300">
          <div className="w-4 h-4 bg-slate-700 rounded" aria-hidden />
          <span className="text-sm">Batch</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded text-slate-300">
          <div className="w-4 h-4 bg-slate-700 rounded" aria-hidden />
          <span className="text-sm">Outbound</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded text-slate-300">
          <div className="w-4 h-4 bg-slate-700 rounded" aria-hidden />
          <span className="text-sm">VAS</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded text-slate-300">
          <div className="w-4 h-4 bg-slate-700 rounded" aria-hidden />
          <span className="text-sm">Inbound</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded text-slate-300">
          <div className="w-4 h-4 bg-slate-700 rounded" aria-hidden />
          <span className="text-sm">Inventory</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded text-slate-300">
          <div className="w-4 h-4 bg-slate-700 rounded" aria-hidden />
          <span className="text-sm">Reports</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded text-slate-300">
          <div className="w-4 h-4 bg-slate-700 rounded" aria-hidden />
          <span className="text-sm">Tools</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded text-slate-300">
          <div className="w-4 h-4 bg-slate-700 rounded" aria-hidden />
          <span className="text-sm">User Management</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded bg-slate-800">
          <div className="w-4 h-4 bg-slate-700 rounded" aria-hidden />
          <span className="text-sm">Compliance</span>
        </div>
      </div>

      <div className="mt-auto px-4 py-3 text-xs text-slate-500 border-t border-slate-800">
        Logout
      </div>
    </aside>
  );
}
