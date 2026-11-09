import express from 'express';
import TravelForm from '../models/TravelForm.js';
import nodemailer from 'nodemailer';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.office365.com',
  port: process.env.SMTP_PORT || 587,
  auth: { 
    user: process.env.SMTP_USER || '', 
    pass: process.env.SMTP_PASS || '' 
  }
});

// Submit Form (Staff Step)
router.post('/submit', upload.array('attachments', 5), async (req, res) => {
  try {
    const submissionId = `SILAH-TRV-${Math.floor(100000 + Math.random() * 900000)}`;
    const attachmentPaths = req.files ? req.files.map(file => file.path) : [];

    const expensesData = typeof req.body.expenses === 'string' 
      ? JSON.parse(req.body.expenses) 
      : req.body.expenses;

    const formData = new TravelForm({
      ...req.body,
      expenses: expensesData,
      attachments: attachmentPaths,
      submissionId,
      status: 'Pending CEO Approval'
    });

    await formData.save();

    try {
      const mailOptions = {
        from: '"Silah Travel Portal" <no-reply@silah.bh>',
        to: process.env.CEO_EMAIL || 'ceo@silah.bh',
        subject: `[ACTION REQUIRED] Travel Approval Request: ${formData.name} (${submissionId})`,
        html: `
          <h3>New Travel Approval Request Submitted</h3>
          <p><strong>Employee:</strong> ${formData.name} (${formData.department})</p>
          <p><strong>Route:</strong> ${formData.travelFrom} to ${formData.travelTo}</p>
          <p><strong>Total Cost:</strong> ${formData.expenses?.totalEstimatedCost?.toFixed(3) || 0.000} BHD</p>
          <p>Please log in to the portal to review and sign.</p>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.warn('Email notification skipped (SMTP offline):', mailErr.message);
    }

    res.status(201).json({ message: 'Travel form submitted successfully', data: formData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Travel Claim Route
router.put('/:id', upload.array('attachments', 5), async (req, res) => {
  try {
    const expensesData = typeof req.body.expenses === 'string' 
      ? JSON.parse(req.body.expenses) 
      : req.body.expenses;

    const existingForm = await TravelForm.findById(req.params.id);
    if (!existingForm) return res.status(404).json({ error: 'Form not found' });

    const newAttachmentPaths = req.files ? req.files.map(file => file.path) : [];
    const updatedAttachments = [...(existingForm.attachments || []), ...newAttachmentPaths];

    const updateData = {
      ...req.body,
      expenses: expensesData,
      attachments: updatedAttachments
    };

    const updatedForm = await TravelForm.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ message: 'Travel claim updated successfully', data: updatedForm });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Travel Claim Route
router.delete('/:id', async (req, res) => {
  try {
    const deletedForm = await TravelForm.findByIdAndDelete(req.params.id);
    if (!deletedForm) return res.status(404).json({ error: 'Form not found' });
    res.json({ message: 'Travel claim deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CEO Action & Dispatch to Staff + Finance
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

    try {
      const recipientEmails = [form.email, process.env.FINANCE_EMAIL || 'finance@silah.bh'].join(',');
      const statusMail = {
        from: '"Silah Executive Office" <ceo-office@silah.bh>',
        to: recipientEmails,
        subject: `[${status.toUpperCase()}] Travel Approval Request: ${form.submissionId}`,
        html: `
          <h2>Silah Gulf WLL - Travel Approval Notification</h2>
          <p>The travel request for <strong>${form.name}</strong> (${form.travelFrom} → ${form.travelTo}) has been <strong>${status}</strong> by Executive Management.</p>
          <hr/>
          <p><strong>Total Approved Budget:</strong> ${form.expenses.totalEstimatedCost.toFixed(3)} BHD</p>
          <p><strong>CEO Comments:</strong> ${ceoComments || 'Approved as requested.'}</p>
          <p><strong>Finance Department Action:</strong> ${status === 'Approved' ? 'Proceed with disbursement setup and travel booking.' : 'No further action required.'}</p>
        `
      };
      await transporter.sendMail(statusMail);
    } catch (mailErr) {
      console.warn('Status email notification skipped (SMTP offline):', mailErr.message);
    }

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