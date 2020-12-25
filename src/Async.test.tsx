import { render } from "@testing-library/react";
import { JSDOM } from "jsdom";
import * as tape from "tape";
import { Async, useAsync } from ".";

const dom = new JSDOM();

(global as any).window = dom.window;
(global as any).document = dom.window.document;

interface IAsyncComponentProps {
  promise: Promise<string>;
}

function AsyncComponent(props: IAsyncComponentProps) {
  return (
    <Async
      promise={props.promise}
      onSuccess={(value) => <p>{value}</p>}
      onPending={() => <p>Loading...</p>}
      onError={(error) => <p>{error.message}</p>}
    />
  );
}

tape("Async fulfilled", async (assert: tape.Test) => {
  const promise = Promise.resolve("Hello, world!");

  const wrapper = render(<AsyncComponent promise={promise} />);

  assert.true(wrapper.getByText("Loading..."));

  await promise;
  assert.true(wrapper.getByText("Hello, world!"));

  wrapper.unmount();
  assert.end();
});

tape("Async rejected", (assert: tape.Test) => {
  const promise: Promise<string> = Promise.reject(new Error("Rejected"));

  const wrapper = render(<AsyncComponent promise={promise} />);

  assert.true(wrapper.getByText("Loading..."));

  setTimeout(() => {
    assert.true(wrapper.getByText("Rejected"));
    wrapper.unmount();
    assert.end();
  });
});

interface IAsyncHookProps {
  promise: Promise<string>;
}

function AsyncHook(props: IAsyncHookProps) {
  const result = useAsync(props.promise);

  return (
    <>
      {result
        .map((result) => {
          if (result.isOk()) {
            return result.unwrap();
          } else {
            return result.unwrapErr().message;
          }
        })
        .unwrapOr("Loading...")}
    </>
  );
}

tape("useAsync fulfilled", async (assert: tape.Test) => {
  const promise = Promise.resolve("Hello, world!");

  const wrapper = render(<AsyncHook promise={promise} />);

  assert.true(wrapper.getByText("Loading..."));

  await promise;
  assert.true(wrapper.getByText("Hello, world!"));

  wrapper.unmount();
  assert.end();
});

tape("useAsync rejected", (assert: tape.Test) => {
  const promise: Promise<string> = Promise.reject(new Error("Rejected"));

  const wrapper = render(<AsyncHook promise={promise} />);

  assert.true(wrapper.getByText("Loading..."));

  setTimeout(() => {
    assert.true(wrapper.getByText("Rejected"));
    wrapper.unmount();
    assert.end();
  });
});
