interface DocumentsLabelsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

type AggregationLevel = "po" | "carton" | "pallet" | "load";

const LEVEL_LABELS: Record<AggregationLevel, string> = {
  po: "Per Purchase Order (PO)",
  carton: "Per Carton",
  pallet: "Per Pallet",
  load: "Per Load / Shipment",
};

type PackingSlipConfig = {
  aggregationLevel?: AggregationLevel | "";
  copiesRequired?: number;
};

export function DocumentsLabelsStep({
  formData,
  updateFormData,
}: DocumentsLabelsStepProps) {
  const programType = formData.programType;
  const packingShipping = formData.packingShipping || {};

  const updatePackingShipping = (patch: any) =>
    updateFormData({
      packingShipping: { ...(formData.packingShipping || {}), ...patch },
    });

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
      {/* ============================= */}
      {/* Packing Slip */}
      {/* ============================= */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">Packing Slip</h2>
        <p className="text-sm text-slate-600 mb-6">
          Configure packing slip template, copy requirements, and placement.
        </p>

        {/* Required toggle */}
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={packingShipping.packingSlipRequired || false}
            onChange={(e) =>
              updatePackingShipping({ packingSlipRequired: e.target.checked })
            }
            className="w-4 h-4 appearance-none bg-white border border-slate-300 rounded checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Packing Slip Required?</span>
        </label>

        {/* Conditionally render when required */}
        {packingShipping.packingSlipRequired && (
          <div className="space-y-5">
            {/* Template Name */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Packing Slip Template Name
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

            {/* Copy Requirements (existing behavior) */}
            <div>
              <label className="block text-sm text-slate-900 mb-2 font-bold">
                Packing Slip Copy Requirements
              </label>
              <div className="space-y-3">
                {packingSlipConfigs.map((rule, index) => {
                  const usedByOthers = packingSlipConfigs
                    .map((c, i) => (i === index ? null : c.aggregationLevel))
                    .filter(Boolean) as AggregationLevel[];

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-3 items-center bg-slate-50 border border-slate-200 rounded-lg p-3"
                    >
                      <select
                        value={rule.aggregationLevel ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const next = [...packingSlipConfigs];
                          next[index] = {
                            ...rule,
                            aggregationLevel:
                              value === "" ? "" : (value as AggregationLevel),
                          };
                          setPackingSlipConfigs(next);
                        }}
                        className="px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                      >
                        <option value="">Select level…</option>
                        {allowedLevels.map((lvl) => (
                          <option
                            key={lvl}
                            value={lvl}
                            disabled={
                              usedByOthers.includes(lvl) &&
                              rule.aggregationLevel !== lvl
                            }
                          >
                            {LEVEL_LABELS[lvl]}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min={1}
                        value={rule.copiesRequired ?? 1}
                        onChange={(e) => {
                          const next = [...packingSlipConfigs];
                          next[index] = {
                            ...rule,
                            copiesRequired: Number(e.target.value),
                          };
                          setPackingSlipConfigs(next);
                        }}
                        className="px-3 py-2 border border-slate-300 rounded text-sm"
                      />

                      <button
                        onClick={() => {
                          const next = [...packingSlipConfigs];
                          next.splice(index, 1);
                          setPackingSlipConfigs(next);
                        }}
                        className="text-xs text-slate-500 hover:underline text-right"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}

                <button
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
              </div>
            </div>

            {/* Placement */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Packing Slip Placement
              </label>
              <select
                value={packingShipping.packingSlipPlacement || ""}
                onChange={(e) =>
                  updatePackingShipping({
                    packingSlipPlacement: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
              >
                <option value="">Select...</option>
                <option value="lead-carton-pouch">
                  Removable pouch attached to lead carton only
                </option>
                <option value="each-carton-pouch">
                  Removable pouch attached to each carton
                </option>
                <option value="inside-carton">
                  Packing slip placed inside carton
                </option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ============================= */}
      {/* GS1 Carton Label */}
      {/* ============================= */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">GS1 Carton Label</h2>
        <p className="text-sm text-slate-600 mb-6">
          Configure GS1 carton label template and placement.
        </p>

        {/* Required toggle */}
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={packingShipping.gs1LabelRequired || false}
            onChange={(e) =>
              updatePackingShipping({ gs1LabelRequired: e.target.checked })
            }
            className="w-4 h-4 appearance-none bg-white border border-slate-300 rounded checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">
            GS1 Carton Label Required?
          </span>
        </label>

        {/* Dropship helper toggle (preserve behavior) */}
        {programType === "dropship" && (
          <div className="space-y-3 mb-4">
            <p className="text-xs text-slate-500">
              GS1 carton and pallet labels are typically not required for
              Dropship programs.
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.enableGs1LabelsForDropship || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  updateFormData({
                    enableGs1LabelsForDropship: checked,
                    ...(checked
                      ? {}
                      : { gs1BoxLabelName: "", gs1PalletLabelName: "" }),
                  });
                }}
                className="w-4 h-4 appearance-none bg-white border border-slate-300 rounded checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">
                Enable GS1 Labels for Dropship (Advanced)
              </span>
            </label>
          </div>
        )}

        {/* Conditionally render when required */}
        {packingShipping.gs1LabelRequired && (
          <div className="space-y-5">
            {/* Template Name */}
            {(programType === "b2b" || formData.enableGs1LabelsForDropship) && (
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  GS1 Box Label Template Name
                </label>
                <input
                  type="text"
                  value={formData.gs1BoxLabelName || ""}
                  onChange={(e) =>
                    updateFormData({ gs1BoxLabelName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            )}

            {/* Structured Carton Label Placement (existing keys) */}
            <div className="space-y-4">
              <label className="block text-sm text-slate-700">
                Carton Label Placement
              </label>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Side of Carton
                </label>
                <select
                  value={packingShipping.cartonLabelApplication?.side || ""}
                  onChange={(e) =>
                    updatePackingShipping({
                      cartonLabelApplication: {
                        ...(packingShipping.cartonLabelApplication || {}),
                        side: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                >
                  <option value="">Select...</option>
                  <option value="long-side">
                    Longest Side (Primary Panel)
                  </option>
                  <option value="short-side">Shortest Side (End Panel)</option>
                  <option value="top">Top Surface</option>
                  <option value="largest-flat">Largest Flat Side</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Position on Side
                </label>
                <select
                  value={packingShipping.cartonLabelApplication?.position || ""}
                  onChange={(e) =>
                    updatePackingShipping({
                      cartonLabelApplication: {
                        ...(packingShipping.cartonLabelApplication || {}),
                        position: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                >
                  <option value="">Select...</option>
                  <option value="lower-right">Lower Right Corner</option>
                  <option value="lower-left">Lower Left Corner</option>
                  <option value="upper-right">Upper Right Corner</option>
                  <option value="centered">Centered</option>
                </select>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    packingShipping.cartonLabelApplication?.requiresTwoSides ||
                    false
                  }
                  onChange={(e) =>
                    updatePackingShipping({
                      cartonLabelApplication: {
                        ...(packingShipping.cartonLabelApplication || {}),
                        requiresTwoSides: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 appearance-none bg-white border border-slate-300 rounded checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">
                  Apply label on two adjacent sides
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    packingShipping.cartonLabelApplication
                      ?.avoidSeamsAndCorners || false
                  }
                  onChange={(e) =>
                    updatePackingShipping({
                      cartonLabelApplication: {
                        ...(packingShipping.cartonLabelApplication || {}),
                        avoidSeamsAndCorners: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 appearance-none bg-white border border-slate-300 rounded checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">
                  Do not place label on seams or carton edges
                </span>
              </label>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Minimum Distance From Edge (inches)
                </label>
                <input
                  type="number"
                  value={
                    packingShipping.cartonLabelApplication
                      ?.minEdgeDistanceInches || ""
                  }
                  onChange={(e) =>
                    updatePackingShipping({
                      cartonLabelApplication: {
                        ...(packingShipping.cartonLabelApplication || {}),
                        minEdgeDistanceInches: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  placeholder="e.g., 1"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Many retailers require labels to be at least 1–1.25" from
                  edges.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================= */}
      {/* GS1 Pallet Label (B2B only) */}
      {/* ============================= */}
      {programType === "b2b" && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg text-slate-900 mb-1">GS1 Pallet Label</h2>
          <p className="text-sm text-slate-600 mb-6">
            Configure GS1 pallet label template and placement.
          </p>

          {/* Required toggle */}
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={packingShipping.palletLabelRequired || false}
              onChange={(e) =>
                updatePackingShipping({ palletLabelRequired: e.target.checked })
              }
              className="w-4 h-4 appearance-none bg-white border border-slate-300 rounded checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">
              GS1 Pallet Labels Required?
            </span>
          </label>

          {/* Conditionally render when required */}
          {packingShipping.palletLabelRequired && (
            <div className="space-y-5">
              {/* Template Name */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  GS1 Pallet Label Template Name
                </label>
                <input
                  type="text"
                  value={formData.gs1PalletLabelName || ""}
                  onChange={(e) =>
                    updateFormData({ gs1PalletLabelName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>

              {/* Pallet Label Placement */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Pallet Label Placement
                </label>
                <select
                  value={packingShipping.palletLabelPlacement || ""}
                  onChange={(e) =>
                    updatePackingShipping({
                      palletLabelPlacement: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                >
                  <option value="">Select...</option>
                  <option value="two-opposite-sides">
                    Labels required on 2 opposite sides
                  </option>
                  <option value="four-sides">
                    Labels required on all 4 sides
                  </option>
                  <option value="no-requirement">
                    No specific pallet label placement requirement
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
      {/* ============================= */}
      {/* Shipping Label References */}
      {/* ============================= */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Shipping Label References
        </h2>
        <p className="text-sm text-slate-600 mb-2">
          Optionally configure reference fields that appear on shipping labels.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-xs text-amber-800 mb-5">
          ⚠️ Carrier reference fields may have strict character limits (often
          ~30 characters). Keep prefixes short.
        </div>

        <div className="space-y-6">
          {/* Reference 1 */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-slate-700">
                Shipping Label Reference 1
              </label>
              {!formData.enableShippingLabelRef1 && (
                <button
                  onClick={() =>
                    updateFormData({ enableShippingLabelRef1: true })
                  }
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Add Reference 1
                </button>
              )}
            </div>

            {formData.enableShippingLabelRef1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={formData.shippingLabelRef1Prefix || ""}
                    onChange={(e) =>
                      updateFormData({
                        shippingLabelRef1Prefix: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-slate-300 rounded text-sm"
                    placeholder="Prefix"
                  />

                  <select
                    value={formData.shippingLabelRef1Value || ""}
                    onChange={(e) =>
                      updateFormData({
                        shippingLabelRef1Value: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                  >
                    <option value="">Select…</option>
                    <option value="purchaseOrderNumber">
                      Purchase Order Number
                    </option>
                    <option value="customerTicketNumber">
                      Customer Ticket Number
                    </option>
                  </select>
                </div>

                {!formData.enableShippingLabelRef2 ? (
                  <button
                    type="button"
                    onClick={() =>
                      updateFormData({
                        enableShippingLabelRef1: false,
                        shippingLabelRef1Prefix: "",
                        shippingLabelRef1Value: "",
                      })
                    }
                    className="text-xs text-slate-500 hover:underline"
                  >
                    Remove Reference 1
                  </button>
                ) : (
                  <p className="text-xs text-slate-400">
                    Remove Reference 2 before removing Reference 1.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Reference 2 */}
          {formData.enableShippingLabelRef1 && (
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-slate-700">
                  Shipping Label Reference 2
                </label>
                {!formData.enableShippingLabelRef2 && (
                  <button
                    onClick={() =>
                      updateFormData({ enableShippingLabelRef2: true })
                    }
                    className="text-xs text-blue-600 hover:underline"
                  >
                    + Add Reference 2
                  </button>
                )}
              </div>

              {formData.enableShippingLabelRef2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={formData.shippingLabelRef2Prefix || ""}
                      onChange={(e) =>
                        updateFormData({
                          shippingLabelRef2Prefix: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-slate-300 rounded text-sm"
                      placeholder="Prefix"
                    />

                    <select
                      value={formData.shippingLabelRef2Value || ""}
                      onChange={(e) =>
                        updateFormData({
                          shippingLabelRef2Value: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                    >
                      <option value="">Select…</option>
                      <option value="purchaseOrderNumber">
                        Purchase Order Number
                      </option>
                      <option value="customerTicketNumber">
                        Customer Ticket Number
                      </option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateFormData({
                        enableShippingLabelRef2: false,
                        shippingLabelRef2Prefix: "",
                        shippingLabelRef2Value: "",
                      })
                    }
                    className="text-xs text-slate-500 hover:underline"
                  >
                    Remove Reference 2
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Packing Slip copy requirements moved under Packing Slip section above */}
    </div>
  );
}
