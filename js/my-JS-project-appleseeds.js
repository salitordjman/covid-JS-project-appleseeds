//! Setting CONST and LET
const start = document.querySelector(".start")
const countriesInfoMenu=document.createElement("select");
const graphsBtn= document.querySelector(".graphsBtn");
const myChartVisible= document.querySelector("#myChart");
const arrRegion=document.querySelectorAll(".region");
const arrCases=document.querySelectorAll(".cases");
const countriesBtn=document.querySelector(".countriesBtn");
const specificCountry=document.querySelector('.specificCountry');
let specificInfo="";
let objCountriesCode={};
let labelsCalc=[];
let dataCalc=[];
let labelName="";
let myChart="";
let backgroundChange="";
let borderChange="";
let ctx="";
let coronaApi="";
(async function myWay(){

  try{
    start.style.visibility="visible"
    coronaApi = await axios
    .get('https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries')
    start.style.visibility="hidden"
  }catch(e){
    console.log("Error",e);
  }
}())


//Create LOADING and cancel it by loading information
// start.style.visibility="hidden"
countriesInfoMenu.style.width="350px";
countriesInfoMenu.style.visibility="hidden";
countriesBtn.appendChild(countriesInfoMenu)

async function showBtnAndGraph(e){
    if(myChart){
        myChart.destroy()
    }
    if(ctx) {
        ctx.style.boxShadow="none";
    }
    start.style.visibility="visible"
    specificCountry.style.visibility="hidden"
    objCountriesCode={};
    countriesInfoMenu.innerHTML="";
    graphsBtn.style.visibility="visible";
    myChartVisible.style.visibility="visible";
    let regionBtn=e.target.classList[1]
    if(regionBtn==="world"){
        regionBtn='';
    } else{
        regionBtn=`/region/${regionBtn}`;
    }
    //!Create an EVENT at the touch of a button-----DOWN
    //!TRY {} CATCH {}
    try{
    //!axios for continent data and OBJ retention
        const countriesApi =await axios
        .get(`https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1${regionBtn}`)
        start.style.visibility="hidden"
        for(let i=0; i<countriesApi.data.length; i++){
            if(countriesApi.data[i].cca2!="XK"){
                objCountriesCode[countriesApi.data[i].cca2]={
                    code: countriesApi.data[i].cca2
                }
            }
        }
//!axios for COVID data and OBJ storage
for(let objCode in objCountriesCode){ 
  const dataToObj=coronaApi.data.data
  for(let i=0;i<dataToObj.length;i++){
    if(objCountriesCode[objCode].code===coronaApi.data.data[i].code){
      Object.assign(objCountriesCode[objCode], {
          name: dataToObj[i].name,
          confirmed: dataToObj[i].latest_data.confirmed,
          critical: dataToObj[i].latest_data.critical,
          deaths: dataToObj[i].latest_data.deaths,
          recovered: dataToObj[i].latest_data.recovered,
          todayConfirmed: dataToObj[i].today.confirmed,
          todayDeaths: dataToObj[i].today.deaths
      });
      //!Creating and preserving countries that exist on the same continent
      specificInfo= document.createElement("option");
      countriesInfoMenu.appendChild(specificInfo)
      specificInfo.innerHTML = dataToObj[i].name;
      countriesInfoMenu.style.visibility="visible";
      
        }
      }
    }
    }catch (e){
        console.log("ERROR",e);
    }
}
//!EVENT for clicking on a country on the same continent
countriesInfoMenu.addEventListener("change",function(e){
    for(let countriesInfo in objCountriesCode){
        if(e.target.value===objCountriesCode[countriesInfo].name){
            let getCountriesDeatial=`
            <div class="countriesInfo">
            <h2>Confirmed:<br>${objCountriesCode[countriesInfo].confirmed}</h2>
            <h2>Today Confirmed:<br>${objCountriesCode[countriesInfo].todayConfirmed}</h2>
            <h2>Deaths:<br>${objCountriesCode[countriesInfo].deaths}</h2>
            <h2>Today Deaths:<br>${objCountriesCode[countriesInfo].todayDeaths}</h2>
            <h2>Critical:<br>${objCountriesCode[countriesInfo].critical}</h2>
            <h2>Recovered:<br>${objCountriesCode[countriesInfo].recovered}</h2>
            </div>
            `;
            specificCountry.innerHTML = getCountriesDeatial;
            specificCountry.style.visibility="visible"
        }
    }
})  
//!Create a graph with data of the same continent + delete a graph by clicking on another button              
function showGraph(e){
    specificCountry.style.visibility="hidden"
    switch (e.target.classList[1]) {
        case "confirmed":
            calcGraph('confirmed')
            backgroundChange='rgba(66, 99, 132, 0.6)';
            borderChange='rgba(255, 99, 132, 1)';
            break;
            case 'deaths':
            calcGraph('deaths')
            backgroundChange='rgba(45, 6, 44, 0.6)';
            borderChange='rgba(8, 34, 143, 1)';
            break;
            case 'recovered':
                calcGraph('recovered')
            backgroundChange='rgba(106, 55, 200, 0.6)';
            borderChange='rgba(75, 5, 45, 1)';
            break;
            case 'critical':
                calcGraph('critical')
            backgroundChange='rgba(12, 157, 32, 0.6)';
            borderChange='rgba(158, 46, 78, 1)';
            break;
        }
    ctx = document.getElementById('myChart');
    ctx.style.boxShadow="10px 10px 25px red,-10px -10px 25px red";
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsCalc,
            datasets: [{
                label: `Covid 19 ${labelName}`,
                data: dataCalc,
                fill: true,
                backgroundColor: backgroundChange,
                borderColor: borderChange,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
function calcGraph(type){
    if(myChart){
        myChart.destroy()
    }
    labelsCalc=[];
    dataCalc=[];
    labelName = type;
    for(let objInfo in objCountriesCode){
        labelsCalc.push(objCountriesCode[objInfo].name)
        switch (type) {
            case "confirmed":
                dataCalc.push(objCountriesCode[objInfo].confirmed)
                break;
            case 'deaths':
                dataCalc.push(objCountriesCode[objInfo].deaths)
                break;
            case 'recovered':
                dataCalc.push(objCountriesCode[objInfo].recovered)
                break;
            case 'critical':
                dataCalc.push(objCountriesCode[objInfo].deaths)
                break;
        }
    }
}
//! Create an EVENT at the touch of a button
for(let region of arrRegion){
    region.addEventListener("click",showBtnAndGraph)
}
for(let allCases of arrCases){
    allCases.addEventListener("click",showGraph)
}
