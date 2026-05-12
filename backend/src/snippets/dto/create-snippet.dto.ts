import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty()
  title!: string; // დაემატა !

  @IsString()
  @IsNotEmpty()
  code!: string; // დაემატა !

  @IsString()
  @IsNotEmpty()
  language!: string; // დაემატა !

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]; // აქ სჯობს ? იყოს, რადგან IsOptional გიწერია

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsString()
  @IsOptional()
  userId?: string;
}
