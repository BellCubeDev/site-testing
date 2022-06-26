window.onload = bcd_universalJS_init;
var bcd_universal_initRan = false;

console.log("%cHello and welcome to the JavaScript console! This is where wizards do their magic!\nAs for me? I'm the wizard you don't want to anger.", "color: #2d6");

/*
    This script hooks into Material Design Lite's "Component Design Pattern" API
    (see https://github.com/jasonmayes/mdl-component-design-pattern) to provide:

    * An animatable alternative to <Details>/<Summary> (bcd-details and bcd-summary)
        - Provides Open, Close, Toggle, and re-evaluate functions on both the bcd-details and bcd-summary elements.
        - Provides a "for" attribute to the bcd-summary element to specify the ID of the bcd-details element it should toggle.

    * A random text generator



*/

var bcd_registeredComponents = {
    ...bcd_registeredComponents,
    bcdDetails: {},
    bcdSummary: {}
};

const bcd_const_transitionDur = "transition-duration";
const bcd_const_animDur = "animation-duration";
const bcd_const_marginTop = "margin-top";
const bcd_const_classIsOpen = "is-open";
const bcd_const_classAdjacent = "adjacent";
const bcd_const_classDetailsInner = "bcd-details-inner";

/* (these variables are defined here so they aren't kept in memory the whole time)
We pull from the Conditionalized array before the Generic array to ensure that we always have some text.

Possible conditions:
time: An array of time bounds in 24hr [H,M].
random: A float between 0 and 1. If the Math.random number is less than this, the condition is met.
date: An array of date bounds in [M,D,YYYY]. Set either to [0,0,0] to mark it as unbounded.
*/
const possibilities_conditionalized = [
    [ {random: .01}, "Your firstborn is Sheson's!" ],
    [ {random: .01}, "And why not? Imagine how unbearably, how unutterably cold the universe would be if one were all alone." ], // https://www.mit.edu/people/dpolicar/writing/prose/text/thinkingMeat.html
    [ {random: .075}, "STOP REFRESHING!!!" ],
    [ {time: [[3,0], [11,59]]}, "Good morning!" ],
    [ {time: [[3,0], [11,59]]}, "'Mornin! Nice day for fishin', ain't it?" ],
    [ {time: [[12,0], [12,0]]}, "Good noon!" ],
    [ {time: [[12,1], [19,0]]}, "Good afternoon!" ],
    [ {time: [[18,30], [24,0]]}, "Good evening!" ],
    [ {time: [[0,0], [5,0]]}, "<s>Friendly reminder that you should probably be sleeping right now</s>" ],
    [ {date: [[0,0,0], [11,11,2022]], random: .25}, "Starfield community beta when?"],
    [ {random: .001}, "Well, well, well. You must be perty lucky!" ],
    [ {random: .00001}, "WHAT IN OBLIVION?!!! <b>WHY ARE YOU SO LUCKY?!!</b>" ],
    [ {random: .05}, "Known Troublemakers:<ul><li>Lively</li><li>Lively's Cat</li><li>Lively Again</li></ul>- BigBizkit" ],
    [ {random: .33}, "Nexus Mods is the best!"],
    [ {random: .05}, "And then I... I would be named... <i><b>TIM!</b></i><br />The horrors would never cease!" ],
    [ {random: .02}, "Greetings, Dragonborn."], //rdunlap
    [ {random: .1}, "Welcome, Dovahkiin."], //rdunlap
    [ {random: .05}, "War. War never changes."], //rdunlap
    [ {random: .01}, "The Institute liked that."], //rdunlap
    [ {random: .01}, "Do you get to the Cloud District very often?"],
    [ {random: .1}, "By Azura, by Azura, by Azura! It's you! The Grand Champion!"], //Otellino
    [ {random: .055}, "You should not be here, Mortal! Your life is forfeit. Your flesh is mine."], //Otellino
    [ {random: .1}, "Psst. Hey, I know who you are. Hail Sithis."],
    [ {random: .1}, "You wear the armor of the bear, my friend. A fine choice."],
    [ {time: [[20,0], [24,0]]}, "Only burglars and vampires creep around after dark. So which are you?" ],
    [ {time: [[0,0], [5,0]]}, "Only burglars and vampires creep around after dark. So which are you?" ]
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
    "Now that's the real question, isn't it? Because honestly, how much time off could a demented Daedra really need?",
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
    "And those that make sacrifices today, will reap the rewards of tomorrow.",
    "If you don't eat yer meat, you can't have any pudding.",
    "I'm not sure what I'm doing here, but I'm sure I'm doing something.",

    // Fable 1 was a bit fun
    "Darkwood's a dangerous place, Hero.",
    "Farm-boy!",
    "My helmet, my armour, my sword and my shield. Bring these to me and the path I shall yield.",
    "Hero, your health is low. Do you have any potions&mdash;or food?", // &mdash; = Em Dash
    "Deep in the forest of Albion lay the small town of Oakvale, unchanged by time and untouched by the sword. Here lived a boy and his family; a boy dreaming of greatness. Of one day being a Hero.",
    "They're all dead. You don't want to join them, do you?",
    "You might not realize it, but I just saved your life.",
    "So you finally pried yourself from your pillow I see.",
    "Hook coast? Nobody goes there. Nobody comes from there.",

    "What we've got here is failure to communicate.",
    "Hey, you. You're finally awake.",
    "It's a good day for doom"
];



function randomNumber(min = 0, max = 1, places = 0){
    const placesMult = Math.pow(10, places);
    return (
        (
            Math.round(
                Math.random() * (max - min) + min
            ) * placesMult
        ) / placesMult
    );
}


class BellCubicDetails {
    static cssClass = 'bcd-details';
    details_inner = null;

    /** @param {HTMLElement} element */
    constructor(element) {
        this.element_ = element;

        this.init();
        /*console.log("[BCD-DETAILS] Registered component: ", this)*/
    }
    /**
        * Toggle the collapsable menu.
        *
        * @public
        */
    toggle(doSetDuration = true) {
        /*console.log('[BCD-DETAILS] toggle() called on ',this)*/
        if (this.element_.classList.contains(bcd_const_classIsOpen) || this.header.classList.contains(bcd_const_classIsOpen)) { this.close(doSetDuration); } else { this.open(doSetDuration); }
    }
    /**
        * Re-evaluate the toggle menu's current state.
        *
        * @public
        */
    reEval(doSetDuration = true) {
        /*console.log('[BCD-DETAILS] reEval() called on ',this)*/
        // All the SetTimeout does here is diver processing to the next processing cycle. This prevents some of the layout shift oddities I've observed.
        setTimeout(() => { if (this.element_.classList.contains(bcd_const_classIsOpen) || this.header.classList.contains(bcd_const_classIsOpen)) { this.open(doSetDuration); } else { this.close(doSetDuration); } });
    }
    /**
        * Open the collapsable menu.
        *
        * @public
        */
    open(doSetDuration = true) {
        this.evaluateDuration(doSetDuration);

        this.details_inner.style[bcd_const_marginTop] = `0px`;
        this.element_.classList.add(bcd_const_classIsOpen);
        this.header.classList.add(bcd_const_classIsOpen);
    }
    /**
        * Close the collapsable menu.
        *
        * @public
        */
    close(doSetDuration = true) {
        /*console.log("Setting margin-top to -" + this.details_inner.offsetHeight + "px", this.details_inner)*/
        this.evaluateDuration(doSetDuration);

        this.details_inner.style[bcd_const_marginTop] = `-${this.details_inner.offsetHeight * 1.04}px`;

        this.element_.classList.remove(bcd_const_classIsOpen);
        this.header.classList.remove(bcd_const_classIsOpen);
    }
    evaluateDuration(doRun = true) {
        if (doRun) {
            this.details_inner.style[bcd_const_transitionDur] = `${200 + 1.25 * this.details_inner.offsetHeight * 1.04}ms`;
            this.details_inner.style[bcd_const_animDur] = `${215 + 1.25 * this.details_inner.offsetHeight * 1.04}ms`;
            for (const icon of this.openIcons90deg) { icon.style[bcd_const_animDur] = `${215 + 1.25 * this.details_inner.offsetHeight * 1.04}ms`; }
        }
    }


    header = null;

    init() {
        if (this.element_) {
            //console.log("Registering element:", this.element_);

            // Create a container element to make animation go brrr
            // Slightly over-complicated because, uh, DOM didn't want to cooperate.
            this.details_inner = document.createElement('div');
            this.details_inner.classList.add(bcd_const_classDetailsInner);

            //console.log(this.details_inner);

            // The `children` HTMLCollection is live, so we're fetching each element and throwing it into an array...
            var temp_childrenArr = [];
            for (const elm of this.element_.children){
                temp_childrenArr.push(elm);
            }
            // ...and actually moving the elements into the new div here.
            for (const elm of temp_childrenArr){
                this.details_inner.appendChild(elm);
            }

            this.element_.appendChild(this.details_inner);


            //console.log(this.element_, {parent: dumpCSSText(this.element_), child: dumpCSSText(this.details_inner)});
            if (this.element_.classList.contains(bcd_const_classAdjacent)) {
                this.header = this.element_.previousElementSibling;
                if (!this.header.classList.contains(BellCubicSummary.cssClass)) {
                    console.trace("error element:");console.dir(this.element_);
                    throw new TypeError("[BCD-DETAILS] Error: Adjacent details element must be preceded by a summary element.");
                }
            } else {
                this.header = this.element_.ownerDocument.querySelector(`.bcd-summary[for="${this.element_.id}"`);
            }
            this.openIcons90deg = this.header.getElementsByClassName('open-icon-90CC');
            //console.log(this.element_, {parent: dumpCSSText(this.element_), child: dumpCSSText(this.details_inner)});
            setTimeout(() => {
                if (this.element_.id) bcd_registeredComponents.bcdDetails[this.element_.id] = this;
                this.reEval(false);
                this.reEval();
                this.element_.classList.add('initialized');
                //console.log(this.element_, {parent: dumpCSSText(this.element_), child: dumpCSSText(this.details_inner)});
                this.reEval(false);
                this.reEval();
            });
        }
    }
}
window['BellCubicDetails'] = BellCubicDetails;

class BellCubicSummary {
    static cssClass = 'bcd-summary';
    constructor(element) {
        this.element_ = element;
        this.init();
        /*console.log("[BCD-SUMMARY] Registered component: ", this)*/
    }

    /**
        * Toggle the collapsable menu.
        *
        * @public
    */
    toggle(doSetDuration = true) {
        /*console.log('[BCD-SUMMARY] toggle() called on ',this)*/
        if (this.for.classList.contains(bcd_const_classIsOpen)) {
            this.close(doSetDuration);
        } else {
            this.open(doSetDuration);
        }
    }

    /**
        * Re-evaluate the toggle menu's current state.
        *
        * @public
    */
    reEval(doSetDuration = true) {
        /*console.log('[BCD-SUMMARY] reEval() called on ',this)*/
        // All the SetTimeout does here is diver processing to the next processing cycle. This prevents some of the layout shift oddities I've observed.
        if (this.for.classList.contains(bcd_const_classIsOpen) || this.element_.classList.contains(bcd_const_classIsOpen)) { this.open(doSetDuration); } else { this.close(doSetDuration); }
    }

    /**
        * Open the collapsable menu.
        *
        * @public
    */
    open(doSetDuration = true) {
        /*console.log("Setting margin-top to 0px", this.for)*/
        try {
            this.evaluateDuration(doSetDuration);

            this.forChildren[0].style[bcd_const_marginTop] = `0px`;

        } catch (e) { if (e instanceof TypeError) { /*console.log("[BCD-SUMMARY] Error: ", e)*/ } else { throw e; } }

        this.for.classList.add(bcd_const_classIsOpen);
        this.element_.classList.add(bcd_const_classIsOpen);
    }

    /**
        * Close the collapsable menu.
        *
        * @public
    */
    close(doSetDuration = true) {
        /*console.log("Setting margin-top to -" + this.for.offsetHeight + "px", this.for)*/
        try {
            this.evaluateDuration(doSetDuration);

            this.forChildren[0].style[bcd_const_marginTop] = `-${this.forChildren[0].offsetHeight * 1.04}px`;

        } catch (e) { if (e instanceof TypeError) { /*console.log("[BCD-SUMMARY] Error: ", e)*/ } else { throw e; } }

        this.for.classList.remove(bcd_const_classIsOpen);
        this.element_.classList.remove(bcd_const_classIsOpen);
    }

    evaluateDuration(doRun = true) {
        try {
            if (doRun) {
                this.forChildren[0].style[bcd_const_transitionDur] = `${200 + 1.25 * this.forChildren[0].offsetHeight * 1.04}ms`;
                this.forChildren[0].style[bcd_const_animDur] = `${215 + 1.25 * this.forChildren[0].offsetHeight * 1.04}ms`;
                for (const icon of this.openIcons90deg) { icon.style[bcd_const_animDur] = `${215 + 1.25 * this.forChildren[0].offsetHeight * 1.04}ms`; }
            }
        } catch (e) { if (e instanceof TypeError) { /*console.log("[BCD-SUMMARY] Error: ", e)*/ } else { throw e; } }
    }

    for = null;
    forChildren = null;
    openIcons90deg = null;

    /**
        @param {PointerEvent} event
    */
    handleClick(event){
        //console.log(event, event.target.tagName);
        if (event.path.slice(0, 5).map((el) => el.tagName === 'A').includes(true)) return;
        this.toggle();
    }
    /**
        * Initialize element.
    */
    init() {
        if (this.element_) {
            this.element_.addEventListener('click', this.handleClick.bind(this));

            if (this.element_.classList.contains(bcd_const_classAdjacent)) {
                this.for = this.element_.nextElementSibling;
                if (!this.for.classList.contains(BellCubicDetails.cssClass)) {
                    console.trace("error element:");console.dir(this.element_);
                    throw new TypeError("[BCD-SUMMARY] Error: Adjacent summary element must be followed by a details element.");
                }
            } else {
                this.for = this.element_.ownerDocument.getElementById(this.element_.getAttribute('for'));
            }

            this.forChildren = this.for.getElementsByClassName(bcd_const_classDetailsInner);

            this.openIcons90deg = this.element_.getElementsByClassName('open-icon-90CC');
            bcd_registeredComponents.bcdSummary[this.element_.getAttribute('for')] = this;
            /*console.log(`bcd_registeredComponents.bcdSummary[${this.element_.getAttribute('for')}] = this;`)*/
            setTimeout(() => {
                this.reEval(false);
                this.reEval();
                this.element_.classList.add('initialized');
            });
        }
    }
}
window['BellCubicSummary'] = BellCubicSummary;


function registerComponents(){
    //console.log('[BCD-Components] Queuing component registration...');

    if (typeof componentHandler === 'undefined') {
        setTimeout(registerComponents, 100);
        return;
    }

    //console.log("[BCD-Components] Registering components...");

    // Tell MDL about our shiny new components

    // eslint-disable-next-line no-undef
    try{componentHandler.register({
        constructor: BellCubicDetails,
        classAsString: 'BellCubicDetails',
        cssClass: BellCubicDetails.cssClass,
        widget: false
    });}catch(e){registerComponentsError(e, BellCubicDetails);}
    // eslint-disable-next-line no-undef
    try{componentHandler.register({
        constructor: BellCubicSummary,
        classAsString: 'BellCubicSummary',
        cssClass: BellCubicSummary.cssClass,
        widget: false
    });}catch(e){registerComponentsError(e, BellCubicSummary);}
    // Upgrade the elements with the classes we just registered components for

    // eslint-disable-next-line no-undef
    componentHandler.upgradeElements([
        ...document.getElementsByClassName(BellCubicDetails.prototype.cssClass),
        ...document.getElementsByClassName(BellCubicSummary.prototype.cssClass),
    ]);

    //console.log("[BCD-Components] Components registered.");
}

function registerComponentsError(e, component){
    console.log("[BCD-Components] Error registering component", component, ": ", e);
}


function bcd_universalJS_init() {
    if (bcd_universal_initRan === true){
        return;
    } // We only need to init once!

    bcd_universal_initRan = true;

    // The component registers itself. It can assume componentHandler is available in the global scope.
    registerComponents();

    // Still in 'window.onload'

    const toSetText = possibilities_conditionalized[randomNumber(0, possibilities_conditionalized.length - 1)];
    /*console.log(`[BCD-RANDOM-TEXT] Text to set: ${JSON.stringify(toSetText)}`);*/

    // Check condition
    if (checkCondition(toSetText[0])) {
        document.getElementById("randomized-text-field").innerHTML = toSetText[1];
        /*console.log(`[BCD-RANDOM-TEXT] Condition passed. Using conditionalized text.`);*/
    } else {
        document.getElementById("randomized-text-field").innerHTML = possibilities_Generic[randomNumber(0, possibilities_Generic.length - 1)];
        /*console.log(`[BCD-RANDOM-TEXT] Condition failed. Using generic text.`);*/
    }
}
// Just in case the script is loaded after the page loads - an issue I've had during testing and doing occasional page loads in the wild.
window.onload();

// This function is not super to understand if you can read comments and collapse blocks of code.
// eslint-disable-next-line sonarjs/cognitive-complexity
function checkCondition(condition) {
    try {

        // Random
        /*console.log(`[BCD-RANDOM-TEXT] Checking random condition`);*/
        if (tryForJSON(condition, "random") && Math.random() > parseFloat(condition.random)) {
            return false;
        }

        // Time
        /*console.log(`[BCD-RANDOM-TEXT] Checking time condition`);*/
        if (tryForJSON(condition, "time")) {
            const time = new Date();

            const currentTime = time.getHours() * 60 + time.getMinutes();
            const conditionTime = [condition.time[0][0] * 60 + condition.time[0][1], condition.time[1][0] * 60 + condition.time[1][1]];

            /*console.log(`[BCD-RANDOM-TEXT] is ${currentTime} between ${conditionTime[0]} and ${conditionTime[1]}?`);*/

            if (!(currentTime >= conditionTime[0] && currentTime <= conditionTime[1])) {
                return false;
            }
        }

        // Date
        /*console.log(`[BCD-RANDOM-TEXT] Checking date condition`);*/
        if (tryForJSON(condition, "date")) {

            // Get the current date as the American [month, day, year]
            const date = new Date();
            const currentDate = [date.getMonth() + 1, date.getDate(), date.getFullYear()];

            const minDate = condition.date[0];
            const maxDate = condition.date[1];

            // Are we below the minimum? The condition is not met if so.
            if (!(
                    (currentDate[2] > minDate[2]) ||
                    (currentDate[2] == minDate[2] && currentDate[0] > minDate[0]) ||
                    (currentDate[2] == minDate[2] && currentDate[0] == minDate[0] && currentDate[1] >= minDate[1])
                )) {
                /*console.log(`[BCD-RANDOM-TEXT] Date is not above minimum`);*/
                return false;
            }

            // Are we above the maximum? The condition is not met if so.
            if (maxDate != [0, 0, 0] && !(
                    (currentDate[2] < maxDate[2]) ||
                    (currentDate[2] == maxDate[2] && currentDate[0] < maxDate[0]) ||
                    (currentDate[2] == maxDate[2] && currentDate[0] == maxDate[0] && currentDate[1] <= maxDate[1])
                )) {
                return false;
            }
        }
        // And if any of that threw an error,
    } catch (err) {
        /*console.log(`[BCD-RANDOM-TEXT] {checkCondition(${condition})} Error - ${err.name}\n==================\n${err.stack}\n==================`);*/
        return false;
    }

    // If we got through ALL OF THAT, we're good!
    return true;
}

/** Checks for the specified key in the specified JSON object.
    @param {{any}} aJSON - The JSON object to check.
    @param {string} key - The key to check for.
*/
function tryForJSON(aJSON, key) {
    /*console.log(`[BCD-RANDOM-TEXT] Checking ${JSON.stringify(aJSON)} for ${key}`);*/
    try {
        if (typeof aJSON[key] === "undefined") {
            return false;
        }
    } catch (err) {
        /*console.log(`[BCD-RANDOM-TEXT] {tryForJSON(${aJSON}, ${key})} Error - ${err.name}\n==================\n${err.stack}\n==================`);*/
        return false;
    }
    return true;
}