// All site content lives here so it can be edited without touching components.

export const START_YEAR = 2014
export const yearsOfExperience = () => new Date().getFullYear() - START_YEAR

export const profile = {
  name: 'Elias Naji Saliba',
  firstName: 'Elias',
  lastName: 'Saliba',
  brand: 'Saliba Iron Work',
  tagline: 'Precision Metal Fabrication',
  role: 'Welder · Ironworker · Metal Fabricator',
  location: 'Kaa El Rim, Zahle — Lebanon',
  phone: '+961 81 343 080',
  phoneRaw: '+96181343080',
  whatsapp: '96181343080',
  email: 'elias.saliba333@gmail.com',
  photo: '/elias.jpg',
  logo: '/logo.jpg',
}

export const about = [
  'I learned welding the way the best welders do — at my father’s side. He is a seasoned welder, and his workshop is where I built a strong foundation in welding and ironwork, long before any certificate.',
  'Since then I have worked as a mechanical technician and lathe operator at Mimosa, trained on CNC lathes and advanced welding at Uniplast, and provided welding services for Berdawni Mineral Water and a solar panel company. I hold a BT3 diploma in mechanics and a welder’s qualification certificate from the Industrial Research Institute.',
  'Today I work as a freelancer, building custom metalwork for roofs, solar panel structures, doors and more — with the same care for every weld, whatever the size of the job.',
]

export const services = [
  {
    icon: 'truss',
    title: 'Roofs & Steel Structures',
    text: 'Steel roof frames, trusses and structural metalwork, measured, cut and welded to hold up for years.',
  },
  {
    icon: 'solar',
    title: 'Solar Panel Structures',
    text: 'Mounting frames and support structures for solar installations, built for structural integrity and safety.',
  },
  {
    icon: 'gate',
    title: 'Doors & Gates',
    text: 'Custom iron doors and gates, made to measure and finished to match the building.',
  },
  {
    icon: 'torch',
    title: 'Custom Fabrication',
    text: 'One-off pieces and anything else in metal: bring the idea or the drawing and I will build it.',
  },
  {
    icon: 'lathe',
    title: 'Machining & Lathe Work',
    text: 'Precision parts on manual and CNC lathes, drawing on production experience at Mimosa Sanitary Paper and Uniplast.',
  },
  {
    icon: 'wrench',
    title: 'Maintenance & Repair',
    text: 'Welding repairs and maintenance for machinery, equipment and structural components.',
  },
]

export const process = [
  { icon: 'blueprint', title: 'Measure & Plan', text: 'Site visit, measurements and a clear plan read straight from your drawing or idea.' },
  { icon: 'cut', title: 'Cut & Prepare', text: 'Steel is cut, ground and fitted so every joint is ready for a clean weld.' },
  { icon: 'torch', title: 'Weld & Fabricate', text: 'Careful, certified welding that follows safety standards from the first tack to the last bead.' },
  { icon: 'shield', title: 'Finish & Install', text: 'Finishing, installation and a final check before the job is handed over.' },
]

export const experience = [
  {
    period: 'May 2014 — Present',
    title: 'Freelance Welder',
    company: 'Self-Employed',
    duration: 'since 2014',
    text: 'Custom metalwork including roofs, solar panel structures, doors and other fabrications, delivering high-quality craftsmanship and practical solutions for a wide range of client projects.',
    tags: ['Roofs', 'Solar structures', 'Doors', 'Custom work'],
    current: true,
  },
  {
    period: 'May 2022 — Nov 2022',
    title: 'Welder',
    company: 'Solar Panel Company',
    duration: '7 months',
    text: 'Provided welding services for the installation and maintenance of solar panel structures, ensuring structural integrity and safety compliance on every project.',
    tags: ['Installation', 'Maintenance', 'Safety'],
  },
  {
    period: 'Feb 2022 — Apr 2022',
    title: 'CNC Lathe Operator & Welder (Training)',
    company: 'Uniplast',
    duration: '3 months',
    text: 'Trained in CNC lathe operations and advanced welding techniques. Produced precision components and fabricated a variety of metal parts.',
    tags: ['CNC', 'Advanced welding', 'Precision parts'],
  },
  {
    period: 'Nov 2021 — Jan 2022',
    title: 'Welder',
    company: 'Berdawni Mineral Water',
    duration: '4 months',
    text: 'Performed welding for equipment maintenance and repair, keeping structural components operating safely and efficiently.',
    tags: ['Equipment repair', 'Structural'],
  },
  {
    period: 'Mar 2021 — Aug 2021',
    title: 'Lathe Operator',
    company: 'Mimosa',
    duration: '6 months',
    text: 'Operated manual lathes to machine parts with precision, working with the team to maintain high production quality standards.',
    tags: ['Manual lathe', 'Production'],
  },
  {
    period: 'Apr 2020 — Feb 2021',
    title: 'Mechanical Technician',
    company: 'Mimosa',
    duration: '8 months',
    text: 'Assisted with maintenance and repair of mechanical systems and machinery, building skills in troubleshooting, equipment handling and mechanical repair.',
    tags: ['Troubleshooting', 'Machinery'],
  },
]

export const education = [
  {
    icon: 'cert',
    date: 'Feb 2023',
    title: 'Welder’s Qualification Test Certificate',
    org: 'Industrial Research Institute — Hadath',
    text: 'Certified in welding techniques and safety standards, meeting industry requirements for professional welding.',
    stamp: 'CERTIFIED',
  },
  {
    icon: 'grad',
    date: 'Sep 2024',
    title: 'BT3 Diploma in Mechanics',
    org: 'Technical School of Zahle — Lebanon',
    text: 'Specialized in car mechanics, mechanical systems, machining, welding and metal fabrication techniques.',
    stamp: 'DIPLOMA',
  },
]

export const skills = [
  { icon: 'torch', label: 'Welding & Metal Fabrication' },
  { icon: 'wrench', label: 'Mechanical Maintenance' },
  { icon: 'lathe', label: 'Machining & Lathe Operations' },
  { icon: 'blueprint', label: 'Blueprint Reading & Interpretation' },
  { icon: 'gear', label: 'Problem Solving & Troubleshooting' },
  { icon: 'beam', label: 'Project Management' },
  { icon: 'helmet', label: 'Safety & Compliance' },
  { icon: 'handshake', label: 'Freelancing & Client Management' },
  { icon: 'ruler', label: 'Attention to Detail' },
  { icon: 'chat', label: 'Technical Communication' },
  { icon: 'spark', label: 'Adaptability & Continuous Learning' },
]

export const languages = [
  { code: 'AR', name: 'Arabic' },
  { code: 'EN', name: 'English' },
  { code: 'FR', name: 'French' },
]

export const marquee = [
  'Welding',
  'Ironwork',
  'Metal Fabrication',
  'Roof Structures',
  'Solar Panel Frames',
  'Doors & Gates',
  'Lathe & CNC',
  'Maintenance & Repair',
]
