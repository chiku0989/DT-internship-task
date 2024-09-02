const app = require("express")
const {getEvents, postEvent, updateEvent ,deleteEvent} = require("./controllers")
const Router = app.Router()
const upload = require("./uploadConfig")

Router.get('/events', getEvents)

Router.post('/events', upload.single('photo'),postEvent)

Router.delete('/events/:id', deleteEvent)

Router.put("/events/:id", upload.single('photo'),updateEvent)
module.exports = Router;