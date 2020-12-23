# ts-async_component-react

[![license](https://img.shields.io/badge/license-MIT%2FApache--2.0-blue")](LICENSE-MIT)
[![docs](https://img.shields.io/badge/docs-typescript-blue.svg)](https://aicacia.gitlab.io/libs/ts-async_component-react/)
[![npm (scoped)](https://img.shields.io/npm/v/@aicacia/async_component-react)](https://www.npmjs.com/package/@aicacia/async_component-react)
[![pipelines](https://gitlab.com/aicacia/libs/ts-async_component-react/badges/master/pipeline.svg)](https://gitlab.com/aicacia/libs/ts-async_component-react/-/pipelines)

aicacia async component for react

## Async Component

```tsx
import { Async } from "@aicacia/async_component-react";

<Async
  promise={Promise.resolve("Hello, world!")}
  onSuccess={(value) => value} // displays promise result "Hello, world!"
  onPending={() => "Loading..."}
  onError={(error) => error.message} // on error so message
/>;
```

## useAsync hook

```tsx
import { useAsync } from "@aicacia/async_component-react";

function AsyncHook() {
  const result = useAsync(Promise.resolve("Hello, world!"));

  return (
    <div>
      {result
        .map((result) => {
          if (result.isOk()) {
            return result.unwrap();
          } else {
            return result.unwrapErr().message;
          }
        })
        .unwrapOr("Loading...")}
    </div>
  );
}
```
