const attendenceTextIndicator = '--Attendance Log Entry'

function mergeAttendanceRecords() {
  clearAttendance() // removes any prior entries attendance entries
  addToRange(compileAttendanceRecords(),"Data Log!A1:G1000")
  console.log("Attendance Records Merged")
}

// removes all attendance records from Data Log
function clearAttendance() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Log");
  var dataRange = sheet.getRange("Data Log!A1:D1000") //TODO: make it go to last row of data
  var data = dataRange.getValues();

  rowsToDelete = []
  for (var i = 0; i < data.length; i++){
    if (data[i][0] == attendenceTextIndicator){
      rowsToDelete.push(i+1)
    }
  }
  console.log(rowsToDelete)
  console.log(isIncreasingBy1(rowsToDelete))
  if (rowsToDelete.length > 0 && isIncreasingBy1(rowsToDelete)){
    //var firstRow = rowsToDelete[0]
    //var lastRow = rowsToDelete[rowsToDelete.length-1]-rowsToDelete[0]
    //console.log(firstRow,lastRow)
    sheet.deleteRows(rowsToDelete[0],rowsToDelete[rowsToDelete.length-1]-rowsToDelete[0]+1)
  }
}

// function returns true if array is continuous with a slope of 1
function isIncreasingBy1(array) {
  for (var i = 0; i < array.length-1; i++){
    if (array[i+1]-array[i] != 1){
      return false
    }
  }
  return true
}

// returns list attendance records created from the attendance sheet
function compileAttendanceRecords() {
  var returnList = []
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Attendance");
  var dataRange = sheet.getRange("Attendance!A1:BA30")
  var data = dataRange.getValues();

  // extracts the column containing usernames
  var userNames = []
  for (var i = 0; i < data.length-1; i++){
      userNames.push(data[i][0])
  }

  // loops through event columns and creates an entry for each attendance record
  for (var c = 3; c < data[0].length; c++){
    for (var r = 4; r < data.length; r++) {
      var username = userNames[r]
      var present = data[r][c]
      var meetingTitle = data[0][c]
      var meetingDate = new Date(Date.parse(data[1][c]))
      var descriptionNotes = data[2][c]
      var meetingEntry = [attendenceTextIndicator, username, meetingDate.toLocaleDateString(), 0, 45, "CSHS Meeting", `${meetingTitle}:${descriptionNotes}`]
      if (present){
        returnList.push(meetingEntry)
      }

    }
  }
  return returnList
}