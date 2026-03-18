const btnParler = document.getElementById("btnParler");
const btnLire = document.getElementById("btnLire");
const texteOriginal = document.getElementById("texteOriginal");
const texteTraduit = document.getElementById("texteTraduit");
const langueSource = document.getElementById("langueSource");
const langueCible = document.getElementById("langueCible");

// Reconnaissance vocale
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.interimResults = false;

btnParler.addEventListener("click", () => {
    // Définir la langue de reconnaissance vocale selon la sélection
    recognition.lang = langueSource.value === 'fr' ? 'fr-FR' :
                       langueSource.value === 'en' ? 'en-US' :
                       langueSource.value === 'nl' ? 'nl-NL' :
                       'ja-JP';
    recognition.start();
});

recognition.onresult = async (event) => {
    const texte = event.results[0][0].transcript;
    texteOriginal.textContent = "Texte original : " + texte;

    // Traduction via LibreTranslate
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
};

btnLire.addEventListener("click", () => {
    const utterance = new SpeechSynthesisUtterance(
        texteTraduit.textContent.replace("Traduction : ", "")
    );
    // Définir la langue de lecture selon la langue cible
    utterance.lang = langueCible.value === 'fr' ? 'fr-FR' :
                     langueCible.value === 'en' ? 'en-US' :
                     langueCible.value === 'nl' ? 'nl-NL' :
                     'ja-JP';
    window.speechSynthesis.speak(utterance);
});
