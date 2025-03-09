const ENTER_KEY_CODE = 13;

function getKeyword() {
    const unsplashSearch = document.querySelector('#unsplashSearch');
    unsplashSearch.addEventListener("keyup", (e) => {
        if(e.keyCode === ENTER_KEY_CODE) {
            if(e.target.value.length === 0) {
                alert("검색어를 입력해주세요!");
            } else {
                // enter 눌렀을 때 검색 요청
                requestKeyword(e.target.value);
                console.log(e.target.value);
            }
        }
    })
}

const apiAccessKey = "BhG-PIBhEFaH7Az6enoMbFCNQRbhVQR4eP4XgIPFXVs";


const END_POINT = `https://api.unsplash.com/search/photos?page=1&per_page=20&client_id=${apiAccessKey}`

function requestKeyword(keyword) {
    const unsplashRequest = new XMLHttpRequest();
    console.log(keyword)
    unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${keyword}&per_page=20&orientation=landscape`);
    unsplashRequest.onload = addImage;
    unsplashRequest.onerror = function(e) {
        requestError(err, 'image');
        console.error(e);
    }

    unsplashRequest.setRequestHeader('Authorization', `Client-ID ${apiAccessKey}`);
    unsplashRequest.send();

    const unsplashResult = document.querySelector('#unsplashResult');

    function addImage() {
        const data = JSON.parse(this.responseText);
        console.log(data);
        if(data && data.results && data.results[0]) {
            unsplashResult.innerHTML = "";
            for(var i = 0; i < data.results.length; i++) {
                const photo = data.results[i];
                unsplashResult.innerHTML += `<div class="list_item" id='${photo.urls.full}'><img class="list_img" id='${photo.urls.full}' src="${photo.urls.thumb}"></div>`;
            }

            const listItem = document.querySelectorAll(".list_item");
            for(const item of listItem) {
                item.addEventListener("click", (e) => {
                    const imgUrl = e.target.getAttribute('id');
                    if(window.localStorage.getItem('image')) {
                        window.localStorage.removeItem('image');
                    }
                    try {
                        window.localStorage.setItem('image', JSON.stringify(imgUrl));
                    } catch(e) {
                        console.log(e.message);
                    }
                    init();
                });
            }

          
        }
    }
}

function init() {
    try {
        const storedValue = window.localStorage.getItem('image');
        if(storedValue) {
            const backImage = document.querySelector('#background');
            backImage.style.background = `url(${storedValue}) no-repeat center`;
            backImage.style.backgroundSize = 'cover';
        }
    } catch {
        console.error('cannot bring localStorage image data');
    }

    getKeyword();
}

init();

/*const request = async (url) => {
    try {
        const res = await fetch(`${END_POINT}${url}`);
        if(res.ok) {
            return await res.json();
        }
        throw new Error('error in api request');
    } catch (e) {
        console.error(e);
    }
}

const fetchUnsplash = async (keyword) => {
    return await request(`&query=${keyword}`);
}*/