function renderCards(recipes) {
  console.log(recipes);
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
      <div class="card">
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

/* DOM Variables */
const $recipes = document.getElementById("recipes");

renderCards(recipes);
