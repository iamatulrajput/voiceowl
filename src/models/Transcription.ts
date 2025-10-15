import mongoose, { Schema, Document } from 'mongoose';

export interface ITranscription extends Document {
  audioUrl: string;
  transcription: string;
  source: 'mock' | 'azure';
  language?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transcriptionSchema = new Schema<ITranscription>(
  {
    audioUrl: {
      type: String,
      required: [true, 'Audio URL is required'],
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid URL',
      },
    },
    transcription: {
      type: String,
      required: [true, 'Transcription text is required'],
      trim: true,
    },
    source: {
      type: String,
      enum: ['mock', 'azure'],
      default: 'mock',
      required: true,
    },
    language: {
      type: String,
      trim: true,
      default: 'en-US',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for optimized queries
transcriptionSchema.index({ createdAt: -1 });
transcriptionSchema.index({ audioUrl: 1 });
transcriptionSchema.index({ source: 1 });
transcriptionSchema.index({ createdAt: -1, source: 1 });

// TTL index for automatic document deletion after 90 days (optional)
// transcriptionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export const Transcription = mongoose.model<ITranscription>('Transcription', transcriptionSchema);

