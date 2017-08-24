const db = require('../service/db');


async function getPatientSummaryByID(id) {     
	if(isNaN(id)) return;
	return await db.query(`SELECT type,ct,name,sex,extra,b.location FROM a_sum_patient_info as a join 
		a_location_desc as b on a.location=b.index WHERE a.id=${id}`);
	}

async function getPatientSummaryByName(name){       //name拿到汉字
	if(name == null) return;	
		return await db.query(`SELECT ct,name,sex,extra,disreal,disimag,norreal,norimag,diffreal,diffimag,
			b.type,c.location FROM a_sum_patient_info as a join a_type_desc as b on a.type=b.index join 
			a_location_desc as c on a.location = c.index	 WHERE a.name='${name}'`); 
	}

// async function getPatientList(page){
// 	return await db.query(`SELECT * FROM a_sum_patient_info as a join a_type_desc as b on a.type=b.index join 
// 			a_location_desc as c on a.location = c.index order by id LIMIT 10 OFFSET ${(page-1)*10}`)
// }

async function getPatientList(){       //name拿到汉字	
		return await db.query(`SELECT ct,name,sex,extra,disreal,disimag,norreal,norimag,diffreal,diffimag,
			b.type,c.location FROM a_sum_patient_info as a join a_type_desc as b on a.type=b.index join 
			a_location_desc as c on a.location = c.index`);    //两个没有location的没抓到
	}


// async function getCount(){
// 	return await db.query(`SELECT count(id) as count FROM a_sum_patient_info`)
// }

async function getTypeDesc(){
	return await db.query(`SELECT * FROM a_type_desc`)
}

async function getLocationDesc(){
	return await db.query(`SELECT * FROM a_location_desc`)
}


function insertPollution(body){                               //插入空气污染物数据
	var userAddSql = 'INSERT INTO b_pollution_sum(aqi,pm25,pm10,co,no2,so2,o3,o3average,airquality,station) VALUES (?,?,?,?,?,?,?,?,?,?)';
	var params = [];
	var stationindex = 1;
	var resultPromises = [];
	body.map((item, index) =>{
		if(item =='-')
			item = -1;
		params.push(item);
		if(params.length === 9){
			params.push(stationindex);
			let sql = db.format(userAddSql, params);
			console.log(`准备执行SQL ${sql}`);
			resultPromises.push(db.query(sql));
			params = [];
			stationindex += 1;
		}
	})
	return Promise.all(resultPromises);
}                                  
// async function getfilter(commanddata){
// 	return await db.query(`SELECT * FROM a_sum_patient_info as a join a_type_desc as b on a.type=b.index WHERE b.type='${commanddata}'`)
// }

async function getPollutionToday(){
	var timetoday = new Date().toLocaleDateString();
	var arrtoday = [];
	arr = timetoday.split('-');
	if(arr[1].length < 2)
		arr[1] = '0' + arr[1];
	if(arr[2].length < 2)
		arr[2] = '0' + arr[2];
	var timechange = arr[0] +'/' + arr[1] +'/'+ arr[2];
	return await db.query(`SELECT date_format(a.date,'%Y/%m/%d'),b.station,aqi,airquality,pm25,pm10,co,no2,o3,so2,o3average FROM 
		b_pollution_sum as a join b_station_desc as b on a.station = b.index WHERE date_format(a.date,'%Y/%m/%d') = '${timechange}'`)
}

async function getStation(){
	return await db.query(`SELECT station FROM b_station_desc`)
}

async function getByStation(stationname){
	return await db.query(`SELECT date_format(a.date,'%Y/%m/%d'),aqi,airquality,pm25,pm10,co,no2,o3,o3average,so2 FROM 
		b_pollution_sum as a join b_station_desc as b on a.station = b.index WHERE b.station ='${stationname}'`)
}

module.exports = {
	getPatientSummaryByID,
	getPatientSummaryByName,
	getPatientList,
	// getCount,
	getTypeDesc,
	getLocationDesc,
	insertPollution,
	getPollutionToday,
	getStation,
	getByStation
};



