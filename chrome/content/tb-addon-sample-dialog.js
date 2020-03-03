var mcDialog = {};

mcDialog.startup = function () {
    var msgObjects = window.arguments[1];
    var infoMsg = "";
    var warnMsg = "";
    var erroMsg = "";
    mcDialog.msgObjects = msgObjects;
    for(index in msgObjects){
        var msgObj = msgObjects[index];
        if(msgObj.erroLevel == "ERROR"){
            erroMsg += createMsg(msgObj);
        }
        if(msgObj.erroLevel == "WARNING"){
            warnMsg += createMsg(msgObj);
        }
        if(msgObj.erroLevel == "INFO"){
            infoMsg += createMsg(msgObj);
        }
    }
    var errorArea = document.getElementById("erroTextBox");
    errorArea.value = erroMsg;
    if(erroMsg.length == 0){
        errorArea.setAttribute("style", "display:none;");
    }

    var warnArea = document.getElementById("warnTextBox");
    warnArea.value = warnMsg;
    if(warnMsg.length == 0){
        warnArea.setAttribute("style", "display:none;");
    }

    var infoArea = document.getElementById("infoTextBox");
    infoArea.value = infoMsg;
    if(infoMsg.length == 0){
        infoArea.setAttribute("style", "display:none;");
    }

    var okBtn = document.documentElement.getButton("accept");
    okBtn.disabled = erroMsg.length != 0;

    document.addEventListener("dialogaccept", e => {
        mcDialog.doOK();
    });

    document.addEventListener("dialogcancel", e => {
        mcDialog.doCancel();
    });
};

mcDialog.doOK = function () {
    window.arguments[0].confirmOK = true;
	return false;
};


mcDialog.doCancel = function () {
	window.arguments[0].confirmOK = false;
	return false;
};

function createMsg(msgObj){
    var resultMsg  ="";
    resultMsg += msgObj.erroLevel + " : " + msgObj.errorCode + " : " + msgObj.title;
    resultMsg += msgObj.detailMessage == null ? "" + "\n" : msgObj.detailMessage + "\n"
    return resultMsg;
}
