const body = document.querySelector("body");

const modal = document.querySelector(".modal");
const overlay = modal.querySelector(".modal__overlay");
const closeBtn = modal.querySelector(".btn-close");

const navBookmark = modal.querySelector("#nav__bookmark");
const navBackground = modal.querySelector("#nav__background");
const navHelp = modal.querySelector("#nav__help");
const modalBookmark = modal.querySelector(".modal-bookmark");
const modalBackground = modal.querySelector(".modal-background");
const modalHelp = modal.querySelector(".modal-help");

const settingBtn = document.querySelector('.setting-btn');
const selectBookmarks = document.querySelector('.select-bookmarks');
const bookmarkSaveBtn = modal.querySelector('#bookmark-btn-save');
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
    modalHelp.classList.add("hidden");
}
const openBackground = () => {
    modalBookmark.classList.add("hidden");
    modalBackground.classList.remove("hidden");
    modalHelp.classList.add("hidden");
}
const openHelp = () => {
    modalBookmark.classList.add("hidden");
    modalBackground.classList.add("hidden");
    modalHelp.classList.remove("hidden");
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
    clearItems();
    const bookmarkitems = document.querySelectorAll('.bookmark-item');
    let count = 0;
    bookmarkitems.forEach(item => {
        if (item.children[0].checked) {
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
navHelp.addEventListener("click", openHelp);

const showCustomBookmarks = () => {
    bookmarkArea.innerHTML = "";
    let flag = 0;
    if (getItem("image", "default") !== "default") {
        flag += 1;
    }

    if (localStorage.length - flag > 0) {
        chrome.runtime.sendMessage({ action: "getBookmarks" }, (response) => {
            if (!response || !response.bookmarks) {
                console.error("Failed to fetch bookmarks.");
                return;
            }

            for(let step = 0; step < localStorage.length - flag; step++) {
                const bookmarkInfo = getItem(step, '이름없음'); // 저장된 북마크 가져오기
                response.bookmarks.forEach((item) => {
                    customNode(item, bookmarkInfo);
                });
            }
        });
    } else {
        bookmarkArea.innerHTML = `<span class="default-message">설정(우상단 톱니바퀴모양)에 들어가서 북마크를 설정해주세요 (●'◡'●)</span>`;
    }
};

  
const customNode = (node, bookmarkInfo) => {
    if (!bookmarkInfo || !bookmarkInfo[0]) return;

    chrome.runtime.sendMessage({ action: "getBookmarkById", id: bookmarkInfo[0] }, (response) => {
        if (!response || !response.bookmark) {
            console.error("Failed to fetch bookmark info.");
            return;
        }

        let directoryTitle = response.bookmark.title;
        
        chrome.runtime.sendMessage({ action: "getBookmarkChildren", id: bookmarkInfo[0] }, (response) => {
            if (!response || !response.children) {
                console.error("Failed to fetch bookmark children.");
                return;
            }

            let bookmarkDirectoryDOM = `<div class="directory"><div class="directory-box">`;
            response.children.forEach((child) => {
                bookmarkDirectoryDOM += `<a href="${child.url}"><div class="directory-item"><div class="favicon-bg">
                    <img class="favicon" src="chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(child.url)}&size=24">
                    </div><span class="url-description">${child.title}</span></div></a>`;
            });
            bookmarkDirectoryDOM += `</div><div class="directory-title">${directoryTitle}</div></div>`;
            bookmarkArea.innerHTML += bookmarkDirectoryDOM;
        });
    });
};

const getAllBookmarks = () => {
    chrome.runtime.sendMessage({ action: "getBookmarks" }, (response) => {
        response.bookmarks.forEach(function(item){
            processNode(item);
        });
    });
}

const processNode = (node) => {
    // recursively process child nodes
    if(node.children) {
        node.children.forEach(processNode);
        selectBookmarks.innerHTML += `<div class="bookmark-item"><input type="checkbox" id=${node.id}><span class="bookmark-label">${node.title}</span></div>`;
    }
}

function init() {
    showCustomBookmarks();
    getAllBookmarks();
}

init();

