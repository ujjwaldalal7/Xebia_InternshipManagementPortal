import Certificate from '../models/Certificate.js';
import Application from '../models/Application.js';
import AppError from '../utils/AppError.js';
import { randomUUID } from 'crypto';

class CertificateService {
  static generateCertificateId() {
    return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  static async issueCertificate(data, user) {
    const { internId, internshipId, grade, remarks } = data;
    const accepted = await Application.findOne({ intern: internId, internship: internshipId, status: 'accepted' });
    if (!accepted) throw new AppError('Intern not accepted for this internship', 400);
    const existing = await Certificate.findOne({ intern: internId, internship: internshipId });
    if (existing) throw new AppError('Certificate already issued', 409);
    const certificate = await Certificate.create({
      intern: internId, internship: internshipId, issuedBy: user._id,
      certificateId: this.generateCertificateId(), grade: grade || 'B', remarks: remarks || '',
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
