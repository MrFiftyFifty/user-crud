import "bootstrap/dist/css/bootstrap.min.css";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/inertia-react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import "./i18n";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://7db24095e1efac05500fec0b6f6893d4@o4507493363351552.ingest.de.sentry.io/4507498252599376",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

createInertiaApp({
  resolve: (name: string) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob("./Pages/**/*.tsx")
    ),
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
