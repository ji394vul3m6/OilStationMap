var map;
var geocoder;
var dataId;
var dataLength;
var searchCol=1;
var markers = [];
var time_now;
var check_time;
var checkChange=false;

function initialize() {

  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(23.5466, 121.083)
  };
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  setGeoLocation();

  dataId = document.getElementById("datas");
  dataLength = dataId.rows.length;
  showAll();
  for (var i=0; i<dataLength; i++){
    dataId.rows[i].style.height = "25px";
    dataId.rows[i].cells[0].style.width = "260px"
    dataId.rows[i].cells[1].style.width = "330px"
    dataId.rows[i].cells[2].style.width = "75px"
    dataId.rows[i].cells[2].style.textAlign = "center"
    dataId.rows[i].cells[3].style.width = "75px"
    dataId.rows[i].cells[3].style.textAlign = "center"
  }
  time_now = new Date();

}

google.maps.event.addDomListener(window, 'load', initialize);

function setGeoLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      map.setCenter(pos);
      map.setZoom(14);
      console.log(pos);
    },function(){
      //handleNoGeolocation(true);
    });
  }else{
    //handleNoGeolocation(false);
  }
}

function setCenter(key){
  if(key=="全台"){
    map.setCenter(new google.maps.LatLng(23.5466, 121.083));
    map.setZoom(8);
  }else{
    geocoder.geocode({'address':key}, function(results, stats){
      console.log(results);
      console.log(results[0].geometry.location);
      //map.setCenter(results[0].geometry.location);
      //map.setZoom(11);
      //use auto zoom here via wet bound
      if(key=="高雄市"){//it have problem with query to Google map
        map.setCenter(new google.maps.LatLng(22.7800751,120.3013485));
        map.setZoom(10);
      }else if(key=="宜蘭縣"){//it have problem with query to Google map
        map.setCenter(new google.maps.LatLng(24.6489496,121.6413206));
        map.setZoom(10);
      }else
        map.fitBounds(results[0].geometry.bounds);
    });
  }
}
/* cannot use due to max query in one second is 10
function codeAddress(address,t) {
  var infowindow = new google.maps.InfoWindow({
    content: t
  });

  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          title: t
      });
      google.maps.event.addListener(marker, 'click', function(){
        infowindow.open(map,marker);
      });
      markers.push(marker);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
*/
function addMark(_map, _position, _title){
  var contentString;
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      contentString='<div><a href="https://maps.google.com/maps?saddr='+
                    position.coords.latitude.toString()+
                    ','+position.coords.longitude.toString()+
                    '&'+'daddr='+
                    _position.lat().toString()+
                    ','+_position.lng().toString()+
                    '">'+ _title +'</a></div>';

      var infowindow = new google.maps.InfoWindow({
        //content: _title
        content: contentString
      });
      var marker = new google.maps.Marker({
        map: _map,
        position: _position,
        title: _title
      });
      google.maps.event.addListener(marker, 'click', function(){
        infowindow.open(map,marker);
      });
      markers.push(marker);
    },function(){
      //handleNoGeolocation(true);
    });
  }else{
    //handleNoGeolocation(false);
  }
  /*
  console.log(contentstring);
  var infowindow = new google.maps.infowindow({
    //content: _title
    content: contentstring
  });
  var marker = new google.maps.marker({
    map: _map,
    position: _position,
    title: _title
  });
  google.maps.event.addlistener(marker, 'click', function(){
    infowindow.open(map,marker);
  });
  markers.push(marker);
  */
}

function checktime()
{
  console.log("checktime");
  checkChange=true; 
  search(document.getElementById("place"));
  checkChange=false;
}

function search(obj){
  clearMarkers();
  console.log(obj.options[obj.selectedIndex].value);
  key=obj.options[obj.selectedIndex].value;
  if(!checkChange)
    setCenter(key);
  check_time = document.getElementById("check-time").checked;
  time_now = new Date();
  if(key=="全台")
    showAll()
  else{
    for(var i=1; i<dataLength; i++){
      var searchText = dataId.rows[i].cells[searchCol].innerHTML;
      if(searchText.match(key)){
        dataId.rows[i].style.display='';
        showRow(i);
      }else
        dataId.rows[i].style.display="none";
    }
    hideLnglat();
  }
}

function showAll(){
  for(var i=0; i<dataLength; i++){
    dataId.rows[i].style.display='';
    showRow(i);
  }
  hideLnglat();
}

function hideLnglat(){
  for(var i=0; i<dataLength; i++){
    dataId.rows[i].cells[4].style.display="none";
    dataId.rows[i].cells[5].style.display="none";
  }
}

function showRow(i){
  //codeAddress(dataId.rows[i].cells[1].innerHTML, dataId.rows[i].cells[0].innerHTML);
  row = dataId.rows[i];
  startTime = row.cells[2].innerHTML.split(":");
  endTime = row.cells[3].innerHTML.split(":");
  if(check_time){
    if(!timeInRange(startTime,endTime,time_now))
      return;
  }
  if(check_time){
    row.style.background = "#FFFDD4";
  }else if(i!=0){
    row.style.background = "#FFFFFF";
  }
  var position = new google.maps.LatLng(
          parseFloat(row.cells[4].innerHTML),
          parseFloat(row.cells[5].innerHTML));
  addMark(map,position,row.cells[0].innerHTML);
}

function setAllMap(map){
  for (var i =0; i<markers.length; i++){
    markers[i].setMap(map);
  }
}

function clearMarkers(){
  setAllMap(null);
}

function deleteMarkers(){
  clearMarkers();
  markers = [];
}

function timeInRange(start,end,now)
{
  now_hr = now.getHours();
  now_min = now.getMinutes();
  hr1 = parseInt(start[0]);
  min1 = parseInt(start[1]);
  hr2 = parseInt(end[0]);
  min2 = parseInt(end[1]);
  if(((now_hr==hr1 && now_min>min1) || now_hr>hr1) && 
     ((now_hr==hr2 && now_min<min2) || now_hr<hr2))
    return true;
  return false;
}

function changeType(obj)
{
  console.log("button click");
  var m = document.getElementById("map");
  var t = document.getElementById("stations");
  console.log(m.style.opacity);
  console.log(t.style.opacity);
  var temp = m.style.opacity;
  console.log(temp);
  m.style.opacity = t.style.opacity;
  t.style.opacity = temp;
}

function isPhone()
{
  var userAgentInfo=navigator.userAgent;
  var userAgentKeywords=new Array("Android", "iPhone" ,"SymbianOS", "Windows Phone", "iPad", "iPod", "MQQBrowser");
  var flag=false;
  if(userAgentInfo.indexOf("Windows NT")==-1){
    flag=true;
  }
  return flag;
}
