import { actualModule, valideNumber, goBack, Exists, successAlert, Upper, openSelect, applyFunctions, applyFunctionsArguments, errorAlert, updateCheckeds, Camera } from './functions.js'

//Modulo actual
actualModule();

//Solo numeros
const onlyNumbers = document.querySelectorAll(".onlynumbers")
applyFunctions(onlyNumbers, "keypress", () => {
  if (!valideNumber(event)) {
    event.preventDefault();
  }
})

//Ir a la pestaña anterior
const backArrow = document.querySelector(".back-button")
if (Exists(backArrow)) {
  applyFunctions([backArrow], "click", goBack)
}

//Upper
const upperInputs = document.querySelectorAll(".upper")
applyFunctionsArguments(upperInputs, "input", Upper)

//BOTON ENVIAR
const codeInput = document.getElementById("code-input");
const btnSend = document.getElementById('btn-send');
const codeForm = document.getElementById("code-form")
if (Exists(btnSend) && (codeInput)) {
  codeInput.addEventListener("input", () => {
    let inputValue = codeInput.value
    if (inputValue.length >= 6) {
      btnSend.addEventListener('click', () => {
        codeForm.submit();
      });
    }
  })
}

//Alerta 
const Alert = document.querySelector('.Alert');
if (Exists(Alert)) {
  let typeAlert = Alert.getAttribute('data-status');
  switch (typeAlert) {
    case "success-access":
      successAlert("¡Ingreso aceptado", "Has ingresado correctamente")
      break;
    case "success-exit":
      successAlert("Salida aceptada", "Has salido correctamente")
      break;
    case "success-user":
      successAlert("¡Usuario registrado!", "El usuario se ha registrado correctamente");
      break;
    case "success-vehicle":
      successAlert("Vehiculo registrado!", "El vehiculo se ha registrado correctamente");
      break;
    case "success-device":
      successAlert("Dispositivo registrado!", "El dispositivo se ha registrado correctamente");
      break;
  }
}



//TECLADO TOTEM

//Resolucion del dispositivo
let pageWidth = window.innerWidth;
let pageHeight = window.innerHeight;

//Si se tiene la resolucion del totem
if (pageWidth >= 1080 && pageHeight >= 1800) {
  const keyboard = document.querySelector('.keyboard'); //Keyboard
  let keys = document.querySelectorAll('.keys'); //Teclas
  let letters = Array.from(keys).filter(key => !key.classList.contains("special_key") && !key.classList.contains("disabled")); //Letras
  const inputs = document.querySelectorAll('input'); //Inputs
  let activeInput = null; //Input activo

  //Para cada input le agrego un evento click
  inputs.forEach(input => {
    input.addEventListener('click', function () {
      activeInput = input; // Input actual
      keyboard.classList.add('active'); //Abrir teclado
    });
    if (input.hasAttribute('autofocus')) { //Si tiene el atributo autofocus
      keyboard.classList.add('active'); //Abrir teclado
    }
  });

  //Para cada key le agrego un evento click
  keys.forEach(key => {
    key.setAttribute('keyname', key.textContent); //Agrego el atributo keyname con el nombre de la tecla
    if (!key.classList.contains("caps_lock_key") && !key.classList.contains("shift_left")) {
      key.addEventListener('click', function () {
        KeyClick(key, activeInput) //Funcion para agregar una letra al input
      })
    }
  })

  //Tecla enter
  const enterKey = document.querySelector('.enter_key').addEventListener('click', function () {
    EnterKey(activeInput);
  });

  //Tecla backspace
  const backspaceKey = document.querySelector('.backspace_key')
  backspaceKey.addEventListener('mousedown', function () {//Si se mantiene presionada la tecla
    BackspaceKeyDown(activeInput)
  });

  backspaceKey.addEventListener('mouseup', function () {//Si se suelta la tecla
    BackspaceKeyUp(activeInput);
  });

  //Tecla espacio
  const spaceKey = document.querySelector('.space_key').addEventListener('click', function () {
    SpaceKey(activeInput);
  });

  //Tecla Bloq mayus
  const caps_lock_key = document.querySelector('.caps_lock_key')
  caps_lock_key.addEventListener('click', function () {
    BloqMayusKey();
  });

  //Tecla shift
  const shift_left = document.querySelector('.shift_left')
  shift_left.addEventListener('click', function () {
    ShiftKey();
  });

  //FUNCIONES

  function mayusLetters(letter) {
    letter.innerText = letter.innerText.toUpperCase(); //Letras en mayuscula
  }

  function normalLetters(letter) {
    letter.innerText = letter.getAttribute('keyname'); //Letras en minuscula
  }

  //Funcion para agregar una letra al input
  function KeyClick(key, input) {
    let onlynumbers = input.classList.contains("onlynumbers") //Verificar si el input tiene la clase solo numeros

    key.classList.add('active'); //Agrego la clase active
    setTimeout(() => { //Despues de 200ms remuevo la clase active
      key.classList.remove('active')
    }, 200);

    // sourcery skip: merge-nested-ifs
    if (letters.includes(key)) {
      if (!onlynumbers || (onlynumbers && !isNaN(key.innerText))) { //Si el campo no tiene la clase solonumeros || Si el campo es de solo numeros y la key es un numero
        input.value += key.innerText;
      }
    }

  }

  //Funcion para agregar un enter
  function EnterKey(input) {
    let form = input.closest('form'); //Formulario actual
    form.submit(); //Envio el formulario
  }

  //Funcion para agregar un espacio al input
  function BackspaceKeyDown(input) {
    backspaceKey.classList.add('active');
    actionInterval = setInterval(() => { //Cada 70ms remuevo el ultimo caracter del input
      input.value = input.value.slice(0, -1);
    }, 60);
  }

  function BackspaceKeyUp() {
    backspaceKey.classList.remove('active');
    clearInterval(actionInterval);//Paro el intervalo
  }

  //Funcion para agregar un espacio al input
  function SpaceKey(input) {
    input.value += ' ';
  }

  //Funcion para bloquear mayusculas
  function BloqMayusKey() {
    caps_lock_key.classList.toggle("active");

    letters.forEach(letter => { //Para cada letra
      if (caps_lock_key.classList.contains('active')) { //Si bloq mayus esta activa
        mayusLetters(letter);
        letter.addEventListener("click", function () {
          letters.forEach(function (letter) {
            mayusLetters(letter);
          })
        });
      } else {
        normalLetters(letter); //Si no volver a la normalidad
      }
    });
  };


  //Funcion shift
  function ShiftKey() {
    shift_left.classList.toggle('active');

    letters.forEach(letter => { //Para cada letra
      if (shift_left.classList.contains('active')) {
        mayusLetters(letter);
        letter.addEventListener("click", function () {
          letters.forEach(letter => {
            normalLetters(letter);
          });
          shift_left.classList.remove('active'); //Remover la clase active 
        });
      } else {
        normalLetters(letter);
      }
    });
  }


}

//CAMARA
// Obtener referencia al elemento de video y al canvas
const camaraModal = document.getElementById('camaraModal');
if (Exists(camaraModal)) {
  Camera();
}

//SELECTS
const selects = document.querySelectorAll(".select-btn")
applyFunctionsArguments(selects, "click", openSelect)

//SELECT DISPOSITIVOS Y VEHICULOS
if (Exists(selects)) {

  //DISPOSITIVOS
  const devicesInput = document.getElementById('devices');
  const deviceItems = document.querySelectorAll(".item-device");
  const btnText = document.querySelector(".device .btn-text");
  const user = document.getElementById("user");
  let rol = null
  user ? fetch(`/api/users/${user.value}`)
    .then(response => response.json())
    .then(data => {
      rol = data.rol.nombre
    }) : null;

  updateCheckeds("Dispositivos", "device", devicesInput, btnText);

  applyFunctionsArguments(deviceItems, "click", (item) => {
    if (item.classList.contains("checked") || rol == "Instructor" || document.querySelectorAll(".item-device.checked").length < 3) {
      item.classList.toggle("checked");
      updateCheckeds("Dispositivos", "device", devicesInput, btnText);
    }
  })

  //VEHICULOS

  //Seleccionar vehiculos
  const vehicleInput = document.getElementById('vehicle');
  const vehicleItems = document.querySelectorAll(".item-vehicle");
  const btnTextVehicle = document.querySelector(".vehicle .btn-text");

  applyFunctionsArguments(vehicleItems, "click", (item) => {
    if (!item.classList.contains("checked")) {
      // Remover la clase 'checked' de todos los elementos
      vehicleItems.forEach(otherItem => otherItem.classList.remove("checked"));
    }
    item.classList.toggle("checked");
    updateCheckeds("Vehiculos", "vehicle", vehicleInput, btnTextVehicle)
  });

}

//ALERTA POR COMPROBACION DE DISPOSITIVO

const deviceExit = document.getElementById("device_exit") // Input del dispositivo a escanear

if (Exists(deviceExit)) {
  const user = deviceExit.getAttribute("data-user") // Capturar el usuario
  //Focus al input despues de 2sg fuera
  deviceExit.addEventListener("blur", () => {
    setTimeout(() => {
      deviceExit.focus()
    }, 2000)
  })
  //Al enviar
  deviceExit.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault() //Prevenir el envio del formulario
      const url = `?code=${user}&exitDevice=${deviceExit.value}` //Url para enviar el codigo del usuario y el dispositivo
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const response = data.response
          if (response.status === "success") {
            successAlert("Dispositivo encontrado", "El dispositivo coincide con el ingreso")
          } else {
            errorAlert("Dispositivo no encontrado", "El dispositivo no coincide con el ingreso")
          }
          deviceExit.value = ""
        })
    }
  })
}

//=====================================================================================================
//REGISTROS

//CAMBIAR MARCA SEGUN EL TIPO

//DISPOSITIVOS
const selectType = document.querySelector(".tipo-dispositivo") //Select tipo

if (selectType) {
  document.addEventListener('DOMContentLoaded', function () {
    const selectMarca = document.querySelector(".marca-dispositivo") //Select marca

    selectType.addEventListener("change", function () {
      let selectedType = selectType.value

      fetch(`?selectedType=${selectedType}`) //Enviar variable por get
        .then(response => response.json()) //Esperar y recibir respuesta Json
        .then(data => { //Manejar data
          selectMarca.innerHTML = "";

          const options = data.options

          options.forEach(option => {
            const optionElement = document.createElement("option")
            optionElement.value = option.id;
            optionElement.textContent = option.marca;
            selectMarca.appendChild(optionElement)

          })
        })
    })
  })
}

//VEHICULOS
const typeVehicle = document.querySelector(".tipo-vehiculo")

if (typeVehicle) {
  fetch(`?type=${typeVehicle.value}`)
    .then(response => response.json())
    .then(data => {
      const selectMarca = document.querySelector(".marca-vehiculo")

      selectMarca.innerHTML = "";

      const options = data.options

      options.forEach(option => {
        const optionElement = document.createElement("option")
        optionElement.value = option.id
        optionElement.textContent = option.marca
        selectMarca.appendChild(optionElement)
      })
    })
}

