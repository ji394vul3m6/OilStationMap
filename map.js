var map;
var geocoder;
var dataId;
var dataLength;
var searchCol=1;
var markers = [];
var showWindow;
var time_now;
var check_time;
var checkChange=false;
var datas = [];
var dataInRange = [];
var bound;

function initialize() {
  //create a div on the right of debug message if in debug mode
  if(location.href.indexOf("debug")!=-1){
    error_div = document.createElement("div");
    error_div.id = "error-div";
    document.getElementsByTagName("body")[0].appendChild(error_div);

    //redirect console.log to error_div
    if(typeof console !="undefined")
      if(typeof console.log != 'undefined')
        console.olog = console.log;
      else
        console.olog = function(){};
    console.log = function(message){
      console.olog(message);
      error_div.innerHTML += (message+'<br>');
      error_div.scrollTop = error_div.scrollHeight;
    }
    console.error = console.debug = console.info = console.log;
  }

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

  for (var i=0; i<dataLength; i++){
    if(!isPhone()){
      dataId.rows[i].style.height = "25px";
      dataId.rows[i].cells[0].style.width = "260px"
      dataId.rows[i].cells[1].style.width = "330px"
      dataId.rows[i].cells[2].style.width = "75px"
      dataId.rows[i].cells[2].style.textAlign = "center"
      dataId.rows[i].cells[3].style.width = "75px"
      dataId.rows[i].cells[3].style.textAlign = "center"
    }
    if(i!=0)
      datas.push(dataId.rows[i]);
  }
  //if(isPhone()){
    for(var i=0; i<datas.length; i++){
      datas[i].insertCell();
      datas[i].cells[6].innerHTML=(i+1).toString();
      datas[i].cells[6].style.display="none";
    }
  //}
//  datas = dataId.rows.sort(function(a,b){
  datas = datas.sort(function(a,b){
    return parseFloat(a.cells[4].innerHTML) - parseFloat(b.cells[4].innerHTML);
  });
  time_now = new Date();

  bound = map.getBounds();

  addMarkSelfPosition(map);
  google.maps.event.addListener(map, 'idle', function(){
    console.log("idle event");
    //showAllInRange()
    showAll();
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

function setGeoLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      map.setCenter(pos);
      map.setZoom(13);
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
function addMarkWithHref(_map, _position, _title, _content){
  var contentString;
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      contentString='<div id="infoWindow"><a href="https://maps.google.com/maps?saddr='+
                    position.coords.latitude.toString()+
                    ','+position.coords.longitude.toString()+
                    '&'+'daddr='+
                    _content+
                    //_position.lat().toString()+
                    //','+_position.lng().toString()+
                    '">'+ _title +'</a></br>'+
                    _content + '</div>';

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
        if(showWindow){
          showWindow.close();
        }
        showWindow = infowindow;
        infowindow.open(map,marker);
        map.panTo(_position);
      });
      markers.push(marker);
    },function(){
      //handleNoGeolocation(true);
    });
  }else{
    //handleNoGeolocation(false);
  }
}

function addMarkSelfPosition(_map){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var infowindow = new google.maps.InfoWindow({
        content: '<small>現在位置</small>'
      });
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      var marker = new google.maps.Marker({
        map: _map,
        position: pos,
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      });
      showWindow = infowindow;
      markers.push(marker);
      infowindow.open(_map,marker);
    },function(){
      //handleNoGeolocation(true);
    });
  }else{
    //handleNoGeolocation(false);
  }
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

function showAllInRange(){
  bound = map.getBounds();
  for(var i=0; i<datas.length; i++){
    if(getLatInDatasRow(i) > bound.Ea.k){
      if(inMapBounds(parseFloat(datas[i].cells[4].innerHTML), 
                     parseFloat(datas[i].cells[5].innerHTML), 
        bound)){
          //handle add/remove marker here
          //dataInRange.push(datas[i]);
        }
    }
  }
}

function getLatInDatasRow(i){
  return parseFloat(datas[i].cells[4].innerHTML);
}

function inMapBounds(lat,lng,map_bound){
  if(map_bound.Ea.k<lat && map_bound.Ea.j>lat)
    if(map_bound.va.j<lng && map_bound.va.k>lng)
      return true;
  return false;
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
  addMarkWithHref(map,position,row.cells[0].innerHTML,row.cells[1].innerHTML);
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
  for(var i=0; i<userAgentKeywords.length; i++){
    if(userAgentInfo.indexOf(userAgentKeywords[i])!=-1){
      flag=true;
    }
  }
  return flag;
}
