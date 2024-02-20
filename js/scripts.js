const countryElement = document.getElementById("Country");
const cityElement = document.getElementById("City");
const methodElement = document.getElementById("Method");

function dataCity() {
  let countryValue = countryElement.value;
  let insideCity = document.getElementById("insideCity");
  switch (countryValue) {
    case "SA":
      insideCity.innerHTML = `<option value="Mecca">Mecca</option> <option value="Medina">Medina</option> <option value="Riyadh">Riyadh</option> <option value="Jeddah">Jeddah</option> <option value="Abha">Abha</option> <option value="Dammam">Dammam</option> <option value="Jubail">Jubail</option>`;
      break;
    case "AE":
      insideCity.innerHTML = `<option value="Abu Dhabi">Abu Dhabi</option> <option value="Dubai">Dubai</option> <option value="Sharjah">Sharjah</option> <option value="Al Ain">Al Ain</option>`;
      break;
    case "EG":
      insideCity.innerHTML = `<option value="Cairo">Cairo</option> <option value="Alexandria">Alexandria</option>`;
      break;
    case "US":
      insideCity.innerHTML = `<option value="Washington">Washington</option> <option value="New York">New York</option> <option value="Boston">Boston</option> <option value="Chicago">Chicago</option> <option value="Seattle">Seattle</option> <option value="San Francisco">San Francisco</option> <option value="San Diego">San Diego</option> <option value="Las Vegas">Las Vegas</option> <option value="Los Angeles">Los Angeles</option> <option value="Houston">Houston</option> <option value="Dallas">Dallas</option> <option value="Tampa">Tampa</option> <option value="Miami">Miami</option>`;
      break;
    case "CA":
      insideCity.innerHTML = `<option value="Ottawa">Ottawa</option> <option value="Montreal">Montreal</option> <option value="Toronto">Toronto</option> <option value="Winnipeg">Winnipeg</option> <option value="Edmonton">Edmonton</option> <option value="Calgary">Calgary</option> <option value="Vancouver">Vancouver</option>`;
      break;
    case "GB":
      insideCity.innerHTML = `<option value="London">London</option> <option value="Birmingham">Birmingham</option> <option value="Manchester">Manchester</option> <option value="Edinburgh">Edinburgh</option> <option value="Glasgow">Glasgow</option>`;
      break;
  }
}

// WHEN THE "CONTINUE" BUTTON IS CLICKED:
function continueClicked() {
  let country = countryElement.value;
  let city = cityElement.value;
  let method = methodElement.value;

  getDataFromAPI(country, city, method);

  localStorage.clear();
  localStorage.setItem("Country", country);
  localStorage.setItem("City", city);
  localStorage.setItem("Method", method);
}

// LOADER FUNCTIN:
function loader(elementID = "") {
  document.getElementById(`${elementID}`).innerHTML = `
  <span class="loader"></span>
  `;
}

// GET DATA AND HANDLING:
function getDataFromAPI(country = "SA", city = "Mecca", method = 4) {
  // HANDLING WITH LOADER:
  loader("Hijri");
  loader("Gregorian");

  loader("f");
  loader("s");
  loader("d");
  loader("a");
  loader("m");
  loader("i");

  loader("month-table");

  // GET DATA:
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let day = new Date().getDate() - 1;
  let endpoint = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=${method}`;

  axios
    .get(endpoint)
    .then((response) => {
      let res = response.data.data;

      // HANDLING WITH DATE:
      let gregorian = res[day].date.gregorian;
      let gFullDateNo = gregorian.date;
      let gYear = gregorian.year;
      let gMonth = gregorian.month.en;
      let gDay = gregorian.weekday.en;
      let gDayNo = gregorian.day;

      let hijri = res[day].date.hijri;
      let hFullDateNo = hijri.date;
      let hYear = hijri.year;
      let hMonth = hijri.month.en;
      let hDay = hijri.weekday.en;
      let hDayNo = hijri.day;

      document.getElementById("Gregorian").innerHTML = `
      <h2 class="title-font">Gregorian</h2>
      <h5 class="secondary-font mt-4">${gFullDateNo}</h5>
      <h5 class="secondary-font mt-1">${gDay}  ${gDayNo} ${gMonth}  ${gYear}</h5>
      `;

      document.getElementById("Hijri").innerHTML = `
      <h2 class="title-font">Hijri</h2>
      <h5 class="secondary-font mt-4">${hFullDateNo}</h5>
      <h5 class="secondary-font mt-1">${hDay}  ${hDayNo} ${hMonth}  ${hYear}</h5>
      `;

      // HANDLING WITH TODAY'S TIMINGS:
      let timings = res[day].timings;
      let fajr = to12Format(timings.Fajr.slice(0, 5));
      let sunrise = to12Format(timings.Sunrise.slice(0, 5));
      let dhuhr = to12Format(timings.Dhuhr.slice(0, 5));
      let asr = to12Format(timings.Asr.slice(0, 5));
      let maghrib = to12Format(timings.Maghrib.slice(0, 5));
      let isha = to12Format(timings.Isha.slice(0, 5));

      document.getElementById("f").innerHTML = `
      <h4 class="secondary-font mb-0">${fajr}</h4>
      `;
      document.getElementById("s").innerHTML = `
      <h4 class="secondary-font mb-0">${sunrise}</h4>
      `;
      document.getElementById("d").innerHTML = `
      <h4 class="secondary-font mb-0">${dhuhr}</h4>
      `;
      document.getElementById("a").innerHTML = `
      <h4 class="secondary-font mb-0">${asr}</h4>
      `;
      document.getElementById("m").innerHTML = `
      <h4 class="secondary-font mb-0">${maghrib}</h4>
      `;
      document.getElementById("i").innerHTML = `
      <h4 class="secondary-font mb-0">${isha}</h4>
      `;

      // HANDLING WITH DAYS OF MONTH TIMINGS:
      document.getElementById("month-table").innerHTML = `
        <thead class="align">
            <tr>
                <th scope="col"></th>
                <th scope="col">Fajr</th>
                <th scope="col">Sunrise</th>
                <th scope="col">Dhuhr</th>
                <th scope="col">Asr</th>
                <th scope="col">Maghrib</th>
                <th scope="col">Isha'a</th>
            </tr>
        </thead>
        <tbody id="tbody" class="align"> </tbody>
      `;
      let tableBody = document.getElementById("tbody");
      tableBody.innerHTML = "";

      res.forEach((obj) => {
        let Day = obj.date.gregorian.weekday.en.slice(0, 3);
        let date = obj.date.readable.slice(0, 6);
        let Fajr = to12Format(obj.timings.Fajr.slice(0, 5));
        let Sunrise = to12Format(obj.timings.Sunrise.slice(0, 5));
        let Dhuhr = to12Format(obj.timings.Dhuhr.slice(0, 5));
        let Asr = to12Format(obj.timings.Asr.slice(0, 5));
        let Maghrib = to12Format(obj.timings.Maghrib.slice(0, 5));
        let Isha = to12Format(obj.timings.Isha.slice(0, 5));

        const todayMark =
          date.match(/\d+/)[0] == new Date().getDate() ? "today-mark" : "";

        if (screen.width >= 768) {
          tableBody.innerHTML += `<tr class="${todayMark}"> <th scope="row">${Day} ${date}</th> <td>${Fajr}</td> <td>${Sunrise}</td> <td>${Dhuhr}</td> <td>${Asr}</td> <td>${Maghrib}</td> <td>${Isha}</td> </tr>`;
        } else {
          tableBody.innerHTML += `<tr class="${todayMark}"> <th scope="row">${Day} <br/> ${date}</th> <td>${Fajr}</td> <td>${Sunrise}</td> <td>${Dhuhr}</td> <td>${Asr}</td> <td>${Maghrib}</td> <td>${Isha}</td> </tr>`;
        }
      });
    })
    .catch((err) => {
      alert(err.message);
      throw Error(err);
    });
}

// Function to convert the time from 24 to 12 format:
function to12Format(numberString) {
  let pattern = /^\d{1,2}(?=\:)/;
  let zeroMatch = /^0{1}(?=\d\:)/;

  if (screen.width >= 768) {
    switch (pattern.exec(numberString)[0]) {
      case "12":
        return numberString + " " + "PM";
      case "13":
        return numberString.replace(pattern, "1") + " " + "PM";
      case "14":
        return numberString.replace(pattern, "2") + " " + "PM";
      case "15":
        return numberString.replace(pattern, "3") + " " + "PM";
      case "16":
        return numberString.replace(pattern, "4") + " " + "PM";
      case "17":
        return numberString.replace(pattern, "5") + " " + "PM";
      case "18":
        return numberString.replace(pattern, "6") + " " + "PM";
      case "19":
        return numberString.replace(pattern, "7") + " " + "PM";
      case "20":
        return numberString.replace(pattern, "8") + " " + "PM";
      case "21":
        return numberString.replace(pattern, "9") + " " + "PM";
      case "22":
        return numberString.replace(pattern, "10") + " " + "PM";
      case "23":
        return numberString.replace(pattern, "11") + " " + "PM";
      case "24":
        return numberString.replace(pattern, "12") + " " + "AM";
      default:
        return numberString.replace(zeroMatch, "") + " " + "AM";
    }
  } else {
    switch (pattern.exec(numberString)[0]) {
      case "12":
        return numberString + "\n PM";
      case "13":
        return numberString.replace(pattern, "1") + "\n PM";
      case "14":
        return numberString.replace(pattern, "2") + "\n PM";
      case "15":
        return numberString.replace(pattern, "3") + "\n PM";
      case "16":
        return numberString.replace(pattern, "4") + "\n PM";
      case "17":
        return numberString.replace(pattern, "5") + "\n PM";
      case "18":
        return numberString.replace(pattern, "6") + "\n PM";
      case "19":
        return numberString.replace(pattern, "7") + "\n PM";
      case "20":
        return numberString.replace(pattern, "8") + "\n PM";
      case "21":
        return numberString.replace(pattern, "9") + "\n PM";
      case "22":
        return numberString.replace(pattern, "10") + "\n PM";
      case "23":
        return numberString.replace(pattern, "11") + "\n PM";
      case "24":
        return numberString.replace(pattern, "12") + "\n AM";
      default:
        return numberString.replace(zeroMatch, "") + "\n AM";
    }
  }
}

// START FROM HERE:
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.length === 3) {
    let country = localStorage.getItem("Country");
    let city = localStorage.getItem("City");
    let method = localStorage.getItem("Method");

    countryElement.value = country;
    dataCity();
    cityElement.value = city;
    methodElement.value = method;

    getDataFromAPI(country, city, method);
  } else {
    dataCity();
    getDataFromAPI();
  }

  // WHEN THE COUNTRY SELECTOR CHANGES:
  countryElement.addEventListener("change", () => {
    dataCity();
  });
});

// COPYRIGHT YEAR:
document.getElementById("Copyright").innerHTML = new Date().getFullYear();
