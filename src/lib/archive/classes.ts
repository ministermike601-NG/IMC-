import type { ClassItem } from "@/lib/event";

export type ArchiveClass = ClassItem & {
  slug: string;
  date: string;
  time: string;
  timezone: string;
  description: string;
  videoUrl?: string;
  ebookUrl?: string;
  ebookTitle?: string;
  testUrl?: string;
  testTitle?: string;
};

export const ARCHIVE_CLASSES: ArchiveClass[] = [
  {
    number: "Class 1",
    title: "New Creation",
    slug: "class-1",
    date: "7 August",
    time: "7:00 PM",
    timezone: "GMT+1",
    description:
      "A recorded session of Class 1 — New Creation from The Influencers Nations Membership Class.",
    videoUrl: "https://youtu.be/0VnabuJ0pIA",
    ebookUrl: "/archive/class-1/now-that-you-are-born-again.pdf",
    ebookTitle: "Now That You Are Born Again",
    testUrl: "/archive/class-1/class-1-test.pdf",
    testTitle: "Class 1 Test Questions",
  },

  {
    number: "Class 2",
    title: "The Holy Spirit",
    slug: "class-2",
    date: "7 August",
    time: "7:00 PM",
    timezone: "GMT+1",
    description:
      "A recorded session of Class 2 — The Holy Spirit from The Influencers Nations Membership Class.",
    videoUrl: "",
    ebookUrl: "",
    ebookTitle: "",
    testUrl: "/archive/class-2/The Holy Spirit.pdf",
    testTitle: "Class 2 Test Questions — The Holy Spirit",
  },

  {
    number: "Class 3",
    title: "Christian Doctrines",
    slug: "class-3",
    date: "8 August",
    time: "7:00 PM",
    timezone: "GMT+1",
    description:
      "A recorded session of Class 3 — Christian Doctrines",
    videoUrl: "",
    ebookUrl: "",
    ebookTitle: "",
    testUrl: "/archive/class-3/Christian Doctrines.pdf",
    testTitle: "Class 3 Test Questions — The Supremacy of the Bible / Doctrine",
  },

  {
    number: "Class 4",
    title: "Evangelism / Introduction to Embassy Ministries",
    slug: "class-4",
    date: "14 August",
    time: "7:00 PM",
    timezone: "GMT+1",
    description:
      "A recorded session of Class 4 — Evangelism / Introduction to Embassy Ministries.",
    videoUrl: "",
    ebookUrl: "",
    ebookTitle: "",
    testUrl: "",
    testTitle: "Class 4 Test — Coming Soon",
  },

  {
    number: "Class 5",
    title: "Christian Character and Prosperity",
    slug: "class-5",
    date: "15 August",
    time: "7:00 PM",
    timezone: "GMT+1",
    description:
      "A recorded session of Class 5 — Christian Character and Prosperity.",
    videoUrl: "",
    ebookUrl: "",
    ebookTitle: "",
    testUrl: "",
    testTitle: "Class 5 Test — Coming Soon",
  },

  {
    number: "Class 6",
    title: "Local Assembly and The Influencers Nation",
    slug: "class-6",
    date: "21 August",
    time: "7:00 PM",
    timezone: "GMT+1",
    description:
      "A recorded session of Class 6 — Local Assembly and The Influencers Nation.",
    videoUrl: "",
    ebookUrl: "",
    ebookTitle: "",
    testUrl: "",
    testTitle: "Class 6 Test — Coming Soon",
  },

  {
    number: "Class 7",
    title:
      "Introduction to Mobile Technology for Evangelism, Church Growth, and Ministry Expansion",
    slug: "class-7",
    date: "21 August",
    time: "7:00 PM",
    timezone: "GMT+1",
    description:
      "A recorded session of Class 7 — Introduction to Mobile Technology for Evangelism, Church Growth, and Ministry Expansion.",
    videoUrl: "",
    ebookUrl: "",
    ebookTitle: "",
    testUrl: "",
    testTitle: "Class 7 Test — Coming Soon",
  },

  {
    number: "Class 8",
    title: "IMC Excellence and Best Practices",
    slug: "class-8",
    date: "22 August",
    time: "7:00 PM",
    timezone: "GMT+1",
    description:
      "A recorded session of Class 8 — IMC Excellence and Best Practices.",
    videoUrl: "",
    ebookUrl: "",
    ebookTitle: "",
    testUrl: "",
    testTitle: "Class 8 Test — Coming Soon",
  },
];

export function getArchiveClass(slug: string) {
  return ARCHIVE_CLASSES.find((item) => item.slug === slug);
}
