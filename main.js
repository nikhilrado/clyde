const FOOTER_TEXT = ""
const SEND_EMAILS = false

function test(){
  mergeAttendanceRecords() // adds attendance records to Data Log
  defaultRequiredHours = 10
  loadData()
  Logger.log(getUserUsernames())
  var usernames = getUserUsernames()
  for (var i = 0; i < usernames.length; i++) {
    //Logger.log(usernames[i])
    //Logger.log(mergeToTable(rowMerge(usernames[i])))
    sendUpdateEmail(usernames[i])
  }
  
  sendReports();
}

function sendUpdateEmail(lookupUserName) {
    var merge = rowMerge(lookupUserName)
    var table = mergeToTable(merge)
    var lengthOfMerge = merge.length;
    //condition ? exprIfTrue : exprIfFalse
    // replacing these lines with ternary operators and optional chaining to navigate situations when name isn't provided
    var userInfo = getUserInfo(lookupUserName)
    var firstName = userInfo?.firstName ? userInfo["firstName"] : lookupUserName
    var lastName = userInfo?.lastName ? userInfo["lastName"] : ""
    //this is what the code was before this year var hours = Math.floor(Math.round(addHoursFromMerge(merge) * 1000) / 1000)
    var hoursDecimal = addHours(lookupUserName);

    // if the user has no hours recorded, add an entry to statslog
    if (hoursDecimal == 0){
      statsMerge.push([lookupUserName,'0','0','0','0','0','0','0',firstName,lastName])
    }
    var hours = Math.floor(Math.round(hoursDecimal * 1000) / 1000)
    b = addHoursFromMerge(merge);
    var minutes = Math.round(hoursDecimal%1*60)
    var subject = "You have completed " + hours + " CSHS hours!"
    // add leading zero of minutes place if a single digit 
    if ((""+minutes).length == 1){
      minutes = "0"+minutes; 
    }
    var htmlBody = "Hello " + firstName + ",<br><br>" + getGreeting() + "<br>" + getLameProgressBar(Math.floor(hoursDecimal * 10) / 10,getRequiredHours(lookupUserName)) + "<br><br>You have completed " + hours + ":" + minutes + " of CSHS time! You can see a summary below.<br><br>" + table + "<br>Protip: Bookmark <a href='"+generatePrefilledFormLink(lookupUserName)+"'>this</a> pre-filled link ";

    if (SEND_EMAILS){
      MailApp.sendEmail({to: lookupUserName+"@bethlehemschools.org",name: "Clyde",subject: subject,htmlBody: htmlBody});
      console.log("Email sent to: " + lookupUserName)
    }
  Logger.log(htmlBody);
}

// returns a html "progress bar" out of colored l characters
function getLameProgressBar(part, whole){
  var bar = ""
  var percent = (part/whole)*100
  if (percent>100){
    percent = 100;
  }
  for (var i = 0; i < percent; i++) {
    bar = bar + "l"
  }
  bar = "<p><span style=color:lightgreen>" + bar + "</span>"
  for (var i = 0; i < 100-percent; i++) {
    bar = bar + "l"
  }
  bar = "<b>" + bar + "</b>" + " (Progress: " + part + "/" + whole + " required hours)</p>"
  //Logger.log(bar)
  return(bar)

}

// returns the number of hours required for each person
function getRequiredHours(lookupUserName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  var startRow = 3; // First row of data to process
  var numRows = 50; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 4);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var userName = row[0];
    //Logger.log(userName)
    if (userName == lookupUserName){
      return row[3];
    }
  }
  return(defaultRequiredHours);
}

// returns the number of hours required for each person
function getUserInfo(lookupUserName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  var startRow = 3; // First row of data to process
  var numRows = 50; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 4);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    if (row[0] == lookupUserName){
      return {userName:row[0], firstName:row[1], lastName:row[2], requiredHours:row[3]};
    }
  }
  return null;
}

// returns list of user objects from the "Settings" sheet
function getUsers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  var startRow = 3; // First row of data to process
  var numRows = 50; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 4);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();

  var userList = []
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    if (row[0]){
      userList.push({userName:row[0], firstName:row[1], lastName:row[2], requiredHours:row[3]})
    }
  }
  return userList;
}

// returns a list of all of the usernames from the "Settings" sheet
function getUserUsernames(){
  var return_list = []
  getUsers().forEach(user => return_list.push(user.userName));
  return return_list
}

// adds hours from a username, returns value formatted to two decimal places
function addHours(lookupUserName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Log");
  var startRow = 2; // First row of data to process
  var numRows = 1000; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 10);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  var totalHours = 0
  //console.log(data.length)
  for (var i = 0; i < data.length; ++i) {
    
    var row = data[i]; //row is equal to list which is of the elements in i column, each cell is an element
    var formDate = row[0]; 
    var userName = row[1];
    var date = row[2]; 
    var hours = row[3]; 
    var min = row[4];
    var description = row[5]; 
    if (userName == lookupUserName){
        totalHours += hours + (min/60)
    }
  }
  //console.log(totalHours)
  return totalHours.toFixed(2)
}

// adds and categorizes the number of hours from a 2d array
// adds a row of this users's stats to statsMerge for later processing 
// decimal value of total hours that a user has completed
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
    //console.log(row);
    var formDate = row[0]; 
    var userName = row[1];
    var userInfo = getUserInfo(userName)
    var firstName = userInfo?.firstName ? userInfo["firstName"] : userName
    var lastName = userInfo?.lastName ? userInfo["lastName"] : ""
    var date = row[2]; 
    var hours = row[3]; 
    var min = row[4];
    var description = row[5]; 
    
    //Logger.log(month)
    //Logger.log(date.getMonth()-1)
    
    //TODO: figure out what to do with janurary
    //console.log(description + hours);
    if(date.getMonth() == month){ //adds up hours for the previous month
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
      //console.log(hours);
      totalHours += hours + (min/60)
      if(description == "CSHS Tutoring"){
        meetingHours += hours + (min/60)
      }
      else if(description == "CSHS Meeting"){
        tutoringHours += hours + (min/60)
      }
      else{
        otherHours += hours + (min/60)
        //console.log(otherHours);
      }
    }
  }

  // this section rounds our numerical values to 3 decimal places which compresses outputted data
  var rowToAppend = [userName,totalHours,tutoringHours,meetingHours,otherHours,tutoringHoursLastMonth,meetingHoursLastMonth,otherHoursLastMonth,firstName,lastName]
  for (var i = 0; i < rowToAppend.length; i++){
    if (!isNaN(rowToAppend[i])){
      rowToAppend[i] = parseFloat(rowToAppend[i]).toFixed(3)
    }
  }
  // if userName is undefined (usually because they have no hours logged), don't add them to statsMerge as that happens in sendUpdateEmail()
  if (userName){
    statsMerge.push(rowToAppend)
  }

  return totalHours
}

// selects and groups form entries from a single username, and returns a list with the submissions
function rowMerge(lookupUserName) {
  var mergedArray = [];

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Log");
  var startRow = 2; // First row of data to process
  var numRows = 1000; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 100);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  var totalHours = 0
  var userInfo = getUserInfo(lookupUserName)
  var firstName = userInfo?.firstName ? userInfo["firstName"] : lookupUserName

  for (var i = 0; i < data.length; ++i) {
    var row = data[i]; //row is equal to list which is of the elements in i column, each cell is an element
    var formDate = row[0]; 
    var userName = row[1];
    //var firstName = row[2]; 
    //var lastName = row[3];
    var date = row[2]; 

    var hours = row[3]; 
    var min = row[4];
    var description = row[5]; 
    if (userName == lookupUserName){
        mergedArray.push([formDate,userName,date,hours,min,description]);
    }
  }
  //Logger.log(mergedArray)
  return mergedArray
}

// takes a 2d array, with the index of the column containing the date, and returns an html table with dates formatted
function mergeToTable(merge,dateIndex) { 
  //console.log(merge)
  s = " style='border:1px solid'" //style for td, th
  html = "<table style='width:100%; border-collapse: collapse; border:1px solid black'><th"+s+">Date</th><th"+s+">Hours</th><th"+s+">Mins</th><th"+s+">Description</th></tr>"
  for (i = 0; i < merge.length; i++) {
    html = html + "<tr"+s+">"
    for (j = 0; j < merge[i].length; j++){
      if (j == 3 || j == 4 || j == 5){
        html = html + "<td style='border:1px solid;padding-left:5px'>" + merge[i][j] + "</td>";
      }
      else if (j == 2){
        date = merge[i][j]
        //console.log("date"+date)
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

// load initial data from the spreadsheet form log
function loadData() {
  // gets the name of the sheet where google form data is dumped, by reading the data from the "Settings" sheet
  var settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings")
  var dataLogSheet = settingsSheet.getRange("G15").getValue()

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(dataLogSheet);
  var startRow = 2; // First row of data to process
  var numRows = 1000; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 100);
  // Fetch values for each row in the Range.
  data = dataRange.getValues();
  statsMerge = []
  var userNamesList = [];
  for (i = 0; i < data.length; i++) {
    if (data[i][1] != ''){
      userNamesList.push(data[i][1])
    }
  }
  uniqueUserNamesList = [...new Set(userNamesList)];
  //uniqueUserNamesList.remove("");
}

// TODO implement this into code
// adds a line into the merge at where the previous month starts
function addRowAtDate(merge){
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

// returns a friendly greeting based on the day
function getGreeting(){
  var today = new Date()
  var dayNumber = today.getDay()
  const DAYS_OF_WEEK = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  const ADJECTIVES_LIST = [["Super","Splendid","Serene","Spectacular"],["Marvelous","Magical","Magnificent"],["Terrific","Top Notch"],["Wonderful"],["Terrific","Top Notch"],["Fabulous","Fantastic","Festive"],["Super","Splendid","Serene","Spectacular"]]

  var adjective = ADJECTIVES_LIST[dayNumber][Math.floor(Math.random()*ADJECTIVES_LIST[dayNumber].length)]
  var greeting = "I hope you are having a " + adjective + " " + DAYS_OF_WEEK[dayNumber] +"!"

  return(greeting)
}

// returns a link to a chart that contains the hours data of all students
function getHoursChart(){
  // statsMerge is the list that contains the number of hours for each user categorized
  statsMerge = statsMerge.sort(function(a,b) { // sorts the statsMerge by number of hours which is column 2 (index 1)
    return a[1] - b[1];
  });
  statsMerge.reverse() // reverses the array so that it is highest to lowest
  var names = []
  var meetingHours = []
  var tutoringHours = []
  var otherHours = []
  var meetingHoursLastMonth = []
  var tutoringHoursLastMonth = []
  var otherHoursLastMonth = [] 
  var hoursLeft = [] // hours remaining quota for the year
  for (var i = 0; i < statsMerge.length; i++) {
    //names.push((i+1) +" "+ statsMerge[i][8]) //this line of code added numbers to names
    names.push(statsMerge[i][8])
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
  for (var i = 0; i < statsMerge.length; i++) {
    // calculates the hours required for each person. Also cool ternary statement example.
    var requiredHoursTemp = getRequiredHours(statsMerge[i][0])-parseFloat(statsMerge[i][1])
    var currentHours = statsMerge[i][1]
    var requiredHours = getRequiredHours(statsMerge[i][0])
    hoursLeft.push(requiredHoursTemp > 0? requiredHoursTemp : 0)
  }

  //Logger.log(names)

  namesJSON = JSON.stringify(names)
  meetingHours = "[" + meetingHours + "]"
  tutoringHours = "[" + tutoringHours + "]"
  otherHours = "[" + otherHours + "]"
  meetingHoursLastMonth = "[" + meetingHoursLastMonth + "]"
  tutoringHoursLastMonth = "[" + tutoringHoursLastMonth + "]"
  otherHoursLastMonth = "[" + otherHoursLastMonth + "]"
  hoursLeft = "[" + hoursLeft + "]"

  // rough dynamic approximation of image height with more names, in order for all names to be visible
  chartImageHeight = 600 + (names.length-25) * 18

  chartSlug = `{type:"horizontalBar",data:{labels:${namesJSON},datasets:[{label:"",backgroundColor:"rgb(52, 41, 255)",stack:"Stack0",data:${meetingHours},},{label:"Meetings",backgroundColor:"rgb(76, 66, 255)",stack:"Stack0",data:${meetingHoursLastMonth},},{label:"",backgroundColor:"rgb(54,162,235)",stack:"Stack0",data:${tutoringHours},},{label:"Tutoring",backgroundColor:"rgb(54,162,200)",stack:"Stack0",data:${tutoringHoursLastMonth},},{label:"",backgroundColor:"rgb(75,192,192)",stack:"Stack0",data:${otherHours},},{label:"Other",backgroundColor:"rgb(75,192,150)",stack:"Stack0",data:${otherHoursLastMonth},},{label:"HoursLeftHide",backgroundColor:"rgb(200,200,200)",stack:"Stack0",data:${hoursLeft},}],},options:{legend:{labels:{filter:function(item,chart){return !item.text.includes("Hide");}}},title:{display:true,text:"CSHS Hours",},tooltips:{mode:"index",intersect:false,},responsive:true,scales:{xAxes:[{stacked:true,scaleLabel:{display:true,labelString:"Hours",},},],yAxes:[{stacked:true,gridLines:{display:false },},],},},}`

  //{xAxes:[{stacked:true,scaleLabel: {display: true,labelString: "Hours",},},],yAxes

  return ("https://quickchart.io/chart?height="+chartImageHeight+"&c="+chartSlug)

}

// will loop through teachers in the spreadsheet worksheet "Settings" and send them each a report
function sendReports(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  var dataRange = sheet.getRange('F3:G12');
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();

  var hoursChartLink = shortenUrl(getHoursChart())

  for (var i = 0; i < data.length; i++) {
    row = data[i];
    teacherEmail = row[0];
    teacherName = row[1];
    if (teacherName != "" && teacherEmail != ""){
      sendTeacherEmail(teacherEmail,teacherName, hoursChartLink);
    }
  }
  return(defaultRequiredHours);
}

// sends teachers the report email
function sendTeacherEmail(email, name, hoursChartLink){
  var htmlBody = "Hello " + name + ",<br><br>"+getGreeting()+"<br><br>Here's how your students have been doing:<br><br>" + "<img src='"+ hoursChartLink +"' alt='Hours Chart'><br>If you have trouble viewing the chart click <a href='"+hoursChartLink+"'>here</a>"
  var subject = "Here's how your students have been doing..."

  if (SEND_EMAILS){
    MailApp.sendEmail({to: email,name: "Clyde",subject: subject,htmlBody: htmlBody});
  }
  Logger.log(htmlBody)
}

// creates a firebase short link to decrease chance of gmail stripping image src and link href properties
// shortener only allows quickchart image links
// function modified from https://github.com/amitwilson/GoogleAppsScript/blob/master/LinkShortner
function shortenUrl(longLink) {
  // gets the firebase api key from script properties
  var firebaseWebAPIKey = PropertiesService.getScriptProperties().getProperty('FIREBASE_SHORTERNER_API_KEY');
  // the following line would set the api key at some point
  //PropertiesService.getScriptProperties().setProperty('FIREBASE_SHORTERNER_API_KEY', '')

  var apiUrl = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=' + firebaseWebAPIKey;
  var prefix = 'https://clyde.page.link'; // domain should be registered in firebase
  var formData = {
    "dynamicLinkInfo": {
      "domainUriPrefix": prefix,
      "link": longLink 
    },
    "suffix": {
      "option": "UNGUESSABLE"
    }
  }
  var options = {
    'method'  : 'POST',
    'headers' : {'Content-Type' : 'application/json'},
    'payload' : JSON.stringify(formData)
  };  
  var response = UrlFetchApp.fetch(apiUrl, options);
  response = JSON.parse(response.getContentText());
  var shortLink = response.shortLink;
  return shortLink;
}