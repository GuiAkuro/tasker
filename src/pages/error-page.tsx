import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Ops!</h1>
        <p>Error {error.status}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Ops!</h1>
      <p>Error desconhecido.</p>
    </div>
  );
}
