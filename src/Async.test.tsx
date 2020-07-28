import * as Enzyme from "enzyme";
import * as EnzymeAdapter from "enzyme-adapter-react-16";
import { parse } from "url";
// @ts-ignore
import { JSDOM } from "jsdom";
import * as React from "react";
import * as tape from "tape";
import { Async } from ".";

const dom = new JSDOM("<!doctype html><html><body></body></html>");

(global as any).document = dom.window.document;
(global as any).window = dom.window;

Enzyme.configure({ adapter: new EnzymeAdapter() });

const run = (fn: () => void, ms: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      fn();
      resolve();
    }, ms)
  );

tape("Async fulfilled", async (assert: tape.Test) => {
  const promise = Promise.resolve("Hello, world!");

  const wrapper = Enzyme.mount(
    <Async
      promise={promise}
      onSuccess={(value) => value}
      onPending={() => "Loading..."}
      onError={(error) => error.message}
    />
  );

  assert.equal(wrapper.getDOMNode().textContent, "Loading...");

  await promise;
  assert.equal(wrapper.getDOMNode().textContent, "Hello, world!");

  assert.end();
});

tape("Async rejected", (assert: tape.Test) => {
  const promise: Promise<string> = Promise.reject(new Error("Rejected"));

  const wrapper = Enzyme.mount(
    <Async
      promise={promise}
      onSuccess={(value) => value}
      onPending={() => "Loading..."}
      onError={(error) => error.message}
    />
  );

  assert.equal(wrapper.getDOMNode().textContent, "Loading...");

  setTimeout(() => {
    assert.equal(wrapper.getDOMNode().textContent, "Rejected");
    assert.end();
  });
});
