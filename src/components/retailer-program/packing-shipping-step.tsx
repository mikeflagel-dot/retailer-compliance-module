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

  /** -----------------------------
   * Derived: Mixing SKUs dropdown value
   * ------------------------------ */
  const mixingSkusValue = !packingShipping.allowMixedSkus
    ? "not-allowed"
    : packingShipping.palletSkuMixingRule === "mixed-only-if-needed" ||
        packingShipping.limitSkuToOneMixedPallet ||
        packingShipping.palletDisallowMixedExpirationDates ||
        packingShipping.palletSlipSheetsRequired
      ? "allowed-with-restrictions"
      : "allowed-no-restrictions";

  const checkboxClass =
    "h-4 w-4 rounded border border-slate-300 bg-white appearance-none checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      {/* ----------------------------- */}
      {/* Physical Handling Constraints */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Physical Handling Constraints
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Define physical constraints such as carton weight limits and
          minimum/maximum dimensions.
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
                Carton Minimum Dimensions (in)
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
                placeholder="e.g., L x W x H"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Carton Maximum Dimensions (in)
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
                placeholder="e.g., L x W x H"
              />
            </div>
          </div>

          {/* B2B Only: Pallet Height/Weight */}
          {programType === "b2b" && (
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
                  placeholder="e.g. 75"
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
                  placeholder="e.g. 2000"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Carton label configuration omitted from this step (documentation/labels excluded) */}

      {/* ----------------------------- */}
      {/* Parcel Shipment Constraints */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Parcel Shipment Constraints
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Define physical constraints for parcel shipments.
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

          {/* ASN Load ID (Parcel) */}
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
              Load ID Required in ASN (Parcel)
            </label>
          </div>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Handling Unit Mixing Policies */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Handling Unit Mixing Policies
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Configure whether multiple purchase orders or multiple SKUs may be
          combined within the same handling unit. These are related policy
          decisions but can be set independently.
        </p>

        <div className="space-y-5">
          {/* Mixing Purchase Orders */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Mixing Purchase Orders
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
              <option value="conditional">Allowed only with slip sheets</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Controls whether multiple purchase orders may be combined within
              the same handling unit.
            </p>
          </div>

          {/* Mixing SKUs */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Mixing SKUs
            </label>
            <select
              value={mixingSkusValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "not-allowed") {
                  updatePackingShipping({
                    allowMixedSkus: false,
                    palletSkuMixingRule: "single-sku-only",
                  });
                } else if (value === "allowed-no-restrictions") {
                  updatePackingShipping({
                    allowMixedSkus: true,
                    palletSkuMixingRule: "mixed-allowed",
                  });
                } else {
                  updatePackingShipping({
                    allowMixedSkus: true,
                    palletSkuMixingRule: "mixed-only-if-needed",
                  });
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
            >
              <option value="not-allowed">
                Not allowed — Single SKU per handling unit
              </option>
              <option value="allowed-no-restrictions">
                Allowed — No restrictions
              </option>
              <option value="allowed-with-restrictions">
                Allowed with restrictions
              </option>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Controls whether multiple SKUs may be combined within the same
              handling unit.
            </p>

            {mixingSkusValue === "allowed-with-restrictions" && (
              <div className="mt-4 space-y-3">
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
                      packingShipping.palletDisallowMixedExpirationDates ||
                      false
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
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Pallet Material & Specification Requirements (B2B Only) */}
      {/* ----------------------------- */}
      {programType === "b2b" && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg text-slate-900 mb-1">
            Pallet Material & Specification Requirements (B2B Only)
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Define pallet material grade and any custom specifications.
          </p>

          <div className="space-y-5">
            {/* Pallet Grade Requirement */}
            <div>
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
                <option value="grade_b_plus">Grade B (GMA Grade 2)</option>
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
