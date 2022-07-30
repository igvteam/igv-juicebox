import {GenericDataSource, ModalTable} from '../node_modules/data-modal/dist/data-modal.js'

// Hardcode map type for now
// mapType = 'hic-contact-map-dropdown' === id ? 'contact-map' : 'control-map';
const mapType = 'contact-map'

function createContactMapLoaders(hicBrowser, igvBrowser) {
    const mapLoadHandler = async (url, name, mapType) => {
        const isControl = ('control-map' === mapType)
        if (!isControl) hicBrowser.reset()
        await hicBrowser.loadHicFile({url, name, isControl})

        const genomeID = hicBrowser.genome.id
        if (genomeID !== igvBrowser.genome.id) {
            await igvBrowser.loadSession({
                genome: genomeID,
                tracks:
                    [{
                        id: "jb-interactions",
                        type: "interact",
                        name: "Contacts",
                        //color: "rgba(180, 25, 137, 0.05)",
                        height: 125,
                        features: [],   // ! Important, signals track that features will be supplied explicitly
                        order: 10000  // Just above gene track
                    }]
            })
        }
    }

    configureAidenlabMapModal('hic-contact-map-modal', mapLoadHandler)
    configureEncodeMapModal('hic-encode-hosted-contact-map-modal', mapLoadHandler)
    configureFileInput('#contact-map-local', mapLoadHandler)
    configureLoadURLModal('#hic-load-url-modal', mapLoadHandler)
}


function configureAidenlabMapModal(targetID, loadHandler) {

    const url = 'https://aidenlab.org/juicebox/res/hicfiles.json'

    const config = {
        url: url,
        isJSON: true,
        columns:
            ['name', 'author', 'journal', 'year', 'organism', 'reference genome', 'cell type', 'experiment type', 'protocol'],

        // Parser adds NVI parameter, if present,  to URL and insures that all columns have a value
        parser: {
            parse: str => {
                return Object.entries(JSON.parse(str)).map(([url, obj]) => {
                    obj['url'] = obj['NVI'] ? `${url}?nvi=${obj['NVI']}` : url
                    for (let key of config.columns) {
                        obj[key] = obj[key] || ''
                    }
                    return obj
                })
            }
        }
    }
    const datasource = new GenericDataSource(config)

    const modalTableConfig =
        {
            id: targetID,
            title: 'Contact Map',
            selectionStyle: 'single',
            pageLength: 10,
            okHandler: async ([selection]) => {
                const {url, name} = selection
                await loadHandler(url, name, mapType)
            }
        }
    const contactMapModal = new ModalTable(modalTableConfig)
    contactMapModal.setDatasource(datasource)
}

function configureEncodeMapModal(targetID, loadHandler) {

    const encodeContactMapDatasourceConfiguration = {
        url: 'https://s3.amazonaws.com/igv.org.app/encode/hic/hic.txt',
        columns:
            [
                // 'HREF',
                'Assembly',
                'Biosample',
                'Description',
                'BioRep',
                'TechRep',
                'Lab',
                'Accession',
                'Experiment'
            ],
    }
    const datasource = new GenericDataSource(encodeContactMapDatasourceConfiguration)

    const encodeModalTableConfig =
        {
            id: targetID,
            title: 'ENCODE Hosted Contact Map',
            selectionStyle: 'single',
            pageLength: 10,
            okHandler: async ([{HREF, Description}]) => {
                const urlPrefix = 'https://www.encodeproject.org'
                const path = `${urlPrefix}${HREF}`
                await loadHandler(path, Description, mapType)
            }
        }
    new ModalTable(encodeModalTableConfig).setDatasource(datasource)
}

function configureFileInput(inputID, loadHandler) {

    $(inputID).on('change', async function (e) {
        const file = ($(this).get(0).files)[0]

        // NOTE:  this in the callback is a DOM element, jquery weirdness
        $(this).val("")

        const {name} = file
        await loadHandler(file, name, mapType)
    })
}

function configureLoadURLModal(id, loadHandler) {

    const $modal = $(id)
    $modal.find('input').on('change', function () {

        const path = $(this).val()
        $(this).val("")

        $modal.modal('hide')

        loadHandler(path)

    })
}


export {createContactMapLoaders}





