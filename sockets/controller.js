const TicketControl = require("../models/ticket-control");
const ticketControl = new TicketControl();

const socketController = (socket) => {
  // when the client connects
  socket.emit("last-ticket", ticketControl.last);
  socket.emit("current-state", ticketControl.last4s);
  socket.emit("pending-tickets", ticketControl.tickets.length);

  socket.on("next-ticket", (payload, callback) => {
    const next = ticketControl.next();
    callback(next);
    socket.broadcast.emit("pending-tickets", ticketControl.tickets.length);
  });
  socket.on("attend-ticket", ({ desk }, callback) => {
    if (!desk) {
      return callback({
        ok: false,
        msg: "Desk is forbidden",
      });
    }

    const ticket = ticketControl.attendTicket(desk);

    socket.broadcast.emit("current-state", ticketControl.last4s);
    socket.emit("pending-tickets", ticketControl.tickets.length);
    socket.broadcast.emit("pending-tickets", ticketControl.tickets.length);

    if (!ticket) {
      callback({ ok: false, msg: "Ya no hay tickets pendientes" });
    } else {
      callback({ ok: true, ticket });
    }
  });
};

module.exports = {
  socketController,
};
