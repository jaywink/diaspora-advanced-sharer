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
    
    function cleanSelectedText(text) {
        // encase in blockquote
        text = '<blockquote>'+text+'</blockquote>';
        // any links that point to just #something, add host
        text = text.replace(/href="(#|\/[^".]+)"/g, 'href="'+cleanPageUrl(tabs.activeTab.url).replace(/\/$/, "")+'$1"');
        // to markdown
        text = toMarkdown(text);
        // strip any remaining tags that survived, http://stackoverflow.com/a/822464/1489738
        text = text.replace(/<(?:.|\n)*?>/gm, '');
        return text;
    }
    
    function cleanPageUrl(url) {
        // adapted from http://stackoverflow.com/a/12822466/1489738
        url = url.replace(/&?utm_.+?(&|$)/g, '');
        return url;
    }

    var widget = widgets.Widget({
        id: "jaywink-diaspora-advanced-sharer-button",
        label: "diaspora* Advanced Sharer",
        contentURL: self.data.url("diaspora.ico"),
        onClick: function() {
            var url = 'http://sharetodiaspora.github.io/?url='+encodeURIComponent(cleanPageUrl(tabs.activeTab.url))+'&title='+encodeURIComponent('**'+tabs.activeTab.title+'**');
            if (selectedText) {
                selectedText = cleanSelectedText(selectedText);
                if (selectedText.length > 1900) {
                    // trim to ~1900, leave some safety for url.. 
                    selectedText = selectedText.splice(0,1900) + ' ...';
                }
                selectedText = encodeURIComponent("\n\n"+selectedText+"\n\n");
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
