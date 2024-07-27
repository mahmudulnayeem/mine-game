"use client";

import { useState } from "react";
import { cn } from "~~/lib/utils";

const gridItems = [1, 2, 3, 4, null, 6, 7, 8, 9];

const GridLights = () => {
  const [activeItems, setActiveItems] = useState<Array<number>>([]);

  const removeItemsFromArray = () => {
    const timer = setInterval(() => {
      setActiveItems((previousItems) => {
        const newItems = [...previousItems].slice(0, -1);
        if (newItems.length === 0) {
          clearInterval(timer);
        }
        return newItems;
      });
    }, 500);
  };

  return (
    <div className="flex min-h-[95vh] flex-col items-center gap-10 sm:p-24 p-4">
      <div className="w-full flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-center">Grid lights</h1>
        <div className="grid grid-cols-3 gap-1">
          {gridItems.map((item, index) => {
            if (item)
              return (
                <button
                  key={index}
                  disabled={activeItems.includes(index)}
                  onClick={() => {
                    setActiveItems((previous) => [...previous, index]);
                    if (
                      activeItems.length ===
                      gridItems.filter(Boolean).length - 1
                    ) {
                      removeItemsFromArray();
                    }
                  }}
                  className={cn(
                    "size-40 border-2",
                    activeItems.includes(index) ? "bg-green-500" : "bg-white"
                  )}
                >
                  {item}
                </button>
              );
            else return <div key={index}></div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default GridLights;
