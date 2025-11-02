import { Suspense } from 'react';
import BuinsessPage from './BuinsessPage';

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-slate-600">Loading campaigns...</p>
      </div>
    </div>
  );
}

export default function BusinessPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <BuinsessPage />
    </Suspense>
  );
}