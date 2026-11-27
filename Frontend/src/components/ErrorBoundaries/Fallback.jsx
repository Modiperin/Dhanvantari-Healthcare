const Fallback = ({ error, resetErrorBoundary, routeName }) => {
  return (
    <div role="alert" style={{ padding: "2rem", textAlign: "center" }}>
      <h2 style={{ color: "crimson" }}>Something went wrong!</h2>
      <p><strong>Page:</strong> {routeName}</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary} style={{ marginTop: "1rem" }}>
        Try Again
      </button>
    </div>
  );
};

export default Fallback;
