import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";
import React from "react";
import { Position, useReactFlow } from "@xyflow/react";
import CustomHandle from "../CustomHandle";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const CallTransfer = ({ id, data }) => {
  const { setNodes } = useReactFlow();

  return (
    <>
      <Card className="w-[300px] text-center flex flex-col items-center bg-violet-900 px-2 pt-2 pb-1">
        <Dialog>
          <div className="w-full ps-1">
            <CardTitle className="flex justify-between">
              <h1 className="pt-3 flex">
              <i class="fa-solid fa-phone-arrow-up-right"></i>
                {data.label}
              </h1>
              <DialogTrigger asChild>
                <Button
                  className="text-red-600 hover:bg-red-100 hover:text-red-600 cursor-pointer"
                  variant="ghost"
                  size="icon"
                >
                  <i class="fa-solid fa-circle-xmark"></i>
                </Button>
              </DialogTrigger>
            </CardTitle>
            <CardDescription>
              <p className="text-xs text-muted-foreground text-start">
                {data.description}
              </p>
            </CardDescription>
          </div>
          {data.schema && data.schema.length > 0 && (
            <div>
              {data?.schema.map((item, index) => (
                <p key={index}>{item.title}</p>
              ))}
            </div>
          )}

          {/* Node dynamic input fields here */}
          <div className="w-full bg-gray-950 rounded-sm pb-1">
            <div className="flex justify-between items-center p-2">
              <span className="flex gap-2 items-center text-xs opacity-40">
              <i class="fa-solid fa-split"></i> Conditions
              </span>
            </div>
            <div className="flex flex-col gap-y-2 px-2">
              <div className="flex justify-between items-center">
                <Input disabled type="number" placeholder="Number" />
              </div>
            </div>
          </div>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
              <i class="fa-solid fa-circle-info"></i>
                Delete Conversation
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this conversation? This action
                cannot be reversed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2 cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="cursor-pointer"
                onClick={() =>
                  setNodes((prevNodes) =>
                    prevNodes.filter((node) => node.id !== id)
                  )
                }
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
      <CustomHandle type="source" position={Position.Right} />
      <CustomHandle type="target" position={Position.Left} />
    </>
  );
};

export default CallTransfer;
