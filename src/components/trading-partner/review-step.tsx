interface ReviewStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onActivate: () => void;
}

const REQUIRED_FIELDS = [
  { key: "retailer", label: "Retailer" },
  { key: "merchant", label: "Merchant" },
  { key: "tradingPartnerId", label: "Trading Partner ID" },
  { key: "fulfillmentMode", label: "Fulfillment Mode" },
  { key: "shippingPaymentTerms", label: "Shipping Payment Terms" },
];

function ReviewRow({
  label,
  value,
  required,
}: {
  label: string;
  value: any;
  required?: boolean;
}) {
  const isMissing = required && (!value || value === "");

  return (
    <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
      <span className="text-slate-600">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>

      <span
        className={`font-medium ${
          isMissing ? "text-red-600" : "text-slate-900"
        }`}
      >
        {isMissing ? "Required" : value}
      </span>
    </div>
  );
}

/** ✅ MUST be exported like this */
export function ReviewStep({ formData, onActivate }: ReviewStepProps) {
  /** -----------------------------
   * Validation
   * ------------------------------ */
  const missingFields = REQUIRED_FIELDS.filter(
    (field) => !formData[field.key] || formData[field.key] === ""
  );

  const overridesMissing =
    formData.overridesEnabled && !formData.overrideOption;

  const isValid = missingFields.length === 0 && !overridesMissing;

  const carrierAccounts = formData.carrierAccounts || [];
  const requiresBilling =
    formData.shippingPaymentTerms !== "ShipBob Prepaid";

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Review & Activate
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Confirm the configuration before activating this Trading Partner.
        </p>
      </div>

      {/* Warning Banner */}
      {!isValid && (
        <div className="border border-red-200 bg-red-50 rounded-lg p-4">
          <p className="text-sm font-medium text-red-700">
            Missing required fields
          </p>

          <ul className="mt-2 text-sm text-red-600 list-disc ml-5 space-y-1">
            {missingFields.map((field) => (
              <li key={field.key}>{field.label} is required</li>
            ))}

            {overridesMissing && (
              <li>
                Override Option is required when overrides are enabled
              </li>
            )}
          </ul>
        </div>
      )}

      {/* ----------------------------- */}
      {/* Identity */}
      {/* ----------------------------- */}
      <div className="border border-slate-200 rounded-lg p-5 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Identity
        </h3>

        <ReviewRow label="Retailer" value={formData.retailer} required />
        <ReviewRow label="Merchant" value={formData.merchant} required />
        <ReviewRow
          label="Trading Partner ID"
          value={formData.tradingPartnerId}
          required
        />

        {formData.merchantGs1Prefix && (
          <ReviewRow
            label="Merchant GS1 Prefix"
            value={formData.merchantGs1Prefix}
          />
        )}

        {formData.merchantIsa && (
          <ReviewRow label="Merchant ISA" value={formData.merchantIsa} />
        )}
      </div>

      {/* ----------------------------- */}
      {/* Default Shipping */}
      {/* ----------------------------- */}
      <div className="border border-slate-200 rounded-lg p-5 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Default Shipping
        </h3>

        <ReviewRow
          label="Fulfillment Mode"
          value={formData.fulfillmentMode}
          required
        />

        <ReviewRow
          label="Shipping Payment Terms"
          value={formData.shippingPaymentTerms}
          required
        />

        <ReviewRow
          label="Shipping Overrides Enabled"
          value={formData.overridesEnabled ? "Yes" : "No"}
        />

        {formData.overridesEnabled && (
          <ReviewRow
            label="Override Option"
            value={formData.overrideOption || ""}
            required
          />
        )}
      </div>

      {/* ----------------------------- */}
      {/* Carrier Billing Accounts ✅ */}
      {/* ----------------------------- */}
      {requiresBilling && carrierAccounts.length > 0 && (
        <div className="border border-slate-200 rounded-lg p-5 bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Carrier Billing Accounts
          </h3>

          <div className="overflow-hidden border border-slate-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="text-left px-3 py-2">Carrier</th>
                  <th className="text-left px-3 py-2">Account Number</th>
                  <th className="text-left px-3 py-2">
                    Fulfillment Center
                  </th>
                  <th className="text-left px-3 py-2">
                    Billing Zip Code
                  </th>
                </tr>
              </thead>

              <tbody>
                {carrierAccounts.map((acc: any) => (
                  <tr
                    key={acc.id}
                    className="border-t border-slate-200"
                  >
                    <td className="px-3 py-2">
                      {acc.carrier || "—"}
                    </td>
                    <td className="px-3 py-2">
                      {acc.accountNumber || "—"}
                    </td>
                    <td className="px-3 py-2">
                      {acc.fulfillmentCenter || "—"}
                    </td>
                    <td className="px-3 py-2">
                      {acc.billingZipCode || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activate Button */}
      <button
        onClick={onActivate}
        disabled={!isValid}
        className={`w-full py-3 text-sm font-medium rounded-lg transition ${
          isValid
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-slate-200 text-slate-500 cursor-not-allowed"
        }`}
      >
        Activate Trading Partner
      </button>
    </div>
  );
}
