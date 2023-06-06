
import { ipcRenderer } from './preload'

const form = document.querySelector("form");
form.addEventListener("submit", submitForm);

function submitForm(e) {
  //e.preventDefault();
  console.log(123);
}
