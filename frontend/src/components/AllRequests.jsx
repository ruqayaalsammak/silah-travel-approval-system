import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  ArrowLeftIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function AllRequests({ onBack }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [previewClaim, setPreviewClaim] = useState(null);
  const [editClaim, setEditClaim] = useState(null);

  const fetchRequests = () => {
    fetch('http://localhost:5000/api/travel-claims')
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching claims:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this travel request?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/travel-claims/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setRequests(requests.filter(req => req._id !== id));
      } else {
        alert('Failed to delete request');
      }
    } catch (err) {
      console.error('Error deleting claim:', err);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/travel-claims/${editClaim._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editClaim)
      });
      const result = await res.json();
      if (res.ok) {
        alert('Travel claim updated successfully!');
        setEditClaim(null);
        fetchRequests();
      } else {
        alert(result.error || 'Update failed');
      }
    } catch (err) {
      console.error('Error updating claim:', err);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filterStatus === 'All') return true;
    return req.status === filterStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Silah Travel Claims Archive</h2>
          <p className="text-sm text-slate-500 mt-1">Review, edit, and manage all travel approval requests.</p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-sm self-start sm:self-auto"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back to Home
        </button>
      </div>

      <div className="flex items-center gap-2 my-6 overflow-x-auto pb-2">
        {['All', 'Pending CEO Approval', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              filterStatus === status
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 font-medium">Loading requests archive...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-slate-300" />
          <p className="text-slate-500 font-medium mt-3">No travel requests found in archive.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-600 tracking-wider">
              <tr>
                <th className="py-3 px-4">ID & Date</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Category & Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredRequests.map((req) => (
                <tr key={req._id || req.submissionId} className="hover:bg-slate-50/75 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-bold text-blue-900">{req.submissionId}</span>
                    <p className="text-xs text-slate-500">{req.date}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-slate-900">{req.name}</p>
                    <p className="text-xs text-slate-500">{req.department} ({req.employeeId})</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-800">{req.travelFrom || 'Manama'} → {req.travelTo}</p>
                    <p className="text-xs text-slate-500">{req.fromDate} to {req.toDate} ({req.totalDays} days)</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{req.category}</span>
                    <p className="font-bold text-slate-900 mt-1">{(req.expenses?.totalEstimatedCost || 0).toFixed(3)} BHD</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      req.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {req.status || 'Pending CEO Approval'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center space-x-2">
                    <button
                      onClick={() => setPreviewClaim(req)}
                      title="Preview"
                      className="inline-flex items-center p-1.5 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded-lg text-xs font-bold transition border border-blue-200"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditClaim(req)}
                      title="Edit"
                      className="inline-flex items-center p-1.5 bg-amber-50 text-amber-900 hover:bg-amber-100 rounded-lg text-xs font-bold transition border border-amber-200"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(req._id)}
                      title="Delete"
                      className="inline-flex items-center p-1.5 bg-rose-50 text-rose-900 hover:bg-rose-100 rounded-lg text-xs font-bold transition border border-rose-200"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-blue-900 uppercase">Travel Claim Preview</h3>
                <p className="text-xs text-slate-500">{previewClaim.submissionId} - {previewClaim.date}</p>
              </div>
              <button onClick={() => setPreviewClaim(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div><strong className="text-slate-700">Employee Name:</strong> {previewClaim.name}</div>
              <div><strong className="text-slate-700">Employee ID / Email:</strong> {previewClaim.employeeId} ({previewClaim.email})</div>
              <div><strong className="text-slate-700">Travel Route:</strong> {previewClaim.travelFrom || 'Manama'} to {previewClaim.travelTo}</div>
              <div><strong className="text-slate-700">Duration:</strong> {previewClaim.fromDate} to {previewClaim.toDate} ({previewClaim.totalDays} Days)</div>
              <div><strong className="text-slate-700">Grade Category:</strong> {previewClaim.category}</div>
              <div><strong className="text-slate-700">Status:</strong> {previewClaim.status}</div>
            </div>
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Expenditure Breakdown</h4>
              <div className="flex justify-between"><span>Flight/Transport Cost:</span><span>{(previewClaim.expenses?.travelCost || 0).toFixed(3)} BHD</span></div>
              <div className="flex justify-between"><span>Hotel Stay Total:</span><span>{(previewClaim.expenses?.hotelStayTotal || 0).toFixed(3)} BHD</span></div>
              <div className="flex justify-between"><span>Daily Allowance Total:</span><span>{(previewClaim.expenses?.dailyAllowanceTotal || 0).toFixed(3)} BHD</span></div>
              <div className="flex justify-between font-bold border-t border-slate-300 pt-2 text-blue-900">
                <span>Total Budget:</span>
                <span>{(previewClaim.expenses?.totalEstimatedCost || 0).toFixed(3)} BHD</span>
              </div>
            </div>
            <div className="text-right">
              <button onClick={() => setPreviewClaim(null)} className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-blue-900 uppercase">Edit Travel Claim ({editClaim.submissionId})</h3>
              <button onClick={() => setEditClaim(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employee Name</label>
                  <input 
                    type="text" 
                    value={editClaim.name} 
                    onChange={(e) => setEditClaim({ ...editClaim, name: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input 
                    type="text" 
                    value={editClaim.department} 
                    onChange={(e) => setEditClaim({ ...editClaim, department: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Travel From</label>
                  <input 
                    type="text" 
                    value={editClaim.travelFrom} 
                    onChange={(e) => setEditClaim({ ...editClaim, travelFrom: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Travel To</label>
                  <input 
                    type="text" 
                    value={editClaim.travelTo} 
                    onChange={(e) => setEditClaim({ ...editClaim, travelTo: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Purpose of Travel</label>
                <textarea 
                  rows={3} 
                  value={editClaim.purpose} 
                  onChange={(e) => setEditClaim({ ...editClaim, purpose: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setEditClaim(null)} 
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}