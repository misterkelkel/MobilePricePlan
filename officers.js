(function(){
  const DATA = [
    { en: "Establish", cn: "建", workDo: ["Start projects","Important decisions","Contracts","Meetings","Planning"], workAvoid: ["Arguments","Untested launches","Scope creep"], familyDo: ["Family meetings","Set goals together","Assign chores"], familyAvoid: ["Confrontation","Rushed travel"], clash: "豬", clashDir: "West", element: "Wood", note: "Good for beginnings and structure. Avoid confrontation." },
    { en: "Remove", cn: "除", workDo: ["Cancel bad plans","Clear backlog","Pay debts","Habits reset"], workAvoid: ["Celebrations","Grand openings"], familyDo: ["Declutter home","End bad patterns","Short trips"], familyAvoid: ["Big parties"], clash: "鼠", clashDir: "South", element: "Wood", note: "Best for removal, healing, and endings." },
    { en: "Full", cn: "滿", workDo: ["Deliver results","Collect payments","Celebrate wins"], workAvoid: ["New contracts","Overcommit"], familyDo: ["Gather together","Celebrate milestones","Share meals"], familyAvoid: ["Long trips","Big spending"], clash: "牛", clashDir: "East", element: "Earth", note: "Auspicious for rewards and abundance." },
    { en: "Balance", cn: "平", workDo: ["Routine work","Maintenance","Study","Publishing"], workAvoid: ["High-stakes deals","Construction start"], familyDo: ["Steady routine","Home projects","Together time"], familyAvoid: ["Big events","Weddings"], clash: "虎", clashDir: "North", element: "Earth", note: "Neutral day; stay steady and avoid risks." },
    { en: "Stable", cn: "定", workDo: ["Agreements","Scheduling","Steady investments","Meetings"], workAvoid: ["Funerals","Risky bets","Disputes"], familyDo: ["Resolve commitments","Plan ahead","Quality time"], familyAvoid: ["Risk-taking","Arguments"], clash: "兔", clashDir: "West", element: "Metal", note: "Good for settling matters and commitments." },
    { en: "Initiate", cn: "執", workDo: ["Follow-through","Approvals","Administrative work","Offerings"], workAvoid: ["Travel","Funerals","Moving"], familyDo: ["Family rituals","House rules","Planning"], familyAvoid: ["Travel","Moving homes"], clash: "龍", clashDir: "South", element: "Metal", note: "Favors discipline and steady effort." },
    { en: "Destruction", cn: "破", workDo: ["Problem-solving","Audits","Release old tools","End bad projects"], workAvoid: ["Weddings","Promises","Celebrations"], familyDo: ["Resolve conflicts","Release grudges","Clean up"], familyAvoid: ["New promises","Celebrations"], clash: "蛇", clashDir: "East", element: "Earth", note: "Use carefully; good for endings, not beginnings." },
    { en: "Danger", cn: "危", workDo: ["Risk review","Defensive planning","Keep low profile"], workAvoid: ["New contracts","Long journeys","Big launches"], familyDo: ["Safety checks","Low-key time","Support"], familyAvoid: ["Big ceremonies","Travel"], clash: "馬", clashDir: "North", element: "Water", note: "Keep caution. Do not take chances." },
    { en: "Success", cn: "成", workDo: ["Business deals","Seal agreements","Completion","Deliveries"], workAvoid: ["Lawsuits","Surgery","Conflict"], familyDo: ["Celebrations","Mergers","Gatherings"], familyAvoid: ["Conflict","Surgery timing"], clash: "羊", clashDir: "West", element: "Water", note: "Auspicious for outcomes and celebrations." },
    { en: "Receive", cn: "收", workDo: ["Inventory","Collections","Filing","Returns"], workAvoid: ["Investments","Moving","Marriage timing"], familyDo: ["Sorting home","Harvesting together","Bonding"], familyAvoid: ["Investments","Moving"], clash: "猴", clashDir: "South", element: "Metal", note: "Best for closure and consolidation." },
    { en: "Open", cn: "開", workDo: ["New business","Opening events","Public launches","Travel"], workAvoid: ["Big repairs","Funerals at family"], familyDo: ["Travel together","New beginnings","Public events with family"], familyAvoid: ["Burying memories","Ignoring repairs"], clash: "雞", clashDir: "East", element: "Metal", note: "Great for openings, fortune, and travel." },
    { en: "Close", cn: "閉", workDo: ["Finish old tasks","Solo work","Quiet focus"], workAvoid: ["Public events","Meetings","New openings"], familyDo: ["Rest at home","Quiet time","Close out family matters"], familyAvoid: ["Big meetings","Starting new ventures"], clash: "狗", clashDir: "North", element: "Earth", note: "Time to finish quietly, not to begin." }
  ];

  const ORDER = ["建","除","滿","平","定","執","破","危","成","收","開","閉"];

  // Anchor: Dragon Gate Thursday 2026-07-02 => Danger
  const ANCHOR_DATE = new Date(Date.UTC(2026, 6, 2));
  const ANCHOR_INDEX = 7;

  const MAP = {};
  for (let i = -20*365; i <= 20*365; i++) {
    const d = new Date(ANCHOR_DATE.getTime() + i*86400000);
    const key = keyDate(d);
    const idx = ((ANCHOR_INDEX - i) % 12 + 12) % 12;
    MAP[key] = DATA[idx];
  }

  function pad2(n){ return n < 10 ? '0'+n : ''+n; }
  function keyDate(d){ return d.getUTCFullYear()+'-'+pad2(d.getUTCMonth()+1)+'-'+pad2(d.getUTCDate()); }

  window.getOfficerByUtcDate = function(y, m, d){
    const key = y+'-'+pad2(m)+'-'+pad2(d);
    if(MAP[key]) return MAP[key];
    return DATA[((((y*13+m)*31+d)%12)+12)%12] || DATA[0];
  };

  window.OFFICER_ORDER = ORDER;
  window.OFFICER_DATA = DATA;
})();
