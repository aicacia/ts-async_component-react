import { ReactNode } from "react";
import { none, some, Option, ok, err, Result } from "@aicacia/core";
import { SafeStateComponent } from "@aicacia/safe_state_component-react";

export interface IAsyncProps<T, E = Error> {
  promise: Promise<T>;
  onSuccess(value: T): ReactNode;
  onError(error: E): ReactNode;
  onPending(): ReactNode;
}
export interface IAsyncState<T, E = Error> {
  result: Option<Result<T, E>>;
}

export class Async<T, E = Error> extends SafeStateComponent<
  IAsyncProps<T, E>,
  IAsyncState<T, E>
  > {
  state: IAsyncState<T, E> = {
    result: none(),
  };

  private initPromise(promise: Promise<T>) {
    promise
      .then((value) => this.safeSetState({ result: some(ok(value)) }))
      .catch((error) => this.safeSetState({ result: some(err(error)) }));

    if (this.state.result.isSome()) {
      this.safeSetState({
        result: none(),
      });
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.initPromise(this.props.promise);
  }
  componentDidUpdate(prev: IAsyncProps<T, E>) {
    if (prev.promise !== this.props.promise) {
      this.initPromise(this.props.promise);
    }
  }
  render() {
    return this.state.result
      .map((result) =>
        result.isOk()
          ? this.props.onSuccess(result.unwrap())
          : this.props.onError(result.unwrapErr())
      )
      .unwrapOrElse(this.props.onPending);
  }
}
