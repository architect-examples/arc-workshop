@app
arc-workshop

#@domain
#workshop.arc.codes

@html
get /
get /:page

@tables
accounts
  accountID *String

feedbacks
  accountID *String
  fbID **String

reactions
  emojiID *String
