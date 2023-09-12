//SELECT DISPOSITIVO
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

//SELECT VEHICULO
let responseData = null; // Variable para almacenar la respuesta JSON
const typeVehicle = document.querySelector(".tipo-vehiculo").value
// Realizar una solicitud AJAX a la vista Django
fetch(`&type=${typeVehicle}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('La solicitud no fue exitosa');
    }
    return response.json(); // Convertir la respuesta a JSON
  })
  .then(data => {
    // Almacenar la respuesta JSON en la variable responseData
    console.log(data.options)
    // Puedes realizar cualquier otra acción aquí con los datos si es necesario
  })
  .catch(error => {
    // Manejar errores de la solicitud
    console.error('Error:', error);
  });