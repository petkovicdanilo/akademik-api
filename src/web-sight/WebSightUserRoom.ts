import { WebSightRole } from "./WebSightRole";

export type WebSightUserRoom = {
  id?: number;
  userId: number;
  roomId: string;
  role: WebSightRole;
  online?: boolean;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  timeSpentInRoom?: number; // in ms
};
