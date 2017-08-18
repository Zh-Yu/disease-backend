var http = require('http');
// var Promise = require('Promise');
var Promise = require("bluebird");    
var cheerio = require('cheerio');
var baseUrl = 'http://www.imooc.com/learn/';
var videoIds =[]

function filterChapters(html){
	var $ = cheerio.load(html);    //分解Dom结构
	var chapters = $('.learnchapters');
	var title = $('#page_header .path span').text();
	var number =parseInt($($('.info_num i')[0]).text().trim(),10);
// courseData={
// 	title:title,  //见filterChapters
// 	number:number,  //见filterChapters
// 	videos:[{ 
// 		chapterTitle:'',
// 		videos:[
// 			title:'',
// 			id:''
// 		]
// 	}]

// chapterData={
// 	chapterTitle:'',
// 	videos:[{
// 		title: '',
// 		id:''
// 	}]
// }

// courseData.videos.push(chapterData)

var courseData={
	title: title,
	number: number,
	videos:[348, 259, 197, 134, 75],
}

chapters.each(function(item){
	var chapter= $(this);
	var chapterTitle = chapter.find('strong').text();
	var videos = chapter.find('.video').children('li');
	var chapterData = {
		chapterTitle: chapterTitle,
		videos:[]
	}
videos.each(function(item){
	var video = $(this).find('.studyvideo');
	var videoTitle = video.text();
	var id = video.attr('href').split('video/')[1];
	chapterData.videos.push({
		title: videoTitle,
		id: id
	})
})
	courseData.videos.push(chapterData);
})
	return courseData;
}


function printCourseInfo(coursesData){
	coursesData.forEach(function(courseData){
		console.log(courseData.number + '人学过' + courseData.title + '\n');
	})
	coursesData.forEach(function(courseData){
		console.log('###' + courseData.title + '\n');
		courseData.videos.forEach(function(item){
			var chapterTitle = item.chapterTitle;
			console.log(chapterTitle + '\n');
			item.videos.forEach(function(video){
				console.log('  【' + video.id + '】' + video.title + '\n')
			})
		})
		
	})
}

function getPageAsync(url) {
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

var fetchCourseArray = [];
videoIds.forEach(function(id){
	fetchCourseArray.push(getPageAsync(baseUrl + id))
})

Promise.all(fetchCourseArray)              //promise.all([function]) 参数是数组，数组里面是函数，函数return Promise
	.then(function(pages){              //pages：页面的dom结构
		var coursesData = [];
		pages.forEach(function(html){
			var courses = filterChapters(html);
			coursesData.push(courses);
		})
		coursesData.sort(function(a,b){
			return a.number < b.number;
		})
		printCourseInfo(coursesData)
	})