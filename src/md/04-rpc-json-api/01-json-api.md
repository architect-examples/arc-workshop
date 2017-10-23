
```.arc
@app
arc-workshop

@json

# reads
get /api/notes                  # read all notes
get /api/notes/:noteID/comments # reads note comments

# writes
post /api/notes                                    # create note
post /api/notes/:noteID                            # update note
post /api/notes/:noteID/delete                     # delete note
post /api/notes/:noteID/comments                   # create comment
post /api/notes/:noteID/comments/:commentID        # update comment
post /api/notes/:noteID/comments/:commentID/delete # delete comment
```

