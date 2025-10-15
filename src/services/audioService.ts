import { logger } from '../utils/logger';
import { retryWithBackoff } from '../utils/retry';
import { config } from '../config';
import { AppError } from '../middlewares/errorHandler';

export class AudioService {
  async downloadAudio(audioUrl: string): Promise<Buffer> {
    if (config.audio.mockDownload) {
      return this.mockDownloadAudio(audioUrl);
    }
    
    return retryWithBackoff(
      () => this.realDownloadAudio(audioUrl),
      {
        maxRetries: config.api.maxRetries,
        retryDelay: config.api.retryDelay,
        exponentialBackoff: true,
      },
      'Audio download'
    );
  }

  private async mockDownloadAudio(audioUrl: string): Promise<Buffer> {
    logger.info(`Mock downloading audio from: ${audioUrl}`);
    
    await this.simulateDelay(1000);
    
    if (Math.random() < 0.05) {
      throw new AppError('Simulated download failure', 500);
    }
    
    return Buffer.from('mock-audio-data');
  }

  private async realDownloadAudio(audioUrl: string): Promise<Buffer> {
    logger.info(`Downloading audio from: ${audioUrl}`);
    
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.audio.downloadTimeout);

      const response = await fetch(audioUrl, {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new AppError(`Failed to download audio: ${response.statusText}`, response.status);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new AppError('Audio download timeout', 408);
      }
      throw error;
    }
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  validateAudioUrl(audioUrl: string): boolean {
    try {
      const url = new URL(audioUrl);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }
}

export const audioService = new AudioService();

