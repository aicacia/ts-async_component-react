# ts-async_component-react

aicacia async component for react

```tsx
<Async
  promise={Promise.resolve("Hello, world!")}
  onSuccess={(value) => value} // displays promise result "Hello, world!"
  onPending={() => "Loading..."}
  onError={(error) => error.message} // on error so message
/>
```
