let mongoose = require("mongoose");
let Schema = mongoose.Schema;

// create a schema
let TicketSchema = new Schema({
  sector: { type: String, required: true },
  price: { type: Number, required: true },
  gameId: { type: String, required: true },
  userId: { type: String, required: true },
});

// the schema is useless so far
// we need to create a model using it
let Ticket = mongoose.model("Ticket", TicketSchema);

// make this available to our users in our Node applications
module.exports = Ticket;