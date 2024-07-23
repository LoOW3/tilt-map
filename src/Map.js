/* global google */
import React, { useEffect, useRef, useContext } from "react";
import CompassContext from "./context/CompassProvider";

const Map = () => {
  const mapRef = useRef(null);
  const { compassAngle, startCompass, setMap } = useContext(CompassContext);

  useEffect(() => {
    const position = {
      lat: 40.756888845049076, 
      lng: -73.98257460640461
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=<API_KEY>&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.initMap = () => {
      const map = new google.maps.Map(mapRef.current, {
        center: position,
        zoom: 16,
        heading: 360,
        tilt: 0,
        mapId: "90f87356969d889c",
      });

      const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: "Initial Center",
      });

      const buttons = [
        ["Rotate Left", "rotate", 20, google.maps.ControlPosition.LEFT_CENTER],
        ["Rotate Right", "rotate", -20, google.maps.ControlPosition.RIGHT_CENTER],
        ["Tilt Down", "tilt", 20, google.maps.ControlPosition.TOP_CENTER],
        ["Tilt Up", "tilt", -20, google.maps.ControlPosition.BOTTOM_CENTER],
      ];

      buttons.forEach(([text, mode, amount, position]) => {
        const controlDiv = document.createElement("div");
        const controlUI = document.createElement("button");

        controlUI.classList.add("ui-button");
        controlUI.innerText = `${text}`;
        controlUI.addEventListener("click", () => {
          adjustMap(mode, amount);
        });
        controlDiv.appendChild(controlUI);
        map.controls[position].push(controlDiv);
      });

      const adjustMap = function (mode, amount) {
        switch (mode) {
          case "tilt":
            map.setTilt(map.getTilt() + amount);
            break;
          case "rotate":
            map.setHeading(map.getHeading() + amount);
            break;
          default:
            break;
        }
      };

      // Set the map in the context
      setMap(map);
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [setMap]);

  return (
    <div>
      <div id="map" ref={mapRef} style={{ height: "100vh", width: "100%" }} />
      <button onClick={startCompass} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        Start Compass
      </button>
      <div style={{ position: 'absolute', top: 60, left: 10, zIndex: 1000, fontWeight:800, padding:'1rem 2rem', backgroundColor: '#fff' }}>
        Compass Angle: {compassAngle}°
      </div>
    </div>
  );
};

export default Map;
