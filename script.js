// Sélection des éléments HTML
const btnParler = document.getElementById("btnParler");
const texteOriginal = document.getElementById("texteOriginal");
const texteTraduit = document.getElementById("texteTraduit");
const langueSource = document.getElementById("langueSource");
const langueCible = document.getElementById("langueCible");

// Reconnaissance vocale
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.interimResults = false;

// Gestion des erreurs
recognition.onerror = (event) => {
    console.error("Erreur reconnaissance vocale :", event.error);
    alert("Erreur reconnaissance vocale : " + event.error);
};

// Quand on clique sur "Parler"
btnParler.addEventListener("click", () => {
    // Définir la langue de reconnaissance selon le menu
    recognition.lang = langueSource.value === 'fr' ? 'fr-FR' :
                       langueSource.value === 'en' ? 'en-US' :
                       langueSource.value === 'nl' ? 'nl-NL' :
                       'ja-JP';
    recognition.start();
});

// Quand la reconnaissance renvoie un résultat
recognition.onresult = async (event) => {
    const texte = event.results[0][0].transcript;
    texteOriginal.textContent = "Texte original : " + texte;

    try {
        // Traduction via API LibreTranslate
        const res = await fetch("https://libretranslate.com/translate", {
            method: "POST",
            body: JSON.stringify({
                q: texte,
                source: langueSource.value,
                target: langueCible.value,
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        texteTraduit.textContent = "Traduction : " + data.translatedText;

        // Lecture automatique de la traduction
        const utterance = new SpeechSynthesisUtterance(data.translatedText);
        utterance.lang = langueCible.value === 'fr' ? 'fr-FR' :
                         langueCible.value === 'en' ? 'en-US' :
                         langueCible.value === 'nl' ? 'nl-NL' :
                         'ja-JP';
        window.speechSynthesis.speak(utterance);

    } catch (err) {
        console.error("Erreur traduction :", err);
        alert("Erreur traduction : vérifie ta connexion internet");
    }
};
