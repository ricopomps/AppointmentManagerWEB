import { parse } from "date-fns";
import {
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { dateFormat } from "../utils/calendarUtils";

export interface SelectedDay {
  index: number;
  interval: string;
  day: Date | string;
}

export enum REDUCER_ACTION_TYPE {
  SET_SELECTED_DAY,
  CLEAR_SELECTED_DAY,
  NEXT_WEEK,
  PREVIOUS_WEEK,
  RESET_WEEK,
}

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: SelectedDay;
};

type StateType = {
  selectedDay?: SelectedDay;
  week: number;
};

export const initialState: StateType = { selectedDay: undefined, week: 0 };

const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.SET_SELECTED_DAY: {
      return {
        ...state,
        selectedDay: action.payload,
      };
    }
    case REDUCER_ACTION_TYPE.CLEAR_SELECTED_DAY: {
      return {
        ...state,
        selectedDay: undefined,
      };
    }
    case REDUCER_ACTION_TYPE.NEXT_WEEK: {
      return {
        ...state,
        week: state.week + 1,
      };
    }
    case REDUCER_ACTION_TYPE.PREVIOUS_WEEK: {
      return {
        ...state,
        week: state.week - 1,
      };
    }
    case REDUCER_ACTION_TYPE.RESET_WEEK: {
      return {
        ...state,
        week: 0,
      };
    }
    default: {
      return state;
    }
  }
};

const useSelectedDayContext = (initialState: StateType) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setSelectedDay = useCallback((selectedDay: SelectedDay) => {
    const selectedDate = parse(
      selectedDay.day.toString(),
      dateFormat,
      new Date()
    );

    dispatch({
      type: REDUCER_ACTION_TYPE.SET_SELECTED_DAY,
      payload: { ...selectedDay, day: selectedDate },
    });
  }, []);

  const clearSelectedDay = useCallback(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.CLEAR_SELECTED_DAY,
    });
  }, []);

  const nextWeek = useCallback(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.NEXT_WEEK,
    });
  }, []);

  const previousWeek = useCallback(() => {
    if (state.week > 0)
      dispatch({
        type: REDUCER_ACTION_TYPE.PREVIOUS_WEEK,
      });
  }, [state.week]);

  const resetWeek = useCallback(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.RESET_WEEK,
    });
  }, []);

  return {
    state,
    setSelectedDay,
    clearSelectedDay,
    nextWeek,
    previousWeek,
    resetWeek,
  };
};

type UseSelectedDayContextType = ReturnType<typeof useSelectedDayContext>;

const initialContextState: UseSelectedDayContextType = {
  state: initialState,
  setSelectedDay: (selectedDay: SelectedDay) => {},
  clearSelectedDay: () => {},
  nextWeek: () => {},
  previousWeek: () => {},
  resetWeek: () => {},
};

export const SelectedDayContext =
  createContext<UseSelectedDayContextType>(initialContextState);

type ChildrenType = {
  children?: ReactElement;
};

export const SelectedDayProvider = ({
  children,
  ...initialState
}: ChildrenType & StateType): ReactElement => {
  return (
    <SelectedDayContext.Provider value={useSelectedDayContext(initialState)}>
      {children}
    </SelectedDayContext.Provider>
  );
};

type UseSelectedDayHookType = {
  selectedDay?: SelectedDay;
  week: number;
  setSelectedDay: (selectedDay: SelectedDay) => void;
  clearSelectedDay: () => void;
  nextWeek: () => void;
  previousWeek: () => void;
  resetWeek: () => void;
};

export const useSelectedDay = (): UseSelectedDayHookType => {
  const {
    state: { selectedDay, week },
    setSelectedDay,
    clearSelectedDay,
    nextWeek,
    previousWeek,
    resetWeek,
  } = useContext(SelectedDayContext);
  return {
    selectedDay,
    week,
    setSelectedDay,
    clearSelectedDay,
    nextWeek,
    previousWeek,
    resetWeek,
  };
};
