window.onload = init;
/*
    This script hooks into Material Design Lite's "Component Design Pattern" API
    (see https://github.com/jasonmayes/mdl-component-design-pattern) to provide:

    * A more animateable alternative to <Details>/<Summary> (bcd-details and bcd-summary)
        - Provides Open, Close, Toggle, and re-evaluate functions on both the bcd-details and bcd-summary elements.
        - Provides a "for" attribute to the bcd-summary element to specify the ID of the bcd-details element it should toggle.

*/

/**
    * @param {HTMLElement} element
    */
var BellCubicDetails = function BellCubicDetails(element) {
    this.element_ = element;
    this.init();
};
window['BellCubicDetails'] = BellCubicDetails;

/**
    * Toggle the collapseable menu.
    *
    * @public
    */
BellCubicDetails.prototype.toggle = function () {
    console.log('[BCD-DETAILS] toggle() called on ',this)
    if (this.element_.classList.contains('is-open')) {
        BellCubicDetails.prototype.close();
    } else {
        BellCubicDetails.prototype.open();
    }
};
BellCubicDetails.prototype['toggle'] = BellCubicDetails.prototype.toggle;

BellCubicDetails.prototype.onMouseUp_ = BellCubicDetails.prototype.toggle;

/**
    * Re-evaluate the state of the collapseable menu, preforming the appropriate action.
    *
    * @public
    */
BellCubicDetails.prototype.reEval = function () {
    console.log('[BCD-DETAILS] reEval() called on ',this)
    if (this.element_.classList.contains('is-open')) {
        this.open();
    } else {
        this.close();
    }
};
BellCubicDetails.prototype['reEval'] = BellCubicDetails.prototype.reEval;

/**
    * Open the collapseable menu.
    *
    * @public
    */
BellCubicDetails.prototype.open = function () {
    console.log('[BCD-DETAILS] open() called on ',this)
    this.element_.style["margin-top"] = `0px;`;
    this.element_.classList.add('is-open')
    this.header.classList.add('is-open')
};
BellCubicDetails.prototype['open'] = BellCubicDetails.prototype.open;
/**
    * Close the collapseable menu.
    * @public
*/
BellCubicDetails.prototype.close = function () {
    console.log('[BCD-DETAILS] close() called on ',this)
    this.element_.style["margin-top"] = `-${this.element_.offsetHeight}px;`;
    this.element_.classList.remove('is-open')
    this.header.classList.remove('is-open')
};
BellCubicDetails.prototype['close'] = BellCubicDetails.prototype.close;

/**
    * Initialize element.
*/
BellCubicDetails.prototype.init = function () {
    if (this.element_) {
        console.log(this.element_)
        this.element_.innerHTML = `<div class="bcd-details_inner">${this.element_.innerHTML}</div>`;
        this["header"] = this.element_.ownerDocument.querySelector(`.bcd-summary[for="${this.element_.id}"`);
        this.reEval()
        this.element_.classList.add('initialized');
    }
};

/**
    * @param {HTMLElement} element
*/
var BellCubicSummary = function BellCubicSummary(element) {
    this.element_ = element;
    this.init();
};
window['BellCubicSummary'] = BellCubicSummary;

/**
    * Toggle the collapseable menu.
    *
    * @public
    */
BellCubicSummary.prototype.toggle = function () {
    console.log('[BCD-SUMMARY] toggle() called on ',this)
    if (this.for.classList.contains('is-open')) {
        this.close();
    } else {
        this.open();
    }
};
BellCubicSummary.prototype['toggle'] = BellCubicSummary.prototype.toggle;

BellCubicSummary.prototype.onMouseUp_ = BellCubicSummary.prototype.toggle;

/**
    * Re-evaluate the toggle menu's current state.
    *
    * @public
    */
BellCubicSummary.prototype.reEval = function () {
    console.log('[BCD-SUMMARY] reEval() called on ',this)
    if (this.for.classList.contains('is-open')) {this.close()} else {this.open()}
};
BellCubicSummary.prototype['reEval'] = BellCubicSummary.prototype.reEval;

/**
    * Open the collapseable menu.
    *
    * @public
    */
BellCubicSummary.prototype.open = function () {
    this.forChild.style["margin-top"] = `0px`;
    this.for.classList.add('is-open')
    this.element_.classList.add('is-open')
};
BellCubicSummary.prototype['open'] = BellCubicSummary.prototype.open;
/**
    * Close the collapseable menu.
    *
    * @public
    */
BellCubicSummary.prototype.close = function () {
    this.forChild.style["margin-top"] = `-${this.for.offsetHeight}px`;
    this.for.classList.remove('is-open')
    this.element_.classList.remove('is-open')
};

BellCubicSummary.prototype.for = null
BellCubicSummary.prototype['for'] = BellCubicSummary.prototype.for;

/**
    * Initialize element.
    */
BellCubicSummary.prototype.init = function () {
    if (this.element_) {
        this.boundElementMouseUp = this.onMouseUp_.bind(this);
        this.element_.addEventListener('mouseup', this.boundElementMouseUp);
        this.for = this.element_.ownerDocument.getElementById(this.element_.getAttribute('for'));
        this.forChild = this.for.getElementsByClassName('bcd-details_inner')[0];
        this.element_.classList.add('initialized');
        // this.for.reEval() is handled in BellCubicDetails
    }
};

function registerComponents(){
    componentHandler.register({
        constructor: BellCubicDetails,
        classAsString: 'BellCubicDetails',
        cssClass: 'bcd-details',
        widget: false
    });
    componentHandler.register({
        constructor: BellCubicSummary,
        classAsString: 'BellCubicSummary',
        cssClass: 'bcd-summary',
        widget: false
    });
    componentHandler.upgradeDom();
}


// The component registers itself. It can assume componentHandler is available in the global scope.
// Either way, I'm trying it now in case onLoad is, for some reason, not called.
try{registerComponents()}catch(e){console.log(e.stack)}

function init() {
    try{registerComponents()}catch(e){console.log(e.stack)}
    
    /*
    We pull from the Conditionalized array before the Generic array to ensure that we always have some text.

    Possible conditions:
    time: An array of time bounds in 24hr [H,MM].
    random: A float between 0 and 1. If the Math.random number is less than this, the condition is met.
    date: An array of date bounds in [M,D,YYYY]. Set either to [0,0,0] to mark it as unbounded.
    */
    const possibilities_conditionalized = [
        [ {random: .01}, "Your firstborn is Sheson's!" ],
        [ {random: .01}, "And why not? Imagine how unbearably, how unutterably cold the universe would be if one were all alone." ], // https://www.mit.edu/people/dpolicar/writing/prose/text/thinkingMeat.html
        [ {random: .075}, "STOP REFRESHING!!!" ],
        [ {time: [[3,00], [11,59]]}, "Good morning!" ],
        [ {time: [[3,00], [11,59]]}, "'Mornin! Nice day for fishin', ain't it?" ],
        [ {time: [[12,00], [12,00]]}, "Good noon!" ],
        [ {time: [[12,01], [19,00]]}, "Good afternoon!" ],
        [ {time: [[18,30], [24,00]]}, "Good evening!" ],
        [ {time: [[0,00], [5,00]]}, "<s>Friendly reminder that you should probably be sleping right now</s>" ],
        [ {date: [[0,0,0], [11,11,2022]], random: .25}, "Starfield community beta when?"],
        [ {random: .001}, "Well, well, well. You must be perty lucky!" ],
        [ {random: .00001}, "WHAT IN OBLIVION?!!! <b>WHY ARE YOU SO LUCKY?!!</b>" ],
        [ {random: .05}, "Known Troublemakers:<ul><li>Lively</li><li>Lively's Cat</li><li>Lively Again</li></ul>- BigBizkit" ],
        [ {random: .33}, "Nexus Mods is the best!"],
        [ {random: .02}, "Greetings, Dragonborn."], //rdunlap
        [ {random: .1}, "Welcome, Dovahkiin."], //rdunlap
        [ {random: .05}, "War. War never changes."], //rdunlap
        [ {random: .01}, "The Institute liked that."], //rdunlap
        [ {random: .01}, "Do you get to the Cloud District very often?"],
        [ {random: .1}, "By Azura, by Azura, by Azura! It's you! The Grand Champion!"], //Otellino
        [ {random: .055}, "You should not be here, Mortal! Your life is forfeit. Your flesh is mine."], //Otellino
        [ {random: .1}, "Psst. Hey, I know who you are. Hail Sithis."],
        [ {random: .1}, "You wear the armor of the bear, my friend. A fine choice."],
        [ {time: [[20,00], [24,00]]}, "Only burglars and vampires creep around after dark. So which are you?" ],
        [ {time: [[0,00], [5,00]]}, "Only burglars and vampires creep around after dark. So which are you?" ]
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
        "Hm? Need something?",
        "May the force be with you.", //DarkDominion
        "You're braver than I thought!", //DarkDominion
        "You're asking my opinion? How uncharacteristic.",
        "My olfactory sensors are picking up <b>quite a strong odor.</b>",
        "With people like you making decisions, no wonder nuclear war broke out.",
        "Have I mentioned I'm afraid of heights? Especially ones with ramshackle crumbly bits?",
        "Here's the thing, I... <i>I forget the thing.</i>",
        "That coin-pouch getting heavy?",
        "So rise up! <b>RIIIIIISE UP</b>, children of the Empire! <b>RIIIIIISE UP</b>, Stormcloaks!",
        "We mug people! And wagons.",
        "By the rules of the street, I now own there.",
        "I just make character and run amok.", //chuckseven1
        "You a fan of grilled cheese?",
        "Ever tried Vegimite? Stuff's bitter as all get-out.",
        "Sup.", //Haelfire
        "I stuffed that kitty cat so full of lead, we'll have to use it as a pencil instead.",
        "May the Bluebird of Paradise roost in your nostril.",
        "¡Hola!",
        "So who made the machines? That's who we want to contact.", // https://www.mit.edu/people/dpolicar/writing/prose/text/thinkingMeat.html
        "Hey, check out the <a href=\"https://octodex.github.com/\" target=\"_blank\" rel=\"noopener noreferrer\">Octodex</a>!",
        "I used to be an adventurer like you. Then I took an arrow in the knee...",
        "Wonderful! Remarkably well preserved too.",
        "I thought adventurers were supposed to look tough?",
        "Halt. You're under arrest for murder and conspiracy against the city of Markarth!",
        "They say Ulfric Stormcloak murdered the high king... with his voice! Shouted him apart!",
        "'Tis a wicked axe you wield there, friend. That blade looks sharp enough to cut through a god.",
        "You know what? You're not worth the hassle. Go... be some other guard's problem.",
        "My cousin's out fighting dragons, and what do I get? Guard duty.",
        "Iron sword, huh? What are you killing, butterflies?",
        "I mostly deal with petty thievery and drunken brawls. Been too long since we've had a good bandit raid.",
        "Your shield... Dwarf-make, is it not? But yet it seems so much... more.",
        "By Shor, is that... is that Azura's Star? How did you come to possess such a rare treasure?",
        "Fine armor you've got there. Dwarven make, am I right?",
        "Judging by your armor, I'd say you're an Imperial scout. If so, well met.",
        "That Stormcloak armor's getting on my nerves...",
        "Hey, you mix potions, right? Can you brew me an ale?",
        "Don't suppose you'd enchant my sword? Dull old blade can barely cut butter.",
        "In the ancient tongue, you are Dovahkiin - Dragonborn!",
        "They say the College has been snooping around Saarthal. Mages in a burial crypt. No good can come of that...",
        "I'm just looking for my spoon.",
        "I caught a glimpse of that captured dragon. It's.. beautiful. In its own way.",
        "Thalmor in the Ratway? What's next, spriggans in the Bee and Barb?",
        "Now I remember - you're that new member of the Companions. So you, what - fetch the mead?",
        "Ooh, ooh, what kind of message? A song? A summons? Wait, I know! A death threat written on the back of an Argonian concubine!",
        "But more to the point. Do you - tiny, puny, expendable little mortal - actually think you can convince me to leave?",
        "I'm not a warlock, but I can make you one.", // Copilot?!!
        "Was it Molag? No, no... Little Tim, the toymaker's son? The ghost of King Lysandus? Or was it... Yes! Stanley, that talking grapefruit from Passwall.",
        "Now you. You can call me Ann Marie. But only if you're partial to being flayed alive and having an angry immortal skip rope with your entrails!",
        "Sheogorath, Daedric Prince of Madness. At your service.",
        "I am a part of you, little mortal. I am a shadow in your subconscious, a blemish on your fragile little psyche. You know me. You just don't know it.",
        "Now that's the real question, isn't it? Because honestly, how much time off could a demented daedra really need?",
        "Let's make sure I'm not forgetting anything. Clothes? Check. Beard? Check! Luggage?<br />Luggage! Now where did I leave my luggage?",
        "Ha! I do love it when the mortals know they're being manipulated. Makes things infinitely more interesting.",
        "The Wabbajack! Huh? Huh? Didn't see that coming, did you?",
        "Well, I suppose it's back to the Shivering Isles. The trouble Haskill can get into while I'm gone simply boggles the mind...",
        "Do you mind? I'm busy doing the fishstick. It's a very delicate state of mind!",
        "The butler did it! Or is it the advisor? Whoever that man behind the throne was.",
        "Ah, now this is a sad path. Pelagius hated and feared many things. Assassins, wild dogs, the undead, pumpernickel...",
        "Um... We're not talking about Barbas, are we? Clavicus Vile's... dog? Oohh... awkward.",
        "You know, I was there for that whole sordid affair. Marvelous time! Butterflies, blood, a Fox, a severed head... Oh, and the cheese! To die for.",
        "<img style=\"max-width: 64px\" src=\"https://cdn.discordapp.com/emojis/934113805670170714.webp?quality=lossless\" alt=\"Nexus Mods Mug\" decoding=\"async\" fetchpriority=\"low\" loading=\"lazy\" />",
        "You. Yes, you. I'm still waiting.",
        "Because it's dull, you twit! It'll hurt more!",
        "Wazzup, nerdz!",
        "Aflack. Aflack. AFLACK!!!!!!",
        "Clever girl.",
        "I dream of brains exploding.",
        "You must construct additional pylons.",
        "That thing must die!",
        "This one's not dead yet!",
        "Layne#6549",
        "Cthulhu is angry and missing an eye.",
        "More work? Zug zug.",
        "Vengeance!",
        "Directive one: Protect humanity!<br />Directive two: Obey Jack at all costs.<br />Directive three: Dance!",
        "Something need doing?",
        "Sic parvis magna", // "Greatness From Small Beginnings"
        "We were made to dominate. The will to power is in our blood. You feel it in yourself, do you not?",
        "What is better - to be born good, or to overcome your evil nature through great effort?",
        "No day goes by where I am not tempted to return to my inborn nature.",
        "They see me as master. Wuth. Onik. Old and wise. It is true I am old...",
        "Just because you can do a thing, does not always mean you should.",
        "There are many hungers it is better to deny than to feed.",
        "Do you have no better reason for acting than destiny? Are you nothing but a plaything of dez... of fate?",
        "Perhaps this world is simply the Egg of the next kalpa? Lein vokiin? Would you stop the next world from being born?",
        "Drem. Patience. I am answering, in my way.",
        "I am the one who will bring you back to your own world.", // Nice one, Copilot!
        "I do not know how he came to be caught. But the bronjun... the Jarl... was very proud of his pet. Paak!",
        "Even we who ride the currents of Time cannot see past Time's end. Wuldsetiid los tahrodiis.",
        "Those who try to hasten the end, may delay it. Those who work to delay the end, may bring it closer.",
        "By long tradition, the elder speaks first.",
        "If you can see your destiny clearly, your sight is clearer than mine.",
        "But, I bow before your certainty. In a way I envy you. The curse of much knowledge is often indecision.",
        "There is no distinction between debate and combat to a dragon. For us it is one and the same.",
        "Drem Yol Lok. Greetings.",
        "And so you fulfilled your destiny, which you once said you did not believe in.",
        "But I cannot celebrate his fall. He was my brother once. This world will never be the same.",
        "So, it is done. The Eldest is no more, he who came before all others, and has always been.",
        "And, as you told me once, the next world will have to take care of itself. Even I cannot see past Time's ending.",
        "Even I cannot see past Time's ending to what comes next. We must do the best we can with this world.",
        "You have won a mighty victory—one that will echo through all the ages of this world for those who have eyes to see.",
        "Perhaps now you have some insight into the forces that shape the vennesetiid... the currents of Time.",
        "You once told me you did not believe in destiny.",
        "You have proven yourself worthy of the next world.", // Copilot's on FIRE today!
        "You once told me you did not believe in destiny.",
        "His doom was written when he claimed for himself the lordship that properly belongs to Bormahu.",
        "It is an... artifact from outside time. It does not exist, but it has always existed. They are...hmm... fragments of creation.",
        "There is no question. You are doom-driven. The very bones of the earth are at your disposal.",
        "Hmm, yes. I have been pondering on exactly that question.",
        "\"Fade\" in your tongue. Mortals have greater affinity for this Word than the dov. Everything mortal fades away in time, but the spirit remains.",
        "In your tongue, the Word simply means \"Fire.\" It is change given form. Power at its most primal.",
        "It is called \"Force\" in your tongue. But as you push the world, so does the world push back. Think of the way force may be applied effortlessly. Imagine but a whisper pushing aside all in its path.",
        "For thousands of mortal years, I have lived here in loneliness and meditation.",
        "The Eldest always was pahlok - arrogant in his power. He took domination as his birthright.",
        "You can trust me, I would not have helped you otherwise.",
        "Some would say that all things must end, so that the next can come to pass. ",

        "The ox, not wishing to be anybody's dinner, prayed very vocally to Ius. This came out as a loud Moo, of course.",
        "The best techniques are passed on by the survivors...",
        "Each event is preceded by Prophecy. But without the hero, there is no Event.",
        "The world turned against us.",
        "Yet, we survived.",
        "We brought heat to our homes.",
        "We healed our sick.",
        "We fed our children.",
        "Some say we broke our promises.<br />Some say we betrayed our brothers.<br />Some say we abandoned God.",
        "But it is us, not them that brought us this far.",
        "And those that make sacrifices today, will reap the rewards of tomorrow."
    ]

    // Still in 'window.onload'

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



