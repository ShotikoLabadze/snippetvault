import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Snippet extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  code: string;

  @Prop()
  language: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);
