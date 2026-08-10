/**
 * Single source of truth for all programme content.
 * The Influencers Nations Membership Class — a 3-week discipleship
 * and leadership training programme (Fridays & Saturdays, GMT+1).
 */
export const EVENT = {
  name: "The Influencers Nations Membership Class",
  shortName: "IMC",
  tagline:
    "Join our 3-Week Influencers Nations Membership Class designed to establish believers in sound doctrine, Christian character, evangelism, leadership, ministry excellence, and technology for Kingdom impact.",
  duration: "Three Weeks · Fridays & Saturdays · 7:00 PM (GMT+1)",
  timezone: "GMT+1",
  startDate: "7 August",
  endDate: "22 August",
  email: "kingdominfluencers01@gmail.com",
  phone: "+234 800 000 0000",
  whatsapp: "+234 800 000 0000",
  address: "Embassy Ministries — The Influencers Nation",
} as const;

export type ClassItem = {
  number: string;
  title: string;
};

export type WeekDay = {
  day: "Friday" | "Saturday";
  date: string;
  items: string[];
  assessment?: string;
};

export type Week = {
  week: number;
  label: string;
  theme: string;
  dates: string;
  days: WeekDay[];
  classes: ClassItem[];
  assessment: string;
};

export const WEEKS: Week[] = [
  {
    week: 1,
    label: "Week 1",
    theme: "Foundations of the Christian Life",
    dates: "Friday, 7 August · Saturday, 8 August",
    days: [
      {
        day: "Friday",
        date: "7 August",
        items: ["Class 1: New Creation", "Class 2: The Holy Spirit"],
      },
      {
        day: "Saturday",
        date: "8 August",
        items: ["Class 3: Christian Doctrines"],
        assessment:
          "Week 1 Assessment — conducted immediately after the final class",
      },
    ],
    classes: [
      {
        number: "Class 1",
        title: "New Creation",
      },
      {
        number: "Class 2",
        title: "The Holy Spirit",
      },
      {
        number: "Class 3",
        title: "Christian Doctrines",
      },
    ],
    assessment: "Week 1 Assessment",
  },

  {
    week: 2,
    label: "Week 2",
    theme: "Ministry and Kingdom Culture",
    dates: "Friday, 14 August · Saturday, 15 August",
    days: [
      {
        day: "Friday",
        date: "14 August",
        items: [
          "Class 4: Evangelism / Introduction to Embassy Ministries",
        ],
      },
      {
        day: "Saturday",
        date: "15 August",
        items: ["Class 5: Christian Character and Prosperity"],
        assessment:
          "Week 2 Assessment — conducted immediately after the final class",
      },
    ],
    classes: [
      {
        number: "Class 4",
        title: "Evangelism / Introduction to Embassy Ministries",
      },
      {
        number: "Class 5",
        title: "Christian Character and Prosperity",
      },
    ],
    assessment: "Week 2 Assessment",
  },

  {
    week: 3,
    label: "Week 3",
    theme: "Leadership, Technology, and Excellence",
    dates: "Friday, 21 August · Saturday, 22 August",
    days: [
      {
        day: "Friday",
        date: "21 August",
        items: [
          "Class 6: Local Assembly and The Influencers Nation",
          "Class 7: Introduction to Mobile Technology for Evangelism, Church Growth, and Ministry Expansion",
        ],
      },
      {
        day: "Saturday",
        date: "22 August",
        items: ["Class 8: IMC Excellence and Best Practices"],
        assessment:
          "Final IMC Examination — a comprehensive examination covering all classes taught throughout the three-week programme, followed by graduation and commissioning",
      },
    ],
    classes: [
      {
        number: "Class 6",
        title: "Local Assembly and The Influencers Nation",
      },
      {
        number: "Class 7",
        title:
          "Introduction to Mobile Technology for Evangelism, Church Growth, and Ministry Expansion",
      },
      {
        number: "Class 8",
        title: "IMC Excellence and Best Practices",
      },
    ],
    assessment: "Final IMC Examination",
  },
];

export const FINAL_SESSION = {
  title: "IMC Final Examination & Graduation",
  description:
    "All participants take a final assessment covering the entire curriculum. Successful participants graduate from the Influencers Membership Class (IMC), receive official recognition, and are commissioned into The Influencers Nations Membership Community.",
  points: [
    "Comprehensive assessment covering all eight classes",
    "Evaluation of understanding and practical application",
    "Graduation and commissioning ceremony",
    "Presentation of certificates (if applicable)",
  ],
};

export const OUTCOMES = [
  "Build a strong biblical foundation",
  "Grow spiritually and personally",
  "Understand the vision and culture of The Influencers Nation",
  "Develop leadership and ministry skills",
  "Learn practical evangelism strategies",
  "Discover how technology can advance the Gospel",
  "Be equipped for impactful Christian service",
  "Receive recognition upon successful completion",
];

/**
 * Attendance options offered on the registration form.
 */
export const ATTENDANCE_OPTIONS = [
  "Full Programme (all three weeks)",
  "Week 1 — 7 August & 8 August",
  "Week 2 — 14 August & 15 August",
  "Week 3 — 21 August & 22 August",
] as const;

export const MEMBERSHIP_STATUSES = [
  "Visitor",
  "New Member",
  "Existing Member",
  "Leader",
] as const;

export const AGE_RANGES = [
  "Under 18",
  "18–24",
  "25–34",
  "35–44",
  "45–54",
  "55+",
] as const;

export const GENDERS = ["Male", "Female"] as const;

export const HEARD_ABOUT = [
  "A friend or family member",
  "Church announcement",
  "Social media",
  "WhatsApp",
  "Flyer or poster",
  "Other",
] as const;