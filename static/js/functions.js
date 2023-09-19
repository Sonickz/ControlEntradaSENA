//=====================================================================================================
//FUNCIONES GENERALES

//Funcion para aplicar funciones
export function applyFunctions(elements, event, callback) {
    if (Exists(elements)) {
        elements.forEach(element => {
            element.addEventListener(event, callback)
        })
    }
}

//Funcion para aplicar funciones con argumentos
export function applyFunctionsArguments(elements, event, callback) {
    if (Exists(elements)) {
        elements.forEach(element => {
            element.addEventListener(event, ()=>{
                callback(element)
            })
        })
    }
}

//Funcion para validar existencia del elemento
export function Exists(element) {
    return element !== null && typeof element === 'object';
}

//Funcion para saber el modulo seleccionado
export function actualModule() {
    const url = window.location.href
    const module1 = "module1"
    const module2 = "module2"
    const module3 = "module3"
    const headerTextModule = document.querySelector(".header-title-module")

    if (url.includes(module1)) {
        headerTextModule.innerHTML = "Modulo 1>";
    } else if (url.includes(module2)) {
        headerTextModule.innerHTML = "Modulo 2>";
    } else if (url.includes(module3)){
        headerTextModule.innerHTML = "Modulo 3>";
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

//Abrir select
export function openSelect(btn) {
    btn.classList.toggle("open");
}

//Funcion Alerta SweetAlert
export function successAlert(title, text) {
    Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 1000
    })
}

function playSoundAlert(){
    const audio = "/static/assets/sounds/beep-alert.mp3"
    const soundAlert = new Audio(audio)
    soundAlert.play()
}
//Funcion Alerta Error SweetAlert
export function errorAlert(title, text) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 2000
    })
    playSoundAlert()
}

//=====================================================================================================

