export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}
