const modal = document.getElementById("infoModal");
const span = document.getElementsByClassName("close")[0];

export const showModal = () => {
    modal.style.display = "block";
}

export const hideModal = () => {
    modal.style.display = "none";
}

span.onclick = () => {
  hideModal(); 
}

window.onclick = (event) => {
  if (event.target == modal) {
    hideModal(); 
  }
}