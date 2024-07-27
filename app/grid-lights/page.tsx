"use client";

import { useState } from "react";
import { cn } from "~~/lib/utils";
import { Settings } from "./_components/settings";

export type ConfigType = {
  gridItems: Array<number | null>;
  activeColor: string;
  clearTimeInterval: number;
  withSelectOrder?: boolean;
};
const gridItems = [1, 2, 3, 4, null, 6, 7, 8, 9];

const defaultConfig: ConfigType = {
  gridItems: gridItems,
  activeColor: "#00FF00",
  withSelectOrder: false,
  clearTimeInterval: 500,
};
const GridLights = () => {
  const [activeItems, setActiveItems] = useState<Array<number>>([]);
  const [deActivating, setDeActivating] = useState(false);
  const [config, setConfig] = useState<ConfigType>(defaultConfig);

  const startDeActivating = () => {
    setDeActivating(true);
    const timer = setInterval(() => {
      setActiveItems((previousItems) => {
        const newItems = [...previousItems].slice(0, -1);
        if (newItems.length === 0) {
          clearInterval(timer);
          setDeActivating(false);
        }

        return newItems;
      });
    }, config.clearTimeInterval);
  };

  return (
    <div className="flex h-[90vh] flex-col items-center gap-10 sm:p-24 p-4">
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex  items-center ">
          <h1 className="text-4xl font-bold text-center">Grid lights</h1>
          <Settings
            config={config}
            setConfig={setConfig}
            defaultConfig={defaultConfig}
            isDisabled={deActivating || activeItems.length > 0}
          />
        </div>
        <div className="grid grid-cols-3 gap-1">
          {config.gridItems.map((item, index) => {
            if (item)
              return (
                <button
                  key={index}
                  disabled={activeItems.includes(index) || deActivating}
                  onClick={() => {
                    setActiveItems((previous) => [...previous, index]);
                    if (
                      activeItems.length ===
                      config.gridItems.filter(Boolean).length - 1
                    ) {
                      startDeActivating();
                    }
                  }}
                  className={cn("size-20 sm:size-40 border-2")}
                  style={{
                    backgroundColor: activeItems.includes(index)
                      ? config.activeColor
                      : "white",
                  }}
                >
                  {item}
                </button>
              );
            else return <span key={index} />;
          })}
        </div>
        {config.withSelectOrder && (
          <div className="flex items-center justify-start gap-4">
            {activeItems.length > 0 &&
              activeItems.map((item) => (
                <div
                  key={item}
                  className="border-2 size-10 flex items-center justify-center"
                >
                  {item + 1}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GridLights;
