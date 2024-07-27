import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~~/components/ui/sheet";

import { Settings2 } from "lucide-react";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { Switch } from "~~/components/ui/switch";
import { ConfigType } from "../page";

export function Settings({
  config,
  setConfig,
  defaultConfig,
  isDisabled,
}: {
  config: ConfigType;
  setConfig: React.Dispatch<React.SetStateAction<ConfigType>>;
  defaultConfig: ConfigType;
  isDisabled: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger>
        <Settings2 size={24} className="ms-20" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Change config</SheetTitle>
        </SheetHeader>
        <div className="space-y-5">
          <Button
            variant="outline"
            className="mt-5"
            disabled={isDisabled}
            onClick={() => {
              setConfig(defaultConfig);
            }}
          >
            Reset to default
          </Button>
          <div className="space-y-2">
            <Label>Active color</Label>
            <Input
              type="color"
              value={config.activeColor}
              onChange={(e) => {
                setConfig((previous) => ({
                  ...previous,
                  activeColor: e.target.value,
                }));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>
              Clear time interval
              <span className="text-xs ms-2">in milliseconds</span>
            </Label>
            <Input
              type="string"
              disabled={isDisabled}
              value={config.clearTimeInterval}
              pattern="[0-9]*"
              onChange={(e) => {
                setConfig((previous) => ({
                  ...previous,
                  clearTimeInterval: isNaN(+e.target.value)
                    ? config.clearTimeInterval
                    : +e.target.value,
                }));
              }}
            />
          </div>
          <p className="mt-10">
            Grid layout<span className="text-xs ms-2">click to alternate</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {config.gridItems.map((item, index) => {
              return (
                <button
                  key={index}
                  onClick={() => {
                    setConfig((previous) => ({
                      ...previous,
                      gridItems: previous.gridItems.map((item, i) => {
                        if (i === index) {
                          return item ? null : index + 1;
                        }
                        return item;
                      }),
                    }));
                  }}
                  className="border-2 size-20"
                >
                  {item ?? "hidden"}
                </button>
              );
            })}
          </div>
          <p className="mt-10">Select order</p>
          <div className="flex items-center space-x-2">
            <Switch
              id="withSelectOrder"
              checked={config.withSelectOrder}
              onCheckedChange={(e) => {
                setConfig((previous) => ({
                  ...previous,
                  withSelectOrder: e,
                }));
              }}
            />
            <Label htmlFor="withSelectOrder">
              Enable to see the order of selected items
            </Label>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
