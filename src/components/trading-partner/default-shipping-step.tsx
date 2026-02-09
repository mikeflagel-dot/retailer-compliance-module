import { Info } from "lucide-react";

interface DefaultShippingStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function DefaultShippingStep({
  formData,
  updateFormData,
}: DefaultShippingStepProps) {
  /** -----------------------------
   * Freight Restrictions
   * ------------------------------ */
  const freightRestrictedTerms = ["Collect", "Third Party", "Bill to Sender"];

  const isFreight = formData.fulfillmentMode === "Freight";

  /** -----------------------------
   * Carrier billing info required ONLY when:
   * - Parcel mode
   * - Third Party OR Bill to Sender
   */

  /** Reset invalid payment terms if switching to Freight */
  const handleFulfillmentModeChange = (mode: string) => {
    const resetPaymentTerms =
      mode === "Freight" &&
      freightRestrictedTerms.includes(formData.shippingPaymentTerms);

    updateFormData({
      fulfillmentMode: mode,
      shippingPaymentTerms: resetPaymentTerms
        ? ""
        : formData.shippingPaymentTerms,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Default Shipment Details
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Establish the default shipping behavior that will be automatically
          applied to all EDI orders ingested for this Trading Partner.
        </p>

        <div className="space-y-5">
          {/* Fulfillment Mode */}
          <div>
            <label className="block text-sm text-slate-700 mb-2 font-bold">
              Mode <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-4">
              {["Parcel", "Freight"].map((mode) => (
                <label key={mode} className="flex items-center">
                  <input
                    type="radio"
                    name="fulfillmentMode"
                    value={mode}
                    checked={formData.fulfillmentMode === mode}
                    onChange={(e) =>
                      handleFulfillmentModeChange(e.target.value)
                    }
                    className="w-4 h-4 appearance-none rounded-full border border-slate-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">{mode}</span>
                </label>
              ))}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Parcel: Small-package shipment (usually less than 150 lbs.)
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Freight: Large or heavy shipment, usually requiring palletization
            </p>
          </div>

          {/* Shipping Payment Terms */}
          <div>
            <label className="block text-sm text-slate-700 mb-2 font-bold">
              Payment Terms <span className="text-red-500">*</span>
            </label>

            <div className="space-y-3">
              {[
                {
                  value: "ShipBob Prepaid",
                  title: "ShipBob Prepaid",
                  desc: "ShipBob’s carrier account is used and charges are billed through ShipBob.",
                },
                {
                  value: "Merchant Prepaid",
                  title: "Merchant Prepaid",
                  desc: "Merchant purchases labels externally and provides them to ShipBob.",
                },
                {
                  value: "Third Party",
                  title: "Third Party",
                  desc: "A retailer or third-party carrier account is billed directly.",
                  parcelOnly: true,
                },
                {
                  value: "Collect",
                  title: "Collect",
                  desc: "Shipping charges are collected from the receiver upon delivery.",
                  parcelOnly: true,
                },
                {
                  value: "Bill to Sender",
                  title: "Bill to Sender",
                  desc: "Sender’s carrier account is billed directly by the carrier.",
                  parcelOnly: true,
                },
              ].map((term) => {
                if (isFreight && term.parcelOnly) return null;

                const isSelected = formData.shippingPaymentTerms === term.value;

                const showsBillingNotice =
                  isSelected &&
                  ["Third Party", "Bill to Sender"].includes(term.value) &&
                  formData.fulfillmentMode === "Parcel";

                return (
                  <div key={term.value}>
                    <label className="flex items-start">
                      <input
                        type="radio"
                        name="paymentTerms"
                        value={term.value}
                        checked={isSelected}
                        onChange={(e) =>
                          updateFormData({
                            shippingPaymentTerms: e.target.value,
                          })
                        }
                        className="w-4 h-4 mt-0.5 appearance-none rounded-full border border-slate-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="ml-2">
                        <span className="text-sm text-slate-700">
                          {term.title}
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {term.desc}
                        </p>
                      </div>
                    </label>

                    {/* ✅ Inline Billing Notice */}
                    {showsBillingNotice && (
                      <div className="mt-2 ml-6 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <p className="text-xs text-blue-700">
                          This payment term requires configuring carrier billing
                          accounts in the next step.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {isFreight && (
                <p className="text-xs text-slate-500 mt-2">
                  Collect, Third Party, and Bill-to payment terms are not
                  supported for Freight shipments.
                </p>
              )}
            </div>
          </div>

          {/* Shipping Method Overrides */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-sm text-slate-900 mb-1 font-bold">
              Shipping Method Overrides
            </h3>

            <p className="text-sm text-slate-600 mb-4">
              Enable if this Trading Partner requires order-level shipping
              method overrides.
            </p>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={formData.overridesEnabled || false}
                onChange={(e) =>
                  updateFormData({
                    overridesEnabled: e.target.checked,
                    overrideOption: "",
                  })
                }
                className="w-4 h-4 appearance-none bg-white border border-slate-300 rounded checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">
                {formData.overridesEnabled ? "Enabled" : "Disabled"}
              </span>
            </label>

            {formData.overridesEnabled && (
              <div>
                <label className="block text-xs text-slate-700 mb-1.5">
                  Select Override Option *
                </label>

                <select
                  value={formData.overrideOption || ""}
                  onChange={(e) =>
                    updateFormData({
                      overrideOption: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an override...</option>
                  <option value="MerchantXYZRetailerABCShipOption">
                    MerchantXYZRetailerABCShipOption
                  </option>
                  <option value="MerchantNikeRetailerTargetGround">
                    MerchantNikeRetailerTargetGround
                  </option>
                  <option value="MerchantAcmeRetailerWalmartExpress">
                    MerchantAcmeRetailerWalmartExpress
                  </option>
                </select>

                <p className="mt-1 text-xs text-slate-500">
                  Overrides apply during routing and label generation.
                </p>
              </div>
            )}
          </div>

          {/* Label Details */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-sm text-slate-900 mb-1 font-bold">Label Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Shipping Label Company Name
                </label>
                <input
                  type="text"
                  value={formData.shippingLabelCompanyName || ""}
                  onChange={(e) =>
                    updateFormData({
                      shippingLabelCompanyName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
                <p className="mt-1 text-xs text-slate-500">
                  This name will appear on shipping labels.
                </p>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Shipping Label Phone Number
                </label>
                <input
                  type="text"
                  value={formData.shippingLabelPhoneNumber || ""}
                  onChange={(e) =>
                    updateFormData({
                      shippingLabelPhoneNumber: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Phone number printed on shipping labels.
                </p>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.printCustomerTicketNumberOnLabel || false}
                  onChange={(e) =>
                    updateFormData({
                      printCustomerTicketNumberOnLabel: e.target.checked,
                    })
                  }
                  className="w-4 h-4 appearance-none bg-white border border-slate-300 rounded checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">
                  Print Customer Ticket Number on Labels
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
