import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellsRouter } from './routes/cells';

export const serve = (
  port: number,
  filename: string,
  dir: string,
  isProduction: boolean
) => {
  const app = express();

  app.use(createCellsRouter(filename, dir));

  if (isProduction) {
    const packagePath = require.resolve(
      '@my-code-book/local-client/build/index.html'
    );
    app.use(express.static(path.dirname(packagePath)));
  } else {
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:3000',
        ws: true,
        logLevel: 'silent',
      })
    );
  }

  return new Promise<void>((resolve, reject) => {
    console.log('Started server on port:', port);
    app.listen(port, resolve).on('error', reject);
  });
};
