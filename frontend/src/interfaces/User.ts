export interface IUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}
