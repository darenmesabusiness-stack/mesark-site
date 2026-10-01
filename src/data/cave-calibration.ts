// GPS ⇄ map-image calibration per map, from Mesa Images/_Tools/cave-maps (calibration.json + overrides).
// x% = (lon[0] + lon[1] * (gpsLon - 10) / 10) * 100, and the same for y with lat.

export const caveCalibration: Record<string, { lon: [number, number]; lat: [number, number] }> = {
  "the-island": { lon: [0.09765625, 0.1074349], lat: [0.06380208, 0.10059896] },
  "the-center": { lon: [0.10717773, 0.10283691], lat: [0.12036133, 0.09636719] },
  "scorched-earth": { lon: [0.09765625, 0.1074349], lat: [0.06380208, 0.10059896] },
  "aberration": { lon: [0.11523438, 0.09880859], lat: [0.11547852, 0.09697754] },
  "extinction": { lon: [0.0949707, 0.10796387], lat: [0.06323242, 0.10076172] },
  "genesis": { lon: [0.11279297, 0.09929688], lat: [0.11572266, 0.09697754] },
  "genesis-2": { lon: [0.11328125, 0.0987793], lat: [0.11523438, 0.09709961] },
  "crystal-isles": { lon: [0.11669922, 0.10137207], lat: [0.11279297, 0.09526855] },
  "fjordur": { lon: [0.11474609, 0.09868652], lat: [0.11669922, 0.096875] },
  "lost-island": { lon: [0.11279297, 0.09929688], lat: [0.11328125, 0.09731445] },
  "ragnarok": { lon: [0.11523438, 0.09880859], lat: [0.11474609, 0.09709961] },
  "valguero": { lon: [0.11279297, 0.09929688], lat: [0.11816406, 0.09661133] },
};

export const gpsToPin = (map: string, lat: number, lon: number) => {
  const c = caveCalibration[map];
  if (!c) return null;
  return { x: +((c.lon[0] + (c.lon[1] * (lon - 10)) / 10) * 100).toFixed(3), y: +((c.lat[0] + (c.lat[1] * (lat - 10)) / 10) * 100).toFixed(3) };
};

export const pinToGps = (map: string, x: number, y: number) => {
  const c = caveCalibration[map];
  if (!c) return null;
  return { lat: +(10 + (10 * (y / 100 - c.lat[0])) / c.lat[1]).toFixed(1), lon: +(10 + (10 * (x / 100 - c.lon[0])) / c.lon[1]).toFixed(1) };
};
