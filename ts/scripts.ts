import axios from "axios";

const countryElement = document.getElementById("Country") as HTMLSelectElement,
  cityElement = document.getElementById("City") as HTMLSelectElement,
  methodElement = document.getElementById("Method") as HTMLSelectElement;

function dataCity(): void {
  let countryValue: string = countryElement.value;
  let insideCity = document.getElementById("insideCity") as HTMLOptGroupElement;
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
function continueClicked(): void {
  const country: string = countryElement.value,
    city: string = cityElement.value,
    method: string = methodElement.value;

  getDataFromAPI(country, city, +method);

  localStorage.clear();
  localStorage.setItem("Country", country);
  localStorage.setItem("City", city);
  localStorage.setItem("Method", method);
}

// LOADER FUNCTIN:
function loader(elementID: string): void {
  document.getElementById(`${elementID}`)!.innerHTML = `
  <span class="loader"></span>
  `;
}

// GET DATA AND HANDLING:
function getDataFromAPI(
  country: string = "SA",
  city: string = "Mecca",
  method: number = 4
) {
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

  async function callAPI() {
    try {
      // GET DATA:
      const year: number = new Date().getFullYear(),
        month: number = new Date().getMonth() + 1,
        day: number = new Date().getDate() - 1,
        endpoint: string = `https://api.aladhan.com/v11/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=${method}`;

      // Interface Declarations:
      interface Gregorian {
        date: string;
        day: string;
        year: string;
        format: string;
        weekday: { en: string; ar?: string };
        month: { en: string; ar?: string; number: number };
        designation: { abbreviated: string; expanded: string };
      }

      interface Hijri extends Gregorian {
        holidays?: [];
      }

      interface Date {
        gregorian: Gregorian;
        hijri: Hijri;
        readable: string;
        timestamp: string;
      }

      interface Meta {
        latitude: number;
        latitudeAdjustmentMethod: string;
        longitude: number;
        method: {
          id: number;
          name: string;
          params: { Fajr: number; Isha: string };
          location: { latitude: number; longitude: number };
        };
        midnightMode: string;
        offset: {
          Imsak: number;
          Fajr: number;
          Sunrise: number;
          Dhuhr: number;
          Asr: number;
        };
        school: string;
        timezone: string;
      }

      interface Timings {
        Asr: string;
        Dhuhr: string;
        Fajr: string;
        Firstthird: string;
        Imsak: string;
        Isha: string;
        Lastthird: string;
        Maghrib: string;
        Midnight: string;
        Sunrise: string;
        Sunset: string;
      }

      interface DayDataObj {
        date: Date;
        meta: Meta;
        timings: Timings;
      }

      // API calling:
      const response = await axios.get(endpoint), // Todo, Type Annotation
        res: DayDataObj[] = response.data.data;

      // HANDLING WITH DATE:
      const gregorian: Gregorian = res[day].date.gregorian,
        gFullDateNo: string = gregorian.date,
        gYear: string = gregorian.year,
        gMonth: string = gregorian.month.en,
        gDay: string = gregorian.weekday.en,
        gDayNo: string = gregorian.day;

      const hijri: Hijri = res[day].date.hijri,
        hFullDateNo: string = hijri.date,
        hYear: string = hijri.year,
        hMonth: string = hijri.month.en,
        hDay: string = hijri.weekday.en,
        hDayNo: string = hijri.day;

      (document.getElementById("Gregorian") as HTMLDivElement).innerHTML = `
      <h2 class="title-font">Gregorian</h2>
      <h5 class="secondary-font mt-4">${gFullDateNo}</h5>
      <h5 class="secondary-font mt-1">${gDay}  ${gDayNo} ${gMonth}  ${gYear}</h5>
      `;

      (document.getElementById("Hijri") as HTMLDivElement).innerHTML = `
      <h2 class="title-font">Hijri</h2>
      <h5 class="secondary-font mt-4">${hFullDateNo}</h5>
      <h5 class="secondary-font mt-1">${hDay}  ${hDayNo} ${hMonth}  ${hYear}</h5>
      `;

      // HANDLING WITH TODAY'S TIMINGS:
      const timings: Timings = res[day].timings,
        fajr: string = to12Format(timings.Fajr.slice(0, 5)),
        sunrise: string = to12Format(timings.Sunrise.slice(0, 5)),
        dhuhr: string = to12Format(timings.Dhuhr.slice(0, 5)),
        asr: string = to12Format(timings.Asr.slice(0, 5)),
        maghrib: string = to12Format(timings.Maghrib.slice(0, 5)),
        isha: string = to12Format(timings.Isha.slice(0, 5));

      (document.getElementById("f") as HTMLDivElement).innerHTML = `
      <h4 class="secondary-font mb-0">${fajr}</h4>
      `;
      (document.getElementById("s") as HTMLDivElement).innerHTML = `
      <h4 class="secondary-font mb-0">${sunrise}</h4>
      `;
      (document.getElementById("d") as HTMLDivElement).innerHTML = `
      <h4 class="secondary-font mb-0">${dhuhr}</h4>
      `;
      (document.getElementById("a") as HTMLDivElement).innerHTML = `
      <h4 class="secondary-font mb-0">${asr}</h4>
      `;
      (document.getElementById("m") as HTMLDivElement).innerHTML = `
      <h4 class="secondary-font mb-0">${maghrib}</h4>
      `;
      (document.getElementById("i") as HTMLDivElement).innerHTML = `
      <h4 class="secondary-font mb-0">${isha}</h4>
      `;

      // HANDLING WITH DAYS OF MONTH TIMINGS:
      (document.getElementById("month-table") as HTMLTableElement).innerHTML = `
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
      const tableBody = document.getElementById(
        "tbody"
      ) as HTMLTableSectionElement;
      tableBody.innerHTML = "";

      res.forEach((obj: DayDataObj) => {
        const Day = obj.date.gregorian.weekday.en.slice(0, 3),
          date = obj.date.readable.slice(0, 6),
          Fajr = to12Format(obj.timings.Fajr.slice(0, 5)),
          Sunrise = to12Format(obj.timings.Sunrise.slice(0, 5)),
          Dhuhr = to12Format(obj.timings.Dhuhr.slice(0, 5)),
          Asr = to12Format(obj.timings.Asr.slice(0, 5)),
          Maghrib = to12Format(obj.timings.Maghrib.slice(0, 5)),
          Isha = to12Format(obj.timings.Isha.slice(0, 5));

        const todayMark =
          date.match(/\d+/)![0] === `${new Date().getDate()}`
            ? "today-mark"
            : "";

        if (screen.width >= 768) {
          tableBody.innerHTML += `<tr class="${todayMark}"> <th scope="row">${Day} ${date}</th> <td>${Fajr}</td> <td>${Sunrise}</td> <td>${Dhuhr}</td> <td>${Asr}</td> <td>${Maghrib}</td> <td>${Isha}</td> </tr>`;
        } else {
          tableBody.innerHTML += `<tr class="${todayMark}"> <th scope="row">${Day} <br/> ${date}</th> <td>${Fajr}</td> <td>${Sunrise}</td> <td>${Dhuhr}</td> <td>${Asr}</td> <td>${Maghrib}</td> <td>${Isha}</td> </tr>`;
        }
      });
    } catch (err) {
      // Todo, 'err' is of type 'unknown'
      alert(err.message);
      throw new Error(`${err.code},\n${err.message}`);
    }
  }

  callAPI();
}

// Function to convert the time from 24 to 12 format:
function to12Format(numberString: string): string {
  const pattern: RegExp = /^\d{1,2}(?=\:)/,
    zeroMatch: RegExp = /^0{1}(?=\d\:)/;

  if (screen.width >= 768) {
    switch (pattern.exec(numberString)![0]) {
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
    switch (pattern.exec(numberString)![0]) {
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
    const country: string = localStorage.getItem("Country")!,
      city: string = localStorage.getItem("City")!,
      method: string = localStorage.getItem("Method")!;

    countryElement.value = country;
    dataCity();
    cityElement.value = city;
    methodElement.value = method;

    getDataFromAPI(country, city, +method);
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
(
  document.getElementById("Copyright") as HTMLSpanElement
).innerHTML = `${new Date().getFullYear()}`;
