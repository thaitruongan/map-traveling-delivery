import * as actions from "./actions";

const data = [
  [105.42443885561784, 10.391572690924718],
  [105.42969134128617, 10.392301275704241],
  [105.43366437531711, 10.38971810381993],
  [105.43642529727117, 10.386108250931073],
  [105.43706157022717, 10.377077337815024],
  [105.4449529342308, 10.378834079796107],
  [105.42617987014842, 10.384226673450158],
  [105.41965909611372, 10.38165290374458],
  [105.43452814249969, 10.384104082449625],
  [105.43499513453907, 10.373168043667548],
];

const initialViewport = {
  latitude: 10.3799955,
  longitude: 105.4316586,
  zoom: 14,
};

const initialState = {
  points: data.sort(() => Math.random() + 0.5),
  viewport: initialViewport,
  algorithm: "convexHull",
  delay: 100,
  evaluatingDetailLevel: 2,
  maxEvaluatingDetailLevel: 2,
  showBestPath: true,

  bestPath: [],
  bestDisplaySegments: [],
  bestCost: null,

  evaluatingPaths: [],
  evaluatingCost: null,
  running: false,
  fullSpeed: false,
  paused: false,
  startedRunningAt: null,

  pointCount: data.length,
  definingPoints: false,

  siteInfoOpen: false,
  algInfoOpen: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.TOGGLE_SITE_INFO_OPEN:
      return {
        ...state,
        siteInfoOpen: !state.siteInfoOpen,
      };

    case actions.TOGGLE_ALG_INFO_OPEN:
      return {
        ...state,
        algInfoOpen: !state.algInfoOpen,
      };

    case actions.SET_VIEWPORT_STATE:
      return {
        ...state,
        viewport: action.viewport,
      };

    case actions.RESET_EVALUATING_STATE:
      return {
        ...state,
        evaluatingPaths: [],
        evaluatingCost: null,
      };

    case actions.RESET_BEST_PATH_STATE:
      return {
        ...state,
        bestPath: [],
        bestCost: null,
      };

    //
    // SOLVER CONTROLS
    //
    case actions.SET_ALGORITHM:
      return {
        ...state,
        ...action.defaults,
        algorithm: action.algorithm,
      };

    case actions.SET_DELAY:
      return {
        ...state,
        delay: action.delay,
      };

    case actions.SET_EVALUATING_DETAIL_LEVEL:
      return {
        ...state,
        evaluatingDetailLevel: action.level,
        evaluatingPaths: action.level ? state.evaluatingPaths : [],
        evaluatingCost: action.level ? state.evaluatingCost : null,
      };

    case actions.SET_SHOW_BEST_PATH:
      return {
        ...state,
        showBestPath: action.show,
      };

    case actions.START_SOLVING:
      return {
        ...state,
        showBestPath: false,
        running: true,
        startedRunningAt: Date.now(),
        pointCount: state.points.length,
      };

    case actions.GO_FULL_SPEED:
      return {
        ...state,
        showBestPath: true,
        evaluatingDetailLevel: 0,
        evaluatingPaths: [],
        fullSpeed: true,
      };

    case actions.PAUSE:
      return {
        ...state,
        paused: true,
        running: false,
      };

    case actions.UNPAUSE:
      return {
        ...state,
        paused: false,
        running: true,
      };

    case actions.STOP_SOLVING:
      return {
        ...state,
        points:
          state.bestPath.length > 0
            ? state.bestPath.slice(0, state.bestPath.length - 1)
            : state.points,
        showBestPath: true,
        running: false,
        paused: false,
        fullSpeed: false,
        startedRunningAt: null,
      };

    //
    // SOLVER ACTIONS
    //
    case actions.SET_EVALUATING_PATHS:
      return {
        ...state,
        evaluatingPaths: state.evaluatingDetailLevel ? action.paths : [],
        evaluatingCost: state.evaluatingDetailLevel ? action.cost : null,
      };

    case actions.SET_BEST_PATH:
      return {
        ...state,
        bestPath: action.path,
        bestCost: action.cost,
      };

    //
    // POINT CONTROLS
    //
    case actions.SET_POINT_COUNT:
      return {
        ...state,
        pointCount: action.count,
      };

    case actions.SET_POINTS:
      return {
        ...state,
        points: action.points,
      };

    case actions.START_DEFINING_POINTS:
      return {
        ...state,
        points: [],
        definingPoints: true,
        pointCount: 0,
      };

    case actions.ADD_DEFINED_POINT:
      return {
        ...state,
        points: [...state.points, action.point],
        pointCount: state.pointCount + 1,
      };

    case actions.STOP_DEFINING_POINTS:
      return {
        ...state,
        definingPoints: false,
      };

    case actions.SET_DEFAULT_MAP:
      return {
        ...state,
        viewport: initialViewport,
        points: data,
        pointCount: data.length,
      };

    default:
      return state;
  }
};
