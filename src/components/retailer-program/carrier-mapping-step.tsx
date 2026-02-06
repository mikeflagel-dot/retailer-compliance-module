import { useState } from "react";

interface CarrierMappingStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

/**
 * ShipBob carrier services (examples provided).
 * NOTE: values are unique even if the numeric codes overlap in examples.
 */
const SHIPBOB_CARRIER_SERVICES = [
  { value: "ups_ground_4", label: "UPS Ground - (4)" },
  { value: "ups_2nd_day_air_5", label: "UPS - 2nd Day Air (5)" },
  { value: "fedex_ground_5", label: "FedEx - Ground (5)" },
  { value: "fedex_2day_49", label: "FedEx - 2Day (49)" },
];

function isNonEmpty(v: any) {
  return (v ?? "").toString().trim().length > 0;
}

const EMPTY_RULE = {
  carrierRouting: "",
  carrierAlphaCode: "",
  serviceLevelCode: "",
  shipbobCarrierService: "",
};

export function CarrierMappingStep({
  formData,
  updateFormData,
}: CarrierMappingStepProps) {
  const mappings = (formData.carrierServiceMappings || []) as any[];

  const [draftRule, setDraftRule] = useState<any | null>(null);

  const updateSavedMapping = (index: number, patch: any) => {
    const updated = [...mappings];
    updated[index] = { ...updated[index], ...patch };
    updateFormData({ carrierServiceMappings: updated });
  };

  const removeMapping = (index: number) => {
    const updated = [...mappings];
    updated.splice(index, 1);
    updateFormData({ carrierServiceMappings: updated });
  };

  const startAddMapping = () => {
    setDraftRule({ ...EMPTY_RULE });
  };

  const cancelDraft = () => {
    setDraftRule(null);
  };

  const saveDraft = () => {
    if (!draftRule) return;

    updateFormData({
      carrierServiceMappings: [...mappings, draftRule],
    });

    setDraftRule(null);
  };

  const renderRuleFields = (
    rule: any,
    onChange: (patch: any) => void
  ) => {
    const carrierRouting = rule.carrierRouting ?? "";
    const carrierAlphaCode = rule.carrierAlphaCode ?? "";
    const serviceLevelCode = rule.serviceLevelCode ?? "";
    const shipbobCarrierService = rule.shipbobCarrierService ?? "";

    const hasAnyIdentifier =
      isNonEmpty(carrierRouting) ||
      isNonEmpty(carrierAlphaCode) ||
      isNonEmpty(serviceLevelCode);

    return (
      <>
        <div className="grid grid-cols-3 gap-3">
          {/* Carrier Routing */}
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Carrier Routing
            </label>
            <input
              type="text"
              value={carrierRouting}
              onChange={(e) => {
                const next = e.target.value;
                const nextHasAny =
                  isNonEmpty(next) ||
                  isNonEmpty(carrierAlphaCode) ||
                  isNonEmpty(serviceLevelCode);

                onChange({
                  carrierRouting: next,
                  ...(nextHasAny ? {} : { shipbobCarrierService: "" }),
                });
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
              placeholder="Optional"
            />
          </div>

          {/* Carrier Alpha Code */}
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Carrier Alpha Code
            </label>
            <input
              type="text"
              value={carrierAlphaCode}
              onChange={(e) => {
                const next = e.target.value;
                const nextHasAny =
                  isNonEmpty(carrierRouting) ||
                  isNonEmpty(next) ||
                  isNonEmpty(serviceLevelCode);

                onChange({
                  carrierAlphaCode: next,
                  ...(nextHasAny ? {} : { shipbobCarrierService: "" }),
                });
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
              placeholder="Optional"
            />
          </div>

          {/* Service Level Code */}
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Service Level Code
            </label>
            <input
              type="text"
              value={serviceLevelCode}
              onChange={(e) => {
                const next = e.target.value;
                const nextHasAny =
                  isNonEmpty(carrierRouting) ||
                  isNonEmpty(carrierAlphaCode) ||
                  isNonEmpty(next);

                onChange({
                  serviceLevelCode: next,
                  ...(nextHasAny ? {} : { shipbobCarrierService: "" }),
                });
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* ShipBob Carrier Service */}
        <div className="grid grid-cols-1 gap-2">
          <label className="block text-xs text-slate-600">
            ShipBob Carrier Service{" "}
            <span className="text-slate-400">(required to map)</span>
          </label>

          <select
            value={shipbobCarrierService}
            onChange={(e) => {
              const next = e.target.value;
              if (!hasAnyIdentifier && next) return;
              onChange({ shipbobCarrierService: next });
            }}
            disabled={!hasAnyIdentifier}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">
              {hasAnyIdentifier
                ? "Select ShipBob service..."
                : "Enter at least one identifier to map"}
            </option>
            {SHIPBOB_CARRIER_SERVICES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {!hasAnyIdentifier && (
            <p className="text-xs text-slate-500">
              Add at least one identifier to enable service selection.
            </p>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">Routing Rules</h2>
        <p className="text-sm text-slate-600 mb-6">
          Enter retailer routing identifiers and map them to a ShipBob carrier
          service.
        </p>

        <div className="space-y-4">
          {/* Saved rules */}
          {mappings.map((rule, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3"
            >
              {renderRuleFields(rule, (patch) =>
                updateSavedMapping(index, patch)
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeMapping(index)}
                  className="text-xs text-slate-500 hover:text-slate-700 hover:underline"
                >
                  Remove Rule
                </button>
              </div>
            </div>
          ))}

          {/* Draft rule */}
          {draftRule && (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
              {renderRuleFields(draftRule, (patch) =>
                setDraftRule({ ...draftRule, ...patch })
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelDraft}
                  className="text-xs text-slate-500 hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={
                    !(
                      (isNonEmpty(draftRule.carrierRouting) ||
                        isNonEmpty(draftRule.carrierAlphaCode) ||
                        isNonEmpty(draftRule.serviceLevelCode)) &&
                      isNonEmpty(draftRule.shipbobCarrierService)
                    )
                  }
                  onClick={saveDraft}
                  className="text-xs px-3 py-1 rounded bg-blue-600 text-white disabled:bg-blue-300"
                >
                  Save Rule
                </button>
              </div>
            </div>
          )}

          {/* Add rule */}
          {!draftRule && (
            <button
              type="button"
              onClick={startAddMapping}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Routing Rule
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
