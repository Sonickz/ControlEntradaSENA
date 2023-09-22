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

//Funcion para tomar los valores de items seleccionados
export function updateCheckeds(name, type_item, input, btnText){
    // Obtener todos los elementos con la clase 'checked'
    const checkedItems = document.querySelectorAll(`.item-${type_item}.checked`);     
    // Obtener los valores de los elementos con la clase 'checked'
    const valuesChecks = [...checkedItems].map(checkedItem => checkedItem.getAttribute("value"));
    // Asignar los valores al campo de entrada oculto
    input ? input.value = valuesChecks.join(","): "";
  
    // Cambiar el texto del select segun la cantidad de dispositivos seleccionados
    btnText ? btnText.innerText = checkedItems.length > 1 ? `${checkedItems.length} Seleccionados` : checkedItems.length === 1 ? checkedItems[0].innerText : `Seleccionar ${name}`: "";
    }

//=====================================================================================================

//Funcion para iniciar camara
export function Camera(){
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