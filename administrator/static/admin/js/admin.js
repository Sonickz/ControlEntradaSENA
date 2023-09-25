import { applyFunctions, applyFunctionsArguments, changeTables, changeView } from "../../../../static/js/functions.js"

//ADMIN

//======================================================================

//MENU ADMIN
if (window.location.href.includes('/admin/')) { //Si el enlace tiene admin 
  //Añadir al body, clases
  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add("admin", "body-collapsed");
  });

  //Mostrar el menu admin
  const adminMenu = document.getElementById("adminmenu")
  adminMenu.classList.add("active");

  //Boton btn-burger para esconder el menu
  const menuBtn = document.querySelector(".menu-btn");
  menuBtn.addEventListener("click", () => {
    document.body.classList.toggle("body-collapsed");
    document.body.classList.toggle("body-expanded");
    adminMenu.classList.toggle("menu-expanded");
    adminMenu.classList.toggle("menu-collapsed");
  });
}

//MENU: ITEM ACTIVO
const adminMenu = document.getElementById("adminmenu")
const items = adminMenu.querySelectorAll(".menu-items .item");
const url = window.location.href;

items.forEach((item) => {
  let itemName = item.getAttribute("data-name"); //Obtener el nombre del item
  //Si la url contiene el nombre del item, añadirle la clase item-active
  if (url.includes(itemName)) {
    item.classList.add("item-active")
  }
});

//======================================================================

//Animacion admin | Cambiar entre dos vistas
const btnRegister = document.getElementById("btn-register");
const adminContainer = document.getElementById("admin")
changeView(btnRegister, adminContainer);

//Cambiar entre tablas con los botones
const btns = document.querySelectorAll(".btn-change-table .btn");
const tables = document.querySelectorAll(".table-container");
changeTables(btns, tables);




