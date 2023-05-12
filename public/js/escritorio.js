const lblDesk = document.querySelector("h1");
const btnAtender = document.querySelector("button");
const lblTicket = document.querySelector("small");
const lblAlert = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("Desk word is forbidden");
}

const desk = searchParams.get("escritorio");
lblAlert.style.display = "none";
lblDesk.innerText = desk;

const socket = io();

socket.on("connect", () => {
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  btnAtender.disabled = false;
});

socket.on("pending-tickets", (pendings) => {
  if (pendings === 0) {
    lblPendientes.style.display = "none";
  } else {
    lblPendientes.style.display = "";
  }
  lblPendientes.innerText = pendings;
});

btnAtender.addEventListener("click", () => {
  socket.emit("attend-ticket", { desk }, ({ ok, ticket }) => {
    if (!ok) {
      lblTicket.innerText = "None";
      return (lblAlert.style.display = "");
    }
    lblTicket.innerText = "Ticket " + ticket.number;
  });
});
