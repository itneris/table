 function saveState(saveState: { type: "storage" | "session", name: string } | null, propChangeCallback: ((storageState: any) => any)) {
    if (!saveState) {
        return;
    }

    let tableStateJson = localStorage.getItem(saveState.name) ??
        sessionStorage.getItem(saveState.name);

    let tableState = tableStateJson ? JSON.parse(tableStateJson) : {};
    tableState = propChangeCallback(tableState);

    if (saveState.type === "storage") {
        localStorage.setItem(saveState.name, JSON.stringify(tableState));
    } else {
        sessionStorage.setItem(saveState.name, JSON.stringify(tableState));
    }
};

export default saveState;
