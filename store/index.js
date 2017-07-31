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
 
module.exports = {
	getPatientSummaryByID,
	getPatientSummaryByName
};



