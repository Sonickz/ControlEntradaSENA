//ADMIN

//Menu Admin
if (window.location.href.includes('/admin/')) {

    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.add("admin", "body-collapsed");
    });
  
    const adminMenu = document.getElementById("adminmenu")
    adminMenu.classList.add("active");
  
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
    let itemName = item.getAttribute("data-name");
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