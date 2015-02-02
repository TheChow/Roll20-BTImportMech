//Designed to bring in mech specs based on text description stored in character bio.
//Uses SSW formatting
// 1: Load mech in SSW
// 2: copy mech data to clipboard
// 3: paste mech data in the "bio" part of the character sheet
// 4: type "!ResetMech". Can also type "!ResetMech:(Character Name)" and reset
// someone else's sheet for them
var BTImportMech = BTImportMech || (function(){
    
    //Keys are attribute variable names in Roll20
    //Values are keys for armorVal structure used to call setArmor
    var armorAttr = {
            "lefttorso_armor"       : "L/R Torso",
            "righttorso_armor"      : "L/R Torso",
            "centertorso_armor"     : "Center Torso",
            "lefttorso_rear_armor"  : "L/R Torso (rear)",
            "righttorso_rear_armor" : "L/R Torso (rear)",
            "centertorso_rear_armor": "Center Torso (rear)",
            "leftarm_armor"         : "L/R Arm",
            "rightarm_armor"        : "L/R Arm",
            "leftleg_armor"         : "L/R Leg",
            "rightleg_armor"        : "L/R Leg",
            "head_armor"            : "Head"
    }
    
    //Keys are attribute variable names in Roll20
    //Values are keys for armorVal structure used to call setArmor
    var structAttr = {
            "lefttorso_internalstructure"   : "L/R Torso",
            "righttorso_internalstructure"  : "L/R Torso",
            "centertorso_internalstructure" : "Center Torso",
            "leftarm_internalstructure"     : "L/R Arm",
            "rightarm_internalstructure"    : "L/R Arm",
            "leftleg_internalstructure"     : "L/R Leg",
            "rightleg_internalstructure"    : "L/R Leg",
            "head_internalstructure"        : "Head"
    }
    
    var MPAttr = {
        "mech_walk":0,
        "mech_run":0,
        "mech_sprint":0,
        "mech_jump":0
    }
        
    var miscAttr = {
        "mech_name":"Gundam",
        "mech_tonnage":0
    }
        
        
    var attrIndex = [
        armorAttr,
        structAttr,
        MPAttr,
        miscAttr
        ]
    //Checks if an attribute is defined for a character already
    function attrUndefined(charID, attr){
        attrObj = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: attr
        })[0];
        
        if (attrObj === undefined){
            return true;
        }
        else {
            return false;
        }
    }
    //Creates attributes if they don't exist. Should be run before any function
    //that modifies attributes.
    function setAttr(charID) {
        for (type in attrIndex){ 
          for (attr in attrIndex[type]){
              if (attrUndefined(charID,attr)){
                    createObj("attribute", {
                        name: attr,
                        characterid: charID
                    });
              }
          }
        }
    }

    
    function setName(charID,name) {
        var mechAttr = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "mech_name"
        })[0];
        mechAttr.set("current",name);
        return;
    }
    
    function setTonnage(charID,ton){
        var mechAttr = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "mech_tonnage"
        })[0];
        mechAttr.set("current",ton);
        return;
    }
    
    //Gets armor and internal structure values 
    function getArmor(mechData){
        //Container for all mech armor and internal structure values
        var mechArmor = {};
        
        //Matching all entries of head armor and internal structure
        head = mechData.match(/Head\s*(\d)+\s*(\d)*/g);
        arrlength = head.length;
        for (var i=0; i<arrlength; i++){
            headKey = head[i].match(/Head/g);
            headValue = head[i].match(/(\d)+/g);
            mechArmor[headKey] = headValue;
        } 
        //Matching all entries of torso armor and internal structure
        torso = mechData.match(/(([\w\/])* Torso [\(\)a-z]*)\s*(\d)*\s*(\d)*/g);
        arrlength = torso.length;
        for (var i=0; i<arrlength; i++){
            torsoKey = torso[i].match(/([\w\/])* Torso( \(rear\))?/g);
            torsoValue = torso[i].match(/(\d)+/g);
            mechArmor[torsoKey] = torsoValue;
        }
        //So far, I've only seen 1 arm entry. Not sure how asymmetrical mechs
        //are formatted. Have made the regex generic in case it does Left  Arm
        // and Right Arm
        arm = mechData.match(/[A-z\/]+ Arm\s*(\d)+\s*(\d)*/g);
        arrlength = arm.length;
        for (var i=0; i<arrlength; i++){
            armKey = arm[i].match(/[A-z\/]+ Arm/g);
            armValue = arm[i].match(/(\d)+/g);
            mechArmor[armKey] = armValue;
        }
        leg = mechData.match(/[A-z\/]+ Leg\s*(\d)+\s*(\d)*/g);
        arrlength = leg.length;
        for (var i=0; i<arrlength; i++){
            legKey = leg[i].match(/[A-z\/]+ Leg/g);
            legValue = leg[i].match(/(\d)+/g);
            mechArmor[legKey] = legValue;
        } 
        log(mechArmor);
        return mechArmor;
    }
    
    function setArmor(charID, armorVal){
        //Will go through each entry in the armorAttr table and set armor values
        for (attr in armorAttr){
            //Grabbing the values for this location inside passed armorVal object
            //Currently based on text input in Bio section
            armorStats = armorVal[armorAttr[attr]];
            //Armor is the last value in all entries
            armorIndex = armorStats.length - 1;
            armorObj = findObjs({
                _characterid: charID,
                _type: "attribute",
                name: attr
            })[0];
            armorObj.set("current",armorStats[armorIndex]); 
            armorObj.set("max",armorStats[armorIndex]);
        }
        
        //will go through each entry in the structAttr table and set structure values
        for (attr in structAttr){
            structStats = armorVal[structAttr[attr]];
            //Structure is the first value in all entries with structure
            //Do not need variable, since it's always 0
            structObj = findObjs({
                _characterid: charID,
                _type: "attribute",
                name: attr
            })[0];
            structObj.set("current",structStats[0]);
            structObj.set("max",structStats[0]);
            
        }
    }
    
    
    
    function getMP(mechData){
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
    
    function setMP(charID,moveProfile) {
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
        sprintSpeed = Math.ceil((parseInt(moveProfile["Walking MP"][0])+1)*1.5);
        
        mechWalk.set("current",moveProfile["Walking MP"][0]);
        mechRun.set("current",moveProfile["Running MP"][0]);
        mechJump.set("current",moveProfile["Jumping MP"][0]);
        mechSprint.set("current",sprintSpeed);
    }
    // Since I'm not going to fully use getEngine until I get the 
    // creating crit slots down, going to leave it commented
    //function getEngine(mechData){
    //    var mechEngine
    //    //Finds the engine type (just reads the first word)
    //    engine = mechData.match(/Engine:\s/g);
    //    arrlength = engine.length;
    //    for (var i=0; i<arrlength; i++){
    //        engineKey = engine[i].match(/Engine:\s/g);
     //       engineValue = engine[i].match(/\w+/g);
    //        mechEngine[enginekey] = engineValue;
    //    return mechEngine    
    //}
    
    function resetMech(charID,bio) {
        //Divide input into 3 blocks, based on SSW output
        setAttr(charID);
        mechSpec = bio.split("================================================================================");
        var mechData = mechSpec[0].split("<br>");
        name = mechData[0];
        setName(charID,name);
        tonnageLine = mechSpec[0].match(/Mass\:(.*)/);
        tonnage = mechData[1].match(/\d+/);
        setTonnage(charID,tonnage);
        var armor = getArmor(mechSpec[1]);
        setArmor(charID,armor);
        var movement = getMP(mechSpec[1]);
        setMP(charID,movement);
    }
    
    return {
        //Only make ResetMech visible, don't want to make individual functions
        //available for general use
      ResetMech: resetMech
    };
})();

on("chat:message", function (msg) {
    if (msg.type == "api" && msg.content.indexOf("!ResetMech") !== -1) {
        var params = msg.content.split(":");
        playerCount = params.length-1;
        var charID = [];
        var chatOut = [];
        
        //Only adds the caller's name to list of mechs to reset
        if (params.length == 1){
            playerCount++;
            var currentChar = findObjs({
                _type: "character",
                controlledby : msg.playerid,
            }); 
            charID.push(currentChar[0].id);
        }
        
        //Adds the mechs of all parameters
        else {
            log(params);
            //skip the API call, take only character names
            for (var i=1; i<=playerCount;i++){
                var playerChar = findObjs({
                    _type: "character",
                    name : params[i]
                }); 
                if (playerChar.length<=0){
                    chatOut.push(params[i]+ " does not exist");
                }
                else {
                    charID.push(playerChar[0].id);
                }
            }
            
        }
        
        var charID_pass = {};
        for (i in charID){
            charID_pass = charID[i];
            var character = getObj("character", charID_pass);
            character.get("bio", function(bio) {
                if (bio === "null"){
                    chatOut.push(character.get("name")+" has no data");
                }
                else {
                    BTImportMech.ResetMech(charID_pass,bio);
                }
            });
        }
        log("Shit went down:");
        
        for (i in chatOut){
            sendChat(msg.who,chatOut[i]);
            log(chatOut[i]);
        }
        sendChat(msg.who,"All done");
    }
});
//Status API Training Shop Blog About
//© 2015 GitHub, Inc. Terms Privacy Security Contact
