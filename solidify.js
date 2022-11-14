function test3() {
  loadData()
  var json = {}
  //uniqueUserNamesList = ['ffebu841'] //TODO: causes an error when long ago date in date range. Someone did 0022 instead of 2022
  for (var i = 0; i < uniqueUserNamesList.length; i++) {
    json[uniqueUserNamesList[i]] = convert_date_object_to_str_2col(sum_hours_by_day(rowMerge(uniqueUserNamesList[i])))//.toString()
  }
  json['all'] = convert_date_object_to_str_2col(sum_hours_by_day(data))
  //var data = rowMerge("nrado175")
  //console.log(data)
  //writeDataToRange(convert_date_object_to_str_2col(sum_hours_by_day(data)))
  console.log(json)
  three_d_data(json)
}

function three_d_data(json){
  // Make a POST request with a JSON payload.
  var data = {
    'data': json,
    'action': "upload-data-cshs",
    'age': 35,
    'pets': ['fido', 'fluffy']
  };
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload': JSON.stringify(data),
    //'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch('https://api.solidify.ortanatech.com/action?action=upload-data-cshs', options);
  // The code below logs the value for every key of the returned map.
  console.log(response.getContentText())
  console.log(options)
}

function convert_date_object_to_str_2col(array){
  for (var i = 0; i < array.length; i++){
    array[i][0] = array[i][0].toLocaleDateString('en-us')
  }
  return array
}

function writeDataToRange(dataToBeWritten) {
  //Create a two-dimensional array with the values to be written to the range.


  //dataToBeWritten = sum_hours_by_day()
  console.log(dataToBeWritten)

  //Write the data to the range A1:C6 in Sheet1
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Output");
  sheet.getRange("A1:B273").setValues(dataToBeWritten);
}

function sortByColumn(a, colIndex){

    a.sort(sortFunction);

    function sortFunction(a, b){
        if (a[colIndex] === b[colIndex]){
            return 0;
        }
        else {
            return (a[colIndex] < b[colIndex]) ? -1 : 1;
        }
    }

    return a;
}

//var sorted_a = sortByColumn(a, 2);

function remove_blank_rows(array_2d){
  return_value = []
  for (var i = 0; i < array_2d.length; i++){
    if (array_2d[i][0] == ''){
      //console.log
      (array_2d[i])
      return return_value
    }
    return_value.push(array_2d[i])
  }
  return return_value
}

function sum_hours_by_day(array){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Log");
  var startRow = 2; // First row of data to process
  var numRows = 1000; // Number of rows to process
  // Fetch the range of cells A2:B3
  var dataRange = sheet.getRange(startRow, 1, numRows, 10);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();

  data = remove_blank_rows(array)
  console.log(data)

  //var a = [[12, 'CCC'], [58, 'AAA'], [57, 'DDD'], [28, 'CCC'],[18, 'BBB']];
  //var a = data
  //a.sort((a, b) => b[4].localeCompare(a[4]));
  var sorted_data = sortByColumn(data, 2);
  console.log(sorted_data)

  var dates_range = []
  for (date of sorted_data){
    dates_range.push(date[2])
  }
  console.log(dates_range)
  var max = Math.max(...dates_range)
  var min = Math.min(...dates_range)
  var start = stripTime(new Date(min))
  var end = stripTime(new Date(max))
  //start = new Date(2021,9,9)
  //end = new Date(2022,6,24)
  console.log(start,end)


  console.log(max-min)
  //for (var i = min; i < max; i++){
  //  output_list.push([i,null])
  //}

  function stripTime(date = new Date()){
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  //takes an array of submitted form data as input, and returns the decimal number of hours rounded to two digits
  function getDecimalHoursFromLineArray(array){
    return array[3] + Math.round((array[4]/60)*100)/100
  }

  //console.log(output_list)

  console.log(start.toString())
  prevDate = start;
  output_list = [[start,0]]
  console.log(output_list)
  for (var i = 0; i < sorted_data.length; i++){
    currentDate = sorted_data[i][2]
    //console.log([prevDate,currentDate,prevDate.toDateString() === currentDate.toDateString()])
    currentVal = output_list[output_list.length-1];
    if (prevDate.toDateString() === currentDate.toDateString()){
      output_list[output_list.length-1] = [currentVal[0],currentVal[1]+getDecimalHoursFromLineArray(sorted_data[i])]
    } else {
        //console.log(currentDate,prevDate)
        //output_list.push([new Date(start.setDate(start.getDate() + 1)), sorted_data[i][5]])
        //console.log(output_list[output_list.length-1][0],currentDate)
        while (!(output_list[output_list.length-1][0] == currentDate.toString())){
          output_list.push([new Date(start.setDate(start.getDate() + 1)), 0])
          //console.log([new Date(start.setDate(start.getDate() + 1)).toString(), 0])
          //console.log([output_list[output_list.length-1][0],currentDate.toString()])
        }
        output_list[output_list.length-1] = [currentDate,getDecimalHoursFromLineArray(sorted_data[i])]
    }
    console.log(output_list[output_list.length-1])

    prevDate = currentDate
  }
  output_list.shift()
  console.log(output_list)
  return output_list
}