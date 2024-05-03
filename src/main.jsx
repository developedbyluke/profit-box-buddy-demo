import React from "react";
import App from "./App.jsx";
import "./styles/main.scss";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Link,
    Route,
    RouterProvider,
    useRouteError
} from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import Dashboard from "./Dashboard.jsx";
import * as Sentry from "@sentry/react";
import DSCallback from "./components/PerformanceReviews/DSCallback.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/login" element={<App />} />
            <Route path="/demo" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} errorElement={<ErrorElement />}>
                <Route path="/:tab" element={<Dashboard />} />
                <Route path="/performance-reviews/:reviewId" element={<Dashboard />} />
            </Route>
            <Route path="/ds/callback" element={<DSCallback />} />
        </>
    )
);

function ErrorElement() {
    let error = useRouteError();
    console.error(error);

    return (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center gap-4">
            <span className="text-xl font-semibold text-danger">Error!</span>
            <p className="text-sm text-default-400">{error.message}</p>
            <Link to="/support" className="text-xs text-white bg-black rounded-full px-6 py-2 w-fit">
                Contact support
            </Link>
        </div>
    );
}

createRoot(document.getElementById("root")).render(
    <NextUIProvider>
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    </NextUIProvider>
);

// Sentry.init({
//     dsn: "https://2247877948e80f1011de30ae348cba92@o4506283980423168.ingest.sentry.io/4506283983372288",
//     integrations: [
//         new Sentry.BrowserTracing({
//             // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//             tracePropagationTargets: [
//                 // "localhost",
//                 // /^https:\/\/sheets-system-95e8d\.cloudfunctions.net\/*/,
//                 // "https://sheets-system-95e8d.cloudfunctions.net/*",
//                 // "https://sheets-system-95e8d.web.app/*"
//                 "*"
//             ]
//         }),
//         new Sentry.Replay()
//     ],
//     // Performance Monitoring
//     tracesSampleRate: 1.0, // Capture 100% of the transactions
//     // Session Replay
//     replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//     replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });
