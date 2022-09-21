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
 
 function test22234(){
   console.log(emailStringToArray("Audrey Manley <amanl223@bethlehemschools.org>, Aaditya Ojha <aojha194@bethlehemschools.org>, Albie Snyder <asnyd263@bethlehemschools.org>, Charlie He <che193@bethlehemschools.org>, Connor Reilly <creil491@bethlehemschools.org>, Cassius Woutersz <cwout626@bethlehemschools.org>, Dominic Norfleet <dnorf711@bethlehemschools.org>, Dean Obrien <dobri300@bethlehemschools.org>, Daniel Zhou <dzhou840@bethlehemschools.org>, Eva Ho <eho809@bethlehemschools.org>, Eric Jestel <ejest180@bethlehemschools.org>, Ellie Kopplin <ekopp776@bethlehemschools.org>, Nando Febus <ffebu841@bethlehemschools.org>, Fay Hu <fhu338@bethlehemschools.org>, Griffin Andrews <gandr801@bethlehemschools.org>, Gabriel Martin <gmart771@bethlehemschools.org>, Gordon Su <gsu182@bethlehemschools.org>, Dylan Wang <hwang763@bethlehemschools.org>, Isabel Lippold <ilipp794@bethlehemschools.org>, Jake Lippold <jlipp795@bethlehemschools.org>, Jayden Wojcik <jwojc746@bethlehemschools.org>, Luke Doyle <ldoyl216@bethlehemschools.org>, Melanie Couillard <mcoui049@bethlehemschools.org>, Matthew Reynolds <mreyn937@bethlehemschools.org>, Michael Xie <mxie759@bethlehemschools.org>, Norina Zhang <nzhan504@bethlehemschools.org>, Peter Landi <pland961@bethlehemschools.org>, Purvayi Patil <ppati681@bethlehemschools.org>, Rachel Barnes <rbarn560@bethlehemschools.org>, Rachel Linehan <rlinehan@bethlehemschools.org>, Ronan amato Tiu <rtiu643@bethlehemschools.org>, Lisa Bolleddu <sboll258@bethlehemschools.org>, Sean Harwick <sharw940@bethlehemschools.org>, Shreya Raghu <sragh624@bethlehemschools.org>, Tyler Sagendorph <tsage883@bethlehemschools.org>, Tao Xie <txie934@bethlehemschools.org>"))
   addToRange([["ayd","fg","hjhj"],["fjg","ghf","jhfj"]],"Settings!A3:B100")
 }
 
 // converts a raw string of emails to a 2d array
 function emailStringToArray(string){
   const stringArray = string.trim().split(","); // splits text by line (assumes that raw string will seperates each user's info by line)
   var informationArray = [];
   for (let str of stringArray) {
     const information = str.trim(); //splits each line at space
     information = information.match("^([A-z][a-z]*).* ([A-z][a-z]*) <(.*)>$"); // gets info from regex, does't work for people with multiple first/last names
     informationArray.push([information[3],...information.slice(1,3)]); // adds array to main array
   }
   return informationArray;
 }
 
 // this function takes in data with a cell, and the column the bounding row. 
 // the function will calulate the row number of the second cell based on data size.
 function setRange(data,range){  
   console.log(range)
   var regex = /^(.*)!([a-zA-Z]+)(\d+):([a-zA-Z]+)(\d+)$/g
   range = regex.exec(range)
   console.log(range)
 
   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(range[1]);
 
   // The size of the two-dimensional array must match the size of the range.
   //console.log(parseInt(rangeCell1.match(/\d+/g)))
   console.log(data)
   //console.log(`${rangeCell1}:${rangeCol2}${parseInt(rangeCell1.match(/\d+/g))+data.length-1}`)
   if (parseInt(range[3])+data.length-1 > range[5]){
     console.error("data does not fit")
     return
   }
   var range2 = sheet.getRange(`${range[2]+range[3]}:${range[4]}${parseInt(range[3])+data.length-1}`);
   range2.setValues(data);
 }
 
 // adds data to a range without overwriting previous rows
 function addToRange(data,range){
 
   var regex = /^(.*)!([a-zA-Z]+)(\d+):([a-zA-Z]+)(\d+)$/g
   range = regex.exec(range)
   console.log(range[1])
 
   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(range[1]);
 
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
   
   var newRangeString = `${range[1]}!${range[2]+(parseInt(range[3])+insertAt)}:${range[4]}${range[5]}`
   console.log(newRangeString)
   setRange(data, newRangeString)
 } 