#coding=utf-8
from pygeocoder import Geocoder
import time
import sys

_file = open("allStation", 'r')
data = _file.readlines()

print "<tbody>"
for i in range(0, len(data), 4):
  print "  <tr>"
  if i%40==0 :
    sys.stderr.write("%d/%d\n"%(i,len(data)))
    time.sleep(1)
  for j in range(0, 4, 1):
    print "    <td>" + data[i+j].replace("\n","") + "</td>"
  try:
    results = Geocoder.geocode(data[i+1].replace("-","之"))
    print "    <td>" + str(results[0].coordinates[0])+"</td>"
    print "    <td>" + str(results[0].coordinates[1])+"</td>"
  except:
    sys.stderr.write("problem - %d : %s\n"%(i,data[i+1]))
    print "    <td>" + "NULL" + "</td>"
    print "    <td>" + "NULL" + "</td>"
  print "  </tr>"

print "</tbody>"

_file.close()
