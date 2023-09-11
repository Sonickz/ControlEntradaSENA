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
    console.log("Es la primera visita del dia")

    const container = document.querySelector(".animation-container")
    const startAnimation = document.querySelector(".start-animation");

    if (startAnimation) {
        container.classList.remove("d-none")
        const icon = startAnimation.querySelector(".icon")
        document.addEventListener("DOMContentLoaded", () => {

            startAnimation.classList.add("animation-active")
            setTimeout(() => {
                icon.classList.add("animation-active")

                setTimeout(() => {
                    container.classList.add("animation-disabled")
                }, 3000)
            }, 3000)

        })
    }
}