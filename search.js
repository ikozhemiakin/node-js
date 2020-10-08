function Search() {
}

module.exports = Search;
var SEARCHANY = 1;
var SEARCHALL = 2;
var SEARCHURL = 4;
var searchType = '';
var showMatches = 10;
var copyArray = [];

Search.prototype.validate = function (entry) {
    if (entry.charAt(0) == '+') {
        entry = entry.substring(1, entry.length);
        searchType = SEARCHURL;
    } else if (entry.substring(0, 4) == "url:") {
        entry.substring(5, entry.length);
    } else {
        searchType = SEARCHANY;
    }
    while (entry.charAt(0) == ' ') {
        entry = entry.substring(1, entry.length);
        document.forms[0].query.value = entry;
    }
    while (entry.charAt(entry.length - 1) == ' ') {
        entry = entry.substring(0, entry.length - 1);
        document.forms[0].query.value = entry;
    }
    if (entry.length < 3) {
        alert("You cannot search strings that small. Elaborate a little.");
        document.forms[0].query.focus();
        return;
    }
    this.convertString(entry);
};

Search.prototype.convertString = function (reentry) {
    var searchArray = reentry.split(" ");
    if (searchType = (SEARCHANY | SEARCHALL)) {
        this.requireAll(searchArray);
    } else {
        this.allowAny(searchArray);
    }
}

Search.prototype.allowAny = function (t) {
    var findings = [0];
    for (var i = 0; i < entry.length; i++) {
        var compareElement = entry[i].toUpperCase();
        if (searchType == SEARCHANY) {
            var refineElement = compareElement.substring(0, compareElement.indexOf('|HTTP'))
        } else {
            var refineElement = compareElement.substring(compareElement.indexOf('|HTTP'), compareElement.length);
        }
        for (var j = 0; j < t.length; j++) {
            var compareString = t[j].toUpperCase();
            if (refineElement.indexOf(compareString) != -1) {
                findings[findings.length] = entry[i];
                break;
            }
        }
    }
    this.verifyManage(findings);
}

Search.prototype.requireAll = function (t) {
    var findings = [];
    for (var i = 0; i < entry.length; i++) {
        var allConfirmation = true;
        var allString = entry[i].toUpperCase();
        var refineAllString = allString.substring(0, allString.indexOf('|HTTP'));
        for (var j = 0; j < t.length; j++) {
            var allElement = t[j].toUpperCase();
            if (refineAllString.indexOf(allElement) == -1) {
                allConfirmation = false;
                continue;
            }
        }
        if (allConfirmation) {
            findings[findings.length] = entry[i];
        }
    }
    global.result = findings;
    this.verifyManage(findings);
}

Search.prototype.verifyManage = function (resultSet) {
    if (resultSet.length == 0) {
        console.log('No results');
    } else {
        copyArray = resultSet.sort();
        // this.formatResults(copyArray, currentMatch, showMatches);
    }
}

Search.prototype.noMatch = function () {
    // if ('undefined' != typeof screen) {
    //     // your code here
    //
    // var win = docObj.open();
    // docObj.innerHTML +=
    // document.getElementById('frame1').innerHTML ='<html><head><title>Search Results></title></head>' +
    //     '<body bgcolor="white" text="black">' +
    //     '<table width="90%" border="0" align="center"><tr><td valign="top">' +
    //     '<font face="arial"><b><dl>' +
    //     '<hr noshade width="100%">'+
    //     '" returned no results.<hr noshade="" width="100%>' +
    //     '</td></tr></table></body></html>';
    // }
    // docObj.writeln();
    // docObj.close();
    // document.forms[0].query.select();
}