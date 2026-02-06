interface DocumentsLabelsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

type AggregationLevel = "po" | "carton" | "pallet" | "load";

type PackingSlipConfig = {
  aggregationLevel?: "" | AggregationLevel;
  copiesRequired?: number;
};

const LEVEL_LABELS: Record<AggregationLevel, string> = {
  po: "Per Purchase Order (PO)",
  carton: "Per Carton",
  pallet: "Per Pallet",
  load: "Per Load / Shipment",
};

export function DocumentsLabelsStep({
  formData,
  updateFormData,
}: DocumentsLabelsStepProps) {
  const programType = formData.programType;

  const packingSlipConfigs: PackingSlipConfig[] =
    formData.packingSlipConfigurations || [];

  const setPackingSlipConfigs = (next: PackingSlipConfig[]) =>
    updateFormData({ packingSlipConfigurations: next });

  const allowedLevels: AggregationLevel[] =
    programType === "dropship"
      ? ["po", "carton"]
      : ["po", "carton", "pallet", "load"];

  return (
    <div className="space-y-6">
      {/* ----------------------------- */}
      {/* Document Templates */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Document Templates
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Configure packing slip and label templates.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Packing Slip Name
            </label>
            <input
              type="text"
              value={formData.packingSlipName || ""}
              onChange={(e) =>
                updateFormData({ packingSlipName: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Packing Slip Copy Requirements */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Packing Slip Copy Requirements
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Specify how many packing slip copies must be printed
          at each aggregation level.
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs font-medium text-slate-500 mb-2 px-1">
          <div>Aggregation Level</div>
          <div>Copies Required</div>
          <div className="text-right">Action</div>
        </div>

        <div className="space-y-3">
          {packingSlipConfigs.map((rule, index) => {
            const usedByOthers = packingSlipConfigs
              .map((c, i) =>
                i === index ? null : c.aggregationLevel,
              )
              .filter(Boolean) as AggregationLevel[];

            return (
              <div
                key={index}
                className="grid grid-cols-3 gap-3 items-center bg-slate-50 border border-slate-200 rounded-lg p-3"
              >
                {/* Aggregation Level */}
                <select
                  value={rule.aggregationLevel || ""}
                  onChange={(e) => {
                    const next: PackingSlipConfig[] = [
                      ...packingSlipConfigs,
                    ];

                    next[index] = {
                      ...rule,
                      aggregationLevel:
                        (e.target.value || "") as
                          | ""
                          | AggregationLevel,
                    };

                    setPackingSlipConfigs(next);
                  }}
                  className="px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                >
                  <option value="">Select level...</option>

                  {allowedLevels.map((lvl) => {
                    const disabled =
                      usedByOthers.includes(lvl) &&
                      rule.aggregationLevel !== lvl;

                    return (
                      <option
                        key={lvl}
                        value={lvl}
                        disabled={disabled}
                      >
                        {LEVEL_LABELS[lvl]}
                        {disabled ? " (Already Used)" : ""}
                      </option>
                    );
                  })}
                </select>

                {/* Copies Required */}
                <input
                  type="number"
                  min={1}
                  value={rule.copiesRequired ?? 1}
                  onChange={(e) => {
                    const next: PackingSlipConfig[] = [
                      ...packingSlipConfigs,
                    ];

                    next[index] = {
                      ...rule,
                      copiesRequired: Number(e.target.value),
                    };

                    setPackingSlipConfigs(next);
                  }}
                  className="px-3 py-2 border border-slate-300 rounded text-sm"
                />

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => {
                    const next = [...packingSlipConfigs];
                    next.splice(index, 1);
                    setPackingSlipConfigs(next);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 hover:underline text-right"
                >
                  Remove
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() =>
              setPackingSlipConfigs([
                ...packingSlipConfigs,
                { aggregationLevel: "", copiesRequired: 1 },
              ])
            }
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Packing Slip Requirement
          </button>

          {programType === "dropship" && (
            <p className="text-xs text-slate-500">
              Pallet and Load-level options are hidden for
              Dropship programs.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
