import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
} from "lucide-react";

interface CarrierAccount {
  id: string;
  carrier: string;
  accountNumber: string;
  fulfillmentCenter: string;
  billingZipCode: string;
}

interface BillingStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function BillingStep({
  formData,
  updateFormData,
}: BillingStepProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    null,
  );
  const [currentAccount, setCurrentAccount] = useState<
    Partial<CarrierAccount>
  >({
    carrier: "",
    accountNumber: "",
    fulfillmentCenter: "",
    billingZipCode: "",
  });

  const requiresConfiguration =
    formData.shippingPaymentTerms !== "ShipBob Prepaid";
  const carrierAccounts: CarrierAccount[] =
    formData.carrierAccounts || [];

  const handleAddAccount = () => {
    if (editingId) {
      // Update existing
      updateFormData({
        carrierAccounts: carrierAccounts.map((acc) =>
          acc.id === editingId
            ? { ...currentAccount, id: editingId }
            : acc,
        ),
      });
    } else {
      // Add new
      updateFormData({
        carrierAccounts: [
          ...carrierAccounts,
          { ...currentAccount, id: Date.now().toString() },
        ],
      });
    }
    setShowForm(false);
    setEditingId(null);
    setCurrentAccount({
      carrier: "",
      accountNumber: "",
      fulfillmentCenter: "",
      billingZipCode: "",
    });
  };

  const handleEdit = (account: CarrierAccount) => {
    setEditingId(account.id);
    setCurrentAccount(account);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    updateFormData({
      carrierAccounts: carrierAccounts.filter(
        (acc) => acc.id !== id,
      ),
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setCurrentAccount({
      carrier: "",
      accountNumber: "",
      fulfillmentCenter: "",
      billingZipCode: "",
    });
  };

  if (!requiresConfiguration) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg text-slate-900 mb-1">
              No Configuration Required
            </h2>
            <p className="text-sm text-slate-600">
              Since you've selected{" "}
              <span className="">ShipBob Prepaid</span> as your
              shipping payment terms, no carrier billing setup
              is needed. ShipBob will handle all carrier
              billing.
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Click <span className="">Continue</span> to
              proceed to the next step.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg text-slate-900 mb-1">
          Billing & Carrier Accounts
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Determines which carrier account (and therefore
          pricing, invoice & routing) is used.
        </p>

        <div className="space-y-5">
          {/* Carrier Accounts Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm text-slate-700">
                Carrier Billing Accounts
              </label>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Carrier Account
                </button>
              )}
            </div>

            {/* Table */}
            {carrierAccounts.length > 0 && (
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs text-slate-700">
                        Carrier
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-slate-700">
                        Account Number
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-slate-700">
                        Fulfillment Center
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-slate-700">
                        Billing Zip Code
                      </th>
                      <th className="text-right px-4 py-3 text-xs text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {carrierAccounts.map((account) => (
                      <tr
                        key={account.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 text-slate-900">
                          {account.carrier}
                        </td>
                        <td className="px-4 py-3 text-slate-900">
                          {account.accountNumber}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {account.fulfillmentCenter || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {account.billingZipCode || "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleEdit(account)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded mr-1"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(account.id)
                            }
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {carrierAccounts.length === 0 && !showForm && (
              <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center">
                <p className="text-sm text-slate-500">
                  No carrier accounts configured
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Click "Add Carrier Account" to get started
                </p>
              </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-4">
                <h3 className="text-sm text-slate-900">
                  {editingId
                    ? "Edit Carrier Account"
                    : "Add Carrier Account"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-700 mb-1.5">
                      Carrier *
                    </label>
                    <select
                      value={currentAccount.carrier}
                      onChange={(e) =>
                        setCurrentAccount({
                          ...currentAccount,
                          carrier: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">
                        Select carrier...
                      </option>
                      <option value="UPS">UPS</option>
                      <option value="FedEx">FedEx</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-700 mb-1.5">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      value={currentAccount.accountNumber}
                      onChange={(e) =>
                        setCurrentAccount({
                          ...currentAccount,
                          accountNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-700 mb-1.5">
                      Fulfillment Center
                    </label>
                    <select
                      value={currentAccount.fulfillmentCenter}
                      onChange={(e) =>
                        setCurrentAccount({
                          ...currentAccount,
                          fulfillmentCenter: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">
                        Select fulfillment center...
                      </option>
                      <option value="Any">Any</option>
                      <option value="Moreno Valley, CA">
                        Moreno Valley, CA
                      </option>
                      <option value="Bethlehem, PA">
                        Bethlehem, PA
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-700 mb-1.5">
                      Billing Zip Code
                    </label>
                    <input
                      type="text"
                      value={currentAccount.billingZipCode}
                      onChange={(e) =>
                        setCurrentAccount({
                          ...currentAccount,
                          billingZipCode: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 10001"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1.5 text-sm border border-slate-300 bg-white text-slate-700 rounded hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAccount}
                    disabled={
                      !currentAccount.carrier ||
                      !currentAccount.accountNumber
                    }
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingId ? "Update" : "Add"} Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}