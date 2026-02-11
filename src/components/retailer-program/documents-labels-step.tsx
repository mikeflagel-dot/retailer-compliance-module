interface DocumentsLabelsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function DocumentsLabelsStep({
  formData,
  updateFormData,
}: DocumentsLabelsStepProps) {
  const programType = formData.programType;

  return (
    <div className="space-y-6">
      {/* ============================= */}
      {/* Packing Slip */}
      {/* ============================= */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">Packing Slip</h2>
        <p className="text-sm text-slate-600 mb-6">
          Configure packing slip template and content rules.
        </p>

        <div className="space-y-5">
          {/* Required? toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.packingShipping?.packingSlipRequired}
              onChange={(e) =>
                updateFormData({
                  packingShipping: {
                    ...(formData.packingShipping || {}),
                    packingSlipRequired: e.target.checked,
                  },
                })
              }
            />
            <label className="text-sm text-slate-700">Required?</label>
          </div>

          {/* Template + Placement shown only when required */}
          {!!formData.packingShipping?.packingSlipRequired && (
            <>
              {/* Template Name */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={formData.packingSlipName || ""}
                  onChange={(e) =>
                    updateFormData({ packingSlipName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  placeholder="e.g. Generic_8x11"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Placement is configured in Packing & Shipping.
                </p>
              </div>

              {/* Packing Slip Placement */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Packing Slip Placement
                </label>
                <select
                  value={formData.packingShipping?.packingSlipPlacement || ""}
                  onChange={(e) =>
                    updateFormData({
                      packingShipping: {
                        ...(formData.packingShipping || {}),
                        packingSlipPlacement: e.target.value,
                      },
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
                <p className="text-xs text-slate-500 mt-1">
                  Applies when packing slips are required.
                </p>
              </div>

              {/* Packing Slip Content per Handling Unit section remains separate in layout; no change requested */}
            </>
          )}

          {/* Packing Slip Content (When PO Spans Multiple Handling Units) */}
          {!!formData.packingShipping?.packingSlipRequired && (
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Packing Slip Content (When PO Spans Multiple Handling Units)
              </label>
              <div className="space-y-4">
                {/* Unit-specific packing slip */}
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="packingSlipContentScope"
                    value="unit-specific"
                    checked={
                      formData.packingSlipContentScope === "unit-specific"
                    }
                    onChange={(e) =>
                      updateFormData({
                        packingSlipContentScope: e.target.value,
                      })
                    }
                    className="w-4 h-4 mt-0.5 appearance-none rounded-full border border-slate-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="ml-2">
                    <span className="text-sm text-slate-700">
                      Unit-specific packing slip
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Each handling unit includes a packing slip listing only
                      the items physically contained in that specific handling
                      unit.
                    </p>
                  </div>
                </label>

                {/* Master packing slip */}
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="packingSlipContentScope"
                    value="master"
                    checked={formData.packingSlipContentScope === "master"}
                    onChange={(e) =>
                      updateFormData({
                        packingSlipContentScope: e.target.value,
                      })
                    }
                    className="w-4 h-4 mt-0.5 appearance-none rounded-full border border-slate-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="ml-2">
                    <span className="text-sm text-slate-700">
                      Master packing slip
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Each handling unit includes a packing slip listing all
                      items on the purchase order, even if some items are not
                      physically contained in that unit.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================= */}
      {/* Carton Labels */}
      {/* ============================= */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">Carton Labels</h2>
        <p className="text-sm text-slate-600 mb-6">
          Configure GS1 carton label templates and related guidance.
        </p>

        <div className="space-y-5">
          {/* Required? toggle (B2B) */}
          {programType === "b2b" && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!formData.packingShipping?.gs1LabelRequired}
                onChange={(e) =>
                  updateFormData({
                    packingShipping: {
                      ...(formData.packingShipping || {}),
                      gs1LabelRequired: e.target.checked,
                    },
                  })
                }
              />
              <label className="text-sm text-slate-700">Required?</label>
            </div>
          )}

          {/* Dropship helper + optional enable */}
          {programType === "dropship" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                GS1 carton labels are typically not required for Dropship
                programs.
              </p>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.enableGs1LabelsForDropship || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    updateFormData({
                      enableGs1LabelsForDropship: checked,
                      ...(checked ? {} : { gs1BoxLabelName: "" }),
                    });
                  }}
                />
                <span className="text-sm text-slate-700">
                  Enable GS1 Carton Labels (Advanced)
                </span>
              </label>
            </div>
          )}

          {/* Template Name */}
          {((programType === "b2b" &&
            !!formData.packingShipping?.gs1LabelRequired) ||
            formData.enableGs1LabelsForDropship) && (
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={formData.gs1BoxLabelName || ""}
                onChange={(e) =>
                  updateFormData({ gs1BoxLabelName: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                placeholder="e.g.Target"
              />
              <p className="text-xs text-slate-500 mt-1">
                Label side/position rules are configured in Packing & Shipping
                (B2B).
              </p>
            </div>
          )}

          {/* Carton Label Placement (B2B or enabled Dropship) */}
          {((programType === "b2b" &&
            !!formData.packingShipping?.gs1LabelRequired) ||
            formData.enableGs1LabelsForDropship) && (
            <div className="border-t border-slate-200 pt-5 space-y-4">
              <h3 className="text-sm font-medium text-slate-900">
                Carton Label Placement
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Label Side
                  </label>
                  <select
                    value={
                      (formData.packingShipping?.cartonLabelApplication || {})
                        .side || ""
                    }
                    onChange={(e) =>
                      updateFormData({
                        packingShipping: {
                          ...(formData.packingShipping || {}),
                          cartonLabelApplication: {
                            ...(formData.packingShipping
                              ?.cartonLabelApplication || {}),
                            side: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="long-side">
                      Longest Side (Primary Panel)
                    </option>
                    <option value="short-side">
                      Shortest Side (End Panel)
                    </option>
                    <option value="top">Top Surface</option>
                    <option value="largest-flat">Largest Flat Side</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Label Position
                  </label>
                  <select
                    value={
                      (formData.packingShipping?.cartonLabelApplication || {})
                        .position || ""
                    }
                    onChange={(e) =>
                      updateFormData({
                        packingShipping: {
                          ...(formData.packingShipping || {}),
                          cartonLabelApplication: {
                            ...(formData.packingShipping
                              ?.cartonLabelApplication || {}),
                            position: e.target.value,
                          },
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
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Minimum Edge Distance (in)
                </label>
                <input
                  type="number"
                  value={
                    (formData.packingShipping?.cartonLabelApplication || {})
                      .minEdgeDistanceInches || ""
                  }
                  onChange={(e) =>
                    updateFormData({
                      packingShipping: {
                        ...(formData.packingShipping || {}),
                        cartonLabelApplication: {
                          ...(formData.packingShipping
                            ?.cartonLabelApplication || {}),
                          minEdgeDistanceInches: Number(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  placeholder="e.g., 2"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Many retailers require labels to be at least 1–1.25" from
                  edges.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================= */}
      {/* Pallet Labels */}
      {/* ============================= */}
      {programType === "b2b" && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg text-slate-900 mb-1">Pallet Labels</h2>
          <p className="text-sm text-slate-600 mb-6">
            Configure GS1 pallet label template and related guidance.
          </p>

          <div className="space-y-5">
            {/* Required? toggle (B2B) */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!formData.packingShipping?.palletLabelRequired}
                onChange={(e) =>
                  updateFormData({
                    packingShipping: {
                      ...(formData.packingShipping || {}),
                      palletLabelRequired: e.target.checked,
                    },
                  })
                }
              />
              <label className="text-sm text-slate-700">Required?</label>
            </div>
            {!!formData.packingShipping?.palletLabelRequired && (
              <>
                {/* Template Name */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={formData.gs1PalletLabelName || ""}
                    onChange={(e) =>
                      updateFormData({ gs1PalletLabelName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                    placeholder="e.g. Target_Pallet"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Placement rules are configured in Packing & Shipping (B2B).
                  </p>
                </div>

                {/* Pallet Label Placement */}
                <div className="border-t border-slate-200 pt-5 space-y-6">
                  <h3 className="text-sm font-medium text-slate-900">
                    Pallet Label Placement
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">
                        Labels Applied To
                      </label>
                      <select
                        value={
                          (formData.packingShipping?.palletLabelPlacement || {})
                            .sides || ""
                        }
                        onChange={(e) =>
                          updateFormData({
                            packingShipping: {
                              ...(formData.packingShipping || {}),
                              palletLabelPlacement: {
                                ...(formData.packingShipping
                                  ?.palletLabelPlacement || {}),
                                sides: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                      >
                        <option value="">Select...</option>
                        <option value="lead-side-only">Lead side only</option>
                        <option value="two-adjacent">Two adjacent sides</option>
                        <option value="two-opposite">Two opposite sides</option>
                        <option value="four-sides">All four sides</option>
                        <option value="forklift-entry">
                          Forklift entry sides
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-700 mb-2">
                        Primary Label Position
                      </label>
                      <select
                        value={
                          (formData.packingShipping?.palletLabelPlacement || {})
                            .position || ""
                        }
                        onChange={(e) =>
                          updateFormData({
                            packingShipping: {
                              ...(formData.packingShipping || {}),
                              palletLabelPlacement: {
                                ...(formData.packingShipping
                                  ?.palletLabelPlacement || {}),
                                position: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                      >
                        <option value="">Select...</option>
                        <option value="upper-right">Upper right corner</option>
                        <option value="upper-left">Upper left corner</option>
                        <option value="top-center">Top center</option>
                        <option value="centered">Centered</option>
                        <option value="midway-up-load">Midway up load</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">
                        Vertical Placement Height
                      </label>
                      <select
                        value={
                          (formData.packingShipping?.palletLabelPlacement || {})
                            .verticalPlacementHeight || ""
                        }
                        onChange={(e) =>
                          updateFormData({
                            packingShipping: {
                              ...(formData.packingShipping || {}),
                              palletLabelPlacement: {
                                ...(formData.packingShipping
                                  ?.palletLabelPlacement || {}),
                                verticalPlacementHeight: e.target.value,
                                ...(e.target.value !== "custom"
                                  ? { customHeightInches: undefined }
                                  : {}),
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                      >
                        <option value="">Select...</option>
                        <option value="top-third">Top third of pallet</option>
                        <option value="middle">Middle of pallet load</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    {(formData.packingShipping?.palletLabelPlacement || {})
                      .verticalPlacementHeight === "custom" && (
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">
                          Custom Height (inches)
                        </label>
                        <input
                          type="number"
                          value={
                            (
                              formData.packingShipping?.palletLabelPlacement ||
                              {}
                            ).customHeightInches ?? ""
                          }
                          onChange={(e) =>
                            updateFormData({
                              packingShipping: {
                                ...(formData.packingShipping || {}),
                                palletLabelPlacement: {
                                  ...(formData.packingShipping
                                    ?.palletLabelPlacement || {}),
                                  customHeightInches: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                          placeholder="e.g., 24"
                        />
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200 pt-5 space-y-3">
                    <h4 className="text-sm font-medium text-slate-900">
                      Additional Placement Constraints
                    </h4>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          (formData.packingShipping?.palletLabelPlacement || {})
                            .placeOnShrinkWrap || false
                        }
                        onChange={(e) =>
                          updateFormData({
                            packingShipping: {
                              ...(formData.packingShipping || {}),
                              palletLabelPlacement: {
                                ...(formData.packingShipping
                                  ?.palletLabelPlacement || {}),
                                placeOnShrinkWrap: e.target.checked,
                              },
                            },
                          })
                        }
                        className="h-4 w-4 rounded border border-slate-300 bg-white appearance-none checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">
                        Place label on shrink wrap
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          (formData.packingShipping?.palletLabelPlacement || {})
                            .avoidSeamsAndCorners || false
                        }
                        onChange={(e) =>
                          updateFormData({
                            packingShipping: {
                              ...(formData.packingShipping || {}),
                              palletLabelPlacement: {
                                ...(formData.packingShipping
                                  ?.palletLabelPlacement || {}),
                                avoidSeamsAndCorners: e.target.checked,
                              },
                            },
                          })
                        }
                        className="h-4 w-4 rounded border border-slate-300 bg-white appearance-none checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">
                        Avoid seams and corners
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          (formData.packingShipping?.palletLabelPlacement || {})
                            .mustFaceRearOfTrailer || false
                        }
                        onChange={(e) =>
                          updateFormData({
                            packingShipping: {
                              ...(formData.packingShipping || {}),
                              palletLabelPlacement: {
                                ...(formData.packingShipping
                                  ?.palletLabelPlacement || {}),
                                mustFaceRearOfTrailer: e.target.checked,
                              },
                            },
                          })
                        }
                        className="h-4 w-4 rounded border border-slate-300 bg-white appearance-none checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">
                        Must face rear of trailer
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
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
                      updateFormData({ shippingLabelRef1Value: e.target.value })
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
    </div>
  );
}
