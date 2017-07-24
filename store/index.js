const db = require('../service/db');

async function getPatientSummaryByID(id) {
	if(isNaN(id)) return;
	return await db.query(`SELECT type,location,ct,name,sex,extra FROM a_sum_patient_info WHERE id=${id}`);
}

module.exports = {
	getPatientSummaryByID
};
