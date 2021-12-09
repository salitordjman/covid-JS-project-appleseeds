const dataCovid= document.querySelector(".covid")
async function fetching ()  {
  let test = await (await fetch('https://corona-api.com/countries')).json()
  console.log(test)
  dataCovid.innerHTML=test
}
fetching()
