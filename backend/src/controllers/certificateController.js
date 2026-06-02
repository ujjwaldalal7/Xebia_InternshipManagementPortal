import CertificateService from '../services/certificateService.js';
import { successResponse  } from '../utils/responseFormatter.js';

export const issueCertificate = async (req, res, next) => {
  try {
    const cert = await CertificateService.issueCertificate(req.body, req.user);
    successResponse(res, 201, 'Certificate issued', cert);
  } catch (error) { next(error); }
};

export const getCertificates = async (req, res, next) => {
  try {
    const certs = await CertificateService.getCertificates(req.query, req.user);
    successResponse(res, 200, 'Certificates retrieved', certs);
  } catch (error) { next(error); }
};

export const getCertificateById = async (req, res, next) => {
  try {
    const cert = await CertificateService.getCertificateById(req.params.id);
    successResponse(res, 200, 'Certificate retrieved', cert);
  } catch (error) { next(error); }
};

export const verifyCertificate = async (req, res, next) => {
  try {
    const cert = await CertificateService.verifyCertificate(req.params.certificateId);
    successResponse(res, 200, 'Certificate verified', cert);
  } catch (error) { next(error); }
};
