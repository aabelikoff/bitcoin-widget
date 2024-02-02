const BITCOIN_HISTORY = [];

const colors = {
  USD: "green",
  EUR: "gold",
  GBP: "red",
};

function createBitcoinChart(container) {
  const bitcoinChart = document.createElement("canvas");
  bitcoinChart.id = "bitcoin-chart";
  bitcoinChart.setAttribute("draggable", "true");

  container.append(bitcoinChart);
}

function updateHistory(ratesObj) {
  if (BITCOIN_HISTORY.length <= 200) {
    BITCOIN_HISTORY.push(ratesObj);
    return;
  }
  BITCOIN_HISTORY.shift();
  BITCOIN_HISTORY.push(ratesObj);
}

function drawChartLine(key, color) {
  const fig = document.getElementById("bitcoin-chart");
  if (!fig) return;
  let dc = fig.getContext("2d");
  dc.font = `italic small-caps 12px Arial ${color}`;
  dc.strokeLine = color;
  dc.lineWidth = "2";
  const scale = 150 / 50000;
  let xCoord = 0;
  let yCoord = null;
  BITCOIN_HISTORY.forEach((ratesObj, index) => {
    yCoord = 150 - Math.round(ratesObj[key].rate_float * scale);
    if (!index) {
      dc.moveTo(xCoord, yCoord);
      dc.fillText(key, xCoord + 10, yCoord - 5);
    }
    xCoord++;
    dc.lineTo(xCoord, yCoord);
  });
  dc.stroke();
}

function drawChart(colorsObj) {
  let rateItemElems = document.querySelectorAll(".rate");
  [...rateItemElems].forEach((rateItem) => {
    let key = rateItem.dataset.currencyType;
    drawChartLine(key, colorsObj[key]);
  });
}

createBitcoinChart(containerElem);
