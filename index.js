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
		// pagecontent:{},
		patientList:{},
		typecontent:{},
		locationcontent:{},
	};

	let [patientList, typecontent, locationcontent] = await Promise.all([
		// store.getPatientList(ctx.request.query.page),   
		store.getPatientList(),                                        
		store.getTypeDesc(),                                
		store.getLocationDesc()
	]);

	// ctx.response.body.pagecontent = pagecontent;   //查询每页显示10个	
	ctx.response.body.patientList = patientList;
	ctx.response.body.typecontent = typecontent;   //类型筛选
	ctx.response.body.locationcontent = locationcontent;   //位置筛选
});

// router.get('/patientfilter', async (ctx, next) => {
// 	ctx.response.body = await store.getfilter(ctx.request.query.command);
// })                  //数据库做筛选
router.get('/pollutionToday', async(ctx, next) =>{
	ctx.response.body = await store.getPollutionToday();           //取今天的污染物数据
})

router.get('/getStation', async(ctx, next) =>{
	ctx.response.body = await store.getStation();     //取观测站名称
})

router.get('/getbystation', async(ctx, next) =>{
	ctx.response.body = await store.getByStation(ctx.request.query.stationName);
})                                                                 //取观测站污染物数据

app.use(router.routes());
app.listen(3000);