import { Router, Request, Response } from 'express';
import transcriptionRoutes from './transcriptionRoutes';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'VoiceOwl API v1.0',
    endpoints: {
      health: '/api/health',
      transcription: 'POST /api/transcription',
      transcriptions: 'GET /api/transcriptions',
      transcriptionById: 'GET /api/transcription/:id',
      azureTranscription: 'POST /api/azure-transcription',
      azureLanguages: 'GET /api/azure-languages',
    },
  });
});

router.use(transcriptionRoutes);

export default router;

