document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const searchOption = document.getElementById("searchOption");
    const errorMessage = document.getElementById("errorMessage");

    searchButton.addEventListener("click", function() {
        search();
    });

    searchInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            search();
        }
    });

    function search() {
        const searchTerm = searchInput.value.trim();
        const searchCriteria = searchOption.value;
        const apiUrl = buildApiUrl(searchTerm, searchCriteria);

        if (searchTerm === "") {
            showMessage("Por favor, ingrese un término de búsqueda válido.");
        } else {
            performSearch(apiUrl);
        }
    }

    function buildApiUrl(query, criteria) {
        let apiUrl;
        if (criteria === 'name') {
            // Buscar platos por nombre
            apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
        } else if (criteria === 'ingredient') {
            // Buscar platos por ingrediente principal
            apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`;
        } else if (criteria === 'category') {
            // Buscar platos por categoría
            apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${query}`;
        } else if (criteria === 'area') {
            // Buscar platos por área (nacionalidad)
            apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${query}`;
        } else {
            console.error("Criterio de búsqueda no válido:", criteria);
            return null;
        }
        return apiUrl;
    }

    function performSearch(apiUrl) {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.meals === null) {
                    showMessage("No se encontraron resultados para esta búsqueda.");
                } else {
                    if (searchOption.value === 'name') {
                        mostrarResultado(data.meals[0]);
                    } else {
                        displayResults(data.meals);
                    }
                    removeMessageIfExists();
                }
            })
            .catch(error => {
                console.error("Error al realizar la búsqueda:", error);
                showMessage("Ocurrió un error al buscar. Por favor intenta de nuevo más tarde.");
            });
    }

    
    function clearResults() {
        const resultsContainer = document.getElementById("resultsGallery");
        if (resultsContainer) {
            resultsContainer.innerHTML = "";
        }
    }

    function displayResults(meals) {
        const resultsContainer = document.createElement("div");
        resultsContainer.id = "resultsGallery";
        const mainElement = document.querySelector("main");
        if (mainElement) {
            mainElement.appendChild(resultsContainer);
        } else {
            const newMainElement = document.createElement("main");
            newMainElement.appendChild(resultsContainer);
            document.body.appendChild(newMainElement);
        }
    
        resultsContainer.innerHTML = "";
    
        const maxRecipesToShow = 18;
        meals.slice(0, maxRecipesToShow).forEach(meal => {
            const mealCard = document.createElement("div");
            mealCard.classList.add("meal-card");
    
            const mealImage = document.createElement("img");
            mealImage.src = meal.strMealThumb;
            mealImage.alt = meal.strMeal;
    
            const mealName = document.createElement("span");
            mealName.textContent = meal.strMeal;
    
            mealCard.appendChild(mealImage);
            mealCard.appendChild(mealName);
            resultsContainer.appendChild(mealCard);
    
            mealCard.addEventListener("click", function () {
                window.location.href = `receta.html?nombre=${encodeURIComponent(meal.strMeal)}`;
            });
        });
    }
    

    function showMessage(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    }

    function removeMessageIfExists() {
        if (errorMessage.textContent.trim() !== "") {
            errorMessage.textContent = "";
            errorMessage.style.display = "none";
        }
    }

    function mostrarResultado(meals) {
        const recetaContainer = document.createElement("div");
        recetaContainer.classList.add("receta-container");

        const nombre = document.createElement("h1");
        nombre.textContent = meals.strMeal;
        nombre.classList.add("nombre-receta");
        recetaContainer.appendChild(nombre);

        const imagen = document.createElement("img");
        imagen.src = meals.strMealThumb;
        imagen.classList.add("imagen-receta");
        recetaContainer.appendChild(imagen);

        const ingredientesTitulo = document.createElement("h2");
        ingredientesTitulo.textContent = "Ingredientes:";
        ingredientesTitulo.classList.add("titulo-seccion");
        recetaContainer.appendChild(ingredientesTitulo);

        const listaIngredientes = document.createElement("ul");
        listaIngredientes.classList.add("lista-ingredientes");
        for (let i = 1; i <= 20; i++) {
            const ingrediente = meals[`strIngredient${i}`];
            const medida = meals[`strMeasure${i}`];
            if (ingrediente && medida) {
                const listItem = document.createElement("li");
                listItem.textContent = `${ingrediente}: ${medida}`;
                listItem.classList.add("item-ingrediente");
                listaIngredientes.appendChild(listItem);
            }
        }
        recetaContainer.appendChild(listaIngredientes);

        const instruccionesTitulo = document.createElement("h2");
        instruccionesTitulo.textContent = "Instrucciones:";
        instruccionesTitulo.classList.add("titulo-seccion");
        recetaContainer.appendChild(instruccionesTitulo);

        const instrucciones = document.createElement("p");
        instrucciones.textContent = meals.strInstructions;
        instrucciones.classList.add("texto-instrucciones");
        recetaContainer.appendChild(instrucciones);

        const videoTitulo = document.createElement("h2");
        videoTitulo.textContent = "Video:";
        videoTitulo.classList.add("titulo-seccion");
        recetaContainer.appendChild(videoTitulo);

        const videoEnlace = document.createElement("a");
        videoEnlace.href = meals.strYoutube;
        videoEnlace.textContent = "Ver video";
        videoEnlace.classList.add("enlace-video");
        recetaContainer.appendChild(videoEnlace);

        const mainElement = document.querySelector("main");
        if (mainElement) {
            mainElement.appendChild(recetaContainer);
        } else {
            const newMainElement = document.createElement("main");
            newMainElement.appendChild(recetaContainer);
            document.body.appendChild(newMainElement);
        }
    }
});

