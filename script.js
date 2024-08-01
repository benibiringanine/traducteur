const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const selectTags = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");

// Menu de sélection
selectTags.forEach((tag, id) => {
  for (let country_code in countries) {
    let selected;
    // Si id est 0, définir selected à "selected", sinon définir à une chaîne vide.
    if (id === 0) {
      selected = country_code === "en-GB" ? "selected" : "";
      // Si l'id n'est pas 0, vérifier si le code du pays est "de-DE".
      // Si c'est le cas, définir selected à "selected", sinon définir à une chaîne vide.
    } else if (country_code === "de-DE") {
      selected = "selected";
      // Si aucune des conditions ci-dessus n'est vraie, définir selected à une chaîne vide.
    } else {
      selected = "";
    }

    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

// Ajouter un écouteur d'événement au clic pour l'élément exchangeIcon.
exchangeIcon.addEventListener("click", () => {
  // Échanger les valeurs des éléments fromText et toText.
  let tempText = fromText.value,
    tempLang = selectTags[0].value;
  fromText.value = toText.value;
  toText.value = tempText;

  // Échanger les valeurs des éléments selectTags.
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempLang;
});

// Ajouter un écouteur d'événement keyup pour l'élément fromText.
fromText.addEventListener("keyup", () => {
  // Si l'élément fromText est vide, effacer l'élément toText.
  if (!fromText.value) {
    toText.value = "";
  }
});

// Ajouter un écouteur d'événement click pour l'élément translateBtn.
translateBtn.addEventListener("click", () => {
  // Obtenir le texte à traduire, et les langues à traduire depuis et vers.
  let text = fromText.value.trim(),
    translateFrom = selectTags[0].value,
    translateTo = selectTags[1].value;

  // Si le texte à traduire est vide, retourner.
  if (!text) return;

  // Définir l'attribut placeholder de l'élément toText à "Traduction en cours...".
  toText.setAttribute("placeholder", "Traduction en cours...");

  // Construire l'URL pour l'API de traduction.
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

  // Récupérer les données de l'API.
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      // Définir le texte traduit dans l'élément toText.
      toText.value = data.responseData.translatedText;

      // Vérifier s'il y a des traductions alternatives.
      data.matches.forEach((data) => {
        if (data.id === 0) {
          toText.value = data.translation;
        }
      });

      // Réinitialiser l'attribut placeholder de l'élément toText.
      toText.setAttribute("placeholder", "Traduction");
    });
});

// Ajouter des écouteurs d'événements click aux éléments icons.
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    // Si either fromText ou toText est vide, retourner.
    if (!fromText.value || !toText.value) return;
    // Si l'icône cliquée est une icône de copie, copier le texte approprié dans le presse-papiers.
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
      // Si l'icône cliquée est une icône de volume, lire le texte approprié en utilisant l'API de synthèse vocale du navigateur.
    } else {
      let utterance;
      if (target.id == "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTags[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTags[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});
