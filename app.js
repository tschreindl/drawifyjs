const dialog = require('electron').remote.dialog;
const fs = require('fs');
const json_editor = require('@json-editor/json-editor');

$(function () {

    let jsonEditor = createJsonEditor();

    $("#load").on("click", function () {
        let path = dialog.showOpenDialog({filters: [{name: "JSON-Dateien", extensions: ["json"]}]});

        if (typeof path === "undefined") return;
        fs.readFile(path[0], function (err, data) {
            console.log(err);
            jsonEditor.setValue(JSON.parse(data.toString()));
        });
    });

    $("#save").on("click", function () {
        let savePath = dialog.showSaveDialog({filters: [{name: "JSON-Dateien", extensions: ["json"]}]});
        if (typeof savePath === "undefined") return;
        let newContent = $("#content").text();

        fs.writeFile(savePath, newContent, function (err) {
            console.log(err);
        })
    });

    $("#load-schema").on("click", function () {
        let path = dialog.showOpenDialog({filters: [{name: "JSON-Schema", extensions: ["json"]}]});

        if (typeof path === "undefined") return;
        fs.readFile(path[0], function (err, data) {
            let oldValue = jsonEditor.getValue();
            jsonEditor.destroy();
            jsonEditor = createJsonEditor(data.toString(), oldValue);
        });
    });

    function createJsonEditor(_schema = "{}", _value = "") {
        if (_schema !== "{}") $("#schema-loaded").text("Schema geladen");
        let jsonEditor = new json_editor($("#json-div").get(0), {
            schema: JSON.parse(_schema),
            theme: "bootstrap3"
        });
        jsonEditor.setValue(_value);
        onChange(jsonEditor);
        return jsonEditor;
    }

    function onChange(jsonEditor) {
        jsonEditor.on("change", function () {
            if (jsonEditor.getValue() !== null) $("#content").html(JSON.stringify(jsonEditor.getValue(), null, 2));
        });
    }
});