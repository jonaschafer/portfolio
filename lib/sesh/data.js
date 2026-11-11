// /sunday-sesh library: the garage, the movements, the benchmarks and the
// words on the board. The generator in ./generate.js deals from these.
//
// Gear is counted in units so the generator never puts two people on one
// rower. A movement's `gear` says how many units one person ties up.
export const GEAR = {
  rower: 1,
  kb: 6, // 2×44, 2×45, 2×20 lb
  db: 2, // one adjustable pair, 5–55 lb
  barbell: 1,
  hex: 1,
  landmine: 1,
  bar: 2, // rack pull-up bar + the rings bar
  rings: 1,
  bench: 1,
  box: 1,
  slam: 1,
  band: 3,
}

// unit: reps | side (6/6) | cal | m | sec | secside (:20/:20)
// r: one working set, sized for about 40 seconds
// out: needs the driveway (the garage floor is 8×8)
// pattern: engine | hinge | squat | push | pull | carry | getup | core
const m = (id, name, pattern, gear, r, unit, cue, extra = {}) => ({ id, name, pattern, gear, r, unit, cue, ...extra })

export const MOVES = [
  // Engine
  m('row', 'row', 'engine', { rower: 1 }, 12, 'cal', 'Legs, then hips, then arms. Calories count up on the monitor, so a harder pull gets you there sooner.'),
  m('run', 'run', 'engine', {}, 200, 'm', 'Down the block and back. Easy to scale: walk it, or shorten it.', { out: true }),
  m('burpee', 'burpees', 'engine', {}, 8, 'reps', 'Chest to the floor, stand all the way up, little hop. Step back instead of jumping to scale.'),
  m('jumpsq', 'jump squats', 'engine', {}, 15, 'reps', 'Squat to parallel, jump, land soft and quiet.'),
  m('climber', 'mtn climbers', 'engine', {}, 40, 'reps', 'Plank, drive knees to chest fast. Count each leg.'),
  m('slam', 'slam ball', 'engine', { slam: 1 }, 10, 'reps', 'Ball overhead, slam it down with your whole body, squat to pick it up.', { out: true }),
  m('boxjump', 'box jumps', 'engine', { box: 1 }, 10, 'reps', 'Jump up, stand tall, step down. Low box is fine.'),
  m('skater', 'skater hops', 'engine', {}, 20, 'reps', 'Bound side to side on one leg, stick each landing.'),

  // Hinge
  m('swing', 'KB swings', 'hinge', { kb: 1 }, 15, 'reps', 'Hike it back, snap the hips, let the bell float to chest height. Arms are ropes.'),
  m('altswing', 'alt. swings', 'hinge', { kb: 1 }, 12, 'reps', 'One-arm swing, switch hands at the top of each rep.'),
  m('dblkbdl', 'DBL KB DL', 'hinge', { kb: 2 }, 10, 'reps', 'Two bells between the feet, flat back, push the floor away.'),
  m('hexdl', 'hex bar DL', 'hinge', { hex: 1 }, 6, 'reps', 'Heavy. Brace, push the floor away, stand tall, lower with control.'),
  m('lmrdl', 'landmine RDL', 'hinge', { landmine: 1 }, 10, 'reps', 'Hold the bar end at your hips, soft knees, push your butt back until hamstrings bite.'),
  m('slrdl', 'SL KB RDL', 'hinge', { kb: 1 }, 6, 'side', 'Stand on one leg, bell in the opposite hand, hinge like a tipping bird.'),
  m('dbrdl', 'DB RDL', 'hinge', { db: 2 }, 10, 'reps', 'Bells slide down the thighs, hips back, flat back.'),
  m('kbclean', 'KB cleans', 'hinge', { kb: 1 }, 5, 'side', 'Swing the bell back, zip it up close, catch it in the rack without it banging your wrist.'),
  m('snatch', 'KB snatch', 'hinge', { kb: 1 }, 5, 'side', 'Swing to overhead in one move, punch through at the top. Use the 20.'),
  m('hipthrust', 'hip thrusts', 'hinge', { barbell: 1, bench: 1 }, 10, 'reps', 'Upper back on the bench, bar on the hips, squeeze at the top for a beat.'),
  m('goodmorn', 'band good mornings', 'hinge', { band: 1 }, 15, 'reps', 'Band under the feet and behind the neck, hinge and stand.'),

  // Squat
  m('goblet', 'goblet squats', 'squat', { kb: 1 }, 10, 'reps', 'Bell at the chest, elbows inside the knees at the bottom.'),
  m('dblfsq', 'DBL KB front squat', 'squat', { kb: 2 }, 8, 'reps', 'Two bells in the rack, sit straight down, chest up.'),
  m('thruster', 'KB thrusters', 'squat', { kb: 2 }, 8, 'reps', 'Front squat into a press in one move. Use the legs to throw the bells up.'),
  m('backsq', 'back squat', 'squat', { barbell: 1, bar: 1 }, 6, 'reps', 'In the rack, J hooks set, safety arms on.'),
  m('lmlunge', 'landmine rev. lunge', 'squat', { landmine: 1 }, 6, 'side', 'Bar end at the chest, step back, back knee kisses the floor.'),
  m('stepup', 'box step ups', 'squat', { box: 1 }, 8, 'side', 'Whole foot on the box, drive through the heel, no push off the back leg.'),
  m('splitsq', 'DB split squat', 'squat', { db: 2 }, 8, 'side', 'Long stance, drop straight down, front heel stays planted.'),
  m('kblunge', 'KB rev. lunge', 'squat', { kb: 1 }, 6, 'side', 'Bell in the rack on the working side.'),
  m('airsq', 'air squats', 'squat', {}, 20, 'reps', 'Hip crease below the knee, stand all the way up.'),
  m('cossack', 'cossack squats', 'squat', {}, 6, 'side', 'Wide stance, sit into one hip, other leg straight with toes up.'),

  // Push
  m('pushup', 'push ups', 'push', {}, 10, 'reps', 'Body in one line, chest to a fist off the floor. Hands on the bench to scale.'),
  m('hrpushup', 'hand release push ups', 'push', {}, 8, 'reps', 'Chest all the way down, lift the hands, push back up.'),
  m('lmpress', 'landmine press', 'push', { landmine: 1 }, 6, 'side', 'Half kneeling or standing, press up and out along the bar path.'),
  m('kbpress', 'KB press', 'push', { kb: 1 }, 5, 'side', 'From the rack, squeeze glutes, press to lockout, bicep by the ear.'),
  m('dblpress', 'DBL KB press', 'push', { kb: 2 }, 6, 'reps', 'Both bells at once. Ribs down, no leaning back.'),
  m('dbbench', 'DB bench press', 'push', { db: 2, bench: 1 }, 10, 'reps', 'Shoulder blades pinned, lower to the chest, press up.'),
  m('floorpress', 'KB floor press', 'push', { kb: 1 }, 8, 'side', 'On your back, elbow touches down, press. Easy on the shoulders.'),
  m('pushpress', 'DB push press', 'push', { db: 2 }, 8, 'reps', 'Small dip with the knees, drive the bells overhead.'),
  m('pike', 'pike push ups', 'push', {}, 8, 'reps', 'Hips high like a down dog, head toward the floor between the hands.'),

  // Pull
  m('pullup', 'pull ups', 'pull', { bar: 1 }, 5, 'reps', 'Chin over the bar. Band for help, or jump up and lower slow.'),
  m('ringrow', 'ring rows', 'pull', { rings: 1 }, 10, 'reps', 'Body straight, pull the rings to your ribs. Walk feet forward to make it harder.'),
  m('kbrow', 'KB row', 'pull', { kb: 1 }, 8, 'side', 'Hand on the bench, pull the bell to your hip pocket.'),
  m('lmrow', 'landmine row', 'pull', { landmine: 1 }, 10, 'reps', 'Straddle the bar, hands under the end, row it to your chest.'),
  m('dbrow', 'DB row', 'pull', { db: 1 }, 8, 'side', 'Same as the KB row with a dumbbell.'),
  m('pullapart', 'band pull aparts', 'pull', { band: 1 }, 20, 'reps', 'Arms straight, pull the band to your chest, squeeze the shoulder blades.'),
  m('renegade', 'renegade rows', 'pull', { db: 2 }, 6, 'side', 'Plank on the dumbbells, row one side without the hips twisting.'),
  m('highpull', 'KB high pulls', 'pull', { kb: 1 }, 10, 'reps', 'Swing, then pull the elbow high and back at the top.'),
  m('hang', 'dead hang', 'pull', { bar: 1 }, 30, 'sec', 'Just hang. Grip and shoulders.'),

  // Carry (driveway)
  m('farmers', 'farmers carry', 'carry', { kb: 2 }, 40, 'm', 'Heaviest pair you can hold with tall posture. Walk, don\'t shuffle.', { out: true }),
  m('suitcase', 'suitcase carry', 'carry', { kb: 1 }, 20, 'side', 'One bell, one side. Don\'t lean. That\'s the whole exercise.', { out: true }),
  m('rackcarry', 'front rack carry', 'carry', { kb: 2 }, 40, 'm', 'Two bells in the rack, breathe behind the brace.', { out: true }),
  m('ohcarry', 'overhead carry', 'carry', { kb: 1 }, 20, 'side', 'Bell locked out overhead, bicep by the ear. Use the 20.', { out: true }),
  m('dbfarmers', 'DB farmers carry', 'carry', { db: 2 }, 40, 'm', 'Same as farmers, with the dumbbells.', { out: true }),

  // Getup
  m('tgu', 'TGU', 'getup', { kb: 1 }, 1, 'side', 'Turkish getup: lying down to standing with the bell locked out overhead, then back down. Slow. Eyes on the bell.'),
  m('halftgu', 'half getups', 'getup', { kb: 1 }, 2, 'side', 'The first half of a TGU: to the elbow, to the hand, sweep the leg to kneeling, then reverse.'),
  m('windmill', 'KB windmill', 'getup', { kb: 1 }, 3, 'side', 'Bell overhead, push the hip out, slide the other hand down the leg while you watch the bell.'),

  // Core
  m('hollow', 'hollow rocks', 'core', {}, 15, 'reps', 'Low back glued down, arms and legs long, rock like a banana.'),
  m('boxersit', 'boxer sit ups', 'core', {}, 10, 'reps', 'Sit up and throw a left-right punch at the top.'),
  m('deadbug', 'dead bugs', 'core', {}, 8, 'side', 'On your back, opposite arm and leg reach long while the low back stays down.'),
  m('plank', 'plank', 'core', {}, 40, 'sec', 'Squeeze everything. Elbows under shoulders.'),
  m('sideplank', 'side plank', 'core', {}, 20, 'secside', 'Stack the feet, hips high.'),
  m('rainbow', 'landmine rainbows', 'core', { landmine: 1 }, 6, 'side', 'Arms long, arc the bar end from hip to hip. The trunk resists, the arms just steer.'),
  m('halo', 'KB halos', 'core', { kb: 1 }, 5, 'side', 'Hold the bell by the horns upside down, circle it around your head.'),
  m('beast', 'beast hold', 'core', {}, 30, 'sec', 'Hands and toes, knees an inch off the floor, back flat.'),
  m('bearcrawl', 'bear crawl', 'core', {}, 15, 'm', 'Beast position, crawl. Opposite hand and foot move together.', { out: true }),
]

export const MOVE = Object.fromEntries(MOVES.map((x) => [x.id, x]))

// Warmup: one person on the rower, the rest on these.
export const WARMUP = [
  m('wgs', 'world\'s greatest stretch', 'mob', {}, 3, 'side', 'Long lunge, elbow to instep, then rotate that arm to the sky.'),
  m('halo-w', 'KB halos', 'mob', { kb: 1 }, 5, 'side', 'Light bell, slow circles around the head.'),
  m('goblet-w', 'goblet squat + pry', 'mob', { kb: 1 }, 5, 'reps', 'Sit at the bottom and push the knees out with the elbows.'),
  m('inchworm', 'inchworms', 'mob', {}, 5, 'reps', 'Walk the hands out to a plank and back.'),
  m('pullapart-w', 'band pull aparts', 'mob', { band: 1 }, 15, 'reps', 'Light band, wake up the upper back.'),
  m('glutebridge', 'glute bridges', 'mob', {}, 12, 'reps', 'On your back, squeeze and lift the hips.'),
  m('downdog', 'down dog to cobra', 'mob', {}, 6, 'reps', 'Flow between the two, slow.'),
  m('deadhang-w', 'dead hang', 'mob', { bar: 1 }, 20, 'sec', 'Easy hang, open the shoulders.'),
  m('halftgu-w', 'TGU to elbow', 'mob', {}, 3, 'side', 'The first move of a getup, shoe on the fist or a light bell.'),
  m('airsq-w', 'air squats', 'mob', {}, 10, 'reps', 'Slow, full depth.'),
]

// The finisher flow from the kettlebell gym: :20 each, no rest.
export const FLOW = ['loaded beast', 'beast', 'down dog', 'plank', 'side plank L', 'side plank R', 'down dog', 'beast', 'crab']

// Benchmarks, adapted to the garage. One per month; the first Sunday of the
// month runs it as block B so you can retest it next time it comes around.
export const BENCHMARKS = [
  {
    name: 'KB Helen',
    lines: ['3 rds for time', '400m run', '21 KB swings', '12 pull ups'],
    score: 'Time',
    note: 'Run it in heats of two (two pull-up bars). Next heat starts when the first heads out on round 2.',
  },
  {
    name: 'Cindy',
    lines: ['AMRAP 20', '5 pull ups', '10 push ups', '15 air squats'],
    score: 'Rounds + reps',
    note: 'Two on the pull-up bars, anyone else swaps pull ups for ring rows and notes it.',
  },
  {
    name: '2k row',
    lines: ['2000m row for time'],
    score: 'Time (and it lands on /row)',
    note: 'One at a time. Everyone else does 3 rds of 10 goblet squats + 10 push ups while they wait, then cheers.',
  },
  {
    name: 'KB Fran',
    lines: ['21-15-9 for time', 'DBL KB thrusters', 'pull ups'],
    score: 'Time',
    note: 'Heats of two. Pick a weight you can do 21 unbroken when fresh, usually the 20s.',
  },
  {
    name: 'Getups + swings',
    lines: ['100 KB swings', 'rest 1 min', '10 TGU (5/5)', 'for time'],
    score: 'Time for each half',
    note: 'Everyone at once, there are six bells. Swings in sets of 10 is the classic way.',
  },
  {
    name: 'KB DT',
    lines: ['5 rds for time', '12 DBL KB DL', '9 DBL KB cleans', '6 DBL KB push press'],
    score: 'Time',
    note: 'Three can go at once on the three pairs. Same pair for all three moves.',
  },
  {
    name: 'Half Murph',
    lines: ['800m run', '50 pull ups', '100 push ups', '150 air squats', '800m run'],
    score: 'Time',
    note: 'Split the middle however you want (5-10-15 rounds is common). Pull ups: two at a time, ring rows for the rest.',
  },
]

// Board shorthand, for the info buttons and the glossary.
export const GLOSSARY = [
  ['EMOM', 'Every minute on the minute. Do the work at the top of each minute, rest whatever is left.'],
  ['Stagger start', 'Everyone starts at a different station of the EMOM, so only one person is on each station at a time. Move down one each minute.'],
  ['AMRAP', 'As many rounds and reps as possible in the time. Score is rounds plus extra reps.'],
  ['You go / I go', 'Partner style. One works while the other rests, then switch. Rest is however long your partner takes.'],
  ['Ladder', 'Add a rep every round: 1, 2, 3, 4… Keep climbing until time runs out. Score is the last full rung.'],
  ['Chipper', 'One long list, done once, top to bottom. As a team, split the reps however you want.'],
  ['Death by', 'Minute 1 do 1 rep, minute 2 do 2, and so on. You\'re out when you can\'t finish the reps inside the minute.'],
  ['21-15-9', 'Three rounds of the moves listed: 21 reps each, then 15, then 9.'],
  ['For time', 'Finish it as fast as you can. Score is the clock.'],
  ['Time cap', 'Stop here even if you aren\'t done. Score is how far you got.'],
  ['Heats', 'Take turns in small groups so nobody fights over the gear.'],
  ['Relay', 'One shared piece of work, passed person to person.'],
  ['cal', 'Calories on the rower monitor. "12 cal row" means row until it reads 12.'],
  ['6/6', 'Six each side: six left, then six right.'],
  [':30', 'Seconds. ":30 plank" means hold for 30 seconds.'],
  ['rds', 'Rounds.'],
  ['TGU', 'Turkish getup. Lying down to standing with a bell overhead, then back down.'],
  ['DBL', 'Double: a kettlebell in each hand.'],
  ['alt.', 'Alternating hands or sides each rep.'],
  ['DL / RDL', 'Deadlift / Romanian deadlift. The RDL starts standing and stops before the plates touch.'],
  ['SL', 'Single leg.'],
]
