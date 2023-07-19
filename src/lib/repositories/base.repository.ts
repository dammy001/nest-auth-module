import { type ClassConstructor, plainToInstance } from 'class-transformer';

// missing type safety here: Issue with prisma not having some generics to work with for dynamic repository
export class BaseRepository<TModel = any> {
  constructor(
    protected readonly model: TModel,
    protected entity: ClassConstructor<any>,
  ) {}

  async findOne<WhereInputArgs, SelectArgs = object>(
    where: WhereInputArgs,
    select: SelectArgs = {} as any,
  ) {
    // @ts-expect-error typing
    const data = await this.model.findFirst({ where, select });

    return this.mapEntity(data);
  }

  async findById<SelectArgs = object>(
    id: string,
    select: SelectArgs = {} as any,
  ) {
    return await this.findOne<any>({ where: { id }, select });
  }

  protected mapEntity<TData>(data: TData): TData extends null ? null : any {
    return plainToInstance(
      this.entity,
      JSON.parse(JSON.stringify(data)),
    ) as any;
  }
}
