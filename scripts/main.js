const containerElem = document.querySelector(".container");
let timerId = null;

window.addEventListener("load", (e) => {
  createBitcoinWidget(containerElem);

  timerId = setTimeout(function bitcoinWidgetHandler() {
    updateRates();
    timerId = setTimeout(bitcoinWidgetHandler, 2000);
  }, 2000);
});
