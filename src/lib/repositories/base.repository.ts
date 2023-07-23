import { type ClassConstructor, plainToInstance } from 'class-transformer';

// missing type safety here: Issue with prisma not having some generics to work with for dynamic repository
export class BaseRepository<TModel = any> {
  constructor(
    protected readonly model: TModel,
    protected entity: ClassConstructor<any>,
  ) {}

  async findOne<WhereInputArgs, SelectArgs = object, IncludeArgs = object>(
    where: WhereInputArgs,
    select?: SelectArgs,
    include?: IncludeArgs,
  ) {
    // @ts-expect-error typing
    const data = await this.model.findFirst({
      where,
      ...(!select && include && { include }),
      ...(!include && select && { select }),
    });

    return this.mapEntity(data);
  }

  async findById<SelectArgs = object>(id: string, select?: SelectArgs) {
    return this.mapEntity(await this.findOne<any>({ id, select }));
  }

  async update<WhereInputArgs, TData = any, SelectArgs = object>(
    where: WhereInputArgs,
    data: TData,
    select?: SelectArgs,
  ): Promise<any> {
    // @ts-expect-error typing
    return await this.model.update({
      where,
      data,
      ...{ select },
    });
  }

  async create<TData = any, SelectArgs = object>(
    data: TData,
    select?: SelectArgs,
  ): Promise<any> {
    // @ts-expect-error typing
    const created = await this.model.create({
      data,
      select,
    });

    return this.mapEntity(created);
  }

  async upsert<WhereInputArgs, CreateInput, UpdateInput>(
    where: WhereInputArgs,
    create: CreateInput,
    update: UpdateInput,
  ): Promise<any> {
    // @ts-expect-error typing
    return await this.model.upsert({
      where,
      create,
      update,
    });
  }

  async delete<WhereInputArgs>(where: WhereInputArgs): Promise<any> {
    // @ts-expect-error typing
    return await this.model.delete({
      where,
    });
  }

  protected mapEntity<TData>(data: TData): TData extends null ? null : any {
    return plainToInstance(
      this.entity,
      JSON.parse(JSON.stringify(data)),
    ) as any;
  }
}
