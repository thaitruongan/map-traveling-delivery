import React, { useRef, useImperativeHandle, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import MapGL from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import DeckGL, { ScatterplotLayer, PathLayer } from "deck.gl";

import { useMediaQuery } from "@material-ui/core";
import { LinearProgress } from "@material-ui/core";

import * as actions from "../store/actions";
import * as selectors from "../store/selectors";

import { useThemeContext } from "../context";

const TOKEN =
  "pk.eyJ1IjoiYmVuYW50aGFpIiwiYSI6ImNsampneDJoajBiMTUzZG51ZWx0OHFvMnUifQ.f53cbJBQiaQfJseZ8guggQ";

export const MapPlot = React.forwardRef((props, ref) => {
  const { children } = props;
  const { muiTheme, colorMode } = useThemeContext();
  const matches = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const mapGlRef = useRef();
  const plotPoints = useSelector(selectors.selectPointsDisplay);
  const plotPaths = useSelector(selectors.selectPlotPaths);
  const viewport = useSelector(selectors.selectViewport);
  const running = useSelector(selectors.selectRunning);

  const definingPoints = useSelector(selectors.selectDefiningPoints);

  console.log(TOKEN);

  const mapStyle = useMemo(() =>
    colorMode === "dark"
      ? "mapbox://styles/mapbox/dark-v8"
      : "mapbox://styles/mapbox/light-v8"
  );

  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    getBounds: () => {
      const map = mapGlRef.current.getMap();
      const { _ne, _sw } = map.getBounds();
      return {
        top: _ne.lat,
        bottom: _sw.lat,
        left: _ne.lng,
        right: _sw.lng,
      };
    },
  }));

  useEffect(() => {
    if (matches) {
      dispatch(
        actions.setViewportState({
          ...viewport,
          zoom: 2,
        })
      );
    }
  }, [matches, dispatch]);

  const onViewportChanged = (viewport) => {
    dispatch(actions.setViewportState(viewport));
  };

  const onDefinedPoint = ({ lngLat }) => {
    dispatch(actions.addDefinedPoint(lngLat));
  };

  return (
    <MapGL
      {...viewport}
      ref={mapGlRef}
      width="100%"
      height={matches ? "50%" : "100%"}
      maxPitch={0}
      onViewportChange={onViewportChanged}
      mapboxAccessToken={TOKEN}
      disableTokenWarning={true}
      onNativeClick={definingPoints && onDefinedPoint}
      doubleClickZoom={false}
      mapStyle={mapStyle}
    >
      {running && <LinearProgress color="secondary" />}
      <DeckGL viewState={viewport}>
        <PathLayer
          id="path-layer"
          data={plotPaths}
          getPath={(d) => d.path}
          getColor={(d) => d.color}
          pickable={true}
          widthMinPixels={4}
          widthMaxPixels={8}
        />
        <ScatterplotLayer
          id="scatter-layer"
          data={plotPoints}
          pickable={true}
          opacity={0.8}
          getFillColor={(p) => p.color}
          radiusMinPixels={6}
          raduisMaxPixels={8}
        />
      </DeckGL>
      {children}
    </MapGL>
  );
});
