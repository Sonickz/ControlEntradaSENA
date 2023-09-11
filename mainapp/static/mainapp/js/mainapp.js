//Funcion para saber la primera visita del dia
function firstPageView() {
    const actualDate = new Date();
    const saveDate = localStorage.getItem('lastView');

    if (saveDate === null) {
        //No hay registro de visitas anteriores
        localStorage.setItem('lastView', actualDate.toDateString());
        return true;
    }

    if (saveDate !== actualDate.toDateString()) {
        //Primera visita del dia
        localStorage.setItem('lastView', actualDate.toDateString());
        return true;
    }

    //Ya visito la pagina hoy
    return false;
}

if (firstPageView()) {
    const container = document.querySelector(".animation-container")
    const startAnimation = document.querySelector(".start-animation");

    if (startAnimation) {
        container.classList.remove("d-none")
        const icon = startAnimation.querySelector(".icon")
        document.addEventListener("DOMContentLoaded", () => {

            startAnimation.classList.add("animation-active")
            //Esperar 3000ms
            setTimeout(() => {
                icon.classList.add("icon-active")
                //Esperar 3000ms
                setTimeout(() => {
                    container.classList.add("animation-disabled")
                    //Esperar 1500ms
                    setTimeout(() => {
                        container.classList.add("d-none")
                    }, 1500)
                }, 3000)
            }, 3000)

        })
    }
}