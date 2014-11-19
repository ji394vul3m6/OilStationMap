_file=open("allStation", 'r')
data=_file.readlines()

print "<tbody>"
for i in range(0, len(data), 4):
  print "  <tr>"
  for j in range(0, 4, 1):
    print "    <td>" + data[i+j].replace("\n","") + "</td>"
  print "  </tr>"

print "</tbody>"

_file.close()
