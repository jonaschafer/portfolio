// COMPLETE VACATION DESTINATIONS DATA
// Vacation Planner - Destination Data

const destinations = [
  // ===== HAWAII =====
  {
    id: "maui-hawaii",
    name: "Maui, Hawaii",
    country: "USA",
    region: "hawaii",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
    cardImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
    bestTime: "December - March",
    budget: "luxury",
    estimatedCost: 3200,
    seasons: ["winter", "spring"],
    climate: "Tropical, 75-85°F, occasional rain showers",
    
    costs: {
      flights: '$800',
      accommodation: '$1400',
      food: '$700',
      activities: '$300',
      total: '$3200'
    },
    
    travelDays: {
      day0: "Depart Portland early morning (6-7am) → Arrive Maui OGG (12-1pm). Pick up rental car, check into hotel, grab lunch at a food truck in Kahului, settle in and hit the beach for sunset.",
      day6: "Sleep in, leisurely breakfast, return rental car, depart Maui (2-3pm) → Arrive Portland (10-11pm same day)"
    },
    
    itinerary: [
      {
        day: 1,
        morning: {
          activity: "Sunrise at Haleakalā National Park",
          description: "Set your alarm for 3am (yes, really) and drive up the volcano in the dark. You'll need to book permits weeks in advance—they sell out fast. The drive takes about 90 minutes from Wailea, winding through clouds until you're above them. Arrive by 5:30am, bundle up (it's legitimately cold at 10,000 feet), and watch the sun crack over the crater rim. The colors shift from deep purple to orange to gold, illuminating the moon-like landscape below. It's one of those moments that actually lives up to the hype. After sunrise, hike the Sliding Sands Trail for 20-30 minutes into the crater—feels like walking on Mars. Drive back down and stop at Kula Lodge for pancakes and coffee with a view.",
          image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800",
          cost: 30
        },
        afternoon: {
          activity: "Nap, then beach time at Wailea",
          description: "You'll be exhausted from the 3am wakeup, so head back to your hotel and crash for a few hours. When you resurface around 2pm, hit Wailea Beach—it's the best beach in South Maui, with golden sand, calm waters perfect for swimming, and far fewer crowds than Kaanapali. Rent a kayak or just float around. The water is that specific shade of turquoise that doesn't exist anywhere else. Grab a frozen cocktail from the beach bar and watch the sea turtles swim by (don't touch them, obviously). Stay until sunset—the sky turns pink and orange behind Molokini Crater.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        evening: {
          activity: "Dinner at Ferraro's Bar e Ristorante",
          description: "Italian on the beach? Hear me out. Ferraro's sits right on Wailea Beach with tables in the sand (reserve one at sunset). The seafood is incredible—get the cioppino or the fresh catch with Hawaiian lilikoi butter. Yes, it's pricey ($60-80 per person), but you're eating at a table with your toes in the sand while the waves crash 15 feet away. Order the tiramisu and a glass of wine, and just exist in this moment. This is vacation.",
          image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
          cost: 140
        }
      },
      {
        day: 2,
        morning: {
          activity: "Road to Hana (start early, like 7am)",
          description: "The Road to Hana is 52 miles of winding coastal highway with 620 curves and 59 bridges. It's not about the destination—Hana town is tiny and honestly underwhelming. It's about the journey. Stop at every waterfall. There will be many. Twin Falls (mile 2) has easy hikes to multiple waterfalls and swimming holes. Wai'anapanapa State Park (mile 32) has a black sand beach that looks photoshopped—the contrast of black volcanic sand against turquoise water is unreal. Bring snacks, download the Shaka Guide app (it's a narrated GPS tour that tells you exactly where to stop), and pack your swimsuit. You'll be in and out of the car all day. Don't rush it—if you're rushing, you're doing it wrong.",
          image: "https://images.unsplash.com/photo-1583979436033-2c45a0e5482d?w=800",
          cost: 0
        },
        afternoon: {
          activity: "Continue Road to Hana, turn around by 2pm",
          description: "Keep driving past Hana town (seriously, don't stop there) to the Pipiwai Trail in Haleakalā National Park (the coastal side). This 4-mile roundtrip hike through a bamboo forest leads to Waimoku Falls, a 400-foot waterfall. The bamboo forest is surreal—sunlight filters through stalks that creak and clack in the wind. After the hike, turn around and start heading back. Do NOT attempt the backside road to Upcountry—it's unpaved, your rental agreement prohibits it, and you will get a flat tire. Stop at Halfway to Hana for banana bread (it's cash only, and yes, everyone stops here, but it's actually good). Get back to your hotel by sunset.",
          image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800",
          cost: 30
        },
        evening: {
          activity: "Chill night—order takeout",
          description: "You just drove 100+ miles on winding roads and hiked through a jungle. You're exhausted. Order poke bowls from Eskimo Candy in Kihei (get the spicy ahi—it's legitimately the best poke on the island) or pizza from Cafe O'Lei, eat on your hotel balcony, and go to bed early. Tomorrow is another early morning.",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
          cost: 40
        }
      },
      {
        day: 3,
        morning: {
          activity: "Molokini Crater snorkel tour (6:30am pickup)",
          description: "Book this with Kai Kanani or Calypso—they're the best operators. You'll motor out to Molokini, a crescent-shaped volcanic crater that rises out of the ocean. The water inside is 150+ feet deep and crystal clear. You'll see parrotfish, Humuhumunukunukuāpua'a (Hawaii's state fish, yes that's the real name), maybe a sea turtle, maybe a reef shark (don't worry, they're chill). The guides provide wetsuits, gear, breakfast, and lunch. Most tours also stop at Turtle Town on the way back—a shallow reef where green sea turtles hang out. You'll be back by 12:30pm, sun-drunk and salty.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 150
        },
        afternoon: {
          activity: "Explore Makena Beach (Big Beach)",
          description: "South of Wailea, Makena is the wild side of South Maui. Big Beach is a massive stretch of golden sand with turquoise water and views of Molokini and Kaho'olawe. The waves can be big here—bodysurf if you're confident, or just float in the shallows. Walk over the lava rock hill on the north end to reach Little Beach, Maui's unofficial clothing-optional beach (do with that information what you will). Bring water and snacks—there are no facilities. Stay until sunset—the sky turns every color.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        evening: {
          activity: "Dinner at Monkeypod Kitchen",
          description: "Head to Kihei for dinner at Monkeypod—it's casual, island-vibes, and the food is consistently great. Sit on the patio, order the fresh fish tacos and the Paniolo nachos (brisket, avocado crema, pickled onions—trust me), and drink a mai tai made with fresh-pressed cane sugar. The craft beer list is solid if cocktails aren't your thing. End with the chocolate cream pie. It's a lighter, more relaxed vibe than last night's beachside dinner, and that's exactly what you need.",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
          cost: 80
        }
      },
      {
        day: 4,
        morning: {
          activity: "Upcountry Maui—Kula and Paia",
          description: "Drive up the slopes of Haleakalā to Upcountry Maui, where it's cooler, greener, and feels nothing like tropical Hawaii. Stop at Ali'i Kula Lavender Farm—wander through purple fields with panoramic ocean views, sip lavender lemonade, and buy some lavender honey to take home. Continue to Paia town, a laid-back surf village with hippie vibes. Browse the shops, grab an açai bowl at Choice Health Bar, and watch surfers at Ho'okipa Beach Park. If the waves are big, you might see pros ripping. Drive back through Makawao, a cowboy town (yes, really) with art galleries and cafes.",
          image: "https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=800",
          cost: 20
        },
        afternoon: {
          activity: "Spa afternoon at your resort",
          description: "You've been going hard for four days. It's time to slow down. Book a couples massage at your hotel spa—most Wailea resorts have incredible spas with ocean-view treatment rooms. Get the lomi lomi massage (traditional Hawaiian technique with long, flowing strokes). After, lounge by the pool with a book and a frozen drink. Do absolutely nothing. This is the recharge day.",
          image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
          cost: 300
        },
        evening: {
          activity: "Old Lahaina Luau",
          description: "Yes, it's touristy. Yes, it's worth it. Old Lahaina Luau is the most authentic luau on Maui—they focus on actual Hawaiian culture rather than the over-the-top Polynesian revue shows. You'll watch the imu ceremony (pulling the kalua pig from the underground oven), eat traditional foods (poi, laulau, haupia), and watch hula performances that tell stories. The sunset view over the ocean is stunning. Book the premium seating—it's worth the extra $30 per person. You'll leave with a deeper appreciation for Hawaiian culture and a very full stomach.",
          image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
          cost: 250
        }
      },
      {
        day: 5,
        morning: {
          activity: "Last beach morning + souvenir shopping",
          description: "Sleep in for real this time. Roll down to Wailea Beach one last time around 10am, swim, float, soak in the sun. Around noon, head to the Shops at Wailea for last-minute gifts—Hawaiian Host chocolates, Maui coffee, a Maui Brewing Co. shirt, whatever. Grab lunch at Pita Paradise (the Greek food is surprisingly excellent). Take your time. Your flight isn't until tomorrow.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 50
        },
        afternoon: {
          activity: "Sunset at Wailea Beach Path",
          description: "Walk the Wailea Beach Path, a paved 1.5-mile coastal trail connecting all the Wailea beaches and resorts. It's beautiful, easy, and hits different at golden hour. Stop at each beach cove, take photos, breathe in the salt air. This is your last afternoon in paradise—be present in it.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        evening: {
          activity: "Final dinner at Mama's Fish House",
          description: "This is it—the splurge meal, the one you'll remember forever. Mama's Fish House is the best restaurant on Maui, hands down. It's in Paia, right on the beach, and it's been family-owned since 1973. The fish is caught daily by local fishermen—the menu tells you who caught your fish and where. Order the Mahimahi Mama's Style (baked in a macadamia nut crust) or the Ono (if available). The Polynesian Black Pearl dessert is mandatory. Reservations are essential—book this the day you land. Dress nicely (island formal: sundress or aloha shirt). This meal will cost $200+ for two, and it's worth every penny. You're not just eating—you're experiencing.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 220
        }
      }
    ],
    
    accommodation: {
      name: "Grand Wailea Resort",
      type: "Luxury Beach Resort",
      pricePerNight: 200,
      nights: 7,
      description: "Massive property with incredible pools, water slides, lazy river, multiple restaurants, and direct beach access. Worth the splurge for the pool complex alone.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      alternative: "Budget option: Maui Coast Hotel in Kihei (~$150/night), clean and comfortable, short drive to beaches"
    },
    
    tips: [
      {
        icon: "✈️",
        title: "Visa & Entry",
        content: "US travelers need valid ID. International travelers check ESTA requirements for US entry."
      },
      {
        icon: "🎒",
        title: "Packing Essentials",
        content: "Reef-safe sunscreen (required by law), hiking shoes, light rain jacket, swimsuit x2, casual sundresses/aloha shirts for nice dinners, headlamp for Haleakalā sunrise"
      },
      {
        icon: "🚗",
        title: "Transportation",
        content: "Rent a car. Non-negotiable. Get it at the airport (Costco Travel has best rates). You'll drive 300+ miles over the week."
      },
      {
        icon: "💡",
        title: "Insider Tips",
        content: "Book Haleakalā sunrise permits 60 days in advance (recreation.gov). Download Shaka Guide app for Road to Hana. Mama's Fish House reservations open 3 months out. Old Lahaina Luau sells out weeks ahead. Don't sleep on food trucks—some of the best food is from trucks."
      },
      {
        icon: "🌊",
        title: "Best Beaches Ranked",
        content: "1) Wailea Beach (swimming, snorkeling, facilities), 2) Makena/Big Beach (bodysurfing, wild, beautiful), 3) Napili Bay (calm, family-friendly), 4) Waianapanapa (black sand, dramatic, photos)"
      }
    ]
  },

  // ===== BIG ISLAND, HAWAII =====
  {
    id: "big-island-hawaii",
    name: "Big Island, Hawaii",
    country: "USA",
    region: "hawaii",
    heroImage: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=1200",
    cardImage: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=400",
    bestTime: "December - March",
    budget: "luxury",
    estimatedCost: 3100,
    seasons: ["winter", "spring"],
    climate: "Varies by coast: Kona (dry, 75-85°F), Hilo (rainy, lush)",
    
    costs: {
      flights: '$820',
      accommodation: '$1300',
      food: '$680',
      activities: '$300',
      total: '$3100'
    },
    
    travelDays: {
      day0: "Depart Portland early morning → Arrive Kona (KOA) afternoon. Pick up rental car, drive to hotel, quick beach sunset.",
      day6: "Morning at beach, return car, depart Kona afternoon → Portland late evening"
    },
    
    itinerary: [
      {
        day: 1,
        morning: {
          activity: "Hawaii Volcanoes National Park",
          description: "Drive 2.5 hours from Kona (yes, it's far, but worth it) to Hawaii Volcanoes National Park, one of the few places on Earth where you can see active lava. Start at Kilauea Visitor Center, then drive Crater Rim Drive—you'll see steaming vents, sulfur banks, and the massive Halema'uma'u Crater with its glowing lava lake (if it's actively erupting). Hike the Thurston Lava Tube, a 500-year-old tunnel formed by flowing lava—it's like walking through a cave that nature carved. The Kilauea Iki Trail (4 miles) takes you across the floor of a crater that erupted in 1959—still steaming, otherworldly.",
          image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800",
          cost: 30
        },
        afternoon: {
          activity: "Chain of Craters Road to the coast",
          description: "Drive Chain of Craters Road, which descends 3,700 feet over 19 miles through old lava flows to the ocean. The landscape is pure black rock with occasional ferns pushing through cracks. At the bottom, walk the Holei Sea Arch Trail—waves crash against lava cliffs. If you're lucky and there's active lava flow (check with rangers), you might see lava meeting ocean, creating massive steam plumes. The road ends where lava flows covered it in the '90s—you can see where the black rock just swallowed the pavement.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        evening: {
          activity: "After-dark lava viewing, then dinner in Hilo",
          description: "Stay in the park until after sunset—the lava glow is WAY more impressive in the dark. The Halema'uma'u Crater lights up orange and red, reflecting off the steam. It's hypnotic. Drive to Hilo (45 min) for dinner at Pineapples—island fusion food, fresh fish, casual vibe. Try the macnut-crusted catch of the day. You'll be exhausted—it's a 3-hour drive back to Kona, but you just saw an active volcano.",
          image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800",
          cost: 70
        }
      },
      {
        day: 2,
        morning: {
          activity: "Snorkel at Kealakekua Bay (Captain Cook Monument)",
          description: "Book a morning snorkel tour to Kealakekua Bay—you can't drive there, you have to boat or kayak in. This is the best snorkeling in Hawaii: crystal clear water, hundreds of tropical fish, spinner dolphins that swim right up to you, and coral reefs in pristine condition because the bay is protected. The water is calm, visibility is 100+ feet, and the fish are so colorful it looks fake. The tour includes breakfast and lunch on the boat. You'll snorkel for 2 hours, see dolphins, maybe a sea turtle, and float in water so blue it hurts to look at.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 140
        },
        afternoon: {
          activity: "Coffee farm tour in Kona",
          description: "After snorkeling, drive up into the Kona coffee belt to tour a coffee farm. Greenwell Farms or Mountain Thunder both offer free tours where you'll learn how Kona coffee is grown, harvested, roasted. You'll taste different roasts, see the cherry-to-bean process, and walk through groves with views down to the ocean. Buy a bag of fresh-roasted coffee to take home (it's expensive but worth it—Kona coffee is the real deal). The drive through the coffee farms is beautiful—green hillsides, tropical flowers, mountain air.",
          image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
          cost: 0
        },
        evening: {
          activity: "Sunset dinner at Huggo's on the Rocks",
          description: "Huggo's on the Rocks is literally on the lava rocks right at the ocean's edge in Kailua-Kona. Waves crash 10 feet away while you eat fresh ahi poke and drink mai tais. It's super casual—sit at tiki tables, order at the bar, kick off your sandals. The fish tacos are legit. Stay through sunset—the sky turns pink and orange over the water, and fire dancers perform on the beach. This is peak Hawaii vibes.",
          image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
          cost: 65
        }
      },
      {
        day: 3,
        morning: {
          activity: "Manta ray snorkel (morning option)",
          description: "If you didn't do the manta night snorkel (see tonight's activity), do a morning manta snorkel instead at Manta Heaven. These gentle giants (15+ foot wingspan) glide beneath you while feeding on plankton. They're curious and will swim within inches of you—it's both terrifying and magical. The morning version has fewer crowds than the night dive. Most tours leave from Honokohau Harbor around 8am and return by noon. Seeing a manta ray up close is a bucket-list moment.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 130
        },
        afternoon: {
          activity: "Beach day at Mauna Kea Beach",
          description: "Mauna Kea Beach is consistently ranked one of the best beaches in the US—and it lives up to the hype. White sand (rare on the Big Island), turquoise water, calm waves perfect for swimming. The beach is at the Mauna Kea Resort but open to the public (limited parking—get there by 10am). Rent snorkel gear from the hotel and explore the reef on the north end. Bring a cooler with sandwiches and drinks. Stay until mid-afternoon, then drive back to Kona.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        evening: {
          activity: "Manta ray night snorkel/dive",
          description: "This is THE Big Island experience. Book a night manta ray snorkel tour (not a dive—you just float on the surface). Boats take you to a spot off the Kona coast where underwater lights attract plankton, which attracts manta rays. You hold onto a floating board with lights underneath, and 10-15 manta rays do barrel rolls beneath you, mouths open, feeding on plankton. They're so close you could touch them (don't). It's surreal, otherworldly, and unlike anything else on Earth. Tours run 7-9pm. Book with Manta Ray Dives of Hawaii or Sea Paradise.",
          image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800",
          cost: 130
        }
      },
      {
        day: 4,
        morning: {
          activity: "Waipio Valley Lookout and hike",
          description: "Drive 1.5 hours north to Waipio Valley, the 'Valley of the Kings'—a sacred place with steep cliffs, waterfalls, taro fields, and black sand beaches. Park at the lookout for jaw-dropping views, then hike down the steep road into the valley (or book a 4WD tour if you don't want to hike). The descent is brutal (25% grade), but the valley floor is stunning: waterfalls everywhere, lush jungle, wild horses, ancient taro farms. Walk to the black sand beach where a river meets the ocean. The hike back up takes an hour and will destroy your quads. Worth it.",
          image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800",
          cost: 0
        },
        afternoon: {
          activity: "North Shore waterfalls and Hamakua Coast",
          description: "After Waipio, drive the Hamakua Coast—one of the most scenic drives in Hawaii. Stop at Akaka Falls (easy 0.5-mile loop to a 442-foot waterfall plunging through jungle), then grab lunch in Hawi or Honokaa. Continue to Pololu Valley Lookout (similar to Waipio but less crowded). The drive winds through rainforest, past banana farms and eucalyptus groves, with ocean views around every corner. It's Hawaii's jungle side—lush, wild, dramatic.",
          image: "https://images.unsplash.com/photo-1583979436033-2c45a0e5482d?w=800",
          cost: 0
        },
        evening: {
          activity: "Dinner at Merriman's in Waimea",
          description: "Merriman's is farm-to-table Hawaiian cuisine at its finest. The restaurant works with local ranchers and farmers—the menu changes based on what's fresh. Get the grass-fed Big Island beef or the wok-charred ahi (seared rare with ginger-soy). The mac nut pie is mandatory. The vibe is upscale but not stuffy. Waimea is cool and breezy (it's upcountry), a nice break from coastal heat. Reservations essential.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 140
        }
      },
      {
        day: 5,
        morning: {
          activity: "Makalawena Beach (hidden gem)",
          description: "This is the best beach on the Big Island that nobody knows about. You have to hike in—park at the end of a rough lava road (4WD recommended but not required, just drive slow), then hike 15-20 minutes over lava rock. The reward: a pristine white sand beach with turquoise water, tide pools, shade trees, and maybe 10 other people. Bring plenty of water, snacks, sunscreen. Snorkel in the tide pools, swim, nap on the sand. No facilities—it's pure, untouched Hawaii. Leave by early afternoon (it gets hot).",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        afternoon: {
          activity: "Explore Kailua-Kona town",
          description: "After the remote beach morning, hit up Kailua-Kona for some civilization. Walk along Ali'i Drive, browse surf shops and art galleries, get shave ice at Scandinavian Shave Ice (the haupia cream is essential). Visit Hulihee Palace if you're into Hawaiian history. Grab an afternoon beer at Kona Brewing Company and try the Longboard Lager. Do some last-minute souvenir shopping—Hawaiian Host chocolates, Kona coffee, a Big Island shirt.",
          image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
          cost: 40
        },
        evening: {
          activity: "Sunset and dinner at Brown's Beach House",
          description: "Your final Big Island dinner should be at Brown's Beach House at the Fairmont Orchid. Tables are right on the sand, torches light up as the sun sets, and the food is impeccable. Order the local fish with lilikoi beurre blanc, and don't skip the chocolate lava cake. Watch the sun drop into the ocean while sipping a cocktail. Reflect on swimming with manta rays, seeing active lava, hiking into sacred valleys. The Big Island showed you sides of Hawaii you didn't know existed.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 160
        }
      }
    ],
    
    accommodation: {
      name: "Royal Kona Resort",
      type: "Oceanfront Resort",
      pricePerNight: 185,
      nights: 7,
      description: "Lagoon-style pool, direct ocean access, central Kona location. Not ultra-luxury but solid value with great views and easy access to town and activities.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      alternative: "Splurge: Four Seasons Hualalai (~$800/night). Budget: Kona Seaside Hotel (~$120/night)"
    },
    
    tips: [
      {
        icon: "✈️",
        title: "Visa & Entry",
        content: "Same as Maui—US travelers need ID, international need ESTA/visa for US entry."
      },
      {
        icon: "🎒",
        title: "Packing",
        content: "Reef-safe sunscreen, hiking boots (lava rock is sharp), layers (volcanoes are cold), headlamp for lava viewing, waterproof phone case for snorkeling"
      },
      {
        icon: "🚗",
        title: "Transportation",
        content: "Rent a car with 4WD if you want to access remote beaches. The Big Island is HUGE (4x the size of Maui)—expect 2-3 hour drives for some activities."
      },
      {
        icon: "💡",
        title: "Insider Tips",
        content: "Book manta night snorkel ASAP (fills up fast). Check volcano activity status before going to HVNP (lava.usgs.gov). Bring cash for roadside fruit stands—the island is covered with them and the fruit is incredible. Don't try to do Kona + Hilo sides in one day—you'll spend all day driving."
      },
      {
        icon: "🌋",
        title: "Volcano Safety",
        content: "Stay on marked trails at HVNP. Volcanic fumes (vog) can affect breathing—if you have asthma, bring inhaler. Lava is unpredictable—obey all ranger warnings and closures."
      }
    ]
  },

  // ===== KAUAI, HAWAII =====
  {
    id: "kauai-hawaii",
    name: "Kauai, Hawaii",
    country: "USA",
    region: "hawaii",
    heroImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200",
    cardImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
    bestTime: "December - March",
    budget: "luxury",
    estimatedCost: 3300,
    seasons: ["winter", "spring"],
    climate: "Tropical, varies by coast: North (wet, lush), South (dry, sunny)",
    
    costs: {
      flights: '$850',
      accommodation: '$1450',
      food: '$700',
      activities: '$300',
      total: '$3300'
    },
    
    travelDays: {
      day0: "Depart Portland early morning → Arrive Lihue (LIH) afternoon. Pick up rental car, drive to Poipu, beach sunset, early dinner.",
      day6: "Morning at beach, return car, depart Lihue mid-afternoon → Portland evening"
    },
    
    itinerary: [
      {
        day: 1,
        morning: {
          activity: "Na Pali Coast boat tour (7am departure)",
          description: "The Na Pali Coast is Kauai's crown jewel—15 miles of towering emerald cliffs plunging into the Pacific, accessible only by boat, helicopter, or an 11-mile hike. Book a morning catamaran tour with Holo Holo or Captain Andy's. You'll motor along the coast while your captain points out sea caves, waterfalls cascading off 3,000-foot cliffs, and hidden valleys. Dolphins and sea turtles are common. The boat stops in a calm bay for snorkeling—the water is impossibly clear. You'll get breakfast and lunch on board. The cliffs are even more dramatic in person than in photos—they're the backdrop for Jurassic Park for a reason.",
          image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800",
          cost: 180
        },
        afternoon: {
          activity: "Recover at Poipu Beach",
          description: "After 5 hours on a boat, you'll want to plant yourself somewhere calm. Poipu Beach Park is perfect: golden sand, calm water for swimming, lifeguards, facilities, and a protected cove where monk seals often nap on the sand (don't approach—they're endangered and protected). Rent snorkel gear from nearby shops and explore the tide pools on the eastern side. The water is warm and clear. Stay until sunset—the light on the South Shore is golden and soft.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        evening: {
          activity: "Dinner at Merriman's Fish House in Poipu",
          description: "Merriman's Kauai location overlooks Poipu Beach—get a table on the outdoor patio at sunset. The menu is farm-to-table Hawaiian: grass-fed beef, fresh catch (the wok-charred ahi is unreal), organic vegetables from local farms. Everything is prepared simply to let the ingredients shine. Order the lilikoi cheesecake for dessert. The vibe is upscale casual—nice but not stuffy. Watch the sun sink into the ocean while you eat. This is why you came to Hawaii.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 140
        }
      },
      {
        day: 2,
        morning: {
          activity: "Waimea Canyon (Grand Canyon of the Pacific)",
          description: "Drive up to Waimea Canyon—a 10-mile-long, 3,000-foot-deep gorge carved by rivers and erosion over millions of years. The colors are insane: red, orange, green, brown, all striped through the canyon walls. Stop at multiple lookout points—each one reveals new angles. Drive to the top at Koke'e State Park for views of the Na Pali Coast from above (if clouds cooperate—mornings are clearest). Hike the Awaawapuhi Trail (6 miles roundtrip) for dramatic cliff-edge views 2,500 feet above the ocean. It's steep but the payoff is massive. Pack snacks and lots of water.",
          image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800",
          cost: 0
        },
        afternoon: {
          activity: "Polihale Beach (most remote beach in Hawaii)",
          description: "After Waimea Canyon, drive to Polihale Beach—17 miles of white sand on Kauai's west end, backed by giant sand dunes and cliffs. The dirt road to get there is rough (rental companies technically don't allow it, but everyone does it—just drive slow). This beach is massive, empty, and wild. The water can be rough, but you can walk for miles without seeing anyone. Bring a cooler with drinks and snacks—there's nothing out here. Stay for sunset—the sun drops into the ocean with the Na Pali cliffs silhouetted to the north. It's one of the most epic sunsets in Hawaii.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        evening: {
          activity: "Casual dinner in Hanapepe (Friday art night)",
          description: "If it's Friday, hit Hanapepe for their weekly art night—galleries stay open late, food trucks set up, local musicians play on the street. It's a tiny historic town with wooden storefronts and swinging bridges. Grab dinner from the food trucks (Thai, BBQ, fish tacos—all good) or eat at Kauai Island Brewing Company for pub food and local beer. The vibe is laid-back local Hawaii, not tourist Hawaii. It's refreshing.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 40
        }
      },
      {
        day: 3,
        morning: {
          activity: "Kayak the Wailua River to Fern Grotto",
          description: "Rent kayaks in Wailua (eastern side of the island) and paddle up the Wailua River—the only navigable river in Hawaii. It's a 2-mile paddle through lush jungle to Fern Grotto, a cave draped in ferns where weddings and performances happen. The paddle is easy, flat water, surrounded by green mountains and tropical vegetation. You might see wild chickens (they're everywhere on Kauai) and egrets. At Fern Grotto, explore the cave and listen to the acoustics—it's why musicians perform here. Paddle back and grab lunch at Shrimp Station (get the garlic shrimp plate—no frills, just flavor).",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 40
        },
        afternoon: {
          activity: "Wailua Falls and Opaekaa Falls",
          description: "After kayaking, drive to Wailua Falls—an 80-foot waterfall that plunges into a pool below. You can view it from a roadside lookout (easy) or hike down to the base (steep, muddy, sketchy—your call). Next, drive to Opaekaa Falls, another stunning waterfall visible from a paved lookout. The falls are framed by jungle and mountains—it's quintessential Kauai. Bring your camera. Both falls are quick stops, so you'll have the afternoon to relax.",
          image: "https://images.unsplash.com/photo-1583979436033-2c45a0e5482d?w=800",
          cost: 0
        },
        evening: {
          activity: "Sunset dinner at The Beach House Restaurant",
          description: "The Beach House in Poipu is literally on the rocks at the water's edge—waves crash while you eat. Get there before sunset and request a window table. The seafood is excellent (try the macadamia crusted catch or the crab cakes), and the desserts are worth the calories. The mai tais are dangerously good. Watch the sun set over the ocean, then walk on the beach afterward. The restaurant has been here since 1991 and has perfected the sunset dinner experience.",
          image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
          cost: 120
        }
      },
      {
        day: 4,
        morning: {
          activity: "North Shore: Hanalei Bay and Princeville",
          description: "Drive to the North Shore—the most beautiful part of Kauai. Hanalei Bay is a crescent-shaped beach with mountains rising behind it, postcard-perfect. The town of Hanalei is tiny and charming: surf shops, shave ice, food trucks, aloha spirit. Walk the pier, swim in the bay (calm in summer, big waves in winter), or just sit and stare at the view. Drive through Princeville and stop at the Hanalei Valley Lookout—taro fields stretch across the valley floor with waterfalls cascading down the mountains behind. It's the Hawaii of your imagination.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        afternoon: {
          activity: "Tunnels Beach snorkeling and Makua Beach (Tunnels)",
          description: "Tunnels Beach (Ha'ena Beach) has the best snorkeling on Kauai—coral reefs, sea turtles, tropical fish, and underwater lava tubes ('tunnels') you can swim through. The reef creates calm areas perfect for snorkeling. Get there early (parking fills up). Bring your own gear or rent nearby. After snorkeling, walk west to Makua (Tunnels) Beach, a quieter stretch with views of Bali Hai (the mountain from South Pacific). Relax on the sand, swim, soak in the North Shore vibes. The water is turquoise, the mountains are green, the sand is golden. It's paradise.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 0
        },
        evening: {
          activity: "Dinner at Bar Acuda in Hanalei",
          description: "Bar Acuda is a tapas-style restaurant in downtown Hanalei—small plates, creative cocktails, farm-to-table ingredients. Sit at the bar and order a bunch of dishes to share: the seared ahi, the beet salad, the homemade pasta, whatever sounds good. Everything is fresh and flavorful. The wine list is solid. The vibe is casual and buzzy—locals and tourists mix at the bar. After dinner, walk through town and get gelato at Lappert's. North Shore nights are cool and breezy—it's perfect.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 90
        }
      },
      {
        day: 5,
        morning: {
          activity: "Kalalau Trail (first 2 miles to Hanakapi'ai Beach)",
          description: "The Kalalau Trail is an 11-mile trail along the Na Pali Coast—one of the most beautiful and dangerous hikes in the world. You're not doing the whole thing (that requires permits and camping), but the first 2 miles to Hanakapi'ai Beach are open to everyone and absolutely worth it. The trail hugs sea cliffs, climbs and descends through valleys, crosses streams, and delivers jaw-dropping views of the coast. It's strenuous—muddy, steep, exposed—but the payoff is Hanakapi'ai Beach, a wild black sand beach surrounded by cliffs. Don't swim here (the currents are deadly), but explore the beach and catch your breath before hiking back. Bring water, snacks, good shoes, and start early.",
          image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800",
          cost: 0
        },
        afternoon: {
          activity: "Queen's Bath (if calm conditions)",
          description: "Queen's Bath is a natural tide pool on the North Shore where you can swim in crystal-clear water while waves crash around you. BUT: it's only safe in calm conditions (summer). In winter or when surf is up, people die here every year. Check conditions at your hotel, and if there's any doubt, skip it. If it's safe, hike down (short but steep), swim in the pools, and watch waves explode against the lava rocks. It's thrilling when it's safe, deadly when it's not. Don't be a statistic.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 0
        },
        evening: {
          activity: "Final dinner at Red Salt at Ko'a Kea",
          description: "End your Kauai trip at Red Salt, the upscale restaurant at Ko'a Kea Resort in Poipu. The chef focuses on Hawaiian ingredients with global techniques—think miso butterfish, macadamia crusted lamb, lilikoi panna cotta. Request a table on the ocean-view patio. Order a bottle of wine, share a few dishes, and reflect on the week: you paddled through jungles, hiked along sea cliffs, snorkeled with turtles, watched sunsets from remote beaches. Kauai is the most natural, untouched Hawaiian island—and you got to experience it. Toast to that.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 150
        }
      }
    ],
    
    accommodation: {
      name: "Sheraton Kauai Resort",
      type: "Beachfront Resort",
      pricePerNight: 210,
      nights: 7,
      description: "Right on Poipu Beach, great pools, multiple restaurants, close to South Shore activities. Good value for a full-service resort on the beach.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      alternative: "Budget: Kauai Beach Resort (~$150/night). Splurge: 1 Hotel Hanalei Bay (~$600/night, North Shore)"
    },
    
    tips: [
      {
        icon: "✈️",
        title: "Visa & Entry",
        content: "US travelers need ID. International travelers need ESTA/visa for US entry."
      },
      {
        icon: "🎒",
        title: "Packing",
        content: "Rain jacket (North Shore gets wet), hiking boots with good tread (trails are muddy), reef-safe sunscreen, bug spray, multiple swimsuits, snorkel gear (saves rental costs)"
      },
      {
        icon: "🚗",
        title: "Transportation",
        content: "Rent a car. Consider a Jeep or SUV for rough roads to remote beaches. The island is small but drives take longer than they look—windy roads, slow speed limits."
      },
      {
        icon: "💡",
        title: "Insider Tips",
        content: "Book Na Pali boat tour early (weather cancellations common in winter). Download offline maps—cell service is spotty. Wild chickens are everywhere (legacy of Hurricane Iniki in 1992). Don't hike Kalalau Trail in flip-flops—people get airlifted out regularly."
      },
      {
        icon: "⚠️",
        title: "Safety Warning",
        content: "Queen's Bath and other tide pools kill people every year. ONLY go when surf is flat (summer). If waves are crashing over the rocks, DO NOT ENTER. The ocean is more powerful than you think. Check surf reports daily."
      }
    ]
  },

  // ===== TULUM, MEXICO =====
  {
    id: "tulum-mexico",
    name: "Tulum, Mexico",
    country: "Mexico",
    region: "mexico",
    heroImage: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200",
    cardImage: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=400",
    bestTime: "November - March",
    budget: "budget",
    estimatedCost: 2600,
    seasons: ["winter", "spring"],
    climate: "Tropical, 75-85°F, occasional rain",
    
    costs: {
      flights: '$650',
      accommodation: '$1050',
      food: '$500',
      activities: '$400',
      total: '$2600'
    },
    
    travelDays: {
      day0: "Depart Portland early morning → Arrive Cancun (CUN) afternoon. Shuttle/rental car to Tulum (90 min drive). Check in, beach walk, tacos for dinner.",
      day6: "Morning at beach, return to Cancun airport (90 min), depart afternoon → Portland evening"
    },
    
    itinerary: [
      {
        day: 1,
        morning: {
          activity: "Tulum Ruins at sunrise",
          description: "Wake up at 6am and be at the Tulum ruins when they open at 8am—you want to beat the crowds and the heat. These Mayan ruins sit on 40-foot cliffs overlooking the Caribbean, and the views are ridiculous: turquoise water, white sand beaches, ancient stone temples. The site is small (you can see everything in 90 minutes), but it's one of the most photogenic archaeological sites in Mexico. El Castillo, the main temple, is the postcard shot. After exploring, walk down to the beach below the ruins and swim—yes, you can swim at a Mayan ruin. The water is warm and clear. By 10am, tourist groups arrive, so you're done at the perfect time.",
          image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800",
          cost: 5
        },
        afternoon: {
          activity: "Cenote Dos Ojos (snorkel/dive)",
          description: "Cenotes are freshwater sinkholes unique to the Yucatan—underground cave systems filled with crystal-clear water. Dos Ojos ('Two Eyes') is one of the best for snorkeling: you swim through two connected cenotes with stalactites, stalagmites, and shafts of light piercing the water. It's surreal—like swimming in an alien world. The water is cold (72°F) but refreshing after the heat. Rent snorkel gear on-site, or book a guided dive if you're certified. After, grab lunch at the cenote's restaurant—simple but good ceviche and tacos. Pro tip: cenotes are best in the morning when light beams are strongest.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 25
        },
        evening: {
          activity: "Dinner and beach club at Papaya Playa Project",
          description: "Tulum's beach club scene is world-famous, and Papaya Playa Project is the OG. Boho-chic vibes: driftwood furniture, fire pits, DJ spinning house music, cocktails in your hand, feet in the sand. Order the grilled octopus or fresh ceviche, drink mezcal cocktails, and watch the sunset turn the sky pink and orange. As night falls, the beach club transforms—bonfires light up, music gets louder, and the party starts. You can stay and dance or head back to your hotel—either way, you just experienced peak Tulum vibes.",
          image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
          cost: 80
        }
      },
      {
        day: 2,
        morning: {
          activity: "Sian Ka'an Biosphere boat tour",
          description: "Book a morning tour of Sian Ka'an, a UNESCO biosphere reserve south of Tulum—1.3 million acres of protected jungle, mangroves, and lagoons. You'll boat through canals spotting crocodiles, dolphins, manatees, and hundreds of bird species. The guide will take you to a remote beach for swimming and snorkeling, then float down a lazy canal through mangroves (it's nicknamed the 'lazy river'). Pack sunscreen, a hat, and water—it's hot and exposed. Tours run 6 hours and include lunch (usually fresh ceviche). You'll see a wild, untouched side of the Riviera Maya that most tourists never experience.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 100
        },
        afternoon: {
          activity: "Relax at your hotel/beach club",
          description: "After a full morning in the sun, take the afternoon slow. Tulum's beach is white sand and turquoise water—find a spot at your hotel's beach club or rent a day bed at Coco Tulum or Nomade. Order a cold beer or mezcal cocktail, swim, read a book, nap in a hammock. This is what Tulum is about: slowing down, disconnecting, being present. The beach scene is more laid-back than Cancun—fewer jet skis, more yoga and good vibes.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 20
        },
        evening: {
          activity: "Dinner at Hartwood (if you can get a reservation)",
          description: "Hartwood is Tulum's most famous restaurant—no electricity, wood-fired everything, ingredients from local fishermen and farmers. The menu changes daily based on what's fresh. Think grilled whole fish with salsa macha, octopus with black beans, wood-roasted vegetables. Reservations open at noon one day before—set an alarm and book immediately (they fill in minutes). If you can't get Hartwood, try Kitchen Table or Arca—both excellent. Tulum's food scene punches way above its weight. Expect to pay $100+ for two, and it's worth every peso.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 110
        }
      },
      {
        day: 3,
        morning: {
          activity: "Gran Cenote (swim and snorkel)",
          description: "Gran Cenote is 5 minutes from Tulum town—a massive open-air cenote with sections you can snorkel and sections you can swim. The water is crystal clear (you can see 50+ feet down), and there are underwater caves you can explore (stay in the daylight zones unless you're a certified cave diver). Turtles live in the cenote—you'll swim with them. The site has lockers, showers, and snorkel rentals. Get there when it opens at 8am to avoid crowds. After, grab breakfast at Burrito Amor in town—huge burritos, fresh juice, outdoor seating.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 10
        },
        afternoon: {
          activity: "Explore Tulum town and art galleries",
          description: "Tulum town is separate from the beach zone—it's where locals live and eat, and prices are way cheaper. Walk down Avenida Tulum, browse art galleries and shops selling handmade goods (skip the touristy ones), and grab lunch at El Camello Jr—a no-frills seafood joint where locals eat. Order the fish tacos and ceviche tostadas. After lunch, visit Loco Love for raw chocolate truffles (they're vegan and stupidly good). Tulum has a strong wellness/art/conscious living scene—you'll see yoga studios, vegan cafes, and crystal shops everywhere. Lean into it or laugh at it, your call.",
          image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800",
          cost: 20
        },
        evening: {
          activity: "Sunset and dinner at Gitano",
          description: "Gitano is a jungle restaurant with mezcal cocktails, live music, and a sexy, candlelit vibe. The space is open-air with trees growing through the roof and DJ sets that transition into live bands. Order the aguachile (spicy shrimp ceviche) and tacos al pastor. The mezcal list is extensive—try a flight if you're new to it. As the sun sets, the jungle lights up with string lights and candles. Stick around for the music—it ranges from Latin jazz to electronic, always good. This is peak Tulum: beautiful people, great food, jungle setting, mezcal flowing.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 90
        }
      },
      {
        day: 4,
        morning: {
          activity: "Day trip to Cobá ruins and climb Nohoch Mul",
          description: "Cobá is 45 minutes from Tulum—an ancient Mayan city in the jungle. Unlike Tulum, Cobá is HUGE: over 30 square miles of ruins spread through the forest. Rent bikes at the entrance to get around (walking takes forever in the heat). The main draw is Nohoch Mul, a 138-foot pyramid you can actually climb—one of the last pyramids in Mexico that still allows it. The climb is steep (120 steps), but the view from the top is insane: jungle canopy stretching to the horizon in every direction. Get there early (opens at 8am) before the heat and crowds. After climbing, explore the ball courts and stelae, then bike back and cool off with a fresh coconut water.",
          image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800",
          cost: 10
        },
        afternoon: {
          activity: "Cenote Multum-Ha and lunch in Cobá village",
          description: "After Cobá, stop at Cenote Multum-Ha—a lesser-known cenote near the ruins. It's partially open-air, partially cave, with a rope swing and platforms for jumping. The water is clear and cool, perfect after sweating through the ruins. There are usually fewer people here than the popular cenotes. Afterward, eat lunch in Cobá village—simple restaurants near the ruins serve fresh cochinita pibil (slow-roasted pork) and handmade tortillas. It's cheap, authentic, and delicious. Drive back to Tulum and rest at your hotel before dinner.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 15
        },
        evening: {
          activity: "Casual dinner at Antojitos La Chiapaneca",
          description: "Tonight, skip the fancy beach clubs and eat where locals eat. Antojitos La Chiapaneca is a roadside taco stand in Tulum town—plastic chairs, fluorescent lights, and some of the best tacos you'll eat in Mexico. Order cochinita pibil, pastor, and whatever looks good. Everything is made to order, portions are huge, and nothing costs more than $2. Wash it down with a cold Mexican Coke or horchata. This is real Tulum, away from the Instagram aesthetic and inflated beach prices. Sometimes the best meals are the simplest.",
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
          cost: 20
        }
      },
      {
        day: 5,
        morning: {
          activity: "Beach morning and final swim",
          description: "Your last full day—make it count. Sleep in, then head to the beach early. Playa Paraiso (just north of the ruins) is one of the most beautiful stretches: white sand, swaying palms, turquoise water. Rent a cabana or just lay a towel on the sand. Swim, read, soak in the sun. Order fresh coconuts and ceviche from beach vendors. This is your last chance to be in the Caribbean—be present, take mental snapshots, breathe in the salt air. Stay until early afternoon.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        afternoon: {
          activity: "Temazcal ceremony (traditional Mayan sweat lodge)",
          description: "Book a temazcal ceremony for the afternoon—it's a traditional Mayan purification ritual in a volcanic stone sweat lodge. A shaman leads the ceremony, pouring water over hot stones while chanting and playing drums. It's intense—hot, dark, spiritual—but many people find it transformative. Sessions last 1-2 hours. Afterward, you'll feel physically exhausted but mentally clear. Many hotels and wellness centers offer this. It's a meaningful way to end your Tulum trip, connecting with the area's indigenous roots. If temazcal isn't your thing, book a massage or spa treatment instead.",
          image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
          cost: 60
        },
        evening: {
          activity: "Final dinner at Casa Jaguar",
          description: "End your Tulum week at Casa Jaguar, a jungle restaurant with a massive tree growing through the middle of the dining room. The vibe is romantic and atmospheric—candles everywhere, live music, open-air seating. The menu is Mexican with global influences: grilled octopus, duck tacos, mezcal-braised short ribs. The cocktails are creative (try the Jaguar—mezcal, passionfruit, habanero). After dinner, walk through the jungle path lit by torches back to the main road. Tulum has a magical quality at night—mysterious, romantic, alive. This is how you close out a perfect week.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 100
        }
      }
    ],
    
    accommodation: {
      name: "La Valise Tulum",
      type: "Boutique Beach Hotel",
      pricePerNight: 150,
      nights: 7,
      description: "Small, stylish hotel right on the beach. Boho-chic design, personalized service, great food. More intimate than big resorts, perfect for couples.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      alternative: "Budget: Mama's Home Tulum hostel (~$40/night). Splurge: Azulik (~$400/night, treehouse villas, no electricity)"
    },
    
    tips: [
      {
        icon: "✈️",
        title: "Visa & Entry",
        content: "US citizens don't need a visa for Mexico (tourist card issued on arrival, free). Valid passport required (must be valid 6 months beyond travel dates)."
      },
      {
        icon: "🎒",
        title: "Packing",
        content: "Biodegradable sunscreen and bug spray (required in cenotes), light layers for air-conditioned spaces, water shoes for cenotes, reusable water bottle, mosquito repellent, hand sanitizer"
      },
      {
        icon: "🚗",
        title: "Transportation",
        content: "Rent a car for flexibility (explore cenotes and ruins on your schedule), or use taxis/colectivos (shared vans) to get around. Uber doesn't operate officially but some drivers use it discreetly. Beach zone is bikeable but spread out."
      },
      {
        icon: "💡",
        title: "Insider Tips",
        content: "Bring cash (pesos preferred—better exchange rates than USD). ATMs sometimes run out on weekends. Beach zone restaurants are 2-3x more expensive than town. Book Hartwood reservations exactly at noon. Tipping: 10-15% is standard. Don't drink tap water."
      },
      {
        icon: "🌊",
        title: "Beach Safety",
        content: "Seaweed (sargassum) can be an issue May-August. Check recent conditions before booking. Some beaches have strong currents—swim where locals swim. Cenotes: don't wear sunscreen before entering (pollutes the water)."
      }
    ]
  },

  // ===== CABO SAN LUCAS, MEXICO =====
  {
    id: "cabo-mexico",
    name: "Cabo San Lucas, Mexico",
    country: "Mexico",
    region: "mexico",
    heroImage: "https://images.unsplash.com/photo-1564786403-366f23977aa5?w=1200",
    cardImage: "https://images.unsplash.com/photo-1564786403-366f23977aa5?w=400",
    bestTime: "November - April",
    budget: "luxury",
    estimatedCost: 2400,
    seasons: ["winter", "spring"],
    climate: "Desert coast, 75-85°F, sunny and dry",
    
    costs: {
      flights: '$550',
      accommodation: '$1050',
      food: '$450',
      activities: '$350',
      total: '$2400'
    },
    
    travelDays: {
      day0: "Depart Portland morning → Arrive Cabo (SJD) early afternoon. Shuttle to hotel, check in, beach walk, sunset margaritas, tacos for dinner.",
      day6: "Beach morning, pack up, shuttle to airport, depart Cabo afternoon → Portland evening"
    },
    
    itinerary: [
      {
        day: 1,
        morning: {
          activity: "El Arco boat tour and Lover's Beach",
          description: "Start with the iconic Cabo experience: boat to El Arco (The Arch), the natural rock formation where the Pacific Ocean meets the Sea of Cortez. Water taxis leave from the marina every 15 minutes ($15 roundtrip). The ride takes 10 minutes, passing sea lion colonies and Divorce Beach (where waves crash violently). Get dropped at Lover's Beach, a protected cove with calm turquoise water perfect for swimming. The beach is only accessible by boat—no crowds, just sand and rock formations. Bring snorkel gear (rent from vendors) to explore the underwater rocks where tropical fish hang out. Stay 2-3 hours, then catch a water taxi back.",
          image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800",
          cost: 15
        },
        afternoon: {
          activity: "Medano Beach and lunch at Office on the Beach",
          description: "After El Arco, head to Medano Beach—Cabo's main beach and the only swimmable beach in downtown Cabo. The Pacific side has massive waves (not safe), but Medano on the Sea of Cortez is calm and perfect for swimming. Set up at The Office on the Beach, a beachfront restaurant with chairs, umbrellas, and waiters bringing drinks to your spot. Order fish tacos and a bucket of Pacificos. Swim, float, people-watch. Jet skis and parasailing operators cruise by if you want action. Stay until mid-afternoon, then head back to your hotel to shower and rest.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 40
        },
        evening: {
          activity: "Sunset dinner at Sunset Monalisa",
          description: "Sunset Monalisa sits on cliffs overlooking the ocean and El Arco—it's one of the best sunset views in Cabo. Get there 45 minutes before sunset, request a window table, and order Mediterranean-inspired seafood: grilled octopus, fresh oysters, lobster risotto. The sunset over the Pacific is dramatic—the sky turns gold, pink, and purple while waves crash below. After dark, the restaurant lights up with candles and becomes romantic as hell. Splurge a little here ($150 for two)—the view and food are worth it. This sets the tone for your Cabo week: beautiful, indulgent, relaxed.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 150
        }
      },
      {
        day: 2,
        morning: {
          activity: "Snorkeling at Santa Maria or Chileno Bay",
          description: "Book a morning snorkeling tour (or go independently) to Santa Maria or Chileno Bay—two of the best snorkel spots in Cabo. The water is clear, the reefs are healthy, and you'll see tons of tropical fish, maybe a sea turtle or ray. Chileno Bay is a protected marine park with calm water and easy access from the beach. Santa Maria is a quiet cove reachable by boat or car. Tours often hit both spots plus provide gear and lunch. If you go solo, rent gear in town and drive to Chileno—it's free, less crowded, and you can go at your own pace. Best time is morning before wind picks up.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 80
        },
        afternoon: {
          activity: "Pool and spa time at your resort",
          description: "After a morning in the sun and saltwater, take the afternoon easy. Cabo resorts are known for incredible pools—infinity edges, swim-up bars, hot tubs with ocean views. Order a frozen drink, float in the pool, and do nothing. If you're feeling fancy, book a couples massage at the resort spa. Many spas have outdoor treatment areas with ocean views. Get the hot stone massage or a body scrub. Emerge rejuvenated and ready for a big night out. Cabo is as much about relaxing at beautiful resorts as it is about activities—embrace it.",
          image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
          cost: 0
        },
        evening: {
          activity: "Dinner and nightlife in downtown Cabo",
          description: "Tonight, experience Cabo's party side. Start with dinner at Edith's—a longtime favorite with rooftop seating, great margaritas, and solid Mexican food (try the coconut shrimp and molcajete). After dinner, walk down to Cabo Wabo Cantina (Sammy Hagar's bar) for live rock music and tequila shots, or hit El Squid Roe for dancing and spring break energy. If that's not your scene, try The Rooftop at The Cape for upscale cocktails and ocean views. Cabo's nightlife ranges from dive bars to luxury lounges—there's something for everyone. Uber back to your hotel when you're done.",
          image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800",
          cost: 80
        }
      },
      {
        day: 3,
        morning: {
          activity: "ATV tour through desert and beaches",
          description: "Book a morning ATV tour—you'll ride through desert landscapes, riverbeds, and up to mountain viewpoints overlooking the ocean. Most tours include a stop at a beach where you can swim. The desert around Cabo is beautiful in a stark way: cacti, red rocks, sand dunes. It's fun as hell—dusty, bumpy, fast. Tours provide helmets and goggles. You'll get dirty (wear clothes you don't care about) but it's worth it. Some tours stop at a local ranch for tequila tastings. Tours run 2-3 hours and pick you up from your hotel. It's touristy but genuinely fun.",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
          cost: 100
        },
        afternoon: {
          activity: "Lunch in San Jose del Cabo's Art District",
          description: "After ATVs, shower and drive 30 minutes to San Jose del Cabo, Cabo's quieter, more charming neighbor. The historic downtown has cobblestone streets, colorful buildings, art galleries, and a much more authentic Mexican vibe than Cabo San Lucas. Walk through the Art District (Thursdays 5-9pm they do an Art Walk, but it's nice any day), browse galleries, and have lunch at Acre—a farm-to-table restaurant with beautiful outdoor seating in a jungle garden. The food is fresh and creative (wood-fired veggies, fresh catch, house-made pasta). Stay for a mezcal cocktail and explore the shops before heading back.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 50
        },
        evening: {
          activity: "Sunset at your resort",
          description: "You've been going hard—tonight, stay at your resort. Watch the sunset from your balcony or the beach with a drink in hand. Many Cabo resorts have multiple restaurants on-site—try one you haven't yet. Order room service and eat on your balcony if you want. Sometimes the best vacation nights are the ones where you do absolutely nothing except exist in a beautiful place. Tomorrow is another adventure.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 60
        }
      },
      {
        day: 4,
        morning: {
          activity: "Whale watching tour (Dec-April)",
          description: "If you're in Cabo between December and April, whale watching is mandatory. Humpback and gray whales migrate to Baja's warm waters to breed and calve—you'll see them breaching, tail-slapping, and spouting. Tours leave from the marina and head into the Pacific. Seeing a 40-ton humpback launch itself out of the water is one of nature's most incredible sights. Tours run 2-3 hours, and sightings are nearly guaranteed during peak season (Jan-Mar). Bring a camera with a good zoom lens, sunscreen, and seasickness meds if you're prone. If it's not whale season, book a fishing charter or sunset cruise instead.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 90
        },
        afternoon: {
          activity: "Beach club hopping: Cabo Surf Hotel or Chileno Bay Resort",
          description: "After whales, hit up a beach club for the afternoon. Cabo Surf Hotel has a great beach club with a pool, restaurant, and surf vibes. Chileno Bay Resort allows non-guests to use their beach club (call ahead)—the beach is pristine, the pool is gorgeous, and the service is top-notch. Order ceviche and aguachile, drink cold beer, swim in the calm bay. Beach clubs in Cabo are a scene—beautiful people, great food, DJ sets in the background. Lean into it. This is peak vacation: doing nothing in a beautiful place with a drink in your hand.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 50
        },
        evening: {
          activity: "Dinner at Flora's Field Kitchen",
          description: "Drive 20 minutes inland to Flora's Field Kitchen, a farm-to-table restaurant in the middle of an organic farm. The setting is stunning: outdoor tables surrounded by gardens, mountain views, twinkle lights at night. The menu changes based on what's growing, but expect wood-fired pizzas, fresh salads, grilled fish, and house-made desserts. Everything is organic and delicious. It's a totally different vibe from resort restaurants—rustic, authentic, farm-focused. Make reservations (it's popular) and go at sunset. The drive through the desert is beautiful, and the meal will be one of your best in Cabo.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 90
        }
      },
      {
        day: 5,
        morning: {
          activity: "Final beach morning and souvenir shopping",
          description: "Your last full day—make it count. Sleep in, then head to Medano Beach one more time. Swim, float, soak in the sun. Walk down to the marina and browse the shops—lots of silver jewelry, Talavera pottery, sombreros (if that's your thing). Pick up last-minute gifts: hot sauce, tequila, Mexican vanilla, handmade blankets. Grab lunch at Baja Brewing Company (excellent fish tacos and craft beer). Take your time. Your flight isn't until tomorrow.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 30
        },
        afternoon: {
          activity: "Spa treatment or lazy pool afternoon",
          description: "Book a final spa treatment—maybe a tequila body scrub or hot stone massage—or just post up at the pool with a book and a drink. This is your last afternoon in paradise. Be present in it. Watch the waves, feel the sun, taste the salt in the air. Cabo has a way of making you forget about work, stress, responsibilities. Soak in that feeling.",
          image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
          cost: 120
        },
        evening: {
          activity: "Final dinner at The Cape Hotel's Manta restaurant",
          description: "End your Cabo trip at Manta, the stunning restaurant at The Cape hotel. It's perched on cliffs overlooking the ocean, with dramatic architecture and floor-to-ceiling windows. The food is modern Mexican—think smoked marlin tostadas, beef short rib with mole, coconut flan. The cocktails are creative and strong. Request a table by the window at sunset. Watch the Pacific turn gold, pink, then purple while you eat. After dinner, walk out to the cliffside infinity pool (open to diners) and take in the view one last time. This is how you close out a perfect Cabo week: in style, with great food, watching the ocean.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 140
        }
      }
    ],
    
    accommodation: {
      name: "Pueblo Bonito Pacifica",
      type: "Adults-Only Beach Resort",
      pricePerNight: 150,
      nights: 7,
      description: "All-inclusive option on the Pacific side with beautiful pools, spa, and multiple restaurants. Adults-only means quieter, more relaxing. Great value for all-inclusive.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      alternative: "Budget: Cabo Villas Beach Resort (~$100/night). Splurge: Waldorf Astoria Los Cabos Pedregal (~$600/night)"
    },
    
    tips: [
      {
        icon: "✈️",
        title: "Visa & Entry",
        content: "US citizens don't need a visa (tourist card on arrival). Valid passport required (6 months validity). Keep the tourist card—you need it to exit Mexico."
      },
      {
        icon: "🎒",
        title: "Packing",
        content: "Sunscreen (sun is intense), hat, sunglasses, light layers for air-con, dressy outfit for nice dinners, water shoes for rocky beaches, motion sickness meds for boats"
      },
      {
        icon: "🚗",
        title: "Transportation",
        content: "Rent a car if you want to explore (San Jose, remote beaches). Otherwise, taxis and Uber work fine for getting around. Many resorts offer shuttles to downtown. Don't drink and drive—DUIs in Mexico are serious."
      },
      {
        icon: "💡",
        title: "Insider Tips",
        content: "Bring cash (USD accepted everywhere but pesos get better rates). Don't drink tap water. Tipping: 15-20% at restaurants, $1-2 per drink at bars. Whale season is Dec-Apr (peak Jan-Mar). Downtown Cabo is touristy and expensive—San Jose del Cabo is more authentic."
      },
      {
        icon: "🌊",
        title: "Ocean Safety",
        content: "NEVER swim on the Pacific beaches—rip currents kill people every year. Only swim where locals swim (Sea of Cortez side). Red flags mean no swimming, period. Respect the ocean—it's stronger than you think."
      }
    ]
  },

  // ===== COSTA RICA (GUANACASTE) =====
  {
    id: "costa-rica",
    name: "Costa Rica (Guanacaste)",
    country: "Costa Rica",
    region: "europe", // Using "europe" as a catch-all for non-Hawaii/Mexico
    heroImage: "https://images.unsplash.com/photo-1564759298141-cef86f51d4d4?w=1200",
    cardImage: "https://images.unsplash.com/photo-1564759298141-cef86f51d4d4?w=400",
    bestTime: "December - April (dry season)",
    budget: "budget",
    estimatedCost: 2800,
    seasons: ["winter", "spring"],
    climate: "Tropical, 80-95°F, humid",
    
    costs: {
      flights: '$700',
      accommodation: '$1100',
      food: '$550',
      activities: '$450',
      total: '$2800'
    },
    
    travelDays: {
      day0: "Depart Portland early morning → Arrive Liberia (LIR) afternoon. Pick up rental car, drive to Tamarindo/Playa Flamingo area (1 hour), check in, beach sunset.",
      day6: "Morning at beach, return car to Liberia airport, depart afternoon → Portland evening"
    },
    
    itinerary: [
      {
        day: 1,
        morning: {
          activity: "Zip-lining through the rainforest canopy",
          description: "Costa Rica invented zip-lining, so you have to do it here. Book a tour with Monkey Jungle or Diamante Eco Adventure Park—you'll zip through rainforest canopy on cables hundreds of feet long and high above the jungle floor. Some lines are over a mile long. The views are insane: ocean in the distance, green canopy below, howler monkeys screaming in the trees. Guides are professionals and the gear is safe. Most tours include 10-15 zip lines plus hanging bridges and sometimes a Tarzan swing. Tours run 3-4 hours and pick you up from your hotel. You'll feel like you're flying.",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
          cost: 90
        },
        afternoon: {
          activity: "Beach time at Playa Conchal",
          description: "After zip-lining, drive to Playa Conchal, a beach made entirely of crushed shells that looks white from a distance. The water is calm and turquoise, perfect for swimming and snorkeling. Rent gear from vendors and explore the reefs—you'll see tropical fish, maybe a ray or turtle. The Westin Resort sits on this beach, and their beach club is open to non-guests (buy food/drinks and you can use chairs and facilities). Stay until late afternoon, then drive back to your hotel to shower.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        evening: {
          activity: "Sunset and dinner in Tamarindo",
          description: "Drive to Tamarindo, Guanacaste's surf town—laid-back, young, beach vibes. Walk the main street browsing shops and art galleries. Watch the sunset from the beach—surfers catching last waves, sky turning orange and pink. For dinner, try Pangas Beach Club (upscale beachfront with fresh seafood and creative cocktails) or Dragonfly Bar & Grill (fusion cuisine, excellent ceviches). After dinner, grab gelato at Pops and walk the beach. Tamarindo has a chill nightlife—beach bars, live music, no pressure. It's the opposite of Cabo's party scene, and that's refreshing.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 70
        }
      },
      {
        day: 2,
        morning: {
          activity: "Surfing lesson at Tamarindo Beach",
          description: "Tamarindo is one of the best beginner surf beaches in the world—gentle waves, sandy bottom, warm water. Book a 2-hour lesson with a local surf shop (Witch's Rock Surf Camp or Iguana Surf are solid). Instructors are patient and most people stand up on their first day. Even if you wipe out constantly, it's fun as hell. The water is bath-temperature, so you don't need a wetsuit. After your lesson, rent a board and practice on your own, or just float around and watch the better surfers. Surfing is hard but addictive—you might book another lesson for later in the week.",
          image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800",
          cost: 60
        },
        afternoon: {
          activity: "Lunch and explore Las Baulas National Marine Park",
          description: "After surfing, grab lunch at Nogui's—a Tamarindo institution with huge portions of fresh fish, rice, beans, and plantains. It's cheap and delicious. Then drive 10 minutes to Las Baulas National Marine Park, home to leatherback sea turtles (if you're there Oct-Mar, book a night turtle tour—watching turtles nest is unforgettable). Walk the trails through dry forest and mangroves. Playa Grande beach is pristine and less crowded than Tamarindo. Swim, walk, look for wildlife (howler monkeys, iguanas, exotic birds are common).",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 15
        },
        evening: {
          activity: "Casual dinner at Eat at Joe's",
          description: "Eat at Joe's is a Tamarindo favorite—open-air restaurant, surf videos playing, cold beer, and excellent food. The fish tacos are famous, but everything is good. The vibe is surfer-friendly and unpretentious. Sit at the bar, chat with locals and expats, and soak in the Pura Vida energy. Costa Ricans have a saying: Pura Vida (pure life). It means take it easy, enjoy the moment, don't stress. You'll hear it constantly, and by day two, you'll feel it. After dinner, walk back to your hotel along the beach—the stars are incredible away from city lights.",
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
          cost: 40
        }
      },
      {
        day: 3,
        morning: {
          activity: "Palo Verde National Park boat tour (wildlife)",
          description: "Book a morning boat tour of Palo Verde National Park—one of Central America's most biodiverse wetlands. You'll glide down the Tempisque River in a small boat, spotting crocodiles, caimans, monkeys, sloths, iguanas, and hundreds of bird species (including scarlet macaws and jabiru storks). The guide will point out wildlife you'd never see on your own. Bring binoculars and a camera with zoom. Tours run 3-4 hours and include breakfast. The park is about 90 minutes from Tamarindo—drive yourself or book transport. This is peak Costa Rica: wildlife everywhere, lush jungle, rivers, birds screaming overhead.",
          image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800",
          cost: 75
        },
        afternoon: {
          activity: "Hot springs and mud baths at Rincón de la Vieja",
          description: "After the boat tour, drive to Rincón de la Vieja Volcano area (60 min from Palo Verde). Book entry to a hot springs resort like Borinquen or Blue River—volcanic hot springs, natural mud baths, waterfalls, and pools set in the jungle. Slather yourself in volcanic mud (it's supposed to be good for your skin), let it dry, then rinse off in a waterfall. Soak in hot springs pools with jungle views. It feels absurd and amazing. Most resorts include lunch and access to trails. Stay until mid-afternoon, then drive back to your hotel.",
          image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
          cost: 50
        },
        evening: {
          activity: "Dinner at Ginger Restaurant & Bar in Playa Flamingo",
          description: "Drive to Playa Flamingo for dinner at Ginger, an upscale Asian-fusion restaurant with ocean views. The menu is creative: Thai curries, sushi rolls, Korean BBQ, all made with fresh local ingredients. The cocktails are excellent (try the lychee martini). Sit on the patio and watch the sunset over Flamingo Bay. This is a step up from Tamarindo's surf shack vibe—more polished, more refined. After dinner, walk on Flamingo Beach—it's quiet, beautiful, and often deserted at night. The sand glows white in the moonlight.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 80
        }
      },
      {
        day: 4,
        morning: {
          activity: "Catamaran sailing and snorkeling tour",
          description: "Book a full-day catamaran tour—you'll sail along the coast, stop at multiple snorkel spots, and anchor at secluded beaches. Most tours include open bar (yes, unlimited drinks), lunch, and all gear. You'll snorkel in clear water seeing tropical fish, rays, maybe dolphins. The crew usually plays music, serves ceviche and fresh fruit, and keeps drinks flowing. It's party vibes but not obnoxious—think: relaxed day drinking on a boat with beautiful people. Tours leave from Tamarindo or Flamingo and run 4-6 hours. You'll return sun-drunk and happy.",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          cost: 85
        },
        afternoon: {
          activity: "Recover at your hotel pool",
          description: "After a full day on a boat with open bar, you'll need to recover. Crash at your hotel pool with a cold coconut water, take a nap, shower off the salt. Most Guanacaste resorts have incredible pools with ocean views. Do absolutely nothing for a few hours. Tonight you'll go out again.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        evening: {
          activity: "Sunset at Playa Hermosa and dinner at Ginger (again, it's that good)",
          description: "Drive to Playa Hermosa for sunset—this beach lives up to its name ('beautiful beach'). The sand is gray volcanic, the water is calm, and the sunsets are legendary. Sit on the sand with a beer from a local tienda and watch the sun drop into the Pacific. After sunset, drive back to Ginger in Flamingo (yes, again—it's worth it) or try El Coconut in Playa Hermosa for seafood and steaks. End the night early—tomorrow is another active day.",
          image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
          cost: 70
        }
      },
      {
        day: 5,
        morning: {
          activity: "Sloth sanctuary or rescue center visit",
          description: "Visit a wildlife rescue center like Kids Saving the Rainforest or Alturas Wildlife Sanctuary. These centers rescue and rehabilitate injured sloths, monkeys, birds, and other animals. You'll learn about Costa Rica's wildlife conservation efforts and see animals up close (but not touch—they're wild animals, not pets). Sloths are ridiculously cute and move in slow motion. Monkeys are chaotic and hilarious. The tour is educational and heartwarming—your entrance fee supports the rescue work. Tours run 1-2 hours. After, grab lunch at a soda (local lunch counter) for authentic Costa Rican casado (rice, beans, plantains, salad, meat/fish).",
          image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800",
          cost: 25
        },
        afternoon: {
          activity: "Final beach afternoon at Playa Conchal or Flamingo",
          description: "Your last full day—spend it at the beach. Playa Conchal or Flamingo are both beautiful and calm. Swim, snorkel, read a book, drink Imperials (Costa Rican beer). Walk the beach looking for shells and hermit crabs. Rent a kayak or paddleboard if you want activity, or just float in the warm water. This is your last afternoon in paradise—be present, take mental photos, breathe in the ocean air. Stay until sunset.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          cost: 0
        },
        evening: {
          activity: "Final dinner at Lola's on the Beach",
          description: "End your Costa Rica trip at Lola's, a beloved beachfront restaurant in Playa Avellanas (30 min south of Tamarindo). You sit at tables in the sand, toes buried, waves crashing 20 feet away. The food is fresh and simple: fish tacos, ceviche, grilled catch of the day. Order a margarita or a cold beer. The vibe is pure Pura Vida: unpretentious, relaxed, happy. After dinner, walk on the beach under the stars. Costa Rica has taught you to slow down, appreciate nature, and embrace the Pura Vida lifestyle. Carry that feeling home.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
          cost: 60
        }
      }
    ],
    
    accommodation: {
      name: "JW Marriott Guanacaste Resort & Spa",
      type: "Luxury Beach Resort",
      pricePerNight: 160,
      nights: 7,
      description: "Stunning property on Playa Mansita with multiple pools, golf course, spa, and beach access. Family-friendly but quiet sections for couples. Great restaurants on-site.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      alternative: "Budget: Hotel Tamarindo Diria (~$90/night). Splurge: Four Seasons Peninsula Papagayo (~$700/night)"
    },
    
    tips: [
      {
        icon: "✈️",
        title: "Visa & Entry",
        content: "US citizens don't need a visa (90-day tourist stamp on arrival). Passport must be valid 6 months beyond travel dates. No departure tax anymore (it's included in ticket)."
      },
      {
        icon: "🎒",
        title: "Packing",
        content: "Bug spray (mosquitoes love rainforest), light rain jacket (afternoon showers common), quick-dry clothes, water shoes, sunscreen, small bills (many places cash-only)"
      },
      {
        icon: "🚗",
        title: "Transportation",
        content: "Rent a 4WD vehicle—many roads are unpaved and rough. GPS often wrong—use Waze (locals update it). Drive slow, especially at night (animals on roads). Gas stations close early—fill up before 8pm."
      }
    ]
  }
];

// Make destinations available globally for HTML
window.destinations = destinations;

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = destinations;
}