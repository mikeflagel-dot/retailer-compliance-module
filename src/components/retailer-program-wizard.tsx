import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

import { WizardStepper } from "./wizard-stepper";

import { OverviewStep } from "./retailer-program/overview-step";
import { DocumentsLabelsStep } from "./retailer-program/documents-labels-step";
import { CarrierMappingStep } from "./retailer-program/carrier-mapping-step";
import { PackingShippingStep } from "./retailer-program/packing-shipping-step";

/** ✅ NEW: Review Step */
import { ReviewStep } from "./retailer-program/review-step";

interface RetailerProgramWizardProps {
  onComplete: (data: any) => void;
  onBack: () => void;

  /** Edit Mode Support */
  initialData?: any;
}

/** Wizard Steps */
const STEPS = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents & Labels" },
  { id: "packing-shipping", label: "Packing & Shipping" },
  { id: "carrier-mapping", label: "Routing Rules" },

  /** ✅ NEW FINAL STEP */
  { id: "review", label: "Review" },
];

/** Default Retailer Program Shape */
const defaultProgramData = {
  retailerName: "",
  programType: "",
  programName: "",
  programCode: "",
  description: "",

  packingSlipName: "",
  gs1BoxLabelName: "",
  gs1PalletLabelName: "",
  enableGs1LabelsForDropship: false,

  enableShippingLabelRef1: false,
  shippingLabelRef1Prefix: "",
  shippingLabelRef1Value: "",

  enableShippingLabelRef2: false,
  shippingLabelRef2Prefix: "",
  shippingLabelRef2Value: "",

  packingSlipConfigurations: [],

  packingShipping: {
    palletGradeRequirement: "",
    palletGradeCustomNotes: "",
  },

  carrierServiceMappings: [],
};

export function RetailerProgramWizard({
  onComplete,
  onBack,
  initialData,
}: RetailerProgramWizardProps) {
  /** Explicit Edit Mode Flag */
  const isEditMode = initialData !== undefined;

  /** Step State */
  const [currentStep, setCurrentStep] = useState(0);

  /** ✅ Scroll to top whenever step changes */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  /** Form State */
  const [formData, setFormData] = useState({
    ...defaultProgramData,
    ...(initialData || {}),
  });

  /** Load Existing Program When Editing */
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        ...defaultProgramData,
        ...initialData,
      });
    } else {
      setFormData(defaultProgramData);
    }
  }, [initialData, isEditMode]);

  const updateFormData = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  /** Validation Rules */
  const isStepValid = () => {
    if (currentStep === 0) {
      return (
        (formData.retailerName || "").trim().length > 0 &&
        (formData.programName || "").trim().length > 0 &&
        (formData.programCode || "").trim().length > 0
      );
    }

    return true;
  };

  /** Navigation */
  const handleNext = () => {
    if (!isStepValid()) {
      alert(
        "Retailer Name, Program Name, and Program Code are required before continuing."
      );
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  /** Step Renderer */
  const renderStep = () => {
    if (currentStep === 0)
      return (
        <OverviewStep formData={formData} updateFormData={updateFormData} />
      );

    if (currentStep === 1)
      return (
        <DocumentsLabelsStep
          formData={formData}
          updateFormData={updateFormData}
        />
      );

    if (currentStep === 2)
      return (
        <PackingShippingStep
          formData={formData}
          updateFormData={updateFormData}
        />
      );

    if (currentStep === 3)
      return (
        <CarrierMappingStep
          formData={formData}
          updateFormData={updateFormData}
        />
      );

    /** ✅ Review Step */
    return <ReviewStep formData={formData} />;
  };

  /** Continue Disabled */
  const disableContinue =
    currentStep === STEPS.length - 1 ? false : !isStepValid();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Menu
          </button>

          <h1 className="text-2xl text-slate-900 mb-2">
            {isEditMode ? "Edit Retailer Program" : "Create Retailer Program"}
          </h1>

          <p className="text-sm text-slate-600">
            Configure retailer documents, packing requirements, routing rules,
            and review before saving.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 pb-6 border-b border-slate-200">
          <WizardStepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={isEditMode ? setCurrentStep : undefined}
          />
        </div>

        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Footer */}
        <div className="mt-8 bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-between rounded-lg">
          <button
            onClick={handleBackStep}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm border border-slate-300 bg-white text-slate-700 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            Back
          </button>

          {/* Right Button */}
          <button
            onClick={() => {
              /** Edit Mode: Save Anytime */
              if (isEditMode) {
                const confirmed = window.confirm(
                  "Saving changes will update packing and compliance rules for all current open orders (not yet picked) and all future orders.\n\nStill want to continue?"
                );

                if (!confirmed) return;

                onComplete(formData);
                return;
              }

              /** Create Mode: Final Save Happens on Review */
              if (currentStep === STEPS.length - 1) {
                onComplete(formData);
                return;
              }

              handleNext();
            }}
            disabled={disableContinue}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isEditMode
              ? "Save Changes"
              : currentStep === STEPS.length - 1
              ? "Save Program"
              : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
