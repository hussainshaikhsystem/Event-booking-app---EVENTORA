const { default: mongoose } = require("mongoose");

const eventschema = new mongoose.Schema({
   title: {
    type: String,
    required: true
   },
   description : {
    type: String,
    required: true
   },
   date: {
    type: Date,
    required : true
   },
   location : {
    type: String,
    required: true
   },
   category : {
    type: String,
    required: true
   },
   totalseats: {
    type: Number,
    required: true
   },
   availableseats: {
      type: Number,
      required: true
   },
   ticketprice: {
    type: Number,
    required: true
   },
   imageurl :{
     type: String,
     required: true
   },
   createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
}, {timestamps: true});
module.exports = mongoose.model('Event', eventschema)