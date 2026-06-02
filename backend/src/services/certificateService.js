import Certificate from '../models/Certificate.js';
import Application from '../models/Application.js';
import AppError from '../utils/AppError.js';
import { randomUUID } from 'crypto';
import UploadService from './uploadService.js';
import PDFDocument from 'pdfkit';

function generatePDFBuffer(certData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Draw Certificate Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f9fafb');
      doc.rect(10, 10, doc.page.width - 20, doc.page.height - 20).stroke('#023e8a');

      doc.moveDown(2);
      doc.fontSize(20).fillColor('#4b5563').text('INTERNSHIP MANAGEMENT PORTAL', { align: 'center' });

      doc.moveDown(1.5);
      doc.fontSize(45).fillColor('#1d4ed8').text('CERTIFICATE OF COMPLETION', { align: 'center' });

      doc.moveDown(2);
      doc.fontSize(18).fillColor('#374151').text('This is proudly presented to', { align: 'center' });

      doc.moveDown();
      doc.fontSize(35).fillColor('#111827').text(certData.internName, { align: 'center' });

      doc.moveDown();
      doc.fontSize(16).fillColor('#4b5563').text(`For successfully completing the ${certData.internshipTitle}`, { align: 'center' });
      doc.text(`internship program with a grade of ${certData.grade}.`, { align: 'center' });

      doc.moveDown(1.5);
      doc.fontSize(12).fillColor('#6b7280').text(`Certificate ID: ${certData.certificateId}`, { align: 'center' });

      doc.moveDown(3);
      doc.fontSize(14).fillColor('#111827')
        .text(`Issued Date: ${new Date().toLocaleDateString()}`, 100, doc.page.height - 100)
        .text(`Authorized By: ${certData.mentorName}`, doc.page.width - 300, doc.page.height - 100);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

class CertificateService {
  static generateCertificateId() {
    return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  static async issueCertificate(data, user) {
    const { internId, internshipId, grade, remarks } = data;
    const accepted = await Application.findOne({ intern: internId, internship: internshipId, status: 'accepted' })
      .populate('intern', 'name email')
      .populate('internship', 'title');

    if (!accepted) throw new AppError('Intern not accepted for this internship', 400);

    const existing = await Certificate.findOne({ intern: internId, internship: internshipId });
    if (existing) throw new AppError('Certificate already issued', 409);

    const certificateId = this.generateCertificateId();
    const finalGrade = 'excellent';

    // Generate PDF
    const pdfBuffer = await generatePDFBuffer({
      internName: accepted.intern.name,
      internshipTitle: accepted.internship.title,
      certificateId,
      grade: finalGrade,
      mentorName: user.name,
    });

    // Upload to Cloudinary
    const uploadResult = await UploadService.uploadToCloudinary(pdfBuffer, {
      folder: 'internship-portal/certificates',
      resource_type: 'image', // Cloudinary treats PDFs as images for transformations/display
      format: 'pdf',
    });

    const certificate = await Certificate.create({
      intern: internId,
      internship: internshipId,
      issuedBy: user._id,
      certificateId,
      grade: finalGrade,
      remarks: remarks || '',
      certificateUrl: uploadResult
    });

    return await certificate.populate([
      { path: 'intern', select: 'name email avatar' },
      { path: 'internship', select: 'title company duration' },
      { path: 'issuedBy', select: 'name email' },
    ]);
  }

  static async getCertificates(query = {}, user) {
    const filter = {};
    if (user.role === 'intern') filter.intern = user._id;
    if (query.internshipId) filter.internship = query.internshipId;
    const certificates = await Certificate.find(filter)
      .populate('intern', 'name email avatar')
      .populate('internship', 'title company duration')
      .populate('issuedBy', 'name email')
      .sort({ issueDate: -1 });
    return certificates;
  }

  static async getCertificateById(id) {
    const cert = await Certificate.findById(id)
      .populate('intern', 'name email avatar college department')
      .populate('internship', 'title company duration domain')
      .populate('issuedBy', 'name email');
    if (!cert) throw new AppError('Certificate not found', 404);
    return cert;
  }

  static async verifyCertificate(certificateId) {
    const cert = await Certificate.findOne({ certificateId })
      .populate('intern', 'name email')
      .populate('internship', 'title company duration');
    if (!cert) throw new AppError('Invalid certificate ID', 404);
    return cert;
  }
}

export default CertificateService;
