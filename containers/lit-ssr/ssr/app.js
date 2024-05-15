import Koa from 'koa';
import { bodyParser } from '@koa/bodyparser';
import {ModuleLoader} from '@lit-labs/ssr/lib/module-loader.js';

const PORT = process.env.PORT ?? 3333;

const moduleLoader = new ModuleLoader();

const app = new Koa()
  .use(bodyParser())
  .use(async ctx => {
    console.log(`${ctx.method} ${ctx.url}`);
    if (ctx.method === 'POST') {
      const html = ctx.request.body.html;
      console.log('BODY', html);
      const importResult = await moduleLoader.importModule('./ssr.js', import.meta.url);
      const { ssr } = importResult.module.namespace;
      const rendered = await ssr(html);
      console.log('RENDERED', rendered);
      ctx.type = 'text/html';
      ctx.response.body = rendered;
    }
  });

app.listen(PORT, () => {
  console.log(`SSR service listening on ${PORT}`);
});
