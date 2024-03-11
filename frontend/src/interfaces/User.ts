export interface IUser {
  _id?: string;
  userName: string;
  email: string;
  password:string;
  confirmPassword:string;
  isAdmin?: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}
