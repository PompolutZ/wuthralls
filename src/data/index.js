import boardsData from "./boards";
import { cardsDb } from "./cardsDb";

const boards = {
    ...boardsData,
};

const factionIndexes = [
    "universal",
    "garreks-reavers",
    "steelhearts-champions",
    "sepulchral-guard",
    "ironskulls-boyz",
    "the-chosen-axes",
    "spiteclaws-swarm",
    "magores-fiends",
    "the-farstriders", // 8

    // NIGHTVAULT

    "stormsires-cursebreakers", // 9
    "thorns-of-the-briar-queen", // 10
    "the-eyes-of-the-nine", // 11
    "zarbags-gitz", // 12
    "godsworn-hunt", // 13
    "mollogs-mob", // 14
    "thundriks-profiteers", // 15
    "yltharis-guardians", // 16

    // DREADFANE

    "ironsouls-condemners", // 17
    "lady-harrows-mournflight", // 18

    // BEASTGRAVE

    "grashraks-despoilers", // 19
    "skaeths-wild-hunt", // 20
    "the-grymwatch", // 21
    "rippas-snarlfangs", // 22
    "hrothgorns-mantrappers", // 23
    "the-wurmspat", // 24
    "morgwaeths-blade-coven", // 25
    "morgoks-krushas", // 26

    // DIRECHASM
    "myaris-purifiers", // 27
    "dread-pageant", // 28
    "khagras-ravagers", // 29
    "the-starblood-stalkers", // 29
    "the-crimson-court", // 31
    "hedkrakkas-madmob",

    "drepurs-wraithcreepers",
];

const warbandColors = {
    "ironsouls-condemners": "#00008B", // darkblue
    "rippas-snarlfangs": "#FF0000", // red
    "stormsires-cursebreakers": "#000080", // navy
    "yltharis-guardians": "#008000", //green
    "the-chosen-axes": "#FF8C00", //dark orange
    "ironskulls-boyz": "#006400", // darkgreen
    "magores-fiends": "#8B0000", // dark red
    "mollogs-mob": "#9370DB", // medium purple
    "thundriks-profiteers": "#4B0082", // indigo
    "garreks-reavers": "#DC143C", // crimson
    "skaeths-wild-hunt": "#FF730D", // orange red
    "thorns-of-the-briar-queen": "#008B8B", // dark cyan
    "the-grymwatch": "#808000", // olive
    "sepulchral-guard": "#800080", // purple
    "lady-harrows-mournflight": "#20B2AA", // light sea green
    "spiteclaws-swarm": "#800000", //maroon
    "zarbags-gitz": "#FFFF00", // yellow
    "the-eyes-of-the-nine": "#00CED1", // dark turquoise
    "steelhearts-champions": "#191970", // midnight blue
    "godsworn-hunt": "#A52A2A", // brown
    "grashraks-despoilers": "#8B4513", // saddle brown
    "hrothgorns-mantrappers": "#4682B4", // steelblue
    "the-wurmspat": "#556B2F", // dark olive
    "the-farstriders": "#0000CD", // medium blue
    "morgwaeths-blade-coven": "#78184a", // pancy purple
    "morgoks-krushas": "#507d2a", // sap green
    // DIRECHASM
    "myaris-purifiers": "#2894C2", // myari blue
    "dread-pageant": "#261943", // night violet
    "khagras-ravagers": "#DFD7AE", // night violet
    "the-starblood-stalkers": "#249489", // temple guard blue
    "the-crimson-court": "#c00000", // free speech red
    "hedkrakkas-madmob": "#006400",

    "drepurs-wraithcreepers": "#20B2AA",
};

const warbands = {
    "steelhearts-champions": [
        {
            type: "FIGHTER",
            icon: "steelhearts-champions-1",
            name: "Steelheart",
        },
        {
            type: "FIGHTER",
            icon: "steelhearts-champions-2",
            name: "Obryn",
        },
        {
            type: "FIGHTER",
            icon: "steelhearts-champions-3",
            name: "Angharad",
        },
    ],

    "morgoks-krushas": [
        {
            type: "FIGHTER",
            icon: "morgoks-krushas-1",
            name: "Morgok",

            counters: "",
            counterTypes: "Waaagh",
        },
        {
            type: "FIGHTER",
            icon: "morgoks-krushas-2",
            name: "’Ardskull",

            counters: "",
            counterTypes: "Waaagh",
        },
        {
            type: "FIGHTER",
            icon: "morgoks-krushas-3",
            name: "Thugg",

            counters: "",
            counterTypes: "Waaagh",
        },
    ],

    "the-wurmspat": [
        {
            type: "FIGHTER",
            icon: "the-wurmspat-1",
            name: "Fecula",
        },
        {
            type: "FIGHTER",
            icon: "the-wurmspat-2",
            name: "Ghulgoch",
        },
        {
            type: "FIGHTER",
            icon: "the-wurmspat-3",
            name: "Sepsimus",
        },
    ],

    "the-farstriders": [
        {
            type: "FIGHTER",
            icon: "the-farstriders-1",
            name: "Sanson",
        },
        {
            type: "FIGHTER",
            icon: "the-farstriders-2",
            name: "Almeric",
        },
        {
            type: "FIGHTER",
            icon: "the-farstriders-3",
            name: "Elias",
        },
    ],

    "ironsouls-condemners": [
        {
            type: "FIGHTER",
            icon: "ironsouls-condemners-1",
            name: "Ironsoul",
        },
        {
            type: "FIGHTER",
            icon: "ironsouls-condemners-2",
            name: "Blightbane",
        },
        {
            type: "FIGHTER",
            icon: "ironsouls-condemners-3",
            name: "Tavian",
        },
    ],

    "rippas-snarlfangs": [
        {
            type: "FIGHTER",
            icon: "rippas-snarlfangs-1",
            name: "Rippa",
        },
        {
            type: "FIGHTER",
            icon: "rippas-snarlfangs-2",
            name: "Stabbit",
        },
        {
            type: "FIGHTER",
            icon: "rippas-snarlfangs-3",
            name: "Mean-Eye",
        },
    ],

    "stormsires-cursebreakers": [
        {
            type: "FIGHTER",
            icon: "stormsires-cursebreakers-1",
            name: "Stormsire",
        },
        {
            type: "FIGHTER",
            icon: "stormsires-cursebreakers-2",
            name: "Ammis",
        },
        {
            type: "FIGHTER",
            icon: "stormsires-cursebreakers-3",
            name: "Rastus",
        },
    ],

    "yltharis-guardians": [
        {
            type: "FIGHTER",
            icon: "yltharis-guardians-1",
            name: "Ylthari",
        },
        {
            type: "FIGHTER",
            icon: "yltharis-guardians-2",
            name: "Ahnslaine",
        },
        {
            type: "FIGHTER",
            icon: "yltharis-guardians-3",
            name: "Gallanghann",
        },
        {
            type: "FIGHTER",
            icon: "yltharis-guardians-4",
            name: "Skhathael",
        },
    ],

    "lady-harrows-mournflight": [
        {
            type: "FIGHTER",
            icon: "lady-harrows-mournflight-1",
            name: "Lady Harrow",
        },
        {
            type: "FIGHTER",
            icon: "lady-harrows-mournflight-2",
            name: "Anguished One",
        },
        {
            type: "FIGHTER",
            icon: "lady-harrows-mournflight-3",
            name: "The Maiden",
        },
        {
            type: "FIGHTER",
            icon: "lady-harrows-mournflight-4",
            name: "Widow Caitha",
        },
    ],

    "the-chosen-axes": [
        {
            type: "FIGHTER",
            icon: "the-chosen-axes-1",
            name: "Fjul",
        },
        {
            type: "FIGHTER",
            icon: "the-chosen-axes-2",
            name: "Tefk",
        },
        {
            type: "FIGHTER",
            icon: "the-chosen-axes-3",
            name: "Vol",
        },
        {
            type: "FIGHTER",
            icon: "the-chosen-axes-4",
            name: "Maegrim",
        },
    ],

    "ironskulls-boyz": [
        {
            type: "FIGHTER",
            icon: "ironskulls-boyz-1",
            name: "Gurzag",
        },
        {
            type: "FIGHTER",
            icon: "ironskulls-boyz-2",
            name: "Bonekutta",
        },
        {
            type: "FIGHTER",
            icon: "ironskulls-boyz-3",
            name: "Hakka",
        },
        {
            type: "FIGHTER",
            icon: "ironskulls-boyz-4",
            name: "Basha",
        },
    ],

    "magores-fiends": [
        {
            type: "FIGHTER",
            icon: "magores-fiends-1",
            name: "Magore",
        },
        {
            type: "FIGHTER",
            icon: "magores-fiends-2",
            name: "Riptooth",
        },
        {
            type: "FIGHTER",
            icon: "magores-fiends-3",
            name: "Zharkus",
        },
        {
            type: "FIGHTER",
            icon: "magores-fiends-4",
            name: "Ghartok",
        },
    ],

    "mollogs-mob": [
        {
            type: "FIGHTER",
            icon: "mollogs-mob-1",
            name: "Mollog",
        },
        {
            type: "FIGHTER",
            icon: "mollogs-mob-2",
            name: "Bat Squig",
        },
        {
            type: "FIGHTER",
            icon: "mollogs-mob-3",
            name: "Stalagsquig",
        },
        {
            type: "FIGHTER",
            icon: "mollogs-mob-4",
            name: "Spiteshroom",
        },
    ],

    "thundriks-profiteers": [
        {
            type: "FIGHTER",
            icon: "thundriks-profiteers-1",
            name: "Thundrik",
        },
        {
            type: "FIGHTER",
            icon: "thundriks-profiteers-2",
            name: "Dead-Eye Lund",
        },
        {
            type: "FIGHTER",
            icon: "thundriks-profiteers-3",
            name: "Ironhail",
        },
        {
            type: "FIGHTER",
            icon: "thundriks-profiteers-4",
            name: "Drakkskewer",
        },
        {
            type: "FIGHTER",
            icon: "thundriks-profiteers-5",
            name: "Alensen",
        },
    ],

    "the-eyes-of-the-nine": [
        {
            type: "FIGHTER",
            icon: "the-eyes-of-the-nine-1",
            name: "Vortemis",
        },
        {
            type: "FIGHTER",
            icon: "the-eyes-of-the-nine-2",
            name: "K'charic",
        },
        {
            type: "FIGHTER",
            icon: "the-eyes-of-the-nine-3",
            name: "Narvia",
        },
        {
            type: "FIGHTER",
            icon: "the-eyes-of-the-nine-4",
            name: "Turosh",
        },
        {
            type: "FIGHTER",
            icon: "the-eyes-of-the-nine-5",
            name: "Blue Horror",
            iconInspired: "the-eyes-of-the-nine-5-inspired",
            nameInspired: "Brimstone Horrors",
        },
    ],

    "garreks-reavers": [
        {
            type: "FIGHTER",
            icon: "garreks-reavers-1",
            name: "Garrek",
        },
        {
            type: "FIGHTER",
            icon: "garreks-reavers-2",
            name: "Saek",
        },
        {
            type: "FIGHTER",
            icon: "garreks-reavers-3",
            name: "Karsus",
        },
        {
            type: "FIGHTER",
            icon: "garreks-reavers-4",
            name: "Targor",
        },
        {
            type: "FIGHTER",
            icon: "garreks-reavers-5",
            name: "Arnulf",
        },
    ],

    "spiteclaws-swarm": [
        {
            type: "FIGHTER",
            icon: "spiteclaws-swarm-1",
            name: "Skritch",
        },
        {
            type: "FIGHTER",
            icon: "spiteclaws-swarm-2",
            name: "Krrk",
        },
        {
            type: "FIGHTER",
            icon: "spiteclaws-swarm-3",
            name: "Lurking",
        },
        {
            type: "FIGHTER",
            icon: "spiteclaws-swarm-4",
            name: "Festering",
        },
        {
            type: "FIGHTER",
            icon: "spiteclaws-swarm-5",
            name: "Hungering",
        },
    ],

    "morgwaeths-blade-coven": [
        {
            type: "FIGHTER",
            icon: "morgwaeths-blade-coven-1",
            name: "Morgwaeth",
        },
        {
            type: "FIGHTER",
            icon: "morgwaeths-blade-coven-2",
            name: "Kyrae",
        },
        {
            type: "FIGHTER",
            icon: "morgwaeths-blade-coven-3",
            name: "Khamyss",
        },
        {
            type: "FIGHTER",
            icon: "morgwaeths-blade-coven-4",
            name: "Kyrssa",
        },
        {
            type: "FIGHTER",
            icon: "morgwaeths-blade-coven-5",
            name: "Lethyr",
        },
    ],

    "godsworn-hunt": [
        {
            type: "FIGHTER",
            icon: "godsworn-hunt-1",
            name: "Theddra",
        },
        {
            type: "FIGHTER",
            icon: "godsworn-hunt-2",
            name: "Grundann",
        },
        {
            type: "FIGHTER",
            icon: "godsworn-hunt-3",
            name: "Jagathra",
        },
        {
            type: "FIGHTER",
            icon: "godsworn-hunt-4",
            name: "Shond",
        },
        {
            type: "FIGHTER",
            icon: "godsworn-hunt-5",
            name: "Ollo",
        },
        {
            type: "FIGHTER",
            icon: "godsworn-hunt-6",
            name: "Grawl",
        },
    ],

    "hrothgorns-mantrappers": [
        {
            type: "FIGHTER",
            icon: "hrothgorns-mantrappers-1",
            name: "Hrothgorn",
        },
        {
            type: "FIGHTER",
            icon: "hrothgorns-mantrappers-2",
            name: "Thrafnir",
        },
        {
            type: "FIGHTER",
            icon: "hrothgorns-mantrappers-3",
            name: "Luggit and Thwak",
        },
        {
            type: "FIGHTER",
            icon: "hrothgorns-mantrappers-4",
            name: "Quiv",
        },
        {
            type: "FIGHTER",
            icon: "hrothgorns-mantrappers-5",
            name: "Bushwakka",
        },
        {
            type: "FIGHTER",
            subtype: "TRAP",
            icon: "hrothgorns-mantrappers-6",
            name: "Bushwakka's trap",
            from: { x: -1, y: -1 },
            onBoard: { x: -1, y: -1 },
            isOnBoard: false,
        },
    ],

    "grashraks-despoilers": [
        {
            type: "FIGHTER",
            icon: "grashraks-despoilers-1",
            name: "Grashrak",

            counters: "Ritual",
            counterTypes: "Ritual",
        },
        {
            type: "FIGHTER",
            icon: "grashraks-despoilers-2",
            name: "Draknar",
        },
        {
            type: "FIGHTER",
            icon: "grashraks-despoilers-3",
            name: "Gnarl",
        },
        {
            type: "FIGHTER",
            icon: "grashraks-despoilers-4",
            name: "Ushkor",
        },
        {
            type: "FIGHTER",
            icon: "grashraks-despoilers-5",
            name: "Murghoth",
        },
        {
            type: "FIGHTER",
            icon: "grashraks-despoilers-6",
            name: "Korsh",
        },
    ],

    "skaeths-wild-hunt": [
        {
            type: "FIGHTER",
            icon: "skaeths-wild-hunt-1",
            name: "Skaeth",
        },
        {
            type: "FIGHTER",
            icon: "skaeths-wild-hunt-2",
            name: "Lighaen",
        },
        {
            type: "FIGHTER",
            icon: "skaeths-wild-hunt-3",
            name: "Karthaen",

            counters: "",
            counterTypes: "Horn",
        },
        {
            type: "FIGHTER",
            icon: "skaeths-wild-hunt-4",
            name: "Sheoch",
        },
        {
            type: "FIGHTER",
            icon: "skaeths-wild-hunt-5",
            name: "Althaen",
        },
    ],

    "thorns-of-the-briar-queen": [
        {
            type: "FIGHTER",
            icon: "thorns-of-the-briar-queen-1",
            name: "Briar Queen",
        },
        {
            type: "FIGHTER",
            icon: "thorns-of-the-briar-queen-2",
            name: "Varclav",
        },
        {
            type: "FIGHTER",
            icon: "thorns-of-the-briar-queen-3",
            name: "The Ever-hanged",
        },
        {
            type: "FIGHTER",
            icon: "thorns-of-the-briar-queen-4",
            name: "Chainrasp",
        },
        {
            type: "FIGHTER",
            icon: "thorns-of-the-briar-queen-5",
            name: "Chainrasp",
        },
        {
            type: "FIGHTER",
            icon: "thorns-of-the-briar-queen-6",
            name: "Chainrasp",
        },
        {
            type: "FIGHTER",
            icon: "thorns-of-the-briar-queen-7",
            name: "Chainrasp",
        },
    ],

    "the-grymwatch": [
        {
            type: "FIGHTER",
            icon: "the-grymwatch-1",
            name: "Duke",
        },
        {
            type: "FIGHTER",
            icon: "the-grymwatch-2",
            name: "Gristlewel",
        },
        {
            type: "FIGHTER",
            icon: "the-grymwatch-3",
            name: "Master Talon",

            counters: "",
            counterTypes: "Feast",
        },
        {
            type: "FIGHTER",
            icon: "the-grymwatch-4",
            name: "Herald",
        },
        {
            type: "FIGHTER",
            icon: "the-grymwatch-5",
            name: "Butcher",
        },
        {
            type: "FIGHTER",
            icon: "the-grymwatch-6",
            name: "Valreek",
        },
        {
            type: "FIGHTER",
            icon: "the-grymwatch-7",
            name: "Harriers",
        },
    ],

    "sepulchral-guard": [
        {
            type: "FIGHTER",
            icon: "sepulchral-guard-1",
            name: "Warden",
        },
        {
            type: "FIGHTER",
            icon: "sepulchral-guard-2",
            name: "Champion",
        },
        {
            type: "FIGHTER",
            icon: "sepulchral-guard-3",
            name: "Prince",
        },
        {
            type: "FIGHTER",
            icon: "sepulchral-guard-4",
            name: "Harvester",
        },
        {
            type: "FIGHTER",
            icon: "sepulchral-guard-5",
            name: "Petitioner 1",
        },
        {
            type: "FIGHTER",
            icon: "sepulchral-guard-6",
            name: "Petitioner 2",
        },
        {
            type: "FIGHTER",
            icon: "sepulchral-guard-7",
            name: "Petitioner 3",
        },
    ],

    "zarbags-gitz": [
        {
            type: "FIGHTER",
            icon: "zarbags-gitz-1",
            name: "Zarbag",
        },
        {
            type: "FIGHTER",
            icon: "zarbags-gitz-2",
            name: "Sourtongue",
        },
        {
            type: "FIGHTER",
            icon: "zarbags-gitz-3",
            name: "Drizgit",
        },
        {
            type: "FIGHTER",
            icon: "zarbags-gitz-4",
            name: "Bonekrakka",
        },
        {
            type: "FIGHTER",
            icon: "zarbags-gitz-5",
            name: "Gobbaluk",
        },
        {
            type: "FIGHTER",
            icon: "zarbags-gitz-6",
            name: "Prog",
        },
        {
            type: "FIGHTER",
            icon: "zarbags-gitz-7",
            name: "Stikkit",
        },
        {
            type: "FIGHTER",
            icon: "zarbags-gitz-8",
            name: "Redkap",
        },
        {
            type: "FIGHTER",
            icon: "zarbags-gitz-9",
            name: "Dibbz",
        },
    ],

    // DIRECHASM
    "myaris-purifiers": [
        {
            type: "FIGHTER",
            icon: "myaris-purifiers-1",
            name: "Myari",

            counters: "Aetherquartz",
            counterTypes: "Aetherquartz",
        },
        {
            type: "FIGHTER",
            icon: "myaris-purifiers-2",
            name: "Bahannar",

            counters: "Aetherquartz",
            counterTypes: "Aetherquartz",
        },
        {
            type: "FIGHTER",
            icon: "myaris-purifiers-3",
            name: "Ailenn",

            counters: "Aetherquartz",
            counterTypes: "Aetherquartz",
        },
        {
            type: "FIGHTER",
            icon: "myaris-purifiers-4",
            name: "Senaela",

            counters: "Aetherquartz",
            counterTypes: "Aetherquartz",
        },
    ],

    "dread-pageant": [
        {
            type: "FIGHTER",
            icon: "dread-pageant-1",
            name: "Vasillac",
        },
        {
            type: "FIGHTER",
            icon: "dread-pageant-2",
            name: "Glissete",
        },
        {
            type: "FIGHTER",
            icon: "dread-pageant-3",
            name: "Hadzu",
        },
        {
            type: "FIGHTER",
            icon: "dread-pageant-4",
            name: "Slakeslash",
        },
    ],

    "khagras-ravagers": [
        {
            type: "FIGHTER",
            icon: "khagras-ravagers-1",
            name: "Khagra",
        },
        {
            type: "FIGHTER",
            icon: "khagras-ravagers-2",
            name: "Cragan",
        },
        {
            type: "FIGHTER",
            icon: "khagras-ravagers-3",
            name: "Razek",
        },
        {
            type: "FIGHTER",
            icon: "khagras-ravagers-4",
            name: "Zarshia",
        },
    ],

    "the-starblood-stalkers": [
        {
            type: "FIGHTER",
            icon: "the-starblood-stalkers-1",
            name: "Kixi-Taka",
        },
        {
            type: "FIGHTER",
            icon: "the-starblood-stalkers-2",
            name: "Klaq-Trok",
        },
        {
            type: "FIGHTER",
            icon: "the-starblood-stalkers-3",
            name: "Otapatl",
        },
        {
            type: "FIGHTER",
            icon: "the-starblood-stalkers-4",
            name: "Tok",
        },
        {
            type: "FIGHTER",
            icon: "the-starblood-stalkers-5",
            name: "Xepic",
        },
        {
            type: "FIGHTER",
            icon: "the-starblood-stalkers-6",
            name: "Huachi",
        },
    ],

    "the-crimson-court": [
        {
            type: "FIGHTER",
            icon: "the-crimson-court-1",
            name: "Duvalle",
            counters: "Hunger1",
        },
        {
            type: "FIGHTER",
            icon: "the-crimson-court-2",
            name: "Gorath",
            counters: "Hunger1",
        },
        {
            type: "FIGHTER",
            icon: "the-crimson-court-3",
            name: "Vellas",
            counters: "Hunger1",
        },
        {
            type: "FIGHTER",
            icon: "the-crimson-court-4",
            name: "Ennias",
            counters: "Hunger1",
        },
    ],

    "hedkrakkas-madmob": [
        {
            type: "FIGHTER",
            icon: "hedkrakkas-madmob-1",
            name: "Hedkrakka",
        },
        {
            type: "FIGHTER",
            icon: "hedkrakkas-madmob-2",
            name: "Wollop",
        },
        {
            type: "FIGHTER",
            icon: "hedkrakkas-madmob-3",
            name: "Toofdagga",
        },
        {
            type: "FIGHTER",
            icon: "hedkrakkas-madmob-4",
            name: "Dakko",
        },
    ],

    "drepurs-wraithcreepers": [
        {
            type: "FIGHTER",
            icon: "drepurs-wraithcreepers-1",
            name: "Drepur",
        },
        {
            type: "FIGHTER",
            icon: "drepurs-wraithcreepers-2",
            name: "Grodrig",
        },
        {
            type: "FIGHTER",
            icon: "drepurs-wraithcreepers-3",
            name: "Haqfel",
        },
        {
            type: "FIGHTER",
            icon: "drepurs-wraithcreepers-4",
            name: "Patrician",
        },
    ],
};

export { boards, cardsDb, factionIndexes, warbandColors, warbands };
