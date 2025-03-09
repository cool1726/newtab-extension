const selectedEngine = document.querySelector(".selected-engine");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".option");

const activeOption = () => {
    optionsContainer.classList.toggle("active");
}

selectedEngine.addEventListener("click", activeOption);

optionsList.forEach(obj => {
    obj.addEventListener("click", () => {
        selectedEngine.innerHTML = obj.querySelector("label").innerHTML;
        optionsContainer.classList.remove("active");
    })
})

const Searching = Search.prototype;
function Search() {
    this.keyword = document.querySelector('input[name = "search"]');
    this.button = document.querySelector('.search-btn');
    this.form = document.querySelector('.search');

    this.Engine();
}

Searching.Engine = function() {
    this.form.addEventListener('submit', e => {
        e.preventDefault();
        let engine = document.querySelector(".selected-engine").firstChild.id;
        let keyword = this.keyword.value;

        console.log(engine);

        if(engine === 'google') {
            location.href = 'https://www.google.com/search?q=' + keyword;
        } else if(engine === 'youtube') {
            location.href = 'https://www.youtube.com/results?search_query=' + keyword;
        } else if(engine === 'naver') {
            location.href = 'https://search.naver.com/search.naver?query=' + keyword;
        }
    });
}

new Search();