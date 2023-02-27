# GET /api/users/id/:user_id

- Change endpoint to /api/users/profile (user id no longer needs to be passed in the URL as it can be obtained from passport)

# GET /api/users/:user_id/geodata

- Change endpoint to /api/users/me/geodata, /api/users/geodata (whichever you prefer)
- Add (passport.authenticate("session") before controller function in App.js
  e.g `app.get("URL", passport.authenticate("session", controllerFunction);)`
- Add error handling in controller function
  e.g
  ```
  if (req.isAuthenticated()) {
  queryDatabase
  }
  else {
  res.status(401).json({ msg: "Not authenticated" });
  }
  ```

# DELETE /api/users/:user_id/geodata

- Change endpoint to /api/users/me/geodata, /api/users/geodata (whichever you prefer)
- Add (passport.authenticate("session") before controller function in App.js
  e.g `app.get("URL", passport.authenticate("session", controllerFunction);)`
- Add error handling in controller function
  e.g
  ```
  if (req.isAuthenticated()) {
  queryDatabase
  }
  else {
  res.status(401).json({ msg: "Not authenticated" });
  }
  ```

# GET /api/geodata

- Add (passport.authenticate("session") before controller function in App.js
  e.g `app.get("URL", passport.authenticate("session", controllerFunction);)`
- Add error handling in controller function
  e.g
  ```
  if (req.isAuthenticated()) {
  queryDatabase
  }
  else {
  res.status(401).json({ msg: "Not authenticated" });
  }
  ```

# POST /api/geodata

- Add (passport.authenticate("session") before controller function in App.js
  e.g `app.get("URL", passport.authenticate("session", controllerFunction);)`
- Add error handling in controller function
  e.g
  ```
  if (req.isAuthenticated()) {
  queryDatabase
  }
  else {
  res.status(401).json({ msg: "Not authenticated" });
  }
  ```

# GET /api/geodata/:geodata_id

- Add (passport.authenticate("session") before controller function in App.js
  e.g `app.get("URL", passport.authenticate("session", controllerFunction);)`
- Add error handling in controller function
  e.g
  ```
  if (req.isAuthenticated()) {
  queryDatabase
  }
  else {
  res.status(401).json({ msg: "Not authenticated" });
  }
  ```

# DELETE /api/geodata/:geodata_id

- Add (passport.authenticate("session") before controller function in App.js
  e.g `app.get("URL", passport.authenticate("session", controllerFunction);)`
- Add error handling in controller function
  e.g
  ```
  if (req.isAuthenticated()) {
  queryDatabase
  }
  else {
  res.status(401).json({ msg: "Not authenticated" });
  }
  ```
- Will also need a check in the model, something to check if the user_id in the auth matches the user_id of the geodata. Might be best to run a SELECT request first on the specific geodata_id and then check if the user_id on there matches before running the delete command

# GET /api/trips/:user_id

- Change endpoint to /api/trips/me, /api/trips (whichever you prefer (but keep the same format as what you chose for the DELETE /api/users/:user_id/geodata endpoint ))
- Add (passport.authenticate("session") before controller function in App.js
  e.g `app.get("URL", passport.authenticate("session", controllerFunction);)`
- Add error handling in controller function
  e.g
  ```
  if (req.isAuthenticated()) {
  queryDatabase
  }
  else {
  res.status(401).json({ msg: "Not authenticated" });
  }
  ```

# POST /api/trips/:user_id

- Change endpoint to /api/trips/me, /api/trips (whichever you prefer (but keep the same format as what you chose for the DELETE /api/users/:user_id/geodata endpoint ))
- Add (passport.authenticate("session") before controller function in App.js
  e.g `app.get("URL", passport.authenticate("session", controllerFunction);)`
- Add error handling in controller function
  e.g
  ```
  if (req.isAuthenticated()) {
  queryDatabase
  }
  else {
  res.status(401).json({ msg: "Not authenticated" });
  }
  ```
