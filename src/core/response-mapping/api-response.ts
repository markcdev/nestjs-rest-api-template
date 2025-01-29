import { HttpStatusCode } from 'axios';

export interface ApiResponse<TData = null> {
  data: TData;
  errors: string[]; // TODO - make type
  method: string;
  path: string;
  statusCode: HttpStatusCode;
  timestamp: string;
}
