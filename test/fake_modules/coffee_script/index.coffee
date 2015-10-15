require 'coffee'

# These are some CoffeeScript code snippets copied from its site.
# The CoffeeScript syntax should be recognized.

# Conditions:
number = -42 if opposite

# Functions:
square = (x) -> x * x

# Objects:
math =
  root:   Math.sqrt
  square: square
  cube:   (x) -> x * square x

# Splats:
race = (winner, runners...) ->
  print winner, runners

# Existence:
alert "I knew it!" if elvis?

# Array comprehensions:
cubes = (math.cube num for num in list)
