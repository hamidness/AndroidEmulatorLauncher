import { AndroidDevice } from "./AndroidDevice";
import { AndroidVersion } from "./AndroidVersion";

export default interface CreateAvdSpec {
    device: AndroidDevice;
    androidVersion: AndroidVersion;
    name: string;
}
