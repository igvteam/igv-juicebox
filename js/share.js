import {BGZip} from "../node_modules/igv-utils/src/index.js"

function configureShareWidget(hicBrowser, igvBrowser) {

    const $modal = $('#app-share-modal')
    const shareInput = document.getElementById('app-share-input')
    const copyLinkButton = document.getElementById('app-copy-link-button')

    $modal.on('shown.bs.modal', async () => {

        let href = window.location.href.slice()
        const idx = href.indexOf("?")
        if (idx > 0) {
            href = href.substring(0, idx)
        }

        const hicSession = hicBrowser.toJSON()
        const igvSession = igvBrowser.toJSON()
        const session = {
               "juicebox": hicSession,
               "igv": igvSession
            }
        const sessionString = JSON.stringify(session)
        console.log(sessionString)

        const compressedString = BGZip.compressString(sessionString)

        const shortURL = await shortenURL(href + "?session=blob:" + compressedString)
        shareInput.value = shortURL
        shareInput.select()

    })


    copyLinkButton.addEventListener('click', () => {
        shareInput.select()
        const success = document.execCommand('copy')
        if (success) {
            $modal.modal('hide')
        } else {
            console.error('fail!')
        }
    })
}

async function shortenURL(url) {

    const endpoint = "https://2et6uxfezb.execute-api.us-east-1.amazonaws.com/dev/tinyurl/"
    const enc = encodeURIComponent(url)
    const response = await fetch(`${endpoint}${enc}`)
    if (response.ok) {
        return response.text()
    } else {
        throw new Error(response.statusText)
    }
}

export default configureShareWidget
