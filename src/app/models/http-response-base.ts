export interface AppHttpResponseBase<T> {
  status: number;
  data: T;
}