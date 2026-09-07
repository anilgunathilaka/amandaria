import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { engine } from 'express-handlebars';
import { createServer } from 'net';
import { join } from 'path';
import { AppModule } from './app.module';
import { hbsHelpers } from './handlebars/helpers';

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
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Static assets: CSS / JS / images live in /public and are served as-is —
  // no bundler, no build step for the frontend.
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Views: layouts + partials + pages, all plain Handlebars (.hbs).
  app.engine(
    'hbs',
    engine({
      extname: '.hbs',
      defaultLayout: 'main',
      layoutsDir: join(__dirname, '..', 'views', 'layouts'),
      partialsDir: join(__dirname, '..', 'views', 'partials'),
      helpers: hbsHelpers,
    }),
  );
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  const port = await resolvePort(
    process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT,
  );
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Amandaria — Vanya Nadi running on http://localhost:${port}`);
}

bootstrap();
