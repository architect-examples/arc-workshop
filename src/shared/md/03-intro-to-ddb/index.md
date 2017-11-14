a very simple blog
use github for auth

```.arc
@app
arc-workshop

@html
get /
get /login
post /notes
post /notes/:noteID
post /notes/:noteID/delete
post /logout

@tables
accounts
  accountID *String
  #email

notes
  accountID *String
  noteID *String
  #timestamp ISODateString
  #text String
  #title String`
``
