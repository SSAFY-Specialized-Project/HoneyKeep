export interface UserDTO {
  name: string;
  identityNumber: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface SendEmailRequest {
  email: string;
}

export interface SendEmailCodeRequest {
  email: string;
  code: number;
}

// 유저 검증
export interface ValidateUserRequest {
  name: string;
  identityNumber: string;
  phoneNumber: string;
  email: string;
}

// 회원가입
export interface RegisterUserRequest {
  name: string;
  identityNumber: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface RegisterUserResponse {
  userKey: string;
}

// 로그인
export interface LoginUserRequset {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  accessToken: string;
}

// 비밀번호 인증
export interface ValidatePasswordRequest {
  password: string;
}
