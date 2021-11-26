footerText = ""

function test(){
  defaultRequiredHours = 10
  loadData()
  console.log(getRequiredHours("nrado175"));
  Logger.log(uniqueUserNamesList)
  for (var i = 0; i < uniqueUserNamesList.length-1; i++) {
    Logger.log(uniqueUserNamesList[i])
    //Logger.log(mergeToTable(rowMerge(uniqueUserNamesList[i])))
    sendMail(uniqueUserNamesList[i])
  }
  
  //Logger.log(mergeToTable(rowMerge("hmo")))
  //Logger.log(addRowAtDate(rowMerge("nrado175")))
  
  //Logger.log(mergeToTable(addRowAtDate(rowMerge("nrado175"))))
  sendReports();
}

function sendMail(lookupUserName) {
    var merge = rowMerge(lookupUserName)
    var table = mergeToTable(merge)
    var lengthOfMerge = merge.length;
    var firstName = merge[0][2]
    var lastName = merge[0][3]
    //this is what the code was before this year var hours = Math.floor(Math.round(addHoursFromMerge(merge) * 1000) / 1000)
    var hoursDecimal = addHours(lookupUserName);
    var hours = Math.floor(Math.round(hoursDecimal * 1000) / 1000)
    b = addHoursFromMerge(merge);
    console.log("yeet "+hoursDecimal)
    var minutes = Math.round(hoursDecimal%1*60)
    var subject = "You have completed " + hours + " CSHS hours!"
    if (minutes == 0){
      minutes = "00" 
    }
    var htmlBody = "Hello " + firstName + ",<br><br>" + getGreeting() + "<br>" + getLameProgressBar(Math.floor(hoursDecimal * 10) / 10,getRequiredHours(lookupUserName)) + "<br><br>You have completed " + hours + ":" + minutes + " of CSHS time! You can see a summary below.<br><br>" + table + "<br>Bookmark <a href='"+generatePreFilledLink(lookupUserName,firstName,lastName)+"'>this</a> pre-filled link ";
    //Actually Sends Email to Someone
    //if (lookupUserName=="nrado175"){
    if (true){
      MailApp.sendEmail({to: lookupUserName+"@bethlehemschools.org",name: "Clyde",subject: subject,htmlBody: htmlBody});
      console.log("Email sent to: " + lookupUserName)
    }
  Logger.log(htmlBody);
}

function getLameProgressBar(part, whole){
  var bar = ""
  var percent = (part/whole)*100
  for (var i = 0; i < percent; i++) {
    bar = bar + "l"
  }
  bar = "<p><span style=color:lightgreen>" + bar + "</span>"
    for (var i = 0; i < 100-percent; i++) {
    bar = bar + "l"
  }
  bar = "<b>" + bar + "</b>" + " (Progress: " + part + "/" + whole + " required hours)</p>"
  Logger.log(bar)
  return(bar)

}

function getRequiredHours(lookupUserName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  var startRow = 3; // First row of data to process
  var numRows = 2; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 10);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();


  for (var i = 0; i < data.length; ++i) {
    var row = data[i];
    var userName = row[0];
    if (userName == lookupUserName){
      return row[1];
    }
  }
  return(defaultRequiredHours);
}

function addHours(lookupUserName) {

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Log");
  var startRow = 2; // First row of data to process
  var numRows = 50; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 10);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  var totalHours = 0
  console.log(data.length)
  for (var i = 0; i < data.length; ++i) {
    
    var row = data[i]; //row is equal to list which is of the elements in i column, each cell is an element
    var formDate = row[0]; 
    var userName = row[1];
    var firstName = row[2]; 
    var lastName = row[3];
    var date = row[4]; 
    var hours = row[5]; 
    var min = row[6];
    var description = row[7]; 
    if (userName == lookupUserName){
        totalHours += hours + (min/60)
    }
  }
  console.log(totalHours)
  return totalHours
  
}

function addHoursFromMerge(merge) {
  var today = new Date()
  var month = today.getMonth()
  var totalHours = 0
  var tutoringHours = 0
  var meetingHours = 0
  var otherHours = 0
  var tutoringHoursLastMonth = 0
  var meetingHoursLastMonth = 0
  var otherHoursLastMonth = 0
  for (var i = 0; i < merge.length; ++i) { 
    var row = merge[i]; //row is equal to list which is of the elements in i column, each cell is an element
    console.log(row);
    var formDate = row[0]; 
    var userName = row[1];
    var firstName = row[2]; 
    var lastName = row[3];
    var date = row[4]; 
        //console.log(date)
    var hours = row[5]; 
    var min = row[6];
    var description = row[7]; 
    
    //Logger.log(month)
    //Logger.log(date.getMonth()-1)
    
    //TODO: figure out what to do with janurary
    console.log(description + hours);
    if(date.getMonth() == month-1){ //adds up hours for the previous month
      totalHours += hours + (min/60)
      if(description == "CSHS Tutoring"){
        meetingHoursLastMonth += hours + (min/60)
      }
      else if(description == "CSHS Meeting"){
        tutoringHoursLastMonth += hours + (min/60)
      }
      else{
        otherHoursLastMonth += hours + (min/60)
      }
    }
    //else if (date.getMonth() != month){ //adds up hours for the other months, but not current month
    else {
      console.log(hours);
      totalHours += hours + (min/60)
      if(description == "CSHS Tutoring"){
        meetingHours += hours + (min/60)
      }
      else if(description == "CSHS Meeting"){
        tutoringHours += hours + (min/60)
      }
      else{
        otherHours += hours + (min/60)
        console.log(otherHours);
      }
    }
  }
  statsMerge.push([userName,totalHours,tutoringHours,meetingHours,otherHours,tutoringHoursLastMonth,meetingHoursLastMonth,otherHoursLastMonth,firstName,lastName])
  Logger.log(statsMerge)

  return totalHours
}

function rowMerge(lookupUserName) {
  var mergedArray = [];

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Log");
  var startRow = 2; // First row of data to process
  var numRows = 200; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 100);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  var totalHours = 0
  for (var i = 0; i < data.length; ++i) {
    
    var row = data[i]; //row is equal to list which is of the elements in i column, each cell is an element
    var formDate = row[0]; 
    var userName = row[1];
    var firstName = row[2]; 
    var lastName = row[3];
    var date = row[4]; 

    var hours = row[5]; 
    var min = row[6];
    var description = row[7]; 
    if (userName == lookupUserName){
        mergedArray.push([formDate,userName,firstName,lastName,date,hours,min,description]);
    }
  }
  Logger.log(mergedArray)
  return mergedArray
}

function mergeToTable(merge,dateIndex) { 
  console.log(merge)
  s = " style='border:1px solid'" //style for td, th
  html = "<table style='width:100%; border-collapse: collapse; border:1px solid black'><th"+s+">Date</th><th"+s+">Hours</th><th"+s+">Mins</th><th"+s+">Description</th></tr>"
  for (i = 0; i < merge.length; i++) {
    html = html + "<tr"+s+">"
    for (j = 0; j < merge[i].length; j++){
      if (j == 5 || j == 6 || j == 7){
        html = html + "<td style='border:1px solid;padding-left:5px'>" + merge[i][j] + "</td>";
      }
      else if (j == 4){
        date = merge[i][j]
        console.log("date"+date)
        daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
        html = html + "<td style='border:1px solid;padding-left:5px'>" + daysOfWeek[date.getDay()]+ ", " + (date.getMonth()+1) + "/" +date.getDate() + ", " + date.getFullYear() + "</td>";
      }
      else if (merge[i].length == 1){
        html = html + "<td style=padding-left:5px>" + merge[i][0] + "</td>"
      }
    }
    html = html + "</tr>"
  }
  html = html + "</table>"
  //html = html + "<style>table, th, td {border:1px solid black; border-collapse: collapse} td {padding-left: 5px}</style>"
  return html
}

formLink = "https://www.docs.google.com/forms/example"
function generatePreFilledLink(userName,firstName,lastName) {
  return formLink+"&entry.1129123924=" + userName + "&entry.624029689=" + firstName + "&entry.172496163=" + lastName;
}

function loadData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Log");
  var startRow = 2; // First row of data to process
  var numRows = 15; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 100);
  // Fetch values for each row in the Range.
  data = dataRange.getValues();
  statsMerge = []
  var userNamesList = [];
  for (i = 0; i < data.length; i++) {
    userNamesList.push(data[i][1])
  }
  uniqueUserNamesList = [...new Set(userNamesList)];
  //uniqueUserNamesList.remove("");
}

function addRowAtDate(merge){ //adds a line into the merge at where the previous month starts
  var today = new Date();
  var month = today.getMonth()
  //if (prevMonth == -1){prevMonth = 0}
  //Logger.log(prevMonth)
  for (var i = 0; i < merge.length; i++) {
    var rowDate = merge[i][0]
    if (rowDate.getMonth() != month){
      merge.splice(i, 0, ["Previous Period"])
      break
    }
    //Logger.log(rowDate.getMonth())
    //Logger.log(merge.length)
  }
  return merge
}

function getGreeting(){
  var today = new Date()
  var dayNumber = today.getDay()
  var daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  var adjectivesList = [["Super","Splendid","Serene","Spectacular"],["Marvelous","Magical","Magnificent"],["Terrific"],["Wonderful"],["Terrific"],["Fabulous","Fantastic","Festive"],["Super","Splendid","Serene","Spectacular"]]

  var adjective = adjectivesList[dayNumber][Math.floor(Math.random()*adjectivesList[dayNumber].length)]
  //var adjective = [Math.floor(Math.random()*adjectivesList[dayNumber].length)]

  var greeting = "I hope you are having a " + adjective + " " + daysOfWeek[dayNumber] +"!"

  //Logger.log(greeting)
  return(greeting)

}

//the following code is for the teacher email
function getHoursChart(){
  statsMerge = statsMerge.sort(function(a,b) { //sorts the statsMerge by number of hours which is column 2 (index 1)
    return a[1] - b[1];
  });
  statsMerge.reverse() //reverses the array so that it is highest to lowest
  var names = []
  var meetingHours = []
  var tutoringHours = []
  var otherHours = []
  var meetingHoursLastMonth = []
  var tutoringHoursLastMonth = []
  var otherHoursLastMonth = [] 
  for (var i = 0; i < statsMerge.length; i++) {
    names.push((i+1) +" "+ statsMerge[i][8])
  }
  for (var i = 0; i < statsMerge.length; i++) {
    meetingHours.push(statsMerge[i][2])
  }
  for (var i = 0; i < statsMerge.length; i++) {
    tutoringHours.push(statsMerge[i][3])
  }
  for (var i = 0; i < statsMerge.length; i++) {
    otherHours.push(statsMerge[i][4])
  }
  for (var i = 0; i < statsMerge.length; i++) {
    meetingHoursLastMonth.push(statsMerge[i][5])
  }
  for (var i = 0; i < statsMerge.length; i++) {
    tutoringHoursLastMonth.push(statsMerge[i][6])
  }
  for (var i = 0; i < statsMerge.length; i++) {
    otherHoursLastMonth.push(statsMerge[i][7])
  }

  Logger.log(names)

  names = JSON.stringify(names)
  meetingHours = "[" + meetingHours + "]"
  tutoringHours = "[" + tutoringHours + "]"
  otherHours = "[" + otherHours + "]"
  meetingHoursLastMonth = "[" + meetingHoursLastMonth + "]"
  tutoringHoursLastMonth = "[" + tutoringHoursLastMonth + "]"
  otherHoursLastMonth = "[" + otherHoursLastMonth + "]"

  //chartSlug = '{type:"horizontalBar",data:{labels:'+names+',datasets:[{label:"CSHSMeetings",backgroundColor:"rgb(255,99,132)",stack:"Stack0",data:'+meetingHours+',},{label:"Tutoring",backgroundColor:"rgb(54,162,235)",stack:"Stack0",data:'+tutoringHours+',},{label:"Other",backgroundColor:"rgb(75,192,192)",stack:"Stack0",data:'+otherHours+',},],},options:{title:{display:true,text:"CSHS Hours",},tooltips:{mode:"index",intersect:false,},responsive:true,scales:{xAxes:[{stacked:true,},],yAxes:[{stacked:true,},],},},}'

  chartSlug = '{type:"horizontalBar",data:{labels:'+names+',datasets:[{label:"",backgroundColor:"rgb(52, 41, 255)",stack:"Stack0",data:'+meetingHours+',},{label:"Meetings",backgroundColor:"rgb(76, 66, 255)",stack:"Stack0",data:'+meetingHoursLastMonth+',},{label:"",backgroundColor:"rgb(54,162,235)",stack:"Stack0",data:'+tutoringHours+',},{label:"Tutoring",backgroundColor:"rgb(54,162,200)",stack:"Stack0",data:'+tutoringHoursLastMonth+',},{label:"",backgroundColor:"rgb(75,192,192)",stack:"Stack0",data:'+otherHours+',},{label:"Other",backgroundColor:"rgb(75,192,150)",stack:"Stack0",data:'+otherHoursLastMonth+',},],},options:{title:{display:true,text:"CSHSHours",},tooltips:{mode:"index",intersect:false,},responsive:true,scales:{xAxes:[{stacked:true,scaleLabel: {display: true,labelString: "Hours",},},],yAxes:[{stacked:true,gridLines: { display:false },},],},},}'

//{xAxes:[{stacked:true,scaleLabel: {display: true,labelString: "Hours",},},],yAxes

  return ("https://quickchart.io/chart?c="+chartSlug)

}

function sendReports(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  var startRow = 3; // First row of data to process
  var numRows = 2; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 10);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();

  for (var i = 0; i < data.length; ++i) {
    var row = data[i];
    var teacherEmail = row[3];
    var teacherName = row[4];
    sendTeacherEmail(teacherEmail,teacherName);
  }
  return(defaultRequiredHours);
}

function sendTeacherEmail(email, name){
  var htmlBody = "Hello " + name + ",<br><br>"+getGreeting()+"<br><br>Here's how your students have been doing:<br><br>" + "<img src='"+ getHoursChart() +"' alt='Hours Chart' <br><br>"+footerText+">"
  var subject = "Here's how your students have been doing..."

  if (true){
    MailApp.sendEmail({to: email,name: "Clyde",subject: subject,htmlBody: htmlBody});
  }
  Logger.log(htmlBody)
}
