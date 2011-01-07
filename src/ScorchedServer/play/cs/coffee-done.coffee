# Signals to JavaScript that this CoffeeScript file is being interpreted
# It's useful to include this script as the last file
# in a series of text/coffeescript imports

if jQuery?
  jQuery(document).trigger "coffeeDone"

if coffeeDone?
  coffeeDone()
