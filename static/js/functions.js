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
            element.addEventListener(event, () => {
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
        headerTextModule.innerHTML = "Modulo 1> Ingresos";
    } else if (url.includes(module2)) {
        headerTextModule.innerHTML = "Modulo 2> Dispositivos";
    } else if (url.includes(module3)) {
        headerTextModule.innerHTML = "Modulo 3> Vehiculos y Dispositivos";
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

function playSoundAlert() {
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
        timer: 3000,
        timerProgressBar: true
    })
    playSoundAlert()
}

const devices = (form) => {
    const devicesInput = document.getElementById('devices');
    const deviceItems = document.querySelectorAll(".item-device");
    const btnText = document.querySelector(".device .btn-text");
    const user = document.getElementById("user");
    let rol = null

    user ? fetch(`/api/users/${user.value}`)
        .then(response => response.json())
        .then(data => {
            rol = data.response.data.rol
        }) : null;

    updateCheckeds("Dispositivos", deviceItems, devicesInput, btnText);

    applyFunctionsArguments(deviceItems, "click", (item) => {
        if (item.classList.contains("checked") || rol == "Instructor" || document.querySelectorAll(".item-device.checked").length < 3) {
            item.classList.toggle("checked");
            updateCheckeds("Dispositivos", deviceItems, devicesInput, btnText);
        }
    })

    return devicesInput
}

export const module2 = (form) =>{    
    const devicesInput = devices(form);
    compInput(form, devicesInput, "dispositivo")
}

export const module3 = (form) => {
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
        updateCheckeds("Vehiculos", vehicleItems, vehicleInput, btnTextVehicle)
    });  
    const devicesInput = devices(form);     
    compInput(form, vehicleInput, devicesInput, "vehiculo y un dispositivo")
}


//Funcion para tomar los valores de items seleccionados
export function updateCheckeds(name, items, input, btnText) {
    // Obtener todos los elementos con la clase 'checked'
    const checkedItems = [...items].filter(item => item.classList.contains("checked"))
    // Obtener los valores de los elementos con la clase 'checked'
    const valuesChecks = [...checkedItems].map(checkedItem => checkedItem.getAttribute("value"));
    // Asignar los valores al campo de entrada oculto
    input ? input.value = valuesChecks.join(",") : "";

    // Cambiar el texto del select segun la cantidad de dispositivos seleccionados
    btnText ? btnText.innerText = checkedItems.length > 1 ? `${checkedItems.length} Seleccionados` : checkedItems.length === 1 ? checkedItems[0].innerText : `Seleccionar ${name}` : "";
}


//Funcion para comprobar dispositivo de entrada o salida
export function compDevice(input, type) {
    const devicesInput = document.getElementById('devices');
    const btnText = document.querySelector(".device .btn-text");
    const deviceItems = document.querySelectorAll(".item-device")
    const user = input.getAttribute("data-user");
    //Focus al input despues de 2sg fuera
    input.addEventListener("blur", () => {
        setTimeout(() => {
            input.focus()
        }, 2000)
    })

    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault() //Prevenir el envio del formulario
            const url = type === 1 ? `?code=${user}&accessDevice=${input.value}` : type === 2 ? `?code=${user}&exitDevice=${input.value}` : null;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const response = data.response
                    if (response.status === "success") {
                        type === 1 ? successAlert("Dispositivo encontrado", "El dispositivo esta registrado") : type === 2 ? successAlert("Dispositivo encontrado", "El dispositivo coincide con el ingreso") : null;
                        deviceItems.forEach(device => {
                            let id = device.value
                            id === response.device.id ? device.classList.add("checked") : null
                            updateCheckeds("Dispositivos", deviceItems, devicesInput, btnText)
                        })
                    } else {
                        type === 1 ? errorAlert("Dispositivo no encontrado", "El dispositivo no esta registrado") : type === 2 ? errorAlert("Dispositivo no encontrado", "El dispositivo no coincide con el ingreso") : null;
                    }
                    input.value = ""
                })
        }
    });
}

export function compInput(form, input, input2, item) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if(input2){
            if (!input.value || input.value.length == 0 || !input2.value || input2.value.length == 0) return errorAlert(`Debes seleccionar un ${item}`, `Debes seleccionar un ${item} para poder continuar`)
        }
        if (!input.value || input.value.length == 0) return errorAlert(`Debes seleccionar un ${item}`, `Debes seleccionar un ${item} para poder continuar`)
        return form.submit()
    })
}

//=====================================================================================================

//Funcion para iniciar camara
export function Camera() {
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

export function totemKeyboard() {
    //Resolucion del dispositivo
    let pageWidth = window.innerWidth;
    let pageHeight = window.innerHeight;

    //Si se tiene la resolucion del totem
    if (pageWidth >= 768 && pageHeight >= 1300) {
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
                activeInput = input; // Input actual
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
            const maxInput = input.getAttribute('maxlength')

            key.classList.add('active'); //Agrego la clase active
            setTimeout(() => { //Despues de 200ms remuevo la clase active
                key.classList.remove('active')
            }, 200);

            // sourcery skip: merge-nested-ifs
            if (letters.includes(key)) {
                if (!onlynumbers || (onlynumbers && !isNaN(key.innerText)) && input.value.length <= maxInput) { //Si el campo no tiene la clase solonumeros || Si el campo es de solo numeros y la key es un numero
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
        let actionInterval;
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
}

//=====================================================================================================

//Cambiar entre tablas segun botones
export function changeTables(btns, tables) {
    const btnReport = document.querySelector(".report")
    applyFunctionsArguments(btns, "click", (btn) => {
        btns.forEach((otherbtn) => {
            otherbtn.classList.remove("btn-green2-active");
        })
        btn.classList.add("btn-green2-active");
        if (btn.classList.contains("users")) {
            btnReport.href = `reports/${btn.textContent.toLowerCase()}`
            btnReport.querySelector("span").textContent = `Reporte de ${btn.textContent}`
        }
        let dataBtn = btn.getAttribute("data-table");

        tables.forEach((table) => {
            let dataTable = table.querySelector("table").getAttribute("data-table");
            dataBtn == dataTable ? table.classList.remove("d-none") : table.classList.add("d-none");
        })
    })
}

//Cambiar entre vistas / cards
export function changeView(btn, container) {
    btn ? btn.addEventListener("click", () => {
        container.classList.add("slide")
    }) : null;
}

//Llevar informacion a modal por botones
export function transferDataModal(btns, Modal, feeds) {
    applyFunctionsArguments(btns, "click", (btn) => {
        Object.keys(feeds).forEach((feed) => {
            const feedList = feeds[feed]
            const list = feedList.list
            const func = feedList.func
            const data = { "pk": feedList.pk, "name": feedList.name, "api": feedList.api }
            list.innerHTML = ""

            const dataAttribute = data.pk
            const dataBtn = btn.getAttribute(dataAttribute);
            Modal.setAttribute(dataAttribute, dataBtn);

            showDataModal(Modal, list, data, func)
        })
    })
}

export function showDataModal(Modal, feedList, data, func) {
    const dataAttribute = data.pk
    const pk = Modal.getAttribute(dataAttribute)
    const api = data.api
    const name = data.name

    const url = `/api/${api}/${pk}`

    fetch(url)
        .then(response => response.json())
        .then(data => {
            func(data, feedList, name)
        })
}

function createElementFeed(feedList, name, element, img) {
    // Crear el elemento <li>
    const listItem = document.createElement('li');
    listItem.classList.add('feed-item'); // Agregar la clase 'feed-item'
    // Crear el elemento <div> con la clase 'icon'
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('icon');

    // Crear la imagen <img> con la clase 'icon-img' y establecer el atributo 'src'
    const imgElement = document.createElement('img');
    imgElement.classList.add('icon-img');
    imgElement.src = `/static/assets/icons/${img}`;

    // Crear los elementos <span> y establecer su contenido
    const textSpan = document.createElement('span');
    textSpan.classList.add('text');
    textSpan.textContent = element;

    const subTextSpan = document.createElement('span');
    subTextSpan.classList.add('sub-text');
    subTextSpan.textContent = name;

    // Agregar los elementos al DOM
    iconDiv.appendChild(imgElement);
    listItem.appendChild(iconDiv);
    listItem.appendChild(textSpan);
    listItem.appendChild(subTextSpan);

    // Agregar el elemento <li> al documento
    feedList.appendChild(listItem);
}

export function dataUsers(data, feedList, type) {
    if (type == "Vehiculo") {
        const vehicles = data.response.data.vehiculos
        vehicles ? vehicles.forEach(vehicle => {
            const vehicleElement = `${vehicle.tipo} ${vehicle.marca} ${vehicle.modelo}: #${vehicle.placa}`
            createElementFeed(feedList, "Vehiculo", vehicleElement, "trafico white.png")
        }) : null;
    } else if (type == "Dispositivo") {
        const devices = data.response.data.dispositivos
        devices ? devices.forEach(device => {
            const deviceElement = `${device.tipo} ${device.marca}: #${device.sn}`
            createElementFeed(feedList, "Dispositivo", deviceElement, "dispositivo white.png")
        }) : null;
    }
}

export function dataAccess(data, feedList, type) {
    const ingresos = data.response.data
    ingresos ? ingresos.forEach(ingreso => {
        const deviceElement = `${ingreso.device.type} ${ingreso.device.mark}: #${ingreso.device.sn}`
        createElementFeed(feedList, type, deviceElement, "dispositivo white.png")
    }) : null;
}