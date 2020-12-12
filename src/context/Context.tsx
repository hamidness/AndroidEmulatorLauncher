import React, { createContext, Dispatch, SetStateAction, useState } from "react";
import AppState from "./AppState";

interface ProjectContextType {
    state: AppState;
    setState: Dispatch<SetStateAction<AppState>>;
}

export const ProjectContext = createContext({} as ProjectContextType);

const initialState: AppState = {};

export const AppContextProvider = (props: any) => {
    const [state, setState] = useState<AppState>(initialState);

    return <ProjectContext.Provider value={{ state: state, setState }}>{props.children}</ProjectContext.Provider>;
};
