interface ReviewStepProps {
  formData: any;
}

export function ReviewStep({ formData }: ReviewStepProps) {
  const packingShipping = formData.packingShipping || {};
  const cartonLabel = packingShipping.cartonLabelApplication || {};

  /** Routing Rules */
  const carrierMappings = formData.carrierServiceMappings || [];

  /** -----------------------------
   * Helper: Render only populated rows
   * ------------------------------ */
  const Row = ({ label, value }: { label: string; value: any }) => {
    if (value === null || value === undefined || value === "") return null;

    return (
      <div>
        <p className="text-slate-500 text-sm">{label}</p>
        <p className="text-slate-900 font-medium text-sm">{value}</p>
      </div>
    );
  };

  /** -----------------------------
   * Mock SOP Export
   * ------------------------------ */
  const handleDownloadMock = () => {
    alert(
      "📄 SOP Export (Mock)\n\nThis would generate a printable warehouse instruction sheet (English + Spanish).",
    );
  };

  /** -----------------------------
   * Operator Preview (Mock)
   * ------------------------------ */
  const operatorPreviewEn = [
    packingShipping.gs1LabelRequired ? "GS1 carton label required." : null,
    cartonLabel.side
      ? `Label side: ${
          (
            {
              "long-side": "Longest Side (Primary Panel)",
              "short-side": "Shortest Side (End Panel)",
              top: "Top Surface",
              "largest-flat": "Largest Flat Side",
            } as Record<string, string>
          )[cartonLabel.side] || cartonLabel.side
        }`
      : null,
    cartonLabel.position
      ? `Position: ${
          (
            {
              "lower-right": "Lower Right Corner",
              "lower-left": "Lower Left Corner",
              "upper-right": "Upper Right Corner",
              centered: "Centered",
            } as Record<string, string>
          )[cartonLabel.position] || cartonLabel.position
        }`
      : null,
    packingShipping.palletSlipSheetsRequired
      ? "Slip sheets required for mixed pallets."
      : null,
    // Always-required instruction for mixed pallets
    "On mixed pallets, group same-SKU cartons together by layer.",
    packingShipping.packingSlipRequired && packingShipping.packingSlipPlacement
      ? `Packing slip: ${
          (
            {
              "lead-carton-pouch":
                "Removable pouch attached to lead carton only",
              "each-carton-pouch": "Removable pouch attached to each carton",
              "inside-carton": "Packing slip placed inside carton",
            } as Record<string, string>
          )[packingShipping.packingSlipPlacement] ||
          packingShipping.packingSlipPlacement
        }`
      : null,
    formData.packingSlipContentScope
      ? (
          {
            "unit-specific":
              "Each handling unit includes a packing slip listing only the items physically contained in that specific handling unit.",
            master:
              "Each handling unit includes a packing slip listing all items on the purchase order, even if some items are not physically contained in that unit.",
          } as Record<string, string>
        )[formData.packingSlipContentScope] || null
      : null,
  ].filter(Boolean);

  const operatorPreviewEs = [
    packingShipping.gs1LabelRequired
      ? "Se requiere etiqueta GS1 en la caja."
      : null,
    cartonLabel.side
      ? `Lado de etiqueta: ${
          (
            {
              "long-side": "Lado más largo (Panel primario)",
              "short-side": "Lado más corto (Panel final)",
              top: "Superficie superior",
              "largest-flat": "Lado plano más grande",
            } as Record<string, string>
          )[cartonLabel.side] || cartonLabel.side
        }`
      : null,
    cartonLabel.position
      ? `Posición: ${
          (
            {
              "lower-right": "Esquina inferior derecha",
              "lower-left": "Esquina inferior izquierda",
              "upper-right": "Esquina superior derecha",
              centered: "Centrado",
            } as Record<string, string>
          )[cartonLabel.position] || cartonLabel.position
        }`
      : null,
    packingShipping.palletSlipSheetsRequired
      ? "Se requieren separadores en tarimas mixtas."
      : null,
    // Instrucción siempre requerida para tarimas mixtas
    "En tarimas mixtas, agrupa cajas del mismo SKU por capa.",
    packingShipping.packingSlipRequired && packingShipping.packingSlipPlacement
      ? `Lista de empaque: ${
          (
            {
              "lead-carton-pouch":
                "Funda removible en la caja principal únicamente",
              "each-carton-pouch": "Funda removible en cada caja",
              "inside-carton": "Lista de empaque dentro de la caja",
            } as Record<string, string>
          )[packingShipping.packingSlipPlacement] ||
          packingShipping.packingSlipPlacement
        }`
      : null,
    formData.packingSlipContentScope
      ? (
          {
            "unit-specific":
              "Cada unidad incluye una lista de empaque que lista únicamente los artículos físicamente contenidos en esa unidad específica.",
            master:
              "Cada unidad incluye una lista de empaque que lista todos los artículos de la orden de compra, aunque algunos no estén físicamente contenidos en esa unidad.",
          } as Record<string, string>
        )[formData.packingSlipContentScope] || null
      : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* ----------------------------- */}
      {/* Program Identity */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-2">Review Retailer Program</h2>
        <p className="text-sm text-slate-600 mb-6">
          Confirm all compliance requirements before saving.
        </p>

        <div className="grid grid-cols-2 gap-6">
          <Row label="Retailer" value={formData.retailerName} />
          <Row label="Program Name" value={formData.programName} />
          <Row label="Program Code" value={formData.programCode} />
          <Row
            label="Program Type"
            value={
              (
                {
                  b2b: "B2B",
                  dropship: "Dropship",
                } as Record<string, string>
              )[formData.programType] || formData.programType
            }
          />
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Carton Requirements */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-md font-semibold text-slate-900 mb-4">
          Carton Requirements
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <Row
            label="Carton Max Weight"
            value={
              packingShipping.cartonMaxWeightLb
                ? `${packingShipping.cartonMaxWeightLb} lbs`
                : null
            }
          />
          <Row
            label="Allow Mixed SKUs"
            value={packingShipping.allowMixedSkus ? "Yes" : null}
          />
          <Row
            label="Min Dimensions"
            value={packingShipping.cartonMinDimensions}
          />
          <Row
            label="Max Dimensions"
            value={packingShipping.cartonMaxDimensions}
          />
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Carton Label Rules */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-md font-semibold text-slate-900 mb-4">
          Carton Label Application Rules
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <Row
            label="GS1 Label Required"
            value={packingShipping.gs1LabelRequired ? "Yes" : "No"}
          />
          <Row
            label="Label Side"
            value={
              (
                {
                  "long-side": "Longest Side (Primary Panel)",
                  "short-side": "Shortest Side (End Panel)",
                  top: "Top Surface",
                  "largest-flat": "Largest Flat Side",
                } as Record<string, string>
              )[cartonLabel.side || ""] || cartonLabel.side
            }
          />
          <Row
            label="Label Position"
            value={
              (
                {
                  "lower-right": "Lower Right Corner",
                  "lower-left": "Lower Left Corner",
                  "upper-right": "Upper Right Corner",
                  centered: "Centered",
                } as Record<string, string>
              )[cartonLabel.position || ""] || cartonLabel.position
            }
          />
          <Row
            label="Two Adjacent Sides"
            value={cartonLabel.requiresTwoSides ? "Yes" : null}
          />
          <Row
            label="Avoid Seams/Edges"
            value={cartonLabel.avoidSeamsAndCorners ? "Yes" : null}
          />
          <Row
            label="Min Edge Distance"
            value={
              cartonLabel.minEdgeDistanceInches
                ? `${cartonLabel.minEdgeDistanceInches} inches`
                : null
            }
          />
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Parcel Requirements */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-md font-semibold text-slate-900 mb-4">
          Parcel Requirements
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <Row
            label="Max Cartons per Shipment"
            value={packingShipping.parcelMaxCartons}
          />
          <Row
            label="Max Parcel Weight"
            value={
              packingShipping.parcelMaxWeightLb
                ? `${packingShipping.parcelMaxWeightLb} lbs`
                : null
            }
          />
          <Row
            label="ASN Load ID Required"
            value={packingShipping.parcelAsnRequiresLoadId ? "Yes" : null}
          />
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Packing Slip Rules */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-md font-semibold text-slate-900 mb-4">
          Packing Slip & Documentation
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <Row
            label="Packing Slip Required"
            value={packingShipping.packingSlipRequired ? "Yes" : "No"}
          />
          {/* Packing Slip Content Scope */}
          <Row
            label="Packing Slip Content per Handling Unit"
            value={
              (
                {
                  "unit-specific": "Each unit lists only items it contains",
                  master: "Each unit lists all PO items (master slip)",
                } as Record<string, string>
              )[formData.packingSlipContentScope || ""] || null
            }
          />
          {packingShipping.packingSlipRequired && (
            <Row
              label="Packing Slip Placement"
              value={
                (
                  {
                    "lead-carton-pouch":
                      "Removable pouch attached to lead carton only",
                    "each-carton-pouch":
                      "Removable pouch attached to each carton",
                    "inside-carton": "Packing slip placed inside carton",
                  } as Record<string, string>
                )[packingShipping.packingSlipPlacement || ""] ||
                packingShipping.packingSlipPlacement
              }
            />
          )}
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Pallet Requirements */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-md font-semibold text-slate-900 mb-4">
          Pallet Requirements (B2B)
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <Row
            label="Pallet Max Height"
            value={
              packingShipping.palletMaxHeightIn
                ? `${packingShipping.palletMaxHeightIn} in`
                : null
            }
          />
          <Row
            label="Pallet Max Weight"
            value={
              packingShipping.palletMaxWeightLb
                ? `${packingShipping.palletMaxWeightLb} lbs`
                : null
            }
          />
          <Row
            label="PO Consolidation Allowed"
            value={
              (
                {
                  no: "No — Do not mix POs",
                  yes: "Yes — PO mixing allowed",
                  conditional: "Allowed only with slip sheets",
                } as Record<string, string>
              )[packingShipping.palletPoConsolidationAllowed || ""] ||
              packingShipping.palletPoConsolidationAllowed
            }
          />
          <Row
            label="SKU Mixing Rule"
            value={
              (
                {
                  "single-sku-only": "Single SKU per pallet only",
                  "mixed-allowed": "Mixed SKUs allowed",
                  "mixed-only-if-needed":
                    "Mixed SKUs allowed only when quantities require",
                } as Record<string, string>
              )[packingShipping.palletSkuMixingRule || ""] ||
              packingShipping.palletSkuMixingRule
            }
          />
          <Row
            label="Slip Sheets Required"
            value={packingShipping.palletSlipSheetsRequired ? "Yes" : null}
          />
          <Row
            label="Pallet Grade Requirement"
            value={
              (
                {
                  standard_48x40: "Standard 48x40 White Wood Pallet",
                  grade_b_plus: "Grade B (GMA Grade 2) or Higher",
                  grade_a: "Grade A Required",
                  ispm15: "Heat-Treated ISPM-15 Export",
                  chep_peco: "CHEP / PECO Pool Required",
                  custom: "Other / Custom Specification",
                } as Record<string, string>
              )[packingShipping.palletGradeRequirement || ""] ||
              packingShipping.palletGradeRequirement
            }
          />

          {/* Pallet Label Placement Summary */}
          {packingShipping.palletLabelPlacement && (
            <>
              <Row
                label="Pallet Labels Applied To Sides"
                value={
                  (
                    {
                      "lead-side-only": "Lead Side Only",
                      "two-opposite": "Two Opposite Sides",
                      "four-sides": "All Four Sides",
                    } as Record<string, string>
                  )[packingShipping.palletLabelPlacement.sides || ""] ||
                  packingShipping.palletLabelPlacement.sides
                }
              />
              <Row
                label="Pallet Label Position"
                value={
                  (
                    {
                      "lower-right": "Lower Right Corner",
                      "upper-right": "Upper Right Corner",
                      centered: "Centered",
                    } as Record<string, string>
                  )[packingShipping.palletLabelPlacement.position || ""] ||
                  packingShipping.palletLabelPlacement.position
                }
              />
            </>
          )}
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Routing Rules Summary ✅ */}
      {/* ----------------------------- */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-md font-semibold text-slate-900 mb-4">
          Routing Rules (Carrier Mappings)
        </h3>

        {carrierMappings.length > 0 ? (
          <div className="overflow-hidden border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {/* ✅ SCAC FIRST */}
                  <th className="text-left px-4 py-2">Carrier Alpha / SCAC</th>

                  <th className="text-left px-4 py-2">Retailer Routing</th>

                  <th className="text-left px-4 py-2">Service Level Code</th>

                  <th className="text-left px-4 py-2">
                    ShipBob Carrier Service
                  </th>
                </tr>
              </thead>

              <tbody>
                {carrierMappings.map((m: any, idx: number) => (
                  <tr key={idx} className="border-t border-slate-200">
                    {/* ✅ SCAC VALUE FIRST */}
                    <td className="px-4 py-2">{m.carrierAlphaCode || "—"}</td>

                    <td className="px-4 py-2">{m.carrierRouting || "—"}</td>

                    <td className="px-4 py-2">{m.serviceLevelCode || "—"}</td>

                    <td className="px-4 py-2">
                      {m.shipbobCarrierService
                        ? m.shipbobCarrierService
                            .replace(/_/g, " ")
                            .toUpperCase()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">
            No routing rules have been configured yet.
          </p>
        )}
      </div>

      {/* ----------------------------- */}
      {/* Additional Notes */}
      {/* ----------------------------- */}
      {packingShipping.additionalNotes && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-md font-semibold text-slate-900 mb-2">
            Additional Notes
          </h3>
          <p className="text-sm text-slate-700 whitespace-pre-line">
            {packingShipping.additionalNotes}
          </p>
        </div>
      )}

      {/* ----------------------------- */}
      {/* Operator Preview */}
      {/* ----------------------------- */}
      <div className="bg-slate-900 text-white rounded-lg p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Operator Instruction Preview (Mock)</h3>

          <button
            onClick={handleDownloadMock}
            className="px-3 py-2 text-xs bg-white text-slate-900 rounded hover:bg-slate-100"
          >
            Download SOP (Mock)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">English</h4>
            <ul className="space-y-2">
              {operatorPreviewEn.map((line, idx) => (
                <li key={idx}>• {line}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Español</h4>
            <ul className="space-y-2">
              {operatorPreviewEs.map((line, idx) => (
                <li key={idx}>• {line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 px-1">
        Once saved, these rules apply to all open and future orders under this
        Retailer Program.
      </p>
    </div>
  );
}
