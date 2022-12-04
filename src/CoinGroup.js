import { Coin } from "./models/Coin";
import {
  COIN_GROUP_POSITION_Z,
  COIN_SCALE,
  DISTANCE_BETWEEN_COINS,
  DISTANCE_BETWEEN_TRACKS,
} from "./const";
import { Group } from "three";

export class CoinGroup {
  coin = new Coin();
  coinsArray = [];
  visibleCoinsGroup = new Group();

  async load() {
    await this.coin.load();
    this.visibleCoinsGroup = this.createCoinGroup();
  }

  getCoinOnRandomTrack() {
    const isCoinOnTrack = [false, false, false];
    isCoinOnTrack.forEach((elem, index) => {
      const random = Math.floor(Math.random() * 2);
      isCoinOnTrack[index] = !random;
    });
    return isCoinOnTrack;
  }

  createCoinGroup() {
    const randomCoinAmountOnTrack = Math.floor(Math.random() * 5 + 3);
    const tracksWithCoins = this.getCoinOnRandomTrack();
    const coinsGroup = new Group();

    for (let i = 0; i < randomCoinAmountOnTrack; i++) {
      tracksWithCoins.forEach((isCoinOnTrack, trackIndex) => {
        if (!isCoinOnTrack) return;
        const coin = this.coin.getCoin();
        coin.position.set(
          -DISTANCE_BETWEEN_TRACKS + DISTANCE_BETWEEN_TRACKS * trackIndex,
          -12,
          -i * DISTANCE_BETWEEN_COINS
        );
        coinsGroup.add(coin);
      });
    }

    coinsGroup.position.set(0, -17, COIN_GROUP_POSITION_Z);
    coinsGroup.visible = true;
    return coinsGroup;
  }

  spawnCoins(delta, speed) {
    const gameScene = this.visibleCoinsGroup.parent;
    this.visibleCoinsGroup.position.z += speed * delta;

    if (this.visibleCoinsGroup.position.z > 50) {
      this.visibleCoinsGroup.removeFromParent();
      this.visibleCoinsGroup = this.createCoinGroup();
      gameScene.add(this.visibleCoinsGroup);
    }
  }
}
