const qthLocator = require('../src/index');

describe('QTH locator', () => {
  it('Can tell if input is valid locator string', () => {
    expect(qthLocator.isValidLocatorString('KP20le')).toBe(true);
    expect(qthLocator.isValidLocatorString('ZZ20le')).toBe(false);
  });

  it('Can validate input case insensitive', () => {
    expect(qthLocator.isValidLocatorString('kp20le')).toBe(true);
    expect(qthLocator.isValidLocatorString('KP20LE')).toBe(true);
  });

  const expectCoordinates = (coords, lat, lng) => {
    expect(coords[0]).toBeCloseTo(lat);
    expect(coords[1]).toBeCloseTo(lng);
  };

  const expectBearDist = (BDPair, dist, deg) => {
    expect(BDPair.km).toBeCloseTo(dist);
    expect(BDPair.deg).toBeCloseTo(deg);
  };

  const expectInvalidGridErr = (fn, a, b) => {
    expect.assertions(2);

    try {
      fn(a, b);
    } catch (error) {
      expect(error).toHaveProperty('message', 'Input is not valid locator string');
      expect(error).toBeInstanceOf(Error);
    }
  };

  const expectInvalidLatLngErr = (fn, a, b) => {
    expect.assertions(4);

    try {
      fn(a, b);
    } catch (error) {
      expect(error).toHaveProperty('message', 'Input is not a valid coordinate');
      expect(error).toBeInstanceOf(Error);
    }
  };

  it('Converts locator string to coordinates', () => {
    expectCoordinates(qthLocator.locatorToLatLng('KP20le'), 60.188, 24.958);
    expectCoordinates(qthLocator.locatorToLatLng('FN31pr'), 41.729, -72.708);
    expectCoordinates(qthLocator.locatorToLatLng('FN20'), 40.48, -75.04);
  });

  it('Can calculate distance between two squares', () => {
    expect(qthLocator.distance('KP20le', 'KP21ol')).toBeCloseTo(144.26);
  });

  it('Can calculate distance between two four letter squares', () => {
    expect(qthLocator.distance('KP20', 'FN20')).toBeCloseTo(6673.09);
  });

  it('Can calculate distance and bearing between two far squares', () => {
    expectBearDist(qthLocator.bearingDistance('FN20qr', 'KP21ol'), 6586.72, 49.16);
  });

  it('Can calculate distance and bearing between two close squares', () => {
    expectBearDist(qthLocator.bearingDistance('FN20qr', 'FN30qr'), 168.52, 89.35);
  });

  it('Detect invalid grid', () => {
    expectInvalidGridErr(qthLocator.locatorToLatLng, 'RZ73');
  });

  it('Locate debatable grid - It is in spec!', () => {
    expectCoordinates(qthLocator.locatorToLatLng('RR73'), 83.479, 174.96);
  });

  it('Detect short grid', () => {
    expectInvalidGridErr(qthLocator.locatorToLatLng, 'R73');
  });

  it('detect invalid grid in bearingDistance 1', () => {
    expectInvalidGridErr(qthLocator.bearingDistance, 'FN20qr', 'F030ll');
  });

  it('Converts latLng to grid', () => {
    expect(qthLocator.latLngToLocator(14.3125, -32.125)).toBe('HK34wh');
    expect(qthLocator.latLngToLocator(60.179, 24.945)).toBe('KP20le');
    expect(qthLocator.latLngToLocator(-33.886048, 151.193546)).toBe('QF56oc');
    expect(qthLocator.latLngToLocator(-22.904788, -43.184915)).toBe('GG87jc');
  });

  it('Throws error for invalid latitude', () => {
    expectInvalidLatLngErr(qthLocator.latLngToLocator, 91, 120);
    expectInvalidLatLngErr(qthLocator.latLngToLocator, -91, 120);
  });

  it('Throws error for invalid longitude', () => {
    expectInvalidLatLngErr(qthLocator.latLngToLocator, 55, -181);
    expectInvalidLatLngErr(qthLocator.latLngToLocator, 55, 181);
  });
});
