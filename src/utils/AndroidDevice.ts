export interface AndroidDevice {
  name: string;
  size: number;
  resolutionWidth: number;
  resolutionHeight: number;
  density: number;
}

export const ANDROID_DEVICE_TEMPLATES: AndroidDevice[] = [
  {
    name: "Pixel 3",
    size: 5.46,
    resolutionWidth: 1080,
    resolutionHeight: 2160,
    density: 440,
  },
  {
    name: "Nexus 5X",
    size: 5.2,
    resolutionWidth: 1080,
    resolutionHeight: 1920,
    density: 420,
  },
  {
    name: "Nexus 4",
    size: 4.7,
    resolutionWidth: 768,
    resolutionHeight: 1280,
    density: 320,
  },
  {
    name: "Pixel 4",
    size: 5.7,
    resolutionWidth: 1080,
    resolutionHeight: 2280,
    density: 440,
  },
  {
    name: "Pixel 4 XL",
    size: 6.3,
    resolutionWidth: 1440,
    resolutionHeight: 3040,
    density: 560,
  },
  {
    name: "Nexus 6P",
    size: 5.7,
    resolutionWidth: 1440,
    resolutionHeight: 2560,
    density: 560,
  },
  {
    name: "Pixel C",
    size: 9.94,
    resolutionWidth: 2560,
    resolutionHeight: 1800,
    density: 320,
  },
  {
    name: "Nexus 7",
    size: 7.02,
    resolutionWidth: 1200,
    resolutionHeight: 1920,
    density: 320,
  },
];
