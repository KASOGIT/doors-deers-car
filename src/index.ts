import { Command, flags } from "@oclif/command";

interface WinRes {
  firstChoice: number;
  firstChoiceWinRate: number;
  secondChoice: number;
  secondChoiceWinRate: number;
}

class DoorsDeersCar extends Command {
  static description = "Run x games of doors deers car and display props";
  static DOOR_NUMBER = 3;

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    iteration: flags.integer({
      char: "i",
      description: "number of games to play",
    }),
  };

  async run() {
    const { flags } = this.parse(DoorsDeersCar);

    const iteration = flags.iteration ?? 1;
    this.log(`Gonna run ${iteration} of the game`);

    const winRes = this.game(iteration);
    this.log("DoorsDeersCar ->", winRes);
  }

  game(iteration: number): WinRes {
    let win: WinRes = {
      firstChoice: 0,
      firstChoiceWinRate: 0,
      secondChoice: 0,
      secondChoiceWinRate: 0,
    };
    let doors = [];
    let playerFirstChoice: number;
    let playerSecondChoice: number;
    let presenterChoice: number;

    const nbTry = iteration;

    while (iteration--) {
      doors = this.getFilledDoors();
      playerFirstChoice = this.getRandomDoor();

      let leftDeersIdx: number[] = [];
      for (const [idx, door] of doors.entries()) {
        if (idx !== playerFirstChoice && door === false) {
          leftDeersIdx.push(idx);
        }
      }

      const randChoice = this.getRandomNumber(leftDeersIdx.length);
      presenterChoice = leftDeersIdx[randChoice];

      playerSecondChoice = doors.findIndex(
        (door, idx) => idx !== playerFirstChoice && idx !== presenterChoice
      );

      if (doors[playerFirstChoice]) {
        win.firstChoice++;
      } else if (doors[playerSecondChoice]) {
        win.secondChoice++;
      }
    }

    win.firstChoiceWinRate = parseFloat(
      ((win.firstChoice / nbTry) * 100).toFixed(1)
    );
    win.secondChoiceWinRate = parseFloat(
      ((win.secondChoice / nbTry) * 100).toFixed(1)
    );

    return win;
  }

  getFilledDoors() {
    let doors = Array(DoorsDeersCar.DOOR_NUMBER).fill(false);
    const carIdx = this.getRandomDoor();
    doors[carIdx] = true;

    return doors;
  }

  getRandomDoor(): number {
    return this.getRandomNumber(DoorsDeersCar.DOOR_NUMBER);
  }

  getRandomNumber(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }
}

export = DoorsDeersCar;
