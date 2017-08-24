var http = require('http');   
var cheerio = require('cheerio');
var baseUrl = 'http://www.pm25s.com/tianjin.html';


const store = require('./store');
const db = require('./service/db');


// allInfo:[{
// 	station:'',
// 	aqi: number,
// 	pm2.5: number,
// 	pm10: number,
// 	co: number,       //if(NaN) {number = 0};
// 	no2: number,
// 	03: number,
// 	so2:number
// }]


async function getPollution(html){
	console.log('开始解析Html数据');
	var arrhead = [];
	var arrbody = [];
	var $ = cheerio.load(html);                  //分解Dom结构                               //表头内容
	var rowhead = $('.aqi_top span');
	for(var i=0; i<rowhead.length; i++){
		arrhead.push($(rowhead[i]).text());
	}
	var allbody = $('.pm25 div span');        //23个观测站的所有数据信息 10个为一组
	for(var i=(arrhead.length/2); i<160; i++){
		arrbody.push($(allbody[i]).text());
	}
	arrbody.map(function(item,index){
		if(index % 9 == 0){
			arrbody.splice(index,1);
		}
	})
	console.log(`获取到${arrbody.length}个单元格的数据`);
	// console.log(arrbody)
	await store.insertPollution(arrbody);
}

function getCityAsync(url) {
	return new Promise((resolve, reject) =>{		
		console.log("正在爬取" + url);
		http.get(url, function(res){
			var html = "";
			res.on('data', function(data){
				html += data;
			})
			res.on("end", function(){
				console.log('Html文件下载完毕')
				resolve(html);
			})
		}).on("error", function(e){
			reject(e)
			console.log("获取信息出错");
		})
	})
	// body...
}                                           //爬到页面的html

getCityAsync(baseUrl)              //promise.all([function]) 参数是数组，数组里面是函数，函数return Promise
.then(function(html){              
	return getPollution(html);
})
.then(() => {
	console.log('所有任务执行完毕');
	db.connection.destroy();
})
