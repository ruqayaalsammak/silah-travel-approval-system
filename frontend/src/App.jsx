import React, { useState } from 'react';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

const CATEGORIES = [
  {
    id: 'Category A',
    title: 'Category A',
    roles: 'CEO / CFO / GM',
    flightClass: 'First / Business Class',
    hotelAllowance: 'Up to 150 BHD / night',
    dailyAllowance: '50 BHD / day',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    hotelRate: 150,
    dailyRate: 50
  },
  {
    id: 'Category B',
    title: 'Category B',
    roles: 'Director / Senior Manager',
    flightClass: 'Business / Economy Class',
    hotelAllowance: 'Up to 100 BHD / night',
    dailyAllowance: '35 BHD / day',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    hotelRate: 100,
    dailyRate: 35
  },
  {
    id: 'Category C',
    title: 'Category C',
    roles: 'Assistant Manager / Senior Officer / Team Leader / Agent',
    flightClass: 'Economy Class',
    hotelAllowance: 'Up to 70 BHD / night',
    dailyAllowance: '25 BHD / day',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    hotelRate: 70,
    dailyRate: 25
  }
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    employeeId: '',
    department: '',
    email: '',
    travelTo: '',
    fromDate: '',
    toDate: '',
    totalDays: 0,
    purpose: '',
    travelCost: '',
    hotelStayRate: CATEGORIES[0].hotelRate,
    dailyAllowanceRate: CATEGORIES[0].dailyRate,
    othersCost: '',
    othersNotes: '',
    employeeSignature: ''
  });

  const [submittedClaim, setSubmittedClaim] = useState(null);
  const [ceoSignature, setCeoSignature] = useState('');
  const [ceoComments, setCeoComments] = useState('');
  const [workflowStatus, setWorkflowStatus] = useState('Pending');

  // Days Calculation
  const handleDateChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    if (updated.fromDate && updated.toDate) {
      const start = new Date(updated.fromDate);
      const end = new Date(updated.toDate);
      const diffTime = end - start;
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      updated.totalDays = days > 0 ? days : 0;
    }
    setFormData(updated);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setFormData({
      ...formData,
      hotelStayRate: cat.hotelRate,
      dailyAllowanceRate: cat.dailyRate
    });
    setCurrentStep(3);
  };

  // Cost Computations
  const calcHotelTotal = () => (Number(formData.totalDays) || 0) * (Number(formData.hotelStayRate) || 0);
  const calcDailyTotal = () => (Number(formData.totalDays) || 0) * (Number(formData.dailyAllowanceRate) || 0);
  const calcTotalEstimatedCost = () => {
    return (Number(formData.travelCost) || 0) + calcHotelTotal() + calcDailyTotal() + (Number(formData.othersCost) || 0);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      submissionId: `SILAH-TRV-${Math.floor(100000 + Math.random() * 900000)}`,
      category: selectedCategory.id,
      expenses: {
        travelCost: Number(formData.travelCost) || 0,
        hotelStayRate: Number(formData.hotelStayRate) || 0,
        hotelStayTotal: calcHotelTotal(),
        dailyAllowanceRate: Number(formData.dailyAllowanceRate) || 0,
        dailyAllowanceTotal: calcDailyTotal(),
        othersCost: Number(formData.othersCost) || 0,
        othersNotes: formData.othersNotes,
        totalEstimatedCost: calcTotalEstimatedCost()
      }
    };
    setSubmittedClaim(payload);
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-900 text-white p-2 rounded-lg font-bold text-xl tracking-wider">
            silah
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">SILAH GULF WLL</h1>
            <p className="text-xs text-slate-500 font-medium">Digital Travel Approval System</p>
          </div>
        </div>
        
        {/* Step Indicator */}
        <div className="hidden md:flex items-center space-x-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === step ? 'bg-blue-900 text-white' : currentStep > step ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {step}
              </span>
              {step < 4 && <div className="w-8 h-0.5 bg-slate-200 mx-1" />}
            </div>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
        
        {/* STEP 1: WELCOME GREETING PAGE */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto">
              <BuildingOfficeIcon className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Welcome to Silah Travel Approval Portal</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base">
              Streamline official business travel authorizations, daily allowance calculations, and executive approval routing in one seamless flow.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-left my-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-blue-900">1. Select Category</span>
                <p className="text-xs text-slate-500 mt-1">Choose grade level allowance policy.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-blue-900">2. Fill Approval Form</span>
                <p className="text-xs text-slate-500 mt-1">Digital Silah WLL official travel form.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-blue-900">3. CEO Sign & Finance CC</span>
                <p className="text-xs text-slate-500 mt-1">Automated dispatch to executive & finance.</p>
              </div>
            </div>
            <button 
              onClick={() => setCurrentStep(2)}
              className="px-8 py-3 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition flex items-center justify-center space-x-2 mx-auto"
            >
              <span>Begin Travel Approval Application</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: CATEGORY SELECTION */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Select Employee Grade Category</h2>
              <p className="text-sm text-slate-500">Expenditure thresholds and allowances are populated according to corporate policy.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {CATEGORIES.map((cat) => (
                <div 
                  key={cat.id} 
                  className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-900 transition flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${cat.badgeColor}`}>
                      {cat.title}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base">{cat.roles}</h3>
                    <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                      <div><strong className="text-slate-800">Flight:</strong> {cat.flightClass}</div>
                      <div><strong className="text-slate-800">Hotel Cap:</strong> {cat.hotelAllowance}</div>
                      <div><strong className="text-slate-800">Daily Allowance:</strong> {cat.dailyAllowance}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCategorySelect(cat)}
                    className="mt-6 w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-900 transition"
                  >
                    Select Policy & Continue
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: DIGITAL TRAVEL APPROVAL FORM */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-300 shadow-lg space-y-6">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">SILAH GULF WLL</h2>
                <h3 className="text-lg font-extrabold text-blue-900">TRAVEL APPROVAL FORM</h3>
              </div>
              <div className="text-right">
                <label className="text-xs text-slate-500 block">Date</label>
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="border border-slate-300 rounded px-2 py-1 text-xs font-semibold"
                />
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Employee Info Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Employee Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Employee ID</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.employeeId} 
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                    placeholder="e.g. S-1049"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Corporate Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                    placeholder="name@silah.bh"
                  />
                </div>
              </div>

              {/* Destination & Itinerary */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Travel To (Sectors / Places)</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.travelTo} 
                    onChange={(e) => setFormData({ ...formData, travelTo: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                    placeholder="Mention destination cities or sectors"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">From Date</label>
                    <input 
                      type="date" 
                      required 
                      value={formData.fromDate} 
                      onChange={(e) => handleDateChange('fromDate', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">To Date</label>
                    <input 
                      type="date" 
                      required 
                      value={formData.toDate} 
                      onChange={(e) => handleDateChange('toDate', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Days</label>
                    <input 
                      type="number" 
                      readOnly 
                      value={formData.totalDays}
                      className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 text-sm font-bold text-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Purpose of Travel</label>
                  <textarea 
                    rows={3} 
                    required 
                    value={formData.purpose} 
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                    placeholder="Detail business objectives and project alignment"
                  />
                </div>
              </div>

              {/* ESTIMATED EXPENDITURE TABLE */}
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 font-bold text-sm text-slate-800 uppercase border-b border-slate-300">
                  Estimated Expenditure (BHD)
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Travel Cost (Flights/Transport)</span>
                    <input 
                      type="number" 
                      placeholder="0.000" 
                      value={formData.travelCost} 
                      onChange={(e) => setFormData({ ...formData, travelCost: e.target.value })}
                      className="w-40 border border-slate-300 rounded p-1.5 text-right text-xs font-semibold"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Hotel Stay (@ {formData.hotelStayRate} BHD / night)</span>
                    <span className="text-xs font-bold text-slate-800">{calcHotelTotal().toFixed(3)} BHD</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Daily Allowance (@ {formData.dailyAllowanceRate} BHD / day)</span>
                    <span className="text-xs font-bold text-slate-800">{calcDailyTotal().toFixed(3)} BHD</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-xs font-semibold text-slate-700">Others (Visa, Incidentals)</span>
                    <input 
                      type="number" 
                      placeholder="0.000" 
                      value={formData.othersCost} 
                      onChange={(e) => setFormData({ ...formData, othersCost: e.target.value })}
                      className="w-40 border border-slate-300 rounded p-1.5 text-right text-xs font-semibold"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t-2 border-slate-900 font-bold text-sm text-blue-900">
                    <span>Total Estimated Cost of Travel</span>
                    <span>{calcTotalEstimatedCost().toFixed(3)} BHD</span>
                  </div>
                </div>
              </div>

              {/* Employee Signature */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Employee Digital Signature</label>
                <input 
                  type="text" 
                  required 
                  value={formData.employeeSignature} 
                  onChange={(e) => setFormData({ ...formData, employeeSignature: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm italic font-serif"
                  placeholder="Type full legal name as authorization signature"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-300 transition flex items-center space-x-1"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span>Back to Categories</span>
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition flex items-center space-x-2"
                >
                  <span>Submit to Executive Office</span>
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: CEO APPROVAL & FINANCE CC WORKFLOW */}
        {currentStep === 4 && submittedClaim && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase text-slate-500">Form Reference: {submittedClaim.submissionId}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  workflowStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                  workflowStatus === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {workflowStatus}
                </span>
              </div>

              {/* Form Summary Details */}
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div><strong className="text-slate-700">Applicant:</strong> {submittedClaim.name} ({submittedClaim.category})</div>
                <div><strong className="text-slate-700">Destination:</strong> {submittedClaim.travelTo} ({submittedClaim.totalDays} Days)</div>
                <div><strong className="text-slate-700">Total Expenditure:</strong> {submittedClaim.expenses.totalEstimatedCost.toFixed(3)} BHD</div>
                <div><strong className="text-slate-700">Employee Signature:</strong> <span className="italic font-serif">{submittedClaim.employeeSignature}</span></div>
              </div>

              {/* Simulated Executive Action Console */}
              {workflowStatus === 'Pending' ? (
                <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                    <UserGroupIcon className="w-5 h-5 text-blue-900" />
                    <span>Executive CEO / Management Approval Sign-off</span>
                  </h4>
                  <input 
                    type="text" 
                    placeholder="CEO Digital Signature (Full Name)" 
                    value={ceoSignature} 
                    onChange={(e) => setCeoSignature(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                  <textarea 
                    rows={2} 
                    placeholder="Approval comments or directives..." 
                    value={ceoComments} 
                    onChange={(e) => setCeoComments(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setWorkflowStatus('Approved')}
                      disabled={!ceoSignature}
                      className="flex-1 py-2 bg-emerald-600 text-white font-semibold rounded-lg text-xs hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center space-x-1"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Approve & Dispatch to Staff & Finance</span>
                    </button>
                    <button 
                      onClick={() => setWorkflowStatus('Rejected')}
                      className="px-4 py-2 bg-rose-600 text-white font-semibold rounded-lg text-xs hover:bg-rose-700 transition flex items-center space-x-1"
                    >
                      <XCircleIcon className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-6 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3 text-xs text-emerald-900">
                  <div className="flex items-center space-x-2 font-bold text-sm">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                    <span>Approval Process Completed</span>
                  </div>
                  <p><strong>CEO Signature:</strong> <span className="italic font-serif">{ceoSignature || 'Executive Office'}</span></p>
                  <p><strong>Routing Log:</strong> Signed approval form dispatched to <u>{submittedClaim.email}</u> (Staff Copy) and copied to <u>finance@silah.bh</u> (Finance Action).</p>
                  <button 
                    onClick={() => { setCurrentStep(1); setWorkflowStatus('Pending'); }} 
                    className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                  >
                    Start New Request
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}