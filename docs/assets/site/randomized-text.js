/*
    We pull from the Conditionalized array before the Generic array to ensure that we always have some text.

    Possible conditions:
    time: An array of time bounds in 24hr [H,MM].
    random: A float between 0 and 1. If the Math.random number is less than this, the condition is met.
    date: An array of date bounds in [M,D,YYYY]. Set either to [0,0,0] to mark it as unbounded.
*/
const possibilities_conditionalized = [
    [ {random: .001}, "Well, well, well. You must be perty lucky!" ],
    [ {random: .01}, "Your firstborn is Sheson's!" ],
    [ {random: .1}, "STOP REFRESHING!!!" ],
    [ {time: [[3,00], [11,59]]}, "Good morning!" ],
    [ {time: [[12,00], [12,00]]}, "Good noon!" ],
    [ {time: [[12,01], [18,00]]}, "Good afternoon!" ],
    [ {time: [[18,00], [24,00]]}, "Good evening!" ],
    [ {time: [[12,00], [15,00]]}, "<s>Friendly reminder that you should probably be sleping right now</s>" ],
    [ {date: [[0,0,0], [11,11,2022]]}, "Starfield community beta when?"],
    [ {random: .00001}, "WHAT IN OBLIVION?!!! <b>WHY ARE YOU SO LUCKY?!!</b>" ],
    [ {random: .1}, "Nexus Mods is the best!"],
    [ {random: .1}, "Greetings, Dragonborn"], //rdunlap
    [ {random: .1}, "Welcome, Dovahkiin"], //rdunlap
    [ {random: .1}, "War. War never changes."], //rdunlap
    [ {random: .01}, "The Institute liked that"], //rdunlap
    [ {random: .01}, "Do you get to the Cloud District very often?"], //rdunlap
    [ {random: .1}, "By Azura, by Azura, by Azura! It's you! The Grand Champion!"] //Otellino

];

const possibilities_Generic = [
    "Hello!",
    "Hi!",
    "Well well well, what do we have here?",
    "Oh, hello there!",
    "Welcome to YOUR WORST NIGHTMARE!!!",
    "I'm a <s>random text generator</s> sentient being!",
    "I don't know if the LOOT admins love me or are annoyed with me.",
    "What a crazy world we live in!",
    "Starfield Community Patch BABY!!!",
    "Thank Vivec you've arrived. There is much to do!", // - Thallassa
    "The cake is a lie", //rdunlap
    "May the ground quake as you pass!",
    "<s>WELCOME to Belethor's General Goods!</s>", 
    "You. I've seen you. Let me see your face.", 
    "Halt! Halt!", 
    "Hm? Need something?"

    // Codsworth!
    "You're asking my opinion? How uncharacteristic.",
    "My olfactory sensors are picking up quite a strong odor.",
    "With people like you making decisions, no wonder nuclear war broke out.",
    "Have I mentioned I'm afraid of heights? Especially ones with ramshackle crumbly bits?"
];

window.onload = () => {
    var toSetText = possibilities_conditionalized[Math.round(Math.random() * (possibilities_conditionalized.length - 1))];
    //console.log(`[BCD-RANDOM-TEXT] Text to set: ${JSON.stringify(toSetText)}`);

    // Check condition
    if (checkCondition(toSetText[0])) {
        document.getElementById("randomized-text-field").innerHTML = toSetText[1];
        //console.log(`[BCD-RANDOM-TEXT] Condition passed. Using conditionalized text.`);
    } else {
        document.getElementById("randomized-text-field").innerHTML = possibilities_Generic[Math.round(Math.random() * (possibilities_Generic.length - 1))];
        //console.log(`[BCD-RANDOM-TEXT] Condition failed. Using generic text.`);
    }
};

function checkCondition(condition) {
    try {

        // Random
        //console.log(`[BCD-RANDOM-TEXT] Checking random condition`);
        var rand = Math.random();
        if (tryForJSON(condition, "random")) {
            //console.log(`[BCD-RANDOM-TEXT] Is random ${rand} <= ${condition.random}?`);
            if (rand > parseFloat(condition.random)) {
                return false;
            }
        }

        // Time
        //console.log(`[BCD-RANDOM-TEXT] Checking time condition`);
        if (tryForJSON(condition, "time")) {
            var time = new Date();

            var currentTime = time.getHours() * 60 + time.getMinutes();
            var conditionTime = [condition.time[0][0] * 60 + condition.time[0][1], condition.time[1][0] * 60 + condition.time[1][1]];

            //console.log(`[BCD-RANDOM-TEXT] is ${currentTime} between ${conditionTime[0]} and ${conditionTime[1]}?`);

            if (!(currentTime >= conditionTime[0] && currentTime <= conditionTime[1])) {
                return false;
            }
        }

        // Date
        //console.log(`[BCD-RANDOM-TEXT] Checking date condition`);
        if (tryForJSON(condition, "date")) {
            var date = new Date();
            var currentDate = [date.getMonth() + 1, date.getDate(), date.getFullYear()];

            //console.log(`[BCD-RANDOM-TEXT] is ${currentDate.join('/')} between ${condition.date[0].join('/')} and ${condition.date[1].join('/')}?`);

            if (!(
                    (currentDate[2] > condition.date[0][2]) ||
                    (currentDate[2] == condition.date[0][2] && currentDate[0] > condition.date[0][0]) ||
                    (currentDate[2] == condition.date[0][2] && currentDate[0] == condition.date[0][0] && currentDate[1] >= condition.date[0][1])
                )) {
                //console.log(`[BCD-RANDOM-TEXT] Date is not above minimum`);
                return false
            }

            // And...
            if (condition.date[1] != [0, 0, 0]) {
                //console.log(`[BCD-RANDOM-TEXT] Date has a maximum`);

                if (!(
                        (currentDate[2] < condition.date[1][2]) ||
                        (currentDate[2] == condition.date[1][2] && currentDate[0] < condition.date[1][0]) ||
                        (currentDate[2] == condition.date[1][2] && currentDate[0] == condition.date[1][0] && currentDate[1] <= condition.date[1][1])
                    )) {
                    return false;
                }
            }
        }
        // And if any of that threw an error,
    } catch (err) {
        //console.log(`[BCD-RANDOM-TEXT] {checkCondition(${condition})} Error - ${err.name}\n==================\n${err.stack}\n==================`);
        return false
    }

    // If we got through ALL OF THAT, we're good!
    return true
}

function tryForJSON(aJSON, key) {
    //console.log(`[BCD-RANDOM-TEXT] Checking ${JSON.stringify(aJSON)} for ${key}`);
    try {
        if (typeof aJSON[key] === "undefined") {
            return false;
        }
    } catch (err) {
        //console.log(`[BCD-RANDOM-TEXT] {tryForJSON(${aJSON}, ${key})} Error - ${err.name}\n==================\n${err.stack}\n==================`);
        return false
    }
    return true;
}
