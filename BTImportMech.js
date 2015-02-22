//Designed to bring in mech specs based on text description stored in character bio.
//Uses SSW formatting
// 1: Load mech in SSW
// 2: copy mech data to clipboard
// 3: paste mech data in the "bio" part of the character sheet
// 4: type "!ResetMech". Can also type "!ResetMech:(Character Name)" and reset
// someone else's sheet for them
var BTImportMech = BTImportMech || (function() {
    //Keys are attribute variable names in Roll20
    //Values are keys for armorVal structure used to call setArmor
    var attrIndex = {
        armorAttr: {
            "lefttorso_armor": "L/R Torso",
            "righttorso_armor": "L/R Torso",
            "centertorso_armor": "Center Torso",
            "lefttorso_rear_armor": "L/R Torso (rear)",
            "righttorso_rear_armor": "L/R Torso (rear)",
            "centertorso_rear_armor": "Center Torso (rear)",
            "leftarm_armor": "L/R Arm",
            "rightarm_armor": "L/R Arm",
            "leftleg_armor": "L/R Leg",
            "rightleg_armor": "L/R Leg",
            "head_armor": "Head"
        },
        structAttr: {
            "lefttorso_internalstructure": "L/R Torso",
            "righttorso_internalstructure": "L/R Torso",
            "centertorso_internalstructure": "Center Torso",
            "leftarm_internalstructure": "L/R Arm",
            "rightarm_internalstructure": "L/R Arm",
            "leftleg_internalstructure": "L/R Leg",
            "rightleg_internalstructure": "L/R Leg",
            "head_internalstructure": "Head"

        },
        MPAttr: {
            "mech_walk": 0,
            "mech_run": 0,
            "mech_sprint": 0,
            "mech_jump": 0

        },
        miscAttr: {
            "mech_name": "Gundam",
            "mech_tonnage": 0

        }
    };

    //Slots are stored in an array so that we maintain the order inside each section
    var critsTable = {
        ctu: [{
            name: "centertorso_a1",
            value: "Roll Again"
        }, {
            name: "centertorso_a2",
            value: "Roll Again"
        }, {
            name: "centertorso_a3",
            value: "Roll Again"
        }, {
            name: "centertorso_a4",
            value: "Roll Again"
        }, {
            name: "centertorso_a5",
            value: "Roll Again"
        }, {
            name: "centertorso_a6",
            value: "Roll Again"
        }],
        ctl: [{
            name: "centertorso_b1",
            value: "Roll Again"
        }, {
            name: "centertorso_b2",
            value: "Roll Again"
        }, {
            name: "centertorso_b3",
            value: "Roll Again"
        }, {
            name: "centertorso_b4",
            value: "Roll Again"
        }, {
            name: "centertorso_b5",
            value: "Roll Again"
        }, {
            name: "centertorso_b6",
            value: "Roll Again"
        }],
        rtu: [{
            name: "righttorso_a1",
            value: "Roll Again"
        }, {
            name: "righttorso_a2",
            value: "Roll Again"
        }, {
            name: "righttorso_a3",
            value: "Roll Again"
        }, {
            name: "righttorso_a4",
            value: "Roll Again"
        }, {
            name: "righttorso_a5",
            value: "Roll Again"
        }, {
            name: "righttorso_a6",
            value: "Roll Again"
        }],
        rtl: [{
            name: "righttorso_b1",
            value: "Roll Again"
        }, {
            name: "righttorso_b2",
            value: "Roll Again"
        }, {
            name: "righttorso_b3",
            value: "Roll Again"
        }, {
            name: "righttorso_b4",
            value: "Roll Again"
        }, {
            name: "righttorso_b5",
            value: "Roll Again"
        }, {
            name: "righttorso_b6",
            value: "Roll Again"
        }],
        ltu: [{
            name: "lefttorso_a1",
            value: "Roll Again"
        }, {
            name: "lefttorso_a2",
            value: "Roll Again"
        }, {
            name: "lefttorso_a3",
            value: "Roll Again"
        }, {
            name: "lefttorso_a4",
            value: "Roll Again"
        }, {
            name: "lefttorso_a5",
            value: "Roll Again"
        }, {
            name: "lefttorso_a6",
            value: "Roll Again"
        }],
        ltl: [{
            name: "lefttorso_b1",
            value: "Roll Again"
        }, {
            name: "lefttorso_b2",
            value: "Roll Again"
        }, {
            name: "lefttorso_b3",
            value: "Roll Again"
        }, {
            name: "lefttorso_b4",
            value: "Roll Again"
        }, {
            name: "lefttorso_b5",
            value: "Roll Again"
        }, {
            name: "lefttorso_b6",
            value: "Roll Again"
        }],
        rau: [{
            name: "rightarm_a1",
            value: "Roll Again"
        }, {
            name: "rightarm_a2",
            value: "Roll Again"
        }, {
            name: "rightarm_a3",
            value: "Roll Again"
        }, {
            name: "rightarm_a4",
            value: "Roll Again"
        }, {
            name: "rightarm_a5",
            value: "Roll Again"
        }, {
            name: "rightarm_a6",
            value: "Roll Again"
        }],
        ral: [{
            name: "rightarm_b1",
            value: "Roll Again"
        }, {
            name: "rightarm_b2",
            value: "Roll Again"
        }, {
            name: "rightarm_b3",
            value: "Roll Again"
        }, {
            name: "rightarm_b4",
            value: "Roll Again"
        }, {
            name: "rightarm_b5",
            value: "Roll Again"
        }, {
            name: "rightarm_b6",
            value: "Roll Again"
        }],
        lau: [{
            name: "leftarm_a1",
            value: "Roll Again"
        }, {
            name: "leftarm_a2",
            value: "Roll Again"
        }, {
            name: "leftarm_a3",
            value: "Roll Again"
        }, {
            name: "leftarm_a4",
            value: "Roll Again"
        }, {
            name: "leftarm_a5",
            value: "Roll Again"
        }, {
            name: "leftarm_a6",
            value: "Roll Again"
        }],
        lal: [{
            name: "leftarm_b1",
            value: "Roll Again"
        }, {
            name: "leftarm_b2",
            value: "Roll Again"
        }, {
            name: "leftarm_b3",
            value: "Roll Again"
        }, {
            name: "leftarm_b4",
            value: "Roll Again"
        }, {
            name: "leftarm_b5",
            value: "Roll Again"
        }, {
            name: "leftarm_b6",
            value: "Roll Again"
        }],
        rl: [{
            name: "rightleg_a1",
            value: "Roll Again"
        }, {
            name: "rightleg_a2",
            value: "Roll Again"
        }, {
            name: "rightleg_a3",
            value: "Roll Again"
        }, {
            name: "rightleg_a4",
            value: "Roll Again"
        }, {
            name: "rightleg_a5",
            value: "Roll Again"
        }, {
            name: "rightleg_a6",
            value: "Roll Again"
        }],
        ll: [{
            name: "leftleg_a1",
            value: "Roll Again"
        }, {
            name: "leftleg_a2",
            value: "Roll Again"
        }, {
            name: "leftleg_a3",
            value: "Roll Again"
        }, {
            name: "leftleg_a4",
            value: "Roll Again"
        }, {
            name: "leftleg_a5",
            value: "Roll Again"
        }, {
            name: "leftleg_a6",
            value: "Roll Again"
        }],
        hd: [{
            name: "head_a1",
            value: "Roll Again"
        }, {
            name: "head_a2",
            value: "Roll Again"
        }, {
            name: "head_a3",
            value: "Roll Again"
        }, {
            name: "head_a4",
            value: "Roll Again"
        }, {
            name: "head_a5",
            value: "Roll Again"
        }, {
            name: "head_a6",
            value: "Roll Again"
        }]
    };

    // for now I use this to create empty strings to set into the critical 
    // slot parts for each limb *** currently unecessary, only kept in case we need it later 
    /*function emptystr(num){
    var arr = [];
    for(var i=0;i<num;i++){
        arr.push(' ');
        }
    return arr;
    }*/


    //Checks if an attribute is defined for a character already
    function attrUndefined(charID, attr) {
            attrObj = findObjs({
                _characterid: charID,
                _type: "attribute",
                name: attr
            })[0];

            if (attrObj === undefined) {
                return true;
            } else {
                return false;
            }
        }
        //Creates attributes if they don't exist. Should be run before any function
        //that modifies attributes.
    function setAttr(charID) {
        for (var type in attrIndex) {
            if (_.has(attrIndex, type)) {
                for (var attr in attrIndex[type]) {
                    if (attrUndefined(charID, attr)) {
                        createObj("attribute", {
                            name: attr,
                            characterid: charID
                        });
                    }
                }
            }
        }
    }

    function setCrits(charID) {
        for (section in critsTable) {
            //log(section);
            for (slot in critsTable[section]) {
                if (attrUndefined(charID, critsTable[section][slot].name)) {
                    createObj("attribute", {
                        name: critsTable[section][slot].name,
                        characterid: charID
                    });
                }
                var mechCrit = findObjs({
                    _characterid: charID,
                    _type: "attribute",
                    name: critsTable[section][slot].name,
                })[0];
                mechCrit.set("current", critsTable[section][slot].value);
                //log(mechCrit);
                //log(critsTable[section][slot]);    
            }
        }
    }




    function setName(charID, name) {
        var mechAttr = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "mech_name"
        })[0];
        mechAttr.set("current", name);
        return;
    }

    function setTonnage(charID, ton) {
        var mechAttr = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "mech_tonnage"
        })[0];
        mechAttr.set("current", ton);
        return;
    }

    //Gets armor and internal structure values 
    function getArmor(mechData) {
        //Container for all mech armor and internal structure values
        var mechArmor = {};

        //Matching all entries of head armor and internal structure
        head = mechData.match(/Head\s*(\d)+\s*(\d)*/g);
        arrlength = head.length;
        for (var i = 0; i < arrlength; i++) {
            headKey = head[i].match(/Head/g);
            headValue = head[i].match(/(\d)+/g);
            mechArmor[headKey] = headValue;
        }
        //Matching all entries of torso armor and internal structure
        torso = mechData.match(/(([\w\/])* Torso [\(\)a-z]*)\s*(\d)*\s*(\d)*/g);
        arrlength = torso.length;
        for (i = 0; i < arrlength; i++) {
            torsoKey = torso[i].match(/([\w\/])* Torso( \(rear\))?/g);
            torsoValue = torso[i].match(/(\d)+/g);
            mechArmor[torsoKey] = torsoValue;
        }
        //So far, I've only seen 1 arm entry. Not sure how asymmetrical mechs
        //are formatted. Have made the regex generic in case it does Left  Arm
        // and Right Arm
        arm = mechData.match(/[A-z\/]+ Arm\s*(\d)+\s*(\d)*/g);
        arrlength = arm.length;
        for (i = 0; i < arrlength; i++) {
            armKey = arm[i].match(/[A-z\/]+ Arm/g);
            armValue = arm[i].match(/(\d)+/g);
            mechArmor[armKey] = armValue;
        }
        leg = mechData.match(/[A-z\/]+ Leg\s*(\d)+\s*(\d)*/g);
        arrlength = leg.length;
        for (i = 0; i < arrlength; i++) {
            legKey = leg[i].match(/[A-z\/]+ Leg/g);
            legValue = leg[i].match(/(\d)+/g);
            mechArmor[legKey] = legValue;
        }
        //log(mechArmor);
        return mechArmor;
    }

    function setArmor(charID, armorVal) {
        //Will go through each entry in the armorAttr table and set armor values
        for (var attr in attrIndex.armorAttr) {
            if (_.has(attrIndex.armorAttr, attr)) {
                //Grabbing the values for this location inside passed armorVal object
                //Currently based on text input in Bio section
                armorStats = armorVal[attrIndex.armorAttr[attr]];
                //Armor is the last value in all entries
                armorIndex = armorStats.length - 1;
                armorObj = findObjs({
                    _characterid: charID,
                    _type: "attribute",
                    name: attr
                })[0];
                armorObj.set("current", armorStats[armorIndex]);
                armorObj.set("max", armorStats[armorIndex]);
            }
        }

        //will go through each entry in the structAttr table and set structure values
        for (var attr in attrIndex.structAttr) {
            if (_.has(attrIndex.structAttr, attr)) {
                structStats = armorVal[attrIndex.structAttr[attr]];
                //Structure is the first value in all entries with structure
                //Do not need variable, since it's always 0
                structObj = findObjs({
                    _characterid: charID,
                    _type: "attribute",
                    name: attr
                })[0];
                structObj.set("current", structStats[0]);
                structObj.set("max", structStats[0]);
            }
        }
    }



    function getMP(mechData) {
        var mechMove = {};

        //Grabs Walking MP entries
        walk = mechData.match(/Walking MP: \d+/g);
        walkKey = "Walking MP";
        walkValue = walk[0].match(/\d+/g);
        mechMove[walkKey] = walkValue;

        //Grabs Running MP entries
        run = mechData.match(/Running MP: \d+/g);
        runKey = "Running MP";
        runValue = run[0].match(/\d+/g);
        mechMove[runKey] = runValue;

        //Grabs Jumping MP entries
        jump = mechData.match(/Jumping MP: \d+/g);
        jumpKey = "Jumping MP";
        jumpValue = jump[0].match(/\d+/g);
        mechMove[jumpKey] = jumpValue;

        return mechMove;
    }

    function setMP(charID, moveProfile) {
        mechWalk = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "mech_walk"
        })[0];

        mechRun = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "mech_run"
        })[0];

        mechJump = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "mech_jump"
        })[0];

        mechSprint = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "mech_sprint"
        })[0];

        //Calculates sprinting speed as (Walk+1)*1.5
        sprintSpeed = Math.ceil((parseInt(moveProfile["Walking MP"][0]) + 1) * 1.5);

        mechWalk.set("current", moveProfile["Walking MP"][0]);
        mechRun.set("current", moveProfile["Running MP"][0]);
        mechJump.set("current", moveProfile["Jumping MP"][0]);
        mechSprint.set("current", sprintSpeed);
    }

    function getEngine(mechData) {
        //Finds the engine type (just reads the first word)
        engine = mechData.match(/(Engine:\s+)(\w+)/);
        //log(engine[2]);
        return engine[2];
    }

    function getGyro(mechData) {
            //Finds the gyro type (just reads the first word)
            gyro = mechData.match(/(Gyro:\s+)(\w+)/);
            return gyro[2];
        }
        /* 2/21, this needs some work on the regex
            function getArms(mechData){
            Actuators=mechData.match(/(Actuators:\s+)([\w]:[\s])([\S]*)(\s)([\w]:[\s])([\S]*)/);
            log(Actuators)
            return
        }*/
    function getCockpit(mechData) {
        //Finds the Cockpit type (just reads the first word)
        Cockpit = mechData.match(/(Cockpit:\s+)(\w+)/);
        return Cockpit[2];
    }

    function getHeatsinks(mechData) {
        var Heatsinktype = {};
        //Finds the Heatsink type (just reads the first word)
        //sinkType determines whether Double or Single Heat sinks are on the mech
        sinkType = mechData.match(/(Heat Sinks:\s+)(\w+)/);
        //find all the locaitons of the heat sinks
        sinkLocation = mechData.match(/(Heat Sink Locations:\s+)([\w\s,]+)/);
        //log("sink locations: ");
        //log(sinkLocation);
        return {
            "Type": sinkType,
            "Locations": sinkLocation
        };
    }

    function setGyro(gyro, engine) {
        if (gyro === "Standard") {
            critsTable.ctu[3].value = "Gyro";
            critsTable.ctu[4].value = "Gyro";
            critsTable.ctu[5].value = "Gyro";
            critsTable.ctl[0].value = "Gyro";
        } else if (gyro === "Heavy") {
            critsTable.ctu[3].value = "Heavy Duty Gyro";
            critsTable.ctu[4].value = "Heavy Duty Gyro";
            critsTable.ctu[5].value = "Heavy Duty Gyro";
            critsTable.ctl[0].value = "Heavy Duty Gyro";
        } else if (gyro === "Compact") {
            critsTable.ctu[3].value = "Compact Gyro";
            critsTable.ctu[4].value = "Compact Gyro";
        } else if (gyro === "XL") {
            critsTable.ctu[3].value = "XL Gyro";
            critsTable.ctu[4].value = "XL Gyro";
            critsTable.ctu[5].value = "XL Gyro";
            critsTable.ctl[0].value = "XL Gyro";
            critsTable.ctl[1].value = "XL Gyro";
            critsTable.ctl[2].value = "XL Gyro";
            if (engine === "XL") {
                critsTable.ctl[3].value = "XL Fusion Engine";
                critsTable.ctl[4].value = "XL Fusion Engine";
                critsTable.ctl[5].value = "XL Fusion Engine";
            } else if (engine === "Light") {
                critsTable.ctl[3].value = "Light Fusion Engine";
                critsTable.ctl[4].value = "Light Fusion Engine";
                critsTable.ctl[5].value = "Light Fusion Engine";
            } else if (engine === "Fusion") {
                critsTable.ctl[3].value = "Fusion Engine";
                critsTable.ctl[4].value = "Fusion Engine";
                critsTable.ctl[5].value = "Fusion Engine";
            }
        }
    }

    function setEngine(engine) {
        if (engine === "XL") {
            for (var i = 0; i < 3; i++) {
                critsTable.ctu[i].value = "XL Fusion Engine";
                critsTable.ctl[i + 1].value = "XL Fusion Engine";
                critsTable.rtu[i].value = "XL Fusion Engine";
                critsTable.ltu[i].value = "XL Fusion Engine";
            }
        } else if (engine === "Compact") {
            for (var i = 0; i < 3; i++) {
                critsTable.ctu[i].value = "Compact Fusion Engine";
            }
        } else if (engine === "Light") {
            for (var i = 0; i < 3; i++) {
                critsTable.ctu[i].value = "Light Fusion Engine";
                critsTable.ctl[i + 1].value = "Light Fusion Engine";
            }
            for (var i = 0; i < 2; i++) {
                critsTable.rtu[i].value = "Light Fusion Engine";
                critsTable.ltu[i].value = "Light Fusion Engine";
            }
        } else {
            for (var i = 0; i < 3; i++) {
                critsTable.ctu[i].value = "Fusion Engine";
                critsTable.ctl[i + 1].value = "Fusion Engine";
            }
        }
    }

    function setLegs() {
        critsTable.rl[0].value = "Hip";
        critsTable.ll[0].value = "Hip";
        critsTable.rl[1].value = "Upper Leg Actuator";
        critsTable.ll[1].value = "Upper Leg Actuator";
        critsTable.rl[2].value = "Lower Leg Actuator";
        critsTable.ll[2].value = "Lower Leg Actuator";
        critsTable.rl[3].value = "Foot Actuator";
        critsTable.ll[3].value = "Foot Actuator";
    }

    function setHead(cockpit) {
            if (cockpit === "Small") {
                critsTable.hd[0].value = "Life Support";
                critsTable.hd[1].value = "Sensors";
                critsTable.hd[2].value = "Small Cockpit";
                critsTable.hd[3].value = "Sensors";
            } else {
                critsTable.hd[0].value = "Life Support";
                critsTable.hd[1].value = "Sensors";
                critsTable.hd[2].value = "Cockpit";
                critsTable.hd[4].value = "Sensors";
                critsTable.hd[5].value = "Life Support";
            }
        }
        // The actuators that a mech has in its arms are actually listed in the bio
        // add logic to check and add appropriate crit slots
    function setArms() {
        critsTable.rau[0].value = "Shoulder";
        critsTable.lau[0].value = "Shoulder";
        critsTable.rau[1].value = "Upper Arm Actutator";
        critsTable.lau[1].value = "Upper Arm Actutator";
    }

    // this will find the next open crit to assign something. Technically it 
    // returns the number of "Roll Again"s in the section of the crit table 
    // that's passed to it, so you'll have to do the math on your own ot get
    // the starting index (just do 6 - openIndex).
    function openCrit(limb) {
        openIndex = 0
        for (slot in critsTable[limb]) {
            if (critsTable[limb][slot].value === "Roll Again") {
                openIndex = openIndex + 1;
            }
        }
        return openIndex

    }

    function setHeatsinks(sinkType, sinkLoc) {
        //get the # of crit slots the sink will take up
        if (sinkType[2] == "Double") {
            var sinkslots = 3;
        } else {
            var sinkslots = 1;
        }
        //get rid of commas in the location string
        sinkLoc = sinkLoc[2].replace(/,/g, '');
        //split the location string into # of sinks(odd indicies) and Locations (evens)
        splitLocs = sinkLoc.split(" ");
        //split the splitLocs array into two arrays, one containing the # of sinks
        //one containing the locations of those sinks. The indicies should line up
        //to tell how many heat sinks go in each limb section
        var numsinks = [];
        var locations = [];
        var locationsU = [];
        var locationsL = [];
        for (var i = 0; i < splitLocs.length; i = i + 2) {
            numsinks.push(splitLocs[i]);
        }
        for (var i = 1; i < splitLocs.length; i = i + 2) {
            locations.push(splitLocs[i]);
            if (locations[i] != "RL" && locations[i] != "LL" && locations[i] != "HD") {
                locationsU.push(splitLocs[i] + "U");
                locationsL.push(splitLocs[i] + "L");
            }
        }
        //turn it into lowercase locations to be compatible with the crit table
        for (var i = 0; i < locations.length; i++) {
            locations[i] = locations[i].toLowerCase();
            locationsU[i] = locationsU[i].toLowerCase();
            locationsL[i] = locationsL[i].toLowerCase();

        }
        //turn numsinks into integers to be used later
        for (var i = 0; i < numsinks.length; i++) {
            numsinks[i] = parseInt(numsinks[i], 10);
        }
        //here we step through the numsinks array which stores how many sinks
        //are in each limb
        for (var i = 0; i < numsinks.length; i++) {
            //next we'll step through the number of heat sinks stored in each index of numsinks
            for (var j = 0; j < numsinks[i]; j++) {
                // n is for labeling which heat sink is which later
                n = (j + 1).toString();
                // remaining index is used for the special case when the limb section doesn't have 
                // enough slots remaining in the upper part and will bleed over to the lower part 
                // (only applies to double heatsinks)
                var remainingIndex = sinkslots;
                // the first statement checks to see if the limb has an upper and lower section
                if (locations[i] != "rl" && locations[i] != "ll" && locations[i] != "hd") {
                    // I decided to check the start index of each limb section (U and L)
                    // together here. openCrit will find the number of critical slots that are labeled as
                    // "Roll Again" (The default state) and return an int with that number. Finding the start index
                    // is just 6 - the returned number
                    startIndexU = 6 - (openCrit(locationsU[i]));
                    startIndexL = 6 - (openCrit(locationsL[i]));
                    // This case checks to see if the upper section is full already. I might be able to get rid of this
                    // case if the second case can handle it as well. Too tired to check right now
                    if (startIndexU === 6) {
                        for (var k = startIndexL; k < (startIndexL + sinkslots); k++) {
                            critsTable[locationsL[i]][k].value = sinkType[2] + " Heat Sink " + n;
                        }
                        // This case checks for a time when there might be some open slots in the upper section
                        // but not enough for a full sink. 
                    } else if (startIndexU > sinkslots) {
                        for (var k = startIndexU; k < 6; k++) {
                            critsTable[locationsU[i]][k].value = sinkType[2] + " Heat Sink " + n;
                            remainingIndex = remainingIndex - 1;
                        }
                        for (var k = startIndexL; k < remainingIndex; k++) {
                            critsTable[locationsL[i]][k].value = sinkType[2] + " Heat Sink " + n;
                        }
                        // This is when the upper section has enough room for the sink with no
                        // special cases
                    } else {
                        for (var k = startIndexU; k < (startIndexU + sinkslots); k++) {
                            critsTable[locationsU[i]][k].value = sinkType[2] + " Heat Sink " + n;
                        }
                    }
                    // This part executes when the heatsink is stored in a section that doesn't have
                    // an upper and lower
                } else {
                    startIndex = 6 - (openCrit(locations[i]));
                    for (var k = startIndex; k < (startIndex + sinkslots); k++) {
                        critsTable[locations[i]][startIndex].value = sinkType[2] + " Heat Sink " + n;
                    }
                }
            }
        }
    }


    function resetMech(charID, bio) {
        //Divide input into 3 blocks, based on SSW output
        setAttr(charID);
        mechSpec = bio.split("================================================================================");
        //divide mechSpec into sections based on line breaks, call it mechData
        var mechData = mechSpec[0].split("<br>");
        name = mechData[0];
        setName(charID, name);
        tonnageLine = mechSpec[0].match(/Mass\:(.*)/);
        tonnage = mechData[1].match(/\d+/);
        setTonnage(charID, tonnage);
        var armor = getArmor(mechSpec[1]);
        setArmor(charID, armor);
        var movement = getMP(mechSpec[1]);
        setMP(charID, movement);
        var engine = getEngine(bio);
        setEngine(engine);
        var gyro = getGyro(bio);
        setGyro(gyro, engine);
        setLegs();
        var cockpit = getCockpit(bio);
        setHead(cockpit);
        //var arms=getArms(bio)
        setArms();
        var sinkType = getHeatsinks(bio).Type;
        var sinkLoc = getHeatsinks(bio).Locations;
        setHeatsinks(sinkType, sinkLoc);
        setCrits(charID);
    }

    return {
        //Only make ResetMech visible, don't want to make individual functions
        //available for general use
        ResetMech: resetMech
    };
})();

on("chat:message", function(msg) {
    if (msg.type == "api" && msg.content.indexOf("!ResetMech") !== -1) {
        var params = msg.content.split(":");
        playerCount = params.length - 1;
        var charID = [];
        var chatOut = [];

        //Only adds the caller's name to list of mechs to reset
        if (params.length == 1) {
            playerCount++;
            var currentChar = findObjs({
                _type: "character",
                controlledby: msg.playerid,
            });
            charID.push(currentChar[0].id);
        }

        //Adds the mechs of all parameters
        else {
            //log(params);
            //skip the API call, take only character names
            for (var i = 1; i <= playerCount; i++) {
                var playerChar = findObjs({
                    _type: "character",
                    name: params[i]
                });
                if (playerChar.length <= 0) {
                    chatOut.push(params[i] + " does not exist");
                } else {
                    charID.push(playerChar[0].id);
                }
            }

        }

        var charID_pass = {};
        for (i in charID) {
            if (_.has(charID, i)) {
                charID_pass = charID[i];
                var character = getObj("character", charID_pass);
                character.get("bio", function(bio) {
                    if (bio === "null") {
                        chatOut.push(character.get("name") + " has no data");
                    } else {
                        BTImportMech.ResetMech(charID_pass, bio);
                    }
                });
            }
        }
        if (chatOut.length > 0) {
            log("Shit went down:");
        }

        for (i in chatOut) {
            if (_.has(chatOut, i)) {
                sendChat(msg.who, chatOut[i]);
                //log(chatOut[i]);
            }
        }
        sendChat(msg.who, "All done");
    }
});
//Status API Training Shop Blog About
//© 2015 GitHub, Inc. Terms Privacy Security Contactsou