//Designed to bring in mech specs based on text description stored in character bio.
//Uses SSW formatting
var BTImportMech = BTImportMech || (function(){
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
        mechAttr = findObjs({
            _characterid: charID,
            _type: "attribute"
        });
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
        torso = mechData.match(/(\S* Torso [\(\)a-z]*)\s*(\d)*\s*(\d)*/g);
        arrlength = torso.length;
        for (var i=0; i<arrlength; i++){
            torsoKey = torso[i].match(/\S* Torso( \(rear\))?/g);
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
        
        return mechArmor;
    }
    
    //Sets armor and internal structure values
    function setArmor(charID, armorVal){
        LTArmor = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "lefttorso_armor"
        })[0];
        LTArmor.set("max",armorVal["L/R Torso"][1]);
        LTArmor.set("current",armorVal["L/R Torso"][1]);
        
        RTArmor = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "righttorso_armor"
        })[0];
        RTArmor.set("max",armorVal["L/R Torso"][1]);
        RTArmor.set("current",armorVal["L/R Torso"][1]);
        
        CTArmor = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "centertorso_armor"
        })[0];
        CTArmor.set("max",armorVal["Center Torso"][1]);
        CTArmor.set("current",armorVal["Center Torso"][1]);
        
        LTRArmor = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "lefttorso_rear_armor"
        })[0];
        LTRArmor.set("max",armorVal["L/R Torso (rear)"][0]);
        LTRArmor.set("current",armorVal["L/R Torso (rear)"][0]);
        
        RTRArmor = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "righttorso_rear_armor"
        })[0];
        RTRArmor.set("max",armorVal["L/R Torso (rear)"][0]);
        RTRArmor.set("current",armorVal["L/R Torso (rear)"][0]);
        
        CTRArmor = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "centertorso_rear_armor"
        })[0];
        CTRArmor.set("max",armorVal["Center Torso (rear)"][0]);
        CTRArmor.set("current",armorVal["Center Torso (rear)"][0]);
        
        LAArmor = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "leftarm_armor"
        })[0];
        LAArmor.set("max",armorVal["L/R Arm"][1]);
        LAArmor.set("current",armorVal["L/R Arm"][1]);
        
        RAArmor = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "rightarm_armor"
        })[0];
        RAArmor.set("max",armorVal["L/R Arm"][1]);
        RAArmor.set("current",armorVal["L/R Arm"][1]);
        
        LLArmor = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "leftleg_armor"
        })[0];
        LLArmor.set("max",armorVal["L/R Leg"][1]);
        LLArmor.set("current",armorVal["L/R Leg"][1]);
        
        RLArmor = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "rightleg_armor"
        })[0];
        RLArmor.set("max",armorVal["L/R Leg"][1]);
        RLArmor.set("current",armorVal["L/R Leg"][1]);
        
        HArmor = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "head_armor"
        })[0];
        HArmor.set("max",armorVal["Head"][1]);
        HArmor.set("current",armorVal["Head"][1]);
        
        LTInternal = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "lefttorso_internalstructure"
        })[0];
        LTInternal.set("max",armorVal["L/R Torso"][0]);
        LTInternal.set("current",armorVal["L/R Torso"][0]);
        
        RTInternal = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "righttorso_internalstructure"
        })[0];
        RTInternal.set("max",armorVal["L/R Torso"][0]);
        RTInternal.set("current",armorVal["L/R Torso"][0]);
        
        CTInternal = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "centertorso_internalstructure"
        })[0];
        CTInternal.set("max",armorVal["Center Torso"][0]);
        CTInternal.set("current",armorVal["Center Torso"][0]);
        
        LAInternal = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "leftarm_internalstructure"
        })[0];
        LAInternal.set("max",armorVal["L/R Arm"][0]);
        LAInternal.set("current",armorVal["L/R Arm"][0]);
        
        RAInternal = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "rightarm_internalstructure"
        })[0];
        RAInternal.set("max",armorVal["L/R Arm"][0]);
        RAInternal.set("current",armorVal["L/R Arm"][0]);
        
        LLInternal = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "leftleg_internalstructure"
        })[0];
        LLInternal.set("max",armorVal["L/R Leg"][0]);
        LLInternal.set("current",armorVal["L/R Leg"][0]);
        
        RLInternal = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "rightleg_internalstructure"
        })[0];
        RLInternal.set("max",armorVal["L/R Leg"][0]);
        RLInternal.set("current",armorVal["L/R Leg"][0]);
        
        HInternal = findObjs({
            _characterid: charID,
            _type: "attribute",
            name: "head_internalstructure"
        })[0];
        HInternal.set("max",armorVal["Head"][0]);
        HInternal.set("current",armorVal["Head"][0]);
        
        return;
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
    
    function resetMech(charID,bio) {
        //Divide input into 3 blocks, based on SSW output
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
        var params = msg.content.split(" ");
        playerCount = params.length-1;
        var charID = [];
        
        //Only adds the caller's name to list of mechs to reset
        if (params.length == 1){
            playerCount++;
            var currentChar = findObjs({
                _type: "character",
                controlledby : msg.playerid,
            }); 
            charID = (currentChar[0].id);
        }
        /*
        //Adds the mechs of all parameters
        else {
            log(params);
            for (var i=1; i<=playerCount;i++){
                var playerChar = findObjs({
                    _type: "character",
                    name : params[i]
                }); 
                charID.push(playerChar[0].id);
            }
            
        }
        log(charID);*/
        
//        for (var j=0; j<playerCount; j++){
            var character = getObj("character", charID);
            character.get("bio", function(bio) {
                BTImportMech.ResetMech(charID,bio);
            });
//        }

        sendChat(msg.who,"All done");
    }
});