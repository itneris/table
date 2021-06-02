const DATE_FORMAT = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
};

const DATE_TIME_FORMAT = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
};

export function ToRuDate(dateStr, needTime) {
    if (dateStr === "" || dateStr === null || dateStr === undefined) {
        return "";
    }

    if (typeof dateStr === "number") {
        return needTime ? new Date(dateStr).toLocaleDateString("ru-RU", DATE_TIME_FORMAT) : new Date(dateStr).toLocaleDateString("ru-RU", DATE_FORMAT);
    }

    var strValue = dateStr.replace("Z", "");
    var date;
    if (new Date(strValue).getTime() === new Date(strValue + "Z").getTime()) {
        var offset = - new Date().getTimezoneOffset() * 60 * 1000;
        date = new Date(new Date(strValue) - offset);
    } else {
        date = new Date(strValue);
    }
    return needTime ? date.toLocaleDateString("ru-RU", DATE_TIME_FORMAT) : date.toLocaleDateString("ru-RU", DATE_FORMAT);
}