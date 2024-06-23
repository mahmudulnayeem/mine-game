"use client";
import Image from "next/image";
import { useLayoutEffect, useState } from "react";

import { cn } from "~~/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~~/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~~/components/ui/popover";

import { Label } from "~~/components/ui/label";

import { sendGAEvent } from "@next/third-parties/google";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~~/components/ui/select";
import { Slider } from "~~/components/ui/slider";

import { RefreshCcw, Volume, Volume1, Volume2, VolumeX } from "lucide-react";

export default function Home() {
  const [volume, setVolume] = useState<number[]>([50]);
  const [gameOver, setGameOver] = useState(false);
  const [isGameWin, setIsGameWin] = useState(false);
  const [size, setSize] = useState(4);

  const sound = volume[0] > 0;
  /**
   * The fields state is an array of objects that represent the game fields.
   * Each field object has the following properties:
   * 1. isOpen: A boolean that indicates whether the field is open or not
   * 2. isMine: A boolean that indicates whether the field is a mine or not
   * 3. isFlag: A boolean that indicates whether the field is flagged or not
   * 4. answerByUser: A boolean that indicates whether the field is answered by the user or not
   
   */
  const [fields, setFields] = useState(
    Array.from({ length: size * size }).map(() => ({
      isOpen: false,
      isMine: false,
      isFlag: false,
      answerByUser: false,
    }))
  );

  function gameWin(
    fields: Array<{ isOpen: boolean; isMine: boolean; isFlag: boolean }>
  ) {
    const flags = fields.filter(
      (field) => field.isOpen && !field.isMine && field.isFlag
    );
    if (flags.length !== size) return;

    if (fields.every((field) => field.isOpen || field.isMine)) {
      if (sound) {
        const WinSound = new Audio("./win.wav");
        WinSound.volume = volume[0] / 100;
        WinSound.play();
      }
      setIsGameWin(true);
    }
  }

  /**
   *
   * @param index
   * @returns
   * 1. If the game is over, return immediately
   * 2. Create a new array of fields
   * 3. Set the field at the index to open and answered by the user
   * 4. If the field is a mine, set the game over state to true, set all fields to open, and return
   * 5. Set the fields with the new fields
   * 6. If all fields are open or all fields are mines, set the game clear state to true
   *
   */
  const handleClicked = (index: number, fieldType: "diamond" | "flag") => {
    if (gameOver) return;

    const newFields = [...fields];
    newFields[index].isOpen = true;
    newFields[index].answerByUser = true;

    // check if the field is a mine or not
    /**
     * If the field is a mine, the game is over.
     * 1. Set the game over state to true
     * 2. Set all fields to open
     * 3. Return
     */
    if (newFields[index].isMine) {
      if (sound) {
        const explosion = new Audio("./explosion.mpeg");
        explosion.volume = volume[0] / 100;
        explosion.play();
      }
      // set timeout for the sound
      setTimeout(() => {
        if (sound) {
          const gameOverSound = new Audio("./game-over.wav");
          gameOverSound.volume = volume[0] / 100;
          gameOverSound.play();
        }
      }, 1000);

      setGameOver(true);

      setFields((prevFields) =>
        prevFields.map((field) => ({
          ...field,
          isOpen: true,
        }))
      );
      return;
    }

    if (fieldType === "flag") {
      newFields[index].isFlag = true;
      newFields[index].isMine = false;
    } else {
      newFields[index].isFlag = false;
      if (sound) {
        const ClickSound = new Audio("./click.wav");
        ClickSound.volume = volume[0] / 100;
        ClickSound.play();
      }
    }
    setFields(newFields);

    gameWin(newFields);
  };

  /**
   * The init function is responsible for initializing the game.
   * 1. Create a set of mines
   * 2. Add random numbers to the set until the set size is equal to the number of fields in the game
   * 3. Set the fields with the mines in the random positions created in step 2
   * 4. Mine are equal to the number of fields in the game
   * @example
   * size = 4
   * mines = [1, 3, 5, 7]
   */

  const init = () => {
    const mines = new Set<number>();

    while (mines.size < size) {
      mines.add(Math.floor(Math.random() * (size * size)));
    }

    setFields((prevFields) =>
      prevFields.map((field, index) => ({
        ...field,
        isMine: mines.has(index),
      }))
    );
  };

  useLayoutEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 sm:p-24 p-4">
      <div className="w-full flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-center">Mine</h1>

        <p className="text-center">Find diamond</p>

        <div className="w-full sm:w-4/12 flex items-center gap-3">
          <Slider
            value={volume}
            onValueChange={(e) => {
              setVolume(e);
            }}
          />
          <span>{volume[0]}</span>
          <button
            onClick={() => {
              setVolume((prev) => (prev[0] > 0 ? [0] : [50]));
            }}
          >
            {sound ? (
              volume[0] <= 33 ? (
                <Volume size={24} />
              ) : volume[0] <= 66 ? (
                <Volume1 size={24} />
              ) : (
                <Volume2 size={24} />
              )
            ) : (
              <VolumeX size={24} />
            )}
          </button>
        </div>
        <div className="flex items-end gap-5 w-full sm:w-72">
          <div className="sm:w-72 w-full">
            <Label>Size of game field</Label>
            <Select
              value={size.toString()}
              onValueChange={(e) => {
                setSize(parseInt(e));
                setFields(
                  Array.from({ length: parseInt(e) * parseInt(e) }).map(() => ({
                    isOpen: false,
                    isMine: false,
                    isFlag: false,
                    answerByUser: false,
                  }))
                );
                init();
              }}
            >
              <SelectTrigger className="sm:w-72 w-full">
                <SelectValue placeholder="Select size of game field" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sizes</SelectLabel>
                  <SelectItem value="2">Two (2 X 2)</SelectItem>
                  <SelectItem value="3">Three (3 X 3)</SelectItem>
                  <SelectItem value="4">Four (4 X 4)</SelectItem>
                  <SelectItem value="5">Five (5 X 5)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={() => {
              setGameOver(false);
              setIsGameWin(false);
              setFields(
                Array.from({ length: size * size }).map(() => ({
                  isOpen: false,
                  isMine: false,
                  isFlag: false,
                  answerByUser: false,
                }))
              );
              init();
            }}
            className="pb-3"
          >
            <RefreshCcw className="size-6" />
          </button>
        </div>
      </div>

      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
        }}
      >
        {fields.map((field, index) => (
          <Popover key={index}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 flex items-center justify-center rounded-md",
                  field.isOpen && field.answerByUser && "bg-green-500/20",
                  field.isOpen && field.isMine && "bg-red-500/20",
                  field.isOpen && field.isFlag && "bg-yellow-500/20",
                  (gameOver || isGameWin) && "cursor-not-allowed"
                )}
              >
                {field.isOpen ? (
                  field.isMine ? (
                    <Image src="/bomb.svg" alt="bomb" width={40} height={40} />
                  ) : field.isFlag ? (
                    <Image src="/flag.svg" alt="gem" width={40} height={40} />
                  ) : (
                    <Image src="/gem.svg" alt="gem" width={40} height={40} />
                  )
                ) : (
                  ""
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="flex justify-between w-full gap-5">
              <button
                className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 flex items-center justify-center rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClicked(index, "flag");
                }}
              >
                <Image src="/flag.svg" alt="flag" width={40} height={40} />
              </button>

              <button
                className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 flex items-center justify-center rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClicked(index, "diamond");
                }}
              >
                <Image src="/gem.svg" alt="diamond" width={40} height={40} />
              </button>
            </PopoverContent>
          </Popover>
        ))}
      </div>

      {isGameWin && (
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Congratulations! You have found all the diamond!
              </DialogTitle>
              <DialogDescription>
                Thank you for playing the game! Hope you enjoyed it!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  sendGAEvent({
                    event: "RestartWhenGameOver",
                    value: "Restart when game is over",
                  });
                  setGameOver(false);
                  setIsGameWin(false);
                  setFields(
                    Array.from({ length: size * size }).map(() => ({
                      isOpen: false,
                      isMine: false,
                      isFlag: false,
                      answerByUser: false,
                    }))
                  );
                  init();
                }}
              >
                Restart
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {gameOver && (
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Game over</DialogTitle>
              <DialogDescription>
                Thank you for playing the game! Hope you enjoyed it!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  sendGAEvent({
                    event: "RestartWhenGameWin",
                    value: "Restart when game win",
                  });
                  setGameOver(false);
                  setIsGameWin(false);
                  setFields(
                    Array.from({ length: size * size }).map(() => ({
                      isOpen: false,
                      isMine: false,
                      isFlag: false,
                      answerByUser: false,
                    }))
                  );
                  init();
                }}
              >
                Restart
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
