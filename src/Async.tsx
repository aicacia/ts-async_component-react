import { useAsync } from "./useAsync";

export interface IAsyncProps<T, E = Error> {
  promise: Promise<T>;
  onSuccess(value: T): JSX.Element;
  onError(error: E): JSX.Element;
  onPending(): JSX.Element;
}

export function Async<T, E = Error>(props: IAsyncProps<T, E>) {
  return useAsync<T, E>(props.promise)
    .map((result) =>
      result.isOk()
        ? props.onSuccess(result.unwrap())
        : props.onError(result.unwrapErr())
    )
    .unwrapOrElse(props.onPending);
}
