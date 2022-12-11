export const htmlInitialize = () => {
  document.querySelector(".coins-container").style.display = "block";
};

export const htmlUpdate = (coins) => {
  document.querySelector(".coins-count").innerHTML = `${coins}`;
};
