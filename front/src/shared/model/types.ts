export type Bank = "시티은행"
    | "대구은행"
    | "광주은행"
    | "기업은행"
    | "한국은행"
    | "농협은행"
    | "산업은행"
    | "SC제일은행"
    | "우리은행"
    | "국민은행";

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