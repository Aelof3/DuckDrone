export default class DuckDroneSettings{
    constructor( ){

        let engineStrength = 30;
        let engineMaxPower = 150;
        let engineMode = "individual";
        this.keynum = 1;
        this.debug = false;

        this.keyselect = {
            keys1: [
                ['s','a'],
                ['w','q']
            ],
            keys2: [
                ['a','q'],
                ['s','w']
            ],
            keys3: [
                ['d','s','a'],
                ['e','w','q']
            ],
            keys4: [
                ['c','x','z'],
                ['d','s','a'],
                ['e','w','q']
            ],
            keys5: [
                ['v','c','x','z'],
                ['f','d','s','a'],
                ['r','e','w','q']
            ],
            keys6: [
                ['m','n','b','v','c','x','z'],
                ['j','h','g','f','d','s','a'],
                ['u','y','t','r','e','w','q'],
            ],
            keys7: [
                ['m','n','b','v','c','x','z'],
                ['j','h','g','f','d','s','a'],
                ['u','y','t','r','e','w','q'],
                ['7','6','5','4','3','2','1']
            ],
            keys8: [
                ['/','.',',','m','n','b','v','c','x','z'],
                [';','l','k','j','h','g','f','d','s','a'],
                ['p','o','i','u','y','t','r','e','w','q'],
                ['0','9','8','7','6','5','4','3','2','1']
            ]
        }

        this.keys = this.keyselect[`keys${this.keynum}`];

        this.sound = true;
        this.music = true;
        
        this.rocketFire = true;

        let sw = 20; // ship width
        let sl = 35; // ship length
        let sh = 30; // ship height
        let ew = sw / this.keys.length - sw / 3; // engine width
        let el = sl / this.keys[0].length  - sl / 3; // engine height

        this.ship = {
            bodyGeometry: {x:sl, y:sh, z:sw},
            engineGeometry: {x:el, y:5, z:ew},
            color: 0x744af8,
            startPos: {x:-200,y:60,z:0},
            engines: {
                engineStrength: engineStrength,
                modes: [
                    "throttle",
                    "throttletoggle",
                    "individual",
                    "individualtoggle"
                ],
                mode: engineMode
            },
            clampRange: engineMaxPower
        }

        this.ground = {
            bodyGeometry:{x:500, y:0.25, z:250},
            color: 0x512afc
        }

        this.gravity = {x:0,y:-19.82,z:0}
    }
}