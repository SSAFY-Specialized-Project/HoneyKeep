export interface RequestCredentialsRequest {
    "X-Signature" : string;
    "X-Timestamp": string;
    [key : string] : string;
}