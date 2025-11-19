export interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
  total_pages?: number;
  totalPages?: number;
  pages?: number;
  page_count?: number;
  page_size?: number;
  pageSize?: number;
  per_page?: number;
  limit?: number;
  current_page?: number;
  currentPage?: number;
  page?: number;
  page_number?: number;
  has_next?: boolean;
  hasNext?: boolean;
  has_more?: boolean;
  hasMore?: boolean;
  has_prev?: boolean;
  hasPrev?: boolean;
  prev_page?: number;
  next_page?: number;
  pagination?: any;
  meta?: any;
}
