
searchCard = (word) => {
    let query = word.selectionText;
    let rawQuery = word.selectionText;
    if (word.linkText) {
        query = word.linkText
        rawQuery = query.trim()
        query = encodeURIComponent(rawQuery)
    } else if (query && query.length > 0) {
        rawQuery = query.trim()
        query = encodeURIComponent(rawQuery)
    }

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        // chrome.tabs.sendMessage(tabs[0].id, {"message": linkText});

        chrome.storage.local.get('cardSites', (data) => {
            let cardSites = {
                'cardmarket': true,
                'wizards.com': false,
                'cardkingdom': false,
                'deckbox': false,
                'mtggoldfish': false,
                'edhrec': false,
                'tcgplayer': false,
            }

            if (!data || Object.keys(data).length === 0 || Object.keys(data.cardSites).length === 0) {
                //
            } else {
                cardSites = data.cardSites
            }

            let index = tabs[0].index;

            if (cardSites['cardmarket'] === true) {
                chrome.tabs.create({
                    index: index + 1,
                    url: "https://www.cardmarket.com/en/Magic/Products/Search?searchString=" + query
                }, tab => {
                });
            }
            if (cardSites['wizards.com'] === true) {
                chrome.tabs.create({
                    index: index + 1,
                    url: "http://gatherer.wizards.com/Pages/Search/Default.aspx?name=" + "+[" + rawQuery.replace(/\s+/g, ']+[') + "]"
                }, tab => {
                });
            }
            if (cardSites['cardkingdom'] === true) {
                chrome.tabs.create({
                    index: index + 1,
                    url: "https://www.cardkingdom.com/catalog/search?search=header&filter[name]=" + query.replace(/\s+/g, '+')
                }, tab => {
                });
            }
            if (cardSites['deckbox'] === true) {
                chrome.tabs.create({
                    index: index + 1,
                    url: "https://deckbox.org/mtg/" + query
                }, tab => {
                });
            }
            if (cardSites['mtggoldfish'] === true) {
                chrome.tabs.create({
                    index: index + 1,
                    url: "https://www.mtggoldfish.com/q?utf8=✓&query_string=" + query.replace(/\s+/g, '+')
                }, tab => {
                });
            }
            if (cardSites['edhrec'] === true) {
                chrome.tabs.create({
                    index: index + 1,
                    url: "https://edhrec.com/cards/" + query
                }, tab => {
                });
            }
            if (cardSites['tcgplayer'] === true) {
                chrome.tabs.create({
                    index: index + 1,
                    url: "https://shop.tcgplayer.com/magic/product/show?advancedSearch=true&ProductName=" + query.replace(/\s+/g, '+')
                }, tab => {
                });
            }
        });

    });

};

chrome.contextMenus.create({
    title: "MTG Search Card",
    contexts: ["selection", "link"],
    onclick: searchCard
});
