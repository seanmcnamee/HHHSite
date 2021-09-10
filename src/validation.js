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

function getRadioButtonValue(radioButtonElement) {
    var selectedRadioButton = -1;
    for (const element of radioButtonElement.children) {
        if (element.checked) {
            selectedRadioButton = element.value;
            break;
        }
    }
    return selectedRadioButton;
}

function setVisible(element, isVisible) {
    element.classList.add((isVisible)? "shown": "hidden");
    element.classList.remove((isVisible)? "hidden": "shown");
}

function setDisplaying(element, isVisible) {
    if (isVisible) {
        element.classList.remove("not-displaying");
    } else {
        element.classList.add("not-displaying");
    }
    
    
}