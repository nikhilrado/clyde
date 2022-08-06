/**
 * Lists 10 course names and IDs.
 */
const EMAIL_DOMAIN = 'bethlehemschools.org'

function listCourses() {
  /**
   * @see https://developers.google.com/classroom/reference/rest/v1/courses/list
   */
  var returnList = []
  const optionalArgs = {
    pageSize: 20
    // Use other query parameters here if needed.
  };
  try {
    const response = Classroom.Courses.list(optionalArgs);
    const courses = response.courses;
    if (!courses || courses.length === 0) {
      Logger.log('No courses found.');
      return;
    }
    // Print the course names and IDs of the available courses.
    for (const course in courses) {
      //Logger.log('%s (%s)', courses[course].name, courses[course].id);
      // tests if user has teacher permissions, and only displays those classes
      if (courses[course].enrollmentCode){
        console.log(courses[course])
        returnList.push(courses[course])
      }
    }
  } catch (err) {
    // TODO (developer)- Handle Courses.list() exception from Classroom API
    Logger.log('Failed with error %s', err.message);
  }
  return returnList
}

function test343(){

  addToRange(getPeople(course_id,"students"),"A101:C199")
  Logger.log("yo")
}

course_id = "323607317477"
function getPeople(courseId, personType){
  returnList = []
  if (personType == 'students'){var people = Classroom.Courses.Students.list(courseId)}
  else if (personType == 'teachers'){var people = Classroom.Courses.Teachers.list(courseId)}
  else {console.error("personType must be set to 'teachers' or 'students'")}
  //var students = course.students()
  console.log(people[personType][5])
  for (var i = 0; i < people[personType].length; i++){
    //students["students"][i])
    person = people[personType][i]['profile']
    studentFirstName = person['name']['givenName']
    studentLastName = person['name']['familyName']
    studentUserName = person['emailAddress'].replace("@"+EMAIL_DOMAIN,"") //keeps domain if different from set domain
    studentInfo = [studentFirstName,studentLastName,studentUserName]
    //console.log(studentInfo)
    //console.log(i)
    returnList.push(studentInfo)
  }
  return returnList
}

//console.log(getPeople(course_id,"teachers"))
//console.log(getPeople(course_id, "students"))

// this function takes in data with a cell, and the column the bounding row. 
// the function will calulate the row number of the second cell based on data size.
function setRange(data,range){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  
  var regex = /^([a-zA-Z]+)(\d+):([a-zA-Z]+)(\d+)$/g
  range = regex.exec(range)
  console.log(range)

  // The size of the two-dimensional array must match the size of the range.
  //console.log(parseInt(rangeCell1.match(/\d+/g)))
  console.log(data)
  //console.log(`${rangeCell1}:${rangeCol2}${parseInt(rangeCell1.match(/\d+/g))+data.length-1}`)
  if (parseInt(range[2])+data.length-1 > range[4]){
    console.error("data does not fit")
    return
  }
  var range = sheet.getRange(`${range[1]+range[2]}:${range[3]}${parseInt(range[2])+data.length-1}`);
  range.setValues(data);
}

// adds data to a range without overwriting previous rows
function addToRange(data,range){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");

  var regex = /^([a-zA-Z]+)(\d+):([a-zA-Z]+)(\d+)$/g
  range = regex.exec(range)
  console.log(range[1])

  // finds last filled row in range (can't use binary cause unsorted/blank)
  // currently only checks first column for data
  existingData = sheet.getRange(range[0]).getValues()
  for (var i = existingData.length - 1; i >= 0; i--){
    console.log(existingData[i])
    if (existingData[i][0] == '' && existingData[i-1][0] != ''){
      var insertAt = i
      break
    }
  }
  console.log(insertAt)
  console.log(data)
  
  var newRangeString = `${range[1]+(parseInt(range[2])+insertAt)}:${range[3]}${range[4]}`
  console.log(newRangeString)
  setRange(data, newRangeString)
}
