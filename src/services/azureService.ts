import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { config } from '../config';
import { logger } from '../utils/logger';
import { retryWithBackoff } from '../utils/retry';
import { AppError } from '../middlewares/errorHandler';
import { Transcription, ITranscription } from '../models/Transcription';
import { audioService } from './audioService';

export class AzureService {
  private speechConfig: sdk.SpeechConfig | null = null;

  constructor() {
    this.initializeSpeechConfig();
  }

  private initializeSpeechConfig(): void {
    if (!config.azure.speechKey || !config.azure.speechRegion) {
      logger.warn('Azure Speech credentials not configured. Using mock mode.');
      return;
    }

    try {
      this.speechConfig = sdk.SpeechConfig.fromSubscription(
        config.azure.speechKey,
        config.azure.speechRegion
      );
      
      if (config.azure.speechEndpoint) {
        this.speechConfig.endpointId = config.azure.speechEndpoint;
      }
      
      logger.info('Azure Speech Service initialized');
    } catch (error) {
      logger.error('Failed to initialize Azure Speech Config:', error);
    }
  }

  async transcribeAudio(
    audioUrl: string,
    language: string = 'en-US'
  ): Promise<ITranscription> {
    if (!this.speechConfig) {
      return this.mockAzureTranscription(audioUrl, language);
    }

    return retryWithBackoff(
      () => this.performAzureTranscription(audioUrl, language),
      {
        maxRetries: config.api.maxRetries,
        retryDelay: config.api.retryDelay,
        exponentialBackoff: true,
      },
      'Azure transcription'
    );
  }

  private async performAzureTranscription(
    audioUrl: string,
    language: string
  ): Promise<ITranscription> {
    try {
      logger.info(`Starting Azure transcription for: ${audioUrl}`);
      
      await audioService.downloadAudio(audioUrl);

      if (!this.speechConfig) {
        throw new AppError('Azure Speech Config not initialized', 500);
      }

      this.speechConfig.speechRecognitionLanguage = language;

      const audioConfig = sdk.AudioConfig.fromWavFileInput(Buffer.from(''));
      const recognizer = new sdk.SpeechRecognizer(this.speechConfig, audioConfig);

      const transcriptionText = await new Promise<string>((resolve, reject) => {
        let fullText = '';

        recognizer.recognized = (_s, e) => {
          if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
            fullText += e.result.text + ' ';
          }
        };

        recognizer.canceled = (_s, e) => {
          recognizer.close();
          reject(new AppError(`Azure transcription canceled: ${e.errorDetails}`, 500));
        };

        recognizer.sessionStopped = () => {
          recognizer.close();
          resolve(fullText.trim());
        };

        recognizer.startContinuousRecognitionAsync();
      });

      const transcription = await Transcription.create({
        audioUrl,
        transcription: transcriptionText,
        source: 'azure',
        language,
      });

      logger.info(`Azure transcription created with ID: ${transcription._id}`);
      
      return transcription;
    } catch (error) {
      logger.error('Azure transcription error:', error);
      throw error;
    }
  }

  private async mockAzureTranscription(
    audioUrl: string,
    language: string
  ): Promise<ITranscription> {
    logger.info(`Mock Azure transcription for: ${audioUrl} (language: ${language})`);
    
    await audioService.downloadAudio(audioUrl);
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockTranscription = this.generateMockAzureTranscription(language);

    const transcription = await Transcription.create({
      audioUrl,
      transcription: mockTranscription,
      source: 'azure',
      language,
    });

    logger.info(`Mock Azure transcription created with ID: ${transcription._id}`);
    
    return transcription;
  }

  private generateMockAzureTranscription(language: string): string {
    const transcriptions: Record<string, string> = {
      'en-US': 'This is a mock transcription from Azure Speech Service. The audio has been successfully processed and converted to text.',
      'es-ES': 'Esta es una transcripción simulada del servicio Azure Speech. El audio se ha procesado con éxito y convertido a texto.',
      'fr-FR': "Ceci est une transcription simulée du service Azure Speech. L'audio a été traité avec succès et converti en texte.",
      'de-DE': 'Dies ist eine simulierte Transkription des Azure Speech Service. Die Audiodatei wurde erfolgreich verarbeitet und in Text umgewandelt.',
    };

    return transcriptions[language] || transcriptions['en-US'];
  }

  getSupportedLanguages(): string[] {
    return [
      'en-US', 'en-GB', 'es-ES', 'es-MX', 'fr-FR', 'de-DE',
      'it-IT', 'pt-BR', 'pt-PT', 'ja-JP', 'ko-KR', 'zh-CN',
    ];
  }
}

export const azureService = new AzureService();

