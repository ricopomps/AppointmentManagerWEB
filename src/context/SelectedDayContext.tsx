import { parse, isEqual } from "date-fns";
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

export interface Clinic {
  name: string;
  _id: string;
  dentists?: Dentist[];
}

export interface Dentist {
  username: string;
  _id: string;
}

export enum REDUCER_ACTION_TYPE {
  SET_SELECTED_DAY,
  CLEAR_SELECTED_DAY,
  NEXT_WEEK,
  PREVIOUS_WEEK,
  RESET_WEEK,
  SET_SELECTED_CLINIC,
  SET_SELECTED_DENTIST,
}

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: any;
};

type StateType = {
  selectedDay?: SelectedDay;
  week: number;
  selectedClinic?: Clinic;
  selectedDentist?: Dentist;
};

export const initialState: StateType = {
  selectedDay: undefined,
  week: 0,
  selectedClinic: undefined,
  selectedDentist: undefined,
};

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
    case REDUCER_ACTION_TYPE.SET_SELECTED_CLINIC: {
      return {
        ...state,
        selectedClinic: action.payload,
      };
    }
    case REDUCER_ACTION_TYPE.SET_SELECTED_DENTIST: {
      return {
        ...state,
        selectedDentist: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

const useSelectedDayContext = (initialState: StateType) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setSelectedDay = useCallback(
    (selectedDay: SelectedDay) => {
      const selectedDate = parse(
        selectedDay.day.toString(),
        dateFormat,
        new Date()
      );

      if (
        state?.selectedDay?.day &&
        state.selectedDay.day instanceof Date &&
        isEqual(selectedDate, state.selectedDay?.day) &&
        selectedDay.interval === state.selectedDay.interval
      ) {
        dispatch({
          type: REDUCER_ACTION_TYPE.CLEAR_SELECTED_DAY,
        });
      } else {
        dispatch({
          type: REDUCER_ACTION_TYPE.SET_SELECTED_DAY,
          payload: { ...selectedDay, day: selectedDate },
        });
      }
    },
    [state.selectedDay]
  );

  const clearSelectedDay = useCallback(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.CLEAR_SELECTED_DAY,
    });
  }, []);

  const nextWeek = useCallback(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.NEXT_WEEK,
    });
    dispatch({
      type: REDUCER_ACTION_TYPE.CLEAR_SELECTED_DAY,
    });
  }, []);

  const previousWeek = useCallback(() => {
    if (state.week > 0) {
      dispatch({
        type: REDUCER_ACTION_TYPE.PREVIOUS_WEEK,
      });
      dispatch({
        type: REDUCER_ACTION_TYPE.CLEAR_SELECTED_DAY,
      });
    }
  }, [state.week]);

  const resetWeek = useCallback(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.RESET_WEEK,
    });
    dispatch({
      type: REDUCER_ACTION_TYPE.CLEAR_SELECTED_DAY,
    });
  }, []);

  const setSelectedClinic = useCallback((clinic?: Clinic) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_SELECTED_CLINIC,
      payload: clinic,
    });
  }, []);

  const setSelectedDentist = useCallback((dentist?: Dentist) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_SELECTED_DENTIST,
      payload: dentist,
    });
  }, []);

  return {
    state,
    setSelectedDay,
    clearSelectedDay,
    nextWeek,
    previousWeek,
    resetWeek,
    setSelectedClinic,
    setSelectedDentist,
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
  setSelectedClinic: (clinic?: Clinic) => {},
  setSelectedDentist: (dentist?: Dentist) => {},
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
  selectedClinic?: Clinic;
  selectedDentist?: Dentist;
  setSelectedDay: (selectedDay: SelectedDay) => void;
  clearSelectedDay: () => void;
  nextWeek: () => void;
  previousWeek: () => void;
  resetWeek: () => void;
  setSelectedClinic: (clinic?: Clinic) => void;
  setSelectedDentist: (dentist?: Dentist) => void;
};

export const useSelectedDay = (): UseSelectedDayHookType => {
  const {
    state: { selectedDay, week, selectedClinic, selectedDentist },
    setSelectedDay,
    clearSelectedDay,
    nextWeek,
    previousWeek,
    resetWeek,
    setSelectedClinic,
    setSelectedDentist,
  } = useContext(SelectedDayContext);
  return {
    selectedDay,
    week,
    selectedClinic,
    selectedDentist,
    setSelectedDay,
    clearSelectedDay,
    nextWeek,
    previousWeek,
    resetWeek,
    setSelectedClinic,
    setSelectedDentist,
  };
};
