import { WebSightRoomCardinalityType } from "./WebSightRoomCardinalityType";

export type WebSightRoom = {
  id: string;
  name: string;
  roomCardinalityType: WebSightRoomCardinalityType;
  timeOpened?: Date;
  timeClosed?: Date;
};
