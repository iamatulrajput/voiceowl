import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/voiceowl',
  mongoUriTest: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/voiceowl_test',
  
  azure: {
    speechKey: process.env.AZURE_SPEECH_KEY || '',
    speechRegion: process.env.AZURE_SPEECH_REGION || '',
    speechEndpoint: process.env.AZURE_SPEECH_ENDPOINT || '',
  },
  
  api: {
    timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
    retryDelay: parseInt(process.env.RETRY_DELAY || '1000', 10),
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  
  audio: {
    mockDownload: process.env.MOCK_AUDIO_DOWNLOAD === 'true',
    downloadTimeout: parseInt(process.env.AUDIO_DOWNLOAD_TIMEOUT || '10000', 10),
  },
};

