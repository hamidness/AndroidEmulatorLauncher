export interface AndroidVersion {
  name: string;
  versionNumber: string;
  api: number;
  systemImage: string;
}

export const ANDROID_VERSIONS: AndroidVersion[] = [
  {
    name: "KitKat",
    versionNumber: "4.4",
    api: 19,
    systemImage: "system-images;android-19;google_apis_playstore;x86",
  },
  {
    name: "Lollipop",
    versionNumber: "5.0",
    api: 21,
    systemImage: "system-images;android-21;google_apis_playstore;x86",
  },
  {
    name: "Marshmallow",
    versionNumber: "6.0",
    api: 23,
    systemImage: "system-images;android-23;google_apis_playstore;x86",
  },
  {
    name: "Nougat",
    versionNumber: "7.0",
    api: 24,
    systemImage: "system-images;android-24;google_apis_playstore;x86",
  },
  {
    name: "Oreo",
    versionNumber: "8.0",
    api: 26,
    systemImage: "system-images;android-26;google_apis_playstore;x86",
  },
  {
    name: "Pie",
    versionNumber: "9",
    api: 28,
    systemImage: "system-images;android-28;google_apis_playstore;x86",
  },
  {
    name: "Q",
    versionNumber: "10",
    api: 29,
    systemImage: "system-images;android-29;google_apis_playstore;x86",
  },
  {
    name: "R",
    versionNumber: "11",
    api: 30,
    systemImage: "system-images;android-30;google_apis_playstore;x86",
  },
];
