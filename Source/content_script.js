var hasSpiders = false;

function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
    console.log('handling', textNode);
    if(hasSpiders) {
        textNode.nodeValue = replaceText(textNode.nodeValue);
    }
    
}

function replaceText(v)
{
    // Fix some misspellings
    v = v.replace(/\bVirtue\sSignall?ing?\b/g, "Caring About Other People");
    v = v.replace(/\bVirtue\ssignall?ing?\b/g, "Caring about other people");
    v = v.replace(/\bvirtue\ssignall?ing?\b/g, "caring about other people");
    console.log(v);
    return v;
}

function checkForSpiders() {
    var bodyText = document.body.innerText;
    if(bodyText && bodyText.match(/\bvirtue\ssignal?ling?\b/gi)) {
        return true;
    } else {
        return false;
    }

}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i;
    
    if(!hasSpiders) {
        hasSpiders = checkForSpiders();
    }
    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType === 3) {
                // Replace the text for text nodes
                handleText(mutation.addedNodes[i]);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(mutation.addedNodes[i]);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    console.log('go go go');
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    if(!hasSpiders) {
        hasSpiders = checkForSpiders();
    }

    // Do the initial text replacements in the document body and title
    if(hasSpiders) {
        walk(doc.body);
        doc.title = replaceText(doc.title);
    }

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
