export type Project = {
  id: number;
  type: string;
  badge: string;
  title: string;
  desc: string;
  needs: string[];
  open: string[];
  poster: string;
  pcolor: string;
  posterName: string;
  deadline: string;
  urgent: boolean;
  slots: number;
  max: number;
  org: string;
};

export const PROJECTS: Project[] = [
    {id:1,type:'Hackathon',badge:'bdg-b',title:'Gemastik XVII — Track IoT',desc:'Tim sudah punya konsep smart campus solution. Butuh 1 developer backend kuat di Python & database.',needs:['Backend Dev','Python','SQL'],open:['Backend Dev'],poster:'AW',pcolor:'#fb923c',posterName:'Aldo W. · Bandung',deadline:'5 hari lagi',urgent:true,slots:1,max:3,org:'Pusat Prestasi Nasional'},
    {id:2,type:'UI/UX',badge:'bdg-h',title:'COMPFEST UI Design Challenge',desc:'Cari partner UI/UX passionate di fintech. Butuh partner kuat di visual design.',needs:['UI Designer','Figma','Prototyping'],open:['UI Designer'],poster:'SR',pcolor:'#5b9cf6',posterName:'Sari R. · Alam Sutera',deadline:'12 hari lagi',urgent:false,slots:1,max:2,org:'Fasilkom UI'},
    {id:3,type:'Business Plan',badge:'bdg-g',title:'BNCC Business Case Competition',desc:'Butuh 1 orang IT untuk bantu financial model & deck presentasi. Topik: sustainable supply chain.',needs:['Data Analyst','Excel','Finance'],open:['Data Analyst','Excel'],poster:'MB',pcolor:'#22d17a',posterName:'Maya B. · Kemanggisan',deadline:'20 hari lagi',urgent:false,slots:2,max:4,org:'BNCC Binus'},
    {id:4,type:'Research',badge:'bdg-r',title:'PKM-KC: Smart Waste Sorting',desc:'Tim lintas jurusan sudah ada 3 dari CS & Teknik. Butuh 1 dari Bioteknologi atau Teknik Pangan.',needs:['Bioteknologi','Research'],open:['Bioteknologi'],poster:'DH',pcolor:'#f96b6b',posterName:'Dito H. · Bekasi',deadline:'30 hari lagi',urgent:false,slots:1,max:4,org:'Kemendikbud'},
    {id:5,type:'Hackathon',badge:'bdg-b',title:'Shopee Code League 2025',desc:'Tim 3 orang, sudah ada 2 developer. Butuh 1 yang kuat di algoritma & competitive programming.',needs:['Competitive Prog','Algoritma','C++/Python'],open:['Competitive Prog'],poster:'FN',pcolor:'#f5a623',posterName:'Fadhil N. · Kemanggisan',deadline:'14 hari lagi',urgent:false,slots:1,max:3,org:'Shopee Indonesia'},
    {id:6,type:'Startup',badge:'bdg-p',title:'Startup Campus — Edtech Side Project',desc:'Tim 4 orang edtech. Butuh Co-founder yang bisa handle marketing & growth strategy.',needs:['Marketing','Growth Hacking','Content'],open:['Marketing','Growth Hacking'],poster:'LA',pcolor:'#5b9cf6',posterName:'Lisa A. · Alam Sutera',deadline:'18 hari lagi',urgent:false,slots:2,max:5,org:'Startup Campus'},
    {id:7,type:'UI/UX',badge:'bdg-h',title:'HIMTI Internal App Design Sprint',desc:'Redesign aplikasi internal HIMTI. Butuh 2 UI designer dan 1 front-end developer.',needs:['UI Designer','Front-end Dev','Figma'],open:['UI Designer','Front-end Dev'],poster:'RW',pcolor:'#a78bfa',posterName:'Rima W. · Kemanggisan',deadline:'8 hari lagi',urgent:true,slots:3,max:4,org:'HIMTI Binus'},
    {id:8,type:'Research',badge:'bdg-r',title:'PKM-AI: Deteksi Stunting Berbasis ML',desc:'Butuh anggota dengan background data science atau ML untuk model prediksi stunting.',needs:['Machine Learning','Python','Data Science'],open:['Machine Learning'],poster:'YS',pcolor:'#22d17a',posterName:'Yusuf S. · Bekasi',deadline:'25 hari lagi',urgent:false,slots:1,max:5,org:'Kemendikbud'},
    {id:9,type:'Business Plan',badge:'bdg-g',title:'Wirausaha Muda Mandiri 2026',desc:'Ide bisnis agritech sudah matang. Butuh co-founder bisnis dan developer untuk MVP.',needs:['Business Dev','Developer','MVP'],open:['Business Dev','Developer'],poster:'TK',pcolor:'#fb923c',posterName:'Tari K. · Bandung',deadline:'35 hari lagi',urgent:false,slots:2,max:4,org:'Bank Mandiri'},
  ];

  
export type Person = {
  id: number;
  n: string;
  major: string;
  campus: string;
  region: string;
  init: string;
  color: string;
  skills: string[];
  score: string;
  collabs: number;
  status: string;
};

  export const PEOPLE: Person[] = [
    {id: 1, n:'Raka Kusuma',major:'Computer Science',campus:'Bandung · Sem 5',region:'Bandung',init:'RK',color:'#f5a623',skills:['Tech','Problem Solving'],score:'4.9',collabs:6,status:'open'},
    {id: 2, n:'Nadia Salsabila',major:'Visual Communication Design',campus:'Bandung · Sem 4',region:'Bandung',init:'NS',color:'#5b9cf6',skills:['Design','Kreatif'],score:'4.8',collabs:4,status:'open'},
    {id: 3, n:'Marco Rivaldi',major:'Business Management',campus:'Kemanggisan · Sem 6',region:'Kemanggisan',init:'MR',color:'#22d17a',skills:['Bisnis','Analitik'],score:'4.7',collabs:8,status:'open'},
    {id: 4, n:'Dinda Pratiwi',major:'Artificial Intelligence',campus:'Bekasi · Sem 3',region:'Bekasi',init:'DP',color:'#f96b6b',skills:['Tech','Data'],score:'4.6',collabs:3,status:'open'},
    {id: 5, n:'Bryan Ananta',major:'Visual Communication Design',campus:'Alam Sutera · Sem 5',region:'Alam Sutera',init:'BA',color:'#a78bfa',skills:['Design','Kreatif'],score:'4.9',collabs:5,status:'busy'},
    {id: 6, n:'Anisa Kartika',major:'Psychology',campus:'Kemanggisan · Sem 4',region:'Kemanggisan',init:'AK',color:'#fb923c',skills:['Psikologi','Riset'],score:'4.5',collabs:2,status:'open'},
    {id: 7, n:'Fadhil Nugroho',major:'Computer Science',campus:'Kemanggisan · Sem 5',region:'Kemanggisan',init:'FN',color:'#f5a623',skills:['Tech','Kompetitif'],score:'4.8',collabs:5,status:'open'},
    {id: 8, n:'Sari Rahmawati',major:'Visual Communication Design',campus:'Alam Sutera · Sem 4',region:'Alam Sutera',init:'SR',color:'#5b9cf6',skills:['Design','UI/UX'],score:'4.7',collabs:4,status:'open'},
    {id: 9, n:'Yusuf Santoso',major:'Artificial Intelligence',campus:'Bekasi · Sem 6',region:'Bekasi',init:'YS',color:'#22d17a',skills:['Tech','Data'],score:'4.9',collabs:7,status:'busy'},
    {id: 10, n:'Lisa Amalia',major:'Business Management',campus:'Alam Sutera · Sem 5',region:'Alam Sutera',init:'LA',color:'#f96b6b',skills:['Bisnis','Marketing'],score:'4.4',collabs:3,status:'open'},
    {id: 11, n:'Rizky Permana',major:'Computer Engineering',campus:'Bandung · Sem 4',region:'Bandung',init:'RP',color:'#fb923c',skills:['Tech','Hardware'],score:'4.6',collabs:4,status:'open'},
    {id: 12, n:'Maya Budiana',major:'Accounting',campus:'Kemanggisan · Sem 5',region:'Kemanggisan',init:'MB',color:'#22d17a',skills:['Finance','Analitik'],score:'4.8',collabs:6,status:'open'},
  ];

export type Competition = {
  id: number;
  title: string;
  org: string;
  deadline: string;
  tags: string[];
  type: string;
  color: string;
};

export const COMPETITIONS: Competition[] = [
  { id: 1, title: 'Gemastik XVII 2026', org: 'Kemdikbudristek', deadline: 'Bulan Depan', tags: ['Hackathon', 'Nasional', 'Prestigious'], type: 'Hackathon', color: '#f5a623' },
  { id: 2, title: 'COMPFEST 16', org: 'Fasilkom UI', deadline: 'Minggu Depan', tags: ['UI/UX', 'Business', 'Tech'], type: 'UI/UX', color: '#5b9cf6' },
  { id: 3, title: 'BCC 2026', org: 'BNCC Binus', deadline: '2 Bulan Lagi', tags: ['Business Case', 'Internal Binus'], type: 'Business Plan', color: '#2dd67a' },
  { id: 4, title: 'PKM 2026', org: 'Dikti', deadline: 'Januari 2027', tags: ['Research', 'Funding', 'Nasional'], type: 'Research', color: '#f96b6b' },
];

export type TeamItem = {
  id: number;
  title: string;
  role: string;
  members: string[];
  status: string;
};

export const MY_TEAMS: TeamItem[] = [
  { id: 1, title: 'Team Nexus', role: 'Leader / Frontend', members: ['RK', 'NS', 'MR'], status: 'Active - Gemastik' },
  { id: 2, title: 'EduTrack Start', role: 'UI Designer', members: ['RK', 'YS'], status: 'Incubation' },
];

