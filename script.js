// OpenWeatherMap API 키 (실제 사용시에는 본인의 API 키로 교체해야 합니다)
const API_KEY = '6ce170e7896e1705aab4f259ce089ca4'; // https://openweathermap.org/api 에서 무료로 발급받을 수 있습니다
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM 요소들
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');
const weatherInfo = document.getElementById('weatherInfo');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

// 이벤트 리스너 등록
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// 날씨 검색 함수
async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('도시명을 입력해주세요.');
        return;
    }
    
    // 로딩 상태 표시
    showLoading();
    hideError();
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeather(weatherData);
    } catch (err) {
        console.error('날씨 데이터 가져오기 실패:', err);
        showError('도시를 찾을 수 없거나 네트워크 오류가 발생했습니다.');
    } finally {
        hideLoading();
    }
}

// API에서 날씨 데이터 가져오기
async function fetchWeatherData(city) {
    const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=kr`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('도시를 찾을 수 없습니다.');
        }
        throw new Error('날씨 데이터를 가져올 수 없습니다.');
    }
    
    return await response.json();
}

// 날씨 정보 표시
function displayWeather(data) {
    const cityName = data.name;
    const country = data.sys.country;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const feelsLike = Math.round(data.main.feels_like);
    const pressure = data.main.pressure;
    
    weatherInfo.innerHTML = `
        <h2>${cityName}, ${country}</h2>
        <div class="temperature">${temperature}°C</div>
        <div class="description">${description}</div>
        <div class="weather-details">
            <div class="weather-detail">
                <span>체감 온도</span>
                <div class="value">${feelsLike}°C</div>
            </div>
            <div class="weather-detail">
                <span>습도</span>
                <div class="value">${humidity}%</div>
            </div>
            <div class="weather-detail">
                <span>풍속</span>
                <div class="value">${windSpeed} m/s</div>
            </div>
            <div class="weather-detail">
                <span>기압</span>
                <div class="value">${pressure} hPa</div>
            </div>
        </div>
    `;
    
    weatherContainer.style.display = 'block';
}

// 로딩 상태 표시
function showLoading() {
    loading.style.display = 'block';
    weatherContainer.style.display = 'none';
}

// 로딩 상태 숨기기
function hideLoading() {
    loading.style.display = 'none';
}

// 에러 메시지 표시
function showError(message) {
    error.innerHTML = `<p>❌ ${message}</p>`;
    error.style.display = 'block';
    weatherContainer.style.display = 'none';
}

// 에러 메시지 숨기기
function hideError() {
    error.style.display = 'none';
}

// 페이지 로드시 초기 메시지
window.addEventListener('load', function() {
    weatherInfo.innerHTML = '<p>도시명을 입력하고 검색 버튼을 클릭하세요.</p>';
});