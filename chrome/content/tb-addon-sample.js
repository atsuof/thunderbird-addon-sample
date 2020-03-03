var ConfirmAddress = {
	checkAddress: function(){
		window.confirmOK = false;
		var msgCompFields = gMsgCompose.compFields;

		var msgSubject = document.getElementById("msgSubject");
		
		var toList = [];
		var ccList = [];
		var bccList = [];
		var otherList = [];
		var fromAdd = [];
		this.collectAddress(msgCompFields,fromAdd, toList, ccList, bccList, otherList);
		
		var atachementFile = document.getElementById("attachmentBucket");
		var fileFacts = [];
		for(index in atachementFile.childNodes){
			if((atachementFile.childNodes[index] instanceof XULElement) == false){
				continue;
			}
			var fileurl = atachementFile.childNodes[index].getAttribute("tooltiptext");
			var filename = atachementFile.childNodes[index].getAttribute("name");
			var fileNamesForCheck = filename.split(".");
			if(fileNamesForCheck.length < 2 || fileNamesForCheck[fileNamesForCheck.length-1].toLowerCase().includes("xls") == false || fileNamesForCheck[fileNamesForCheck.length-1].toLowerCase().includes("xlsx") == false){
				fileFacts.push({fileName:filename,fileData:"",mailTitle:msgSubject.value});
				continue;
			}
			let fileHandler = Services.io.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler);
			var file = fileHandler.getFileFromURLSpec(fileurl);
			var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
			istream.init(file, -1, -1, false);

			var bstream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
			bstream.setInputStream(istream);

			var bytes = bstream.readBytes(bstream.available());
			bstream.close();
			istream.close();
			var base64str = btoa(bytes);
			fileFacts.push({fileName:filename,fileData:base64str,mailTitle:msgSubject.value});
		}

		var jsondata = {};
		jsondata.emails = {};
		jsondata.emails.from = fromAdd[0];
		jsondata.emails.to = toList;
		jsondata.emails.cc = ccList;
		jsondata.emails.bcc = bccList;
		jsondata.fileDatas = fileFacts;
		var errorMessageTitle = "unexpected error has occured";
		var errorMessageDetail = "check process was skipped. please check carefully on self \n";

		try{
			//var url = "http://localhost:3000/rest_api";
			var xhr = new XMLHttpRequest();
			xhr.open("POST", url,false);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(JSON.stringify(jsondata));
			if (xhr.status === 200) {
				var resultJson = JSON.parse(xhr.responseText);
				if(resultJson != null && resultJson.length != 0){
					openDialog(window,resultJson);
				}
				else{
					window.confirmOK = true;
				}
			}
			else{
				var resultJson = {};
				resultJson.erroLevel = "INFO";
				resultJson.errorCode = xhr.status;
				resultJson.title = errorMessageTitle;
				resultJson.detailMessage = errorMessageDetail + xht.responseText;
				openDialog(window,[resultJson]);
			}
		}
		catch(err){
			var resultJson = {};
			resultJson.erroLevel = "INFO";
			resultJson.errorCode = "999";
			resultJson.title = errorMessageTitle;
			resultJson.detailMessage = errorMessageDetail + err;
			openDialog(window,[resultJson]);
		}
		return window.confirmOK;
  	},
  	collectAddress : function(msgCompFields,fromAdd, toList, ccList, bccList, otherList){

		if (msgCompFields == null){
			return;
		}
		var fromField = document.getElementById("msgIdentity");
		var fromValue = fromField.value;
		if (fromValue == null){
			fromValue = fromField.getAttribute("value");
		}

		if (fromValue != ""){
			var fromAd = null;
			try {
				fromAd = MailServices.headerParser.reformatUnquotedAddresses(fromValue);
			} catch (ex) {
				fromAd = fromValue;
			}
			fromAdd.push(fromAd);
		}

  		var row = 0;
	  	while(true){
			row++;
			var inputField = document.getElementById("addressCol2#" + row);

			if(inputField == null){
				break;
			}

			var fieldValue = inputField.value;
			if (fieldValue == null){
				fieldValue = inputField.getAttribute("value");
			}

			if (fieldValue != ""){

				var recipient = null;

				try {
					recipient = MailServices.headerParser.reformatUnquotedAddresses(fieldValue);
				} catch (ex) {
					recipient = fieldValue;
				}
				var recipientType = "";
				var popupElement = document.getElementById("addressCol1#" + row);
				if(popupElement != null){
					recipientType = popupElement.selectedItem.getAttribute("value");
				}
				
				switch (recipientType){
					case "addr_to":
						toList.push(recipient);
						break;
					case "addr_cc":
						ccList.push(recipient);
						break;
					case "addr_bcc":
						bccList.push(recipient);
						break;
					case "addr_reply":
						bccList.push(recipient);
						break;
					default:
						otherList.push(recipient);
						break;
				}
			}
		  }
  	}
}

function openDialog(window,resultJson){
	window.openDialog("chrome://thunderbird-addon-sample/content/tb-addon-sample-dialog.xul",
							"MailAddressChkDialog", "resizable,chrome,modal,titlebar,centerscreen",
							window,resultJson);
}