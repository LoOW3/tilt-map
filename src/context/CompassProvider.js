import React, { createContext, useState, useEffect } from 'react';

const CompassContext = createContext(null);

export const CompassProvider = ({ children }) => {
  const [compassAngle, setCompassAngle] = useState(0);
  const [pointVisibility, setPointVisibility] = useState(false);
  const [counterCheckCompass, setCounterCheckCompass] = useState(0);
  const [isIOS, setIsIOS] = useState(false);
  const [map, setMap] = useState(null); // Add state for the map object

  let pointDegree;

  const handler = (e) => {
    let compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    setCompassAngle(Math.round(compass));

    if (map) {
      map.setHeading(compass);
    }
  };

  useEffect(() => {
    const init = () => {
      window.addEventListener("deviceorientation", handler, true);
    };

    const isIOS = () => {
      return (
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/)
      );
    };

    const deviceIsIOS = isIOS();
    setIsIOS(deviceIsIOS || false);

    init();

    return () => {
      window.removeEventListener("deviceorientation", handler);
    };
  }, [map]); // Add map to the dependency array

  useEffect(() => {
    if (counterCheckCompass < 20) setCounterCheckCompass(counterCheckCompass + 1);
  }, [compassAngle]);

  const startCompass = () => {
    console.log('Start compass clicked');
    const isIOS = () => {
      return (
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/)
      );
    };
    const deviceIsIOS = isIOS();
    setIsIOS(deviceIsIOS || false);
    if (deviceIsIOS) {
      console.log('User agent is Apple');
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handler, true);
          } else {
            alert("has to be allowed!");
          }
        })
        .catch(() => alert("not supported"));
    }
  };

  return (
    <CompassContext.Provider value={{ compassAngle, setCompassAngle, pointVisibility, isIOS, startCompass, counterCheckCompass, setMap }}>
      {children}
    </CompassContext.Provider>
  );
};

export default CompassContext;
