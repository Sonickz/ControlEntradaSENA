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