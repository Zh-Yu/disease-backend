var http = require('http');   
var cheerio = require('cheerio');
var baseUrl = 'http://www.pm25.in/';
var cities =['tianjin'];

// function filterChapters(html){
// 	var $ = cheerio.load(html);    //分解Dom结构
// 	var chapters = $('h2.1');
// 	var title = $('a.J-media-item.icon-video type').text();
// 	var number =parseInt($($('meta-value js-learn-num')[0]).text().trim(),10);
// }


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


function getPollution(html){
	var $ = cheerio.load(html);    //分解Dom结构
	var station = $('tbody tr td').html();
	console.log(station);
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
				resolve(html);
			})
		}).on("error", function(e){
			reject(e)
			console.log("获取信息出错");
		})
	})
	// body...
}                                           //爬到页面的html

var cityArray = [];
cities.forEach(function(city){
	cityArray.push(getCityAsync(baseUrl + city))
})

Promise.all(cityArray)              //promise.all([function]) 参数是数组，数组里面是函数，函数return Promise
	.then(function(html){              
		getPollution(html);
	})