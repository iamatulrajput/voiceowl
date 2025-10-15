import { Request, Response, NextFunction } from 'express';
import { transcriptionService } from '../services/transcriptionService';
import { azureService } from '../services/azureService';
import { logger } from '../utils/logger';
import { ApiResponse, PaginatedResponse, TranscriptionResponse } from '../types';

export class TranscriptionController {
  async createTranscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { audioUrl } = req.body;

      logger.info(`Creating transcription for: ${audioUrl}`);

      const transcription = await transcriptionService.createMockTranscription(audioUrl);

      const response: ApiResponse<TranscriptionResponse> = {
        success: true,
        data: {
          _id: String(transcription._id),
          audioUrl: transcription.audioUrl,
          transcription: transcription.transcription,
          source: transcription.source,
          createdAt: transcription.createdAt,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTranscriptions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      logger.info(`Fetching transcriptions for last 30 days (page: ${page}, limit: ${limit})`);

      const { transcriptions, total, pages } = 
        await transcriptionService.getTranscriptionsLast30Days(page, limit);

      const response: PaginatedResponse<TranscriptionResponse> = {
        success: true,
        data: transcriptions.map(t => ({
          _id: String(t._id),
          audioUrl: t.audioUrl,
          transcription: t.transcription,
          source: t.source,
          createdAt: t.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTranscriptionById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const transcription = await transcriptionService.getTranscriptionById(id);

      if (!transcription) {
        res.status(404).json({
          success: false,
          error: 'Transcription not found',
        });
        return;
      }

      const response: ApiResponse<TranscriptionResponse> = {
        success: true,
        data: {
          _id: String(transcription._id),
          audioUrl: transcription.audioUrl,
          transcription: transcription.transcription,
          source: transcription.source,
          createdAt: transcription.createdAt,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createAzureTranscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { audioUrl, language = 'en-US' } = req.body;

      logger.info(`Creating Azure transcription for: ${audioUrl} (language: ${language})`);

      const transcription = await azureService.transcribeAudio(audioUrl, language);

      const response: ApiResponse<TranscriptionResponse> = {
        success: true,
        data: {
          _id: String(transcription._id),
          audioUrl: transcription.audioUrl,
          transcription: transcription.transcription,
          source: transcription.source,
          createdAt: transcription.createdAt,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  getSupportedLanguages(_req: Request, res: Response): void {
    const languages = azureService.getSupportedLanguages();
    
    res.status(200).json({
      success: true,
      data: languages,
    });
  }
}

export const transcriptionController = new TranscriptionController();

