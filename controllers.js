const upload = require("./uploadConfig");
const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

try {
  client.connect();
  console.log("connected to MongoDB");
} catch (e) {
  console.log("error in connecting to the database :" + e);
}
const db = client.db("eventMaster");
console.log(`connectd to db ${db.namespace}`);
const collection = db.collection("events");
console.log(`connected to collection ${collection.namespace}`);

const getEvents = async (req, res) => {
  const id = req.query.id;
  if(id){
    if(ObjectId.isValid(id)){
      const event = await collection.findOne(new ObjectId(id))
      if(event){
        return res.status(200).json(event)
      } else {
        return res.status(404).json({error : "Not a Valid Id"})
      }
    } else {
      return res.status(404).json({error : "Not a Valid Id"})
    }
  }
   else {
    const { limit, page } = req.query

    const intLimit = parseInt(limit, 10);
    const intPage = parseInt(page, 10);

    const events = await collection.find({}).sort({schedule : -1}).toArray();
    const startIndex =(intPage-1) * intLimit
    const endIndex = startIndex + intLimit

    const finalEvents = events.slice(startIndex,endIndex)
    return res.status(200).json(finalEvents)
  }

};

const postEvent = async (req, res) => {
    console.log(req.body);

  const {
    type,
    uid,
    name,
    tagline,
    schedule,
    description,
    moderator,
    category,
    sub_category,
    rigor_rank,
    attendees,
  } = req.body;

  if (
    !type ||
    !uid ||
    !name ||
    !tagline ||
    ! schedule ||
    !description ||
    !moderator ||
    !category ||
    !sub_category ||
    !rigor_rank ||
    !attendees ||
    !Number.isInteger(parseInt(rigor_rank))
  ) {
    return res.status(400).json({ mssg: "One or more parameters not found" });
  }
  if (!req.file) {
    return res.status(400).json({ message: "Photo is required" });
  }
  const date = new Date();
  const newEvent = {
    type: type,
    uid: uid,
    name: name,
    tagline: tagline,
    schedule: new Date(schedule),
    image: req.file.path,
    moderator: moderator,
    category: category,
    sub_category: sub_category,
    rigor_rank: rigor_rank,
    attendees: attendees,
  };
  try {
    const insertEvent = await collection.insertOne(newEvent);
    return res.status(200).json(insertEvent);
  } catch (e) {

    console.log("error in inserting the document in database : " + e);
    return res.status(400).json({msg : "error in insertin the document" })
  }
};

const updateEvent = async (req,res) => {
  const {id} = req.params;
  if (ObjectId.isValid(id)){

    const {
      type,
      uid,
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
      attendees,
    } = req.body;
  
    if (
      !type ||
      !uid ||
      !name ||
      !tagline ||
      !schedule ||
      !description ||
      !moderator ||
      !category ||
      !sub_category ||
      !rigor_rank ||
      !attendees ||
      !Number.isInteger(parseInt(rigor_rank))
    ) {
      return res.status(400).json({ mssg: "One or more parameters not found" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Photo is required" });
    }
  
    const date = new Date();
    const newEvent = {
      type: type,
      uid: uid,
      name: name,
      tagline: tagline,
      schedule: new Date(schedule),
      image: req.file.path,
      moderator: moderator,
      category: category,
      sub_category: sub_category,
      rigor_rank: rigor_rank,
      attendees: attendees,
    };


     if(collection.findOne({_id : new ObjectId(id) })){
        try{
          const updatedEvent = collection.updateOne(   { _id: new ObjectId(id) },
          { $set: newEvent })
          res.status(200).json(newEvent)
        } catch (e) {
          return res.status(400).json({mssg: `Error in updating the record ${e}`})
        }
     }
  } else {
    return res.status(404).json({msg : "Not a valid Event Id"})
  }
}


const deleteEvent = async (req, res) => {
    const  id  = req.params;
    console.log(typeof(id))
    if(ObjectId.isValid(id)){
        try{ 
        const filter = {_id : new ObjectId(id)}
        const removedEvent = await collection.deleteOne(filter);
        res.status(200).json({removedEvent})
        }catch (e){
            return res.status(400).json({error : ` error in deleting : ${e}`})
        }
    } else {
        return res.status(404).json({mssg: "Not a valid Event Id"})
    }
}

module.exports = { getEvents, postEvent, updateEvent , deleteEvent};
