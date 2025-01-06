// src/models/Models.ts

export interface LoginErrors {
  username?: string;
  password?: string;
}

export interface SignupErrors {
  name?: string;
  email?: string;
  whatsappnumber?: string;
  password?: string;
  userRegistered?: string;
}
export interface ForgotErrors {
  email?:string;
  response?:string;
  password?:string;
  message?:string
}
