_file = open("table_new", 'r')
lines = _file.readlines()

_output = open("table_new_blank", 'w')

for line in lines:
  _output.write("            %s" % line)

_output.close()
_file.close()
