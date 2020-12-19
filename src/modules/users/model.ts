import { Schema, Document, model } from 'mongoose';
import { User } from './types'

export interface UserDoc extends Document<User>{
  _doc: User
}
export const UserSchema: Schema<UserDoc> = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true},
  organization: { type: String, required: true },
  password: { type: String, required: true},
  channels: [String]
});

UserSchema.index({ organization: 1, username: 1}, { unique: true })

export const getUsersModel = () => model<UserDoc>('User', UserSchema, `users`);

// Export the model and return your IUser interface
export default {
  getUsersModel
};