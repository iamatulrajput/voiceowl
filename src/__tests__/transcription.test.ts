import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { Transcription } from '../models/Transcription';

describe('Transcription API', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/voiceowl_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Transcription.deleteMany({});
  });

  describe('POST /api/transcription', () => {
    it('should create a new transcription', async () => {
      const response = await request(app)
        .post('/api/transcription')
        .send({ audioUrl: 'https://example.com/audio.mp3' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.audioUrl).toBe('https://example.com/audio.mp3');
      expect(response.body.data.transcription).toBeDefined();
      expect(response.body.data.source).toBe('mock');
      expect(response.body.data.createdAt).toBeDefined();
    });

    it('should return 400 for invalid URL', async () => {
      const response = await request(app)
        .post('/api/transcription')
        .send({ audioUrl: 'invalid-url' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for missing audioUrl', async () => {
      const response = await request(app)
        .post('/api/transcription')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/transcriptions', () => {
    beforeEach(async () => {
      const transcriptions = [
        {
          audioUrl: 'https://example.com/audio1.mp3',
          transcription: 'Test transcription 1',
          source: 'mock',
          createdAt: new Date(),
        },
        {
          audioUrl: 'https://example.com/audio2.mp3',
          transcription: 'Test transcription 2',
          source: 'mock',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        },
        {
          audioUrl: 'https://example.com/audio3.mp3',
          transcription: 'Test transcription 3',
          source: 'mock',
          createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago (should be filtered out)
        },
      ];

      await Transcription.insertMany(transcriptions);
    });

    it('should return transcriptions from last 30 days', async () => {
      const response = await request(app)
        .get('/api/transcriptions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toHaveProperty('total', 2);
      expect(response.body.pagination).toHaveProperty('pages', 1);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/transcriptions?page=1&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.pages).toBe(2);
    });

    it('should return 400 for invalid page parameter', async () => {
      const response = await request(app)
        .get('/api/transcriptions?page=-1')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/transcription/:id', () => {
    let transcriptionId: string;

    beforeEach(async () => {
      const transcription = await Transcription.create({
        audioUrl: 'https://example.com/audio.mp3',
        transcription: 'Test transcription',
        source: 'mock',
      });
      transcriptionId = (transcription._id as any).toString();
    });

    it('should return a transcription by ID', async () => {
      const response = await request(app)
        .get(`/api/transcription/${transcriptionId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(transcriptionId);
      expect(response.body.data.audioUrl).toBe('https://example.com/audio.mp3');
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/transcription/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Transcription not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/transcription/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/azure-transcription', () => {
    it('should create a transcription with Azure service', async () => {
      const response = await request(app)
        .post('/api/azure-transcription')
        .send({
          audioUrl: 'https://example.com/audio.mp3',
          language: 'en-US',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.source).toBe('azure');
      expect(response.body.data.transcription).toBeDefined();
    });

    it('should use default language if not provided', async () => {
      const response = await request(app)
        .post('/api/azure-transcription')
        .send({ audioUrl: 'https://example.com/audio.mp3' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.source).toBe('azure');
    });
  });

  describe('GET /api/azure-languages', () => {
    it('should return supported languages', async () => {
      const response = await request(app)
        .get('/api/azure-languages')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data).toContain('en-US');
    });
  });

  describe('GET /api/health', () => {
    it('should return server health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });
});

