import { Document, Model, model, Schema, SchemaTypes } from 'mongoose';

export type UserType = {
  email: string;
  password: string;
  role: string;
};

export type UserDocument = UserType & Document;

export const UserSchema = (): Schema<UserDocument> =>
  new Schema<UserDocument>({
    email: SchemaTypes.String,
    password: SchemaTypes.String,
    role: SchemaTypes.String,
  });

export const User = (schema: Schema<UserDocument>): Model<UserDocument> => model('User', schema);
