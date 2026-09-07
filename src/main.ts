import { createServer } from 'net';
import { join } from 'path';
import { createApp } from './create-app';

const DEFAULT_PORT = 3000;
const PORT_SCAN_ATTEMPTS = 10;

/** Resolves true if nothing is listening on `port` yet. */
function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = createServer();
    probe.once('error', () => resolve(false));
    probe.once('listening', () => probe.close(() => resolve(true)));
    probe.listen(port);
  });
}

/**
 * Another project on this machine may already hold the preferred port, so walk
 * forward until we find a free one instead of dying with EADDRINUSE.
 */
async function resolvePort(preferred: number): Promise<number> {
  for (let port = preferred; port < preferred + PORT_SCAN_ATTEMPTS; port++) {
    if (await isPortFree(port)) {
      return port;
    }
    // eslint-disable-next-line no-console
    console.warn(`Port ${port} is in use — trying ${port + 1}…`);
  }
  throw new Error(
    `No free port found between ${preferred} and ${preferred + PORT_SCAN_ATTEMPTS - 1}. ` +
      'Set PORT to pick another range.',
  );
}

async function bootstrap(): Promise<void> {
  // `dist/main.js` sits one level below the project root that holds views/public.
  const app = await createApp(join(__dirname, '..'));

  const port = await resolvePort(
    process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT,
  );
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Amandaria — Vanya Nadi running on http://localhost:${port}`);
}

bootstrap();
