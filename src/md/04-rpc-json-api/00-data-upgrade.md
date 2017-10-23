advances blog to use a JSON api
progressive enhance the UI to use these routes

```.arc
@app
# repo arc-workshop-04-json-api
arc-workshop

@json
get /api/notes                 # read all notes
get /api/notes/:noteID         # read one note
post /api/notes                # create note
post /api/notes/:noteID        # update note
post /api/noes/:noteID/delete  # delete note

get /api/notes/:noteID/comments                      # reads the comments
post /api/notes/:noteID/comments                     # create comment
post /api/notes/:noteID/comments/:commentID          # update comment
post /api/notes/:noteID/comments/:commentID/delete   # delete comment
```

likewise a repo/module for the data layer
```.arc
@tables
accounts
  accountID *String
  #email String
  #username String
  #password String
  #created String
  #avatar String

notes
  accountID *String
  noteID *String
  #timestamp ISODateString
  #text String
  #title String

comments
  noteID *String
  commentID **String
  #accountID String
  #text String
```
