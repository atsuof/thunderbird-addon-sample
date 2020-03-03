
function startup(){
    
}

function execute_test(){
    var result = confirm("test !!");    
    if(!result){
        return;
    }
    var jsondata = {};
    jsondata.emails = {};
    jsondata.emails.from = "sample@sample.com";
    jsondata.emails.to = ["aaa_bbb@xxx.co.jp","aaa_bbb@yyy.co.jp"];
    jsondata.emails.cc = [];
    jsondata.emails.bcc = [];
    jsondata.fileDatas = [];
        
    var url = "http://127.0.0.1:3000/rest-api";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url,false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(jsondata));
    if (xhr.status === 200) {
        var infoArea = document.getElementById("testResultTextBox");
        infoArea.value = xhr.status + "\n" + xhr.responseText;
    }else{
        alert("サーバーで予期せぬエラーが発生しました。");
        var errorArea = document.getElementById("testResultTextBox");
        errorArea.value = xhr.status + "\n" + xhr.responseText;
    }
}
