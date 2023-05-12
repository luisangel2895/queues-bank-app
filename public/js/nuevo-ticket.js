const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnCreate = document.querySelector("button");

const socket = io();

socket.on("connect", () => {
  btnCreate.disabled = false;
});

socket.on("disconnect", () => {
  btnCreate.disabled = false;
});

socket.on("last-ticket", (last) => {
  lblNuevoTicket.innerText = "Ticket " + last;
});

btnCreate.addEventListener("click", () => {
  socket.emit("next-ticket", null, (ticket) => {
    lblNuevoTicket.innerText = ticket;
  });
});
