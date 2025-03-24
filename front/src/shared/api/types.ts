export interface ResponseDTO<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ResponseErrorDTO {
  status: number;
  name: string;
  message: string;
}