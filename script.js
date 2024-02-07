const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const grantAccessContainer=document.querySelector(".grant-locationContainer")
const userContainer=document.querySelector(".weatherContainer")
const searchForm=document.querySelector('[data-searchForm]');
const loadingScreen=document.querySelector(".loading-container")
const userInfoContainer=document.querySelector(".user-info-container");


// initially kin kin variable ki need mujhe pd skti h ?
// ->API
// ->Current tAB-> cerify krna hoga na hm kisi or tab me jaye ya ni _> mana agr hme kisi or tb pr jana h to hmepta to hona chahye hm kosni tab me h

let currentTab=userTab;

const API_KEY="063ede76ffa932fc5b26cfbc5be1ed59";

currentTab.classList.add("current-tab"); // current tab ke aandr kuch css properties h voh unki class list me add kr denge

getFromSessionStorage();

// tab change kaise pta lgaenge ki konse pr jana h _>jb bhi koi click hoga dono pr tbhi hm change ya switch krenge
//ek function h jiska kaam switch krna h tabs m


// tab Change

// function for switch tab

function switchTab(clickedTab){  // mene jis bhi tab pr click kra h voh tab as a parameter de diya 
    if(clickedTab!=currentTab){
        currentTab.classList.remove('current-tab');     // remove  current tab from the class list
        currentTab=clickedTab;
        currentTab.classList.add('current-tab');   
        // add active class to the 

        if(!searchForm.classList.contains("active")){ //agr search from me 'active' nhi pda hua h iska mtlb yeh h ki espr click hua h 
           userInfoContainer.classList.remove("active"); //agr search form pr click hua h iska mtlb voh active ho gyi to usme hme sirf voh form show krna h grant access wali image or your weather ki class ke aande active class remove krni pdegi 

           grantAccessContainer.classList.remove("active");  
           searchForm.classList.add("active");
        }   
        
        else{
            //main phle search wale tab pr hu aab your weather tab ko visible krna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");// ahr hm search krenge to user ka jo weather h voh bhi hide krna h
            // visible kisko krna h?
            // aab ain your weather me aa gya u, toh hme weather bhi display krna pdega , so let's check local storage first 
            // for co ordinates, if we haved save them there
            getFromSessionStorage();
        
        }    
    }    
        
}    
userTab.addEventListener("click",()=>{
    // passed clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    // passed clicked tab as input parameter
    switchTab(searchTab);
})

function getFromSessionStorage(){

// yeh check krega _> isf cor ordinates are already present in the session storage

    const localCoordinates=sessionStorage.getItem('user-coordinates');
    //yeh user-coordinates name h jis ke aandr hm coordinates store krenge hm yha kuc or bhi pass kr skte h jisme hmne store kr rkha hoga agr toh 
    if(!localCoordinates)
{
    // agr local co ordinates nhi mile yani local storage me save nhi h to hmne location ka accesss ni de rkha to hme grant location window shoe krni hogi
    grantAccessContainer.classList.add("active");
}    
else{
    //agr local coordinates pde h to to lat on ka use krke api call kro

    const coordinates=JSON.parse(localCoordinates); //json string ko json object me convert krta h
    fetchUserWeatherInfo(coordinates); // user ke weather ko fethch krke lata h jiske aandr coordinates pass kre h
}    


}


async function fetchUserWeatherInfo(coordinates){

    const {lat,lon}= coordinates;


    // agr hme api call krni h toh hme phle loader dikhana pdega or jo location wala ui h usse hide krna pdega
    // make grantContainer invisible

    grantAccessContainer.classList.remove('active');
    
    //make loader visible
    loadingScreen.classList.add('active');

    // api call mardi
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data= await response.json(); 

        // aab api call ho chuki h toh aab loader screen ko hta denge

        loadingScreen.classList.remove('active');
        // or hmne fir lat or lon ko use krke hmne fir weathre dikhya tha

        userInfoContainer.classList.add('active'); // aabhi yeh sirf show h ua h lekin aabhi hme eski jo values aai h api se unhe render bhi rkana h ui pr
        renderWeatherInfo(data); // response me se value nikalkr render krega ui me
    }
    catch(e){
        loadingScreen.classList.remove("active");
        alert("Wrong City/Country , Please input the correct details")
    }
    

}


function renderWeatherInfo(weatherInfo){
    // hme isme kya kya chahiye? -> location chaye, city ka name, country code, description ,weather icon , temprature ki exact value , windspped ki value chahye , humidity ki value chaye, cloud spped ki value chahye

    //element fetch krke lana pdega

    const cityName=document.querySelector('[data-cityName]');
    const countryIcon=document.querySelector('[data-countryIcon]');
    const desc=document.querySelector("data-weatherDesc");
    const weatherIcon=document.querySelector('[data-weatherIcon');
    const temp=document.querySelector('[data-temp]');
    const windspeed=document.querySelector('[data-windspeed]');
    const humidity=document.querySelector('[data-humidity]');
    const cloudiness=document.querySelector('[data-cloudiness]');
    
    


    
    //fetching data from weatherInfo Object and assigning it to html elements
    cityName.innerText=weatherInfo?.name;
    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=weatherInfo?.main?.temp;
    windspeed.innerText=weatherInfo?.wind?.speed;
    humidity.innerText=weatherInfo?.main?.humidity;
    cloudiness.innerText=weatherInfo?.clouds?.all;
}


// Jb bhi grant acess wale button pr click kro to event lga hoga joki 2 kaam krega
// 1.Current Position Find kro 
// 2. session storage me current position ke lat or lon store kro

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
    alert("No Location Support Available")
    }
}


function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton=document.querySelector('[data-grantAccess]');
grantAccessButton.addEventListener("click", getLocation);


// Agr me is search pr click krta h jo bhi nput ki value dunga us values ke liye  api call ho jaegi or uske liye hme input value nikalni pdegi

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.prevent.Default();
    let cityName=searchInput.ariaValueMax;

    if(cityName===""){
     return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
//fetch weather info of the entered city from api   

})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");

    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');


    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch{
        alert(`City named ${city} is not found.`);
    }
}