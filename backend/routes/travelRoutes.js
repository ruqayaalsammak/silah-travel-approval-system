import express from 'express';
import TravelForm from '../models/TravelForm.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Create Travel Approval Request (Submit Form)
router.post('/submit', async (req, res) => {
  try {
    const submissionId = `SILAH-TRV-${Math.floor(100000 + Math.random() * 900000)}`;
    const formData = new TravelForm({ ...req.body, submissionId });
    await formData.save();

    // Send notification email to CEO
    const mailOptions = {
      from: '"Silah Travel System" <no-reply@silah.bh>',
      to: process.env.CEO_EMAIL,
      subject: `[ACTION REQUIRED] Travel Approval Request: ${formData.name} (${submissionId})`,
      html: `
        <h3>New Travel Approval Request Submitted</h3>
        <p><strong>Employee:</strong> ${formData.name} (${formData.department})</p>
        <p><strong>Destination:</strong> ${formData.travelTo}</p>
        <p><strong>Total Cost:</strong> ${formData.expenses.totalEstimatedCost.toFixed(3)} BHD</p>
        <p>Please review and sign off on the portal.</p>
      `
    };
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Travel form submitted successfully', data: formData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CEO Action Route (Approve / Reject & Routing)
router.post('/approve/:id', async (req, res) => {
  try {
    const { status, ceoSignature, ceoComments } = req.body;
    const approvalDate = new Date().toISOString().split('T')[0];

    const form = await TravelForm.findByIdAndUpdate(
      req.params.id,
      { status, ceoSignature, ceoComments, approvalDate },
      { new: true }
    );

    if (!form) return res.status(404).json({ error: 'Form not found' });

    // Send confirmation email copy to Employee and Finance Team
    const recipientEmails = [form.email, process.env.FINANCE_EMAIL].join(',');
    const statusMail = {
      from: '"Silah Executive Office" <ceo-office@silah.bh>',
      to: recipientEmails,
      subject: `[${status.toUpperCase()}] Travel Approval Request: ${form.submissionId}`,
      html: `
        <h2>Silah Gulf WLL - Travel Approval Notification</h2>
        <p>The travel request for <strong>${form.name}</strong> to <strong>${form.travelTo}</strong> has been <strong>${status}</strong> by Executive Management.</p>
        <hr/>
        <p><strong>Total Approved Budget:</strong> ${form.expenses.totalEstimatedCost.toFixed(3)} BHD</p>
        <p><strong>CEO Comments:</strong> ${ceoComments || 'N/A'}</p>
        <p><strong>Finance Department Action:</strong> ${status === 'Approved' ? 'Proceed with disbursement setup and travel arrangements.' : 'No further action required.'}</p>
      `
    };
    await transporter.sendMail(statusMail);

    res.json({ message: `Travel claim successfully ${status}`, data: form });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all claims
router.get('/', async (req, res) => {
  try {
    const claims = await TravelForm.find().sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;