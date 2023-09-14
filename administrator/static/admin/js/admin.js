import { applyFunctions, applyFunctionsArguments } from "../../../../static/js/functions.js"

//ADMIN

//Menu Admin
if (window.location.href.includes('/admin/')) { //Si el enlace tiene admin 
  //Añadir al body clases
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

//Item del menu activo
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

//Animacion admin | Cambiar entre tabla select y form
const btnRegister = document.getElementById('btn-register');
if (btnRegister) {

  btnRegister.addEventListener('click', () => {
    adminMain.classList.add('slide');
  });

  const adminMain = document.getElementById("admin")
  const btnBack = document.getElementById('btn-back').addEventListener("click", () => {
    adminMain.classList.remove("slide")
  })

}



//Cambiar entre tablas con los botones
const btns = document.querySelectorAll(".btn-change-table .btn");
const tables = document.querySelectorAll(".table-container")
applyFunctionsArguments(btns, "click", (btn)=>{
  btns.forEach((otherbtn) => {
    otherbtn.classList.remove("btn-green2-active");
  })

  btn.classList.add("btn-green2-active");
  let dataBtn = btn.getAttribute("data-table");
  tables.forEach((table) => {
    table.classList.add("d-none");
    let dataTable = table.getAttribute("data-table");
    if (dataTable == dataBtn){
      table.classList.remove("d-none");
    }    
  })
})