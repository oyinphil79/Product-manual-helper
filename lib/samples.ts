// Three built-in device manuals, already split into pages, so the app works
// with one click and no upload. Each comes with a question to try.

import { clean } from "./pdf-text";
import type { Page } from "./types";

export type Sample = {
  id: string;
  name: string;
  dot: string; // chip dot colour
  question: string;
  pages: string[];
};

export const SAMPLES: Sample[] = [
  {
    id: "router",
    name: "Wi-Fi router",
    dot: "#22c55e",
    question: "The internet light is blinking orange and nothing connects. What should I do?",
    pages: [
      "Aero AX1800 Wi-Fi Router — User Manual. Thank you for choosing the Aero AX1800 dual-band router. This manual explains how to set up the router, read its status lights, change Wi-Fi settings and fix common problems. Keep it for future reference. Safety: use only the 12 V power adapter supplied in the box. Do not place the router in a closed cabinet, near a microwave oven or on top of other electronics, because heat and interference reduce range. In the box: one router, one 12 V adapter, one Ethernet cable and this manual. Contents: page 2 setup, page 3 status lights, page 4 internet troubleshooting, page 5 Wi-Fi troubleshooting and factory reset.",
      "Setup. Step 1: Switch off your modem and unplug its power for 30 seconds. Step 2: Connect the supplied Ethernet cable from the modem to the blue WAN port on the back of the router. Step 3: Plug the modem back in and wait until its online light is steady. Step 4: Connect the router's power adapter and press the power button. The power light turns solid white after about two minutes. Step 5: On your phone or laptop, join the network printed on the label under the router, using the password on the same label. Step 6: Open a browser and go to http://aero.setup to finish the setup wizard, choose a new network name and a new admin password.",
      "Status lights. Power: solid white means on, blinking white means starting up or updating firmware. Do not unplug the router while the power light blinks. Internet: solid white means connected to the internet. Blinking orange means the router cannot reach your internet provider. Solid orange means the cable in the WAN port is unplugged or damaged. Off means internet is disabled in settings. Wi-Fi 2.4 GHz and 5 GHz: solid white means the band is on, off means the band is disabled. WPS: blinking white means pairing is in progress for up to two minutes.",
      "Troubleshooting: no internet. If the internet light blinks orange, follow these steps in order. Step 1: Check that the Ethernet cable is firmly plugged into the blue WAN port and into the modem. Step 2: Restart the modem and router: unplug both, wait 30 seconds, plug in the modem first, wait until its online light is steady, then plug in the router. Step 3: If the light still blinks orange after five minutes, connect a laptop directly to the modem with a cable. If the laptop has no internet either, the problem is with your provider; contact them. Step 4: If the laptop works but the router does not, open http://aero.setup, go to Internet, and choose the connection type your provider uses (DHCP or PPPoE), then enter the user name and password they gave you.",
      "Troubleshooting: weak or missing Wi-Fi. If devices cannot find the network, check that the Wi-Fi lights are on; press the Wi-Fi button on the side for two seconds to turn both bands on. If the signal is weak, move the router to a central, raised position away from thick walls and metal. Devices far away should use 2.4 GHz; nearby devices are faster on 5 GHz. Factory reset: if you forgot the admin password, or nothing else works, press and hold the recessed Reset button with a paper clip for 10 seconds until the power light blinks. The router restarts with the settings on the label, and you must run the setup wizard again.",
    ],
  },
  {
    id: "espresso",
    name: "Espresso machine",
    dot: "#f59e0b",
    question: "Coffee comes out very slowly, just dripping. How do I fix it?",
    pages: [
      "Brio 15-bar Espresso Machine — Instruction Manual. Read all instructions before first use. Place the machine on a flat, dry surface away from the edge of the counter. Never operate it without water in the tank, and never open the steam knob towards your hand. The machine has a 1.5 litre removable water tank, a portafilter with single and double filter baskets, a steam wand for milk and a cup warming plate. Contents: page 2 first use, page 3 making espresso, page 4 cleaning and descaling, page 5 troubleshooting.",
      "First use. Step 1: Rinse the water tank, fill it with fresh cold water up to the MAX mark and slide it back until it clicks. Step 2: Press the power button; the light blinks while the machine heats and stays on when it is ready, after about 40 seconds. Step 3: Without coffee in the portafilter, lock it into the group head and place a cup underneath. Step 4: Press the espresso button and let a full tank of water run through to flush the system. Step 5: Turn the steam knob open for 10 seconds with a jug under the wand, then close it.",
      "Making espresso. Use finely ground coffee for espresso: about 9 g for a single basket and 18 g for a double. Level the grounds and press them firmly with the tamper using even pressure. Wipe loose grounds off the rim, then lock the portafilter in by turning it to the right. Press the espresso button once for a single shot or twice for a double; the machine stops automatically. A good shot takes 25 to 30 seconds and has a thick golden crema. If it runs much faster, use a finer grind or tamp harder; if it runs much slower, use a coarser grind or tamp lighter.",
      "Cleaning and descaling. After each use, knock out the coffee puck, rinse the portafilter and wipe the steam wand with a damp cloth. Once a week, remove the shower screen under the group head and brush it clean. Descale every two months, or every month in hard water areas, or when the descale light comes on. Step 1: Mix 500 ml of water with descaling solution in the tank. Step 2: Run half the tank through the group head and the other half through the steam wand. Step 3: Rinse the tank and run two full tanks of clean water through to remove all solution.",
      "Troubleshooting. Coffee only drips or flows very slowly: Step 1: The grind is too fine or the coffee is tamped too hard; use a slightly coarser grind and tamp lighter. Step 2: Check that the filter basket holes are not blocked; soak the basket in hot water and brush it. Step 3: If the problem continues, the machine needs descaling; follow the descaling steps on page 4. No water comes out at all: check the tank is seated correctly and not empty. Coffee is too cold: warm the cups on the warming plate and run a shot of hot water first. Water leaks from the portafilter: clean the rim and the rubber gasket, and make sure the portafilter is turned fully to the right.",
    ],
  },
  {
    id: "washer",
    name: "Washing machine",
    dot: "#6366f1",
    question: "My washer shows error E21 and won't drain. What do I do?",
    pages: [
      "Lumo 8 kg Front-Load Washing Machine — Owner's Manual. This manual covers installation, programmes, care and error codes. Before first use, remove the four transport bolts on the back and fit the plastic covers supplied. Connect the cold water inlet hose and make sure the drain hose is hooked no higher than 100 cm above the floor. Always load laundry loosely and close the door until it clicks. Contents: page 2 programmes, page 3 detergent and care, page 4 error codes, page 5 cleaning the drain pump filter.",
      "Programmes. Cotton 40: everyday cotton, 3 hours, up to 8 kg. Eco 40-60: most energy efficient for mixed loads. Synthetics: 2 hours, up to 4 kg. Quick 15: lightly soiled items, up to 2 kg. Wool: hand-wash quality, low spin. Rinse and Spin: rinses and spins without washing. Drain: empties the drum without spinning. To start, turn the dial to a programme, adjust temperature and spin if needed, then press Start/Pause. To add a forgotten item, press Start/Pause and wait for the door lock symbol to go out.",
      "Detergent and care. Use low-foam detergent for front-loaders. Compartment I is for prewash, II for main wash, and the flower symbol for softener; never fill above the MAX line. After every wash, leave the door and the drawer slightly open so the drum can dry. Once a month, run an empty Cotton 90 cycle with a cup of descaler or washing machine cleaner. Wipe the door seal and check the folds of the rubber for coins, hair and lint.",
      "Error codes. E10: no water enters; open the tap fully and check the inlet hose is not bent. E21: the water does not drain. Step 1: Check the drain hose is not kinked or squashed behind the machine. Step 2: Make sure the end of the drain hose is not pushed more than 15 cm into the standpipe. Step 3: Clean the drain pump filter as described on page 5. Step 4: Run the Drain programme. If E21 appears again, contact service. E40: the door is not closed; close it firmly until it clicks. EF0: water leak detected; turn off the tap and unplug the machine, then call service.",
      "Cleaning the drain pump filter. Clean the filter every three months, or when error E21 appears. Step 1: Unplug the machine and let the water cool if you just ran a hot wash. Step 2: Open the small flap at the bottom right of the front panel. Step 3: Put a shallow tray and a towel under the flap, because water will come out. Step 4: Pull out the thin emergency drain hose, remove its plug and let the water run into the tray. Step 5: Turn the filter anticlockwise, pull it out and remove lint, coins and hair. Step 6: Rinse the filter, screw it back clockwise until tight, refit the hose plug and close the flap.",
    ],
  },
];

// The same page shape /api/read returns, so samples and uploads look alike.
export function samplePages(id: string): Page[] {
  const s = SAMPLES.find((x) => x.id === id);
  if (!s) return [];
  return s.pages.map((text, i) => ({ doc: s.name, page: i + 1, text: clean(text) }));
}
