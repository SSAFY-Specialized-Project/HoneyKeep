export interface UserDTO {
  name: string;
  identityNumber: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface SendEmailResponse {
  email: string;
}

export interface SendEmailCodeResponse {
  email: string;
  code: number;
}