import juicebox from "https://cdn.jsdelivr.net/npm/juicebox.js@2.2.2/dist/juicebox.esm.js"
import igv from "https://igv.org/web/snapshot/dist/igv.esm.js"

import {BGZip} from "../node_modules/igv-utils/src/index.js"
import {configureContactMapLoaders} from "./contactMapLoad.js"
import throttle from "./throttle.js"
import {projectContacts, updateContactParameters} from "./projectContacts.js"
import {igvLocusChange, jbLocusChange} from "./locusChange.js"
import jbCrosshairsHandler from "./jbCrosshairs.js"
import {jbConfig as defaultJBConfig, igvConfig as defaultIGVConfig} from "./defaultConfig.js"
import {configureTrackLoaders, updateTracksForGenome} from "./trackLoad.js"
import configureShareWidget from "./share.js"

async function init({
                        jbContainer,
                        igvContainer,
                        projectContactsButton,
                        contactsParametersButton
                    }) {

    let igvConfig = defaultIGVConfig
    let jbConfig = defaultJBConfig

    const query = extractQuery()
    if (query.session) {
        const session = JSON.parse(BGZip.uncompressString(query.session.substring(5)))
        igvConfig = session.igv
        jbConfig = session.juicebox
    }

// Insure that query parameters for the components are turned off.
    igvConfig.queryParametersSupported = false
    jbConfig.queryParametersSupported = false

    const igvBrowser = await igv.createBrowser(igvContainer, igvConfig)
    const hicBrowser = await juicebox.init(jbContainer, jbConfig)


// Create load menus
    configureContactMapLoaders(hicBrowser, igvBrowser, updateTracksForGenome)
    configureTrackLoaders(hicBrowser, igvBrowser)

    configureShareWidget(hicBrowser, igvBrowser)

// Setup callbacks for interactions
    igvBrowser.on('locuschange', throttle(igvLocusChange(hicBrowser, igvBrowser), 100))

    hicBrowser.eventBus.subscribe("LocusChange", throttle(jbLocusChange(hicBrowser, igvBrowser), 1000))

    hicBrowser.setCustomCrosshairsHandler(jbCrosshairsHandler(hicBrowser, igvBrowser))


    // "JB -> IGV "Contacts" interactions follows
    // TODO -- this hardcoded dependency on html element IDs is bad, but this is a demo app.
    const binThresholdInput = document.getElementById("binThresholdInput")
    const percentileThresholdInput = document.getElementById("percentileThresholdInput")
    const alphaModifierInput = document.getElementById("alphaModifierInput")
    const contactsEventListener = () => {
        const bThreshold = parseFloat(binThresholdInput.value)
        const pThreshold = parseFloat(percentileThresholdInput.value)
        const aModifier = parseFloat(alphaModifierInput.value)
        updateContactParameters(bThreshold, pThreshold, aModifier)
        projectContacts(hicBrowser, igvBrowser)
    }
    projectContactsButton.addEventListener("click", contactsEventListener)
    contactsParametersButton.addEventListener("click", contactsEventListener)
}


function extractQuery() {

    var i1, i2, i, j, s, query, tokens, uri, key, value

    uri = window.location.href

    query = {}
    i1 = uri.indexOf("?")
    i2 = uri.lastIndexOf("#")

    if (i1 >= 0) {
        if (i2 < 0) i2 = uri.length
        for (i = i1 + 1; i < i2;) {
            j = uri.indexOf("&", i)
            if (j < 0) j = i2

            s = uri.substring(i, j)
            tokens = s.split("=", 2)

            if (tokens.length === 2) {
                key = tokens[0]
                value = decodeURIComponent(tokens[1])
                query[key] = value
                i = j + 1
            } else {
                i++
            }
        }
    }
    return query
}


export {init}