/**
 * Defines jb crosshairs -> igv interaction.  Each axis of the crosshair becomes a region of interest in IGV.
 *
 * TODO -- this seems to work but is inefficient.  Ideally we could keep a pointer to a pair of ROI features in igv
 * TODO -- and just update their coordinates here
 *
 * @param hicBrowser
 * @param igvBrowser
 * @returns {(function(*): void)|*}
 */

export default function jbCrosshairsHandler(hicBrowser, igvBrowser) {
    return (s) => {

        const binSize = hicBrowser.getSyncState().binSize
        const gsx = hicBrowser.genomicState('x')
        const gsy = hicBrowser.genomicState('y')

        const roi1 = {chr: gsx.chromosome.name, start: s.xBP - binSize / 2, end: s.xBP + binSize / 2}
        const roi2 = {chr: gsy.chromosome.name, start: s.yBP - binSize / 2, end: s.yBP + binSize / 2}
        igvBrowser.clearROIs()
        igvBrowser.loadROI({color: "rgba(50,0,250,0.2)", features: [roi1, roi2]})
    }
}