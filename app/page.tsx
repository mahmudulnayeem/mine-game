"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FIELDS_SIZE } from "~~/lib/constants";

import { cn } from "~~/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~~/components/ui/dialog";

export default function Home() {
  const [gameOver, setGameOver] = useState(false);
  const [isGameClear, setIsGameClear] = useState(false);
  /**
   * The fields state is an array of objects that represent the game fields.
   * Each field object has the following properties:
   * 1. isOpen: A boolean that indicates whether the field is open or not
   * 2. isMine: A boolean that indicates whether the field is a mine or not
   * 3. isFlag: A boolean that indicates whether the field is flagged or not
   * 4. answerByUser: A boolean that indicates whether the field is answered by the user or not
   
   */
  const [fields, setFields] = useState(
    Array.from({ length: FIELDS_SIZE * FIELDS_SIZE }).map(() => ({
      isOpen: false,
      isMine: false,
      isFlag: false,
      answerByUser: false,
    }))
  );

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
  const handleClicked = (index: number) => {
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
      const explosion = new Audio("./explosion.mpeg");
      explosion.play();
      setGameOver(true);

      setFields((prevFields) =>
        prevFields.map((field) => ({
          ...field,
          isOpen: true,
        }))
      );
      return;
    }

    setFields(newFields);

    // check is game clear
    if (newFields.every((field) => field.isOpen || field.isMine)) {
      setIsGameClear(true);
    }
  };

  /**
   * The init function is responsible for initializing the game.
   * 1. Create a set of mines
   * 2. Add random numbers to the set until the set size is equal to the number of fields in the game
   * 3. Set the fields with the mines in the random positions created in step 2
   * 4. Mine are equal to the number of fields in the game
   * @example
   * FIELDS_SIZE = 4
   * mines = [1, 3, 5, 7]
   */

  const init = () => {
    const mines = new Set<number>();

    while (mines.size < FIELDS_SIZE) {
      mines.add(Math.floor(Math.random() * (FIELDS_SIZE * FIELDS_SIZE)));
    }

    setFields((prevFields) =>
      prevFields.map((field, index) => ({
        ...field,
        isMine: mines.has(index),
      }))
    );
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 sm:p-24 p-4">
      <div className="w-full">
        <h1 className="text-4xl font-bold text-center">Mine</h1>
        <p className="text-center">Find diamond</p>
      </div>

      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${FIELDS_SIZE}, 1fr)`,
        }}
      >
        {fields.map((field, index) => (
          <button
            key={index}
            className={cn(
              "w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md",

              field.isOpen && field.isMine
                ? "bg-red-500/20"
                : field.answerByUser && "bg-green-500/20",
              (gameOver || isGameClear) && "cursor-not-allowed"
            )}
            onClick={() => handleClicked(index)}
          >
            {field.isOpen ? (
              field.isMine ? (
                <Image src="/bomb.svg" alt="bomb" width={40} height={40} />
              ) : (
                <Image src="/gem.svg" alt="gem" width={40} height={40} />
              )
            ) : (
              ""
            )}
          </button>
        ))}
      </div>
      {(isGameClear || gameOver) && (
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
                  setGameOver(false);
                  setIsGameClear(false);
                  setFields(
                    Array.from({ length: FIELDS_SIZE * FIELDS_SIZE }).map(
                      () => ({
                        isOpen: false,
                        isMine: false,
                        isFlag: false,
                        answerByUser: false,
                      })
                    )
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
