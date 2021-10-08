import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Profile } from "src/users/profiles/entities/profile.entity";
import { WebSightRoom } from "./WebSightRoom";
import { WebSightUser } from "./WebSightUser";
import { WebSightUserRoom } from "./WebSightUserRoom";

@Injectable()
export class WebSightService {
  constructor(private readonly httpService: HttpService) {}

  async createWebSightUser(verifiedProfile: Profile): Promise<WebSightUser> {
    const response = await this.httpService
      .post<WebSightUser>("/users", {
        externalUserId: verifiedProfile.id,
        name: `${verifiedProfile.firstName} ${verifiedProfile.lastName}`,
      })
      .toPromise();

    return response.data;
  }

  async createWebSightRoom(room: WebSightRoom): Promise<WebSightRoom> {
    const response = await this.httpService
      .post<WebSightRoom>("/rooms", room)
      .toPromise();
    return response.data;
  }

  async createWebSightUserRoom(
    userRoom: WebSightUserRoom,
  ): Promise<WebSightUserRoom> {
    const response = await this.httpService
      .post<WebSightUserRoom>("/user-rooms", userRoom)
      .toPromise();

    return response.data;
  }

  // THIS WILL SET ROOM TIME_OPENED TO TIME OF REQUEST MADE
  async startRoomConference(userId: number, roomId: string): Promise<string> {
    const response = await this.httpService
      .post<string>("/rooms/start-conference", { userId, roomId })
      .toPromise();

    return response.data;
  }

  async getWebSightRoomToken(userId: number, roomId: string): Promise<string> {
    const response = await this.httpService
      .post<string>("/user-rooms/generate-token", { userId, roomId })
      .toPromise();

    return response.data;
  }
}
