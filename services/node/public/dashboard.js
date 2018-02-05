function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

var myData = {    
  Readings: {
    AltitudeReading: { ReadingTime: '1/1/2010', TemperatureInFahrenheit: 10}
  }
}

var vm = new Vue({
  el: '#app',
  data: myData,
  created: function() {

    getData = ()=> {
      httpGetAsync("/data", (result)=>{
        myData.Readings = JSON.parse(result);
        console.log(myData.Readings);
      });
    }
    window.setInterval(()=>
    {
      getData();
    }, 10000);
    getData();

  }
});