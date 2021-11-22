
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawVisualization);
      
      function drawVisualization(t1,t2,s1,s2) {
        // Some raw data (not necessarily accurate)
        let together_M =(t1 ==undefined) ?  50 :  t1;
        let together_W =(t2 ==undefined) ?  50 : t2 ;
        let single_M = (s1 ==undefined) ? 50 : s1 ;
        let single_W = (s2 ==undefined) ? 50 : s2 ;

        var data = google.visualization.arrayToDataTable([
          ['Month', '男', '女'],
          ['共同生活戶', together_M|81190,together_W|90835],
          ['獨立生活戶', single_M|12383,single_W|15908],
        ]);

        var options = {
          
          vAxis: {title: 'Cups'},
          // hAxis: {title: 'Month'},
          seriesType: 'bars',
          series: {5: {type: 'line'}},
          legend:{position:'bottom'},
          vAxis:{maxValue:200000},
          backgroundColor:"",	

        };

        var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
   var url = "https://cors-anywhere.herokuapp.com/https://od.moi.gov.tw/api/v1/rest/datastore/301000000A-000082-045"  
// var url = "https://cors-anywhere.herokuapp.com/https://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=99D563D2-568C-4FA2-B4B0-1783453B1136";


//----//
const request = new XMLHttpRequest();
request.open('GET', url, true);
request.send(null); 
request.addEventListener('load', getRequest); 
request.addEventListener('error', error);
function error(err) {
  document.querySelector(".Content").textContent = err.message;
}
function getRequest() {
  
  var RequestData = JSON.parse(request.responseText);
  const data = RequestData.result.records

  var countrys = [];
  for(let i=1;i<data.length;i++) {
    if(data[i].site_id.indexOf("臺北市")>-1){
      countrys.push(data[i].site_id.replace("臺北市",""));
    }
  }


  var block = countrys.filter(function(element,index,arr){
    return arr.indexOf(element) === index;
  }) 

  let string = '' 
  for(b of block){
    string+=`<option value = "${b}">${b}</option>`
  }


  var selectLocation = document.querySelector('.locations');
  selectLocation.innerHTML =string;

  selectLocation.addEventListener('change',function(){
    let getBlock = selectLocation.value
    console.log(getBlock);
    let liveTogether_M = 0
    let liveTogether_W = 0

    let liveAlone_M = 0
    let liveAlone_W = 0

    for(let i=0;i<data.length;i++){
      if(data[i].site_id.indexOf(getBlock)>0){
        liveAlone_M += parseInt(data[i].household_single_m)
        liveAlone_W += parseInt(data[i].household_single_f)
        liveTogether_M += parseInt(data[i].household_ordinary_m)
        liveTogether_W += parseInt(data[i].household_ordinary_f)
      }
    }

    drawVisualization(liveTogether_M,liveTogether_W,liveAlone_M,liveAlone_W)
  })
}




