import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";

import { useSelector, useDispatch } from "react-redux";

import { Layout, MapPlot } from "./components";
import { useSolverWorker } from "./hooks";

import * as selectors from "./store/selectors";
import * as actions from "./store/actions";

import { ButtonGroup, Button } from "@material-ui/core";

function App() {
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  return (
    <Layout>
      <Button>Bắt đầu</Button>
      <MapPlot ref={mapRef}></MapPlot>
    </Layout>
  );
}

export default App;
