declare module '@nestjs/common';
declare module '@nestjs/passport';
declare module '@nestjs/swagger';
declare module '@nestjs/typeorm' {
  export const InjectRepository: any;
}

declare module 'typeorm' {
  export type Repository<T = any> = any;
}

declare module 'bcrypt' {
  export function hash(data: string, saltOrRounds: any): Promise<string>;
}
