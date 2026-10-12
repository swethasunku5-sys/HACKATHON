import React, { useState } from 'react';
import {
  Settings,
  User,
  Building,
  Mail,
  DollarSign,
  Bell,
  RotateCcw,
  Save,
  CheckCircle2,
  Database,
  Moon,
  Sun,
  Shield,
} from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsPageProps {
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
  onRequestResetDemoData: () => void;
  onSuccessToast: (msg: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSaveSettings,
  onRequestResetDemoData,
  onSuccessToast,
}) => {
  const [form, setForm] = useState<UserSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setIsSaved(true);
    onSuccessToast('Workspace settings saved successfully to local storage!');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
          Workspace Settings & Demo Controls
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your brand identity, currency preferences, notification signals, and prototype data state
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" />
            <span>Brand Profile & Identity</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Default company profile applied to published campaign briefs and agreements
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company / Agency Name
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Contact Person
            </label>
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Title / Role
            </label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Industry Category
            </label>
            <select
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            >
              <option value="DTC Fashion & Lifestyle">DTC Fashion & Lifestyle</option>
              <option value="Luxury, Fragrance & Jewelry">Luxury, Fragrance & Jewelry</option>
              <option value="Gaming & Entertainment">Gaming & Entertainment</option>
              <option value="SaaS & Enterprise Tech">SaaS & Enterprise Tech</option>
              <option value="Automotive & Mobility">Automotive & Mobility</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Budget Currency
            </label>
            <select
              value={form.defaultBudgetCurrency}
              onChange={(e) => setForm({ ...form, defaultBudgetCurrency: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white font-mono"
            >
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
              <option value="JPY (¥)">JPY (¥)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Workspace Theme Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, theme: 'navy' })}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                  form.theme === 'navy'
                    ? 'border-indigo-600 bg-indigo-50/60 text-slate-900 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#0a0f1d] border border-slate-700 shrink-0" />
                <span className="text-xs font-medium truncate">Dark Navy</span>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, theme: 'slate' })}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                  form.theme === 'slate'
                    ? 'border-indigo-600 bg-indigo-50/60 text-slate-900 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-600 shrink-0" />
                <span className="text-xs font-medium truncate">Deep Slate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Notification Preferences
          </h4>

          <div className="space-y-2">
            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.emailNotifications}
                onChange={(e) => setForm({ ...form, emailNotifications: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span>Receive milestone delivery notifications in workspace feed</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.newProposalAlerts}
                onChange={(e) => setForm({ ...form, newProposalAlerts: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span>Alert when shortlisted creators submit brief proposal keyframes</span>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Changes persist across browser sessions in local storage.
          </span>

          <button
            type="submit"
            className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs flex items-center gap-2"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Settings</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Danger Zone / Reset Demo Data (Required by prompt) */}
      <div className="bg-white rounded-xl border border-rose-200 p-6 space-y-4 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Demo Data to Initial Seed</span>
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Restores all 8+ original fictional AI creators, standard campaign briefs, sample engagements, and shortlists. Any briefs or engagements you created will be replaced with pristine challenge defaults.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onRequestResetDemoData}
            className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors shadow-xs flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Restore Demo Dataset...</span>
          </button>
        </div>
      </div>
    </div>
  );
};
