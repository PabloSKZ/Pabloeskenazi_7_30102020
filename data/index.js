function renderCards(recipes) {
  $recipes.innerHTML = "";
  for (let i in recipes) {
    let ingredients = "";
    for (let j in recipes[i].ingredients) {
      if (
        typeof recipes[i].ingredients[j].unit === "undefined" &&
        typeof recipes[i].ingredients[j].quantity === "undefined"
      ) {
        ingredients += `<li><span class="bold">${recipes[i].ingredients[j].ingredient}</span></li>`;
      } else if (typeof recipes[i].ingredients[j].unit === "undefined") {
        ingredients += `<li><span class="bold">${recipes[i].ingredients[j].ingredient}:</span> ${recipes[i].ingredients[j].quantity}</li>`;
      } else {
        ingredients += `<li><span class="bold">${recipes[i].ingredients[j].ingredient}:</span> ${recipes[i].ingredients[j].quantity} ${recipes[i].ingredients[j].unit}</li>`;
      }
    }

    let description = "";
    if (recipes[i].description.length > 160) {
      description = recipes[i].description.slice(0, 160) + "...";
    } else {
      description = recipes[i].description;
    }

    $recipes.innerHTML += `
      <div class="card" id="${recipes[i].id}">
      <img src="assets/card_img.jpg" alt="${recipes[i].name}" class="card__img" />
      <div class="card__text">
        <div class="card__text__top">
          <h2 class="card__text__title">${recipes[i].name}</h2>
          <p class="card__text__time">
            <span class="material-icons"> access_time </span>
            <span class="bold">${recipes[i].time} min</span>
          </p>
        </div>
        <div class="card__text__bottom">
          <ul class="card__text__ingredients">
            ${ingredients}
          </ul>
          <p class="card_text__description">
          ${description}
          </p>
        </div>
      </div>
    </div>`;
  }
}

function filterRecipes(recipes, search) {
  let filteredRecipes = [];
  for (let i in recipes) {
    // Search by name
    if (recipes[i].name.match(search)) {
      filteredRecipes.push(
        recipes.find((x) => x.name === recipes[i].name.match(search).input)
      );
      // Search by description
    } else if (recipes[i].description.match(search)) {
      filteredRecipes.push(
        recipes.find(
          (x) => x.description === recipes[i].description.match(search).input
        )
      );
      // Search by ingredients
    } else {
      for (let j in recipes[i].ingredients) {
        if (recipes[i].ingredients[j].ingredient.match(search)) {
          filteredRecipes.push(
            recipes.find((x) => {
              if (typeof x.ingredients[j] != "undefined") {
                return (
                  x.ingredients[j].ingredient ===
                  recipes[i].ingredients[j].ingredient.match(search).input
                );
              }
            })
          );
        }
      }
    }
  }
  return filteredRecipes;
}

function performSearch(searchInput, selectedTags = []) {
  let eachFilteredRecipes = [];
  let search = "";
  let searchKeyNumber = 0;
  filteredRecipes = [];
  if (searchInput != "") {
    searchInput = searchInput.split(" ");
    for (let i in searchInput) {
      search = new RegExp(searchInput[i], "i");
      eachFilteredRecipes.push(recipes);
      eachFilteredRecipes.push(filterRecipes(recipes, search));
    }
  } else {
    eachFilteredRecipes.push(filterRecipes(recipes, search));
    searchInput = [];
  }
  eachFilteredRecipes = eachFilteredRecipes.flat();
  if (selectedTags.length != 0) {
    for (let j in selectedTags) {
      if (selectedTags[j].category == "ingredients") {
        /* eachFilteredRecipes.push(
          eachFilteredRecipes.map((x) =>
            x.ingredients.filter((y) => y.ingredient == selectedTags[j].tag)
          )
        ); */
      } else if (selectedTags[j].category == "appliance") {
        eachFilteredRecipes.push(
          eachFilteredRecipes.filter((x) => x.appliance == selectedTags[j].tag)
        );
      } else if (selectedTags[j].category == "ustencils") {
        console.log(eachFilteredRecipes);
        eachFilteredRecipes.push(
          eachFilteredRecipes.filter((x) =>
            x.ustensils.includes(selectedTags[j].tag)
          )
        );
        eachFilteredRecipes = eachFilteredRecipes.flat();
      }
    }
  }

  filteredRecipes = [].concat.apply([], eachFilteredRecipes);
  searchKeyNumber += searchInput.flat().length;
  searchKeyNumber += selectedTags.length;
  console.log(filteredRecipes);
  filteredRecipes = filteredRecipes.filter(
    // find common occurences
    (i) => filteredRecipes.filter((j) => i.id === j.id).length > searchKeyNumber
  );
  /* .filter((item, pos) => {
        // delete duplicate
        return filteredRecipes.indexOf(item) == pos;
      }); */
  console.log(filteredRecipes);
  showCards(recipes, filteredRecipes);
}

function showCards(recipes, filteredRecipes) {
  // Hide all cards
  for (let i = 1; i <= recipes.length; i++) {
    document.getElementById(i).classList.add("hide");
  }
  // Show filtred cards
  if (filteredRecipes[0] !== undefined && filteredRecipes[0] !== 0) {
    for (let j in filteredRecipes) {
      document.getElementById(filteredRecipes[j].id).classList.remove("hide");
    }
  } else if (filteredRecipes[0] == 0) {
    for (let i = 1; i <= recipes.length; i++) {
      document.getElementById(i).classList.remove("hide");
    }
  } else {
    /* console.log("vide"); */
  }
}

function getAllIngredients(recipes) {
  let allIngredients = [];
  recipes.map((x) => {
    x.ingredients.map((y) => {
      if (!allIngredients.includes(y.ingredient)) {
        return allIngredients.push(y.ingredient);
      }
    });
  });
  return allIngredients;
}

function getAllAppliance(recipes) {
  let allAppliance = [];
  recipes.map((x) => {
    if (!allAppliance.includes(x.appliance)) {
      return allAppliance.push(x.appliance);
    }
  });
  return allAppliance;
}

function getAllUstencils(recipes) {
  let allUstensils = [];
  recipes.map((x) => {
    x.ustensils.map((y) => {
      if (!allUstensils.includes(y)) {
        return allUstensils.push(y);
      }
    });
  });
  return allUstensils;
}

function renderSelectedTags(selectedTags) {
  let selectedTagsHTML = "";
  for (let i in selectedTags) {
    if (selectedTags[i].category == "ingredients") {
      selectedTagsHTML += `
      <button class="tag tag__blue">
        ${selectedTags[i].tag} <span class="material-icons"> control_point </span>
      </button>`;
    } else if (selectedTags[i].category == "appliance") {
      selectedTagsHTML += `
      <button class="tag tag__green">
        ${selectedTags[i].tag} <span class="material-icons"> control_point </span>
      </button>`;
    } else if (selectedTags[i].category == "ustencils") {
      selectedTagsHTML += `
      <button class="tag tag__orange">
        ${selectedTags[i].tag} <span class="material-icons"> control_point </span>
      </button>`;
    }
  }
  $selectedTags.innerHTML = selectedTagsHTML;
  performSearch($searchInput.value, selectedTags);
}

function filterDropdownsTags(tagsList, search = "") {
  let tagsListFiltred = [];
  for (let i in tagsList) {
    if (tagsList[i].match(search) || search == "") {
      tagsListFiltred.push(tagsList[i]);
    }
  }
  return tagsListFiltred.slice(0, 27);
}

function showIngredientsTags(ingredientsList) {
  let ingredientsHTML = "";
  for (let i in ingredientsList) {
    ingredientsHTML += `<li><a href="#">${ingredientsList[i]}</a></li>`;
  }
  $ingredientsList.innerHTML = ingredientsHTML;
}

function showApplianceTags(applianceList) {
  let applianceHTML = "";
  for (let i in applianceList) {
    applianceHTML += `<li><a href="#">${applianceList[i]}</a></li>`;
  }
  $applianceList.innerHTML = applianceHTML;
}

function showUstencilsTags(ustencilsList) {
  let ustencilsHTML = "";
  for (let i in ustencilsList) {
    ustencilsHTML += `<li><a href="#">${ustencilsList[i]}</a></li>`;
  }
  $ustencilsList.innerHTML = ustencilsHTML;
}

/* DOM Variables */
const $recipes = document.getElementById("recipes");
const $searchInput = document.getElementById("search-bar-input");
const $ingredientsButton = document.getElementById("ingredients");
const $applianceButton = document.getElementById("appliance");
const $ustencilsButton = document.getElementById("ustencils");
const $ingredientsInput = document.getElementById("ingredients-search");
const $applianceInput = document.getElementById("appliance-search");
const $ustencilsInput = document.getElementById("ustencils-search");
const $ingredientsList = document.getElementById("ingredients-list__bottom");
const $applianceList = document.getElementById("appliance-list__bottom");
const $ustencilsList = document.getElementById("ustencils-list__bottom");
const $ingredientsOpen = document.getElementById("ingredients-list");
const $applianceOpen = document.getElementById("appliance-list");
const $ustencilsOpen = document.getElementById("ustencils-list");
const $ingredientsLess = document.getElementById("ingredients-less");
const $applianceLess = document.getElementById("appliance-less");
const $ustencilsLess = document.getElementById("ustencils-less");
const $selectedTags = document.getElementById("selected-tags");

let selectedTags = [];

/* Event Listeners */
$searchInput.addEventListener("input", (e) => {
  e.preventDefault();
  if ($searchInput.value.length > 2) {
    performSearch($searchInput.value, selectedTags);
    /* let eachFilteredRecipes = [];
    filteredRecipes = [];
    const searchInput = $searchInput.value.split(" ");
    for (let i in searchInput) {
      const search = new RegExp(searchInput[i], "i");
      eachFilteredRecipes.push(filterRecipes(recipes, search));
    }
    filteredRecipes = [].concat.apply([], eachFilteredRecipes);
    filteredRecipes = filteredRecipes
      .filter(
        // find common occurences
        (i) =>
          filteredRecipes.filter((j) => i === j).length >= searchInput.length
      )
      .filter((item, pos) => {
        // delete duplicate
        return filteredRecipes.indexOf(item) == pos;
      });
    showCards(recipes, filteredRecipes); */
  } else if ($searchInput.value.length == 0) {
    performSearch($searchInput.value, selectedTags);
    /* filteredRecipes = [0];
    showCards(recipes, filteredRecipes); */
  }
});

// Toggle Dropdowns
$ingredientsButton.addEventListener("click", (e) => {
  e.preventDefault();
  const ingredientsList = getAllIngredients(recipes).slice(0, 27);
  showIngredientsTags(ingredientsList);
  $ingredientsOpen.classList.remove("hide");
  $ingredientsButton.classList.add("hide");
  $ustencilsOpen.classList.add("hide");
  $ustencilsButton.classList.remove("hide");
  $applianceOpen.classList.add("hide");
  $applianceButton.classList.remove("hide");
});

$ingredientsLess.addEventListener("click", (e) => {
  e.preventDefault();
  $ingredientsButton.classList.remove("hide");
  $ingredientsOpen.classList.add("hide");
});

$ingredientsInput.addEventListener("input", (e) => {
  e.preventDefault();
  const ingredientsList = getAllIngredients(recipes);
  if ($ingredientsInput.value.length > 2) {
    const search = new RegExp($ingredientsInput.value, "i");
    let filtredDropdownsTags = filterDropdownsTags(ingredientsList, search);
    showIngredientsTags(filtredDropdownsTags);
  } else if ($ingredientsInput.value.length == 0) {
    let filtredDropdownsTags = filterDropdownsTags(ingredientsList, "");
    showIngredientsTags(filtredDropdownsTags);
  }
});

$applianceButton.addEventListener("click", (e) => {
  e.preventDefault();
  let applianceHTML = "";
  const applianceList = getAllAppliance(recipes).slice(0, 27);
  for (let i in applianceList) {
    applianceHTML += `<li><a href="#">${applianceList[i]}</a></li>`;
  }
  $applianceList.innerHTML = applianceHTML;
  $applianceOpen.classList.remove("hide");
  $applianceButton.classList.add("hide");
  $ustencilsOpen.classList.add("hide");
  $ustencilsButton.classList.remove("hide");
  $ingredientsOpen.classList.add("hide");
  $ingredientsButton.classList.remove("hide");
});

$applianceLess.addEventListener("click", (e) => {
  e.preventDefault();
  $applianceButton.classList.remove("hide");
  $applianceOpen.classList.add("hide");
});

$applianceInput.addEventListener("input", (e) => {
  e.preventDefault();
  const applianceList = getAllAppliance(recipes);
  if ($applianceInput.value.length > 2) {
    const search = new RegExp($applianceInput.value, "i");
    let filtredDropdownsTags = filterDropdownsTags(applianceList, search);
    showApplianceTags(filtredDropdownsTags);
  } else if ($applianceInput.value.length == 0) {
    let filtredDropdownsTags = filterDropdownsTags(applianceList, "");
    showApplianceTags(filtredDropdownsTags);
  }
});

$ustencilsButton.addEventListener("click", (e) => {
  e.preventDefault();
  let ustencilsHTML = "";
  const ustencilsList = getAllUstencils(recipes).slice(0, 27);
  for (let i in ustencilsList) {
    ustencilsHTML += `<li><a href="#">${ustencilsList[i]}</a></li>`;
  }
  $ustencilsList.innerHTML = ustencilsHTML;
  $ustencilsOpen.classList.remove("hide");
  $ustencilsButton.classList.add("hide");
  $applianceOpen.classList.add("hide");
  $applianceButton.classList.remove("hide");
  $ingredientsOpen.classList.add("hide");
  $ingredientsButton.classList.remove("hide");
});

$ustencilsLess.addEventListener("click", (e) => {
  e.preventDefault();
  $ustencilsButton.classList.remove("hide");
  $ustencilsOpen.classList.add("hide");
});

$ustencilsInput.addEventListener("input", (e) => {
  e.preventDefault();
  const ustencilsList = getAllUstencils(recipes);
  if ($ustencilsInput.value.length > 2) {
    const search = new RegExp($ustencilsInput.value, "i");
    let filtredDropdownsTags = filterDropdownsTags(ustencilsList, search);
    showUstencilsTags(filtredDropdownsTags);
  } else if ($ustencilsInput.value.length == 0) {
    let filtredDropdownsTags = filterDropdownsTags(ustencilsList, "");
    showUstencilsTags(filtredDropdownsTags);
  }
});

$ingredientsList.addEventListener("click", (e) => {
  if (e.target.innerHTML.substring(0, 1) != "<") {
    if (!selectedTags.map((x) => x.tag).includes(e.target.innerHTML)) {
      selectedTags.push({
        tag: e.target.innerHTML,
        category: "ingredients",
      });
    } else {
      selectedTags.splice(
        selectedTags.findIndex((x) => x.tag == e.target.innerHTML),
        1
      );
    }
    renderSelectedTags(selectedTags);
  }
});

$applianceList.addEventListener("click", (e) => {
  if (e.target.innerHTML.substring(0, 1) != "<") {
    if (!selectedTags.map((x) => x.tag).includes(e.target.innerHTML)) {
      selectedTags.push({
        tag: e.target.innerHTML,
        category: "appliance",
      });
    } else {
      selectedTags.splice(
        selectedTags.findIndex((x) => x.tag == e.target.innerHTML),
        1
      );
    }
    renderSelectedTags(selectedTags);
  }
});

$ustencilsList.addEventListener("click", (e) => {
  if (e.target.innerHTML.substring(0, 1) != "<") {
    if (!selectedTags.map((x) => x.tag).includes(e.target.innerHTML)) {
      selectedTags.push({
        tag: e.target.innerHTML,
        category: "ustencils",
      });
    } else {
      selectedTags.splice(
        selectedTags.findIndex((x) => x.tag == e.target.innerHTML),
        1
      );
    }
    renderSelectedTags(selectedTags);
  }
});

$selectedTags.addEventListener("click", (e) => {
  if (
    selectedTags
      .map((x) => x.tag)
      .includes(
        e.target.innerHTML
          .split(" ")
          .slice(
            0,
            e.target.innerHTML.split(" ").findIndex((x) => x == "<span")
          )
          .join(" ")
          .trim()
      )
  ) {
    selectedTags.splice(
      selectedTags.findIndex(
        (x) =>
          x.tag ==
          e.target.innerHTML
            .split(" ")
            .slice(
              0,
              e.target.innerHTML.split(" ").findIndex((x) => x == "<span")
            )
            .join(" ")
            .trim()
      ),
      1
    );
  }
  renderSelectedTags(selectedTags);
});

let filteredRecipes = recipes;
renderCards(filteredRecipes);
