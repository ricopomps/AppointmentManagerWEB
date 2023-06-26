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
}

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: SelectedDay;
};

type StateType = {
  selectedDay?: SelectedDay;
};

export const initialState: StateType = { selectedDay: undefined };

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

  return { state, setSelectedDay, clearSelectedDay };
};

type UseSelectedDayContextType = ReturnType<typeof useSelectedDayContext>;

const initialContextState: UseSelectedDayContextType = {
  state: initialState,
  setSelectedDay: (selectedDay: SelectedDay) => {},
  clearSelectedDay: () => {},
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
  setSelectedDay: (selectedDay: SelectedDay) => void;
  clearSelectedDay: () => void;
};

export const useSelectedDay = (): UseSelectedDayHookType => {
  const {
    state: { selectedDay },
    setSelectedDay,
    clearSelectedDay,
  } = useContext(SelectedDayContext);
  return { selectedDay, setSelectedDay, clearSelectedDay };
};
