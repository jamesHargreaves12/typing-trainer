const specificLetterPassages = {
  "1": ["Most tutorials begin with an H1 and a course labeled 101; editors set subheads at 16 pt and footnotes at 11 pt, then mark a 1st draft due in 10 days.",
    "Russia spans 11 time zones. The M1 highway leaves Moscow toward Belarus, rail lines climb near 61 N, and planners counted a 1st tranche of 31 priority junctions in the 1970s.",
    "F1's hybrid era uses 1.6 L engines since 2014. At Interlagos the race runs 71 laps, top speeds crest 310 kmh, and crews stick to a 100 kmh pit limit.",
    "Modern CPUs rely on an L1 cache for speed, commonly around 16 KB for instructions and 128 KB for data. Many desktop chips keep Level 1 latency near 1 ns and boost at roughly 1.1 V.",
    "The A1 links London with Edinburgh, while the M1 connects London to Leeds. Drivers often pass Junction 1, clear Junction 11 by Luton, then reach Junction 41 near Wakefield on a 1st northbound run.",
    "The 2015 Paris Agreement urges efforts to limit warming to 1.5 C. Many pathways cite 10 to 15 years as decisive and prioritize 100% clean power in Tier 1 grids first.",
    "Released in 1997, Titanic won 11 Oscars from 14 nominations and became the 1st film to gross 1 billion dollars. Its theatrical cut runs 194 minutes, long but steady for a sea epic.",
    "Heracles faced 12 labors; the 11th sent him for the golden apples. Pliny the Elder wrote in the 1st century, and Book 11 of his Natural History catalogs animals with disciplined clarity.",
    "1 WTC's spire reaches 1,776 feet; the site spans about 16 acres. The memorial marks September 11, and the tower's observatory sits around Level 100 after opening to visitors in 2014.",
    "Many offices run 1 Gbps Ethernet, while backbone links jump to 10 or 100 Gbps. Admins segment with VLAN 10 and VLAN 11, and Layer 1 faults still explain a stubborn share of outages.",
    "The S&P 500 tracks 11 sectors. Analysts watch 10-year Treasury yields and Tier 1 bank capital, while 2011 headlines reminded markets how a 1% shift can move indices by billions.",
    "In many systems K-12 ends with 12th grade; juniors are 11th. Orientation often starts on the 1st Monday at 10 am, and counselors suggest 16 to 18 credits per semester.",
    "Tabletop campaigns pace growth so a 1st-level party feels fragile, then stabilizes by level 11. Many modules recommend 16 encounters across 10 sessions, with milestone rewards every 1 to 2 chapters.",
    "Runway 11 points near 110 degrees by ICAO convention. Many airports publish 10 to 15 knot crosswind limits, and crews brief a 1st go-around if tailwinds exceed 11 knots on final.",
    "Most novels begin at Chapter 1; trade paperbacks often use 11 pt type with 16 to 18 pt leading. A typical 100,000-word draft fills about 310 pages at roughly 10 words per line.",
    "In 2019 the Hot 100 record for longest No. 1 run hit 19 weeks with Old Town Road. Chart history tracks 11-week streaks as rare, and many artists celebrate a 1st No. 1 after years.",
    "London sits near 51 N, while the 41st parallel crosses the U.S. from California to New Jersey. Drivers on the 101 trace coastline stretches, and many hikes end at 11 miles round-trip.",
    "Search engines parse H1 tags to infer themes. Many CMS defaults title-case for an H1, set slugs with 101-style guides, and recommend keeping introductions under 110 words for a 1-minute skim.",
    "In the United States the 19th Amendment was ratified in 1920 after Congress passed it in 1919. Its Section 1 guarantees voting rights regardless of sex, a 1st-order shift in civic life.",
    "In 2019 Apple introduced iPhone 11 alongside iOS 13. Battery tests showed about 11 hours of video, and many buyers chose 128 GB storage as a 1st step before cloud syncing.",
    "Editors style H1 at 16 pt and body at 11 pt. A 101 course posts 10 tasks and sets a 1st peer review for 11 am in week 1.",
    "A 1% fee falling to 0.1% matters. At 11% annual growth money doubles in about 7 years, while at 1% it needs roughly 70 years to reach 100%.",
    "The No 11 winger scored in the 11th minute. A 1-1 match flipped to 2-1 at 91 when the No 10 slid a 19 yard pass behind a tiring line.",
    "Pilots brief Runway 11 on a 110 degree heading; climb toward FL410, cross 11,000 feet at 250 knots, then hold 1,100 fpm to 18,000 while setting standard pressure at 29.92.",
    "TLS 1.3 removed one handshake round trip. Most sites kept AES 128 and retired SHA 1 by 2017, then trimmed waits under 100 ms as older 1.1 era patterns quietly faded.",
    "The 41st parallel crosses Chicago and Denver. Signs mark 41.9 N and 104 W, US 101 meets State Route 1 on the coast, and I 110 threads through central Los Angeles.",
    "World War I ran from 1914 to 1918. The 1919 settlement redrew lines, and 11 November became Armistice Day as losses surpassed 10 million across continents.",
    "Since 1958 the Hot 100 has ranked singles. After 1991 tracking and 2011 streaming shifts, No 1 runs stretched to 19 weeks while 11 week streaks still mark standout eras.",
    "The M1 opened in 1959 to connect London and Yorkshire. Drivers pass Junction 1, clear Junction 11 by Luton, and reach Junction 19 where freight heads toward the Midlands.",
    "Division I basketball lists 351 programs. Every March four 1 seeds anchor regions while 11 seeds often spring 1st round shocks and 10 or 11 wins fuel Cinderella runs to the 1st weekend.",
    "Voyager 1 launched in 1977 and reached interstellar space in 2012 near 121 AU. Signals crawl home at tiny bitrates as one-way light time exceeds 20 hours in many 2020s checks.",
    "One is not prime; 11 13 17 and 19 form a classic run. Matrices put 1s on the identity diagonal and exponents turn 10 into 100 or 1000 cleanly.",
    "Orwells 1984 introduced Room 101 and a bleak Ministry of Love. First printings in 1949 led to 1st year debates, and readers still cite Chapter 1 for chilling foreshadowing.",
    "Insulin was isolated in 1921 and first used in 1922. Type 1 diabetes care changed within 1 year, and the 100th anniversary in 2021 prompted global museum exhibits.",
    "Apple released iPhone 11 in 2019. Reviews praised 11 hour video stamina, A13 performance gains, and 128 GB options while iOS 13 refined dark mode in successive 2019 updates.",
    "New Yorks 1 train runs from South Ferry to 242 Street. Stations at 110 Street 116 Street and 125 Street punctuate Manhattan as late nights stretch to 1 am frequencies near 12 minutes.",
    "Tabletop history cites the 1974 1st edition of Dungeons and Dragons. Many campaigns start characters at level 1, celebrate a 10th session milestone, and aim for level 11 by year one.",
    "Landscape shooters may try ISO 100, a 10 second exposure, and a 1 second test. Fast primes at 1.4 gather light efficiently while sunrise colors peak in the first 10 minutes.",
    "The 2018 special report framed a 1.5 C goal. By 2021 leaders pledged 2030 targets; planners model 10 year retrofits and 100 percent clean power on the 1st credible pathway.",
    "In 1971 the dollar left gold convertibility on 15 August. Bond traders watch 10 year yields near 1.1 percent, and 1979 memories of inflation above 11 percent still color caution."],
  "2": ["Many codecs from the 2000s target 128 kbps and 102 dB SNR; an editor's 2nd pass trims 2.0 dB, exports 24 fps in 2024, and stores 2,500 previews plus 25,000 thumbnails.",
    "Hong Kong sits near 22 N with humid summers and 12 to 20 storm days each season. In the 21st century its skyline topped 200 m dozens of times; a 2nd harbor crossing sped commutes.",
    "Premier squads often start a No. 2 at right back while a No. 22 waits as cover. A 2nd-half surge swings a 2-0 into 2-2 as xG climbs above 2.0.",
    "Intel's 12th Gen chips improved single-thread scores by around 20% over 11th Gen in 2021. Many x86 boards switched to PCIe 4.0 while buyers chose 128 GB SSDs as a 2nd drive.",
    "Steam historians still note the 2-2-2 wheel arrangement on early expresses. A 2nd tender carried water, runs stretched 120 miles between fills, and crews logged 20 to 22 scheduled stops on busy corridors.",
    "Many models assess 2.0 C pathways that keep 21st-century warming below 2.5 C. Analysts track 2022 and 2023 as notably warm years and urge 20% cuts this decade as a 2nd-best fallback.",
    "Runway 22R points near 220 degrees at Newark. A 2nd approach intercepts the localizer around 2,000 ft, jets cross the threshold near 122 knots, then climb on heading 220 within 2 miles.",
    "Global markets saw the S&P 500 drop about 20% in 2022. Many earnings calls flagged 2nd-half softness, cited 2.5% to 2.9% inflation prints, and trimmed capex by roughly 12% in 2023.",
    "USB 2.0 raised throughput to 480 Mbps in the 2000s. Many makers kept a 2nd port for charging at 2 A, bundled 2-meter cables, and labeled hubs with 12 or 24 W ratings.",
    "Casablanca's metro area tops 4.2 million in the 21st century. Builders extended Line 2 by 22 km and added 20 new stations; a 2nd phase targeted 200,000 daily riders by 2024.",
    "Marathon distance is 42.2 km. Many runners chase a 2nd race in 2022, target 5:20 per km and take 12 gels across 3 aid zones, finishing around 3:42 with a steady 20 km split.",
    "Open-world hits in 2022 like Elden Ring drew 20 million players. Speedrunners route 2 bosses early, grab a 2nd talisman slot by level 12, and chase sub 2:20 times in categories.",
    "Brazil declared independence in 1822 and consolidated power in the 1820s. The 2nd emperor, Pedro II, was born in 1825 and crowned at 14 after a 12-year regency.",
    "HTTP 2 with TLS 1.2 cut latency for many sites in the 2010s. A 2nd round-trip often disappears as servers push assets, while 128-bit ciphers still protect sessions in under 200 ms.",
    "A classic novel's Part 2 spans 12 chapters. Students cite a 2nd edition from 1922, annotate 20 key passages, and condense arguments into 200 words to stay under a 2-minute presentation.",
    "A gravel bike with 2 chainrings and a 12-speed cassette climbs 12% grades steadily. Riders spin 92 rpm, hold 22 kmh on flats, and shift to a 2nd ring for 20 km descents.",
    "Group 2 metals sit in the alkaline earth column. Many 12th-grade labs compare 2nd ionization energies, heat salts to 220 C and watch magnesium ignite within 2 minutes after recording 200 kJ per mol differences.",
    "PlayStation 2 launched in 2000 and dominated the 2000s. Many players bought a 2nd controller, saved to 8 MB cards, and replayed 12-hour campaigns well into 2012 as studios extended support.",
    "Many cameras stabilize across 2 axes while software warps 2D frames. Editors apply a 2x2 transform, cut 22.5 degree pans to 12, and export a 2nd take at 200 Mbps for review.",
    "Ratified in the 1950s, the 22nd Amendment set a 2-term limit for U.S. presidents. Scholars often compare 2-term averages across 12 administrations and chart approval swings of 20 to 22 points.",
    "HTTP 2 and TLS 1.2 cut latency in the 2010s. Many sites moved to 2.0 style APIs with 128 bit ciphers while traffic rose past 200,000 daily sessions by 2021.",
    "A steady 2-0 in minute 72 flipped when the No 22 sub pressed high. The 12th corner found a finisher who scored twice in 2 minutes to clinch a 2-1.",
    "Runway 22 Right points near 220 degrees. A 2nd approach intercepts the localizer around 2,000 ft, jets cross the threshold near 122 knots, then climb on heading 220 within 2 miles.",
    "By the Rule of 72 money doubling at 12 percent takes about 6 years, while 2 percent drifts toward 36. Cutting fees from 2.0 to 0.2 can save over 200,000 across decades.",
    "USB 2.0 raised throughput to 480 Mbps in the 2000s. Many hubs deliver 2 A charging, bundle 2 meter cables, and advertise 12 or 24 W ratings that cover phones from 2013 to 2023.",
    "Brazil consolidated independence in the 1820s under a 2nd emperor, Pedro II, born in 1825. Rail and telegraph expanded by 1872 and 1882 as reforms spread across provinces.",
    "Modern Olympic cycles stabilized in the 1920s. Antwerp 1920, Paris 1924, and Amsterdam 1928 marked a 2nd modern decade as international entries climbed and radio carried 1928 results worldwide.",
    "A metro Line 2 carries about 200,000 riders on weekdays. Upgrades add 22 new stations in a 2nd phase, extend 24 km of track, and target 2 minute headways by 2025 in core corridors.",
    "Most databases used 2 phase commit widely in the 2010s. Architects warned that a 2nd coordinator adds 200 ms tails, so many shifted to 3 replicas with 2 of 3 quorums by 2021.",
    "AP Physics 2 covers fluids, thermodynamics, and optics. Exams in 2015 and 2019 used a 2 hour multiple choice and a 90 minute free response with 2 long problems and 2 short.",
    "A Boeing 777 often taxis to Runway 22 Left at JFK. Controllers meter 2 minute separations, departures roll at 120 to 160 knots, and arrivals cross 2,500 ft before turning to 220 for downwind.",
    "In the War of 1812 the young republic faced Britain. The Missouri Compromise in 1820 and 1821 shaped admission rules while a 2nd party system emerged in the 1820s.",
    "Scientists often cite 2 sigma evidence around 95 percent as suggestive. Strong claims demand 5 sigma, and a 2nd dataset in 2018 or 2019 helps rule out 20 percent selection bias.",
    "Most desktops shifted from 32 bit to 64 bit in the 2000s. A 2nd CPU core arrived early, 128 MB cards gave way to 2 GB, and USB 2.0 replaced 1.1 by 2002.",
    "Twenty Thousand Leagues Under the Sea reached English readers in 1872. Fans still debate Chapter 12, compare 2 translations, and note that leagues mark distance traveled under seas rather than depth.",
    "Falcon 9 uses 2 stages and lands routinely. Starlink missions in 2023 and 2024 often carried 22 satellites per flight as reuse climbed past 20 launches on a single booster.",
    "Western music counts 12 semitones per octave and 24 major and minor keys. Ear training drills 2nd intervals, then 5th and 7th, while metronomes tick at 120 for 2 minute scales.",
    "Many mRNA vaccines in 2020 and 2021 used a 2 dose primary series. By 2022 booster guidance varied by 12 weeks or 20 weeks as regulators tracked 2 dose effectiveness.",
    "Ratified in 1967 the 25th Amendment clarified succession. Section 2 sets vice presidential appointments and confirmations, a process used in 1973 and 1974 during resignations and transitions.",
    "ETOPS rules let 2 engine airliners fly long ocean routes. Early 120 minute limits grew to 180 and 240 in the 2000s, and 2010s approvals saw crews plan 2 hour diversions confidently."],
  "3": ["Web standards from W3C govern how MP3 and 3D players embed on pages; designers pan 360 scenes and target 3.0 s loads while keeping 133 ms input lag and budgeting 300 ms animations on 130 Hz panels.",
    "Earth turns through 360 degrees as calendars track 365 days; many planners mark a 3rd-quarter review on day 273 then set 3.5 hour blocks and schedule 13,000 step goals across 30 days.",
    "In the NBA the arc is 23 ft 9 in at the top. Teams often surge in the 3rd, with a guard logging 33 minutes, taking 13 threes, and hovering near 83 percent on 3.3 attempts per quarter.",
    "Headsets still ship a 3.5 mm plug as consoles add 3D audio. Competitive screens hit 360 Hz, laptops calibrate to 300 nits, and engines can push 103 fps with frame caps at 130 or 133.",
    "Travelers note the 23rd parallel near the Tropic of Cancer and the 33rd across the U.S. Desert trails list 300 km stretches and climbs to 3,500 m then camp near 13,000 ft on 350 km loops.",
    "A metro Line 3 carries about 300,000 riders each weekday. Plans add 32 km in a 3rd phase as bike counts hit 3,000 daily and station upgrades target 230 new gates.",
    "In Britain the 1832 Reform Act preceded the 1833 Factory Act. Debates in the 1830s set 12-hour caps for 13 to 18 year olds, and a 3rd wave of inspectors documented 300 mills.",
    "Arsenic is element 33 and bismuth is 83. Group 13 holds boron's family, the 3rd period spans 3p orbitals, and many tables mark period 3 across 18 columns and 360 style charts.",
    "MP3 took off in 1993 as portable players normalized 3 minute 30 second singles. Many albums front-load a strong 3rd track and keep peak headroom near -3 dB while exporting 320 kbps in 2013 apps.",
    "Pilots brief turns through 360 degrees and track 330 degree bearings on departure. A 3rd fix at 13 DME confirms position, then descent planning divides groundspeed by 3 to start a 3,000 ft per 10 nm path.",
    "The Russell 3000 tracks about 3,000 U.S. stocks while the S&P 500 notes 3 size tiers. Analysts slice data into 3rd quartiles and watch 13F filings as they chart 30 year trends.",
    "An endurance cyclist runs 30 mm tires at 3.0 bar and holds 230 W on a rolling 300 km brevet. By the 3rd control he has 3 gels left after covering 33 km per hour downhill.",
    "Desktop towers still fit 3.5 inch drives while USB 3.0 saturates at over 300 MBps. Many boards expose 32 lanes, memory runs 3200 MTps, and a 3rd M.2 slot shares bandwidth at 133 like legacy days.",
    "Denver's original 303 area code still appears on storefronts. Trail posters show a 13 mile loop at 3,300 ft gain, a 3rd overlook at mile 3.3, and a 30 minute shuttle back downtown.",
    "Messier 31 and Messier 33 dominate autumn skies with Andromeda at about 2.5 to 3.1 million light-years. A 3rd favorite is M13 in Hercules, where 300,000 stars crowd a core only 130 light-years wide.",
    "Dante began around 1308 and shaped 3 parts with 33 cantos each plus 1 introductory canto to make 100. Many readers revisit Inferno 3 after the 3rd canto to study the rule of 3.",
    "W3C advanced CSS3 alongside HTML5 and cut the old 300 ms tap delay on phones. Many teams ship 3rd edition style guides, test 360 states for focus rings, and log 13 accessibility issues per sprint.",
    "A classic trilogy structures 3 acts across 3 films; The Return of the King swept awards with 11 Oscars in 2003. Extended editions push 263 minutes, and many fans debate the 3rd act across 13 hours.",
    "New York's 3 train serves 34th Street-Penn Station and 135th Street on the Broadway-Seventh Avenue Line. Riders plan 30 minute off-peak headways, check a 3rd countdown clock, and budget a brisk 13 minute transfer.",
    "An Olympic triathlon has 3 legs with a 1.5 km swim, a 40 km bike, and a 10 km run. Age-groupers chase 33 kmh on flats, aim for a 3rd podium, and finish around 2:03 to 2:13.",
    "Developers follow W3C guidance as MP3 and 3D assets preload in 3.0 s. UX targets 360 degree spins, 133 ms taps, and a 3rd layout shift under 300 ms on 13th build.",
    "Calendars track 365 days as navigators sweep 360 degrees. At the 30th parallel a 3rd waypoint sits 33 miles from a 300 m ridge and 3,000 feet above a 23rd meridian crosswind.",
    "In the NBA the 3 point arc sits beyond 23 feet 9 inches. Hot guards explode in the 3rd, dropping 33 points with 13 threes as pace hits 103 possessions.",
    "Semver 3.1 releases cleaned APIs before a 3.5 patch stabilized latency. Mobile nav draws 360 degree maps, first contentful paint near 1.3 s, and a 300 ms tap budget per W3C note.",
    "Hikers on the 33rd parallel cross 300 km deserts to 3,500 m passes. A 3rd camp at 13,000 ft overlooks 350 switchbacks and a 30 km ridge with 360 degree views.",
    "MP3 hit mainstream in 1993 as players shrank below 300 g. By 2003 a 3rd wave of stores sold 3 million tracks weekly and commuters logged 30 minute playlists on 3,000 model buses.",
    "W3C refined CSS3 specs in a 3rd snapshot around 2013. Mobile browsers cut the 300 ms tap delay, shipped 3D transforms, and raised 360 checklist scores on 33 accessibility tests.",
    "Analysts slice data into 3rd quartiles and watch 30 year yields. A 3.0 percent shock ripples through 300,000 mortgages as 13 percent refinancing drops 33 basis points during 3 weeks.",
    "Console ports target 30 fps at 33.3 ms frames while 3D engines chase 360 camera sweeps. A 3rd patch trims 300 MB stutters and raises minimums to 38 fps on 3,000 test runs.",
    "A 3 by 3 magic square sums rows to 15 while center is 5. Speed solvers memorize 33 patterns, mark 13 pivots, and finish a 3rd sheet in 31 seconds during 93 trials.",
    "Flight history notes 1903 at Kitty Hawk. Today a 3rd runway pushes 300,000 movements yearly as towers meter 3 mile spacing and 3 minute separations with 330 degree headings in 30 knot crosswinds.",
    "Geometry drills 30 60 90 triangles and 3 4 5 triples. Survey maps show 33 percent slopes, a 3rd contour at 300 m, and bearings rotating 360 degrees in 3 degree steps.",
    "Many desktops kept PCIe 3.0 while GPUs hit 3.3 TFLOPS in 2013. Builders fitted 32 GB kits at 1333 MTs and a 3rd M.2 slot shared lanes across 3 x4 links.",
    "Dantes poem spans 3 realms in 3 canticles. Each holds 33 cantos plus an opening, and Canto 3 warns readers as translators debate 13 tercets per scene with a 3rd rhyme chain.",
    "Interstate 35 meets I 335 near Topeka and US 36 spans Kansas. A 3rd lane eases 30 mile backups as crews pave 300 joints and set 33 signs over 3 nights.",
    "The Russell 3000 tracks about 3,000 stocks and covers 93 percent of US equity value. Analysts study 3rd quartiles; they flag 33 percent weights and compare 3 year returns to 30 year medians.",
    "Observers spot M33 near Andromeda on autumn nights. Charts list 33 arcminutes across its core, a 3rd spiral arm in photos, and 3 million suns worth of clusters within 3 kiloparsecs.",
    "In grade 3 many schools schedule 30 minute reading blocks. A 3rd teacher assigns 13 pages nightly and posts 3 practice quizzes as families log 300 minutes across 3 weeks.",
    "Strength plans ask for 3 sets of 13 reps with 30 second rests. Coaches suggest 3.5 liters on hot days, a 3rd mobility block, and 300 calories of carbs within 30 minutes.",
    "A river city counted 330,000 residents after new surveys. Transit added a 3rd line and bought 30 trains then mapped 33 stations with 300 bike docks across 3 zones by 2030."],
  "4": ["Most home routers still speak IPv4 while streamers output 4K at 60 Hz. Creators cut 4.0 minute clips, export at 144 Mbps, and keep peak loudness near -14 LUFS for 4.5 dB headroom.",
    "San Francisco's 49ers lifted a 40,000 crowd with a 4th quarter rally. A 44 yard burst set up a 24 yard strike and win probability jumped from 41 to 74 percent in seconds.",
    "Maps mark the 42nd parallel across the US while the 49th draws the border. Hikers note 44 degrees in Wyoming, 41 near Chicago, and 47 in Cascades forecasts that predict 40 percent afternoon storms.",
    "Many laptops pair 64 bit kernels with 4 cores and 8 threads while games target 144 Hz. Benchmarks track 4.0 ms frame budgets, 240 fps peaks, and file systems with 4K blocks on 400 GB drives.",
    "Fahrenheit 451 resonated after 1954 reprints and remains assigned widely. Study guides flag page 451 for key scenes, cite a 14th annotation, and compare dystopias to 1984 in 4th week seminars.",
    "Many long routes once relied on the Boeing 747. Pilots monitor the 4th engine on takeoff, plan 4,000 nautical mile legs and load around 400,000 pounds; finals brief near 144 knots with 40 percent margins.",
    "Europe saw upheavals in 1848 and repercussions into 1849. Texts assign 14th week readings on causes, note 24th chapter debates on labor, and chart 40 percent harvest shocks across 34 provinces.",
    "Silicon is element 14 while flerovium is 114. Labs calibrate 146 mm wafers, monitor 141 defect markers, and teach plasma as the 4th state of matter in 4.0 hour sessions.",
    "Software investors quote the Rule of 40 where growth plus margin tops 40 percent. A 4.5 percent uptick over 24 months shifts a firm from 4th quartile to 1.4 times revenue efficiency.",
    "Colorado climbers chase the 14ers with 54 summits over 14,000 feet. Many schedule a 4th attempt on a 14,400 foot route, pack for 24 miles, and watch 40 percent storm risks after noon.",
    "IPv4 addresses use 4 octets and remain common in 2024 deployments. Admins carve 24 address blocks for labs, set 1440 minute rotation windows, and keep 4.0 hour rollout stages for safer changes.",
    "A classic TV hour runs about 44 minutes and early cable favored 24 episode seasons. By 2014 many shows streamed in 4K and a 4th season arc kept ratings above 4.5 on fan sites.",
    "A fast growing city crossed 400,000 residents and expanded a 240 km ring road. Planners mapped 14 districts, ranked it 4th nationally by 2024, and budgeted 140 new buses for 44 routes.",
    "World War I began in 1914 and reshaped diplomacy. Wilsons 14th point joined 14 points in 1944 planning, while 40 percent output shifts and 24 hour production schedules defined the wartime home front.",
    "Mens tennis tracks 4 Grand Slams each year and celebrates a 24th major milestone. A 4th seed often holds 64 percent first serves, wins 40 percent of return points, and uncorks 144 mph serves on big points.",
    "Many pathways model 1.4 C to 2.0 C windows while RCP 4.5 once framed policy. Grids add 4,000 MW each year, target 40 percent renewables by 2024, and cut demand 14 percent through 4th quarter retrofits.",
    "Mathematicians note 144 as 12 squared and a Fibonacci term near 34. A regular decagon has 144 degree angles, 64 appears in powers, and students graph a 4th power curve for 4.0 credits.",
    "Many films stream in 4K at 240 Hz on 144 inch projectors. Reviewers tag 4.5 star scores, note 1.4 gamma tweaks, and list a 4th editors cut when the 40th anniversary prompts new transfers.",
    "Ontario's Highway 401 links Windsor to Quebec and overlaps the 400 series. Commuters jump to 407 toll lanes, cruise at 104 kmh in light traffic, and exit at the 4th interchange near 404 ramps.",
    "Coaches still favor a 4 4 2 formation with two banks of 4 in defense. A 4th official manages boards, stoppage hits 4 minutes, and expected goals hover near 1.4 in balanced 94 minute derbies.",
    "Most routers still route IPv4 while consoles stream 4K at 60. Esports aim for 144 Hz and 240 fps as patch 4.0 cuts input to 14 ms during 64 bit sessions.",
    "The 49ers surged in a 4th quarter comeback as a 44 yard break set up 24-14. Win probability jumped to 74 percent after a 4th and 4 conversion.",
    "Maps mark the 49th parallel as a border while the 44th crosses Oregon. Forecasts call for 40 percent rain at 14 C and trails climb 4 km to 2400 m overlooks.",
    "Many desktops run 64 bit kernels with 4 cores and 16 threads. NVMe sustains 4.0 GBs as 1440p games drive 240 Hz and IPv4 remains common since 2004.",
    "Fahrenheit 451 still anchors syllabi alongside 1984. Classes assign page 451 in the 4th week and add a 14th note while comparing 40 percent screen time claims.",
    "On a 747 heavy crews brief a 4th engine out at V1. Typical loads approach 400,000 pounds and finals sit near 144 knots with 40 percent margins in calm wind.",
    "Barack Obama served as the 44th president. Civics links the 14th and 24th Amendments and surveys note 40 year realignments as turnout climbed past 64 percent in several states.",
    "Physics texts list 4 fundamental forces and date finds with 14 C. In the 4th lab students still laugh at 404 errors and calibrate pH 4.0 buffers.",
    "Vineyards near the 40th parallel compare 14 percent ABV reds. Along the 41 and 42 lines, forecasts post 40 mph gusts as crews begin a 4th shift before 4 am.",
    "APIs return 200 for success and 404 for missing pages while 4xx covers client faults. Stacks still parse IPv4 and log 400, 204, and 304 with 64 bit counters.",
    "Streaming moved to 4K masters at 24 fps. A classic TV hour often runs about 44 minutes and 4.5 star scores surge on a 40th anniversary cut with restored 1440 transfers.",
    "Mathematicians cite 144 as a Fibonacci term. A decagon holds 144 degree angles while 64 appears in powers and students sketch a 4th power curve from 14 to 24.",
    "Ontarios Highway 404 branches from the 401 and meets the 407. Drivers cruise at 104 kmh and a 4th lane eases 40 km bottlenecks near the 400 series ramps.",
    "4X strategy games map 64 tile grids and push 144 turn marathons. Ranked 4v4 ladders reward a 4th expansion at 14 minutes with 40 percent control.",
    "Jupiter shows 4 Galilean moons and Mars is the 4th planet. A 14 inch scope gathers more light and many charts label 24 and 40 degree altitudes for easy reads; observers also chart 4 Vesta on finder maps.",
    "Operators cite the Rule of 40 where growth plus margin tops 40. A 4.0 multiple follows at 14 percent with 26 percent growth and shifts firms from 4th quartile to median in 24 months.",
    "Admins roll RSA 4096 keys and enforce 2FA with 4 digit backups. Logs flag 404 and 401 while IPv4 hosts record 400 and 304 along with 64 bit counters during 4 hour windows.",
    "Many commuters drive inline 4 engines that sip about 4.0 liters per 100 km. A 14 gallon tank yields roughly 400 miles and 4x4 helps on wet 40 degree ramps.",
    "Business magazines publish 40 Under 40 each year. Programs expect a 4.0 GPA, 120 to 140 credits, a 4th year internship of 24 weeks, and roughly 1400 on the SAT.",
    "The 4th Infantry Division landed on Utah Beach in 1944. Maps from 1945 trace 44th and 84th advances as logistics pushed 400 trucks daily across 40 km corridors."],
  "5": ["Modern AES uses 256 bit keys on cloud servers; uptime targets reach 99.5%, and a 5th region onboards 500,000 users as teams rotate logs every 15 minutes across 5 zones.",
    "The National Maximum Speed Law set 55 mph in 1974 and many states raised limits after 1995; commuters still cruise in 5th gear at 65 and time 5 minute gaps on 25 mile stretches.",
    "Baseball once used 25 man rosters and starters often threw 95 mph; a 5th inning rally can flip a 5-4 into 5-5 before a closer logs his 15th save.",
    "The 5th generation of mobile networks, branded 5G, often posts 500 Mbps on midband; typical trials use 2.5 and 3.5 GHz channels and aim for about 15 ms end to end latency.",
    "Investors watch the S and P 500 and target 15% savings rates; a 50 50 split once guided the 5th edition of many handbooks and fee cuts from 0.5% to 0.05% compound quietly.",
    "Interstate 95 links Miami to Maine while I 195 and I 295 form bypasses; drivers track 55 mph near cities, plan 15 minute stops, and prefer a 5th rest after 250 miles.",
    "The pentatonic scale uses 5 notes per octave; guitarists bend the 5th, rehearse at 95 or 115 bpm, and a 50 watt combo can carry 150 seat rooms.",
    "Runway 15 points near 150 degrees and paired 33 faces the opposite; a 757 approaches at 135 knots, many fields label 25R and 25L, and a 5th taxiway boosts 50 movements per hour.",
    "Fahrenheit 451 first appeared in 1953; teachers often assign 15 prompts on page 451 as 5th week work for classes of 25 to 35 students.",
    "PlayStation 5 loads levels with up to 5.5 GB per second; 5.1 mixes and 4K60 patches became routine in 2020 as the 5th wave of exclusives pushed lifetime sales past 50 million. Many releases land as 55 GB installs.",
    "Climate reports highlight the 95th percentile for heat waves; cities plan 50% canopy boosts, aim for 1.5 C pathways by 2025, and test 5 minute forecasts to protect 5th grade sports days.",
    "A growing metro passed 500,000 residents and added 15,000 jobs; planners mapped 25 neighborhoods and built a 5th ring road around 50 km while unemployment held near 5% during a steady 2.5% expansion.",
    "A 5k at 25 minutes means 5 minute splits; many plans add 15 hill repeats, pace long runs at 5.5 minutes per km, and schedule a 5th week recovery with 350 easy minutes.",
    "In 1815 Waterloo ended the Napoleonic Wars while 1805 Austerlitz had showcased strategy; historians teach 5 key factors, assign 15 page briefs, and grade with a 5th rubric on 50 maps.",
    "The 25th Academy Awards in 1953 were the first televised; by 1955 Marty won Best Picture as producers highlighted 5 major categories, tested a 5th hosting format, and stretched broadcasts past 150 minutes.",
    "Many laptops ship a 512 GB SSD in a 2.5 inch bay while desktops reuse 3.5 inch drives; backup plans keep a 5th copy offsite and verify 256 bit keys every 15 days.",
    "Health guidelines promote 5 a day portions and 150 minutes of activity weekly; many plans aim for 25 g fiber, 500 mg EPA DHA, and a 5th checkpoint at week 5 to review habits.",
    "Esports staples field 5v5 rosters; best of 5 series reward depth as teams ban 5 maps and call 25 second pauses, play 15 round halves, and use a 5th timeout if scores hit 15 15.",
    "Japan's 500 Series Shinkansen drew acclaim on the 515 km Tokyo Osaka corridor; operators run 15 car formations, schedule 5 minute dwells, and E5 sets cruise north on 50 Hz power.",
    "AP exams score from 1 to 5; many sections run 55 minutes with 45 multiple choice items, free responses weigh 50%, and students celebrate a 5th straight year of 5s in a club of 25 peers.",
    "5G midband around 2.5 and 3.5 GHz often delivers 500 Mbps with 15 ms pings. Carriers stage a 5th rollout phase and map 50,000 sites by 2025.",
    "A No 5 midfielder struck in the 55th minute as xG rose to 1.5. The 65th saw a 25 yard volley and a 95th save sealed a 2-1.",
    "Pilots brief Runway 15 with a 150 degree heading and Vref near 135 knots. Many fields enforce 250 knots below 5,000 feet and schedule a 5th departure bank at 15 past.",
    "PCIe 5.0 doubles bandwidth over 4.0 as x86 boards add 256 bit paths. A PS5 streams 5.5 GBs, NVMe pushes 5,000 MBs, and fast travel often lands in 15 seconds.",
    "A fast growing city crossed 500,000 residents and planted 15,000 trees. Transit added 25 routes, a 50 km ring road, and a 5th hub while air pollution fell 15 percent.",
    "Interstate 95 runs northeast while I 195 and I 495 loop around cities. Weekend travelers pace 55 mph through 15 mile work zones and plan a 5th rest stop after 250 miles.",
    "Studios mix in 5.1 and 7.1 but classic vinyl still spins at 45 rpm. A 1959 session cut 5 takes in 15 hours and the 25th reissue pushed 55 minutes onto a single disc.",
    "Meteorologists mark Category 5 at sustained 157 mph. Evacuation plans target 50 miles inland, 500 shelters, and 15,000 cots as a 5th update arrives at 5 pm.",
    "By the Rule of 72, 15 percent doubles in about 5 years; at 5 percent it takes about 15. Cutting fees from 1.5 percent to 0.5 can save 50,000 over 25 years in a 5th year review.",
    "Falcon 9 Block 5 boosters land routinely. A 15th reuse flew 53 satellites and 50,000 kg, while pads hit 5 day turns and reliability held near 99.5 percent in 2022.",
    "Esports staples field 5v5 rosters in best of 5 sets. Halves run 15 rounds, teams bank 25 second timeouts, and a 5th map often swings a 16 14 thriller.",
    "Bread formulas aim for 65 percent hydration with 250 g flour and 500 g dough. Mix 15 minutes, rest 25, then bake at 450 F for a crisp 15 minute finish as a 5th tray rotates in.",
    "I 55 meets I 57 near Effingham and loops with I 255 around St Louis. Drivers hold 65 mph, exit every 15 miles, and schedule a 5th coffee stop at 5 past.",
    "After 1815 Europe redrew borders, and by 1855 Crimea dominated headlines. Historians weigh 5 causes, cite 15 sources, and assign a 25 page brief due in the 5th week.",
    "A 5k in 25 minutes equals 5 minute splits. Runners stack 15 x 200 sessions, hold 155 bpm, and plan a 5th week cutback with 1.5 hour long runs at 65 percent.",
    "An F5 tornado can exceed 300 mph. Warning drills trigger 15 minute alerts, cities stock 5,000 gallons, and schools run a 5th practice each spring as 55 sirens wail.",
    "Wi Fi 5 on 5 GHz popularized 80 MHz channels. Many routers advertise 3.5 Gbps peaks, 1.5 Gbps real throughput, and a 5th antenna for 4x4 plus 1 backhaul on mesh kits.",
    "Boeing 757 service often lists 200 to 235 seats. Crews plan 15 minute turns, brief a 5th checklist, and approach near 135 knots crossing the 50 foot threshold.",
    "A 5 by 5 matrix has 25 entries and a 5th row holds 5 elements. Crosswords at 15 by 15 use 225 squares and 50 percent downsampling preserves 95 percent readability.",
    "Index funds tracking the S and P 500 grew after 1975. Investors target 5 percent withdrawals, hold 50 to 75 percent equities, and rebalance on a 5th Friday rule after 15 months."],
  "6": ["Most home networks now support IPv6 while desktops still run x86. AES uses 256 bits and a chessboard has 64 squares and compasses turn 360 degrees while many laptops idle near 1.6 GHz.",
    "At about 66.5 N the Arctic Circle begins and many towns see roughly 6 months of light and 6 months of dark. From that line the pole lies about 2600 km away, and midsummer arrives in the 6th month.",
    "Twenty20 cricket sets 6 legal balls per over, and a clean boundary earns 6 runs. Many openers accelerate by the 6th over to chase 160 with scoreboards flashing 66 and strike rates near 136.",
    "Many performance sedans use a V6 and hit 0-60 in about 6.0 seconds. Test drives report 650 km ranges on steady routes and manuals still praise a tall 6th gear that keeps revs near 1,600 rpm.",
    "U.S. Route 66 was designated in 1926 and later decommissioned in 1985. Tourists still drive 650-mile stretches in V6 coupes, stop at 6th-street diners, and collect maps marking 66 classic roadside stops.",
    "In 1768 James Cook sailed in HMS Endeavour to observe the 1769 transit of Venus. Navigators drew on 16th-century charts, noted lines near 176 E and 36 S, and measured angles with a sextant's 60 degree arc.",
    "Modern Olympics began in 1896 in Athens; the marathon settled at 26.2 miles. The 16th Games were held in Melbourne, and by 2016 Rio showcased 360-degree replays in prime-time coverage.",
    "The 6th magnitude marks the faint limit for many dark-sky observers, often around 6.5. Star charts use 360 degrees, binoculars advertise 16x ratings, and common eyepieces come in 26 mm and 36 mm focal lengths.",
    "A chessboard has 64 squares and each side begins with 16 pieces. Many pawn storms aim for the 6th rank, top engines analyze 26 plies, and Chess960 scrambles starts while 6-man endgames remain perfectly tabled.",
    "Mid-sized NFL venues often list between 60,000 and 66,000 seats. On wildcard weekend the 6th seed sometimes travels 650 miles on short rest and still wins 26-16 behind a bruising 6.5 yards per carry.",
    "Many gaming rigs use x86 chips like the Ryzen 5 5600X with 6 cores and a 65 W TDP. Paired with a PCIe x16 slot and 256 GB SSDs, such builds push 360 fps in lighter esports titles.",
    "In 1945-46 the 16th parallel north served as a temporary line in Vietnam. Coastal storms can reach 36 knots and drop 160 mm in 6 hours, while crews still time returns by the 6th bell.",
    "Formula 1 runs 1.6 L turbo-hybrid V6 engines. At Barcelona the race covers 66 laps, cars can top 360 kmh on Monza's straights, and teams juggle 26 tire sets across a 3-day weekend under strict 60 kmh pit limits.",
    "Web designers use base-16 hex color codes with 6 digits, where 66CC66 mixes green intensities. Images often compress to 256-color palettes for icons, while 360-degree viewers render scenes smoothly at 60 fps on x86 laptops.",
    "The Pacific Crest Trail spans about 2,650 miles from Mexico to Canada. Thru-hikers often plan 16-mile days early, celebrate a 6th resupply by mile 360, and carry 1.6 liters per hour across 6% grades in 106 F heat.",
    "In the 1860s the 16th U.S. president, Abraham Lincoln, issued the 1863 Emancipation Proclamation. Historians still study 1865 battlefield maps at 1:63,360 scale to trace routes taken before the 6th cannon volley.",
    "A Boeing 767 cruises near 560 mph at 36,000 feet. On approach, crews might line up with Runway 16L, extend flaps to 26 degrees, and keep the Vref around 136 knots in a light 6 kt crosswind.",
    "NVIDIA's GTX 1660 targeted 1080p gaming at launch. Many x86 PCs paired the card with 256 GB SSDs and 16 GB RAM and 650 W supplies while casual players capped frames at 60 Hz to keep temps near 66 C.",
    "The Protestant Bible contains 66 books. Joshua is the 6th, many English readers know the 1611 King James tradition, and modern editions often settle near 1,600 pages in compact 6 x 9 inch formats.",
    "Android 6.0 introduced granular permissions and Doze battery savings. Midrange phones later shipped with 64 GB storage and 256 GB options while budget chipsets clocked 1.6 GHz and Cat 6 LTE modems handled 60 fps streams.",
    "Most routers speak IPv6 while laptops run x86. AES uses 256-bit keys, gamepads map 360 moves, and caches hit 64 bytes as phones idle at 1.6 GHz in the 6th app.",
    "North of 66.5 degrees the Arctic Circle brings roughly 6 months of light and 6 of night. Many towns sit 650 km from coasts, and festivals start in the 6th week after solstice.",
    "A No 16 forward scored in the 6th minute as a 60,000 crowd roared. The match swung 2-1 to 3-2 on 26 shots and 36 tackles with a 96th minute clearance.",
    "Tourers favor a V6 for smooth torque, then test 0-60 in 6.0 seconds on 650 km loops. A 1.6 L hatch hums happily in 6th, holding 2,600 rpm at 66 mph.",
    "Retro devs compare the 68000 to x86 eras as 16 bit sprites met 64 bit textures. Pixel artists love 256 color palettes and 360 loops while celebrating a 6th remaster.",
    "Route 66 gained its number in 1926 and still anchors road lore. Travelers map 600 mile segments, queue at 6th Street diners, and rate pie at 6.5 while chasing 26 vintage signs.",
    "Bees build 6 sided cells that tile at 360 degrees with no gaps. Naturalists by the 16th century sketched honeycomb geometry and measured angles at 120 and 60 across symmetric 6 fold patterns for the 6th facet.",
    "City plans model 1.6 C limits and target 60 percent clean power. Retrofits add 600,000 heat pumps by 2016 as crews finish a 6th district hub with 16 km of upgraded mains.",
    "A Boeing 767 cruises near 36,000 ft and intercepts the ILS at 160 knots. On Runway 16L the 6th marker passes fast as thrust goes to 66 percent before a stable 3.6 degree descent.",
    "A chessboard shows 64 squares and each side starts with 16 pieces. Engines probe the 6th rank, search 26 plies, and evaluate 36 candidate lines while tablebases perfect 6 man endings.",
    "Carriers expand IPv6, handing out 128 bit addresses with 64 bit interface IDs. Monitors sample every 60 seconds, trigger at 6 minutes, and loop 360 tests during a 6th on call week.",
    "Cook sailed in 1768 to observe Venus, and Jenner described vaccination in 1796. Navigators tracked 360 bearings, logged 26 days between ports, and copied 16th century routes on a 6th revision chart.",
    "Compilers targeting x86-64 juggle 16 registers and 256 byte cache lines. A 6th release can trim 6 percent stalls, lift IPC by 1.6, and smooth 360 frame pacing under heavy loads.",
    "Nintendo 64 arrived in 1996 and pushed smooth 360 camera control. Speedrunners route a 16 star path, clear Bowser in the 6th minute, and celebrate a 1.6 second gold split on 64 tracks.",
    "Chess960 randomizes back ranks into 960 legal starts while classic chess keeps 64 squares. Pros study a 6th file breakthrough on move 26, then calculate 36 continuations at depth 16.",
    "Budget rigs with a GTX 1660 still serve many x86 builds at 60 fps. A 256 bit bus feeds 6 GB cards, and 1.6 ms frametimes pop up during 360 degree pans on 650 scenes.",
    "The modern Olympics began in 1896 and the 16th Games unfolded in 1956. Marathons lock at 26.2 miles, sprinters face 6 lanes in heats, and 400 m finals resolve in 46 or 46.6 seconds.",
    "NVMe drives saturate about 3,600 MB per second on x16 lanes while older SATA caps near 6 Gbps. Backups rotate every 6 hours and a 6th snapshot trims 60 percent restore times.",
    "A fast growing city crossed 600,000 residents and opened a 16 station tram. Riders count 6 lines, watch 360 security feeds, and gather at a 6th district plaza near 650 year old walls.",
    "A Rubiks Cube has 6 faces and rotates in 90 degree steps across 360 orientations. Solvers track 26 visible cubies, complete a 6th step set, and average 16 seconds in 2016 events."],
  "7": ["Boeing 747 and 767 reshaped long-haul travel; many 747 routes topped 7,000 miles by the 1970s, and some carriers used 7th-freedom cargo rights on transoceanic links.",
    "Antarctica is the 7th continent; katabatic winds often exceed 70 knots on 3,700 m domes, 1977 records noted brutal cold, and 1978 flights resupplied stations as winter sea ice covers over 7 million km2.",
    "Windows 7 stabilized desktops in 2009; by 2017 many phones adopted 7 nm class chips, ARMv7 still ran popular apps, 7-Zip stayed ubiquitous, and hard drives spun at 7,200 rpm.",
    "Baseball fans rise for the 7th-inning stretch, and postseason rounds often hinge on Game 7. A 1977 classic ended 7-6 after 17 hits as relievers faced 27 batters.",
    "Climbers pursuing the 7 Summits train on 7,000 m routes; Denali's high camp sits near 17,200 ft, Everest traffic spiked after 2017, and many teams plan a 7th-day rotation around 7,200 m.",
    "Network courses teach the 7-layer OSI model; Layer 7 handles application traffic, and admins watch 24x7 dashboards as 99.97% uptime targets hold while core routers push 7 Gbps on port 7070.",
    "In 1776 the Declaration announced independence; by 1788 Maryland entered as the 7th state and the text listed 27 grievances while July is the 7th month.",
    "Runway 27 points near 270 degrees; large fields often publish both 27L and 27R, and a 727 on final maintains 137 knots before crossing the 7th marker.",
    "Digital clocks use 7-segment displays; engineers count 127 usable patterns, drive LEDs near 1.7 V, cycle 70,000 steps, and schedule a 7th audit after 27 days of continuous operation.",
    "Using the rule of 72, money doubling at 7% takes about 10 years; fee cuts from 0.7 to 0.07 percent save thousands, and 70 pct equity often defines a cautious 7th-decade plan.",
    "Guidebooks still list 7 Wonders; in 1907 scouting began at Brownsea, a 2007 poll narrowed 77 nominees, and modern rankings drew over 70 million votes for 7th sunrise photo ops.",
    "Interstate 70 meets I-77 in Ohio at Cambridge; eastbound I-70 reaches I-270 near Columbus, and many drivers log 700 miles across two days before a 7th rest stop.",
    "Email headers still trace 7-bit ASCII; servers return 307 redirects as clients retry within 7 seconds, while DNS caches honor 7,200 second TTLs before a 7th lookup to 127.0.0.1.",
    "Bond's code 007 made the 7th film, Diamonds Are Forever, a 1971 draw; the late 1970s refreshed gadgets, and DB7 road cars turned up by 1997.",
    "Chemistry courses note nitrogen is atomic number 7 and neutral water sits near pH 7; the SI defines 7 base units, the 7th period includes actinides, and labs hold 27 C for 70 minutes.",
    "Rome is famed for its 7 hills; construction of the Colosseum began around AD 70, guides map 76 entrances, and capacity sat near 70,000 as a 7th recommended loop runs about 7 km.",
    "Boeing's 707 launched the jet age in 1958; the 727 and 737 refined short-haul, the 747 flew over 7,000 miles on flagship routes, and 1977 schedules knit continents more tightly.",
    "Uranus is the 7th planet; it has 27 known moons and rings were first detected in 1977, its axial tilt is about 97.7 degrees and Voyager 2 flew by in 1986.",
    "Chicago lists 77 community areas; residents dial 773 or 872, and the city's 7th Ward maps sit alongside histories of the 1871 fire.",
    "Classroom mnemonics list 7 continents and 7 days; study halls run 24x7 before exams, the 7th grade often starts near age 12, and Room 107 schedules 70 minute labs.",
    "Networking courses teach the 7 layer OSI model; Layer 7 handles HTTP on ports 80 and 443 while admins watch 24x7 uptime and test service beacons at 127.0.0.1 and 7070 during the 7th check.",
    "Boeing 747 767 and 777 defined long haul; a 727 left Runway 27 with Vref near 137 knots as a 7000 mile sector closed a 7th city pair in 1977 schedules.",
    "Baseball fans rise for the 7th inning stretch as 70000 cheer. Game 7 went 11 innings after a 2 1 lead vanished on a 97 mph liner in the 77th at bat.",
    "Windows 7 stabilized desktops; phones shifted to 7 nm class nodes as ARMv7 apps lingered. Home theaters mixed 7.1 tracks while legacy sets held 720p at 72 Hz for older panels.",
    "Teachers list 7 continents and 7 days. Cartographers mark 37 N and 77 W across Virginia; hikers track 1700 ft climbs and celebrate a 7th summit on day 17 of a 70 mile loop.",
    "By the Rule of 72 a 7 percent return doubles in about 10 years; at 17 percent it halves that time while a 70 30 mix suits a cautious 7th decade saver over a 47 year plan.",
    "Early terminals used 7 bit ASCII; code 127 marked DEL while 0x7E drew the tilde. Modern controllers multiplex 7 segment LEDs at 77 Hz and 1 kHz to keep a steady 70 percent duty.",
    "Guidebooks still list 7 Wonders. A 2007 vote narrowed 77 nominees and tours now sell 7 day circuits with 70 percent occupancy as photographers chase a 7th sunrise angle at 07:17.",
    "Runway 27 aligns near 270 degrees; departures climb to FL370 with 170 knot restrictions. Arrivals brief a 7 nm fix then capture the 3 degree glide at 700 ft for the 7th marker.",
    "Many games mix 7.1 surround with 720p retro modes; testers chart 77 fps minimums at 7 ms input and a 70 percent GPU load before a 7th hotfix stabilizes traversal stutter.",
    "Arctic maps note 77 N near Svalbard and 71 N by Nordkapp. Winter brings 24 hours dark for roughly 77 days while ships thread 70 N waters under 7 tenths ice and a 7th patrol.",
    "In 1776 the Declaration reached the colonies; in 1788 Maryland entered as the 7th state. The text listed 27 grievances and July is the 7th month in the Gregorian calendar.",
    "Archivers like 7zip produce .7z files with strong ratios; laptops on 7 nm nodes pull 7 watts at idle and spike to 70 under load before a 7th pass finalizes checksums.",
    "Western music names 7 natural notes and builds 7th chords from stacked thirds. Drummers practice 7 8 patterns at 77 bpm while a 1977 wave of punk set brisk 170 beat targets.",
    "NASA celebrated the Mercury 7 then flew Apollo 17 to the Moon. Voyagers launched in 1977 and Mars landers endured 7 minutes of terror near 7 g before a 7th telemetry tone confirmed landing.",
    "Many surveys use a 7 point Likert scale; classes set 70 percent thresholds and assign 17 credits with 27 problem sets and score 7 out of 7 before a 7th week checkpoint.",
    "Interstate 70 meets I 77 near Cambridge and I 71 near Columbus. Drivers plan 700 mile hauls with 27 rest areas and schedule a 7th fuel stop at 170 miles remaining.",
    "Chemistry marks pH 7.0 as neutral and nitrogen has atomic number 7. The SI defines 7 base units and labs hold 70 percent humidity for a 7th calibration across 17 samples at 21 C.",
    "Chicago lists 77 community areas and residents dial 773 or 872. The 7th Ward map sits by exhibits on the 1871 fire and a 1977 neighborhood plan that added 700 new units.",
    "Rugby sevens fields 7 players with 7 minute halves. World Series stops drew 77000 in 2017 and a 7th seed shocked a top side 27 7 after a burst of 77 meter sprints."],
  "8": ["Computing starts with 8 bits in a byte; 1980s micros shipped 48 KB, 128 KB felt huge, and HTML5 drafts in 2008 reached 800 by 480 screens on budget devices.",
    "The IAU lists 88 constellations; precise borders arrived in 1930. Star guides mark 8th magnitude limits, and Messier 81 and 82 anchor northern spring charts for casual binocular tours.",
    "At the 1988 Seoul Games, 800 m tactics prized even 58 second laps. Los Angeles 1984 popularized staggered starts in replays, and 8 finalists often finished within 0.8 seconds.",
    "Oxygen is atomic number 8 and the octet rule highlights 8 valence electrons. Argon totals 18, and many 1988 primers drew 2-8-8 diagrams to explain stable shells in simple terms.",
    "By the Rule of 72, an 8% return doubles in about 9 years; at 18% it halves the time, while at 28% it accelerates beyond many 1980s market norms.",
    "Everest stands at 8,848 m; K2 rises 8,611 m. Fourteen peaks exceed 8,000 m, and in 1980 the first winter ascent of an 8,000 m summit proved brutal.",
    "The IPCC formed in 1988; its 2018 report framed 1.5 C and scenarios project up to 80 cm seas by 2100. Cities plan 80% electrified buses, 18 month procurements, and 800 fast chargers.",
    "Roland's TR-808 launched in 1980 and defined 808 bass. Producers layered 808 kicks at 80 to 88 bpm, then 2008 pop hits spread the sound worldwide.",
    "Beijing opened the 2008 Summer Olympics on 8 August 2008 at 8 pm local time, reflecting cultural luck around 8, and the Bird's Nest hosted about 80,000 fans.",
    "Chess uses an 8 by 8 board with 64 squares. Competitive play adopted mechanical clocks in 1883, and modern events use 90 minutes with 30 second increments while blitz often runs 3 minutes with 2 seconds.",
    "Interstate 88 exists in Illinois and New York. The Illinois route was designated in 1987, the New York route opened segments through 1989, and both corridors eased 80 mile rural treks.",
    "Game history often calls 1983 the North American crash; 8-bit consoles revived sales, and by 1988 developers squeezed 8 sprites per scanline while 480p was still years away.",
    "Europe's 1848 revolutions spread from Paris to Vienna and Berlin; by 1849 many efforts failed. Historians cite crop shocks, unrest across 18 cities, and urban populations near 800,000 in several capitals.",
    "The eight queens puzzle dates to 1848. There are 92 distinct solutions on an 8 by 8 board, and 1874 papers generalized the task to n queens with elegant backtracking ideas.",
    "Boeing's 787 family includes the 787-8 and 787-9. Typical economy seating is 9 abreast, cruise near Mach 0.85, and 1980s composites matured into 787 production with lower 80 dBA cabin noise.",
    "Cinema in 1982 delivered Blade Runner, and by 1998 DVD adoption surged past 80% in some markets as 480p transfers replaced aging tapes.",
    "Neptune, the 8th planet, was discovered in 1846 after calculations by Le Verrier and Adams. Voyager 2 passed in 1989, imaging the Great Dark Spot and high clouds at roughly 800 km scale.",
    "Basel I in 1988 set an 8% capital adequacy ratio. Banks tracked 80 risk weights and supervisors added 1998 refinements before Basel II expanded the framework.",
    "Buddhist teaching summarizes the Noble Eightfold Path into 8 practical headings. Scholars trace early translations to the 19th century, and 2018 syllabi present 88 case studies for modern ethics courses.",
    "Euro 88 crowned the Netherlands as champions. Marco van Basten's volley sealed a 2-0 final in 1988, and No 8 midfielders became archetypes for late 1980s transitions.",
    "A byte holds 8 bits; the NES popularized 8-bit play in 1985 and Intels 8086 from 1978 shaped x86 lines. Early carts of 128 KB felt vast on 8 layer maps.",
    "IPv6 addresses have 8 hex groups; many reports in the 2010s showed adoption past 28 percent. Dual stack kept IPv4 stable and port 8080 remained common in staging.",
    "Beijing opened the 2008 Olympics on 8 August 2008 at 8 pm. The Birds Nest welcomed about 80000 fans and ceremonies leaned on lucky 8 themes across eight chapters.",
    "The octagon stop sign has 8 sides; the red standard arrived in 1954. By the late 1960s drivers in 48 states saw uniform designs at roughly 30 inch panels.",
    "Arachnids are defined by 8 legs and many spiders also show 8 eyes. Grade 8 labs use an 8 point checklist to separate insects from arachnids in 180 minute sessions.",
    "Chess uses an 8 by 8 board with 64 squares; mechanical clocks appeared by 1883. Blitz often runs 3 minutes plus 2 seconds as engines analyze 8 ply in under 80 ms.",
    "Roland TR-808 arrived in 1980 and its 808 kick rewired pop rhythms. Producers often sit near 88 bpm while 8 bar patterns loop beneath bright 808 claps.",
    "8K frames measure 7680 by 4320 while 4K sits at 3840 by 2160. Editors record 48000 Hz audio and 8 core laptops export a reel in about 8 minutes.",
    "Since 2006 astronomers count 8 planets. Neptune was calculated in 1846 and Voyager 2 flew by in 1989 with winds seen above 600 meters per second at high latitudes.",
    "Golf settled on 18 holes at St Andrews; a common card lists par 72. An 8 iron carries roughly 160 yards and the 1986 Masters remains a famous comeback.",
    "The Beatles released Eight Days a Week in 1964. By 1968 the White Album ran long and many sides stretched 24 to 28 minutes on 33 rpm pressings.",
    "US 68 hosts a long yard sale across Kentucky and beyond. In the 1980s widening projects added lanes while towns promote an 8 day 68 yard sale each summer.",
    "Memory often scales by powers of two. After 128 came 256 then 512 and 1024 while cache lines align to 64 bytes and 8 way sets reduce thrash in busy loops.",
    "Boeing builds the 787-8 and the 787-9; typical cruise rides near Mach 0.85. Many cabins target 8000 foot pressure levels and ranges around 8100 nautical miles.",
    "By the Rule of 72 an 8 percent return doubles money in about 9 years. At 18 percent it halves that time while 28 percent accelerates the curve far faster.",
    "In 1988 the Lakers won the NBA Finals in Game 7 with a 108 to 105 score. Kareem wore No 33 while Magic assisted on 14 and played 48 minutes.",
    "A piano holds 88 keys and an octave spans 8 notes. Concert pitch sets A4 at 440 Hz and many exercises use 8 bar phrases for timing and touch.",
    "Mixed martial arts uses an octagon with 8 sides; the first UFC ran in 1993. Modern cages span 30 feet or 25 feet with 8 posts and 8 corner pads.",
    "Street boards often use 8.0 or 8.25 inch decks; 180 and 360 spins build into 540s. Trucks tighten to 80 A bushings and 58 mm wheels suit many parks.",
    "UTF-8 encodes ASCII in 8 bit units; higher code points span 16 to 32 bits. Octal once logged Unix modes and 0777 still flags full access in 1980s style tutorials."],
  "9": ["Baseball plays 9 innings with 9 players in the field and 90 feet between bases. Extra drama arrives in the 9th when a 2-1 lead can vanish after 99 pitches.",
    "In 1969 Apollo 11 rode the Saturn V to Tranquility Base. The program began after a 1961 pledge and the rocket lifted roughly 9 million pounds during ascent.",
    "The US Supreme Court has had 9 justices since 1869. In 1937 a court packing plan failed and modern terms still feature 5-4 splits alongside crisp 9-0 opinions.",
    "South Africa counts 9 provinces after reforms in 1994. Gauteng hosts Johannesburg while the 1995 Rugby World Cup marked a nation building moment and tourism rose 9% in the late 1990s.",
    "Greek myth lists 9 Muses. 19th century encyclopedias popularized their names and schools visit galleries in groups of 9 or 19 during yearly arts programs.",
    "Go uses a 19 by 19 board for full games and a 9 by 9 board for learning. Territory scoring grants 1 point per intersection and strong players often read 9 moves ahead.",
    "A standard Sudoku has a 9 by 9 grid with 81 cells. Each row column and 3 by 3 box must use digits 1 through 9 exactly once for a valid solve.",
    "Strikers often wear the No 9 and live between the posts. The 1998 World Cup crowned France and many clubs in 1999 still trusted a classic 4-4-2 built around a predatory 9.",
    "The UK adopted 999 for emergencies in 1937 after trials in 1935. The number predates 911 and remains active alongside 112 across mobile networks.",
    "Beethovens Symphony No 9 premiered in 1824 in Vienna. The choral finale sets Ode to Joy and orchestras programmed the Ninth for 1999 millennial events and 2019 anniversary seasons.",
    "Before 2006 many school charts listed 9 planets. Pluto was reclassified as a dwarf planet and discoveries in 1992 and 2005 highlighted orbits beyond Neptune.",
    "The 2011 Tohoku quake registered magnitude 9.1. It triggered a devastating tsunami within minutes and shifted parts of Honshu by over 2 meters as aftershocks above 7.0 persisted through 2011.",
    "The 1990s saw the web explode as HTML and HTTP spread from 1991 to 1993. Search rose in 1998 and MP3 sharing peaked in 1999 as dial up lines hit 56 kbps.",
    "Using the Rule of 72 a 9% return doubles savings in about 8 years. At 19% it halves the time while at 3% it stretches close to 24 years.",
    "Chicago sits near 41.9 N while the 90th meridian cuts through the Midwest. City plans in 1999 highlighted lakefront renewal as neighborhoods pushed for 9 new miles of trail.",
    "The Boeing 787 typically seats 9 abreast in economy. The 777-9 stretches the 777 line while the 747 left many passenger schedules by 2017 after its first flight in 1969.",
    "Dreamcast launched in the United States on 9-9-99. The PlayStation era from 1994 to 1999 popularized 3D worlds and set up a 2000s surge in online play.",
    "Digital root checks use casting out nines. Any multiple of 9 reduces to 9 and 99 is divisible by 9 because 9 plus 9 equals 18 which reduces to 9.",
    "Cinephiles cite 1959 for Some Like It Hot and 1999 for The Matrix. The summer of 1989 brought Batman while 1979 delivered Alien and Apocalypse Now.",
    "United States Route 99 once ran from Mexico to Canada before decommissioning in 1964. Washingtons SR 99 tunnel opened in 2019 replacing the Alaskan Way Viaduct built in the 1950s.",
    "In 1995 and 1998 home PCs jumped online with 56 kbps modems. By 1999 MP3 catalogs grew nightly and Y2K drills ran at 9 pm with 99 backup tapes spinning.",
    "Elite sprinters chase 9.69 to 9.79 seconds for the 100 m. Workouts hit 90 percent effort with 9 by 60 m reps and 19 minute cooldowns under 29 degree heat.",
    "The classic No 9 thrives between lines. In 1999 a 90th minute header sealed a 2-1 as 9 shots produced 0.99 expected goals against a rigid backline.",
    "California State Route 99 threads the Central Valley past SR 198 and US 199. Summer highs hit 99 F and traffic peaks near 90,000 vehicles north of Fresno at 9 each morning.",
    "At 9 percent a Rule of 72 estimate doubles money in 8 years. Portfolios from 1990 to 1999 saw 19 percent swings, so a 90 10 split softened 9 of 10 down months.",
    "99 Luftballons reached charts in 1983 and 1984. Programmers spun 3 minute 49 second edits at 99.9 FM, and Cold War lyrics resonated across 19 markets through the 1980s.",
    "Before 2006 many textbooks listed 9 planets. Discoveries in 1992 and 1993 of Kuiper Belt objects shifted models, and 1989 Voyager 2 images of Neptune wrapped a 12 year tour.",
    "IMAPS uses port 993 while secure POP3 sits on 995. Admins still trace 9 hops with TTL 99, and schedule 90 minute windows to swap 19 failing drives at 09:00.",
    "Boeing's 777-9 stretches the family while the 787-9 cruises near Mach 0.85. Earlier 737-900 services packed 199 seats, and ETOPS plans included 90 minute diversions to 9 alternates.",
    "Sudoku uses a 9 by 9 grid with 81 cells and 27 boxes. Each row column and box must place digits 1 through 9 exactly once, yielding 9 clean sets across 9 regions.",
    "The Chicago Bulls three-peated in 1991, 1992, and 1993. The 1996 to 1998 run reached 72, 69, and 62 wins, and Game 6 in 1998 featured a famous No 23 dagger with 5.2 left.",
    "Sega launched Dreamcast on 9-9-99 in the United States. The late 1990s pushed 199 million polygon claims while dial up nights crawled at 56 kbps until 2000 broadband arrived.",
    "Interstates 90 and 94 split and rejoin around Chicago with I-290 and I-294 carrying bypass flows. Drivers face 9 lanes near downtown and 90 minute rushes across recurring 19 mile bottlenecks.",
    "Felix Baumgartner's 2012 jump from about 39 km broke records. He reached near Mach 1.25, freefell for 4 minutes 19 seconds, and landed safely after a 9 point checklist cleared green.",
    "Star Wars Episode I arrived in 1999 and the Skywalker saga closed with Episode IX in 2019. Fans compare 1977 pacing to 1980 texture and rank top 9 lightsaber duels each December.",
    "Jet cruise often sits near FL390 with altimeters set to 29.92 after passing the transition altitude. Approach briefings warn of 9 gusting 19 knot crosswinds on Runway 09 during late storms.",
    "Grade 9 often marks the start of high school. Students chase 99th percentile scores, finish 19 required credits by age 17, and target 90 minute study blocks before 9 pm lights out.",
    "Prince released 1999 in 1982 and the title track became a late night anthem. By 1999 dance floors looped 99 remixes and countdowns hit 9 seconds before midnight.",
    "The Porsche 911 debuted in 1964 and the 991 generation arrived in 2011 before the 992 in 2019. A Carrera 4S can sprint 0-60 in 3.9 while cruising near 199 mph on tracks.",
    "Reliability targets often cite five nines or 99.999 percent uptime. That allows about 5 minutes of downtime per year, so teams staff 24x7 coverage and rehearse 19 rollback paths with 90 second checkpoints."
  ],
  "0": ["After Web 1.0 the 2000s popularized Web 2.0 communities. By the 2010s many platforms handled 100,000 daily posts and 40,000 photos and served 800 creators through 10th anniversary programs.",
    "In 1903 the Wright Flyer covered 120 feet. Modern jets cruise around 30,000 feet with 500 mph groundspeeds and descend through 10,000 for checks while early aviation meets celebrated the 10th year by 1910.",
    "A classic No 10 dictates tempo over 90 minutes. New stadiums list 40,000 seats and 20,000 season tickets while a stoppage board adds 10 more as supporters plan the 10th away day.",
    "Version 1.0 shipped with 100,000 users. A 2.0 update pushed 50,000 requests per second and met a 10th sprint deadline while teams logged 0 critical defects after weekend tests.",
    "The prime meridian meets latitude 0 at Greenwich. Sailors cross the 180 line near the date change and many maps since 1900 mark 0 meters, 100 meters, and 200 meters on clean 1.0 grid intervals.",
    "Analysts track the S and P 500 and the Dow 30. A 10 year yield near 1.0 percent can reprice 200,000 mortgages as 50 basis points move monthly costs for 100,000 homeowners.",
    "Programmers love zero based indexing so arrays begin at 0. Typical loops run to 100 or 1000, version tags hit 2.0 or 1.0, and compilers optimize 200 lines into 20 instructions.",
    "In distance running the 10,000 meters often splits 70 seconds per lap. Tactical races turn at 2,000 and then 800 before a 200 finish as the 10th coach yells go.",
    "Spain won Euro 2008 with a 1-0 final after 90 minutes. Later the 2010s saw tiki taka dominate 100 passes per sequence and a pressing line set near 40 meters.",
    "Photographers start at ISO 100 outdoors then step to 200 or 400 as light drops. Indoors they prefer ISO 800 and stabilize 1.0 second cityscapes with tripods on 2000s era bridges.",
    "An MMO launched in 2003 and grew into the 2010s. Peak nights reported 100,000 players and 50,000 in queues as a 10th anniversary expansion added 200 new quests and 0 downtime.",
    "Inflation near 0 can still hurt. A 1.0 percent shock over 12 months trims 200,000 paychecks while households with 100,000 income shift 20 percent to savings during a 2010s squeeze.",
    "Apollo 10 tested the lunar approach in the 1960s. The command module looped roughly 400,000 km from Earth and controllers celebrated a 10th flawless burn after 0 alarms in final checks.",
    "Interstate 90 crosses the US end to end while I 80 parallels far south. Long hauls plan 1,000 mile stretches and refuel every 200 miles while targeting 0 congestion near the 10th overnight stop.",
    "Log10 measures orders of magnitude so 100 is 2 and 1000 is 3. Scientists compare 10,000 to 1,000 for clarity and note the 10th place where 0 shifts value in base 10.",
    "Global CO2 passed 400 ppm in the 2010s. Many city plans target 50,000 heat pump installs and 40,000 chargers by 2025 while buildings aim for 0 on site emissions during 10 year retrofits.",
    "Many airliners follow a sterile cockpit below 10,000 feet. Regulations cap 250 knots under 10,000 as departures call 400 feet for turns and crews brief a 10th item while keeping 200 knots away from 0 visibility minima.",
    "Fortune 500 ranks 500 companies by revenue. The FTSE 100 tracks 100 blue chips and the Dow 30 highlights industrials while investors remember the 2000s shift toward 0 commission trading.",
    "Consoles in the 2010s pushed 1080p at 60 fps. Many titles locked 30 fps to hold 120 field of view and patches trimmed 100 ms input lag on 2008 era engines.",
    "Radio expanded in the 1920s, television surged in the 1950s, and color formats dominated by 1970. The 1940s defined war economies and the 1980s commercialized 24 hour news at 0 latency dreams.",
    "A startup shipped 1.0, jumped to 2.0 in the 2000s; telemetry crossed 100,000 events with 40,000 users by the 10th sprint.",
    "Crews brief FL400 and a 200 knot restriction below 10,000 feet. After 1,000 fpm to 3,000, the 10th checklist item confirms 0 visibility minima tolerances.",
    "Index funds tracking the S and P 500 and the Dow 30 grew through the 2010s. A 1.0 percent move can reprice 200,000 mortgages by 200 each month.",
    "A 10,000 meter race targets 70 second laps, then a 400 kick. Coaches mark 200 and 800 splits, and celebrate the 10th victory of a long 2000s career.",
    "Night shots often start at ISO 800 with 1.0 second exposures. Shooters step to ISO 1600, then 30 seconds at f 2.0, before a 10th frame locks focus.",
    "A v1.0 dashboard charted 100,000 users and 50,000 sessions. The v2.0 rollout cut p95 to 300 ms as 10th percentile latencies fell under 200.",
    "Interstate 90 meets I 290 and I 390 around Chicago. Planners track 20,000 vehicles per hour, add 200 ramp meters, and open the 10th reversible lane by 2024.",
    "Consoles in the 2010s pushed 4K at 60 fps and 1080p at 120. Patches trimmed input to 100 ms on v2.0 engines and marked a 10th studio milestone.",
    "City plans for 2025 target 50,000 heat pumps and 40,000 chargers. Buildings aim for 0 on site emissions by the 10th year while crews retire 200 old boilers.",
    "By 1903 the Wright Flyer lifted off a windy beach. A century later 2010s trainers cruised at 100 knots, climbed at 800 fpm, flew 1.0 g turns and joined circuits at 1,000 feet.",
    "Backup rules keep 3,000 versions, 2,000 offsite, and 100 on cold storage. A 10th restore test verifies 0 data loss and cuts recovery to 200 seconds.",
    "A No 10 dictated tempo over 90 minutes. The 70th brought a 20 yard strike, then a 100th club goal in the 2010s as 40,000 sang in stoppage.",
    "Blitz often runs 3 minute 0 increment or 5 minute 0 increment. A 10th event streams 30 boards, 100 clocks, and 300,000 moves recorded by 2023 sensors.",
    "Apollo 10 rehearsed lunar procedures in the 1960s about 400,000 km away. Controllers logged 0 alarms, confirmed the 10th burn, and added 200 new checks.",
    "A warehouse ships 50,000 orders from 10 docks daily. Robots carry 200 boxes at 1.0 m per second and restock 3,000 bins before a 10th shift begins.",
    "A 100 point exam weights a 20 point essay and 30 short answers. Teachers post v1.0 rubrics, publish a v2.0 revision, and grade 150 papers by the 10th night.",
    "High speed lines run 300 kmh on 25 kV, with 3,000 V on legacy trunks. A 10,000 passenger day needs 200 staff and a 10th platform to keep 0 delays.",
    "An API at v2.0 handles 200 requests per second and budgets 300 ms p95. The v1.0 path caches 100,000 keys and refreshes 50,000 by the 10th hour.",
    "A 1980s hit sold 500,000 singles on 7 inch vinyl. Anniversary sets in 2010 and 2020 added 30 outtakes and 100 minutes, honoring the 20th year remaster.",
    "Binary tracks 0 and 1; a kilobyte is 1,000 bytes by SI and 1,024 by IEC. Version 1.0 notes both and a 10th lecture reviews 2008 standard updates."]
}
lgbm_inference_script = `
    import lightgbm as lgb
    import json

    model = lgb.Booster(model_file='model.txt')
    inputs = json.load(open('input.json'))
    model_input = [[x.get(col,None) for col in model.feature_name()] for x in inputs]
    
    res = model.predict(model_input)
    res_list = [x[2]/(x[1]+x[0]) for x in res]
    res_list
  `

error_cnn_inference_script = `
import os
os.environ["OPENBLAS_NUM_THREADS"] = "4"

import numpy as np
from numpy.lib.stride_tricks import sliding_window_view
import json
START_TOK = "<S>"
END_TOK = "<E>"
PAD_TOK = "<P>"

tok_to_idx = {
    "<S>": 0,
    "<E>": 1,
    "<P>": 2,
    " ": 3,
    "!": 4,
    '"': 5,
    "%": 6,
    "'": 7,
    "(": 8,
    ")": 9,
    ",": 10,
    "-": 11,
    ".": 12,
    "0": 13,
    "1": 14,
    "2": 15,
    "3": 16,
    "4": 17,
    "5": 18,
    "6": 19,
    "7": 20,
    "8": 21,
    "9": 22,
    ":": 23,
    ";": 24,
    "?": 25,
    "A": 26,
    "B": 27,
    "C": 28,
    "D": 29,
    "E": 30,
    "F": 31,
    "G": 32,
    "H": 33,
    "I": 34,
    "J": 35,
    "K": 36,
    "L": 37,
    "M": 38,
    "N": 39,
    "O": 40,
    "P": 41,
    "Q": 42,
    "R": 43,
    "S": 44,
    "T": 45,
    "U": 46,
    "V": 47,
    "W": 48,
    "X": 49,
    "Y": 50,
    "Z": 51,
    "_": 52,
    "a": 53,
    "b": 54,
    "c": 55,
    "d": 56,
    "e": 57,
    "f": 58,
    "g": 59,
    "h": 60,
    "i": 61,
    "j": 62,
    "k": 63,
    "l": 64,
    "m": 65,
    "n": 66,
    "o": 67,
    "p": 68,
    "q": 69,
    "r": 70,
    "s": 71,
    "t": 72,
    "u": 73,
    "v": 74,
    "w": 75,
    "x": 76,
    "y": 77,
    "z": 78,
    "£": 79,
}

def conv1d(x, w, b, pad):
    # x: (B, Cin, L), w: (Cout, Cin, K), b: (Cout,)
    x_p = np.pad(x, ((0, 0), (0, 0), (pad, pad)))
    K = w.shape[2]
    # windows: (B, Cin, Lout, K)
    windows = sliding_window_view(x_p, window_shape=K, axis=2)
    # einsum: batch b, cin c, length l, kernel k
    #         weight o c k
    # -> output b o l
    y = np.tensordot(windows, w, axes=([1, 3], [1, 2]))
    # reorder to (B, Cout, Lout)
    return np.moveaxis(y, -1, 1) + b[None, :, None]

def batchnorm1d(x, rm, rv, w, b, eps=1e-5):
    return (x - rm[None, :, None]) / np.sqrt(rv[None, :, None] + eps) * w[
        None, :, None
    ] + b[None, :, None]

def gelu(x):
    # tanh‐based approximation, no erf needed
    return 0.5 * x * (1 + np.tanh(np.sqrt(2 / np.pi) * (x + 0.044715 * x**3)))

def layernorm(x, w, b, eps=1e-5):
    mu = x.mean(-1, keepdims=True)
    var = x.var(-1, keepdims=True)
    w = w[None]
    b = b[None]
    return (x - mu) / np.sqrt(var + eps) * w + b

def linear(x, w, b):
    return x @ w.T + b

def tokenize(string_value, len_seq=0, max_pad=17):
    chars = [START_TOK] + list(string_value)+ [END_TOK]
    return [tok_to_idx[c] for c in chars] + [tok_to_idx[PAD_TOK] for _ in range(min(len_seq - len(chars),max_pad))]

class CNNCharErrorModel():
    def __init__(self, weights_path):
        self.params = np.load(weights_path)
        self.emb_w = self.params['embedding.weight']
        self.mlp_w = self.params['final_mlp.0.weight']
        self.mlp_b = self.params['final_mlp.0.bias']
        self.out_w = self.params['out.weight']

    def forward_fn(self, x_idx):
        emb = self.emb_w[x_idx]  # [B,L,emb_dim]
        for n in range(1, 6):
            feats = []
            channel_count = 5
            for i in range(channel_count):
                cw = self.params[f"conv{n}.convs1.{i}.0.weight"]
                cb = self.params[f"conv{n}.convs1.{i}.0.bias"]
                rm = self.params[f"conv{n}.convs1.{i}.1.running_mean"]
                rv = self.params[f"conv{n}.convs1.{i}.1.running_var"]
                bw = self.params[f"conv{n}.convs1.{i}.1.weight"]
                bb = self.params[f"conv{n}.convs1.{i}.1.bias"]
                t = emb.transpose(0, 2, 1)
                y = conv1d(t, cw, cb, pad=cw.shape[-1] // 2)
                y = batchnorm1d(y, rm, rv, bw, bb)
                feats.append(gelu(y))
            cat = np.concatenate(feats, 1)  # [B,sum(channels), L]
            cat = cat.transpose(0, 2, 1)  # [B, L, sum(channels)]
            proj_w = self.params[f"conv{n}.project1.weight"]
            proj_b = self.params[f"conv{n}.project1.bias"]
            res = linear(cat, proj_w, proj_b)
            rw = self.params[f"conv{n}.res_weight"]
            res += emb * rw
            # layernorm per layer has its own params; reload them each loop
            ln_w = self.params[f"conv{n}.norm2.weight"]
            ln_b = self.params[f"conv{n}.norm2.bias"]
            emb = gelu(layernorm(res, ln_w, ln_b))

        x = gelu(linear(emb, self.mlp_w, self.mlp_b))
        logits = linear(x, self.out_w, np.zeros(self.out_w.shape[0]))
        return logits

inputs = json.load(open('input_2.json')) # expecting list of length B strings
toks = [tokenize(x, len_seq=602) for x in inputs]
model_input = np.array(toks)

model = CNNCharErrorModel('error_model_weights.npz')
res = model.forward_fn(model_input)
res_list = [[float(x) for x in ps[1:len(s)+1]] for s,ps in zip(inputs,res)] # B x len s
res_list
`
BETTER_ERROR_MODEL = true;
HAS_SUCCEEDED_ONCE = false;
const NEG_INF = Number.POSITIVE_INFINITY;

importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.js");
let pyodide = undefined;

let currentSource = 'wikipedia';
let quadgramFrequency = {};
let defaultQuadgramErrorModel = {};
const source_passages = {}
let passage_user_info_features = {};
let word_feats = {};
let is_initialised = { value: false };

source_paths = {
  'wikipedia': 'https://jameshargreaves12.github.io/reference_data/cleaned_wikipedia_articles.txt',
  'sherlock': 'https://jameshargreaves12.github.io/reference_data/sherlock_holmes.txt'
}

async function setup_pyodide() {
  pyodide = await loadPyodide();
  // Pyodide is now ready to use...

  await pyodide.loadPackage('micropip');
  const micropip = pyodide.pyimport("micropip");
  const [x, lgbm_response, error_model_response] = await Promise.all([
    micropip.install(['lightgbm', 'numpy']),
    fetch('https://jameshargreaves12.github.io/reference_data/lgbm_v2/lgbm_model.txt'),
    fetch('https://jameshargreaves12.github.io/reference_data/error_model_weights.npz')
  ]);
  // await micropip.install('numpy');
  const lgbm_model = await lgbm_response.text();
  await pyodide.FS.writeFile('model.txt', lgbm_model);

  const error_model = await error_model_response.arrayBuffer();
  await pyodide.FS.writeFile('error_model_weights.npz', new Uint8Array(error_model));
  console.log("Model saved to pyodide successfully");
}


const arrFreqAndFileName = [[quadgramFrequency, 'quadgrams_2'], [defaultQuadgramErrorModel, 'quadgram_error_model']];
const get_or_zero = (obj, key) => obj[key] || 0;
const get_features = (passage, user_intro_acc, user_intro_wpm) => {
  const features = {
    "user_intro_acc": user_intro_acc,
    "user_intro_wpm": user_intro_wpm,
  };

  // features["passage_many_to_end_count"] = passage_feats[passage]
  // const passage_user_info = passage_user_info_features[passage]
  // features["passage_median_relative_wpm"] = passage_user_info ? passage_user_info[0] : undefined;
  // features["passage_median_relative_acc"] = passage_user_info ? passage_user_info[1] : undefined;

  const wordScores = passage.split(" ").filter(word => word_feats[word]).map(word => word_feats[word]);
  if (wordScores.length > 0) {
    features["word_zero_to_end_count_max"] = Math.max(...wordScores.map(word_score => word_score[0]));
    features["word_one_to_end_count_max"] = Math.max(...wordScores.map(word_score => word_score[1]));
    features["word_many_to_end_max"] = Math.max(...wordScores.map(word_score => word_score[2]));

    // features["word_zero_to_end_max"] = Math.max(...wordScores.map(word_score => word_score[0]));
    features["word_one_to_end_count_min"] = Math.min(...wordScores.map(word_score => word_score[1]));
    features["word_many_to_end_min"] = Math.min(...wordScores.map(word_score => word_score[2]));

    // features["word_many_to_end_min"] = Math.min(...wordScores);
    features["word_zero_to_end_count_mean"] = wordScores.reduce((acc, word_scores) => acc + word_scores[0], 0) / wordScores.length;
    features["word_one_to_end_count_mean"] = wordScores.reduce((acc, word_scores) => acc + word_scores[1], 0) / wordScores.length;
    features["word_many_to_end_mean"] = wordScores.reduce((acc, word_scores) => acc + word_scores[2], 0) / wordScores.length;
    // features["word_many_to_end_count_positive"] = wordScores.filter(score => score > 0).length;
    // features["word_many_to_end_count_negative"] = wordScores.filter(score => score < 0).length;
  } else {
    features["word_zero_to_end_count_max"] = undefined;
    features["word_one_to_end_count_max"] = undefined;
    features["word_many_to_end_max"] = undefined;
    features["word_one_to_end_count_min"] = undefined;
    features["word_many_to_end_min"] = undefined;
    features["word_zero_to_end_count_mean"] = undefined;
    features["word_one_to_end_count_mean"] = undefined;
    features["word_many_to_end_mean"] = undefined;
    // features["word_many_to_end_count_positive"] = undefined;
    // features["word_many_to_end_count_negative"] = undefined;
  }
  // Count letters
  const letterCounts = passage.split("").reduce((acc, letter) => {
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {});
  features["apostrophe_len"] = letterCounts["'"] || 0;
  features["comma_len"] = letterCounts[","] || 0;
  features["period_len"] = letterCounts["."] || 0;
  features["exclamation_mark_len"] = letterCounts["!"] || 0;
  features["passage_len"] = passage.length;

  features["punc_len"] = "()\"',.?!-:".split("").reduce((acc, letter) => acc + get_or_zero(letterCounts, letter), 0);
  features["caps_len"] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reduce((acc, letter) => acc + get_or_zero(letterCounts, letter), 0);
  features["numbers_len"] = "0123456789".split("").reduce((acc, letter) => acc + get_or_zero(letterCounts, letter), 0);

  return features;
}

const call_lgbm = async (passages, user_intro_acc, user_intro_wpm) => {
  const data = passages.map(passage => (
    get_features(passage, user_intro_acc, user_intro_wpm)
  ));
  // console.log(data);
  // Save the model text to the Pyodide file system
  console.log("feats", data[0]);
  pyodide.FS.writeFile('input.json', JSON.stringify(data));

  // Load the model from the file system
  const res = await pyodide.runPythonAsync(lgbm_inference_script);
  const result = res.toJs();
  return result;
}

// It is slow so for now only do a single passage at a time
const call_cnn_error_model = async (passage) => {
  pyodide.FS.writeFile('input_2.json', JSON.stringify([passage]));
  const start_cnn = performance.now();
  const res_cnn = await pyodide.runPythonAsync(error_cnn_inference_script);
  const result_cnn = res_cnn.toJs();
  const end_cnn = performance.now();
  const durationSec = (end_cnn - start_cnn) / 1000;
  console.log('CNN call took', durationSec.toFixed(3), 'seconds'); // seconds
  return result_cnn[0];
}

let ERROR_SCORE_CACHE_KEY = 'na'
let ERROR_SCORE_CACHE = []

const error_scores_cached = async (passage) => {
  if (ERROR_SCORE_CACHE_KEY == passage) {
    return ERROR_SCORE_CACHE;
  }
  ERROR_SCORE_CACHE_KEY = passage;
  ERROR_SCORE_CACHE = await call_cnn_error_model(passage);
  return ERROR_SCORE_CACHE;
}

const cartesianProduct = (a, b) => {
  return [].concat(...a.map(x => b.map(y => [x, y])));
}


const UNIGRAM_STD = {
  'm': 0.035250909191469115,
  'f': 0.03695542239285691,
  '?': 0.0936364685537428,
  'L': 0.07772211558675739,
  ')': 0.10977908932471044,
  'C': 0.07377953466245117,
  'l': 0.03021346633635183,
  'B': 0.06640424235737112,
  ';': 0.20817240351506988,
  'u': 0.038937114367984554,
  'Y': 0.16595312797438103,
  'n': 0.030484792139803818,
  '3': 0.06884811761995714,
  'E': 0.07729793358206127,
  'p': 0.03842193678749636,
  '9': 0.06462195791539867,
  'M': 0.063368768821528,
  'z': 0.0964913325198731,
  '4': 0.0805880804677427,
  'o': 0.03434061090166928,
  'O': 0.07723182439532356,
  'v': 0.058299615501815706,
  'b': 0.042218762041903606,
  '7': 0.08912325313725529,
  'a': 0.02702475055506549,
  '1': 0.04150421558012398,
  'D': 0.0699996699233979,
  '.': 0.09815703580521853,
  'e': 0.028127670146057153,
  'y': 0.0493668759421138,
  '"': 0.13915426821811414,
  'G': 0.0821046817438331,
  'W': 0.13702040110284322,
  'K': 0.08773764653996162,
  'X': 0.07203267889076902,
  '-': 0.12501072683212905,
  '2': 0.052224500876861424,
  'r': 0.034731680713281664,
  'N': 0.06871926110003576,
  'F': 0.07379872463607537,
  "'": 0.17001506148419257,
  'Q': 0.08579187525673862,
  'd': 0.03948711024960669,
  '5': 0.07175866045059018,
  'R': 0.08427430182569198,
  'H': 0.06435035895869423,
  's': 0.031318665799798806,
  'T': 0.0644400469326798,
  '0': 0.05847984327960287,
  'q': 0.06708271250979798,
  'x': 0.08876097515696056,
  'g': 0.04089215210121809,
  'j': 0.09662766774549124,
  '(': 0.08230213031788058,
  'I': 0.06537827525363547,
  'k': 0.05171203746242511,
  'i': 0.03278154954078478,
  'c': 0.03641026236032212,
  'P': 0.07768482941035788,
  ',': 0.12739553771065584,
  ' ': 0.02123139512120665,
  'h': 0.030405706780887293,
  'V': 0.09692033026314154,
  '6': 0.1043364311329082,
  'w': 0.040539342694805074,
  'U': 0.06468621228143943,
  't': 0.030104127538495326,
  'A': 0.06268830214753172,
  'Z': 0.09212544383812245,
  ':': 0.15782421497473512,
  '!': 0.20698825363136056,
  '%': 0.08984992257545195,
  'S': 0.07299977706942225,
  '8': 0.07942753154417806,
  'J': 0.09051758104455739
}

const UNIGRAM_MEAN_ERROR_RATE = {
  ' ': 0.04494756056197226,
  '0': 0.06949357711973116,
  'e': 0.07121088290787903,
  'a': 0.07240791486176659,
  'h': 0.07250551909598359,
  '1': 0.07251969869666484,
  'l': 0.07610229636211416,
  't': 0.0764293706619892,
  'n': 0.07662865081890807,
  's': 0.08128601074074474,
  'm': 0.08154831691285441,
  '9': 0.08201504298323402,
  '2': 0.08227111987983293,
  'o': 0.08310732154609433,
  'f': 0.08390191857095694,
  'r': 0.08431221265661083,
  'i': 0.08458058869682056,
  'p': 0.0858016881822663,
  'w': 0.08882508276787156,
  'c': 0.0914569706287151,
  'b': 0.09192249691673522,
  '7': 0.09252556686849553,
  'u': 0.09283717236612894,
  'd': 0.09318718800765248,
  '5': 0.09605206513206209,
  'g': 0.09753288630724552,
  '4': 0.09895124315258705,
  'k': 0.10059635653086178,
  '8': 0.10178416013925153,
  '3': 0.10332686413625614,
  '6': 0.10434379859066398,
  'y': 0.1044824949769741,
  'q': 0.1103108800766673,
  'H': 0.11701539865952387,
  'v': 0.1198491610847135,
  'U': 0.1204879523676621,
  'N': 0.12067344536354514,
  'M': 0.12312228655675034,
  'F': 0.12397431436434378,
  'A': 0.12437056446290508,
  'B': 0.12523831163065222,
  'D': 0.12688199203663944,
  '(': 0.12841006243685069,
  'C': 0.12872282364645007,
  'I': 0.1290493611155294,
  '%': 0.12988333038713099,
  'R': 0.1303762741351494,
  'T': 0.13062808856883526,
  'G': 0.13857991959947716,
  'X': 0.13969120191667775,
  'P': 0.14006869095259705,
  'O': 0.14050050237166156,
  'L': 0.1406750717581659,
  'E': 0.14087242146708892,
  'S': 0.1415333394440617,
  'Q': 0.14227272727272727,
  'j': 0.14889501250068435,
  'x': 0.14932922200765367,
  'V': 0.14954651316910608,
  'K': 0.15156585474198564,
  '!': 0.1575880415505447,
  'Z': 0.15959913864502237,
  '?': 0.1610873960907661,
  'J': 0.16177686184366968,
  'z': 0.17351851338489543,
  ')': 0.1845214166223594,
  '.': 0.20406353413867082,
  '"': 0.2269214895710975,
  'W': 0.241879435892709,
  ',': 0.2594410613134759,
  '-': 0.26148812587309755,
  'Y': 0.2768391198569835,
  ':': 0.2976530921988082,
  "'": 0.30947778643803586,
  ';': 0.3569477154969383,
  '_': 0.3695652173913043
};

const LETTER_SPEED_STD = {
  "h": 0.08527910052546951,
  "e": 0.09341712766378299,
  "n": 0.1005098583243086,
  "a": 0.10113049620128993,
  " ": 0.10179156532873941,
  "l": 0.10257678569991069,
  "s": 0.107387680553308,
  "o": 0.10853041234318929,
  "r": 0.10943969813584854,
  "i": 0.11195010893323416,
  "k": 0.1153050021105183,
  "d": 0.11818166955884758,
  "B": 0.11882183647359865,
  "u": 0.12009248106637008,
  "m": 0.12064728029136529,
  "y": 0.12336068498563145,
  "0": 0.12826696859391173,
  "f": 0.13034132671432883,
  "g": 0.13272920920662315,
  "5": 0.13393690053870044,
  "t": 0.13429044369935214,
  "P": 0.1363679700007288,
  "x": 0.14224431134265747,
  "v": 0.14299703324992194,
  "c": 0.143060220536856,
  "M": 0.1444421048825252,
  "9": 0.14453224541137455,
  "p": 0.1493027745756534,
  "I": 0.1551280498184238,
  "w": 0.15719668693184688,
  "H": 0.1578966286403463,
  "W": 0.16433684837835733,
  "1": 0.17065633842332703,
  "b": 0.17076630617286606,
  "%": 0.17849981315216754,
  "'": 0.1815263255355476,
  '"': 0.18332252315609673,
  ")": 0.18528758300952888,
  "F": 0.19006271371835046,
  "T": 0.19083854298213374,
  "-": 0.1931523409343729,
  "A": 0.1931904142110019,
  ",": 0.196862083857489,
  ".": 0.20046723233648747,
  "2": 0.20138000938311118,
  "(": 0.20333070054177463,
  "S": 0.22465418827791378,
  "C": 0.22762325373937833,
  "j": 0.12264072603579045,
  "4": 0.155754492470085,
  "D": 0.17303295919297804,
  "z": 0.12264072603579045,
  "E": 0.17303295919297804,
  "q": 0.12264072603579045,
  ";": 0.1903060753154331,
  "6": 0.155754492470085,
  "L": 0.17303295919297804,
  "R": 0.17303295919297804,
  "V": 0.17303295919297804,
  "G": 0.17303295919297804,
  "Y": 0.17303295919297804,
  "8": 0.155754492470085,
  "J": 0.17303295919297804,
  "N": 0.17303295919297804,
  "O": 0.17303295919297804,
  "7": 0.155754492470085,
  "3": 0.155754492470085,
  "U": 0.17303295919297804,
  "K": 0.17303295919297804,
  ":": 0.1903060753154331,
  "Q": 0.17303295919297804,
  "Z": 0.17303295919297804,
  "?": 0.1903060753154331,
  "X": 0.17303295919297804,
  "!": 0.1903060753154331,
}

const LETTER_SPEED_MEAN = {
  "e": 0.2511311646984058,
  "h": 0.25939754671160303,
  "n": 0.2691648401564615,
  "a": 0.2786946399749476,
  " ": 0.27985219578414333,
  "o": 0.28486122932431457,
  "r": 0.2924755282090619,
  "i": 0.29851610915203824,
  "l": 0.3039834515914638,
  "s": 0.30885313751853116,
  "u": 0.3178507222215826,
  "k": 0.32126980995592386,
  "0": 0.3220502633421425,
  "m": 0.33036058760485904,
  "d": 0.33726824468863814,
  "t": 0.34041939372123814,
  "g": 0.35548836789223437,
  "y": 0.3602838520615609,
  "f": 0.3646398947657114,
  "c": 0.381477849205429,
  "v": 0.3879135052710464,
  "p": 0.3901701129428811,
  "w": 0.4054751287244022,
  "j": 0.4418349878305432,
  "b": 0.44520980409843963,
  "x": 0.44825493512483783,
  "9": 0.522965520255203,
  "z": 0.5283738271298044,
  "q": 0.5373574078768408,
  "7": 0.561667857475688,
  "8": 0.5635226537216692,
  ",": 0.5648866505840043,
  "P": 0.568031105358122,
  "M": 0.5710681860008521,
  "1": 0.5777886164194658,
  "2": 0.5793671111744868,
  "N": 0.5888517546861324,
  "L": 0.5901164386101535,
  "O": 0.5916425742574241,
  "I": 0.593990937430794,
  ".": 0.5991289477999734,
  "A": 0.6099093368428643,
  "5": 0.622882510277865,
  "S": 0.6245810770477099,
  "U": 0.6256289876648216,
  "4": 0.6305142499403701,
  "K": 0.6307633587786262,
  "3": 0.6413713734206828,
  "6": 0.6438038557725649,
  "H": 0.6439057239057242,
  "T": 0.6443014923335902,
  "C": 0.644380148650229,
  "-": 0.6500483305294895,
  "B": 0.6507231328730325,
  "R": 0.6527978519098087,
  "D": 0.6539747195658596,
  "J": 0.6596191110883272,
  "E": 0.6629458874973244,
  "Y": 0.6708200258955554,
  "F": 0.6724143670138454,
  "V": 0.6835295197869788,
  "—": 0.6839999999999999,
  "G": 0.6922065745520801,
  "'": 0.699440891023178,
  "W": 0.714028908794785,
  "X": 0.7323891371605381,
  "_": 0.7583561643835611,
  "?": 0.7776311844077965,
  "!": 0.7856172653184423,
  "Q": 0.790721558211598,
  "Z": 0.7954545454545463,
  ")": 0.8142289128935858,
  "(": 0.8170971355123008,
  ":": 0.818851181102361,
  ";": 0.8345761245674757,
  '"': 0.8377289103073918,
  "%": 0.8674524714828853,
}
const LETTER_CHANGABILITY_PER_OCCURENCE_M = {
  "a": 14.187655656326152,
  "_": 12.896929499116526,
  "h": 11.294291474951597,
  "k": 11.070603703578605,
  "i": 10.282764308231432,
  "y": 8.73580026798989,
  "r": 8.51327843090219,
  "d": 8.132273264436389,
  "c": 8.026167568307926,
  "g": 8.008112807394049,
  "m": 7.672499090271686,
  "u": 7.563671367357598,
  "p": 7.523416260847157,
  "e": 7.427616718359616,
  "n": 6.114238758868869,
  "0": 6.037148912826794,
  "s": 5.670450981676915,
  "I": 5.590108274038296,
  "t": 5.473873231279184,
  "x": 4.374710674767829,
  "N": 4.353742955811747,
  "l": 4.086146421496499,
  "b": 4.047483266151356,
  "1": 3.9818381258255457,
  "P": 3.586031142426755,
  ".": 3.440055833743398,
  "o": 3.1066183351815257,
  "5": 2.9581210154513924,
  "q": 2.7560315737639116,
  "w": 2.6220690313311468,
  "f": 2.6106604391310406,
  "M": 2.5791374183101907,
  "7": 2.5312021347269384,
  "v": 2.487126313248461,
  "-": 2.217285306528848,
  "9": 2.1110024387885424,
  " ": 0.948298037039152,
  "'": 0.948298037039152,
  ")": 0.948298037039152,
  "(": 0.948298037039152,
  "W": 0.948298037039152,
  "G": 0.948298037039152,
  '"': 0.948298037039152,
  ":": 0.948298037039152,
  "K": 0.948298037039152,
  "V": 0.948298037039152,
  "Y": 0.948298037039152,
  ";": 0.948298037039152,
  "Z": 0.948298037039152,
  "Q": 0.948298037039152,
  "?": 0.948298037039152,
  "X": 0.948298037039152,
  "!": 0.948298037039152,
  "R": 0.874554746523508,
  "2": 0.5947661651227405,
  "O": 0.08579012959424064,
  ",": 0,
  "T": 0,
  "S": 0,
  "C": 0,
  "A": 0,
  "B": 0,
  "H": 0,
  "D": 0,
  "F": 0,
  "L": 0,
  "8": 0,
  "U": 0,
  "3": 0,
  "E": 0,
  "J": 0,
  "6": 0,
  "4": 0,
  "z": 0,
  "j": 0,
}

const LETTER_CHANGABILITY_PER_OCCURENCE_C = {
  "6": -6.981085309964023,
  "O": -7.2517694732155595,
  "J": -7.541887398673,
  "4": -7.574360153005463,
  "L": -7.687053972904508,
  "8": -7.695565975684325,
  "F": -7.709638135693311,
  "R": -7.80331651968226,
  "2": -7.809103964625912,
  "j": -7.814548737844509,
  "D": -7.829295924419092,
  "E": -7.878338365542895,
  "B": -7.901553199507989,
  "z": -7.983958911193294,
  "U": -8.110350046433952,
  "H": -8.130365027833145,
  "7": -8.257597237279871,
  "3": -8.286423570189656,
  "A": -8.421090155136227,
  " ": -8.543062640397748,
  "'": -8.543062640397748,
  ")": -8.543062640397748,
  "(": -8.543062640397748,
  "W": -8.543062640397748,
  "G": -8.543062640397748,
  '"': -8.543062640397748,
  ":": -8.543062640397748,
  "K": -8.543062640397748,
  "V": -8.543062640397748,
  "Y": -8.543062640397748,
  ";": -8.543062640397748,
  "Z": -8.543062640397748,
  "Q": -8.543062640397748,
  "?": -8.543062640397748,
  "X": -8.543062640397748,
  "!": -8.543062640397748,
  "C": -8.590210143402503,
  "-": -8.63963521379376,
  "S": -8.758116825564938,
  "9": -9.154132328261422,
  "5": -9.211166565669885,
  "q": -9.226678109366174,
  "M": -9.408886550739473,
  "P": -9.418229352993976,
  "T": -9.454370429016015,
  "1": -9.602946051903455,
  "x": -10.146774161448343,
  "N": -10.314598878749198,
  ",": -10.447946371919187,
  "0": -10.953793214722593,
  "v": -11.247338515712523,
  ".": -11.527262548208508,
  "I": -11.566057127651442,
  "b": -11.798981606736888,
  "w": -12.009448816585966,
  "f": -12.124063410382329,
  "k": -13.068970020909534,
  "l": -13.28796528364296,
  "p": -13.446397984814311,
  "u": -13.571311850164117,
  "y": -13.585920518209932,
  "m": -13.63731249546063,
  "g": -13.705078650085795,
  "t": -14.089627100908753,
  "d": -14.130204415720145,
  "s": -14.198541987403235,
  "o": -14.21881925391331,
  "h": -14.333290450213328,
  "n": -14.48669659369837,
  "c": -14.505990436215606,
  "i": -14.982290383316432,
  "r": -15.03945828923975,
  "e": -15.340101052305787,
  "_": -16.148018304213107,
  "a": -16.460183896956682,
}

const ERROR_GAP_CHANGE_PER_OCCURENCE_M = {
  ' ': 0.0,
  '!': 0.02762150578200817,
  '"': 0.027355128899216652,
  "'": 0.055554391531762906,
  '(': 0.027185166254639626,
  ')': 0.027185147628188133,
  ',': 0.016433069550742967,
  '-': 0.014485814568948313,
  '.': 0.023937829776400736,
  '0': 0.005579594958258943,
  '1': 0.10018995522406005,
  '2': 0.02679714560508728,
  '3': 0.027354758232831955,
  '4': 0.024193571996383393,
  '5': 0.08645739397932142,
  '6': 0.01774990482101928,
  '7': 0.02737768553197384,
  '8': 0.027311546728014946,
  '9': 0.02704494073987007,
  ':': 0.027410345152020454,
  ';': 0.04056618851327079,
  '?': 0.027602950111031532,
  'A': 0.026819221675395966,
  'B': 0.027140239253640175,
  'C': 0.026777926832437515,
  'D': 0.027234775945544243,
  'E': 0.027354978024959564,
  'F': 0.027283087372779846,
  'G': 0.02733825333416462,
  'H': 0.027158627286553383,
  'I': 0.026940179988741875,
  'J': 0.027356062084436417,
  'K': 0.027440812438726425,
  'L': 0.027297671884298325,
  'M': 0.027053935453295708,
  'N': 0.027280643582344055,
  'O': 0.027361901476979256,
  'P': 0.027077266946434975,
  'Q': 0.02760164812207222,
  'R': 0.02725893445312977,
  'S': 0.026673227548599243,
  'T': 0.026453644037246704,
  'U': 0.027339164167642593,
  'V': 0.027492262423038483,
  'W': 0.027285553514957428,
  'X': 0.027606802061200142,
  'Y': 0.027551842853426933,
  'Z': 0.0275961272418499,
  'a': 0.015028034890447444,
  'b': 0.011837444226316413,
  'c': 0.020957814129645664,
  'd': 0.018110590142249958,
  'e': 0.009919670916302336,
  'f': 0.018068605367603713,
  'g': 0.02566453822759248,
  'h': 0.02099126723335691,
  'i': 0.012581232234952947,
  'j': 0.017488199334519845,
  'k': 0.02768675279763049,
  'l': 0.019191089520825495,
  'm': 0.01828165655097792,
  'n': 0.015869987925016753,
  'o': 0.01198687726776839,
  'p': 0.014960567962165803,
  'q': 0.0582313095481994,
  'r': 0.012117847795492426,
  's': 0.007636535049323982,
  't': 0.01424464841158235,
  'u': 0.015958946592541615,
  'v': 0.02471880919039897,
  'w': 0.022315728346128362,
  'x': 0.06938012358824568,
  'y': 0.020388198293396893,
  'z': 0.0225620099240695
}

const LETTER_FREQUENCY = {
  "A": 0.003153352805124311,
  "n": 0.055725109439303484,
  "a": 0.06574879237610978,
  "r": 0.04895343918863251,
  "c": 0.02368663480872584,
  "h": 0.03440809510193862,
  "i": 0.05736555569780318,
  "s": 0.05098628684359351,
  "t": 0.06283249477699976,
  " ": 0.16126223748404583,
  "v": 0.00792397035237102,
  "e": 0.09536583341888472,
  "f": 0.015292696431959359,
  "d": 0.030829563440896025,
  "u": 0.020792086046599403,
  "g": 0.013797676968572934,
  "o": 0.0567961830999978,
  "l": 0.03205162970570526,
  "y": 0.01153414941517434,
  ".": 0.010558070614780313,
  "2": 0.0032394917857312498,
  "0": 0.003898399323498048,
  "m": 0.017988761235399744,
  "k": 0.005075728496221641,
  "w": 0.011476864805862281,
  "p": 0.015483219067633279,
  "b": 0.01152292290241313,
  ",": 0.00878202900526206,
  "T": 0.004579806176913074,
  "j": 0.0007302944339057933,
  "9": 0.0022726125692146813,
  "4": 0.0009719173180840281,
  "D": 0.0015318912844709844,
  "z": 0.0007556475358099878,
  "W": 0.0013337568162347675,
  "E": 0.001062871629027983,
  "I": 0.002681382154161148,
  "x": 0.0012442623801334335,
  "S": 0.003723010665829977,
  "H": 0.0018290195012505923,
  "C": 0.0033144800536579863,
  "(": 0.0017254667539418384,
  ")": 0.001725539082263411,
  "q": 0.0009409735262355593,
  ";": 0.00013218839775919848,
  "-": 0.0016721602023162718,
  "6": 0.0009902592018082627,
  "M": 0.0022375125026953655,
  "5": 0.0010397612837191113,
  "1": 0.004230895510900077,
  "L": 0.0012864755031094834,
  "R": 0.0014376283867850131,
  "F": 0.0013433822692696467,
  "V": 0.000527198242809697,
  "G": 0.0011281308697633483,
  "B": 0.001900767460370877,
  "Y": 0.00029471823710480933,
  '"': 0.0010622791154176604,
  "'": 0.0017780592803768405,
  "8": 0.0012323368864725459,
  "J": 0.0010586430260355636,
  "N": 0.0013529180351857762,
  "O": 0.0010358590261136272,
  "7": 0.000974268856474996,
  "3": 0.0010637262604756847,
  "U": 0.0011245786812342758,
  "P": 0.0021464748695249588,
  "K": 0.0007279492604071239,
  ":": 0.0008468361905158379,
  "Q": 0.00010038303094415696,
  "Z": 0.00012192356236161744,
  "?": 9.530037513060838e-05,
  "X": 8.027517892040621e-05,
  "!": 2.290377562246053e-05,
}

const LOGICAL_GROUP_MEAN_RATE = {
  // 'letter': 0.04710802768380675,
  'most_common': 0.041260398079809635,
  'punc': 0.18711053231320202,
  'caps': 0.12161804263744862,
  'rare_letters': 0.08231099677630574,
  'home_row': 0.04576929812980636,
  'top_row': 0.044401965838177605,
  'bottom_row': 0.04979522680487063,
  'pinky': 0.04140048798184624,
  'ring_pinky': 0.04523392537996314,
  'left_hand': 0.04445073592632017,
  'right_hand': 0.04647772721288048,
  'numbers': 0.05386455286782549,
  'difficult_to_reach_letters': 0.04875121193663178,
  'repeat_bigrams': 0.035775673887106986,
  'left_hand_only_bigrams': 0.0418817932429474,
  'right_hand_only_bigrams': 0.04383438368975369,
  'alternate_hand_bigrams': 0.04448195838451243,
  'same_finger_bigrams': 0.04623873648631485,
}

const LOGICAL_GROUP_STD = {
  'most_common': 0.01639303445611817,
  'punc': 0.08841770875084964,
  'caps': 0.09519842977687655,
  'rare_letters': 0.06217410797883992,
  'home_row': 0.020966102046362713,
  'top_row': 0.019219644905343614,
  'bottom_row': 0.029682578382485014,
  'pinky': 0.01902749693676818,
  'ring_pinky': 0.018667357320133776,
  'left_hand': 0.019154535514629794,
  'right_hand': 0.02125073258228291,
  'numbers': 0.07048656739530676,
  'difficult_to_reach_letters': 0.02334849840266474,
  'repeat_bigrams': 0.041210852946057,
  'left_hand_only_bigrams': 0.048671588269197506,
  'right_hand_only_bigrams': 0.04564314158407204,
  'alternate_hand_bigrams': 0.05088463529526922,
  'same_finger_bigrams': 0.0464073391172582,
}

const LOGICAL_GROUP_FREQUENCY = {
  'most_common': 0.49377369484,
  'punc': 0.02689224985046569,
  'caps': 0.031072374604802187,
  // 'lower':                      0.7750833119712894,
  'rare_letters': 0.01589677860377681,
  'home_row': 0.20841835426813637,
  'top_row': 0.3909493292318209,
  'bottom_row': 0.12504486029223277,
  'pinky': 0.08613517901392806,
  'ring_pinky': 0.24499017345979662,
  'left_hand': 0.44476459027599763,
  'right_hand': 0.31931299666752117,
  'numbers': 0.010400751943945998,
  'difficult_to_reach_letters': 0.09004870546013842,
  'repeat_bigrams': 0.014840092600531596,
  'left_hand_only_bigrams': 0.1825327960216068,
  'right_hand_only_bigrams': 0.10707365171911172,
  'alternate_hand_bigrams': 0.31248906799279774,
  'same_finger_bigrams': 0.045806396295978734
}

const LOWER_CASE_LETTERS = "abcdefghijklmnopqrstuvwxyz".split('');
const LOGICAL_LETTER_GROUPINGS = {
  most_common: "etaoinsr".split(''),
  punc: "(%!).?\",-:\\';_£'".split(''),
  caps: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''),
  rare_letters: "zxjqkv".split(''),
  home_row: "asdfjkl".split(''),
  top_row: "qwertyuiop".split(''),
  bottom_row: "zxcvbnm".split(''),
  pinky: "qazp".split(''),
  ring_pinky: "qazpwsxol".split(''),
  left_hand: "qwertasdfgzxcv".split(''),
  right_hand: "yuiophjklnm".split(''),
  numbers: "1234567890".split(''),
  difficult_to_reach_letters: "ytbz".split('')
}

const LOGICAL_BIGRAM_GROUPINGS = {
  repeat_bigrams: LOWER_CASE_LETTERS.map((x, i) => `${x}${LOWER_CASE_LETTERS[i]}`),

  left_hand_only_bigrams: cartesianProduct(LOGICAL_LETTER_GROUPINGS.left_hand, LOGICAL_LETTER_GROUPINGS.left_hand)
    .map(([x, y]) => `${x}${y}`),

  right_hand_only_bigrams: cartesianProduct(LOGICAL_LETTER_GROUPINGS.right_hand, LOGICAL_LETTER_GROUPINGS.right_hand)
    .map(([x, y]) => `${x}${y}`),

  alternate_hand_bigrams: [
    ...cartesianProduct(LOGICAL_LETTER_GROUPINGS.left_hand, LOGICAL_LETTER_GROUPINGS.right_hand),
    ...cartesianProduct(LOGICAL_LETTER_GROUPINGS.right_hand, LOGICAL_LETTER_GROUPINGS.left_hand)
  ].map(([x, y]) => `${x}${y}`)
};

const finger_keys = ["qaz", "wsx", "edc", "rfvtg", "yhnujm", "ujm", "ik", "ol", "p"].map(x => x.split(''));


LOGICAL_BIGRAM_GROUPINGS.same_finger_bigrams = finger_keys.flatMap(fks =>
  cartesianProduct(fks, fks)
    .map(([x, y]) => `${x}${y}`)
    .filter(bigram => !LOGICAL_BIGRAM_GROUPINGS.repeat_bigrams.includes(bigram))
);

const getBestGuessTimeToTypeLetter = (speedLog) => {
  const timeToTypeLetter = {}
  for (let letter in speedLog['char']) {
    const priorStd = LETTER_SPEED_STD[letter];
    const priorMean = LETTER_SPEED_MEAN[letter];
    const priorVar = priorStd ** 2;

    const speeds = speedLog["char"][letter] || [];
    const N = speeds.length;
    if (N == 0) {
      timeToTypeLetter[letter] = priorMean;
    }
    else {
      const sampleMeanTimesN = speeds.reduce((a, b) => a + b, 0);
      const posteriorVar = 1 / (1 / priorVar + N / priorVar);
      const posteriorMean = posteriorVar * (priorMean / priorVar + sampleMeanTimesN / priorVar);
      timeToTypeLetter[letter] = posteriorMean;
    }
  }
  return timeToTypeLetter;
}

const computeSpeedChangePerRepEstimate = (timeToTypeLetter) => {
  const typeSpeedChangePerRep = {}
  for (let letter in timeToTypeLetter) {
    const tttLetter = timeToTypeLetter[letter];
    const changabilityPerOccurence = -Math.exp((LETTER_CHANGABILITY_PER_OCCURENCE_M[letter] * tttLetter + LETTER_CHANGABILITY_PER_OCCURENCE_C[letter]));
    typeSpeedChangePerRep[letter] = changabilityPerOccurence;
  }
  return typeSpeedChangePerRep;
}

const computeValuePerRepEstimateSpeed = (speedLog) => {
  const timeToTypeLetter = getBestGuessTimeToTypeLetter(speedLog);
  const typeSpeedChangePerRep = computeSpeedChangePerRepEstimate(timeToTypeLetter);

  const valuePerRep = {}
  for (let letter in typeSpeedChangePerRep) {
    const tscpr = typeSpeedChangePerRep[letter];
    const freq = LETTER_FREQUENCY[letter];
    const timePerLetter = timeToTypeLetter[letter];
    const val = - (timePerLetter * tscpr * freq);  // negative so that the values is positive (tspcr is reduction in time)
    valuePerRep[letter] = Math.min(val, 0.0000005);
  }
  return valuePerRep;
}

const computeValuePerRepEstimateError = (charErrorLog, charSeenLog) => {
  const errorRateLetter = findUnigramErrorRates(charErrorLog, charSeenLog);
  const valuePerRep = {}
  for (let letter in errorRateLetter) {
    const errorRate = errorRateLetter[letter];
    const freq = LETTER_FREQUENCY[letter];
    const val = freq * (errorRate - (errorRate / (1 + errorRate * ERROR_GAP_CHANGE_PER_OCCURENCE_M[letter])));
    valuePerRep[letter] = val;
  }
  return valuePerRep;
}


const getLetterErrorSuggestionFromErrorLog = (charErrorLog, charSeenLog, previousRepSelectionStrategies) => {
  const errorSelectionStrategies = previousRepSelectionStrategies.filter(strategy => strategy && strategy.startsWith("letter-error")).map(strategy => strategy.split("->")[1]);

  const valuePerRep = computeValuePerRepEstimateError(charErrorLog, charSeenLog);
  const wasLastNumber = errorSelectionStrategies.length == 0 ? false : isStringNumber(errorSelectionStrategies[0]);
  const top12 = Object.entries(valuePerRep).filter(([letter, value]) => !errorSelectionStrategies.slice(0, 7).includes(letter) && !(wasLastNumber && isStringNumber(letter)) && letter != " ").sort((a, b) => b[1] - a[1]).slice(0, 12);
  console.log("top12", top12);
  const totalValue = top12.reduce((a, b) => a + b[1], 0);
  const loc = Math.random() * totalValue;
  let cumSum = 0;
  for (let [letter, value] of top12) {
    cumSum += value;
    if (cumSum > loc) {
      return letter;
    }
  }
  return 'e';
}

const isStringNumber = (str) => {
  return !isNaN(parseInt(str));
}

const getLetterSpeedSuggestionFromSpeedLog = (speedLog, previousRepSelectionStrategies) => {
  const speedSelectionStrategies = previousRepSelectionStrategies.filter(strategy => strategy && strategy.startsWith("letter-speed")).map(strategy => strategy.split("->")[1]);

  const valuePerRep = computeValuePerRepEstimateSpeed(speedLog);
  const wasLastNumber = speedSelectionStrategies.length == 0 ? false : isStringNumber(speedSelectionStrategies[0]);
  const top12 = Object.entries(valuePerRep).filter(([letter, value]) => !speedSelectionStrategies.includes(letter) && !(wasLastNumber && isStringNumber(letter)) && letter != " ").sort((a, b) => b[1] - a[1]).slice(0, 12);
  console.log("top12", top12);
  const totalValue = top12.reduce((a, b) => a + b[1], 0);
  const loc = Math.random() * totalValue;
  let cumSum = 0;
  for (let [letter, value] of top12) {
    cumSum += value;
    if (cumSum > loc) {
      return letter;
    }
  }
  return 'e';
}

const suggestErrorGroupStrategyFromInterstingErrors = (interestingErrorLog, seenLog, previousRepSelectionStrategies) => {
  // TODO defining this based on what it isn't sucks - just do the work to prefix it.
  const previousErrorGroupStrategies = previousRepSelectionStrategies.filter(strategy => strategy && !strategy.startsWith("letter-error") && !strategy.startsWith("letter-speed"));
  const charErrorLog = interestingErrorLog['char'];
  const bigramErrorLog = interestingErrorLog['bigram'];
  const charSeenLog = seenLog['char'];
  const bigramSeenLog = seenLog['bigram'];

  const groupErrorCount = {};
  const groupSeenCount = {};

  for (let group in LOGICAL_LETTER_GROUPINGS) {
    const groupChars = LOGICAL_LETTER_GROUPINGS[group];
    for (let char of groupChars) {
      groupErrorCount[group] = (groupErrorCount[group] || 0) + (charErrorLog[char] || 0);
      groupSeenCount[group] = (groupSeenCount[group] || 0) + (charSeenLog[char] || 0);
    }
  }
  for (let group in LOGICAL_BIGRAM_GROUPINGS) {
    const groupBigrams = LOGICAL_BIGRAM_GROUPINGS[group];
    for (let bigram of groupBigrams) {
      groupErrorCount[group] = (groupErrorCount[group] || 0) + (bigramErrorLog[bigram] || 0);
      groupSeenCount[group] = (groupSeenCount[group] || 0) + (bigramSeenLog[bigram] || 0);
    }
  }

  let maxCost = 0;
  let maxCostGroup = null;
  let previousSelectedStrategy = previousErrorGroupStrategies ? previousErrorGroupStrategies[0] : null;
  let tmp = []
  for (let group in groupErrorCount) {
    const errorCount = groupErrorCount[group] || 0;
    const seenCount = groupSeenCount[group] || 0;
    const meanRate = LOGICAL_GROUP_MEAN_RATE[group];
    const std = LOGICAL_GROUP_STD[group];
    const errorRate = findMAP(meanRate, std, errorCount, seenCount);
    const cost = errorRate * LOGICAL_GROUP_FREQUENCY[group];
    tmp.push([cost, group, LOGICAL_GROUP_FREQUENCY[group], errorRate]);
    // console.log(group, errorRate, cost);
    if (cost > maxCost && group != previousSelectedStrategy) {
      maxCost = cost;
      maxCostGroup = group;
    }
  }
  // Fallback just in case.
  if (maxCostGroup == null) {
    maxCostGroup = previousSelectedStrategy;
  }
  return maxCostGroup || "error-group";
}


function findMAP(base_model_mean, base_model_std, numPos, total, tol = 1e-10, maxIter = 30, verbose = false) {
  if (total == 0) {
    return base_model_mean;
  }

  const kink = 0.01;
  const totNeg = total - numPos;
  // start at ML (clamped into (0,1))
  let factor = 1;
  let e = base_model_mean;
  let hasCrossedKink = false;
  for (let i = 0; i < maxIter; i++) {
    // gradient of log-prior
    // Prior is a gaussian above the kink and then a sqrt decay to 0 bellow it
    const dPrior = e < kink
      ? (e === 0 ? Infinity : 0.5 / e)
      : -((e - base_model_mean) / base_model_std);

    // second deriv of log-prior
    const d2Prior = e < kink
      ? -1 / e / e
      : -1 / base_model_std;
    // gradient & Hessian of log-likelihood
    const dLik = numPos / e - totNeg / (1 - e);
    const d2Lik = -numPos / (e * e) - totNeg / ((1 - e) * (1 - e));
    // Newton step on -(prior+lik)
    const g = -(dPrior + dLik);
    const h = -(d2Prior + d2Lik);
    let step = g / h * factor;
    while (e < kink && e - step / 2 > kink && Math.abs(step) > tol) {
      factor *= 0.5;
      step = g / h * factor;
    }
    if (e < kink) {
      hasCrossedKink = true;
    } else if (e > kink && e - step < kink && hasCrossedKink) {
      // Indicates that this is the second time crossing the king, so put it very close to the kink so that the step size gets pushed down for the next step if it wants to cross back
      e = kink - tol / 2;
      continue;
    }
    if (verbose) {
      console.log(i, step, e);
    }
    e -= step;

    if (e <= 1e-3) { e = 1e-3; }
    if (e >= 1 - 1e-6) { e = 1 - 1e-6; }
    if (Math.abs(step) < tol) break;
  }
  return e;
}

function findUnigramErrorRates(charErrorLog, charSeenLog) {
  best_error_rates = {};
  for (let letter of Object.keys(charSeenLog)) {
    const errorCount = charErrorLog[letter] ?? 0;
    const seenCount = charSeenLog[letter] ?? 0;
    const verbose = false;
    if (verbose) {
      console.log("letter", letter, "errorCount", errorCount, "seenCount", seenCount, "verbose", verbose);
    }
    const bestErr = findMAP(
      UNIGRAM_MEAN_ERROR_RATE[letter],
      UNIGRAM_STD[letter],
      errorCount,
      seenCount,
      1e-10,
      30,
      verbose
    );
    best_error_rates[letter] = bestErr;
  }
  return best_error_rates;
}

const [CNN_WEIGHT, UNIGRAM_WEIGHT, BIAS] = [0.6850118774971654 * 3, 0.645296487587596, -0.014092068726190543 * 0] // * are basic fudge factors from me. TODO come up with a better method e.g.  it should be waited by reps complete

const add_error_highlight_indecies = async (passages, highlight_error_pct, unigramErrorLog, unigramSeenLog) => {
  // For performance reasons only do it for the top passage
  const highlightIndecies = await compute_error_highlight_indecies(passages[0].passage, highlight_error_pct, unigramErrorLog, unigramSeenLog);
  passages[0].highlightIndecies = highlightIndecies;
  return passages;
}

const compute_error_highlight_indecies = async (passage, highlight_error_pct, unigramErrorLog, unigramSeenLog) => {
  const cnn_score = await error_scores_cached(passage)
  const unigram_error_rates = findUnigramErrorRates(unigramErrorLog, unigramSeenLog);
  const unigram_score = passage.split('').map((char, _) => unigram_error_rates[char] || 0);
  const by_cnn = cnn_score.map((score, index) => ({ index, score: score })).sort((a, b) => b.score - a.score).slice(0, highlight_error_pct * passage.length).map(item => item.index);
  const by_unigram = unigram_score.map((score, index) => ({ index, score: score })).sort((a, b) => b.score - a.score).slice(0, highlight_error_pct * passage.length).map(item => item.index);
  const indexToScore = cnn_score.map((score, index) => ({ index, score: CNN_WEIGHT * score + UNIGRAM_WEIGHT * unigram_score[index] + BIAS }));
  const highlightIndecies = indexToScore.sort((a, b) => b.score - a.score).slice(0, highlight_error_pct * passage.length).map(item => item.index);
  console.log("by_cnn", by_cnn);
  console.log("by_unigram", by_unigram);
  console.log("highlightIndecies", highlightIndecies);
  return highlightIndecies;
}

const load_lgbm_feat_files = async () => {
  const c = fetch(`https://jameshargreaves12.github.io/reference_data/lgbm_v2/word_feats.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(data => {
      word_feats = data;
    })
  return Promise.all([c]);
}

const fetches = arrFreqAndFileName.map(([freq, fileName]) =>
  fetch(`https://jameshargreaves12.github.io/reference_data/${fileName}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Set the appropriate frequency variable based on ngram type
      for (let key in data) {
        freq[key] = data[key];
      }
    })
)
Promise.all([...fetches, setup_pyodide(), load_lgbm_feat_files()]).then(() => {
  is_initialised.value = true;
  console.log("Initialized passage worker");
});



function getOrPad(passage, index) {
  if (index < 0) {
    return "<S>";
  }
  if (index >= passage.length) {
    return "<E>";
  }
  return passage[index];
}


function get_default_error_score_norm(passage, quadgram_error_model) {
  let model_score = 0
  for (let i = 0; i < passage.length; i++) {
    const char = getOrPad(passage, i)
    const bigram = getOrPad(passage, i + 1) + char
    const trigram = getOrPad(passage, i + 2) + bigram
    const quadgram = getOrPad(passage, i + 3) + trigram
    model_score += quadgram_error_model["seen_preds"][quadgram] || quadgram_error_model["default"]
  }
  return model_score / passage.length
}


function getErrorScoreAndMostLikelyErrorChars(passage, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, highlight_error_pct) {
  let passageErrorScore = 0;
  let charWeight = Object.keys(seenLog['char']).length ** 2 / 75;
  let bigramWeight = Object.keys(seenLog['bigram']).length ** 2 / (75 * 75);
  let trigramWeight = Object.keys(seenLog['trigram']).length ** 2 / (75 * 75 * 75);
  let quadgramWeight = Object.keys(seenLog['quadgram']).length ** 2 / (75 * 75 * 75 * 75);
  let totalWeight = charWeight + bigramWeight + trigramWeight + quadgramWeight;
  charWeight /= totalWeight;
  bigramWeight /= totalWeight;
  trigramWeight /= totalWeight;
  quadgramWeight /= totalWeight;
  const indexToScore = [];
  const persoalErrorWeight = Math.min(1, errorCount / 500);
  const hightlightPersoalErrorWeight = Math.max(0.5, Math.min(1, errorCount / 500));

  for (let i = 0; i < passage.length; i++) {
    const char = getOrPad(passage, i);
    const bigram = getOrPad(passage, i + 1) + char;
    const trigram = getOrPad(passage, i + 2) + bigram;
    const quadgram = getOrPad(passage, i + 3) + trigram;

    const personalCharScore = (errorLog['char'][char] || 0) / (seenLog['char'][char] || 1);
    const personalBigramScore = (errorLog['bigram'][bigram] || 0) / (seenLog['bigram'][bigram] || 1);
    const personalTrigramScore = (errorLog['trigram'][trigram] || 0) / (seenLog['trigram'][trigram] || 1);
    const personalQuadgramScore = (errorLog['quadgram'][quadgram] || 0) / (seenLog['quadgram'][quadgram] || 1);
    const p_score = charWeight * personalCharScore + bigramWeight * personalBigramScore + trigramWeight * personalTrigramScore + quadgramWeight * personalQuadgramScore;
    const d_score = (defaultQuadgramErrorModel["seen_preds"][quadgram] || defaultQuadgramErrorModel["default"]);

    const charScore = (1 - hightlightPersoalErrorWeight) * d_score + hightlightPersoalErrorWeight * p_score;
    indexToScore.push({
      index: i,
      score: charScore
    });
    passageErrorScore += (1 - persoalErrorWeight) * d_score + persoalErrorWeight * p_score;
  }
  const highlightIndecies = indexToScore.sort((a, b) => b.score - a.score).slice(0, highlight_error_pct * passage.length).map(item => item.index);
  return {
    errorScore: passageErrorScore / passage.length,
    highlightIndecies
  };
}

function getErrorScores(passages, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, highlight_error_pct) {
  result = {
    errorScores: [],
    passageToHighlightIndecies: {}
  }
  for (let i = 0; i < passages.length; i++) {
    const passage = passages[i];
    const { errorScore, highlightIndecies } = getErrorScoreAndMostLikelyErrorChars(passage, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, highlight_error_pct);
    result.errorScores.push(errorScore);
    result.passageToHighlightIndecies[passage] = highlightIndecies;
  }
  return result;
}

function getNaturalnessScore(passage, quadgramFrequency) {
  let naturalnessScore = 0;
  for (let i = 0; i < passage.length; i++) {
    const char = getOrPad(passage, i);
    const bigram = getOrPad(passage, i + 1) + char;
    const trigram = getOrPad(passage, i + 2) + bigram;
    const quadgram = getOrPad(passage, i + 3) + trigram;

    naturalnessScore += (quadgramFrequency[quadgram] || 0);
  }
  return naturalnessScore / passage.length;
}

function getDesireForPassage(passage, quadgramFrequency, error_score, lgbm_score) {
  const expectedErrorScore = 0.1;
  const expectedNaturalnessScore = 0.00002;
  const naturalnessScore = getNaturalnessScore(passage, quadgramFrequency);
  return (error_score / expectedErrorScore) + 0.02 * (naturalnessScore / expectedNaturalnessScore) + lgbm_score * 3;
}

function getScoreBySelectionStrategy(passage, selectionStratedy) {
  if (selectionStratedy == null) {
    return 0;
  }
  if (selectionStratedy.includes("->")) {
    const letterSuggestion = selectionStratedy.split("->")[1]
    return passage.split('').map((char, index) => letterSuggestion == char ? index : null).filter(index => index !== null).length / passage.length;
  }

  if (selectionStratedy == "most_common") {
    return (passage.split('').filter(char => LOGICAL_LETTER_GROUPINGS["most_common"].includes(char)).length - passage.split('').filter(char => LOGICAL_LETTER_GROUPINGS["punc"].includes(char)).length) / passage.length;
  }

  if (selectionStratedy in LOGICAL_LETTER_GROUPINGS) {
    const letters = LOGICAL_LETTER_GROUPINGS[selectionStratedy];
    return passage.split('').filter(char => letters.includes(char)).length / passage.length;
  }
  if (selectionStratedy in LOGICAL_BIGRAM_GROUPINGS) {
    const bigrams = LOGICAL_BIGRAM_GROUPINGS[selectionStratedy];
    return passage.split('').filter((char, index) => bigrams.includes(char + getOrPad(passage, index + 1))).length / passage.length;
  }

  return 0;
}

function topNBySelectionStrategy(passages, selectionStratedy, n) {
  if (selectionStratedy == null) {
    return passages;
  }
  passages = passages.sort((a, b) => getScoreBySelectionStrategy(a, selectionStratedy) - getScoreBySelectionStrategy(b, selectionStratedy));
  return passages.slice(passages.length - n, passages.length);
}


function numberToWords(n) {
  if (n < 0 || n > 2100 || !Number.isInteger(n)) return null;
  const units = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  function under100(num) {
    if (num < 20) return units[num];
    const t = Math.floor(num / 10), u = num % 10;
    return tens[t] + (u ? " " + units[u] : "");
  }

  if (n < 100) return under100(n);
  if (n < 1000) {
    const h = Math.floor(n / 100), r = n % 100;
    return units[h] + " hundred" + (r ? " and " + under100(r) : "");
  }
  if (n < 2000) {
    const r = n % 1000;
    return "one thousand" + (r ? " " + numberToWords(r) : "");
  }
  if (n <= 2100) {
    const r = n % 2000;
    return "two thousand" + (r ? " " + numberToWords(r) : "");
  }
}

function simplifySentence(input) {
  // Preserve abbreviations and numbers
  const abbreviations = /\b([A-Z]\.){2,}/g;
  const preserved = [];
  let text = input.replace(abbreviations, match => {
    preserved.push(match);
    return `__PRESERVED_${preserved.length - 1}__`;
  });

  let sentences = text.split(".");
  sentences = sentences.map(sentence => {
    sentence = sentence
      .trim()
      .split(/\s+/)
      .map((word, idx) => {
        if (idx > 0 && /^[A-Z][a-z]/.test(word) || /^[A-Z]{2,}$/.test(word)) return word;
        return word.toLowerCase();
      })
      .join(' ');
    return sentence;
  });
  text = sentences.join(". ");


  text = text.replace(/,(?=\s*\d{3})/g, '__NUMCOMMA__'); // keep numeric commas
  text = text.replace(/,(?=\s*[A-Z][a-z]+ \d{1,2}, \d{4})/g, '__DATECOMMA__'); // keep date commas
  text = text.replace(/,/g, ''); // remove other commas

  // Remove periods at sentence ends, keep for decimals
  text = text.replace(/(?<=\d)\.(?=\d)/g, '__DECIMAL__'); // decimal numbers
  text = text.replace(/\.(?=\s|$)/g, ''); // remove sentence periods

  // Remove semicolons, colons, and quotation marks
  text = text.replace(/[;:"“”]/g, '');

  // Remove parentheses and brackets
  text = text.replace(/[\(\)\[\]]/g, '');

  // Restore preserved tokens
  text = text
    .replace(/__PRESERVED_(\d+)__/g, (_, i) => preserved[i])
    .replace(/__NUMCOMMA__/g, ',')
    .replace(/__DATECOMMA__/g, ',')
    .replace(/__DECIMAL__/g, '.');

  return text.trim();
}

function makePassageEasy(passage) {

  // Replace all numbers in the passage with their string representation using numberToWords
  // We'll match numbers (integers) and replace them
  const easyPassageWithNumbers = passage.replace(/\b\d+\b/g, (match) => {
    const num = parseInt(match, 10);
    const val = numberToWords(num);
    if (val) {
      return val;
    }
    return match;
  });

  passage = simplifySentence(easyPassageWithNumbers);

  return passage;
  // const easyPassage = passage.split('').map(char => {
  //   if (LOGICAL_LETTER_GROUPINGS["punc"].includes(char)) {
  //     return " ";
  //   }
  //   return char;
  // }).join('');
  // return easyPassage.replace(/\s+/g, ' ').trim();
}

const shortenPassageBasedOnStrategy = (passages, strategy) => {
  if (!strategy || !strategy.startsWith("letter-speed") || !strategy.startsWith("letter-error")) {
    return;
  }
  console.log("shortenPassageBasedOnStrategy", strategy, passages[0].passage);
  for (let i = 0; i < 1; i++) {
    const passage = passages[i].passage;
    let sentences = passage.split(".").map(sentence => sentence);
    const skip_indexs = [];
    for (let j = 0; j < sentences.length; j++) {
      const sentence = sentences[j];
      if (strategy.startsWith("letter-speed")) {
        const letterSpeedSuggestion = strategy.split("->")[1]
        const numberOfInstances = sentence.split('').filter((char) => letterSpeedSuggestion == char).length;
        if (numberOfInstances == 0 && sentence.length > 10) {
          skip_indexs.push(j);
        }
      }
    }
    // Only remove sentences from start or end
    let remove_from_start = -1;
    let remove_from_end = sentences.length;
    for (let j = 0; j < sentences.length; j++) {
      if (skip_indexs.includes(j)) {
        remove_from_start = j;
      } else {
        break;
      }
    }
    for (let j = sentences.length - 1; j >= 0; j--) {
      if (skip_indexs.includes(j)) {
        remove_from_end = j;
      } else {
        break;
      }
    }
    let filtered_sentences = sentences.slice(remove_from_start + 1, remove_from_end).join(".").trim();

    if (`"'?!):;%,`.includes(filtered_sentences[0])) {
      filtered_sentences = filtered_sentences.slice(1).trim();
    }
    if (filtered_sentences.length > 30) {
      passages[i].passage = filtered_sentences;
    }
  }
}

const add_error_highlight_from_strategy = async (passages, strategy, unigramErrorLog, unigramSeenLog) => {
  const firstPassage = passages[0].passage;
  let strategyHighlightIndecies = [];
  if (strategy && (strategy.startsWith("letter-speed") || strategy.startsWith("letter-error"))) {
    const letterSpeedSuggestion = strategy.split("->")[1]
    const letterSpeedSuggestionIdxs = firstPassage.split('').map((char, index) => letterSpeedSuggestion == char ? index : null).filter(index => index !== null);
    strategyHighlightIndecies = letterSpeedSuggestionIdxs;
  }
  else if (strategy == "most_common") {
    const mostCommonLetterIdxs = firstPassage.split('').map((char, index) => LOGICAL_LETTER_GROUPINGS["most_common"].includes(char) ? index : null).filter(index => index !== null);
    strategyHighlightIndecies = mostCommonLetterIdxs;
  }
  else if (strategy in LOGICAL_LETTER_GROUPINGS) {
    const letters = LOGICAL_LETTER_GROUPINGS[strategy];
    const letterIdxs = firstPassage.split('').map((char, index) => letters.includes(char) ? index : null).filter(index => index !== null);
    strategyHighlightIndecies = letterIdxs;
  }
  else if (strategy in LOGICAL_BIGRAM_GROUPINGS) {
    const bigrams = LOGICAL_BIGRAM_GROUPINGS[strategy];
    const bigramIdxs = firstPassage.split('').map((char, index) => bigrams.includes(char + getOrPad(firstPassage, index + 1)) || bigrams.includes(getOrPad(firstPassage, index) + char) ? index : null).filter(index => index !== null);
    strategyHighlightIndecies = bigramIdxs;
  }
  console.log("strategyHighlightIndecies", strategyHighlightIndecies, strategy);
  if (strategyHighlightIndecies.length > firstPassage.length * 0.25 && BETTER_ERROR_MODEL) {
    const errorModelHighlightIndecies = await compute_error_highlight_indecies(firstPassage, 0.25, unigramErrorLog, unigramSeenLog);
    const intersection = strategyHighlightIndecies.filter(index => errorModelHighlightIndecies.includes(index));
    strategyHighlightIndecies = intersection;
  }

  passages[0].highlightIndecies = strategyHighlightIndecies;

  // Not handling easy_mode I think this is dead?
  return passages;
}

const sourceChange = (source) => {
  currentSource = source;
  if (source_passages[currentSource]) {
    return;
  }
  fetch(source_paths[currentSource])
    .then(response => response.text())
    .then(text => source_passages[currentSource] = text.split("\n"));
  return;
}



const randomlySelectExtraPassages = (max_new_passages, newUpcomingPassages, recentPassages) => {
  const passages = source_passages[currentSource];
  const initial_length = newUpcomingPassages.length;
  for (let i = 0, total_loops = 0; i + initial_length < max_new_passages && total_loops <= 2000; i++, total_loops++) {
    const randomPassage = passages[Math.floor(Math.random() * passages.length)];
    if (!newUpcomingPassages.includes(randomPassage) && !recentPassages.includes(randomPassage)) {
      newUpcomingPassages.push(randomPassage);
    } else {
      i--;
    }
  }
  return newUpcomingPassages;
}

const orderPassages = async (passages, selectionStratedy, user_intro_acc, user_intro_wpm, errorCount, highlight_error_pct, seenLog, errorLog) => {
  const lgbm_scores = await call_lgbm(passages, user_intro_acc, user_intro_wpm);
  const { errorScores, passageToHighlightIndecies } = getErrorScores(passages, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, highlight_error_pct);

  const desire_for_passages = passages.map((passage, index) => getDesireForPassage(passage, quadgramFrequency, errorScores[index], lgbm_scores[index]));
  const result = passages.map((passage) => (
    {
      passage,
      source: currentSource,
      selectionStratedy: selectionStratedy,
      highlightIndecies: passageToHighlightIndecies[passage],
      desireForPassage: desire_for_passages[passage]
    })).sort((a, b) => - a.desireForPassage + b.desireForPassage);
  return result;
}

const handleGetNextPassagesErrorGroup = async (
  upcomingPassages,
  recentPassages,
  errorLog,
  seenLog,
  errorCount,
  user_intro_acc,
  user_intro_wpm,
  highlight_error_pct,
  selectionStratedy
) => {
  let correctSourceUpcomingPassages = [];
  if (upcomingPassages) {
    correctSourceUpcomingPassages = upcomingPassages.filter(passage => passage.source == currentSource && passage.selectionStratedy == selectionStratedy).map(passage => passage.passage);
  }

  // not yet initialised
  if (!source_passages[currentSource] || source_passages[currentSource].length == 0 || Object.keys(quadgramFrequency).length == 0 || Object.keys(defaultQuadgramErrorModel).length == 0) {
    return;
  }

  let newUpcomingPassages = [...correctSourceUpcomingPassages];

  newUpcomingPassages = randomlySelectExtraPassages(500, newUpcomingPassages, recentPassages);
  newUpcomingPassages = topNBySelectionStrategy(newUpcomingPassages, selectionStratedy, 10);

  // hack in easy mode.
  if (selectionStratedy == "most_common") {
    newUpcomingPassages = newUpcomingPassages.map(makePassageEasy);
  }

  const result = await orderPassages(newUpcomingPassages, selectionStratedy, user_intro_acc, user_intro_wpm, errorCount, highlight_error_pct, seenLog, errorLog);

  let result_with_error_highlight_indecies = result.slice(0, 10);
  shortenPassageBasedOnStrategy(result_with_error_highlight_indecies, selectionStratedy);
  result_with_error_highlight_indecies = await add_error_highlight_from_strategy(result_with_error_highlight_indecies, selectionStratedy, unigramErrorLog = errorLog["char"], unigramSeenLog = seenLog["char"]);
  return result_with_error_highlight_indecies;
}


const handleGetNextPassagesLetterFocused = async (
  upcomingPassages,
  recentPassages,
  errorLog,
  seenLog,
  errorCount,
  user_intro_acc,
  user_intro_wpm,
  highlight_error_pct,
  selectionStratedy
) => {
  let correctSourceUpcomingPassages = [];
  if (upcomingPassages) {
    console.log("upcomingPassages", upcomingPassages);
    correctSourceUpcomingPassages = upcomingPassages.filter(passage => passage.source == currentSource && passage.selectionStratedy == selectionStratedy).map(passage => passage.passage);
  }

  // not yet initialised
  if (!source_passages[currentSource] || source_passages[currentSource].length == 0 || Object.keys(quadgramFrequency).length == 0 || Object.keys(defaultQuadgramErrorModel).length == 0) {
    return;
  }

  const letter = selectionStratedy.split("->")[1];
  let newUpcomingPassages = [...correctSourceUpcomingPassages];

  if (letter in specificLetterPassages) {
    newUpcomingPassages = specificLetterPassages[letter].sort(() => Math.random() - 0.5).slice(0, 10);
    let res = newUpcomingPassages.map(passage => ({
      passage,
      source: "hardcoded-letter",
      selectionStratedy: selectionStratedy,
      highlightIndecies: [],
      desireForPassage: 0
    }));
    res = await add_error_highlight_from_strategy(res, selectionStratedy, unigramErrorLog = errorLog["char"], unigramSeenLog = seenLog["char"]);
    return res;
  }

  newUpcomingPassages = randomlySelectExtraPassages(500, newUpcomingPassages, recentPassages);
  newUpcomingPassages = topNBySelectionStrategy(newUpcomingPassages, selectionStratedy, 10); // todo split this up

  const result = await orderPassages(newUpcomingPassages, selectionStratedy, user_intro_acc, user_intro_wpm, errorCount, highlight_error_pct, seenLog, errorLog);

  let result_with_error_highlight_indecies = result.slice(0, 10);
  shortenPassageBasedOnStrategy(result_with_error_highlight_indecies, selectionStratedy);
  result_with_error_highlight_indecies = await add_error_highlight_from_strategy(result_with_error_highlight_indecies, selectionStratedy, unigramErrorLog = errorLog["char"], unigramSeenLog = seenLog["char"]);
  console.log("result_with_error_highlight_indecies", result_with_error_highlight_indecies);
  return result_with_error_highlight_indecies;
}


const handleGetNextPassagesDefault = async (
  upcomingPassages,
  recentPassages,
  errorLog,
  seenLog,
  errorCount,
  user_intro_acc,
  user_intro_wpm,
  highlight_error_pct,
) => {
  let correctSourceUpcomingPassages = [];
  if (upcomingPassages) {
    console.log("upcomingPassages", upcomingPassages);
    correctSourceUpcomingPassages = upcomingPassages.filter(passage => passage.source == currentSource && passage.selectionStratedy == null).map(passage => passage.passage);
  }

  // not yet initialised
  if (!source_passages[currentSource] || source_passages[currentSource].length == 0 || Object.keys(quadgramFrequency).length == 0 || Object.keys(defaultQuadgramErrorModel).length == 0) {
    return;
  }

  let newUpcomingPassages = [...correctSourceUpcomingPassages];
  newUpcomingPassages = randomlySelectExtraPassages(100, newUpcomingPassages, recentPassages);
  const result = await orderPassages(newUpcomingPassages, null, user_intro_acc, user_intro_wpm, errorCount, highlight_error_pct, seenLog, errorLog);


  let result_with_error_highlight_indecies = result.slice(0, 10);
  try {
    if (BETTER_ERROR_MODEL && HAS_SUCCEEDED_ONCE) {
      result_with_error_highlight_indecies = await add_error_highlight_indecies(result_with_error_highlight_indecies, highlight_error_pct, unigramErrorLog = errorLog["char"], unigramSeenLog = seenLog["char"]);
    }
  } catch (e) {
    console.error(e);
    BETTER_ERROR_MODEL = false;
  }
  HAS_SUCCEEDED_ONCE = true;
  return result_with_error_highlight_indecies;
}


self.onmessage = async function (e) {
  try {
    if (e.data.type === 'suggestErrorGroupStrategyFromInterstingErrors') {
      const strategy = suggestErrorGroupStrategyFromInterstingErrors(e.data.interestingErrorLog, e.data.seenLog, e.data.previousRepSelectionStrategies)
      self.postMessage({ type: 'suggestErrorGroupStrategyFromInterstingErrors', strategy: strategy });
      return;
    }
    if (e.data.type === 'suggestErrorLetterStrategyFromInterestingErrors') {
      const strategy = getLetterErrorSuggestionFromErrorLog(e.data.interestingErrorLog["char"], e.data.seenLog["char"], e.data.previousRepSelectionStrategies);
      self.postMessage({ type: 'suggestErrorLetterStrategyFromInterestingErrors', strategy: strategy });
      return;
    }
    if (e.data.type === 'suggestStrategyFromSpeedLog') {
      const strategy = getLetterSpeedSuggestionFromSpeedLog(e.data.speedLog, e.data.previousRepSelectionStrategies);
      self.postMessage({ type: 'suggestStrategyFromSpeedLog', strategy: strategy });
      return;
    }
    if (e.data.type === 'sourceChange') {
      sourceChange(e.data.source);
      return;
    }
    if (!is_initialised.value) {
      console.log("Not initialised");
      return;
    }
    if (e.data.type === 'get-next-passages:letter-speed') {
      console.log("get-next-passages:letter-speed", e.data.selectionStratedy);
      const res = await handleGetNextPassagesLetterFocused(e.data.upcomingPassages, e.data.recentPassages, e.data.errorLog, e.data.seenLog, e.data.errorCount, e.data.user_intro_acc, e.data.user_intro_wpm, e.data.highlight_error_pct, e.data.selectionStratedy);
      self.postMessage({ res, type: 'get-next-passages:letter-speed' });
      return;
    }

    if (e.data.type === 'get-next-passages:letter-error') {
      const res = await handleGetNextPassagesLetterFocused(e.data.upcomingPassages, e.data.recentPassages, e.data.errorLog, e.data.seenLog, e.data.errorCount, e.data.user_intro_acc, e.data.user_intro_wpm, e.data.highlight_error_pct, e.data.selectionStratedy);
      self.postMessage({ res, type: 'get-next-passages:letter-error' });
      return;
    }

    if (e.data.type === 'get-next-passages:error-group') {
      const res = await handleGetNextPassagesErrorGroup(e.data.upcomingPassages, e.data.recentPassages, e.data.errorLog, e.data.seenLog, e.data.errorCount, e.data.user_intro_acc, e.data.user_intro_wpm, e.data.highlight_error_pct, e.data.selectionStratedy);
      self.postMessage({ res, type: 'get-next-passages:error-group' });
      return;
    }

    if (e.data.type === 'get-next-passages:default') {
      const res = await handleGetNextPassagesDefault(e.data.upcomingPassages, e.data.recentPassages, e.data.errorLog, e.data.seenLog, e.data.errorCount, e.data.user_intro_acc, e.data.user_intro_wpm, e.data.highlight_error_pct);
      self.postMessage({ res, type: 'get-next-passages:default' });
      return;
    }

    console.error("No handler for type", e.data.type);
  }
  catch (e) {
    console.error(e);
    self.postMessage({ type: 'error', call_type: e.data.type, error: e });
  }
}; 