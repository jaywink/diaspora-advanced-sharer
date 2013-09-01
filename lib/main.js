var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var selection = require("sdk/selection");

exports.main = function() {

    // http://stackoverflow.com/a/8621139
    var selectedText = null;
    function selectionChanged(event){
        selectedText = selection.text;
    }
    selection.on('select', selectionChanged);

    var widget = widgets.Widget({
        id: "jaywink-diaspora-advanced-sharer-button",
        label: "diaspora* Advanced Sharer",
        contentURL: self.data.url("diaspora.ico"),
        onClick: function() {
            var url = 'http://sharetodiaspora.github.io/?url='+encodeURIComponent(tabs.activeTab.url)+'&title='+encodeURIComponent('**'+tabs.activeTab.title+'**');
            if (selectedText) {
                selectedText = selectedText.replace('\n','<br>').replace('\r','<br>');
                var notesContainerPre = '&notes='+encodeURIComponent('\n\n<p><i>'),
                    notesContainerPost = encodeURIComponent('</i></p>'),
                    urlLength = url.length + notesContainerPost.length + notesContainerPre.length;
                if (selectedText.length + urlLength > 2000) {
                    // trim to 2000
                    selectedText = selectedText.splice(0,1995-urlLength) + ' ...';
                }
                url = url + notesContainerPre + selectedText + notesContainerPost;
            }
            tabs.open(url);
            // clear selection
            if (selectedText) {
                selectedText = null;
            }
        }
    });
};
