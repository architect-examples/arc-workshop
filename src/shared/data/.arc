@app
arc-workshop

@tables
heartbeats
  utcDate *String
  utcTime **String

accounts
  accountID *String
  #email

notes
  accountID *String
  noteID **String
  #timestamp ISODateString
  #text String
  #title String
