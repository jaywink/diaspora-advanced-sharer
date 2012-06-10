// The main module of the jaywink Add-on.

var Widget = require("widget").Widget;
var tabs = require('tabs');
var selection = require("selection");

exports.main = function() {

    // http://stackoverflow.com/a/8621139
    var selectedText = '';
    function selectionChanged(event){
        selectedText = selection.text;
    }
    selection.on('select', selectionChanged);

    new Widget({
        // Mandatory string used to identify your widget in order to
        // save its location when the user moves it in the browser.
        // This string has to be unique and must not be changed over time.
        id: "jaywink-diaspora-advanced-sharer-button",

        // A required string description of the widget used for
        // accessibility, title bars, and error reporting.
        label: "Diaspora* Advanced Sharer",

        // An optional string URL to content to load into the widget.
        // This can be local content or remote content, an image or
        // web content. Widgets must have either the content property
        // or the contentURL property set.
        //
        // If the content is an image, it is automatically scaled to
        // be 16x16 pixels.
        contentURL: "https://joindiaspora.com/favicon.ico",

        // Add a function to trigger when the Widget is clicked.
        onClick: function(event) {
            if (selectedText.length > 0) {
                selectedText = selectedText.replace('\n','<br>').replace('\r','<br>');
                var selected_text = '&'+'notes='+encodeURIComponent('\n\n<p><i>'+selectedText+'</i></p>');
            } else {
                selected_text = '';
            }
            
            tabs.open('http://sharetodiaspora.github.com/?url='+encodeURIComponent(tabs.activeTab.url)+'&title='+encodeURIComponent('**'+tabs.activeTab.title+'**')+selected_text);
            
            
            //var panel = require("panel").Panel({
            //  width: 620,
            //  height: 550,
            //  contentURL: 'http://sharetodiaspora.github.com/?url='+encodeURIComponent(tabs.activeTab.url)+'&title='+encodeURIComponent('**'+tabs.activeTab.title+'**')+selected_text
            //});
            //panel.show();
        }
    });
};
