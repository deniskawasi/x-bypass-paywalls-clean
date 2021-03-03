var ext_api = (typeof browser === 'object') ? browser : chrome;

function currentDateStr() {
    let date = new Date();
    let dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    return dateStr;
}
var last_date_str = currentDateStr();
var daily_users;
