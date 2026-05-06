import { Either } from './either.interface';

export type Nullable<T> = Either<T, null>;
