import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { engine } from 'express-handlebars';
import { join } from 'path';
import { AppModule } from './app.module';
import { hbsHelpers } from './handlebars/helpers';

/**
 * Builds the Nest app and wires up views + static assets.
 *
 * `rootDir` is the directory holding `views/` and `public/`. Locally that is
 * the project root beside `dist/`; on a serverless host it is the directory the
 * deployment unpacks into. It is passed in rather than derived from
 * `__dirname`, which moves when this file is bundled into a function.
 */
export async function createApp(
  rootDir: string,
): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Static assets: CSS / JS / images live in /public and are served as-is —
  // no bundler, no build step for the frontend. (On Vercel these are served
  // straight from the CDN and never reach this middleware.)
  app.useStaticAssets(join(rootDir, 'public'));

  // Views: layouts + partials + pages, all plain Handlebars (.hbs).
  app.engine(
    'hbs',
    engine({
      extname: '.hbs',
      defaultLayout: 'main',
      layoutsDir: join(rootDir, 'views', 'layouts'),
      partialsDir: join(rootDir, 'views', 'partials'),
      helpers: hbsHelpers,
    }),
  );
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(rootDir, 'views'));

  return app;
}
