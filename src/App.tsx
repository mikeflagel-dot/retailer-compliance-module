import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

import { WizardStepper } from "./components/wizard-stepper";

import { IdentityStep } from "./components/trading-partner/identity-step";
import { DefaultShippingStep } from "./components/trading-partner/default-shipping-step";
import { BillingStep } from "./components/trading-partner/billing-step";
import { ReviewStep } from "./components/trading-partner/review-step";

import { RetailerProgramWizard } from "./components/retailer-program-wizard";

import { TradingPartnerList } from "./components/trading-partner/trading-partner-list";
import { RetailerProgramList } from "./components/retailer-program/retailer-program-list";

/** -----------------------------
 * Trading Partner Wizard Steps
 * ------------------------------ */
const STEPS = [
  { id: "identity", label: "Identity" },
  { id: "defaults", label: "Defaults" },
  { id: "billing", label: "Billing" },
  { id: "review", label: "Review" },
];

/** -----------------------------
 * Entity Wrapper
 * ------------------------------ */
type Status = "draft" | "active";

type Entity<T> = {
  id: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  data: T;
};

/** -----------------------------
 * Retailer Program Defaults
 *
 * Ensures new fields are always present,
 * even for older saved programs.
 * ------------------------------ */

/** -----------------------------
 * ✅ Trading Partner Defaults
 * Ensures New Trading Partner starts blank
 * ------------------------------ */
const defaultTradingPartnerData = {
  retailer: "",
  programType: "",
  merchant: "",
  tradingPartnerId: "",

  merchantGs1Prefix: "",
  merchantIsa: "",

  fulfillmentMode: "",
  shippingPaymentTerms: "",
  accountOwner: "",
  carrierAccounts: [],
  overridesEnabled: false,
  overrideOption: "",
};

export default function App() {
  /** -----------------------------
   * View + Tabs
   * ------------------------------ */
  const [view, setView] = useState<
    "menu" | "trading-partner" | "retailer-program"
  >("menu");

  const [menuTab, setMenuTab] = useState<
    "retailer-programs" | "trading-partners"
  >("retailer-programs");

  /** -----------------------------
   * Stored Configurations
   * ------------------------------ */
  const [retailerPrograms, setRetailerPrograms] = useState<
    Entity<any>[]
  >([]);
  const [tradingPartners, setTradingPartners] = useState<
    Entity<any>[]
  >([]);

  /** -----------------------------
   * Editing IDs
   * ------------------------------ */
  const [
    editingRetailerProgramId,
    setEditingRetailerProgramId,
  ] = useState<string | null>(null);

  const [editingTradingPartnerId, setEditingTradingPartnerId] =
    useState<string | null>(null);

  /** -----------------------------
   * Wizard Step State
   * ------------------------------ */
  const [currentStep, setCurrentStep] = useState(0);

  /** -----------------------------
   * Trading Partner Form Data
   * ------------------------------ */
  const [formData, setFormData] = useState(
    defaultTradingPartnerData,
  );

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  /** -----------------------------
   * LocalStorage Persistence
   * ------------------------------ */
  useEffect(() => {
    const storedPrograms = localStorage.getItem(
      "retailerPrograms",
    );
    const storedPartners = localStorage.getItem(
      "tradingPartners",
    );

    if (storedPrograms)
      setRetailerPrograms(JSON.parse(storedPrograms));
    if (storedPartners)
      setTradingPartners(JSON.parse(storedPartners));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "retailerPrograms",
      JSON.stringify(retailerPrograms),
    );
  }, [retailerPrograms]);

  useEffect(() => {
    localStorage.setItem(
      "tradingPartners",
      JSON.stringify(tradingPartners),
    );
  }, [tradingPartners]);

  /** -----------------------------
   * Trading Partner Navigation
   * ------------------------------ */
  const handleNext = () => {
    if (currentStep === 0) {
      if (
        !formData.retailer ||
        !formData.merchant ||
        !formData.tradingPartnerId
      ) {
        alert("Please complete all required Identity fields.");
        return;
      }
    }

    if (currentStep === 1) {
      if (
        !formData.fulfillmentMode ||
        !formData.shippingPaymentTerms
      ) {
        alert(
          "Please complete all required Shipping Defaults fields.",
        );
        return;
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  /** -----------------------------
   * Trading Partner Activate / Save
   * ------------------------------ */
  const handleActivate = () => {
    const now = new Date().toISOString();

    if (editingTradingPartnerId) {
      setTradingPartners((prev) =>
        prev.map((tp) =>
          tp.id === editingTradingPartnerId
            ? { ...tp, updatedAt: now, data: formData }
            : tp,
        ),
      );
    } else {
      setTradingPartners((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          status: "active",
          createdAt: now,
          updatedAt: now,
          data: formData,
        },
      ]);
    }

    // ✅ Reset after save
    setFormData(defaultTradingPartnerData);

    setEditingTradingPartnerId(null);
    setCurrentStep(0);
    setView("menu");
  };

  /** -----------------------------
   * Retailer Program Save
   * ------------------------------ */
  const handleRetailerProgramComplete = (data: any) => {
    const now = new Date().toISOString();

    if (editingRetailerProgramId) {
      setRetailerPrograms((prev) =>
        prev.map((p) =>
          p.id === editingRetailerProgramId
            ? { ...p, updatedAt: now, data }
            : p,
        ),
      );
    } else {
      setRetailerPrograms((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          status: "active",
          createdAt: now,
          updatedAt: now,
          data,
        },
      ]);
    }

    setEditingRetailerProgramId(null);
    setView("menu");
  };

  /** -----------------------------
   * Delete Handlers
   * ------------------------------ */
  const deleteRetailerProgram = (id: string) => {
    setRetailerPrograms((prev) =>
      prev.filter((p) => p.id !== id),
    );
  };

  const deleteTradingPartner = (id: string) => {
    setTradingPartners((prev) =>
      prev.filter((t) => t.id !== id),
    );
  };

  /** -----------------------------
   * MENU VIEW (Tabbed Landing Page)
   * ------------------------------ */
  if (view === "menu") {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-8 py-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl text-slate-900 mb-2">
              Retail Compliance Module
            </h1>
            <p className="text-sm text-slate-600">
              Manage Retailer Programs and Trading Partners.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setMenuTab("retailer-programs")}
              className={`px-4 py-2 text-sm font-medium ${
                menuTab === "retailer-programs"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Retailer Programs ({retailerPrograms.length})
            </button>

            <button
              onClick={() => setMenuTab("trading-partners")}
              className={`px-4 py-2 text-sm font-medium ${
                menuTab === "trading-partners"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Trading Partners ({tradingPartners.length})
            </button>
          </div>

          {/* Retailer Programs */}
          {menuTab === "retailer-programs" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-slate-900">
                  Retailer Programs
                </h2>

                <button
                  onClick={() => {
                    setEditingRetailerProgramId(null);
                    setView("retailer-program");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  + New Program
                </button>
              </div>

              <RetailerProgramList
                programs={retailerPrograms}
                onSelect={(id) => {
                  setEditingRetailerProgramId(id);
                  setView("retailer-program");
                }}
                onDelete={deleteRetailerProgram}
              />
            </div>
          )}

          {/* Trading Partners */}
          {menuTab === "trading-partners" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-slate-900">
                  Trading Partners
                </h2>

                <button
                  onClick={() => {
                    setEditingTradingPartnerId(null);

                    // ✅ Reset form when creating new
                    setFormData(defaultTradingPartnerData);

                    setCurrentStep(0);
                    setView("trading-partner");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  + New Trading Partner
                </button>
              </div>

              <TradingPartnerList
                partners={tradingPartners}
                onSelect={(id) => {
                  const tp = tradingPartners.find(
                    (t) => t.id === id,
                  );
                  if (!tp) return;

                  setEditingTradingPartnerId(id);
                  setFormData(tp.data);
                  setCurrentStep(0);
                  setView("trading-partner");
                }}
                onDelete={deleteTradingPartner}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  /** -----------------------------
   * RETAILER PROGRAM WIZARD
   * ------------------------------ */
  if (view === "retailer-program") {
    const programToEdit = retailerPrograms.find(
      (p) => p.id === editingRetailerProgramId,
    );

    return (
      <RetailerProgramWizard
        initialData={
          programToEdit ? programToEdit.data : undefined
        }
        onComplete={handleRetailerProgramComplete}
        onBack={() => {
          setEditingRetailerProgramId(null);
          setView("menu");
        }}
      />
    );

    return (
      <RetailerProgramWizard
        initialData={mergedInitialData}
        onComplete={handleRetailerProgramComplete}
        onBack={() => {
          setEditingRetailerProgramId(null);
          setView("menu");
        }}
      />
    );
  }

  /** -----------------------------
   * TRADING PARTNER WIZARD
   * ------------------------------ */
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => {
              setEditingTradingPartnerId(null);
              setFormData(defaultTradingPartnerData);
              setCurrentStep(0);
              setView("menu");
            }}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Menu
          </button>

          <h1 className="text-2xl text-slate-900 mb-2">
            {editingTradingPartnerId
              ? "Edit Trading Partner"
              : "Create Trading Partner"}
          </h1>

          <p className="text-sm text-slate-600">
            Configure merchant-retailer shipping defaults,
            billing, and overrides.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-10">
          <WizardStepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={
              editingTradingPartnerId
                ? setCurrentStep
                : undefined
            }
          />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 0 && (
            <IdentityStep
              formData={formData}
              updateFormData={updateFormData}
              retailerPrograms={retailerPrograms} // ✅ pass programs into step
            />
          )}

          {currentStep === 1 && (
            <DefaultShippingStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === 2 && (
            <BillingStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === 3 && (
            <ReviewStep
              formData={formData}
              updateFormData={updateFormData}
              onActivate={handleActivate}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-between rounded-lg">
          {/* Back Button */}
          <button
            onClick={handleBackStep}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm border border-slate-300 bg-white text-slate-700 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            Back
          </button>

          {/* Right Side Buttons */}
          <div className="flex gap-3">
            {/* ✅ Edit Mode Save Anytime */}
            {editingTradingPartnerId && (
              <button
                onClick={() => {
                  const confirmed = window.confirm(
                    "Saving changes will update shipping and compliance rules for all current open orders (not yet picked) and all future orders under this Trading Partner.\n\nStill want to continue?",
                  );

                  if (!confirmed) return;

                  handleActivate();
                }}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Changes…
              </button>
            )}

            {/* Continue Button */}
            <button
              onClick={handleNext}
              disabled={currentStep === STEPS.length - 1}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}