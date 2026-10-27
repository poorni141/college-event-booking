import { CampusEvent, Seat } from '../types.ts';

// Helper to generate an auditorium seat matrix for an event
export function generateSeatsForEvent(eventId: string, totalSeats: number = 48): Seat[] {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = Math.ceil(totalSeats / rows.length);
  const seats: Seat[] = [];

  rows.forEach((row, rowIndex) => {
    for (let num = 1; num <= seatsPerRow; num++) {
      if (seats.length >= totalSeats) break;
      const seatNumber = `${row}${num}`;
      // Pre-book a few realistic seats for demo authenticity
      const isPreBooked = (rowIndex === 0 && num === 3) || (rowIndex === 1 && num === 5) || (rowIndex === 2 && num === 4);
      seats.push({
        id: `${eventId}_seat_${seatNumber}`,
        seatNumber,
        row,
        tierId: rowIndex < 2 ? 'tier-vip' : 'tier-general',
        status: isPreBooked ? 'booked' : 'available',
      });
    }
  });

  return seats;
}

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'evt-culturals-2026',
    title: 'Aura 2026: Grand Annual Collegiate Cultural Fest',
    category: 'Culturals',
    tagline: 'The flagship inter-college cultural spectacle with 40+ universities',
    description: 'Experience three days of unbridled artistic expression, celebrity guest performances, pro-show nights, street theatre, and culinary fiestas across the main college quadrangle. Featuring national band headliners and campus rock legends.',
    date: '2026-11-14',
    startTime: '17:30',
    endTime: '22:30',
    venue: 'Heritage Quad & Grand Pavilion',
    locationDetails: 'North Campus Main Quad, University Avenue Gate 3',
    totalCapacity: 600,
    availableSeats: 488,
    image: '/src/assets/images/hero_college_festival_1793106902279.jpg',
    organizer: 'Student Cultural Council & Dean of Student Affairs',
    organizerContact: 'culturals@campustix.edu',
    featured: true,
    status: 'upcoming',
    createdAt: '2026-10-01T10:00:00Z',
    rules: [
      'Valid University ID card mandatory at entry gate.',
      'Re-entry is allowed only with UV wristband.',
      'Outside food, beverages, and recording equipment are strictly prohibited.'
    ],
    schedule: [
      { time: '17:30', title: 'Campus Battle of the Bands', description: 'Top 6 regional collegiate bands perform original compositions.' },
      { time: '19:45', title: 'Fashion Showcase: Metamorphosis', description: 'Annual couture presentation by the Campus Design Guild.' },
      { time: '21:00', title: 'Headline Pro-Night', description: 'Live concert by national indie-rock sensations.' }
    ],
    tiers: [
      {
        id: 'tier-general',
        name: 'General Student Pass',
        price: 199,
        capacity: 450,
        available: 360,
        description: 'Open quad lawn access, concert field entry & food stall access.',
        perks: ['Ground entry', 'Festival wristband', 'Complimentary welcome drink']
      },
      {
        id: 'tier-vip',
        name: 'Front Stage VIP Access',
        price: 499,
        capacity: 150,
        available: 128,
        description: 'Priority reserved front barricade standing, express gate entry & festival hoodie.',
        perks: ['Front-stage pit pass', 'Express line check-in', 'Limited Edition Aura 2026 Tee', 'Backstage acoustic session']
      }
    ],
    seats: generateSeatsForEvent('evt-culturals-2026', 48)
  },
  {
    id: 'evt-hackathon-2026',
    title: 'HackCampus: 24-Hour AI & Web3 Innovation Hackathon',
    category: 'Hackathon',
    tagline: 'Build, deploy, and pitch groundbreaking tech solutions for ₹1,50,000 in prizes',
    description: 'Join 500+ brilliant student developers, designers, and founders for a non-stop sprint building AI agents, cloud architectures, and climate-tech tools. Mentorship by senior engineers from leading tech companies.',
    date: '2026-11-20',
    startTime: '09:00',
    endTime: '18:00',
    venue: 'Alan Turing Innovation Hub & Tech Labs',
    locationDetails: 'Computer Science Building, 3rd Floor Mega Labs',
    totalCapacity: 250,
    availableSeats: 192,
    image: '/src/assets/images/event_hackathon_arena_1793106903354.jpg',
    organizer: 'Department of Computer Science & ACM Student Chapter',
    organizerContact: 'hackathon@campustix.edu',
    featured: true,
    status: 'upcoming',
    createdAt: '2026-10-05T12:00:00Z',
    rules: [
      'Bring your own development machine and hardware peripherals.',
      'Teams of 2 to 4 members. Solo entries will be matched during morning mixer.',
      'All code must be committed to fresh public GitHub repositories.'
    ],
    schedule: [
      { time: '09:00', title: 'Check-in & Team Matching Breakfast', description: 'Badge collection and high-speed Wi-Fi provisioning.' },
      { time: '10:30', title: 'Opening Keynote & Problem Statements', description: 'Track reveals in GenAI, Web3, and Smart Campus Infra.' },
      { time: '11:00', title: 'Hacking Commences (24-Hour Clock)', description: 'Mentors available for architecture design reviews.' }
    ],
    tiers: [
      {
        id: 'tier-general',
        name: 'Hacker Standard Pass',
        price: 0,
        capacity: 200,
        available: 152,
        description: 'Full 24-hr access, high-speed Gigabit LAN, meals & energy drinks included.',
        perks: ['Free Entry (Sponsored)', 'All 4 meals & midnight pizza', 'Hackathon swag bag', 'Cloud computing credits']
      },
      {
        id: 'tier-vip',
        name: 'Hardware Track Pass',
        price: 250,
        capacity: 50,
        available: 40,
        description: 'Access to Raspberry Pi, Arduino microcontrollers & IoT test benches.',
        perks: ['Dedicated hardware lab workbench', 'Sensor kits and oscilloscopes', 'Fast-track mentor reviews']
      }
    ],
    seats: generateSeatsForEvent('evt-hackathon-2026', 48)
  },
  {
    id: 'evt-music-2026',
    title: 'Twilight Symphony: Campus Acoustic & Indie Fusion Night',
    category: 'Music Night',
    tagline: 'An enchanting evening of soulful melodies, acoustic strings, and jazz ballads',
    description: 'Immerse yourself under twilight fairy lights as university student vocalists, string ensembles, and classical fusion artists deliver an unforgettable acoustic performance in the campus amphitheater.',
    date: '2026-11-28',
    startTime: '18:30',
    endTime: '21:30',
    venue: 'Stone Amphitheater & Lakeside Deck',
    locationDetails: 'East Campus Amphitheater, by the Reflection Lake',
    totalCapacity: 350,
    availableSeats: 260,
    image: '/src/assets/images/event_music_symphony_1793106902825.jpg',
    organizer: 'Campus Music Society & Fine Arts Department',
    organizerContact: 'music.soc@campustix.edu',
    featured: true,
    status: 'upcoming',
    createdAt: '2026-10-08T09:30:00Z',
    rules: [
      'Seating is allocated on first-come-first-served basis for non-reserved tiers.',
      'Mobile phones must be switched to silent mode during acoustic solos.'
    ],
    schedule: [
      { time: '18:30', title: 'Violin & Cello Sunset Prelude', description: 'Classical string interpretations of modern cinema tracks.' },
      { time: '19:30', title: 'Indie Folk Set: The Pine Hollows', description: 'Original student acoustic compositions.' },
      { time: '20:30', title: 'Grand Fusion Ensemble', description: '30-piece orchestra combining Indian classical and western jazz.' }
    ],
    tiers: [
      {
        id: 'tier-general',
        name: 'Tier Seating Pass',
        price: 150,
        capacity: 250,
        available: 185,
        description: 'Amphitheater curved stone row seating with clear line of sight.',
        perks: ['Stone bench seat', 'Hot cocoa coupon', 'Printed lyric pamphlet']
      },
      {
        id: 'tier-vip',
        name: 'Premium Lakefront Cushion',
        price: 350,
        capacity: 100,
        available: 75,
        description: 'Intimate front-row floor cushion seating with hot artisan cider.',
        perks: ['Front-row bohemian floor lounger', 'Artisan cider & cookies', 'Meet & greet with vocalists']
      }
    ],
    seats: generateSeatsForEvent('evt-music-2026', 48)
  },
  {
    id: 'evt-dance-2026',
    title: 'Pulse: All-India Collegiate Street Dance Championship',
    category: 'Dance Competition',
    tagline: 'Electrifying 8-on-8 crew battles, popping, locking, and urban hip-hop',
    description: 'The definitive collegiate dance battleground where 24 premier dance crews compete for the prestigious national title, evaluated by celebrity choreographers and international judges.',
    date: '2026-12-05',
    startTime: '16:00',
    endTime: '21:00',
    venue: 'Sir C.V. Raman University Auditorium',
    locationDetails: 'Main Academic Block Auditorium, Gate 1',
    totalCapacity: 500,
    availableSeats: 395,
    image: '/src/assets/images/event_dance_championship_1793106904627.jpg',
    organizer: 'University Dance Society (StreetBeat)',
    organizerContact: 'dance@campustix.edu',
    featured: false,
    status: 'upcoming',
    createdAt: '2026-10-10T14:00:00Z',
    rules: [
      'Cheering and fan banners are encouraged; strictly no whistles or laser pointers.',
      'Auditorium doors close 10 minutes prior to crew performances.'
    ],
    schedule: [
      { time: '16:00', title: 'Preliminary Crew Showcases', description: '24 crews perform their 3-minute qualifying routines.' },
      { time: '18:00', title: 'Top 8 Sudden-Death Cyphers', description: 'Direct 1-on-1 and crew-on-crew elimination battles.' },
      { time: '20:00', title: 'Finals & Judges Exhibition Showcase', description: 'Championship showdown and awards ceremony.' }
    ],
    tiers: [
      {
        id: 'tier-general',
        name: 'Balcony View Pass',
        price: 120,
        capacity: 350,
        available: 275,
        description: 'Upper tier panoramic view of the entire battle floor.',
        perks: ['Balcony tiered seat', 'Audience voting card']
      },
      {
        id: 'tier-vip',
        name: 'Floor Ringside Pass',
        price: 299,
        capacity: 150,
        available: 120,
        description: 'Ringside proximity to the battle cypher circle.',
        perks: ['Front orchestra seating', 'Official Pulse 2026 Wristband', 'Official Cypher Poster']
      }
    ],
    seats: generateSeatsForEvent('evt-dance-2026', 48)
  },
  {
    id: 'evt-sports-2026',
    title: 'Olympus: Inter-Departmental Track & Field Invitational',
    category: 'Sports Meet',
    tagline: 'Speed, endurance, and college pride across 22 athletic disciplines',
    description: 'Cheer on your department athletes in high-stakes track sprints, 4x100m relays, long jump, javelin, and tug-of-war. Featuring live commentary, stadium scoreboard, and athletic food trucks.',
    date: '2026-12-12',
    startTime: '08:30',
    endTime: '17:30',
    venue: 'University Olympic Sports Complex',
    locationDetails: 'South Athletic Enclosure, Stadium Drive',
    totalCapacity: 800,
    availableSeats: 640,
    image: '/src/assets/images/event_sports_meet_1793106903870.jpg',
    organizer: 'Department of Physical Education & Sports Board',
    organizerContact: 'sports@campustix.edu',
    featured: false,
    status: 'upcoming',
    createdAt: '2026-10-12T11:00:00Z',
    rules: [
      'Stadium seating is divided into department cheering blocks.',
      'Sunscreen, water bottles, and team banners recommended.'
    ],
    schedule: [
      { time: '08:30', title: 'Athletes March Past & Torch Lighting', description: 'Opening ceremony with department contingents.' },
      { time: '10:00', title: '100m & 200m Sprint Heats', description: 'Fastest sprinters clash on the synthetic 8-lane track.' },
      { time: '15:30', title: 'The Great Inter-Dept 4x400m Relay & Tug of War', description: 'The pinnacle showdown for the Overall Championship Trophy.' }
    ],
    tiers: [
      {
        id: 'tier-general',
        name: 'Stadium Grandstand Pass',
        price: 50,
        capacity: 650,
        available: 520,
        description: 'Full day grandstand seating with access to athlete viewing areas.',
        perks: ['Covered grandstand seat', 'Cheering pom-pom / whistle', 'Hydration station access']
      },
      {
        id: 'tier-vip',
        name: 'Pavilion Club Access',
        price: 180,
        capacity: 150,
        available: 120,
        description: 'AC pavilion lounge with vantage line view and buffet lunch.',
        perks: ['VIP Finish-line view', 'Buffet sports lunch', 'Official tournament badge']
      }
    ],
    seats: generateSeatsForEvent('evt-sports-2026', 48)
  },
  {
    id: 'evt-symposium-2026',
    title: 'NexGen Engineering: International Research Symposium',
    category: 'Symposium',
    tagline: 'Peer-reviewed presentations, keynote panels on Robotics & Clean Energy',
    description: 'A distinguished academic gathering convening faculty, industry leads, and student researchers. Featuring paper presentations, IEEE student chapter demonstrations, and patent filing workshops.',
    date: '2026-12-18',
    startTime: '10:00',
    endTime: '17:00',
    venue: 'Convention Centre Main Hall',
    locationDetails: 'Centennial Convention Complex, Hall A',
    totalCapacity: 300,
    availableSeats: 220,
    image: '/src/assets/images/event_hackathon_arena_1793106903354.jpg',
    organizer: 'Office of Dean (Research & Consultancy)',
    organizerContact: 'symposium@campustix.edu',
    featured: false,
    status: 'upcoming',
    createdAt: '2026-10-15T08:00:00Z',
    rules: [
      'Formal or smart-casual attire requested.',
      'Digital conference proceedings provided upon check-in.'
    ],
    schedule: [
      { time: '10:00', title: 'Keynote: The Quantum Leap in Embedded Systems', description: 'Distinguished lecture by Dr. Aris Thorne.' },
      { time: '11:45', title: 'Oral Paper Presentations: Track A & B', description: 'Selected undergraduate and postgraduate research papers.' },
      { time: '15:00', title: 'Panel: Commercializing Campus Patents', description: 'Venture capitalists and technology transfer heads.' }
    ],
    tiers: [
      {
        id: 'tier-general',
        name: 'Student Delegate Pass',
        price: 150,
        capacity: 200,
        available: 150,
        description: 'Conference kit, access to all tracks, tea/coffee breaks and certificate.',
        perks: ['Certificate of participation', 'Digital conference kit', 'High tea & refreshments']
      },
      {
        id: 'tier-vip',
        name: 'Author & Presenter Pass',
        price: 350,
        capacity: 100,
        available: 70,
        description: 'Formal paper presentation slot, journal publication copy & dinner.',
        perks: ['Presentation slot', 'Printed IEEE proceedings', 'Gala networking dinner']
      }
    ],
    seats: generateSeatsForEvent('evt-symposium-2026', 48)
  },
  {
    id: 'evt-workshop-2026',
    title: 'Masterclass: Full-Stack System Design & Microservices',
    category: 'Workshops',
    tagline: 'Hands-on architectural deep dive: High throughput, distributed caching & Docker',
    description: 'A practical, 6-hour code-along masterclass designed for university seniors. Build a real-time event booking and seat reservation engine from scratch using Node.js, Redis locks, and PostgreSQL.',
    date: '2026-12-22',
    startTime: '10:30',
    endTime: '16:30',
    venue: 'Software Engineering Lab 4',
    locationDetails: 'Babbage Technology Wing, Level 2',
    totalCapacity: 80,
    availableSeats: 58,
    image: '/src/assets/images/event_hackathon_arena_1793106903354.jpg',
    organizer: 'Developer Student Club & Cloud Computing Lab',
    organizerContact: 'workshops@campustix.edu',
    featured: false,
    status: 'upcoming',
    createdAt: '2026-10-16T14:30:00Z',
    rules: [
      'Docker and Node.js v20+ must be pre-installed on your laptop.',
      'GitHub account with personal access token recommended.'
    ],
    schedule: [
      { time: '10:30', title: 'Module 1: Atomic Concurrency & Pessimistic Locks', description: 'Understanding double-booking vulnerabilities under high loads.' },
      { time: '13:00', title: 'Lunch & Code Review', description: 'Sandwiches provided on site.' },
      { time: '14:00', title: 'Module 2: Building Distributed Ticket Release Queues', description: '10-minute seat hold timeouts and Redis keyspace notifications.' }
    ],
    tiers: [
      {
        id: 'tier-general',
        name: 'Workshop Seat + Source Kit',
        price: 299,
        capacity: 80,
        available: 58,
        description: 'Live lab seat, interactive exercises, starter templates & course certificate.',
        perks: ['Lab desk with Ethernet', 'GitHub starter templates', 'Certificate of Completion', 'Gourmet lunch']
      }
    ],
    seats: generateSeatsForEvent('evt-workshop-2026', 36)
  }
];
