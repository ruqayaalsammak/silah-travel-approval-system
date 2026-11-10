import React from 'react';
import { 
  BuildingOffice2Icon, 
  UserGroupIcon, 
  BriefcaseIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const CATEGORIES = [
  {
    id: 'Category A',
    title: 'Category A',
    roles: 'C-Level Executive / Vice President / Executive Director',
    badge: 'Executive Tier',
    color: 'border-blue-900 bg-blue-50/40 text-blue-950',
    headerBg: 'bg-blue-900 text-white',
    icon: BuildingOffice2Icon,
    flight: 'To be announced',
    hotelLimit: '104.000 BHD',
    allowance: '85.000 BHD',
  },
  {
    id: 'Category B',
    title: 'Category B',
    roles: 'Department Director / General Manager / Senior Manager',
    badge: 'Management Tier',
    color: 'border-slate-300 bg-slate-50/60 text-slate-900',
    headerBg: 'bg-slate-800 text-white',
    icon: UserGroupIcon,
    flight: 'To be announced',
    hotelLimit: '86.000 BHD',
    allowance: '70.000 BHD',
  },
  {
    id: 'Category C',
    title: 'Category C',
    roles: 'Manager / Assistant Manager / Senior Specialist / Staff',
    badge: 'Operational Tier',
    color: 'border-slate-200 bg-white text-slate-800',
    headerBg: 'bg-slate-700 text-white',
    icon: BriefcaseIcon,
    flight: 'To be announced',
    hotelLimit: '73.000 BHD',
    allowance: '60.000 BHD',
  }
];

export default function Step2Category({ selectedCategory, onSelectCategory, onNext, onBack }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Select Employee Category</h2>
        <p className="text-sm text-slate-500 mt-1">
          Travel entitlements, lodging caps, and daily per diem rates are determined by official Silah Gulf policy tier.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative flex flex-col justify-between rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                isSelected ? 'border-blue-900 ring-2 ring-blue-900/20 bg-blue-50/30' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className={`p-4 flex items-center justify-between ${cat.headerBg}`}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-white/90" />
                    <span className="font-bold text-sm tracking-wide">{cat.title}</span>
                  </div>
                  {isSelected && <CheckCircleIcon className="h-5 w-5 text-white" />}
                </div>

                <div className="p-5 space-y-4">
                  <div className="text-xs text-slate-600 min-h-[36px]">
                    <span className="font-semibold text-slate-800">Applies to:</span> {cat.roles}
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Flight Class:</span>
                      <span className="font-bold text-slate-900 italic">{cat.flight}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Hotel Stay Cap:</span>
                      <span className="font-bold text-slate-900">{cat.hotelLimit} / night</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 font-medium">Daily Allowance:</span>
                      <span className="font-bold text-slate-900">{cat.allowance} / day</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-blue-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Tier'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!selectedCategory}
          onClick={onNext}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-md ${
            selectedCategory
              ? 'bg-blue-900 hover:bg-blue-950 cursor-pointer'
              : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          Continue to Travel Form <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}