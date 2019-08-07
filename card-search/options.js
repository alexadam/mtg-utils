

const cardSites = {
    'cardmarket': true,
    'wizards.com': false,
    'cardkingdom': false,
    'deckbox': false,
    'mtggoldfish': false,
    'edhrec': false,
    'tcgplayer': false,
}

const saveOptions = () => {
    let allincludeSites = document.getElementsByClassName('includeSite')
    let allColorNames = document.getElementsByClassName('colorName')

    let data = {}

    let index = 0
    for (let variable in cardSites) {
        let value = allincludeSites[index].checked
        data[variable] = value
        index++
    }

    chrome.storage.local.set({
        cardSites: data
    }, () => {
        let status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
            status.textContent = '';
        }, 2750);
    });
}

const restoreOptions = () => {
    chrome.storage.local.get('cardSites', (data) => {
            if (!data || Object.keys(data).length === 0 || Object.keys(data.cardSites).length === 0) {
                createColorsUI(cardSites);
            } else {
                createColorsUI(data.cardSites);
            }
        });
}

const createColorsUI = (data) => {
    let index = 0
    for (let variable in data) {
        if (data.hasOwnProperty(variable)) {
            let includeInput = document.createElement('input')
            includeInput.className = 'includeSite'
            includeInput.type = 'checkbox'
            includeInput.checked = data[variable]
            let cardSiteLabel = document.createElement('span')
            cardSiteLabel.innerText = variable
            cardSiteLabel.className = 'includeSiteLabel'

            let group = document.createElement('div')
            group.id = 'data' + index
            group.appendChild(includeInput)
            group.appendChild(cardSiteLabel)

            let container = document.getElementById('container')
            container.appendChild(group)

            index++
        }
    }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
