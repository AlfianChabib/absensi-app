import { AssessmentType } from "@prisma/client";

export type EnumToString<
  Teks extends string,
  KarakterLama extends string,
  KarakterBaru extends string
> = Teks extends `${infer Awal}${KarakterLama}${infer Akhir}`
  ? `${Awal}${KarakterBaru}${EnumToString<Akhir, KarakterLama, KarakterBaru>}`
  : Teks;

export type GradeType = EnumToString<Uppercase<AssessmentType>, "_", " ">;
