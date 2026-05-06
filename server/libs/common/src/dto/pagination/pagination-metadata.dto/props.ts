import { PaginationParamsQuery } from '@app/common/validation';

export interface PaginationMetadataDtoParameters {
  paginationQueryDto: PaginationParamsQuery;
  count: number;
}
