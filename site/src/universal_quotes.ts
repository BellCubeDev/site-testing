/* (these variables are defined here so they aren't kept in memory the whole time)
We pull from the Conditionalized array before the Generic array to ensure that we always have some text.

Possible conditions:
time: An array of time bounds in 24hr [H,M].
random: A float between 0 and 1. If the Math.random number is less than this, the condition is met.
date: An array of date bounds in [M,D,YYYY]. Set either to [0,0,0] to mark it as unbounded.
*/


/*$$$$$\                        $$\
$$  __$$\                       $$ |
$$ /  $$ |$$\   $$\  $$$$$$\  $$$$$$\    $$$$$$\   $$$$$$$\
$$ |  $$ |$$ |  $$ |$$  __$$\ \_$$  _|  $$  __$$\ $$  _____|
$$ |  $$ |$$ |  $$ |$$ /  $$ |  $$ |    $$$$$$$$ |\$$$$$$\
$$ $$\$$ |$$ |  $$ |$$ |  $$ |  $$ |$$\ $$   ____| \____$$\
\$$$$$$ / \$$$$$$  |\$$$$$$  |  \$$$$  |\$$$$$$$\ $$$$$$$  |
 \___$$$\  \______/  \______/    \____/  \_______|\_______/
     \__*/



export const possibilities_conditionalized:[conditionObj, string][] = [
    [ {random: .1,}, "Your firstborn is Sheson&rsquo;s!" ],
    [ {random: .1}, "And why not? Imagine how unbearably, how unutterably cold the universe would be if one were all alone." ], // - https://www.mit.edu/people/dpolicar/writing/prose/text/thinkingMeat.html
    [ {random: .5}, "STOP REFRESHING!!!" ],
    [ {time: [[3,0], [11,59]]}, "Good morning!" ],
    [ {time: [[3,0], [11,59]]}, "&lsquo;Mornin! Nice day for fishin&rsquo;, ain&rsquo;t it?" ],
    [ {time: [[12,0], [12,0]]}, "Good noon!" ], // Dunno what the chances are on this one, but my goodness would it be cool
    [ {time: [[12,1], [19,0]]}, "Good afternoon!" ],
    [ {time: [[18,30], [24,0]]}, "Good evening!" ],
    [ {time: [[0,0], [5,0]]}, "<s>Friendly reminder that you should probably be sleeping right now</s>" ],
    [ {date: [[0,0,0], [3,32,2023]], random: .25}, "Starfield community beta when?"],
    [ {random: .05}, "Well, well, well. You must be perty lucky!" ],
    [ {random: .001}, "WHAT IN OBLIVION?!!! <b>WHY ARE YOU SO LUCKY?!!</b>" ],
    [ {random: .25}, "Known Troublemakers:<ul><li>Lively</li><li>Lively&rsquo;s Cat</li><li>Lively Again</li></ul>&mdash; BigBizkit" ],
    [ {random: .75}, "Nexus Mods is the best!"],
    [ {random: .5}, "And then I&hellip; I would be named&hellip; <i><b>TIM!</b></i><br />The horrors would never cease!" ],
    [ {random: .75}, "Greetings, Dragonborn."],
    [ {random: .5}, "Welcome, Dovahkiin."],
    [ {random: .75}, "War. War never changes."],
    [ {random: .25}, "The Institute liked that."],
    [ {random: .33}, "Do you get to the Cloud District very often?"],
    [ {random: .33}, "By Azura, by Azura, by Azura! It&rsquo;s you! The Grand Champion!"],
    [ {random: .5}, "You should not be here, Mortal! Your life is forfeit. Your flesh is mine."],
    [ {random: .1}, "Psst. Hey, I know who you are. Hail Sithis."],
    [ {random: .1}, "You wear the armor of the bear, my friend. A fine choice."],
    [ {time: [[20,0], [24,0]]}, "Only burglars and vampires creep around after dark. So which are you?" ],
    [ {time: [[0,0], [5,0]]}, "Only burglars and vampires creep around after dark. So which are you?" ],
    [ {random: .01}, "It just works!"]
];

export const possibilities_Generic = [
    "Hello!",
    "Hi!",
    "Well well well, what do we have here?",
    "Oh, hello there!",
    "Welcome to YOUR WORST NIGHTMARE!!!",
    "I&rsquo;m a <s>random text generator</s> sentient being!",
    "I don&rsquo;t know if the LOOT admins love me or are annoyed with me.",
    "What a crazy world we live in!",
    "Starfield Community Patch BABY!!!",
    "Thank Vivec you&rsquo;ve arrived. There is much to do!",
    "The cake is a lie",
    "May the ground quake as you pass!",
    "<s>WELCOME to Belethor&rsquo;s General Goods!</s>",
    "You. I&rsquo;ve seen you. Let me see your face.",
    "Halt! Halt!",
    "Hm? Need something?",
    "May the force be with you.",
    "You&rsquo;re braver than I thought!",
    "You&rsquo;re asking my opinion? How uncharacteristic.",
    "My olfactory sensors are picking up <b>quite a strong odor.</b>",
    "With people like you making decisions, no wonder nuclear war broke out.",
    "Have I mentioned I&rsquo;m afraid of heights? Especially ones with ramshackle crumbly bits?",
    "Here&rsquo;s the thing, I&hellip; <i>I forget the thing.</i>",
    "That coin-pouch getting heavy?",
    "So rise up! <b>RIIIIIISE UP</b>, children of the Empire! <b>RIIIIIISE UP</b>, Stormcloaks!",
    "We mug people! And wagons.",
    "By the rules of the street, I now own there.",
    "I just make character and run amok.", // - chuckseven1
    "You a fan of grilled cheese?",
    "Ever tried Vegimite? Stuff&rsquo;s bitter as all get-out.",
    "Sup.", // - Haelfire
    "I stuffed that kitty cat so full of lead, we&rsquo;ll have to use it as a pencil instead.",
    "May the Bluebird of Paradise roost in your nostril.",
    "¡Hola!",
    "So who made the machines? That&rsquo;s who we want to contact.", // - https://www.mit.edu/people/dpolicar/writing/prose/text/thinkingMeat.html
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
    "Darkwood&rsquo;s a dangerous place, Hero.",
    "Farm-boy!",
    "My helmet, my armour, my sword and my shield. Bring these to me and the path I shall yield.",
    "Hero, your health is low. Do you have any potions&mdash;or food?",
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
    "Smile my dear, you&rsquo;re never fully dressed without one.",
    "Obscure?<br />I can do obscure.",
    "Of course, the Gods work in mysterious ways.<br  />Like a healing shiv.",
    "First there was darkness. Then came the Strangers.",
    "There&rsquo;s nothing cooler than casually walking away after blowing something up.",
    "<i>Johnny, what can you make outta this?</i><br><i>This? Why, I could make a hat, or a broach, pterodactyl&hellip;</i>",
    "Landshark!",
    "When will then be now? Soon.",
    "Unless someone like you cares a whole awful lot, nothing is going to get better.<br />- Dr. Seuss",
    "It&rsquo;s only when we&rsquo;ve lost everything, that we are free to do anything.",
    "We&rsquo;re gonna need a bigger boat.",
    "The skies are marked with numberless sparks, each a fire, and every one a sign.",
    "Perhaps the Gods have placed you here so that we may meet.",
    "With such hope, and with the promise of your aid, my heart must be satisfied.",
    "Men are but flesh and blood. They know their doom, but not the hour.",
    "Stand true, my friend. May your heart be your guide and the gods grant you strength.",
    "Remember me, and remember my words. This burden is now yours alone. You hold our future in your hands.",
    "This can only lead to your death. My guardians are sworn to protect me.",
    "Your destiny calls you down a different road.",
    "What if fish had legs?", // - doodlez
    "Better to poop in the shower than to shower in the poop.", // - mxinformation
    "What&rsquo;s the deal with airline food?", // - mxinformation
    "Lesbiab", // - chuckseven1
    "The Chip is my invention, my property, MINE.",
    "We are writers, my love. We don&rsquo;t cry; we bleed on paper.", // - A.Y.
    "<code>79 + 1 = 80</code>", // - Sigismund
    "&hellip;the hit 2010 video game Fallout: New Vegas&hellip;", // - Sigismund
    "And He said to me, It is done! I am the Alpha and the Omega, the Beginning and the End. I will give of the fountain of the water of life freely to him who thirsts.",
    "28 STAB WOUNDS",
    "Now be a good courier and deliver it!",
    "I know exactly what I&rsquo;m doing. I just don&rsquo;t know what effect it&rsquo;s going to have.",
    "Quote me more<br /> &mdash; chuckseven1",
    "It&rsquo;s ridiculous and unnecessary, but when has that ever stopped programmers?", // I love Tom Scott

    // xkcd has me covered on these!
    "This quote was taken out of context.",
    "I&rsquo;m being quoted to [entertain you as part of something], but I have no idea what it is and certainly don&rsquo;t endorse it.",
    "Oooh, look at me, I looked up a quote!",
    "This quote is often falsely attributed to Mark Twain",
    "Websites that collect quotes are full of mistakes and never check original sources.",
    "If you&rsquo;re doing a text search in this document for the word &lsquo;butts,&rsquo; the good news is that it&rsquo;s here, but the bad news is that it only appears in this unrelated quote",
    "Sent from my iPhone",

    "What&rsquo;s a lumberjack&rsquo;s favorite button on a calculator? <code>LOG</code>.",
    "What&rsquo;s the point?",
    "I&rsquo;m calibrating this drone footage.",
    "I push buttons. I turn dials. I read numbers. Sometimes I make up little stories in my head about what the numbers mean.",
    "I am myself for tax purposes.", // HazakTheMad
    "I mean the macaroni's soggy, the peas are mushed,<br />And the chicken tastes like wood",
    "Man, I just wanna make a boid simulation <i>smh</i>", // - Vuunyy
    "I am at piece with my not-so-inner idiot.",
    "You have to flaunt the weird, my friends.",
    "I a&nbsp;m a&nbsp;n&nbsp;d&nbsp;e&nbsp;r&nbsp;s&nbsp;o&nbsp;n", // Copilot was here
    "I want a freezer that heats things up like a microwave.", // - an IRL friend
    "I'd love to show you, but, frankly, I'm not sure how.",
    "When I hear music, I feel like I'm in a movie.",
    "I'm not a fan of the word &lsquo;fan.&rsquo;",
    "I ain&rsquo;t gonna say &ldquo;ain&rsquo;t&rdquo; &lsquo;cuz &ldquo;ain&rsquo;t&rdquo; ain&rsquo;t in the dictionary.",
    "Now isn&rsquo;t that special?",
    "Whatever it is, I&rsquo;ll take ten.",
    "Though I dread the memory, I can&rsquo;t help but smile.",
    "Without proper guidance, one cannot hope to come within a ten-mile radius of the truth.",
    "Man, I feel really good coming up with all of these quotes!",
    "I know you think you understand what you thought I said but I&rsquo;m not sure you realize that what you heard is not what I meant",
    "Whatever you&rsquo;re doing, I implore you to continue.",
    "Stop looking at me, I&rsquo;m not a quote generator.",
    "I&rsquo;m not a quote generator, I&rsquo;m a quote <i>selector</i>.",
    "Having good quotes is overrated.",
    "Whatever she told you, she lied.",
    "You see, everything is a quote if you surround it with quotation marks.",
    "Latin has a word for it, but I don&rsquo;t speak Latin.",
    "Somebody better call the Nuclear Regulatory Commission.",
    "This will all make sense when I am older.",
    "I&rsquo;m busy and you can&rsquo;t come in.",
    "Don&rsquo;t sweat the petty stuff and don&rsquo;t pet the sweaty stuff.",
    "The man who does not read has no advantage over the man who cannot read.<br />&mdash; Mark Twain",
    "I don't believe in Blackjack", // - an IRL friend
    "When stupidity is considered patriotism, it is unsafe to be intelligent", // - Isaac Asimov
    "I don't care how many fancy Latin names he gives himself, a thug ain&rsquo;t nothin&rsquo; but a thug",
    "Although, being a scientist, I have to admit I might&rsquo;ve just blinked for longer than usual",
    "Speaking without thinking is not the same as telling the truth",
    "Mine is downloading Couples Therapy.",
    "&OpenCurlyDoubleQuote;Because&CloseCurlyDoubleQuote; is the tastiest reason.",
    "How many wives do you have?",
    "i like horses and i&rsquo;ve got uncontrollable forehead acne",
    "do not abuse the banana privilieges",
    "if you get me a quarter-pounder with cheese i will love you and your children <i>for all eternity</i>",
    "i want a girl in ohio so everytime i visit her i can get that sweet, cheap ohio gas",
    "dwayne<br>or the rock<br>but what about&hellip;<br>the johnson",
    "i just wanna see the girl of by dreams spitting blood out of a wolf",
    "women can be serial killers too<br>#feminism",
    "when it doesn't work, spit on it",
    "i love a good clavicle",
    "I had the <i>right</i> to remain silent&mdash;but I didn&rsquo;t have the <i>ability</i>.",
    "People who think they know everything are a great annoyance to those of us who do.", // - Isaac Asimov
];


/*$$$$$\                            $$\ $$\   $$\     $$\
$$  __$$\                           $$ |\__|  $$ |    \__|
$$ /  \__| $$$$$$\  $$$$$$$\   $$$$$$$ |$$\ $$$$$$\   $$\  $$$$$$\  $$$$$$$\
$$ |      $$  __$$\ $$  __$$\ $$  __$$ |$$ |\_$$  _|  $$ |$$  __$$\ $$  __$$\
$$ |      $$ /  $$ |$$ |  $$ |$$ /  $$ |$$ |  $$ |    $$ |$$ /  $$ |$$ |  $$ |
$$ |  $$\ $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$\ $$ |$$ |  $$ |$$ |  $$ |
\$$$$$$  |\$$$$$$  |$$ |  $$ |\$$$$$$$ |$$ |  \$$$$  |$$ |\$$$$$$  |$$ |  $$ |
 \______/  \______/ \__|  \__| \_______|\__|   \____/ \__| \______/ \__|  \__|



 $$$$$$\  $$\                           $$\       $$\
$$  __$$\ $$ |                          $$ |      \__|
$$ /  \__|$$$$$$$\   $$$$$$\   $$$$$$$\ $$ |  $$\ $$\ $$$$$$$\   $$$$$$\
$$ |      $$  __$$\ $$  __$$\ $$  _____|$$ | $$  |$$ |$$  __$$\ $$  __$$\
$$ |      $$ |  $$ |$$$$$$$$ |$$ /      $$$$$$  / $$ |$$ |  $$ |$$ /  $$ |
$$ |  $$\ $$ |  $$ |$$   ____|$$ |      $$  _$$<  $$ |$$ |  $$ |$$ |  $$ |
\$$$$$$  |$$ |  $$ |\$$$$$$$\ \$$$$$$$\ $$ | \$$\ $$ |$$ |  $$ |\$$$$$$$ |
 \______/ \__|  \__| \_______| \_______|\__|  \__|\__|\__|  \__| \____$$ |
                                                                $$\   $$ |
                                                                \$$$$$$  |
                                                                 \_____*/




// This function is not super hard to understand if you can read comments and collapse blocks of code.
export function checkCondition(condition:conditionObj):boolean {
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
            const conditionTime : [number, number] = [condition.time[0][0] * 60 + condition.time[0][1], condition.time[1][0] * 60 + condition.time[1][1]];

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

export function checkDateCondition(dateBounds: conditionDateBounds):boolean {
    // Get the current date as the American [month, day, year]
    const date = new Date();
    const currentDate : [number, number, number] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];

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
    return !(JSON.stringify(maxDate) != JSON.stringify([0, 0, 0]) && !(
            (currentDate[2] < maxDate[2]) ||
            (currentDate[2] == maxDate[2] && currentDate[0] < maxDate[0]) ||
            (currentDate[2] == maxDate[2] && currentDate[0] == maxDate[0] && currentDate[1] <= maxDate[1])
    ));
}


function saveStorage() {
    try {
        localStorage.setItem('BCD - Last 50 Quotes', JSON.stringify(last50));
    } catch {
        return false;
    }
    return true;
}

const last50 = JSON.parse(localStorage.getItem('BCD - Last 50 Quotes') ?? '[]');

export function getRandomQuote_base(){
    const pos = Math.floor(Math.random() * (possibilities_Generic.length + possibilities_conditionalized.length));
    return pos < possibilities_Generic.length ? possibilities_Generic[pos]! : possibilities_conditionalized[pos - possibilities_Generic.length]!;
}

export function getRandomQuote() {
    let quote = getRandomQuote_base();

    while (last50.includes(typeof quote === 'string' ? quote : quote[1]) || (typeof quote !== 'string' && !checkCondition(quote[0]!))) {
        quote = getRandomQuote_base();
    }

    last50.push(typeof quote === 'string' ? quote : quote[1]);
    if (last50.length > 50) last50.shift();

    saveStorage();
    return quote;
}

export type conditionDate_Individual = [number, number, number]
export type conditionDateBounds = [conditionDate_Individual, conditionDate_Individual]

export type conditionTime_Individual = [number, number]
export type conditionTimeBounds = [conditionTime_Individual, conditionTime_Individual]

export type conditionObj = {random?: number; time?: conditionTimeBounds, date?: conditionDateBounds}
