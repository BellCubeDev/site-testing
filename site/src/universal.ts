import {componentHandler} from './assets/site/mdl/material.js';
console.log("%cHello and welcome to the JavaScript console! This is where wizards do their magic!\nAs for me? I'm the wizard you don't want to anger.", "color: #2d6");

export class bcdStr extends String {
    constructor(str_:string){super(str_);}

    /** Removes whitespace at the beginning and end of a string and at the end of every included line*/ //@ts-ignore: Property 'capitalizeFirstLetter' does not exist on type 'String'.
    capitalizeFirstLetter():bcdStr{
        return new bcdStr(this.charAt(0).toUpperCase() + this.slice(1));
    }

    /** Removes whitespace at the beginning and end of a string and at the end of every included line*/ //@ts-ignore: Property 'trimWhitespace' does not exist on type 'String'.
    trimWhitespace():bcdStr{
        return new bcdStr(this
            .trimStart()                // Trim whitespace at the start of the string
            .trimEnd()                  // Trim whitespace at the end of the string
            .replace(/[^\S\n]*$/gm, '') // Trim whitespace at the end of each line
    );}
}

declare global {interface Window {
    dataLayer: [];
    bcd_init_functions: {[key:string]: Function};
}}


const _ganalytics_HTML = '<script async src="https://www.googletagmanager.com/gtag/js?id=G-5YE7EYGLGT"></script>';

// Currently unused since I haven't made the opt-in prompt yet
function enableAnalytics():void{
    //console.log('[BCD-Analytics] Enabling analytics...');

    document.head.insertAdjacentHTML('beforeend', _ganalytics_HTML);

    //console.log('[BCD-Analytics] Analytics enabled.');
    window.dataLayer = window.dataLayer || [];

    // @ts-ignore: Cannot find name 'dataLayer'.
    // eslint-disable-next-line prefer-rest-params
    function gtag(...args:unknown[]){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-5YE7EYGLGT');
}


/*
    This script hooks into Material Design Lite's "Component Design Pattern" API
    (see https://github.com/jasonmayes/mdl-component-design-pattern) to provide:

    * An animatable alternative to <Details>/<Summary> (bcd-details and bcd-summary)
        - Provides Open, Close, Toggle, and re-evaluate functions on both the bcd-details and bcd-summary elements.
        - Provides a "for" attribute to the bcd-summary element to specify the ID of the bcd-details element it should toggle.

    * A random text generator
*/
interface componentTrackingItem {
    obj:{[index:string]:unknown},
    arr:unknown[]
}

interface registered_components {
    [index:string]:componentTrackingItem
}


interface trackableConstructor<TConstructor> extends Function {
    asString: string,
    new(...args: never[]): TConstructor,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string|number|symbol]: any
}

/** Wrapped in a class to get around the complexities of exporting. */
export class bcd_ComponentTracker {
    static registered_components:registered_components = {};


    static registerComponent<TConstructor>(component:TConstructor, constructor: trackableConstructor<TConstructor>, element:HTMLElement):void{
        bcd_ComponentTracker.createComponent(constructor);

        if (element.id !== '')
            bcd_ComponentTracker.registered_components[constructor.asString].obj[element.id] = component;
        else
            bcd_ComponentTracker.registered_components[constructor.asString].arr.push(component);
    }

    static createComponent<TConstructor>(constructor:trackableConstructor<TConstructor>){
        if (typeof bcd_ComponentTracker.registered_components[constructor.asString] === 'undefined')
            bcd_ComponentTracker.registered_components[constructor.asString] = {obj: {}, arr: []};
    }


    static findItem<TConstructor>(constructor: trackableConstructor<TConstructor>, element:HTMLElement, findPredicate: (arg0:TConstructor) => boolean): TConstructor|undefined {
        if (element.id)
            return bcd_ComponentTracker.registered_components[constructor.asString].obj[element.id] as TConstructor;
        else
            return (bcd_ComponentTracker.registered_components[constructor.asString].arr as TConstructor[]).find(findPredicate);
    }
}

const bcd_const_transitionDur:string = "transition-duration";
const bcd_const_animDur:string = "animation-duration";
const bcd_const_marginTop:string = "margin-top";
const bcd_const_classIsOpen:string = "is-open";
const bcd_const_classAdjacent:string = "adjacent";
const bcd_const_classDetailsInner:string = "bcd-details-inner";

// eslint-disable-next-line i18n-text/no-en
const bcd_const_errItem = "Error Item:";

/* (these variables are defined here so they aren't kept in memory the whole time)
We pull from the Conditionalized array before the Generic array to ensure that we always have some text.

Possible conditions:
time: An array of time bounds in 24hr [H,M].
random: A float between 0 and 1. If the Math.random number is less than this, the condition is met.
date: An array of date bounds in [M,D,YYYY]. Set either to [0,0,0] to mark it as unbounded.
*/
type conditionDate_Individual = [number, number, number]
type conditionDateBounds = [conditionDate_Individual, conditionDate_Individual]
type conditionTime_Individual = [number, number]
type conditionTimeBounds = [conditionTime_Individual, conditionTime_Individual]

type conditionObj = {random?: number; time?: conditionTimeBounds, date?: conditionDateBounds}

const possibilities_conditionalized:[conditionObj, string][] = [
    [ {random: .01,}, "Your firstborn is Sheson&rsquo;s!" ],
    [ {random: .01}, "And why not? Imagine how unbearably, how unutterably cold the universe would be if one were all alone." ], // https://www.mit.edu/people/dpolicar/writing/prose/text/thinkingMeat.html
    [ {random: .075}, "STOP REFRESHING!!!" ],
    [ {time: [[3,0], [11,59]]}, "Good morning!" ],
    [ {time: [[3,0], [11,59]]}, "&lsquo;Mornin! Nice day for fishin&rsquo;, ain&rsquo;t it?" ],
    [ {time: [[12,0], [12,0]]}, "Good noon!" ],
    [ {time: [[12,1], [19,0]]}, "Good afternoon!" ],
    [ {time: [[18,30], [24,0]]}, "Good evening!" ],
    [ {time: [[0,0], [5,0]]}, "<s>Friendly reminder that you should probably be sleeping right now</s>" ],
    [ {date: [[0,0,0], [11,11,2022]], random: .25}, "Starfield community beta when?"],
    [ {random: .001}, "Well, well, well. You must be perty lucky!" ],
    [ {random: .00001}, "WHAT IN OBLIVION?!!! <b>WHY ARE YOU SO LUCKY?!!</b>" ],
    [ {random: .05}, "Known Troublemakers:<ul><li>Lively</li><li>Lively&rsquo;s Cat</li><li>Lively Again</li></ul>- BigBizkit" ],
    [ {random: .33}, "Nexus Mods is the best!"],
    [ {random: .05}, "And then I&hellip; I would be named&hellip; <i><b>TIM!</b></i><br />The horrors would never cease!" ],
    [ {random: .02}, "Greetings, Dragonborn."], //rdunlap
    [ {random: .1}, "Welcome, Dovahkiin."], //rdunlap
    [ {random: .05}, "War. War never changes."], //rdunlap
    [ {random: .01}, "The Institute liked that."], //rdunlap
    [ {random: .01}, "Do you get to the Cloud District very often?"],
    [ {random: .1}, "By Azura, by Azura, by Azura! It&rsquo;s you! The Grand Champion!"], //Otellino
    [ {random: .055}, "You should not be here, Mortal! Your life is forfeit. Your flesh is mine."], //Otellino
    [ {random: .1}, "Psst. Hey, I know who you are. Hail Sithis."],
    [ {random: .1}, "You wear the armor of the bear, my friend. A fine choice."],
    [ {time: [[20,0], [24,0]]}, "Only burglars and vampires creep around after dark. So which are you?" ],
    [ {time: [[0,0], [5,0]]}, "Only burglars and vampires creep around after dark. So which are you?" ],
    [ {random: .01}, "It just works!"]
];

const possibilities_Generic = [
    "Hello!",
    "Hi!",
    "Well well well, what do we have here?",
    "Oh, hello there!",
    "Welcome to YOUR WORST NIGHTMARE!!!",
    "I&rsquo;m a <s>random text generator</s> sentient being!",
    "I don&rsquo;t know if the LOOT admins love me or are annoyed with me.",
    "What a crazy world we live in!",
    "Starfield Community Patch BABY!!!",
    "Thank Vivec you&rsquo;ve arrived. There is much to do!", // - Thallassa
    "The cake is a lie", //rdunlap
    "May the ground quake as you pass!",
    "<s>WELCOME to Belethor&rsquo;s General Goods!</s>",
    "You. I&rsquo;ve seen you. Let me see your face.",
    "Halt! Halt!",
    "Hm? Need something?",
    "May the force be with you.", //DarkDominion
    "You&rsquo;re braver than I thought!", //DarkDominion
    "You&rsquo;re asking my opinion? How uncharacteristic.",
    "My olfactory sensors are picking up <b>quite a strong odor.</b>",
    "With people like you making decisions, no wonder nuclear war broke out.",
    "Have I mentioned I&rsquo;m afraid of heights? Especially ones with ramshackle crumbly bits?",
    "Here&rsquo;s the thing, I&hellip; <i>I forget the thing.</i>",
    "That coin-pouch getting heavy?",
    "So rise up! <b>RIIIIIISE UP</b>, children of the Empire! <b>RIIIIIISE UP</b>, Stormcloaks!",
    "We mug people! And wagons.",
    "By the rules of the street, I now own there.",
    "I just make character and run amok.", //chuckseven1
    "You a fan of grilled cheese?",
    "Ever tried Vegimite? Stuff&rsquo;s bitter as all get-out.",
    "Sup.", //Haelfire
    "I stuffed that kitty cat so full of lead, we&rsquo;ll have to use it as a pencil instead.",
    "May the Bluebird of Paradise roost in your nostril.",
    "¡Hola!",
    "So who made the machines? That&rsquo;s who we want to contact.", // https://www.mit.edu/people/dpolicar/writing/prose/text/thinkingMeat.html
    "Hey, check out the <a href=\"https://octodex.github.com/\" target=\"_blank\" rel=\"noopener noreferrer\">Octodex</a>!",
    "I used to be an adventurer like you. Then I took an arrow in the knee&hellip;",
    "Wonderful! Remarkably well preserved too.",
    "I thought adventurers were supposed to look tough?",
    "Halt. You&rsquo;re under arrest for murder and conspiracy against the city of Markarth!",
    "They say Ulfric Stormcloak murdered the high king&hellip; with his voice! Shouted him apart!",
    "&lsquo;Tis a wicked axe you wield there, friend. That blade looks sharp enough to cut through a god.",
    "You know what? You&rsquo;re not worth the hassle. Go&hellip; be some other guard&rsquo;s problem.",
    "My cousin&rsquo;s out fighting dragons, and what do I get? Guard duty.",
    "Iron sword, huh? What are you killing, butterflies?",
    "I mostly deal with petty thievery and drunken brawls. Been too long since we&rsquo;ve had a good bandit raid.",
    "Your shield&hellip; Dwarf-make, is it not? But yet it seems so much&hellip; more.",
    "By Shor, is that&hellip; is that Azura&rsquo;s Star? How did you come to possess such a rare treasure?",
    "Fine armor you&rsquo;ve got there. Dwarven make, am I right?",
    "Judging by your armor, I&rsquo;d say you&rsquo;re an Imperial scout. If so, well met.",
    "That Stormcloak armor&rsquo;s getting on my nerves&hellip;",
    "Hey, you mix potions, right? Can you brew me an ale?",
    "Don&rsquo;t suppose you&rsquo;d enchant my sword? Dull old blade can barely cut butter.",
    "In the ancient tongue, you are Dovahkiin - Dragonborn!",
    "They say the College has been snooping around Saarthal. Mages in a burial crypt. No good can come of that&hellip;",
    "I&rsquo;m just looking for my spoon.",
    "I caught a glimpse of that captured dragon. It&rsquo;s.. beautiful. In its own way.",
    "Thalmor in the Ratway? What&rsquo;s next, spriggans in the Bee and Barb?",
    "Now I remember - you&rsquo;re that new member of the Companions. So you, what - fetch the mead?",
    "Ooh, ooh, what kind of message? A song? A summons? Wait, I know! A death threat written on the back of an Argonian concubine!",
    "But more to the point. Do you - tiny, puny, expendable little mortal - actually think you can convince me to leave?",
    "I&rsquo;m not a warlock, but I can make you one.", // Copilot?!!
    "Was it Molag? No, no&hellip; Little Tim, the toymaker&rsquo;s son? The ghost of King Lysandus? Or was it&hellip; Yes! Stanley, that talking grapefruit from Passwall.",
    "Now you. You can call me Ann Marie. But only if you&rsquo;re partial to being flayed alive and having an angry immortal skip rope with your entrails!",
    "Sheogorath, Daedric Prince of Madness. At your service.",
    "I am a part of you, little mortal. I am a shadow in your subconscious, a blemish on your fragile little psyche. You know me. You just don&rsquo;t know it.",
    "Now that&rsquo;s the real question, isn&rsquo;t it? Because honestly, how much time off could a demented Daedra really need?",
    "Let&rsquo;s make sure I&rsquo;m not forgetting anything. Clothes? Check. Beard? Check! Luggage?<br />Luggage! Now where did I leave my luggage?",
    "Ha! I do love it when the mortals know they&rsquo;re being manipulated. Makes things infinitely more interesting.",
    "The Wabbajack! Huh? Huh? Didn&rsquo;t see that coming, did you?",
    "Well, I suppose it&rsquo;s back to the Shivering Isles. The trouble Haskill can get into while I&rsquo;m gone simply boggles the mind&hellip;",
    "Do you mind? I&rsquo;m busy doing the fishstick. It&rsquo;s a very delicate state of mind!",
    "The butler did it! Or is it the advisor? Whoever that man behind the throne was.",
    "Ah, now this is a sad path. Pelagius hated and feared many things. Assassins, wild dogs, the undead, pumpernickel&hellip;",
    "Um&hellip; We&rsquo;re not talking about Barbas, are we? Clavicus Vile&rsquo;s&hellip; dog? Oohh&hellip; awkward.",
    "You know, I was there for that whole sordid affair. Marvelous time! Butterflies, blood, a Fox, a severed head&hellip; Oh, and the cheese! To die for.",
    "<img style=\"max-width: 64px\" src=\"https://cdn.discordapp.com/emojis/934113805670170714.webp?quality=lossless\" alt=\"Nexus Mods Mug\" decoding=\"async\" fetchpriority=\"low\" loading=\"lazy\" />",
    "You. Yes, you. I&rsquo;m still waiting.",
    "Because it&rsquo;s dull, you twit! It&rsquo;ll hurt more!",
    "Wazzup, nerdz!",
    "Aflack. Aflack. AFLACK!!!!!!",
    "Clever girl.",
    "I dream of brains exploding.",
    "You must construct additional pylons.",
    "That thing must die!",
    "This one&rsquo;s not dead yet!",
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
    "They see me as master. Wuth. Onik. Old and wise. It is true I am old&hellip;",
    "Just because you can do a thing, does not always mean you should.",
    "There are many hungers it is better to deny than to feed.",
    "Do you have no better reason for acting than destiny? Are you nothing but a plaything of dez&hellip; of fate?",
    "Perhaps this world is simply the Egg of the next kalpa? Lein vokiin? Would you stop the next world from being born?",
    "Drem. Patience. I am answering, in my way.",
    "I am the one who will bring you back to your own world.", // Nice one, Copilot!
    "I do not know how he came to be caught. But the bronjun&hellip; the Jarl&hellip; was very proud of his pet. Paak!",
    "Even we who ride the currents of Time cannot see past Time&rsquo;s end. Wuldsetiid los tahrodiis.",
    "Those who try to hasten the end, may delay it. Those who work to delay the end, may bring it closer.",
    "By long tradition, the elder speaks first.",
    "If you can see your destiny clearly, your sight is clearer than mine.",
    "But, I bow before your certainty. In a way I envy you.",
    "The curse of much knowledge is often indecision.",
    "There is no distinction between debate and combat to a dragon. For us it is one and the same.",
    "Drem Yol Lok. Greetings.",
    "And so you fulfilled your destiny, which you once said you did not believe in.",
    "But I cannot celebrate his fall. He was my brother once. This world will never be the same.",
    "So, it is done. The Eldest is no more, he who came before all others, and has always been.",
    "And, as you told me once, the next world will have to take care of itself. Even I cannot see past Time&rsquo;s ending.",
    "Even I cannot see past Time&rsquo;s ending to what comes next. We must do the best we can with this world.",
    "You have won a mighty victory—one that will echo through all the ages of this world for those who have eyes to see.",
    "Perhaps now you have some insight into the forces that shape the vennesetiid&hellip; the currents of Time.",
    "You once told me you did not believe in destiny.",
    "You have proven yourself worthy of the next world.", // Copilot's on FIRE today!
    "You once told me you did not believe in destiny.",
    "His doom was written when he claimed for himself the lordship that properly belongs to Bormahu.",
    "It is an&hellip; artifact from outside time. It does not exist, but it has always existed. They are&hellip;hmm&hellip; fragments of creation.",
    "There is no question. You are doom-driven. The very bones of the earth are at your disposal.",
    "Hmm, yes. I have been pondering on exactly that question.",
    "\"Fade\" in your tongue. Mortals have greater affinity for this Word than the dov. Everything mortal fades away in time, but the spirit remains.",
    "In your tongue, the Word simply means \"Fire.\" It is change given form. Power at its most primal.",
    "It is called \"Force\" in your tongue. But as you push the world, so does the world push back. Think of the way force may be applied effortlessly. Imagine but a whisper pushing aside all in its path.",
    "For thousands of mortal years, I have lived here in loneliness and meditation.",
    "The Eldest always was pahlok - arrogant in his power. He took domination as his birthright.",
    "You can trust me, I would not have helped you otherwise.",
    "Some would say that all things must end, so that the next can come to pass. ",
    "The ox, not wishing to be anybody&rsquo;s dinner, prayed very vocally to Ius. This came out as a loud Moo, of course.",
    "The best techniques are passed on by the survivors&hellip;",
    "Each event is preceded by Prophecy. But without the hero, there is no Event.",
    "The world turned against us.",
    "Yet, we survived.",
    "We brought heat to our homes.",
    "We healed our sick.",
    "We fed our children.",
    "Some say we broke our promises.<br />Some say we betrayed our brothers.<br />Some say we abandoned God.",
    "But it is us, not them that brought us this far.",
    "And those that make sacrifices today, will reap the rewards of tomorrow.",
    "If you don&rsquo;t eat yer meat, you can&rsquo;t have any pudding.",
    "I&rsquo;m not sure what I&rsquo;m doing here, but I&rsquo;m sure I&rsquo;m doing something.",

    // Fable 1 was a bit fun
    "Darkwood&rsquo;s a dangerous place, Hero.",
    "Farm-boy!",
    "My helmet, my armour, my sword and my shield. Bring these to me and the path I shall yield.",
    "Hero, your health is low. Do you have any potions&mdash;or food?", // &mdash; = Em Dash
    "Deep in the forest of Albion lay the small town of Oakvale, unchanged by time and untouched by the sword. Here lived a boy and his family; a boy dreaming of greatness. Of one day being a Hero.",
    "They&rsquo;re all dead. You don&rsquo;t want to join them, do you?",
    "You might not realize it, but I just saved your life.",
    "So you finally pried yourself from your pillow I see.",
    "Hook coast? Nobody goes there. Nobody comes from there.",

    "What we&rsquo;ve got here is failure to communicate.",
    "Hey, you. You&rsquo;re finally awake.",
    "It&rsquo;s a good day for doom",
    "Where&rsquo;s the Beef!",
    "I can&rsquo;t believe I ate the whole thing!",
    "Capitan, what should we do? Sweet Rolls aren&rsquo;t on the list.<br />Forget the list, they go in the cart!",
    "I love it!",
    "That&rsquo;s not a knife… THAT&rsquo;s a knife.",
    "I am the very model of a modern major-general.",
    "There is only The Corps, The Corps, and The Corp!",
    "And don&rsquo;t call me Shirley.",
    "Kahjit has wares of you have coin.",
    "Ok, the vampire is here. Later.",
    "I could do do this all day!",
    "Another one, on your left!",
    "My hard drive is reading over 30 MB/s at idle and I&rsquo;m scared.",
    "Beware this threat actor is currently working under inspection of the NCCIC, as we are dependent on some of his intelligence research we can not interfere physically within 4 hours, which could be enough time to cause severe damage to your infrastructure.", // From the hacker's FBI email sent in early November, 2021.
    "Our intelligence monitoring indicates exfiltration of several of your virtualized clusters in a sophisticated chain attack.", // From the hacker's FBI email sent in early November, 2021.
    "You are freeing bequickulous.",
    "Quick crown talks bumps over the crazy rog&hellip; nope",
    "In the Arena of Logic I fight unarmed!",
    "&lsquo;Tis just a flesh wound!",
    "Ni!",
    "<i>Vengeance!</i>",
    "<i>ruh roh</i>",
    "Smile my dear, you're never fully dressed without one.",
    "Obscure?<br />I can do obscure.",
    "Of course, the Gods work in mysterious ways.<br  />Like a healing shiv.",
    "First there was darkness. Then came the Strangers.",
    "There's nothing cooler than casually walking away after blowing something up.",
    "<i>Johnny, what can you make outta this?</i><br><i>This? Why, I could make a hat, or a broach, pterodactyl&hellip;</i>",
    "Landshark!",
    "When will then be now? Soon.",
    "Unless someone like you cares a whole awful lot, nothing is going to get better.<br />- Dr. Seuss",
    "It's only when we've lost everything, that we are free to do anything.",
    "We&rsquo;re gonna need a bigger boat."
];



export function randomNumber(min = 0, max = 1, places = 0):number{
    const placesMult = Math.pow(10, places);
    return (
        (
            Math.round(
                Math.random() * (max - min) + min
            ) * placesMult
        ) / placesMult
    );
}



class bcd_collapsableParent {
    // For children to set
    details!:HTMLElement;
    details_inner!:HTMLElement;
    summary!:HTMLElement;
    openIcons90deg!:HTMLCollection;

    // For us to set
    self:HTMLElement;
    adjacent:boolean = false;

    constructor(elm:HTMLElement){
        this.self = elm;
        this.adjacent = elm.classList.contains(bcd_const_classAdjacent);
    }

    /*
    debugCheck():void{
        if (!this.details) {console.log(bcd_const_errItem, this); throw new TypeError("bcd_collapsableParent: Details not found!");}
        if (!this.details_inner) {console.log(bcd_const_errItem, this); throw new TypeError("bcd_collapsableParent: Details_inner not found!");}
        if (!this.summary) {console.log(bcd_const_errItem, this); throw new TypeError("bcd_collapsableParent: Summary not found!");}
        if (!this.openIcons90deg) {console.log(bcd_const_errItem, this); throw new TypeError("bcd_collapsableParent: OpenIcons90deg not found!");}
    }
    */

    isOpen():boolean {//this.debugCheck();
        return this.details.classList.contains(bcd_const_classIsOpen) || this.summary.classList.contains(bcd_const_classIsOpen);
    }

    /** Toggle the collapsable menu. */
    toggle(doSetDuration:boolean = true) {//this.debugCheck();
        /*console.log('[BCD-DETAILS] toggle() called on ',this)*/
        if (this.isOpen()) { this.close(doSetDuration); } else { this.open(doSetDuration); }
    }

    /** Re-evaluate the collapsable's current state. */
    reEval(doSetDuration:boolean = true) {//this.debugCheck();
        // All the SetTimeout does here is diver processing to the next processing cycle. This prevents some of the layout shift oddities I've observed.
        setTimeout(() => {
            if (this.isOpen()) { this.open(doSetDuration); } else { this.close(doSetDuration); }
        });
    }

    /** Open the collapsable menu. */
    open(doSetDuration:boolean = true) {//this.debugCheck();
        this.evaluateDuration(doSetDuration);

        this.details_inner.style.marginTop = `0px`;
        this.details.classList.add(bcd_const_classIsOpen);
        this.summary.classList.add(bcd_const_classIsOpen);
    }

    /** Close the collapsable menu. */
    close(doSetDuration:boolean = true) {//this.debugCheck();
        /*console.log("Setting margin-top to -" + this.details_inner.offsetHeight + "px", this.details_inner)*/
        this.evaluateDuration(doSetDuration);

        this.details_inner.style.marginTop = `-${this.details_inner.offsetHeight * 1.04}px`;
        this.details.classList.remove(bcd_const_classIsOpen);
        this.summary.classList.remove(bcd_const_classIsOpen);
    }

    /* Determines what the transition and animation duration of the collapsable menu is */
    evaluateDuration(doRun:boolean = true) {//this.debugCheck();
        if (doRun && this.details_inner) {
            this.details_inner.style.transitionDuration = `${200 + 1.25 * this.details_inner.offsetHeight * 1.04}ms`;
            this.details_inner.style.animationDuration = `${215 + 1.25 * this.details_inner.offsetHeight * 1.04}ms`;
            for (const icon of this.openIcons90deg) {
                (icon as HTMLElement).style.animationDuration = `${215 + 1.25 * this.details_inner.offsetHeight * 1.04}ms`;
            }
        }
    }
}


export class BellCubicDetails extends bcd_collapsableParent {
    static cssClass = "bcd-details";
    static asString = "BellCubicDetails";

    /** @param {HTMLElement} element */
    constructor(element:HTMLElement) {
        super(element);
        this.details = element;

        /*console.log("[BCD-DETAILS] Registering  component: ", this)*/

        //console.log("Registering element:", this.element_);

        // Create a container element to make animation go brrr
        // Slightly over-complicated because, uh, DOM didn't want to cooperate.
        this.details_inner = document.createElement('div');
        this.details_inner.classList.add(bcd_const_classDetailsInner);

        //console.log(this.details_inner);

        // The `children` HTMLCollection is live, so we're fetching each element and throwing it into an array...
        var temp_childrenArr = [];
        for (const elm of this.details.children){
            temp_childrenArr.push(elm);
        }
        // ...and actually moving the elements into the new div here.
        for (const elm of temp_childrenArr){
            this.details_inner.appendChild(elm);
        }

        this.details.appendChild(this.details_inner);


        //console.log(this.element_, {parent: dumpCSSText(this.element_), child: dumpCSSText(this.details_inner)});
        if (this.adjacent) {
            const temp_summary = this.self.previousElementSibling;
            if (!(temp_summary && temp_summary.classList.contains(BellCubicSummary.cssClass))) {console.log(bcd_const_errItem, this); throw new TypeError("[BCD-DETAILS] Error: Adjacent Details element must be preceded by a Summary element.");}
            this.summary = temp_summary as HTMLElement;
        } else {
            const temp_summary = this.self.ownerDocument.querySelector(`.bcd-summary[for="${this.details.id}"`);
            if (!temp_summary) {console.log(bcd_const_errItem, this); throw new TypeError("[BCD-DETAILS] Error: Non-adjacent Details elements must have a Summary element with a `for` attribute matching the Details element's id.");}
            this.summary = temp_summary as HTMLElement;
        }
        this.openIcons90deg = this.summary.getElementsByClassName('open-icon-90CC');
        //console.log(this.element_, {parent: dumpCSSText(this.element_), child: dumpCSSText(this.details_inner)});
        setTimeout(() => {
            bcd_ComponentTracker.registerComponent(this, BellCubicDetails, this.details);
            this.reEval(false);
            this.reEval();
            this.self.classList.add('initialized');
        });
    }
}

export class BellCubicSummary extends bcd_collapsableParent {
    static cssClass = 'bcd-summary';
    static asString = 'BellCubicSummary';

    constructor(element:HTMLElement) {
        super(element);
        this.summary = element; // @ts-expect-error: No overload matches this call.
        this.summary.addEventListener('click', this.handleClick.bind(this));
        this.openIcons90deg = this.summary.getElementsByClassName('open-icon-90CC');

        /*console.log("[BCD-SUMMARY] Registering  component: ", this)*/

        //console.log(this.element_, {parent: dumpCSSText(this.element_), child: dumpCSSText(this.details_inner)});
        if (this.adjacent) {
            const temp_details = this.self.nextElementSibling;
            if (!(temp_details && temp_details.classList.contains(BellCubicDetails.cssClass))) {console.log(bcd_const_errItem, this); throw new TypeError("[BCD-SUMMARY] Error: Adjacent Summary element must be proceeded by a Details element.");}
            this.details = temp_details as HTMLElement;
        } else {
            const temp_details = this.self.ownerDocument.getElementById(this.summary.getAttribute('for') ?? '');
            if (!temp_details) {console.log(bcd_const_errItem, this); throw new TypeError("[BCD-SUMMARY] Error: Non-adjacent Details elements must have a summary element with a `for` attribute matching the Details element's id.");}
            this.details = temp_details as HTMLElement;
        }

        //console.log(this.element_, {parent: dumpCSSText(this.element_), child: dumpCSSText(this.details_inner)});
        this.divertedCompletion();
    }

    divertedCompletion(){setTimeout(()=>{

        const temp_inner = this.details.querySelector(`.${bcd_const_classDetailsInner}`);
        if (!temp_inner) {this.divertedCompletion(); return;}
            else this.details_inner = temp_inner as HTMLElement;

        bcd_ComponentTracker.registerComponent(this, BellCubicSummary, this.details);
        this.reEval(false);
        this.reEval();
        this.self.classList.add('initialized');
    });}

    /**
        @param {PointerEvent} event
    */
    handleClick(event:PointerEvent){
        //console.log(event, event.target.tagName);
        // @ts-expect-error: Property 'path' does not exist on type 'PointerEvent'
        if (event.path.slice(0, 5).map((el:HTMLElement) => el.tagName === 'A').includes(true)) return;
        this.toggle();
    }
}


function registerComponents():void{
    //console.log('[BCD-Components] Queuing component registration...');

    if (typeof componentHandler === 'undefined') {
        setTimeout(registerComponents, 10);
        console.debug('[BCD-Components] Waiting for componentHandler...');
        return;
    }

    //console.log("[BCD-Components] Registering components...");

    // Tell mdl about our shiny new components

    try{componentHandler.register({
        constructor: BellCubicDetails,
        classAsString: 'BellCubicDetails',
        cssClass: BellCubicDetails.cssClass,
        widget: false
    });}catch(e:unknown){registerComponentsError(e, BellCubicDetails);}
    try{componentHandler.register({
        constructor: BellCubicSummary,
        classAsString: 'BellCubicSummary',
        cssClass: BellCubicSummary.cssClass,
        widget: false
    });}catch(e:unknown){registerComponentsError(e, BellCubicSummary);}
    // Upgrade the elements with the classes we just registered components for

    componentHandler.upgradeElements([
        ...document.getElementsByClassName(BellCubicDetails.cssClass),
        ...document.getElementsByClassName(BellCubicSummary.cssClass),
    ]);

    //console.log("[BCD-Components] Components registered.");
}

function registerComponentsError(e:unknown/*Actually Error, but don't worry about it*/, component:Function):void{
    console.log("[BCD-Components] Error registering component", component, ": ", e);
}


export function bcd_universalJS_init():void {

    // Register all the things!
    registerComponents();

    // =============================================================
    // Random text time!
    // =============================================================

    const randomTextField = document.getElementById("randomized-text-field");
    if (!randomTextField) return;

    const toSetText = possibilities_conditionalized[randomNumber(0, possibilities_conditionalized.length - 1)];
    /*console.log(`[BCD-RANDOM-TEXT] Text to set: ${JSON.stringify(toSetText)}`);*/

    // Check condition
    if (checkCondition(toSetText[0])) {
        randomTextField.innerHTML = toSetText[1];
        /*console.log(`[BCD-RANDOM-TEXT] Condition passed. Using conditionalized text.`);*/
    } else {
        randomTextField.innerHTML = possibilities_Generic[randomNumber(0, possibilities_Generic.length - 1)];
        /*console.log(`[BCD-RANDOM-TEXT] Condition failed. Using generic text.`);*/
    }
}
window.bcd_init_functions.universal = bcd_universalJS_init;

// This function is not super hard to understand if you can read comments and collapse blocks of code.
function checkCondition(condition:conditionObj):boolean {
    try {

        // Random
        /*console.log(`[BCD-RANDOM-TEXT] Checking random condition`);*/
        if (typeof condition.random !== 'undefined' && Math.random() > condition.random) {
            return false;
        }

        // Time
        /*console.log(`[BCD-RANDOM-TEXT] Checking time condition`);*/
        if (typeof condition.time !== 'undefined') {
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
        return !(typeof condition.date !== 'undefined' && !checkDateCondition(condition.date));
        // And if any of that threw an error,
    } catch (err) {
        /*console.log(`[BCD-RANDOM-TEXT] {checkCondition(${condition})} Error - ${err.name}\n==================\n${err.stack}\n==================`);*/
        return false;
    }
}

function checkDateCondition(dateBounds: [[number, number, number], [number, number, number]]):boolean {
    // Get the current date as the American [month, day, year]
    const date = new Date();
    const currentDate = [date.getMonth() + 1, date.getDate(), date.getFullYear()];

    const minDate = dateBounds[0];
    const maxDate = dateBounds[1];

    // Are we below the minimum? The condition is not met if so.
    if (!(
            (currentDate[2] > minDate[2]) ||
            ((currentDate[2] == minDate[2]) && currentDate[0] > minDate[0]) ||
            ((currentDate[2] == minDate[2] && currentDate[0] == minDate[0]) && currentDate[1] >= minDate[1])
        )) {
        /*console.log(`[BCD-RANDOM-TEXT] Date is not above minimum`);*/
        return false;
    }

    // Are we above the maximum? The condition is not met if so.
    return !(maxDate != [0, 0, 0] && !(
            (currentDate[2] < maxDate[2]) ||
            (currentDate[2] == maxDate[2] && currentDate[0] < maxDate[0]) ||
            (currentDate[2] == maxDate[2] && currentDate[0] == maxDate[0] && currentDate[1] <= maxDate[1])
    ));
}
