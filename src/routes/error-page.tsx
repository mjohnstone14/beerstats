import { useRouteError } from 'react-router-dom';

/**
 * Landing page for errors that might occur in the app,
 * mitigating issues where an empty page could be rendered
 * or a page is not found
 */
export default function ErrorPage() {
  const error: unknown = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{(error as Error)?.message || (error as { statusText?: string })?.statusText}</i>
      </p>
    </div>
  );
}
