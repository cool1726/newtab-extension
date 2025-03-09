const clockContainer = document.querySelector('#clock'),
clockTitle = clockContainer.querySelector('h1');
const dateTitle = clockContainer.querySelector('h2');

function getTime() {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    clockTitle.innerText = `${
        hour < 10 ? `0${hour}` : hour
    }:${
        min < 10 ? `0${min}` : min
    }`
}

function getDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const day = today.getDay();
    const days = [ '일', '월', '화', '수', '목', '금', '토' ];
    dateTitle.innerText = `${month}월 ${date}일 ${days[day]}요일`
}

function init() {
    getTime()
    setInterval(getTime, 60000)
}

getDate();
init()