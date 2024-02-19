let solorMonthValue = "";

const calendar = document.getElementById("calendar");
const solarMonth = document.getElementById("solar-month");
const hijriMonth = document.getElementById("hijri-month");
const calenderMonth = document.getElementById("calendar-month");
const calendarHijriMonth = document.getElementById("calendar-hijri-month");
//initial array to store 1 year data
let currentYearData = [];

// Api Endpiont
let endpoint =
  "https://masjid.connextar.com/?rest_route=/dpt/v1/prayertime&filter=year";

function gregorianToHijri(dateObject) {
  // Check if the input is a Date object
  if (!(dateObject instanceof Date)) {
    throw new Error("Input should be a Date object.");
  }

  // Convert the Date object to a string in the format "YYYY-MM-DD"
  const gregorianDate = dateObject.toISOString().split("T")[0];

  const gregorianParts = gregorianDate.split("-");
  const gregorianYear = parseInt(gregorianParts[0], 10);
  const gregorianMonth = parseInt(gregorianParts[1], 10) - 1; // Months are 0-based
  const gregorianDay = parseInt(gregorianParts[2], 10);

  const hijriFormatter = new Intl.DateTimeFormat("en-u-ca-islamic", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hijriDateString = hijriFormatter.format(
    new Date(gregorianYear, gregorianMonth, gregorianDay)
  );

  // Extract the Hijri month name and numeric representation from the formatted string
  const [hijriMonth, hijriDay, hijriYear] = hijriDateString.split(" ");

  return {
    hijriDate: `${hijriMonth} ${hijriDay}, ${hijriYear}`,
    hijriMonthName: hijriMonth,
    hijriMonthNumber: parseInt(hijriDay, 10),
  };
}

// Request to the Api
fetch(endpoint)
  .then((response) => {
    // Check if the response is successful (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the JSON response
    return response.json();
  })
  .then((data) => {
    console.log("Result Data: ", data);
    currentYearData = data[0];
    console.log("Current year data: ", currentYearData);

    const firstMonthData = currentYearData.filter((date) =>
      date.d_date.startsWith("2024-01-")
    );

    console.log("One month filter data: ", firstMonthData);

    const calendarData = firstMonthData.map((date) => {
      const dateObject = new Date(date.d_date);
      console.log("Date object: ", dateObject);
      const dayName = dateObject.toLocaleDateString("en-US", {
        weekday: "short",
      });

      const hijriDate = gregorianToHijri(dateObject);
      console.log("Hijri date: ", hijriDate);

      const dayMatch = hijriDate.hijriDate.match(/\b\d+\b/);

      const hijriDay = dayMatch ? dayMatch[0] : null;

      return `<div class="flex items-center border-b bg-white border-[#7cc5e8] text-[14px] ${
        dayName == "Mon" ? "bg-[#a4d7f3]" : ""
      } ${dayName === "Fri" ? "font-semibold" : ""}">

<div class="w-[47px] text-center py-1 border-r border-[#7cc5e8]">${date.d_date.slice(
        -2
      )}</div>
<div class=" w-[41px] text-center py-1 border-r border-[#7cc5e8]">${dayName}</div>
<div class=" w-[44px] text-center py-1 border-r border-[#7cc5e8]">${hijriDay}</div>
<div class="w-[72px] text-center py-1 border-r border-[#7cc5e8]">${date.fajr_begins.slice(
        0,
        5
      )}</div>
<div class="w-[75px] text-center py-1 border-r border-[#7cc5e8]">${date.fajr_jamah.slice(
        0,
        5
      )}</div>
<div class="w-[72px] text-center py-1 border-r border-[#7cc5e8]">${date.sunrise.slice(
        0,
        5
      )}</div>
<div class="w-[72px] text-center py-1 border-r border-[#7cc5e8]">${date.zuhr_begins.slice(
        0,
        5
      )}</div>
<div class="w-[83px] text-center py-1 border-r border-[#7cc5e8]">${date.zuhr_jamah.slice(
        0,
        5
      )}</div>
<div class="w-[71px] text-center py-1 border-r border-[#7cc5e8]">${date.asr_mithl_1.slice(
        0,
        5
      )}</div>
<div class="w-[76px] text-center py-1 border-r border-[#7cc5e8]">${date.asr_jamah.slice(
        0,
        5
      )}
      </div>
<div class="w-[79px] text-center py-1 border-r border-[#7cc5e8]">${date.maghrib_jamah.slice(
        0,
        5
      )}
      </div>
<div class="px-[22px] w-[72px] text-center py-1 border-r border-[#7cc5e8]">${date.isha_begins.slice(
        0,
        5
      )}
      </div>
<div class="w-[71px] text-center ">${date.isha_jamah.slice(0, 5)}
      </div>
</div>`;
    });

    const firstDate = new Date(firstMonthData[0].d_date);
    const lastDate = new Date(firstMonthData[firstMonthData.length - 1].d_date);
    const firstHijriDate = gregorianToHijri(firstDate);
    const lastHijriDate = gregorianToHijri(lastDate);
    const hijriFirstMonth = firstHijriDate.hijriDate.replace(/[\d,]/g, "");
    const hijriLastMonth = lastHijriDate.hijriDate.replace(/[\d,]/g, "");
    const hijriYear = lastHijriDate.hijriDate.match(/(\d{4})/);
    // Extract the Islamic year from the match
    const islamicYear = hijriYear ? hijriYear[0] : null;
    console.log("Islamic year: ", islamicYear);

    const defaultValue = "2024-01";
    solarMonth.value = defaultValue;
    hijriMonth.innerHTML = `${hijriFirstMonth}-${hijriLastMonth} AH ${islamicYear}`;
    calenderMonth.innerHTML = "January";
    calendarHijriMonth.innerHTML = `${hijriFirstMonth}-${hijriLastMonth}`;
    const calendarString = calendarData.join("");
    calendar.innerHTML = calendarString;
  });

function dynamicMonth(inputId) {
  const monthInput = document.getElementById(inputId);

  const dynamicMonthData = currentYearData.filter(date => date.d_date.startsWith(`${monthInput.value}-`))
  console.log(dynamicMonthData)
  console.log(monthInput.value)

  const calendarData = dynamicMonthData.map((date) => {
    const dateObject = new Date(date.d_date);
    console.log("Date object: ", dateObject);
    const dayName = dateObject.toLocaleDateString("en-US", {
      weekday: "short",
    });

    const hijriDate = gregorianToHijri(dateObject);
    console.log("Hijri date: ", hijriDate);

    const dayMatch = hijriDate.hijriDate.match(/\b\d+\b/);

    const hijriDay = dayMatch ? dayMatch[0] : null;

    return `<div class="flex items-center border-b bg-white border-[#7cc5e8] text-[14px] ${
      dayName == "Mon" ? "bg-[#a4d7f3]" : ""
    } ${dayName === "Fri" ? "font-semibold" : ""}">

<div class="px-[15px] w-[46px] text-center py-1 border-r border-[#7cc5e8]">${date.d_date.slice(
      -2
    )}</div>
<div class=" w-[41.7px] text-center py-1 border-r border-[#7cc5e8]">${dayName}</div>
<div class=" w-[49px] text-center py-1 border-r border-[#7cc5e8]">${hijriDay}</div>
<div class="w-[70px] text-center py-1 border-r border-[#7cc5e8]">${date.fajr_begins.slice(
      0,
      5
    )}</div>
<div class="w-[77px] text-center py-1 border-r border-[#7cc5e8]">${date.fajr_jamah.slice(
      0,
      5
    )}</div>
<div class="w-[72px] text-center py-1 border-r border-[#7cc5e8]">${date.sunrise.slice(
      0,
      5
    )}</div>
<div class="w-[72px] text-center py-1 border-r border-[#7cc5e8]">${date.zuhr_begins.slice(
      0,
      5
    )}</div>
<div class="w-[83px] text-center py-1 border-r border-[#7cc5e8]">${date.zuhr_jamah.slice(
      0,
      5
    )}</div>
<div class="w-[72px] text-center py-1 border-r border-[#7cc5e8]">${date.asr_mithl_1.slice(
      0,
      5
    )}</div>
<div class="w-[75px] text-center py-1 border-r border-[#7cc5e8]">${date.asr_jamah.slice(
      0,
      5
    )}
    </div>
<div class="w-[80px] text-center py-1 border-r border-[#7cc5e8]">${date.maghrib_jamah.slice(
      0,
      5
    )}
    </div>
<div class="px-[22px] w-[71px] text-center py-1 border-r border-[#7cc5e8]">${date.isha_begins.slice(
      0,
      5
    )}
    </div>
<div class="w-[71px] text-center ">${date.isha_jamah.slice(0, 5)}
    </div>
</div>`;
  });

  const firstDate = new Date(dynamicMonthData[0].d_date);
  const lastDate = new Date(dynamicMonthData[dynamicMonthData.length - 1].d_date);
  const firstHijriDate = gregorianToHijri(firstDate);
  const lastHijriDate = gregorianToHijri(lastDate);
  const hijriFirstMonth = firstHijriDate.hijriDate.replace(/[\d,]/g, "");
  const hijriLastMonth = lastHijriDate.hijriDate.replace(/[\d,]/g, "");
  const hijriYear = firstHijriDate.hijriDate.match(/(\d{4})/);
  // Extract the Islamic year from the match
  const islamicYear = hijriYear ? hijriYear[0] : null;
  console.log("Islamic year: ", islamicYear);

  const monthNumberToName = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  console.log(parseInt(monthInput.value, 10).toString())

  const defaultValue = monthNumberToName[parseInt(monthInput.value.split("-")[1], 10)];
  console.log("Month: ", defaultValue)
  hijriMonth.innerHTML = `${hijriFirstMonth}-${hijriLastMonth} AH ${islamicYear}`;
  calenderMonth.innerHTML = defaultValue;
  calendarHijriMonth.innerHTML = `${hijriFirstMonth}-${hijriLastMonth}`;
  const calendarString = calendarData.join("");
  calendar.innerHTML = calendarString;
}
