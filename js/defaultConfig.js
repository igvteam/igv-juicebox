/**
 * Default configurations for juicebox and igv
 */

const jbConfig = {
    "url": "https://hicfiles.s3.amazonaws.com/hiseq/gm12878/dilution/combined.hic",
    "name": "GM12878",
    "state": "8,8,6,5019.8614387040925,5017.416175745596,640,640,1.7275014631202374,NONE",
    "colorScale": "568,255,0,0",
    "nvi": "11664249584,33929",
    "tracks": [
        {
            "url": "https://www.encodeproject.org/files/ENCFF817TXQ/@@download/ENCFF817TXQ.bedpe.gz",
            "name": "HAP-1 HiC",
            "color": "rgb(180,25,137)"
        }
    ]
}

const igvConfig = {
    genome: "hg19",
    locus: "chr8:125,435,405-133,904,633",
    "tracks": [
        {
            "url": "https://www.encodeproject.org/files/ENCFF000ARZ/@@download/ENCFF000ARZ.bigWig",
            "name": "H3K4me1 ",
            "min": 0,
            "max": 30,
            "color": "rgb(0,150,0)"
        },
        {
            "url": "https://www.encodeproject.org/files/ENCFF000ASF/@@download/ENCFF000ASF.bigWig",
            "name": "H3K4me3 ",
            "min": 0,
            "max": 30,
            "color": "rgb(0,150,0)"
        },
        {
            "url": "https://www.encodeproject.org/files/ENCFF000ASJ/@@download/ENCFF000ASJ.bigWig",
            "name": "H3K27ac ",
            "min": 0,
            "max": 30,
            "color": "rgb(200,0,0)"
        },
        {
            "url": "https://www.encodeproject.org/files/ENCFF000ARJ/@@download/ENCFF000ARJ.bigWig",
            "name": "CTCF ",
            "max": 30
        },
        {
            "name": "HAP-1 HiC",
            "url": "https://www.encodeproject.org/files/ENCFF817TXQ/@@download/ENCFF817TXQ.bedpe.gz",
            "metadata": {
                "Biosample": "Homo sapiens HAP-1",
                "AssayType": "HiC",
                "Target": "",
                "BioRep": "1,2,3",
                "TechRep": "1_1,1_2,1_3,2_1,3_1",
                "OutputType": "long range chromatin interactions",
                "Format": "bedpe",
                "Lab": "Erez Aiden, Baylor",
                "Accession": "ENCFF817TXQ",
                "Experiment": "ENCSR390HMC"
            },
            "format": "bedpe",
            "type": "interact",
            "color": "rgb(180,25,137)",
            "arcType": "nested",
            "arcOrientation": false,
            "thickness": 1,
            height: 180
        },
        {
            id: "jb-interactions",
            type: "interact",
            name: "Contacts",
            //color: "rgba(180, 25, 137, 0.05)",
            height: 125,
            features: [],   // ! Important, signals track that features will be supplied explicitly
            order: 10000  // Just above gene track
        }
    ]
}

export {jbConfig, igvConfig}

