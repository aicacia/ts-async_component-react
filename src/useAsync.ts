import { Option, Result, ok, err, none, some } from "@aicacia/core";
import { useEffect, useState } from "react";

export function useAsync<T, E = Error>(
  promise: Promise<T>
): Option<Result<T, E>> {
  const [result, setResult] = useState<Option<Result<T, E>>>(none());

  useEffect(() => {
    promise
      .then((value) => setResult(some(ok(value))))
      .catch((error) => setResult(some(err(error))));
  }, [promise]);

  return result;
}
