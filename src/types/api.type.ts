export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: Meta;
}

/** Envelope returned by every paginated list endpoint (`sendPaginated` on the backend). */
export interface ListResponse<T> extends ApiResponse<T[]> {
  meta?: Meta;
}
