function moneyAmountIsValid(num) {
    if (num !== undefined && num !== "" && !Number.isNaN(num) && num !== 0) {
        return true;
    }
    alert("Please enter a valid salary! Make sure your salary only has numbers (no dollar signs, commas, etc)");
    return false;
}

function validateRadioButton(num, strErrHelp) {
    if (num >= 0) {
        return true;
    }
    alert(`Please select the ${strErrHelp}`);
    return false;
}