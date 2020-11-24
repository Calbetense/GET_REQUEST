function doGet(e){
  // open the spreadsheet
  var ss = SpreadsheetApp.getActive();
  
  // Writes on the data sheet
  var sheet = ss.getSheetByName("esp32");
  
  // extract headers
  // getRange accepts row, col, number_of_rows and num_of_cols as argument
  // getLastColumn returns the position of the last column that has content
  var headers = sheet.getRange(2, 4, 2, sheet.getLastColumn()).getValues()[0];
  
  //First Cell to write
  var cell = sheet.getRange("D3");
  
  //Get values of the two firs columns (Date and place)
  var values = sheet.getDataRange().getValues();
  var days = [];
  var places = [];
  for(i = 2; i<values.length; i++){
    days[i-2]  = values[i][0];
    places[i-2] = values[i][1];
  }
  
  // Day of the sample
  var d = new Date();
  
  //Get parameters
  var p = "B1"/*e.parameter["place"]*/;
  
  // Get hour
  var h = 0;
  if(d.getHours() > 7 && d.getHours() <= 13){
    h = 1;
  }else if(d.getHours() > 13 && d.getHours() <= 17){
    h = 2;
  }else if(d.getHours() > 17 && d.getHours() <= 21){
    h = 3;
  }else if(d.getHours() > 21 && d.getHours() <= 1){
    h = 5;
  }else if(d.getHours() > 1 && d.getHours() <= 4){
    h = 5;
  }
  
  
  //Counter
  c1 = 0;
  c2 = 0;
  
  // Write function (JUST O2 AND TEMP)
  for(i = 0; i < days.length; i++){
    //Compare day
    if(days[i].getMonth() === d.getMonth() && days[i].getDate() === d.getDate()){
      //Compare place
      if(places[i] === p){
        for(j in headers){
          if(e.parameter["o2"] && headers[j] === "O2 (mg/L)"){                       //O2
            if(c1 === h){
              cell.offset(i, j).setValue(e.parameter["o2"]);  
              break;
            }else{
             c1++; 
            }
          }else if(e.parameter["temp"] && headers[j] === "TEMP (°C)"){                  //TEMP
            if(c2 === h){
               cell.offset(i, j).setValue(e.parameter["temp"]);  
               break;
            }else{
               c2++;
            }
          }
        }
      }
    } 
  }
 
  return ContentService.createTextOutput('Success :)');
  
}
