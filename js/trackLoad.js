import {GenericDataSource, ModalTable} from '../node_modules/data-modal/dist/data-modal.js'
import {encodeTrackDatasourceConfigurator, supportsGenome} from "./encodeTrackDatasourceConfigurator.js"

let encodeModals = new Map()

function configureTrackLoaders(hicBrowser, igvBrowser) {

    const loadHandler = async (configList) => {
        await igvBrowser.loadTrackList(configList)
    }

    configureEncodeModal({targetID: 'encode-signal-tracks-modal', type: 'signals', genomeID: "hg19"}, loadHandler)
    configureEncodeModal({targetID: 'encode-other-tracks-modal', type: 'other', genomeID: "hg19"}, loadHandler)
    configureFileInput('#track-file-input', loadHandler)
    configureLoadURLModal('#track-load-url-modal', loadHandler)
}

function configureEncodeModal({targetID, type, genomeID}, loadHandler) {

    const datasource = (new GenericDataSource(encodeTrackDatasourceConfigurator(genomeID, type)))

    const encodeModalTableConfig =
        {
            id: targetID,
            title: 'ENCODE',
            selectionStyle: 'multiple',
            pageLength: 10,
            okHandler: async (result) => {
                if (result) {
                    loadHandler(result)
                }
            }
        }
    const modal = new ModalTable(encodeModalTableConfig)
    modal.setDatasource(datasource)
    encodeModals.set(type, modal)
}

function configureFileInput(inputID, loadHandler) {

    $(inputID).on('change', async function (e) {
        const file = ($(this).get(0).files)[0]

        // NOTE:  this in the callback is a DOM element, jquery weirdness
        $(this).val("")

        loadHandler([{url: file, name: file.name}])
    })
}

function configureLoadURLModal(id, loadHandler) {

    const $modal = $(id)
    $modal.find('input').on('change', function () {

        const url = $(this).val()
        $(this).val("")

        $modal.modal('hide')

        loadHandler([{url}])

    })
}

function updateTracksForGenome(genomeID) {

    for(let type of encodeModals.keys()) {
        const modal = encodeModals.get(type)
        if(supportsGenome(genomeID)) {
            modal.setDatasource((new GenericDataSource(encodeTrackDatasourceConfigurator(genomeID, type))))
        } else {
            modal.setDatasource(EmptyTableDataSource)
        }
    }
}


const EmptyTableDataSource = {
    tableColumns: async () => [],
    tableData: async () => []
}

export {configureTrackLoaders, updateTracksForGenome}





