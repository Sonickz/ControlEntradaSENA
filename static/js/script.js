
//FUNCIONES

// Funcion solo numeros
function valideNumber(evt) {

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

// Auto focus
function autoFocus() {
  const input = document.querySelector(".autofocus")
  if (input) {
    input.addEventListener("blur", () => {
      setTimeout(() => {
        input.focus();
      }, 0);
    });
  }
}
autoFocus();

// Auto mayus
function Upper(input) {
  input.value = input.value.toUpperCase();
}

//Ir a la pestaña anterior
function goBack() {
  window.history.back();
}

//CAMARA

// Obtener referencia al elemento de video y al canvas
const btncamAccess = document.getElementById('user-picture-btn');
const btnSave = document.getElementById('user-savepicture-btn');
const btnRepeat = document.getElementById('user-repeatpicture-btn');
const btnTake = document.getElementById('user-takepicture-btn');
let video = document.getElementById('user-cam');
let canvas = document.getElementById('user-picture');
let context = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 480;

//Al presionar el boton de la camara
btncamAccess.addEventListener('click', () => {
  // Obtener acceso a la webcam
  navigator.mediaDevices.getUserMedia({ video: true, width: 640, height: 480 })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (error) {
      console.log('Error al acceder a la webcam:', error);
    });
});

function stopCam() {

}

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
  const n = bstr.length;
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


//SELECT DISPOSITIVOS Y VEHICULOS
function openSelect(btn) {
  btn.classList.toggle("open");
}

const vehicleInput = document.getElementById('vehicle');
const devicesInput = document.getElementById('devices');

//Seleccionar multiples
const multipleItems = document.querySelectorAll(".multiple .item");

multipleItems.forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("checked");

    let checked = document.querySelectorAll(".multiple .checked"),
      btnText = document.querySelector(".multiple .btn-text");

    let selectedValues = Array.from(checked).map(item => item.getAttribute("value"));
    devicesInput.value = selectedValues;
    console.log(devicesInput.value);

    console.log(selectedValues);
    if (checked && checked.length > 0) {
      btnText.innerText = `${checked.length} Seleccionados`;
    } else {
      btnText.innerText = "Seleccionar Dispositivos";
    }
  });
})

//Seleccionar uno

//Salida Vehiculo
document.addEventListener('DOMContentLoaded', function () {
  const inputItem = document.querySelector('.item-selected').value;
  console.log(inputItem);
  vehicleInput.value = inputItem;
});

//Ingreso Vehiculo
const items = document.querySelectorAll(".individual .item");
let selectedValue = null;

items.forEach(item => {
  item.addEventListener("click", () => {
    const isSelected = item.classList.contains("checked");

    items.forEach(otherItem => {
      otherItem.classList.remove("checked");
    });

    if (!isSelected) {
      item.classList.add("checked");
      selectedValue = item.getAttribute("value");
      vehicleInput.value = selectedValue;
      console.log(vehicleInput.value);
    } else {
      selectedValue = null;
      vehicleInput.value = "";
    }

    let checked = document.querySelector(".individual .checked");
    let btnText = document.querySelector(".individual .btn-text");

    if (checked) {
      btnText.innerText = item.innerText;
    } else {
      btnText.innerText = "Seleccionar vehiculos";
    }
  });
});

//ADMIN

//Menu Admin
const btn = document.querySelector("#menu-btn");
const menu = document.querySelector("#sidemenu");
const {body} = document
const list = document.querySelectorAll('.item')

if (btn && menu) {
  btn.addEventListener('click', () => {
    menu.classList.toggle("menu-expanded");
    menu.classList.toggle("menu-collapsed");

    body.classList.toggle("body-expanded");
    body.classList.toggle("body-collapsed")
  });
}

//Animacion admin | Cambiar entre tabla select y form
const btnRegister = document.getElementById('btn-register-users');
const btnBack = document.getElementById('btn-back');
const rol = document.querySelector('.select-rol');
const card = document.querySelector('.users');

if (card) {
  btnRegister.addEventListener('click', () => {
    card.classList.add('select');
  });

  btnBack.addEventListener('click', () => {
    card.classList.remove('select');
  });
}

// Eliminar filas con Checks
document.addEventListener('DOMContentLoaded', function () {
  const generalDeleteForm = document.getElementById('delete-form');
  const checks = document.querySelectorAll('.item-check');
  const actions = document.querySelector('.card-table-buttons');

  if (generalDeleteForm) {
    checks.forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        const Selected = Array.from(checks).some(function (cb) {
          return cb.checked;
        });

        if (Selected) {
          actions.classList.add('active');
        } else {
          actions.classList.remove('active');
        }
      });
    });

    generalDeleteForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Evita que el formulario se envíe automáticamente

      const selectedItems = [];
      for (const i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
          selectedItems.push(checks[i].value); // Agrega los valores seleccionados al array
        }
      }

      const hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'checks-users');
      hiddenInput.setAttribute('value', selectedItems.join(','));

      generalDeleteForm.appendChild(hiddenInput); // Agrega el campo oculto al formulario

      generalDeleteForm.submit(); // Envía el formulario
    });

    //Delete individual
    const individualDeleteForm = document.getElementById('delete-user');

    individualDeleteForm.addEventListener('click', function (e) {
      idUser = this.getAttribute('data-id');
      const hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'delete-user');
      hiddenInput.setAttribute('value', idUser);

      generalDeleteForm.appendChild(hiddenInput); // Agrega el campo oculto al formulario
    });
  }
});

//SEARCH EN TIEMPO REAL
const search = document.getElementById("search");
if (search) {
  const tabla = document.querySelector("table");
  const tbody = tabla.querySelector("tbody");
  const filas = tbody.getElementsByTagName("tr");

  search.addEventListener("input", function () {
    const filtro = search.value.toLowerCase();

    for (const i = 0; i < filas.length; i++) {
      const fila = filas[i];
      const celdas = fila.getElementsByTagName("td");
      const mostrarFila = false;

      for (const j = 0; j < celdas.length; j++) {
        const celda = celdas[j];
        if (celda) {
          const contenido = celda.innerHTML.toLowerCase();
          if (contenido.indexOf(filtro) > -1) {
            mostrarFila = true;
            break;
          }
        }
      }

      if (mostrarFila) {
        fila.style.display = "";
      } else {
        fila.style.display = "none";
      }
    }
  });
}







