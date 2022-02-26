function createContextMenu(menu) {

    // creiamo la lista menu di contesto e 
    // etichettiamola di classe "contextmenu"
    let contextMenu = document.createElement('ul');
    contextMenu.className = 'contextmenu';

    // Generiamo l'elenco delle voci
    let labels = Object.keys(menu);

    for (let i = 0; i < labels.length; i++) {

        // creiamo il list item e il link ipertestuale del singolo tasto
        let li = document.createElement('li');
        let a = document.createElement('a');
        li.append(a);

        // La voce del taso sarà sempre l'etichetta i-esima
        a.innerHTML = labels[i];

        // Verifichiamo che si tratti di una voce singola o un sottomenu
        if (typeof menu[labels[i]] == 'string') {
            // aggiungiamo l'indirizzo della URL
            a.setAttribute('href', menu[labels[i]]);
        } else {

            // generiamo il sottomenu etichettando il list item di classe 'submenu'
            li.className = 'submenu';

            // accediamo all'oggetto sottomenu
            let subMenuItems = menu[labels[i]];
            let subMenuVoices = Object.keys(subMenuItems);

            // aggiungiamo l'indirizzo della URL della voce di sottomenu
            a.setAttribute('href', subMenuItems['inPlace']);

            // creiamo la sottolista
            let submenu = document.createElement('ul');
            for (let voice of subMenuVoices) {
                if (voice != 'inPlace') {
                    let lli = document.createElement('li');
                    let lla = document.createElement('a');

                    // Configuriamo testo e URL del taso del submenu
                    lla.innerHTML = voice;
                    lla.setAttribute('href', subMenuItems[voice]);

                    // Agganciamo il link al list-item e il list-item alla lista sottomenu
                    lli.append(lla);
                    submenu.append(lli);
                }
            }

            // agganciamo il sottomenu a li
            li.append(submenu);
        }

        // appendiamo <a> a <li> e <li> a <ul>
        contextMenu.append(li);
    }

    document.body.append(contextMenu);

    return contextMenu;
}

// Funzione che registra i due gestori di eventi di apparizione e sparizione del menu
// rispetto al click del mouse
function registerMenu(contextMenu) {

    // Il menu appare cioé viene reso visibile nella sua proprietà display
    // quando si scatena l'evento contextmenu
    window.addEventListener('contextmenu', event => {

        contextMenu.style.top = event.pageY + 'px';
        contextMenu.style.left = event.pageX + 'px';
        contextMenu.style.display = 'block';
        event.preventDefault(); // blocchiamo il comportamento di default
    });

    // Il menu scompare quando si fa click sui pulsanti sinistro o centrale del mouse
    window.addEventListener('click', event => {
        if (event.button != 2 && contextMenu.style.display == 'block')
            contextMenu.style.display = 'none';
    });
}