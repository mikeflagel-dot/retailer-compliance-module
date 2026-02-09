interface PackingShippingStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function PackingShippingStep({
  formData,
  updateFormData,
}: PackingShippingStepProps) {
  /** -----------------------------
   * Ensure packingShipping always exists
   * ------------------------------ */
  const packingShipping = formData.packingShipping || {};

  /** -----------------------------
   * Helper: Update Nested Packing Rules
   * ------------------------------ */
  const updatePackingShipping = (updates: any) => {
    updateFormData({
      packingShipping: {
        ...packingShipping,
        ...updates,
      },
    });
  };

  /** -----------------------------
   * Program Type Shortcut
   * ------------------------------ */
  const programType = formData.programType;

  const checkboxClass =
    "h-4 w-4 rounded border border-slate-300 bg-white appearance-none checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      {/* ----------------------------- */}
      {/* Carton Requirements */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">Carton Requirements</h2>
        <p className="text-sm text-slate-600 mb-6">
          Define carton-level packing rules such as weight limits, dimensions,
          and SKU mixing.
        </p>

        <div className="space-y-5">
          {/* Max Weight */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Carton Max Weight (lbs)
            </label>
            <input
              type="number"
              value={packingShipping.cartonMaxWeightLb || ""}
              onChange={(e) =>
                updatePackingShipping({
                  cartonMaxWeightLb: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              placeholder="e.g., 50"
            />
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Minimum Dimensions (L x W x H)
              </label>
              <input
                type="text"
                value={packingShipping.cartonMinDimensions || ""}
                onChange={(e) =>
                  updatePackingShipping({
                    cartonMinDimensions: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder='e.g., 12" x 10" x 6"'
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Maximum Dimensions (L x W x H)
              </label>
              <input
                type="text"
                value={packingShipping.cartonMaxDimensions || ""}
                onChange={(e) =>
                  updatePackingShipping({
                    cartonMaxDimensions: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder='e.g., 30" x 20" x 20"'
              />
            </div>
          </div>

          {/* Mixed SKU Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={packingShipping.allowMixedSkus || false}
              onChange={(e) =>
                updatePackingShipping({
                  allowMixedSkus: e.target.checked,
                })
              }
              className={checkboxClass}
            />
            <label className="text-sm text-slate-700">
              Allow Mixed SKUs in Carton
            </label>
          </div>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Parcel Requirements */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">Parcel Requirements</h2>
        <p className="text-sm text-slate-600 mb-6">
          Define small-package shipment limits and packing slip placement rules.
        </p>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Max Cartons */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Max Cartons per Parcel Shipment
              </label>
              <input
                type="number"
                value={packingShipping.parcelMaxCartons || ""}
                onChange={(e) =>
                  updatePackingShipping({
                    parcelMaxCartons: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder="e.g., 5"
              />
            </div>

            {/* Max Weight */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Max Parcel Shipment Weight (lbs)
              </label>
              <input
                type="number"
                value={packingShipping.parcelMaxWeightLb || ""}
                onChange={(e) =>
                  updatePackingShipping({
                    parcelMaxWeightLb: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder="e.g., 150"
              />
            </div>
          </div>

          {/* ASN Load ID */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={packingShipping.parcelAsnRequiresLoadId || false}
              onChange={(e) =>
                updatePackingShipping({
                  parcelAsnRequiresLoadId: e.target.checked,
                })
              }
              className={checkboxClass}
            />
            <label className="text-sm text-slate-700">
              Load ID Required in ASN
            </label>
          </div>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Pallet Requirements (B2B ONLY) */}
      {/* ----------------------------- */}
      {programType === "b2b" && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg text-slate-900 mb-1">Pallet Requirements</h2>
          <p className="text-sm text-slate-600 mb-6">
            Freight pallet constraints such as max height, max weight, PO
            mixing, SKU mixing, and label requirements (B2B only).
          </p>

          <div className="space-y-5">
            {/* Max Height + Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Pallet Max Height (in)
                </label>
                <input
                  type="number"
                  value={packingShipping.palletMaxHeightIn || ""}
                  onChange={(e) =>
                    updatePackingShipping({
                      palletMaxHeightIn: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Pallet Max Weight (lbs)
                </label>
                <input
                  type="number"
                  value={packingShipping.palletMaxWeightLb || ""}
                  onChange={(e) =>
                    updatePackingShipping({
                      palletMaxWeightLb: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            </div>

            {/* PO Consolidation */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Consolidation of POs on a Pallet Allowed?
              </label>

              <select
                value={packingShipping.palletPoConsolidationAllowed || ""}
                onChange={(e) =>
                  updatePackingShipping({
                    palletPoConsolidationAllowed: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
              >
                <option value="">Select...</option>
                <option value="no">No — Do not mix POs</option>
                <option value="yes">Yes — PO mixing allowed</option>
                <option value="conditional">
                  Allowed only with slip sheets
                </option>
              </select>
            </div>

            {/* Pallet SKU Mixing Rules */}
            <div className="border-t border-slate-200 pt-5 space-y-4">
              <h3 className="text-sm font-medium text-slate-900">
                Pallet SKU Mixing Rules
              </h3>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Mixed SKUs Allowed on a Pallet?
                </label>

                <select
                  value={packingShipping.palletSkuMixingRule || ""}
                  onChange={(e) =>
                    updatePackingShipping({
                      palletSkuMixingRule: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                >
                  <option value="">Select...</option>
                  <option value="single-sku-only">
                    Single SKU per pallet only
                  </option>
                  <option value="mixed-allowed">Mixed SKUs allowed</option>
                  <option value="mixed-only-if-needed">
                    Mixed SKUs allowed only when quantities require
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={packingShipping.palletGroupSkuByLayer || false}
                  onChange={(e) =>
                    updatePackingShipping({
                      palletGroupSkuByLayer: e.target.checked,
                    })
                  }
                  className={checkboxClass}
                />
                <label className="text-sm text-slate-700">
                  Group same-SKU cartons together by layer on mixed pallets
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={packingShipping.limitSkuToOneMixedPallet || false}
                  onChange={(e) =>
                    updatePackingShipping({
                      limitSkuToOneMixedPallet: e.target.checked,
                    })
                  }
                  className={checkboxClass}
                />
                <label className="text-sm text-slate-700">
                  Each SKU may appear on only one mixed pallet per PO
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    packingShipping.palletDisallowMixedExpirationDates || false
                  }
                  onChange={(e) =>
                    updatePackingShipping({
                      palletDisallowMixedExpirationDates: e.target.checked,
                    })
                  }
                  className={checkboxClass}
                />
                <label className="text-sm text-slate-700">
                  Do not mix multiple expiration dates for the same SKU on a
                  pallet
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={packingShipping.palletSlipSheetsRequired || false}
                  onChange={(e) =>
                    updatePackingShipping({
                      palletSlipSheetsRequired: e.target.checked,
                    })
                  }
                  className={checkboxClass}
                />
                <label className="text-sm text-slate-700">
                  Require slip sheets between SKUs when pallets are mixed
                </label>
              </div>
            </div>

            {/* Pallet Grade Requirement */}
            <div className="border-t border-slate-200 pt-5">
              <label className="block text-sm text-slate-700 mb-2">
                Pallet Grade Requirement
              </label>

              <select
                value={packingShipping.palletGradeRequirement || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  updatePackingShipping({
                    palletGradeRequirement: value,
                    ...(value !== "custom"
                      ? { palletGradeCustomNotes: "" }
                      : {}),
                  });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
              >
                <option value="">Select...</option>
                <option value="standard_48x40">
                  Standard 48x40 White Wood Pallet
                </option>
                <option value="grade_b_plus">
                  Grade B (GMA Grade 2) or Higher
                </option>
                <option value="grade_a">Grade A Required</option>
                <option value="ispm15">Heat-Treated ISPM-15 Export</option>
                <option value="chep_peco">CHEP / PECO Pool Required</option>
                <option value="custom">Other / Custom Specification</option>
              </select>

              {packingShipping.palletGradeRequirement === "custom" && (
                <input
                  type="text"
                  value={packingShipping.palletGradeCustomNotes || ""}
                  onChange={(e) =>
                    updatePackingShipping({
                      palletGradeCustomNotes: e.target.value,
                    })
                  }
                  className="mt-3 w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  placeholder="Enter custom pallet notes..."
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dropship Helper */}
      {programType === "dropship" && (
        <p className="text-xs text-slate-500 px-1">
          Pallet requirements are hidden because Dropship programs typically
          ship via parcel only.
        </p>
      )}

      {/* ----------------------------- */}
      {/* Additional Notes */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">Additional Notes</h2>
        <p className="text-sm text-slate-600 mb-6">
          Optional freeform instructions that cannot be captured as structured
          rules.
        </p>

        <textarea
          value={packingShipping.additionalNotes || ""}
          onChange={(e) =>
            updatePackingShipping({
              additionalNotes: e.target.value,
            })
          }
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
          rows={4}
          placeholder="Enter retailer-specific packing instructions..."
        />
      </div>
    </div>
  );
}
