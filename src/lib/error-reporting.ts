/**
 * Generic runtime error reporting utilities.
 * Reports errors to the browser console and exposes hooks for external
 * error tracking integrations (e.g. Sentry, Datadog) if present.
 */

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const message = describeThrown(error);
  const stack = error instanceof Error ? error.stack : undefined;

  // Forward to any registered error tracking hook (window.__errorTracker)
  if (typeof (window as { __errorTracker?: unknown }).__errorTracker === "object") {
    const tracker = (
      window as {
        __errorTracker?: { captureException?: (e: unknown, ctx: Record<string, unknown>) => void };
      }
    ).__errorTracker;
    tracker?.captureException?.(error, {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    });
  }

  console.error("[ErrorBoundary]", message, stack ?? "", context);
}

const MAX_SERIALIZED_LENGTH = 2000;

function describeThrown(error: unknown): string {
  if (error instanceof Response) {
    return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  const { message } = (error ?? {}) as { message?: unknown };
  if (typeof message === "string" && message.length > 0) return message;
  try {
    return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
  } catch {
    return String(error);
  }
}
