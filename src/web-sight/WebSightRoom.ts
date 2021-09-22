import { Timestamp } from "typeorm";
import { WebSightRoomCardinalityType } from "./WebSightRoomCardinalityType";

export type WebSightRoom = {
  id: string;
  name: string;
  roomCardinalityType: WebSightRoomCardinalityType;
  timeOpened?: Timestamp;
  timeClosed?: Timestamp;
};
