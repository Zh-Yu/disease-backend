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


async function insertPollution(body){                               //插入空气污染物数据
	var userAddSql = 'INSERT INTO b_pollution_sum(aqi,airquality,primarypollution,pm25,pm10,co,no2,o3,o3average,so2,station) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
	var params = [];
	var stationindex = 1;
	body.map((item, index) =>{
		if(item =='_'||item =='—')
			item = -1;
		params.push(item);
		if(params.length === 10){
			params.push(stationindex);
			let sql = db.format(userAddSql, params);
			db.query(sql);
			// console.log(params)
			params = [];
			stationindex += 1;
		}
	})		
}                                  
// async function getfilter(commanddata){
// 	return await db.query(`SELECT * FROM a_sum_patient_info as a join a_type_desc as b on a.type=b.index WHERE b.type='${commanddata}'`)
// }

async function getPollutionAll(){
	var timetoday = new Date().toLocaleDateString();
	var arrtoday = [];
	arr = timetoday.split('-');
	if(arr[1].length < 2)
		arr[1] = '0' + arr[1];
	if(arr[2].length < 2)
		arr[2] = '0' + arr[2];
	var timechange = arr[0] +'/' + arr[1] +'/'+ arr[2];
	return await db.query(`SELECT date,b.station,aqi,airquality,pm25,pm10,co,no2,o3,o3average,so2 FROM 
		b_pollution_sum as a join b_station_desc as b on a.station = b.index WHERE date_format(a.date,'%Y/%m/%d') = '${timechange}'`)
}

module.exports = {
	getPatientSummaryByID,
	getPatientSummaryByName,
	getPatientList,
	// getCount,
	getTypeDesc,
	getLocationDesc,
	insertPollution,
	getPollutionAll
};



