const mongoose = require('mongoose');


const ticketRequestSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestedTicket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    offeredTicket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
    status: { type: String, default: 'pending' },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TicketRequest', ticketRequestSchema);
