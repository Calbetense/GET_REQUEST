function doGet(e){
  // open the spreadsheet
  var ss = SpreadsheetApp.getActive();
  
  // Writes on the data sheet
  var sheet = ss.getSheetByName("Parametros e ração diários");
  
  // extract headers
  // getRange accepts row, col, number_of_rows and num_of_cols as argument
  // getLastColumn returns the position of the last column that has content
  var headers = sheet.getRange(3, 5, 3, sheet.getLastColumn()).getValues()[0];
  
  //First Cell to write
  var cell = sheet.getRange("E4");
  
  //Get values of the two firs columns (Date and place)
  var values = sheet.getDataRange().getValues();
  var days = [];
  var places = [];
  for(i = 3; i<values.length; i++){
    days[i-3]  = values[i][1];
    places[i-3] = values[i][2];
  }

  // Day of the sample
  var date = new Date();
  var month = Utilities.formatDate(date, "GMT-3:00", "MM");
  var day = Utilities.formatDate(date, "GMT-3:00", "dd");

  //Get parameters
  var p = "B1"/*e.parameter["place"]*/;
  
  // Get hour
  var h = 0;
  var hr = parseInt(Utilities.formatDate(date, "GMT-3:00", "H"));

  if(hr > 7 && hr <= 13){
    h = 1;
  }else if(hr > 13 && hr <= 17){
    h = 2;
  }else if(hr > 17 && hr <= 19){
    h = 3;
  }else if(hr > 19 && hr <= 21){
    h = 4;
  }else if(hr > 21 && hr <= 23){
    h = 5;
  }else if(hr <= 1){
    h = 6;
  }else if(hr > 1 && hr <= 4){
    h = 7;
  }

// TO ADD A PARAMETER JUST NEED TO COPY-PASTE THE ELSE-IF PART 
// ADD A Cn (n BEING NEXT NUMBER) AND CHANGE ALL THE NAMES OF
// THE PARAMETER TO THE CORRESPONDENT ONE

  //Counter
  c1 = 0;
  c2 = 0;
  c3 = 0;
  c4 = 0;
  
  // Write function (JUST O2 AND TEMP)
  for(i = 0; i < days.length; i++){
    //Compare day
    if(days[i].toLocaleString().split("/")[1] === month && days[i].toLocaleString().split("/")[0] === day){       
      //Compare place
      if(places[i] === p){
        for(j in headers){
          if(e.parameter["o2"] && headers[j] === "O2 (%)"){                       //O2
            if(c1 === h && h<6){
              cell.offset(i, j).setValue(e.parameter["o2"].replace(".", ","));  
              return ContentService.createTextOutput('Success :) O2 = ' + e.parameter["o2"]);
            }else if(c1 === h-1  && h>=6){       
              cell.offset(i-3, j).setValue(e.parameter["o2"].replace(".", ","));  
              return ContentService.createTextOutput('Success :) O2 = ' + e.parameter["o2"]);
            }else{
             c1++; 
            }
          }else if(e.parameter["temp"] && headers[j] === "TEMP (°C)"){                  //TEMP
            if(c2 === h && h<6){
               cell.offset(i, j).setValue(e.parameter["temp"].replace(".", ","));  
               return ContentService.createTextOutput('Success :) Temp = ' + e.parameter["temp"]);
            }else if(c2 === h-1 && h>=6){       
              cell.offset(i-3, j).setValue(e.parameter["temp"].replace(".", ","));  
              return ContentService.createTextOutput('Success :) Temp = ' + e.parameter["temp"]);
            }else{
               c2++;
            }
          }/*else if(e.parameter["cont"] && headers[j] === "Cont (ppm)"){                  //CONT
            if(c3 === h){
               cell.offset(i, j).setValue(e.parameter["cont"].replace(".", ","));  
               return ContentService.createTextOutput('Success :) Cont = ' + e.parameter["cont"]);
            }else if(c3 === h-1 && h>=6){       
              cell.offset(i-3, j).setValue(e.parameter["cont"].replace(".", ","));  
              return ContentService.createTextOutput('Success :) Cont = ' + e.parameter["cont"]);
            }else{
               c3++;
            }
          }*/else if(e.parameter["orp"] && headers[j] === "ORP"){                
            if(c4 === h && h<6){
               cell.offset(i, j).setValue(e.parameter["orp"].replace(".", ","));  
               ORPChart(e.parameter["orp"]);
               return ContentService.createTextOutput('Success :) ORP = '/* + e.parameter["orp"]*/);
            }else if(c4 === h-1 && h>=6){      
              cell.offset(i-3, j).setValue(e.parameter["orp"].replace(".", ","));  
              ORPChart(e.parameter["orp"]);
              return ContentService.createTextOutput('Success :) ORP = '/* + e.parameter["orp"]*/);
            }else{
               c4++;
            }
          }
        }
      }
    } 
  }
 
  return ContentService.createTextOutput('Something went wrong');
  
}



