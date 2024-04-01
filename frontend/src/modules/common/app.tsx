import { ErrorBoundary } from 'react-error-boundary';
import { AppContent } from '~/modules/common/app-content';

import { Suspense, lazy } from 'react';
import ErrorNotice from './error-notice';
import { config } from 'config';
import { SSEProvider } from './sse/provider';

// Lazy load App navigation
const AppNav = lazy(() => import('~/modules/common/app-nav'));

const App = () => {
  return (
    <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => <ErrorNotice error={error} resetErrorBoundary={resetErrorBoundary} />}>
      <SSEProvider endpoint={`${config.backendUrl}/sse`}>
        <Suspense>
          <AppNav />
        </Suspense>
        <AppContent />
      </SSEProvider>
    </ErrorBoundary>
  );
};

export default App;
