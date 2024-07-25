import { Schema, Document } from 'mongoose';

export interface UrlDocument extends Document {
  readonly shortUrl: string;
  readonly originalUrl: string;
  readonly action: string;
}

export const UrlSchema = new Schema({
  shortUrl: { type: String, required: true },
  originalUrl: { type: String, required: true },
  action: { type: String, required: true },
});
