const body = document.querySelector("body");

const modal = document.querySelector(".modal");
const overlay = modal.querySelector(".modal__overlay");
const closeBtn = modal.querySelector(".btn-close");

const navBookmark = modal.querySelector("#nav__bookmark");
const navBackground = modal.querySelector("#nav__background");
const navSearch = modal.querySelector("#nav__search");
const navHelp = modal.querySelector("#nav__help");
const modalBookmark = modal.querySelector(".modal-bookmark");
const modalBackground = modal.querySelector(".modal-background");
const modalSearch = modal.querySelector(".modal-search");
const modalHelp = modal.querySelector(".modal-help");

const settingBtn = document.querySelector('.setting-btn');
const selectBookmarks = document.querySelector('.select-bookmarks');
const bookmarkSaveBtn = modal.querySelector('#bookmark-btn-save');

const searchSaveBtn = modal.querySelector('#search-btn-save');

const bookmarkArea = document.querySelector('.bookmarks');

const openModal = () => {
    modal.classList.remove("hidden");
    body.classList.add("not-scroll");
  };
const closeModal = () => {
    modal.classList.add("hidden");
    body.classList.remove("not-scroll");
};

const openBookmark = () => {
    modalBookmark.classList.remove("hidden");
    modalBackground.classList.add("hidden");
    modalSearch.classList.add("hidden");
    modalHelp.classList.add("hidden");
}
const openBackground = () => {
    modalBookmark.classList.add("hidden");
    modalBackground.classList.remove("hidden");
    modalSearch.classList.add("hidden");
    modalHelp.classList.add("hidden");
}
const openSearch = () => {
    modalBookmark.classList.add("hidden");
    modalBackground.classList.add("hidden");
    modalSearch.classList.remove("hidden");
    modalHelp.classList.add("hidden");
}
const openHelp = () => {
    modalBookmark.classList.add("hidden");
    modalBackground.classList.add("hidden");
    modalSearch.classList.add("hidden");
    modalHelp.classList.remove("hidden");
}
/* modal : 검색설정 */
const saveSearchEngine = () => {
    window.localStorage.removeItem("searchEngine");
    const modalOptionsList = document.querySelectorAll(".search-option");
    modalOptionsList.forEach(item => {
        if(item.children[0].checked) {
            setItem("searchEngine", item.children[0].value);
        }
    })
    setSearchEngine();
    closeModal();
}

const setSearchEngine = () => {
    const eng = getItem("searchEngine", "default");
    if(eng != "default") {
        let domeng;
        if(eng == "google") {
            domeng = `<img src="assets/google_logo.png" alt="" style="padding-top: 5px;" id='google'>`;
        } else if (eng == "youtube") {
            domeng = `<img src="assets/yt_logo_rgb_dark.png" alt="" id='youtube'>`;
        } else if (eng == "naver") {
            domeng = `<img src="assets/naver_green.png" alt="" id='naver'>`;
        }
        selectedEngine.innerHTML = domeng;
    }
}

const getItem = (key, defaultValue) => {
    try {
        const storedValue = window.localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (e) {
        return e;
    }
}
const setItem = (key, value) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch(e) {
        console.log(e.message);
    }
}
const clearItems = () => {
    try {
        window.localStorage.clear();
    } catch (e) {
        console.log(e.message);
    }
}

const saveBookmarks = () => {
    const eng = getItem("searchEngine", "default");
    clearItems();
    if(eng != "default") {
        setItem("searchEngine", eng);
    }
    const bookmarkitems = document.querySelectorAll('.bookmark-item');
    let count = 0;
    bookmarkitems.forEach(item => {
        if(item.children[0].checked) {
            setItem(count, [item.children[0].id, item.innerText]);
            count += 1;
        }
    })
    showCustomBookmarks();
    closeModal();
}

overlay.addEventListener("click", closeModal);
closeBtn.addEventListener("click", closeModal);
settingBtn.addEventListener("click", openModal);
bookmarkSaveBtn.addEventListener("click", saveBookmarks);
navBookmark.addEventListener("click", openBookmark);
navBackground.addEventListener("click", openBackground);
navSearch.addEventListener("click", openSearch);
navHelp.addEventListener("click", openHelp);
searchSaveBtn.addEventListener("click", saveSearchEngine);

const showCustomBookmarks = () => {
    bookmarkArea.innerHTML = "";
    let flag = 0;
    if(getItem("searchEngine", "default") != "default") {
        flag += 1;
    }
    if(getItem("image", "default") != "default") {
        flag += 1;
    }

    if(localStorage.length - flag > 0) {
        for(let step = 0; step < localStorage.length - flag; step++) {
            chrome.bookmarks.getTree(function(itemTree){
                const bookmarkInfo = getItem(step, '이름없음');
                itemTree.forEach(function(item){
                    customNode(item, bookmarkInfo);
                });
            });
        }
    } else {
        bookmarkArea.innerHTML = `<span class="default-message">설정(우상단 톱니바퀴모양)에 들어가서 북마크를 설정해주세요 (●'◡'●)</span>`;
    }    
}
  
const customNode = (node, bookmarkInfo) => {
    let directoryTitle;
    const gettingBookmarks = chrome.bookmarks.get(bookmarkInfo[0], (item) => {
        directoryTitle = item[0].title;
    })
    const gettingChildren = chrome.bookmarks.getChildren(bookmarkInfo[0], (children) => {
        let bookmarkDirectoryDOM = `<div class="directory"><div class="directory-box">`;
        for (child of children) {
            bookmarkDirectoryDOM += `<a href="${child.url}"><div class="directory-item"><div class="favicon-bg"><img class="favicon" src="chrome://favicon/size/24/${child.url}"></div><span class="url-description" >${child.title}</span></div></a>`;
        }
        bookmarkDirectoryDOM += `</div><div class="directory-title">${directoryTitle}</div></div>`;
        bookmarkArea.innerHTML += bookmarkDirectoryDOM;
        bookmarkDirectoryDOM = "";
    } );
}

// function onFulfilled(children) {
//     console.log(children);
//     let bookmarkDirectoryDOM = `<div class="directory">${node.title}`;
//     for (child of children) {
//         bookmarkDirectoryDOM += `<div><img class="favicon" src="chrome://favicon/size/24/${child.url}"><span class="url-description">${child.title}</span></a></div>`;
//     }
//     bookmarkDirectoryDOM += `</div>`;
//     bookmarkArea.innerHTML += bookmarkDirectoryDOM;
//     bookmarkDirectoryDOM = "";
// }
  
// function onRejected(error) {
//     console.log(`An error: ${error}`);
// }



const getAllBookmarks = () => {    
    chrome.bookmarks.getTree((itemTree) => {
        itemTree.forEach(function(item){
            processNode(item);
        });
    });
}

const processNode = (node) => {
    // recursively process child nodes
    if(node.children) {
        let flag = 0; // 1이면 자식이 있을 때, 0이면 없을 때
        node.children.forEach(function(child) { 
            if(child.children) { // 자식의 자식이 있을 때
                flag = 1;
                processNode(child); 
            } else { // 자식의 자식이 없을 때 (내가 마지막 디렉토리일 때) 
            }
        });
        if(flag == 0) {
            selectBookmarks.innerHTML += `<div class="bookmark-item"><input type="checkbox" id=${node.id}><span class="bookmark-label">${node.title}</span></div>`;
        }
        // console.log(node);
    } else {
        selectBookmarks.innerHTML += `<div class="bookmark-item"><input type="checkbox" id=${node.id}><span class="bookmark-label">${node.title}</span></div>`;
    }
    // print leaf nodes URLs to console
    // if(node.url) { console.log(node); }
}

function init() {
    setSearchEngine();
    showCustomBookmarks();
    getAllBookmarks();
}

init();

