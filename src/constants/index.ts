export enum GENDERS {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum LANGUAGES {
  English = "en-US",
  Japan = "ja-JP",
  Korean = "ko-KR",
}

export enum COLORS {
  Green = "#4FDE53",
  Blue = "#068AFE",
  Yellow = "#FAE100",
}

export const TypeMapLanguageColor: Record<LANGUAGES, COLORS> = {
  [LANGUAGES.English]: COLORS.Blue,
  [LANGUAGES.Japan]: COLORS.Green,
  [LANGUAGES.Korean]: COLORS.Yellow,
};
