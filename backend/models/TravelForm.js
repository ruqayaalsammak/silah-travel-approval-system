import mongoose from 'mongoose';

const travelFormSchema = new mongoose.Schema({
  submissionId: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  name: { type: String, required: true },
  employeeId: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Category A', 'Category B', 'Category C'], 
    required: true 
  },
  travelTo: { type: String, required: true },
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
  totalDays: { type: Number, required: true },
  purpose: { type: String, required: true },
  expenses: {
    travelCost: { type: Number, default: 0 },
    hotelStayRate: { type: Number, default: 0 },
    hotelStayTotal: { type: Number, default: 0 },
    dailyAllowanceRate: { type: Number, default: 0 },
    dailyAllowanceTotal: { type: Number, default: 0 },
    othersCost: { type: Number, default: 0 },
    othersNotes: { type: String, default: '' },
    totalEstimatedCost: { type: Number, required: true }
  },
  employeeSignature: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending CEO Approval', 'Approved', 'Rejected'], 
    default: 'Pending CEO Approval' 
  },
  ceoSignature: { type: String, default: '' },
  ceoComments: { type: String, default: '' },
  approvalDate: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('TravelForm', travelFormSchema);