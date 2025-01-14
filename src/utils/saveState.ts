import { TableState } from "src/props/TableState";

 function saveState(saveState: { type: "storage" | "session", name: string } | null, state: TableState) {
    if (!saveState) {
        return;
    }
    if (saveState.type === "storage") {
        localStorage.setItem(saveState.name, JSON.stringify(state));
    } else {
        sessionStorage.setItem(saveState.name, JSON.stringify(state));
    }
};

export default saveState;
