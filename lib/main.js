var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var selection = require("sdk/selection");
var toMarkdown = require("./external/to-markdown").toMarkdown;

exports.main = function() {

    // http://stackoverflow.com/a/8621139
    var selectedText = null;
    function selectionChanged(event){
        selectedText = selection.html;
    }
    selection.on('select', selectionChanged);

    var widget = widgets.Widget({
        id: "jaywink-diaspora-advanced-sharer-button",
        label: "diaspora* Advanced Sharer",
        contentURL: self.data.url("diaspora.ico"),
        onClick: function() {
            var url = 'http://sharetodiaspora.github.io/?url='+encodeURIComponent(tabs.activeTab.url)+'&title='+encodeURIComponent('**'+tabs.activeTab.title+'**');
            if (selectedText) {
                selectedText = toMarkdown(selectedText);
                if (selectedText.length > 1900) {
                    // trim to ~1900, leave some safety for url.. 
                    selectedText = selectedText.splice(0,1900) + ' ...';
                }
                selectedText = encodeURIComponent("\n\n---\n"+selectedText+"\n\n---\n");
                url = url + "&notes=" + selectedText;
            }
            tabs.open(url);
            // clear selection
            if (selectedText) {
                selectedText = null;
            }
        }
    });
};
