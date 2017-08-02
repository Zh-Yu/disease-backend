const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');

const app = new Koa();
const router = new Router();

const store = require('./store');


app.use(cors());

router.get('/patient', async (ctx, next) => {
	ctx.response.body = {
		idquery:{},
		namequery:{}
	}
	if (ctx.request.query.id) {
		ctx.response.body.idquery = (await store.getPatientSummaryByID(ctx.request.query.id))[0];   //通过id查询
	}
	// if(store.getPatientSummaryByName(ctx.request.query.name).length > 0){
		ctx.response.body.namequery = await store.getPatientSummaryByName(ctx.request.query.name);     //通过name查询	
	// }	
	
});



app.use(router.routes());
app.listen(3000);