import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~~/components/ui/sheet";

import { Label } from "~~/components/ui/label";

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

import { Settings2 } from "lucide-react";
import { Button } from "~~/components/ui/button";
import { ConfigType } from "../page";

export function Settings({
  config,
  setConfig,
  defaultConfig,
  init,
}: {
  config: ConfigType;
  setConfig: React.Dispatch<React.SetStateAction<ConfigType>>;
  defaultConfig: ConfigType;
  init: () => void;
}) {
  const sound = config.volume[0] > 0;
  return (
    <Sheet>
      <SheetTrigger>
        <Settings2 size={24} className="ms-20" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Change config</SheetTitle>
        </SheetHeader>
        <div className="space-y-1">
          <Label>Volume </Label>
          <div className="w-full  flex items-center gap-3">
            <Slider
              value={config.volume}
              onValueChange={(e) => {
                setConfig((prev) => ({
                  ...prev,
                  volume: e,
                }));
              }}
            />
            <span>{config.volume[0]}</span>
            <button
              onClick={() => {
                setConfig((prev) => ({
                  ...prev,
                  volume: prev.volume[0] > 0 ? [0] : [50],
                }));
              }}
            >
              {sound ? (
                config.volume[0] <= 33 ? (
                  <Volume size={24} />
                ) : config.volume[0] <= 66 ? (
                  <Volume1 size={24} />
                ) : (
                  <Volume2 size={24} />
                )
              ) : (
                <VolumeX size={24} />
              )}
            </button>
          </div>
          <div className=" w-full">
            <Label>Size of game field</Label>
            <Select
              value={config.size.toString()}
              onValueChange={(e) => {
                setConfig((prev) => ({
                  ...prev,
                  size: parseInt(e),
                }));
                setConfig((prev) => ({
                  ...prev,
                  fields: Array.from({ length: parseInt(e) * parseInt(e) }).map(
                    () => ({
                      isOpen: false,
                      isMine: false,
                      isFlag: false,
                      answerByUser: false,
                    })
                  ),
                }));
                init();
              }}
            >
              <SelectTrigger className=" w-full">
                <SelectValue placeholder="Select size of game field" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sizes</SelectLabel>
                  {config.fieldSizes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              onClick={() => {
                setConfig((prev) => ({
                  ...prev,
                  fields: Array.from({ length: prev.size * prev.size }).map(
                    () => ({
                      isOpen: false,
                      isMine: false,
                      isFlag: false,
                      answerByUser: false,
                    })
                  ),
                }));
                init();
              }}
              variant="outline"
              className="flex items-center  w-full gap-4 mt-5"
            >
              <RefreshCcw className="size-6" /> <span>Reset game field</span>
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                setConfig(defaultConfig);
                init();
              }}
              variant="outline"
              className="flex items-center  w-full gap-4 mt-5"
            >
              <RefreshCcw className="size-6" /> <span>Reset config</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
