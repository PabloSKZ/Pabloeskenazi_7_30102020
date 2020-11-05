function renderCards(recipes) {
  /* console.log(recipes); */
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

function showCards(recipes) {}

function filterRecipes(recipes, search) {
  let filtredRecipes = [];
  for (let i in recipes) {
    // Search by name
    if (recipes[i].name.match(search)) {
      filtredRecipes.push(
        recipes.find((x) => x.name === recipes[i].name.match(search).input)
      );
      // Search by description
    } else if (recipes[i].description.match(search)) {
      filtredRecipes.push(
        recipes.find(
          (x) => x.description === recipes[i].description.match(search).input
        )
      );
      // Search by ingredients
    } else {
      for (let j in recipes[i].ingredients) {
        if (recipes[i].ingredients[j].ingredient.match(search)) {
          console.log(recipes[i].ingredients[j].ingredient);
          filtredRecipes.push(
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
  return filtredRecipes;
}

/* DOM Variables */
const $recipes = document.getElementById("recipes");
const $searchInput = document.getElementById("search-bar-input");

$searchInput.addEventListener("input", (e) => {
  e.preventDefault();
  if ($searchInput.value.length > 2) {
    let inputSearch = $searchInput.value;
    const search = new RegExp(inputSearch, "i");
    filtredRecipes = filterRecipes(recipes, search);
    renderCards(filtredRecipes);
  }
});

let filtredRecipes = recipes;
renderCards(filtredRecipes);
