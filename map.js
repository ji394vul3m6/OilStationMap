var map;
function initialize() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(23.5466, 121.083)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      map.setCenter(pos);
      console.log(pos);
    },function(){
      //handleNoGeolocation(true);
    });
  }else{
    //handleNoGeolocation(false);
  }

}

google.maps.event.addDomListener(window, 'load', initialize);

function search(obj){
  console.log(obj.options[obj.selectedIndex].value);
  key=obj.options[obj.selectedIndex].value;
  if(key=="全台")
    showAll()
  else{
    var dataId = document.getElementById('datas');
    var dataLength = dataId.rows.length;
    var searchCol = 1;
    for(var i=1; i<dataLength; i++){
      var searchText = dataId.rows[i].cells[searchCol].innerHTML;
      if(searchText.match(key))
        dataId.rows[i].style.display='';
      else
        dataId.rows[i].style.display="none";
    }
  }
}

function showAll(){
  var dataId = document.getElementById('datas');
  var dataLength = dataId.rows.length;
  var searchCol = 1;
  for(var i=0; i<dataLength; i++){
    dataId.rows[i].style.display='';
  }
}
