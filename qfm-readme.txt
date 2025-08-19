   ___              _          _____                      __  __                                 
  / _ \ _   _  __ _| | _____  |  ___| __ ___  _ __ ___   |  \/  | ___ _ __ ___   ___  _ __ _   _ 
 | | | | | | |/ _` | |/ / _ \ | |_ | '__/ _ \| '_ ` _ \  | |\/| |/ _ \ '_ ` _ \ / _ \| '__| | | |
 | |_| | |_| | (_| |   <  __/ |  _|| | | (_) | | | | | | | |  | |  __/ | | | | | (_) | |  | |_| |
  \__\_\\__,_|\__,_|_|\_\___| |_|  |_|  \___/|_| |_| |_| |_|  |_|\___|_| |_| |_|\___/|_|   \__, |
                                                                                           |___/ 
(or, id1 cursed edition)
------------------------------------------

If somehow id1 was wiped off of all computers in the world, do we collectively remember the maps well enough to recreate them?

We tried to answer that question.

Jam started December 28th, 2024 and concluded with a "shareware" release February 9th, 2025. Work on the remainder of the game continued through August of 2025.

The mod comes in 2 flavors: 

  - qfm-v1.zip: This version replaces all id1 maps with their from-memory counterparts. Included is a bugfixed id1 progs, so no fish bug here! 
  - qfm-v1-maps-only.zip: This version includes all of the maps named with their author names, like `start_il8r`. These can be loaded into any mod and played without overriding anything.

Tested in DOS Quake, Ironwail, and Kex (Remaster).

Due to some last minute technical difficulties, we have 2 versions of e2m6 - just like the retail game did. The longer cut is labeled as e2m10 - and ent files are included for both flavors to use it instead the shorter e2m6 cut. Try them both - they're great!


Installation:
------------------------------------------

For qfmjam-v1.zip:
Create a new folder in your Quake directory called qfmjam, copy all files into it. Launch the game with `-game qfmjam` or enter `game qfmjam` in the console on supported ports. Start the game as normal.

For qfmjam-v1-maps-only:
Extract the maps folder into your desired mod. Run `map start_il8r` to load the start map.

OPTIONAL: To use the optional extended version of e2m6 within the episode, copy the .ent file in the "optional" directory into the appropriate "maps" directory for the mod. It'll change e2m5 to exit to e2m10 instead of e2m6.


Credits:
------------------------------------------
iLike80sRock: Organizer, start, e3m2, e4m5, e4m7
rabbit: e1m1
Avix: e1m2
ChadQuad: e1m3
CommonCold: e1m4
Raton: e1m5
Atom1K: e1m6, e3m6
Chuma: e1m7, e2m5, e4m6, end, Testing & QA
gnemeth: e1m8, e2m2
Niccolicious: e2m1, e2m4
Text_Fish: e2m7, e4m4
RecycledOJ: e2m3, e2m6, e3m1, e3m5
ZungryWare: e4m1
shark: e4m2
NewHouse: e2m5, e3m3, e3m7, e4m3, e4m6, e4m7
Dooplon: e2m6
wiedo: e3m3, e3m4
rj: e3m7, e4m8


License:
------------------------------------------
Provided map sources CAN be used for further works, but keep in mind that these maps are based off of id Software's original maps. Any limitations that would apply to using the original map sources apply here.


Known issues:
------------------------------------------
e4m4: Zombies in one of the traps can be squished and become unhittable by anything but splash damage. This is an id1 bug I'm not sure how to fix.
DOS Specific: e2m3 has greyflash in one specific area


Contact:
------------------------------------------
@ilike80srock on Discord
iLike80sRock on Slipseer


Original Jam Prompt:
------------------------------------------
Recreate a map from id1 completely from memory! This is inspired by the similar community projects for Doom.

If you don't remember exact details, that's fine. In fact, it will probably enhance the entertainment value. However, you must try to recreate the map faithfully. This is not a remix jam.

Info
Start time: as soon as you like
Deadline for claiming a map: January 31st, 2025
Completion deadline: February 9th, 2025
Slipseer thread: https://www.slipseer.com/index.php?threads/quake-from-memory.610/

Rules
Decide on a map from id1. 
I have a spreadsheet of what maps are currently in progress here: https://jjelliott.github.io/quake-from-memory
If you feel strongly about a map that is already in progress / done, you must complete an unclaimed map before doing a duplicate.
DM @iLike80sRock on Discord or post in the Slipseer thread once you have chosen a map.
DO NOT play the map or look at the original source once you have notified me you are taking a map.
Submit your final .bsp and .map (if including) by DMing @iLike80sRock on Discord or posting in the Slipseer thread.
No limit on submissions, contribute as many maps as you want.

Technical Requirements
id1 progs. If possible, please test on both classic and remaster progs. The release will utilize a bugfixed version: https://github.com/jjelliott/qfm-progs/releases/tag/v1.0
Make sure your map at least runs in the newest version of QuakeSpasm. I will be testing DOS and Remaster compatibility as well, so if you have access to those please test your map there.
Make your map name e#m#_author with the appropriate changelevel(s). (example: e3m2_il8r should have a changelevel to e3m3)
Make sure your map has a message field, preferably with a name (humorously) referencing the original
Make sure you set a sounds value. If you remember what track your map used for real, great! If not, just pick your favorite.
At least 3 coop starts and at least 8 deathmatch starts. Please test that map is completable in coop.
Use only the wads from here: https://www.slipseer.com/index.php?resources/original-vanilla-quake-wads.18/. Exception is you may use your own hint/clip/skip wad.
No skyboxes / custom music
Include map source (Highly recommended, not required)

Hints
Make sure you do not use target on pickups to prevent breakages in coop, instead surround items with a trigger_once
For an original look (not required, but recommended)
-Opaque liquids (use -notranswater on qbsp and set _wateralpha 1 on worldspawn)
-No colored lights
-No fog
-splitturb 0 on qbsp

Reference if you want to be told you're forgetting / fabricating something without any spoilers about what: https://www.ledmeister.com/q1counts.txt
