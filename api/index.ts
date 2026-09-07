import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Vercel serverless entrypoint.
 *
 * `public/` is served straight from Vercel's CDN, so only requests that miss a
 * static file are rewritten here (see vercel.json) — i.e. the rendered HTML.
 * The Nest app is created once per warm container and reused.
 */

type NodeHandler = (req: IncomingMessage, res: ServerResponse) => void;

let cachedHandler: Promise<NodeHandler> | undefined;

async function bootstrap(): Promise<NodeHandler> {
  // Load the tsc-compiled app from dist/ (produced by `npm run build`, which
  // runs before functions are packaged). Going through dist keeps
  // `emitDecoratorMetadata` intact — Nest's DI depends on it, and the
  // function builder's own TypeScript pass does not emit it.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createApp } = require('../dist/create-app');

  // On Vercel the working directory is the function root, which holds the
  // `views/` tree listed under `includeFiles` in vercel.json.
  const app = await createApp(process.cwd());
  await app.init();

  return app.getHttpAdapter().getInstance() as NodeHandler;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (!cachedHandler) {
    cachedHandler = bootstrap();
  }
  const app = await cachedHandler;
  app(req, res);
}
