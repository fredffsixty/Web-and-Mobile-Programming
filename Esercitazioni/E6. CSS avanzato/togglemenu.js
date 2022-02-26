// selezione dell'icona menu, del menu e del corpo del testo
var menuIcon = document.querySelector("div.row > img:first-of-type");
var menu = document.querySelector("div.row > div:first-of-type");
var corpo = document.querySelector("div.row > div:first-of-type + div");

// creazione di un gestore dell'evento click per l'icona menu
menuIcon.addEventListener("click", toggleMenu);

// creazione del flag di memoria che ricorda lo stato di visibilità del menu
var isVisible = false;

// definizione del gestore dell'evento click sull'icona menu
function toggleMenu() {

    if (!isVisible) {

        // modifichiamo le classi di layout per far apparire il menu
        // e restringere il corpo
        menu.classList.remove("col-p-0");
        menu.classList.add("col-p-3");

        corpo.classList.remove("col-p-10");
        corpo.classList.add("col-p-7");

    } else {

        // modifichiamo le classi di layoiut per ripristinare i valori 
        // del documento HTML5
        menu.classList.remove("col-p-3");
        menu.classList.add("col-p-0");

        corpo.classList.remove("col-p-7");
        corpo.classList.add("col-p-10");

    }

    // commutiamo lo stato di visibilità del menu
    isVisible = !isVisible;

}