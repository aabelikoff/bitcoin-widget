const BITCOIN_URL = "https://api.coindesk.com/v1/bpi/currentprice.json";

function updateRates() {
  const request = new XMLHttpRequest();
  request.open("GET", BITCOIN_URL);
  request.responseType = "json";
  request.send();
  request.onload = () => {
    if (request.status == 200) {
      renderBitcoinWidget(request.response);
    }
  };
}

function createBitcoinWidget(container) {
  container.style.position = "relative";
  const bitcoinWidget = document.createElement("div");
  bitcoinWidget.id = "bitcoin-rates";
  bitcoinWidget.setAttribute("draggable", "true");
  bitcoinWidget.innerHTML = `
    <h4 class="title">Bitcoin rates:</h4>
    <p class="date"></p>
    <div class="rates">
      <p class="rate-item"><span class="currency" >USD</span> : <span class="rate" data-currency-type='USD'></span></p>
      <p class="rate-item"><span class="currency" >GBP</span> : <span class="rate" data-currency-type='GBP'></span></p>
      <p class="rate-item"><span class="currency" >EUR</span> : <span class="rate" data-currency-type='EUR'></span></p>
    </div>`;

  bitcoinWidget.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/html", event.target.id);
    event.dataTransfer.setData("cursorX", event.clientX - event.target.getBoundingClientRect().left);
    event.dataTransfer.setData("cursorY", event.clientY - event.target.getBoundingClientRect().top);
    event.dataTransfer.effectAllowed = "move";
  });

  container.addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  container.addEventListener("drop", function (event) {
    event.preventDefault();
    const offsetX = event.clientX - container.getBoundingClientRect().left;
    const offsetY = event.clientY - container.getBoundingClientRect().top;
    const cursorX = event.dataTransfer.getData("cursorX");
    const cursorY = event.dataTransfer.getData("cursorY");

    bitcoinWidget.style.left = offsetX - cursorX + "px";
    bitcoinWidget.style.top = offsetY - cursorY + "px";
  });

  container.append(bitcoinWidget);
}

function renderBitcoinWidget({ bpi, time: { updated } }) {
  const widgetElem = document.getElementById("bitcoin-rates");
  widgetElem.querySelector(".date").innerHTML = updated;

  for (let key in bpi) {
    let { code, rate_float: rate } = bpi[key];
    let spanRateElem = widgetElem.querySelector(`[data-currency-type=${code}]`);
    const formatter = new Intl.NumberFormat("ua");
    spanRateElem.innerText = formatter.format(rate);
  }
}
