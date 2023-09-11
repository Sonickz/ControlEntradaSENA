//=====================================================================================================
//FUNCIONES GENERALES

//Funcion para validar existencia del elemento
export function Exists(element) {
    return element !== null && typeof element === 'object';
}

//Funcion para saber el modulo seleccionado
export function actualModule() {
    const url = window.location.href
    const module1 = "module1"
    const module2 = "module2"
    const headerTextModule = document.querySelector(".header-title-module")

    if (url.includes(module1)) {
        headerTextModule.innerHTML = "Modulo 1>";
    } else if (url.includes(module2)) {
        headerTextModule.innerHTML = "Modulo 2>";
    }
}

// Funcion solo numeros
export function valideNumber(evt) {
    // code is the decimal ASCII representation of the pressed key.
    let code = (evt.which) ? evt.which : evt.keyCode;

    if (code == 8) { // backspace.
        return true;
    }
    else if (code == 13) { // enter
        return true;
    } else if (code >= 48 && code <= 57) { // is a number.
        return true;
    } else { // other keys.
        return false;
    }
}

// Auto mayus
export function Upper(input) {
    input.value = input.value.toUpperCase();
}

//Volver atras
export function goBack() {
    window.history.back();
  }

//Funcion Alerta SweetAlert
export function successAlert(title, text) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 2000
    })
  }

//=====================================================================================================

//Funcion para cambiar el ingreso
export function changeTableBtnsAccess(btns, tableContainer1, tableContainer2) {

    //Para cada boton, escuchar el evento click
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleBtnsAccess(btns, btn, tableContainer1, tableContainer2) //Funcion para manejar los botones
        });
    });

}

function handleBtnsAccess(otherBtns, btn, tableContainer1, tableContainer2) {
    //Remover clase activa de los demas botones
    otherBtns.forEach(otherbtn => {
        otherbtn.classList.remove('btn-green2-active')
    })
    btn.classList.add('btn-green2-active') //Agregar clase activa al boton seleccionado
    let id = btn.getAttribute("data-id");

    const ingresoActivo = "1"
    const ingresosSalidas = "2"

    if (id == ingresoActivo) {
        tableContainer2.classList.add("table-animation")
        setTimeout(() => {
            tableContainer2.classList.add("d-none")
            tableContainer1.classList.remove("table-animation", "d-none")
        }, 500)
    } else {
        tableContainer1.classList.add("table-animation")
        setTimeout(() => {
            tableContainer1.classList.add("d-none")
            tableContainer2.classList.remove("table-animation", "d-none")
        }, 500)
    }
}
//=====================================================================================================

