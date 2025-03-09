const weatherText = document.querySelector('#temp');
const weatherLocation = document.querySelector('#location');
const weatherIcon = document.querySelector('#weather-icon');

function weather(){
    // check if browser supports location
    // if yes, we will ask broswer for location
    // call api with location details and get the weather data
    function getLocation(callback) {
        if(!navigator.geolocation) {
            console.log("Geolocation not supported by browser")
            return
        }
        function success(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            callback(lat, lon);
        }
        function error() {
            console.log("unable to get location")
        }
        navigator.geolocation.getCurrentPosition(success, error)
    }
    getLocation(function(lat, lon){
        const apiKey = `8a5b1b6c90ec794d917750cf15fea1f9`;
        const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            // console.log(data);
            // console.log(data.main.temp);
            const imageUrl = `http://openweathermap.org/img/wn/`;
            weatherText.innerText = `${Math.round(data.main.temp)}`;
            weatherLocation.innerText = `${data.name}`;
            weatherIcon.src = `${imageUrl}${data.weather[0].icon}.png`;
        })
    })
}

weather()