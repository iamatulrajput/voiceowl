import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { transcriptionController } from '../controllers/transcriptionController';
import { validate } from '../middlewares/validator';

const router = Router();

router.post(
  '/transcription',
  [
    body('audioUrl')
      .isURL()
      .withMessage('Please provide a valid audio URL')
      .notEmpty()
      .withMessage('Audio URL is required'),
    validate,
  ],
  transcriptionController.createTranscription.bind(transcriptionController)
);

router.get(
  '/transcriptions',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    validate,
  ],
  transcriptionController.getTranscriptions.bind(transcriptionController)
);

router.get(
  '/transcription/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Please provide a valid transcription ID'),
    validate,
  ],
  transcriptionController.getTranscriptionById.bind(transcriptionController)
);

router.post(
  '/azure-transcription',
  [
    body('audioUrl')
      .isURL()
      .withMessage('Please provide a valid audio URL')
      .notEmpty()
      .withMessage('Audio URL is required'),
    body('language')
      .optional()
      .isString()
      .withMessage('Language must be a string'),
    validate,
  ],
  transcriptionController.createAzureTranscription.bind(transcriptionController)
);

router.get(
  '/azure-languages',
  transcriptionController.getSupportedLanguages.bind(transcriptionController)
);

export default router;

