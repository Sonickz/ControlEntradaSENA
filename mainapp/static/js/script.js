//Menu Admin
const btn = document.querySelector("#menu-btn");
const menu = document.querySelector("#sidemenu");
const body = document.body
const list = document.querySelectorAll('.item')

if (btn && menu) {
  btn.addEventListener('click', () => {
    menu.classList.toggle("menu-expanded");
    menu.classList.toggle("menu-collapsed");

    body.classList.toggle("body-expanded");
    body.classList.toggle("body-collapsed")
  });
}

// Funcion solo numeros
function valideNumber(evt) {

  // code is the decimal ASCII representation of the pressed key.
  var code = (evt.which) ? evt.which : evt.keyCode;

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

// Focus barcode-input
const barcodeInput = document.getElementById("barcode-input");
if (barcodeInput) {
  barcodeInput.addEventListener("blur", () => {
    setTimeout(() => {
      barcodeInput.focus();
    }, 0);
  });
}

//Upper
function Upper(input) {
  input.value = input.value.toUpperCase();
}





//
function goBack() {
  window.history.back();
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

// Checks
document.addEventListener('DOMContentLoaded', function () {
  var generalDeleteForm = document.getElementById('delete-form');
  var checks = document.querySelectorAll('.item-check');
  var actions = document.querySelector('.card-table-buttons');

  if (generalDeleteForm) {
    checks.forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        var Selected = Array.from(checks).some(function (cb) {
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

      var selectedItems = [];
      for (var i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
          selectedItems.push(checks[i].value); // Agrega los valores seleccionados al array
        }
      }

      var hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'checks-users');
      hiddenInput.setAttribute('value', selectedItems.join(','));

      generalDeleteForm.appendChild(hiddenInput); // Agrega el campo oculto al formulario

      generalDeleteForm.submit(); // Envía el formulario
    });

    //Delete individual
    var individualDeleteForm = document.getElementById('delete-user');

    individualDeleteForm.addEventListener('click', function (e) {
      idUser = this.getAttribute('data-id');
      var hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'delete-user');
      hiddenInput.setAttribute('value', idUser);

      generalDeleteForm.appendChild(hiddenInput); // Agrega el campo oculto al formulario
    });
  }
});




//SEARCH EN TIEMPO REAL
var search = document.getElementById("search");
if (search) {
  var tabla = document.querySelector("table");
  var tbody = tabla.querySelector("tbody");
  var filas = tbody.getElementsByTagName("tr");

  search.addEventListener("input", function () {
    var filtro = search.value.toLowerCase();

    for (var i = 0; i < filas.length; i++) {
      var fila = filas[i];
      var celdas = fila.getElementsByTagName("td");
      var mostrarFila = false;

      for (var j = 0; j < celdas.length; j++) {
        var celda = celdas[j];
        if (celda) {
          var contenido = celda.innerHTML.toLowerCase();
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


function openSelect(btn){
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


//Tomar foto
// Obtener referencia al elemento de video y al canvas
const btncamAccess = document.getElementById('user-picture-btn');
const btnSave = document.getElementById('user-savepicture-btn');
const btnRepeat = document.getElementById('user-repeatpicture-btn');
const btnTake = document.getElementById('user-takepicture-btn');
var video = document.getElementById('user-cam');
var canvas = document.getElementById('user-picture');
var context = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 480;
btncamAccess.addEventListener('click', () => {
// Obtener acceso a la webcam
navigator.mediaDevices.getUserMedia({ video: true, width: 640, height: 480 })
  .then(function(stream) {
    video.srcObject = stream;
    video.play();
  })
  .catch(function(error) {
    console.log('Error al acceder a la webcam:', error);
  });
});

function stopCam(){
 
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
var arr = dataUrl.split(',');
var mime = arr[0].match(/:(.*?);/)[1];
var bstr = atob(arr[1]);
var n = bstr.length;
var u8arr = new Uint8Array(n);
while (n--) {
  u8arr[n] = bstr.charCodeAt(n);
}
return new File([u8arr], filename, { type: mime });
}

function repeatImage(){
  btnRepeat.style.display = 'none';
  btnSave.style.display = 'none';
  btnTake.style.display = 'block';

  canvas.style.display = 'none';
  video.style.display = 'block';
}

function saveImage(){
  // Obtener la imagen en formato base64
  var imageData = canvas.toDataURL('image/png');
  var capturedImage = imageData

  // Generar un archivo a partir de la imagen base64
  var file = dataURLtoFile(capturedImage, 'captured_image.png');

  // Crear una instancia de DataTransfer
  var dataTransfer = new DataTransfer();

  // Agregar el archivo al DataTransfer
  dataTransfer.items.add(file);

  // Simular una selección de archivo para el campo de entrada de tipo "file"
  var fileInput = document.getElementById('user-file');
  
  // Asignar el DataTransfer al campo de entrada de tipo "file"
  fileInput.files = dataTransfer.files;

   // Disparar un evento de cambio en el campo de entrada de tipo "file"
   var changeEvent = new Event('change');
   fileInput.dispatchEvent(changeEvent);

   
}

  
