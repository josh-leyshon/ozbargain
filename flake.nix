# This flake was adapted from the flakes posted here:
# https://discourse.nixos.org/t/building-expo-react-native-android-app-on-nixos/38194/4
# To create a development shell with this flake, run:
# nix develop

{
  description = ''
    Expo 51 development shell.
    Allows building a local android APK with `npx eas build --platform android --local`.
  '';
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = {
            android_sdk.accept_license = true;
            allowUnfree = true;
          };
        };

        pinnedJDK = pkgs.jdk17;

        # If updating Expo causes the build to fail, normally the build log will say
        # which version of a tool was trying to be installed.
        # Just come here and specify that version instead.

        androidPlatformVersion = "34";
        androidBuildToolsVersion = "34.0.0";
        androidNdkVersion = "26.1.10909125";
        androidComposition = pkgs.androidenv.composeAndroidPackages {
          # For some reason, expo tries to install v34 and v35.
          buildToolsVersions = [
            # "34.0.0"
            androidBuildToolsVersion
          ];
          platformVersions = [ androidPlatformVersion ];
          includeNDK = true;
          ndkVersions = [ androidNdkVersion ];
          cmakeVersions = [ "3.22.1" ];
        };
        sdk = androidComposition.androidsdk;
      in
      {
        # Creates a general environment for building this repo.
        # For use with `nix develop`.
        devShell = pkgs.mkShell rec {
          buildInputs = with pkgs; [
            pinnedJDK
            sdk
            pkg-config
            pkgs.dprint
          ];

          JAVA_HOME = pinnedJDK;
          ANDROID_SDK_ROOT = "${androidComposition.androidsdk}/libexec/android-sdk";
          ANDROID_NDK_ROOT = "${ANDROID_SDK_ROOT}/ndk-bundle";
          GRADLE_OPTS = "-Dorg.gradle.project.android.aapt2FromMavenOverride=${ANDROID_SDK_ROOT}/build-tools/${androidBuildToolsVersion}/aapt2";
        };

        # Specific package exports for use with `nix shell`.
        packages = {
          dprint = pkgs.dprint;
        };
      }
    );
}
