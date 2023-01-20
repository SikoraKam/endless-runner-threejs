const statisticsContainer = document.querySelector(".statistics-container");
const coinsCount = document.querySelector(".coins-count");
const lifePercent = document.querySelector(".life-percent");

export const htmlInitialize = () => {
  statisticsContainer.style.display = "flex";
};

export const htmlUpdate = (coins, lifes) => {
  coinsCount.innerHTML = `${coins}`;
  lifePercent.innerHTML = `${lifes * 25}%`;

  if (lifes < 3) lifePercent.classList.add("red");
};
