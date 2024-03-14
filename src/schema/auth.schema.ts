import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Auth {
  @Prop()
  token: string;

  @Prop()
  phoneNumber: number;
}

export type AuthDocument = HydratedDocument<Auth>;

export const AuthSchema = SchemaFactory.createForClass(Auth);
