import { ErrorBoundary } from "react-error-boundary";
import Fallback from "./Fallback";

export const RouteErrorBoundary = ({ children, routeName }) => {
  const onError = (error, info) => {
    console.error(`❌ Error on route: ${routeName}`);
    console.error("Error info:", error, info);
    // optionally send route info to Sentry or logger
  };

  return (
    <ErrorBoundary
      FallbackComponent={(fallbackProps) => (
        <Fallback {...fallbackProps} routeName={routeName} />
      )}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
};
