export const calcQuickTime = (option, type) => {
    let timeObj = {}
    let currentDay = new Date();
    let year = currentDay.getFullYear();
    let month = currentDay.getMonth();
    let date = currentDay.getDate();
    let hours = (currentDay.getHours() < 10 ? "0"+currentDay.getHours():currentDay.getHours());
    let minutes = (currentDay.getMinutes() + 1 == 60 ? "00": (currentDay.getMinutes() + 1 < 10 ? "0" + (currentDay.getMinutes() + 1) : currentDay.getMinutes() + 1));
    if (type == "time") {
        let fromDate = new Date(currentDay.valueOf() - (option * 60 * 1000));
        let yyyy = fromDate.getFullYear();
        let mm = fromDate.getMonth();
        let dd = fromDate.getDate();
        let hh = (fromDate.getHours() < 10 ? "0"+fromDate.getHours():fromDate.getHours());
        let mi = (fromDate.getMinutes() + 1 == 60 ? "00": (fromDate.getMinutes() + 1 < 10 ? "0" + (fromDate.getMinutes() + 1) : fromDate.getMinutes() + 1));
        timeObj["fromDate"] = yyyy + "-" + (mm + 1 > 9 ? '' : '0') + (mm + 1) + "-" + (dd > 9 ? '' : '0') + dd;
        timeObj["fromTime"] = hh + ":" + mi;
        timeObj["toDate"] = year + "-" + (month + 1 > 9 ? '' : '0') + (month + 1) + "-" + (date > 9 ? '' : '0') + date;
        timeObj["toTime"] = hours + ":" + minutes;
    } else if (type == "day") {
        let fromDate = new Date(currentDay.valueOf() - (option  * 24 * 60 * 60 * 1000));
        let yyyy = fromDate.getFullYear();
        let mm = fromDate.getMonth();
        let dd = fromDate.getDate();
        timeObj["fromDate"] = yyyy + "-" + (mm + 1 > 9 ? '' : '0') + (mm + 1) + "-" + (dd > 9 ? '' : '0') + dd;
        timeObj["fromTime"] = "00:00";
        let toDate = new Date(fromDate.valueOf() + (24 * 60 * 60 * 1000))
        yyyy = toDate.getFullYear();
            mm = toDate.getMonth();
            dd = toDate.getDate();
        timeObj["toDate"] = yyyy + "-" + (mm + 1 > 9 ? '' : '0') + (mm + 1) + "-" + (dd > 9 ? '' : '0') + dd;
        timeObj["toTime"] = "00:00";
    } else {
        if (type == "days") {
            let fromDate = new Date(currentDay.valueOf() - (option  * 24 * 60 * 60 * 1000));
            let yyyy = fromDate.getFullYear();
            let mm = fromDate.getMonth();
            let dd = fromDate.getDate();
            timeObj["fromDate"] = yyyy + "-" + (mm + 1 > 9 ? '' : '0') + (mm + 1) + "-" + (dd > 9 ? '' : '0') + dd;
            timeObj["fromTime"] = "00:00";
            let toDate = new Date(currentDay.valueOf() + (24 * 60 * 60 * 1000));
            yyyy = toDate.getFullYear();
            mm = toDate.getMonth();
            dd = toDate.getDate();
            timeObj["toDate"] = yyyy + "-" + (mm + 1 > 9 ? '' : '0') + (mm + 1) + "-" + (dd > 9 ? '' : '0') + dd;
            timeObj["toTime"] = "00:00";
        } else if (type == "weeks") {
            let day = new Date(currentDay.valueOf() - ((option * 7) * 24 * 60 * 60 * 1000));
            let firstDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() - day.getDay());
            let yyyy = firstDay.getFullYear();
            let mm = firstDay.getMonth();
            let dd = firstDay.getDate();
            let week = firstDay.getDay();
            timeObj["fromDate"] = yyyy + "-" + (mm + 1 > 9 ? '' : '0') + (mm + 1) + "-" + (dd > 9 ? '' : '0') + dd;
            timeObj["fromTime"] = "00:00";
            let lastDay = new Date(yyyy, mm, dd + (7 - week));
            yyyy = lastDay.getFullYear();
            mm = lastDay.getMonth();
            dd = lastDay.getDate();
            timeObj["toDate"] = yyyy + "-" + (mm + 1 > 9 ? '' : '0') + (mm + 1) + "-" + (dd > 9 ? '' : '0') + dd;
            timeObj["toTime"] = "00:00";
        } else if (type == "months") {
            if (month - option < 0) {
                year = year - 1;
                month = 12 + (month - option);
            } else {
                month = month - option;
            }
            let firstDay = new Date(year, month, 1);
            let yyyy = firstDay.getFullYear();
            let mm = firstDay.getMonth();
            let dd = firstDay.getDate();
            timeObj["fromDate"] = yyyy + "-" + (mm + 1 > 9 ? '' : '0') + (mm + 1) + "-" + (dd > 9 ? '' : '0') + dd;
            timeObj["fromTime"] = "00:00";
            let lastDay = new Date(year, month + 1, 1);
            yyyy = lastDay.getFullYear();
            mm = lastDay.getMonth();
            dd = lastDay.getDate();
            timeObj["toDate"] = yyyy + "-" + (mm + 1 > 9 ? '' : '0') + (mm + 1) + "-" + (dd > 9 ? '' : '0') + dd;
            timeObj["toTime"] = "00:00";
        } else if (type == "years") {
            let firstDay = new Date(year - option, 0, 1);
            let yyyy = firstDay.getFullYear();
            let mm = firstDay.getMonth();
            let dd = firstDay.getDate();
            timeObj["fromDate"] = yyyy + "-" + (mm + 1 > 9 ? '' : '0') + (mm + 1) + "-" + (dd > 9 ? '' : '0') + dd;
            timeObj["fromTime"] = "00:00";
            let lastDay = new Date(year - option + 1 ,0, 1);
            yyyy = lastDay.getFullYear();
            mm = lastDay.getMonth();
            dd = lastDay.getDate();
            timeObj["toDate"] = yyyy + "-" + (mm + 1 > 9 ? '' : '0') + (mm + 1) + "-" + (dd > 9 ? '' : '0') + dd;
            timeObj["toTime"] = "00:00";
        }
    }
    return timeObj
}