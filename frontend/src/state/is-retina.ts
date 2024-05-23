import { atom } from 'recoil';

interface WindowWithDevicePixelRatio extends Window {
  devicePixelRatio: number;
  screen: ScreenWithDPR;
};

interface ScreenWithDPR extends Screen {
  deviceXDPI: number;
  logicalXDPI: number;
}


function checkIsRetina() {
  // taken from Leaflet source: https://github.com/Leaflet/Leaflet/blob/ee71642691c2c71605bacff69456760cfbc80a2a/src/core/Browser.js#L119
  const windowWithDPR = window as unknown as WindowWithDevicePixelRatio;
  return (
    (windowWithDPR.devicePixelRatio ||
      windowWithDPR.screen.deviceXDPI / windowWithDPR.screen.logicalXDPI) > 1
  );
}

export const isRetinaState = atom({
  key: 'isRetinaState',
  default: checkIsRetina(),
});
