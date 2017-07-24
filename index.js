const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const store = require('./store');

router.get('/patient', async (ctx, next) => {
  ctx.response.body = await store.getPatientSummaryByID(ctx.request.query.id);
});

app.use(router.routes());
app.listen(3000);