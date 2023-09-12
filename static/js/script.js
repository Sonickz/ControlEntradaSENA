import { actualModule, valideNumber, goBack, Exists, successAlert, Upper, openSelect, applyFunctions, applyFunctionsArguments } from './functions.js'

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

//SELECTS
const selects = document.querySelectorAll(".select-btn")
applyFunctionsArguments(selects, "click", openSelect)

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
  const btncamAccess = document.getElementById('user-picture-btn');
  const btnSave = document.getElementById('user-savepicture-btn');
  const btnRepeat = document.getElementById('user-repeatpicture-btn');
  const btnTake = document.getElementById('user-takepicture-btn');
  let video = document.getElementById('user-cam');
  let canvas = document.getElementById('user-picture');
  let context = canvas.getContext('2d');

  canvas.width = 800;
  canvas.height = 680;

  //Al presionar el boton de la camara
  btncamAccess.addEventListener('click', () => {
    // Obtener acceso a la webcam
    navigator.mediaDevices.getUserMedia({ video: true, width: 800, height: 680 })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();

        // Guardar la referencia de la pista de video
        const videoTrack = stream.getVideoTracks()[0];

        // Agregar un evento para detener la pista cuando el modal se cierre
        camaraModal.addEventListener('hidden.bs.modal', function () {
          videoTrack.stop(); // Detener la pista de video
          video.srcObject = null; // Liberar el recurso de la cámara
        });

      })
      .catch(function (error) {
        console.log('Error al acceder a la webcam:', error);
      });
  });


  // Función para capturar la imagen
  function captureImage() {
    btnTake.style.display = 'none';
    video.style.display = 'none';
    canvas.style.display = 'block';

    btnRepeat.style.display = 'block';
    btnSave.style.display = 'block';

    // Dibujar el cuadro actual del video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  // Función para convertir la imagen base64 en un objeto de archivo
  function dataURLtoFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  function repeatImage() {
    btnRepeat.style.display = 'none';
    btnSave.style.display = 'none';
    btnTake.style.display = 'block';

    canvas.style.display = 'none';
    video.style.display = 'block';
  }

  function saveImage() {
    // Obtener la imagen en formato base64
    const imageData = canvas.toDataURL('image/png');
    const capturedImage = imageData

    // Generar un archivo a partir de la imagen base64
    const file = dataURLtoFile(capturedImage, 'captured_image.png');

    // Crear una instancia de DataTransfer
    const dataTransfer = new DataTransfer();

    // Agregar el archivo al DataTransfer
    dataTransfer.items.add(file);

    // Simular una selección de archivo para el campo de entrada de tipo "file"
    const fileInput = document.getElementById('user-file');

    // Asignar el DataTransfer al campo de entrada de tipo "file"
    fileInput.files = dataTransfer.files;

    // Disparar un evento de cambio en el campo de entrada de tipo "file"
    const changeEvent = new Event('change');
    fileInput.dispatchEvent(changeEvent);
  }
}


//SELECT DISPOSITIVOS Y VEHICULOS
if (Exists(selects)) {

  //DISPOSITIVOS
  const devicesInput = document.getElementById('devices');
  const deviceItems = document.querySelectorAll(".item-device");
  const btnText = document.querySelector(".device .btn-text");
  let selectedCount = 0;

  applyFunctionsArguments(deviceItems, "click", (item) => {
    if (item.classList.contains("checked") || selectedCount < 3) {
      item.classList.toggle("checked");
      //Actualizar contador
      selectedCount = document.querySelectorAll(".item-device.checked").length;
      // Obtener todos los elementos con la clase 'checked'
      const checkedItems = document.querySelectorAll(".item-device.checked");
      // Obtener los valores de los elementos con la clase 'checked'
      const valuesChecks = [...checkedItems].map(checkedItem => checkedItem.getAttribute("value"));
      // Asignar los valores al campo de entrada oculto
      devicesInput.value = valuesChecks.join(",");

      // Cambiar el texto del select segun la cantidad de dispositivos seleccionados
      if (checkedItems && checkedItems.length > 1) {
        btnText.innerText = `${checkedItems.length} Seleccionados`;
      } else if (checkedItems && checkedItems.length > 0) {
        btnText.innerText = checkedItems[0].innerText;
      } else {
        btnText.innerText = "Seleccionar Dispositivos";
      }
    }
  })

  //VEHICULOS

  //Seleccionar vehiculos
  const vehicleInput = document.getElementById('vehicle');
  const vehicleItems = document.querySelectorAll(".item-vehicle");
  const btnTextVehicle = document.querySelector(".vehicle .btn-text");

  applyFunctionsArguments(vehicleItems, "click", (item) => {

    item.classList.add("checked");
    // Remover la clase 'checked' de todos los elementos
    vehicleItems.forEach(otherItem => otherItem.classList.remove("checked"));
    // Agregar la clase 'checked' al elemento clicado        

    // Buscar el elemento clicado con la clase 'checked'
    const checkedItem = document.querySelector(".item-vehicle.checked");

    if (checkedItem) {
      // Actualizar el valor y el texto basados en el elemento seleccionado
      const valueCheck = checkedItem.getAttribute("value");
      vehicleInput.value = valueCheck;
      btnTextVehicle.innerText = checkedItem.innerText;
    } else {
      // Si no hay elementos seleccionados, restaurar los valores predeterminados
      btnTextVehicle.innerText = "Seleccionar Vehiculo";
      vehicleInput.value = "";
    }
  })

}

