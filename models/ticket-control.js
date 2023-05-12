const path = require("path");
const fs = require("fs");

class Ticket {
  constructor(number, desk) {
    this.number = number;
    this.desk = desk;
  }
}

class TicketControl {
  constructor() {
    this.last = 0;
    this.today = new Date().getDate();
    this.tickets = [];
    this.last4s = [];
    this.init();
  }

  get toJson() {
    return {
      last: this.last,
      today: this.today,
      tickets: this.tickets,
      last4s: this.last4s,
    };
  }

  init() {
    const { today, last, tickets, last4s } = require("../db/data.json");
    if (today === this.today) {
      this.tickets = tickets;
      this.last4s = last4s;
      this.last = last;
    } else {
      // its other day
    }
    this.saveDB();
  }

  saveDB() {
    const dbPath = path.join(__dirname, "../db/data.json");
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  next() {
    this.last += 1;
    const ticket = new Ticket(this.last, null);
    this.tickets.push(ticket);

    this.saveDB();
    return "Ticket " + ticket.number;
  }

  attendTicket(desk) {
    // we dont have tickets
    if (this.tickets.length === 0) {
      return null;
    }
    const ticket = this.tickets.shift();
    ticket.desk = desk;

    this.last4s.unshift(ticket);

    if (this.last4s.length > 4) {
      this.last4s.splice(-1, 1);
    }

    this.saveDB();
    return ticket;
  }
}

module.exports = TicketControl;
