//=====================================================================================================

//Funcion para validar existencia del elemento
export function Exists(element) {
    return element !== null && typeof element === 'object';
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
//Funcion para cambiar de tablas segun el rol 
export function changeTableBtns(btns, tableContainer, table) {
    
    const head = table.querySelectorAll("thead th") // Celdas de la cabecera
    const rows = table.querySelectorAll("tbody tr") // Filas de la tabla
    
    //Para cada boton, escuchar el evento click
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleBtns(btns, btn, tableContainer, head, rows) //Funcion para manejar los botones
        });
    });
}

// Funcion botones de intercambio de tablas
function handleBtns(otherBtns, btn, tableContainer, head, rows) {
    //Remover clase activa de los demas botones
    otherBtns.forEach(otherbtn => {
        otherbtn.classList.remove('btn-green2-active')
    })
    btn.classList.add('btn-green2-active') //Agregar clase activa al boton seleccionado
    let rol = btn.getAttribute('data-rol') //Capturar el rol del boton seleccionado

    tableContainer.classList.add('table-animation') //Agregar clase de animacion a la tabla
    //Esperar 500ms para ejecutar la funcion de cambio de tablas
    setTimeout(() => {
        tableSwitch(rows, head, rol) //Funcion para cambiar de tablas
        tableContainer.classList.remove('table-animation') //Remover clase de animacion a la tabla
    }, 500)
}

//Funcion switch de tablas
function tableSwitch(rows, head, rol) {
    //Capturar filas de la tabla 
    rows.forEach(row => {
        const cells = row.getElementsByTagName("td") //Capturar celdas de la fila
        let rolCell = null //Variable para capturar el rol de la celda

        //Para cada celda
        Array.from(cells).forEach(cell => {
            if (cell.classList.contains("rol")) { rolCell = cell.getAttribute("data-rol") }// Si la celda tiene la clase rol, capturar el rol

            const Instructor = "1"
            const Aprendiz = "2"
            const Visitante = "3"
            const Administrativo = "4"

            //Ocultar celdas segun el rol
            switch (rol) {
                case Instructor:
                case Administrativo:
                    head.forEach(th => { if (th.textContent == "Ficha") { th.style.display = "none" } })
                    if (cell.classList.contains("ficha")) { cell.style.display = "none" }
                    break;

                case Visitante:
                    head.forEach(th => { if (th.textContent == "Ficha" || th.textContent == "Centro") { th.style.display = "none" } })
                    if (cell.classList.contains("ficha") || cell.classList.contains("centro")) { cell.style.display = "none" }
                    break;

                default:
                    head.forEach(th => { th.style.display = "" }) //Mostrar todas las celdas de la cabecera
                    cell.style.display = ""
                    break;
            }
        });

        //Ocultar si el rol es diferente al rol del boton
        if (rolCell != rol) {
            row.style.display = "none"
        } else {
            row.style.display = ""
        }

    });

}

//=====================================================================================================
//Funcion para buscar datos en una tabla
export function searchTable(input, table) {

    input.addEventListener("input", () => {

        const icon = document.querySelector(".search-delete")
        if (input.value != "") {
            icon.style.display = "block";
            icon.addEventListener("click", () => {
                input.value = "";
                rows.forEach(row => {
                    row.classList.remove("d-none")
                });
                icon.style.display = "none";
            })
        } else {
            icon.style.display = "none";
        }

        const search = input.value.toLowerCase();
        const rows = table.querySelectorAll("tbody tr:not([style*='display: none'])")

        rows.forEach(row => {
            const cells = row.querySelectorAll("td")
            let showRow = false

            cells.forEach(cell => {
                const cellText = cell.textContent.toLowerCase();
                if (cellText.indexOf(search) > -1) {
                    showRow = true;
                }
            })

            if (showRow != true) {
                row.classList.add("d-none")
            } else {
                row.classList.remove("d-none")
            }

        })

    })
}
