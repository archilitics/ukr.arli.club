const subjects = [
  {
    id: "ya",
    label: "\u042F",
    english: "I",
    person: "first",
    number: "singular",
    gender: null,
  },
  {
    id: "ty",
    label: "\u0422\u0438",
    english: "You (informal)",
    person: "second",
    number: "singular",
    gender: null,
  },
  {
    id: "vin",
    label: "\u0412\u0456\u043D",
    english: "He",
    person: "third",
    number: "singular",
    gender: "masculine",
  },
  {
    id: "vona",
    label: "\u0412\u043E\u043D\u0430",
    english: "She",
    person: "third",
    number: "singular",
    gender: "feminine",
  },
  {
    id: "my",
    label: "\u041C\u0438",
    english: "We",
    person: "first",
    number: "plural",
    gender: null,
  },
  {
    id: "vy",
    label: "\u0412\u0438",
    english: "You (formal/plural)",
    person: "second",
    number: "plural",
    gender: null,
  },
  {
    id: "vony",
    label: "\u0412\u043E\u043D\u0438",
    english: "They",
    person: "third",
    number: "plural",
    gender: null,
  },
];

export const builderSubjects = subjects.filter(({ id }) =>
  ["ya", "ty", "vin", "vona", "vony"].includes(id),
);

export default subjects;
