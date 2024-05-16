import Koa from 'koa';
import { bodyParser } from '@koa/bodyparser';
import { renderInVm } from './ssr/vm.js';
import { renderGlobal } from './ssr/global.js';

const PORT = process.env.PORT ?? 3333;

const app = new Koa()
  .use(bodyParser({
    enableTypes: ['json','text'],
    extendTypes: {
      text: ['text/html']
    }
  }))
  .use(async ctx => {
    console.log(ctx.request.get('X-Drupal-Url') || 'SSR request received');
    if (ctx.method === 'POST') {
      let html = ctx.request.body;
      if (ctx.request.is('application/json')) {
        html = ctx.request?.body?.html;
      }
      const rendered = await renderInVm(html);
      // const rendered = await renderGlobal(html);
      ctx.type = 'text/html';
      ctx.response.body = rendered;
    }
  });

app.listen(PORT, () => {
  console.log(`SSR service listening on ${PORT}`);
});

function kill (...args) {
  console.log('GOT SIGNAL',...args);
  app.removeAllListeners();
  process.exit();
}

process.on('SIGTERM', kill);
