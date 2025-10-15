import { Transcription, ITranscription } from '../models/Transcription';
import { audioService } from './audioService';
import { logger } from '../utils/logger';

export class TranscriptionService {
  async createMockTranscription(audioUrl: string): Promise<ITranscription> {
    try {
      await audioService.downloadAudio(audioUrl);
      
      const mockTranscription = this.generateMockTranscription(audioUrl);
      
      const transcription = await Transcription.create({
        audioUrl,
        transcription: mockTranscription,
        source: 'mock',
        language: 'en-US',
      });

      logger.info(`Transcription created with ID: ${transcription._id}`);
      
      return transcription;
    } catch (error) {
      logger.error('Error creating transcription:', error);
      throw error;
    }
  }

  async getTranscriptionsLast30Days(
    page: number = 1,
    limit: number = 10
  ): Promise<{ transcriptions: ITranscription[]; total: number; pages: number }> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const skip = (page - 1) * limit;

      const [transcriptions, total] = await Promise.all([
        Transcription.find({ createdAt: { $gte: thirtyDaysAgo } })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip)
          .exec(),
        Transcription.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      ]);

      return {
        transcriptions,
        total,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('Error fetching transcriptions:', error);
      throw error;
    }
  }

  async getTranscriptionById(id: string): Promise<ITranscription | null> {
    try {
      const transcription = await Transcription.findById(id);
      return transcription;
    } catch (error) {
      logger.error(`Error fetching transcription ${id}:`, error);
      throw error;
    }
  }

  private generateMockTranscription(audioUrl: string): string {
    const mockTexts = [
      'This is a sample transcription of the audio file. The content discusses various topics related to technology and innovation.',
      'Welcome to our podcast. Today we will be discussing the latest trends in artificial intelligence and machine learning.',
      'In this recording, we explore the fundamentals of cloud computing and its impact on modern businesses.',
      'This audio contains important information about project requirements and deliverables for the upcoming quarter.',
      'The speaker talks about best practices in software development and the importance of code quality.',
    ];

    const randomIndex = Math.floor(Math.random() * mockTexts.length);
    return `${mockTexts[randomIndex]} [Source: ${audioUrl}]`;
  }
}

export const transcriptionService = new TranscriptionService();

