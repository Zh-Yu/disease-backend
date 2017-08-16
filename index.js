const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const logger = require('koa-logger');

const app = new Koa();
const router = new Router();

const store = require('./store');


app.use(cors());
app.use(logger());

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

router.get('/patientList', async (ctx, next) => {
	ctx.response.body = {
		pagecontent:{},
		typecontent:{},
		locationcontent:{},
		count: 0
	};

	let [pagecontent, count, typecontent, locationcontent] = await Promise.all([
		store.getPatientList(ctx.request.query.page),
		store.getCount(),
		store.getTypeDesc(),
		store.getLocationDesc()
	]);

	ctx.response.body.pagecontent = pagecontent;   //查询每页显示10个	
	ctx.response.body.count = count;
	ctx.response.body.typecontent = typecontent;   //类型筛选
	ctx.response.body.locationcontent = locationcontent;   //类型筛选
});

router.get('/patientfilter', async (ctx, next) => {
	ctx.response.body = await store.getfilter(ctx.request.query.command);
})

app.use(router.routes());
app.listen(3000);