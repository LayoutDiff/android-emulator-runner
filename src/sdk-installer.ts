import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';

const BUILD_TOOLS_VERSION = '29.0.2';
const SDK_URL = 'https://dl.google.com/android/repository/sdk-tools-darwin-4333796.zip';

/**
 * Downloads and installs the Android SDK for the macOS platform, including SDK platform for the chosen API level, latest build tools, platform tools, Android Emulator,
 * and the system image for the chosen API level, cpu/abi, and target.
 */
export async function installAndroidSdk(apiLevel: number, abi: string, target: string): Promise<void> {
  // download Android SDK if not already installed
  if (fs.existsSync(`${process.env.ANDROID_HOME}/tools/bin/sdkmanager`)) {
    console.log('Android SDK already installed.');
  } else {
    console.log('Downloading Android SDK.');
    const downloadedSdkPath = await tc.downloadTool(SDK_URL);
    await tc.extractZip(downloadedSdkPath, process.env.ANDROID_HOME);
  }

  // install specific SDK tools
  console.log('Installing build tools, platform tools, platform and system image.');
  await exec.exec(`yes | ${process.env.ANDROID_HOME}/tools/bin/sdkmanager --licenses`);
  await exec.exec(`${process.env.ANDROID_HOME}/tools/bin/sdkmanager --update`);
  await exec.exec(`${process.env.ANDROID_HOME}/tools/bin/sdkmanager "build-tools;${BUILD_TOOLS_VERSION}"`);
  await exec.exec(`${process.env.ANDROID_HOME}/tools/bin/sdkmanager "platform-tools"`);
  await exec.exec(`${process.env.ANDROID_HOME}/tools/bin/sdkmanager "platforms;android-${apiLevel}"`);
  await exec.exec(`${process.env.ANDROID_HOME}/tools/bin/sdkmanager "system-images;android-${apiLevel};${target};${abi}"`);
}
