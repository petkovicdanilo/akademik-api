import { ApiProperty } from "@nestjs/swagger";

type ClassType<T = any> = new (...args: any[]) => T;

interface IPaginated {
  meta: Meta;
  links: Links;
}

export class Meta {
  @ApiProperty()
  public itemCount: number;

  @ApiProperty()
  public totalItems: number;

  @ApiProperty()
  public itemsPerPage: number;

  @ApiProperty()
  public totalPages: number;

  @ApiProperty()
  public currentPage: number;
}

export class Links {
  @ApiProperty()
  public first: string;

  @ApiProperty()
  public previous: string;

  @ApiProperty()
  public next: string;

  @ApiProperty()
  public last: string;
}

export function PaginatedDto<T extends ClassType>(ResourceCls: T) {
  class Paginated extends ResourceCls implements IPaginated {
    @ApiProperty()
    public meta: Meta;

    @ApiProperty()
    public links: Links;
  }

  return Paginated;
}
