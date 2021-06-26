const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT teacher_name
    FROM teachers LIMIT ?,?`,
    [offset, config.listPerPage]
  );
  let data = helper.emptyOrRows(rows);
  data = data.map((element) => {
    return element.teacher_name;
  });
  const meta = { page };
  const success = true;

  return {
    data,
    meta,
    success,
  };
}

async function create(programmingLanguage) {
  let {
    teacherName,
    topicName,
    dateSelected,
    arrivalTimeChosen,
    departureTimeChosen,
  } = programmingLanguage;

  const searchTeachers = await db.query(
    `SELECT * FROM teachers WHERE teacher_name = '${teacherName}'`
  );
  console.log(searchTeachers, searchTeachers.length);
  if (searchTeachers.length > 0) {
  } else {
    const result_teachers = await db.query(
      `INSERT INTO teachers 
    (teacher_name) 
    VALUES 
    ('${teacherName}')`
      // [teachers.teacher_name]
    );
  }
  const result_batches = await db.query(
    `INSERT INTO batches 
    (topic_name, arrival_time, departure_time, batch_name) 
    VALUES 
    ( '${topicName}', '${arrivalTimeChosen}', '${departureTimeChosen}', '${dateSelected}' )`
  );
  let messageTeacher = "Error in adding new teacher";
  let messageBatches = "Error in creating batch";

  if (result_teachers.affectedRows) {
    messageTeacher = "Teacher is added successfully";
  }
  if (result_batches.affectedRows) {
    messageBatches = "Batch is created successfully";
  }

  return { messageTeacher, messageBatches };
}

module.exports = {
  getMultiple,
  create,
};
