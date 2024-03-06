import { actualModule, valideNumber, goBack, Exists, successAlert, Upper, openSelect, applyFunctions, applyFunctionsArguments, errorAlert, updateCheckeds, Camera, totemKeyboard, compDevice, compInput, module2, module3 } from './functions.js'

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
  codeInput.addEventListener("blur", () => {
    setTimeout(() => {
      codeInput.focus()
    }, 1000)
  })
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
    case "success-admin":
      successAlert("Administrador registrado!", "El administrador se ha registrado correctamente");
      break;
    case "error-module1":
      errorAlert("Ingreso activo en modulo 1", "Error: Se tiene un ingreso activo en el modulo 1")
      break;
    case "error-module2":
      errorAlert("Ingreso activo en modulo 2", "Error: Se tiene un ingreso activo en el modulo 2")
      break;
    case "error-module3":
      errorAlert("Ingreso activo en modulo 3", "Error: Se tiene un ingreso activo en el modulo 3")
      break;
  }
}



//TECLADO TOTEM
totemKeyboard();

//CAMARA
// Obtener referencia al elemento de video y al canvas
const camaraModal = document.getElementById('camaraModal');
if (Exists(camaraModal)) {
  Camera();
}

//SELECTS
const selects = document.querySelectorAll(".select-btn")
applyFunctionsArguments(selects, "click", openSelect)
const formModule2 = document.querySelector('.form-module2')
const formModule3 = document.querySelector('.form-module3')

//Modulo segun form
if (Exists(selects)){
  formModule2 ? module2(formModule2) : formModule3 ? module3(formModule3) : null
}

//ALERTA POR COMPROBACION DE DISPOSITIVO
const deviceExit = document.getElementById("device_exit") // Input del dispositivo a escanear
const deviceAccess = document.getElementById("device_access")
Exists(deviceAccess) ? compDevice(deviceAccess, 1) : null
Exists(deviceExit) ? compDevice(deviceExit, 2) : null;


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

