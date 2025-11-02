export interface Chapter {
  name: string;
  subChapters: string[];
}
interface Subject {
  name: string;
  chapters: Chapter[];
}

interface Grade {
  name: string;
  subjects: Subject[];
}

const mockFileSystem: Grade[] = [
  {
    name: "",
    subjects: [
      {
        name: "Math",
        chapters: [
          {
            name: "algebra",
            subChapters: ["Linear Equations", "Quadratic Equations"],
          },
          { name: "geometry", subChapters: ["Triangles", "Circles"] },
        ],
      },
      {
        name: "Physics",
        chapters: [
          { name: "mechanics", subChapters: ["Newton's Laws", "Energy"] },
          { name: "thermodynamics", subChapters: ["Heat", "Entropy"] },
        ],
      },
    ],
  },
  {
    name: "10",
    subjects: [
      {
        name: "Math",
        chapters: [
          {
            name: "algebra",
            subChapters: ["Linear Equations", "Quadratic Equations"],
          },
          { name: "geometry", subChapters: ["Triangles", "Circles"] },
        ],
      },
      {
        name: "",
        chapters: [
          { name: "mechanics", subChapters: ["Newton's Laws", "Energy"] },
          { name: "thermodynamics", subChapters: ["Heat", "Entropy"] },
        ],
      },
    ],
  },
  {
    name: "year1",
    subjects: [
      {
        name: "economics",
        chapters: [
          {
            name: "chapter2",
            subChapters: [
              "2.1 Theory of Demand and Supply",
              "2.2 Theory of supply",
              "2.3 Market Equilibrium",
            ],
          },
          {
            name: "chapter3",
            subChapters: [
              "3.1 Consumer preferencesy",
              "3.2 The concept of utility",
              "3.3 Approaches of measuring utility",
            ],
          },
        ],
      },
      {
        name: "physics",
        chapters: [
          { name: "mechanics", subChapters: ["Newton's Laws", "Energy"] },
          { name: "thermodynamics", subChapters: ["Heat", "Entropy"] },
        ],
      },
    ],
  },
  {
    name: "12",
    subjects: [
      {
        name: "physics",
        chapters: [
          // { name: 'chapter1', subChapters: ['1_1', '1_2', '1_3', '1_4', '1_5'] },
          {
            name: "chapter2",
            subChapters: [
              "2.1 Projectile Motion",
              "2.2 Rotational Motion",
              "2.3 Rotational Dynamics",
              "2.4 Planetary Motion and Keplers Laws",
              "2.5 Newtons Law of Universal Gravitation",
            ],
          },
          {
            name: "chapter3",
            subChapters: [
              "3.1 Properties of Solids Liquids and Gases",
              "3.2 Pressure in Fluids at Rest",
              "3.3 Archimedes Principle",
              "3.4 Fluid Flow",
              "3.5 High Pressure Systems",
            ],
          },
          {
            name: "chapter4",
            subChapters: [
              "4.1 Introduction",
              "4.2 Magnetic Field Lines",
              "4.3 Current and Magnetism",
              "4.4 Electromagnetic Induction",
              "4.5 Faraday Law of Electromagnetic Induction",
              "4.6 Transformers",
              "4.7 Application and Safety",
            ],
          },
          {
            name: "chapter5",
            subChapters: [
              "5.1 Conductors Insulators and Semiconductors",
              "5.2 Diodes and their Functions",
              "5.3 Rectification",
              "5.4 Transistors and Their Application",
              "5.5 Integrated Circuits",
              "5.6 Logic Gates and Logic Circuits",
              "5.7 Applications of Electronics",
            ],
          },
        ],
      },
      {
        name: "chemistry",
        chapters: [
          {
            name: "chapter1",
            subChapters: [
              "1.1 Acid-Base Concepts",
              "1.2 Ionic Equilibria of Weak Acids and Bases",
              "1.3 Common-Ion Effect and Buffer Solutions",
              "1.4 Hydrolysis of Salts",
              "1.5 AcidBase Indicators and Titrations",
            ],
          },
          {
            name: "chapter2",
            subChapters: [
              "2.1 OxidationReduction Reactions",
              "2.2 Electrolysis of Aqueous Solutions",
              "2.3 Quantitative Aspects of Electrolysis",
              "2.4 Industrial Application of Electrolysis",
              "2.5 Voltaic Cells",
            ],
          },
          {
            name: "chapter3",
            subChapters: [
              "3.1 Introduction",
              "3.2 Natural Resources and Industry",
              "3.3 Manufacturing of Valuable Products Chemicals",
              "3.4 Some Manufacturing Industries in Ethiopia",
            ],
          },
          {
            name: "chapter4",
            subChapters: [
              "4.1 Introduction to Polymers",
              "4.2 Polymerization Reactions",
              "4.3 Classification of Polymers",
            ],
          },
          {
            name: "chapter5",
            subChapters: [
              "5.1 Environmental Chemistry",
              "5.2 Environmental Pollution",
              "5.3 Global Warming and Climate Change",
              "5.4 Green Chemistry and Cleaner Production",
            ],
          },
        ],
      },
      {
        name: "Biology",
        chapters: [
          {
            name: "chapter1",
            subChapters: [
              "1.1 Application In Conservation Of Natural Resources",
              "1.2 Food and Nutrition Security",
              "1.3 Creating Conscious Citizens and Ensuring Sustainable Development",
              "1.4 Applications in Biotechnology",
            ],
          },
          {
            name: "chapter2",
            subChapters: [
              "2.1 Eubacteria",
              "2.2 Archaea",
              "2.3 Fungi",
              "2.4 Protozoa",
              "2.5 Viruses",
              "2.6 Normal Microbionta",
              "2.7 Modes of Disease Transmission and Ways of Prevention",
              "2.8 Uses of Microorganisms",
              "2.9 Controlling Microorganisms",
              "2.10 Renowned Microbiologists in Ethiopia",
            ],
          },
          {
            name: "chapter3",
            subChapters: [
              "3.1 Cellular Metabolism",
              "3.2 Photosynthesis",
              "3.3 Contributions of Photosynthesis for the Continuity of Life, for O2 and CO2 Balance and Global Warming",
              "3.4 Cellular Respiration",
            ],
          },
          {
            name: "chapter4",
            subChapters: [
              "4.1 Evolution",
              "4.2 Renowned Anthropologists in Ethiopia",
              "4.3 Renowned Evolutionists in Ethiopia",
            ],
          },
          {
            name: "chapter5",
            subChapters: [
              "5.1 The Nervous System",
              "5.2 Sense Organs",
              "5.3 Homeostasis in the Human Body",
            ],
          },
          {
            name: "chapter6",
            subChapters: [
              "6.1 Climate Change: Causes and Effects",
              "6.2 Effects of Climate Change",
              "6.3 International Conventions",
            ],
          },
        ],
      },
      {
        name: "Mathematics",
        chapters: [
          {
            name: "chapter1",
            subChapters: [
              "1.1 Sequence",
              "1.2 Arithemetic and Geometric Sequences",
              "1.3 The Sigma Notation and Partial Sums",
              "1.4 Infinite Series",
              "1.5 Applications of Sequence and Series in Daily Life",
            ],
          },
          {
            name: "chapter2",
            subChapters: [
              "2.1 introduction to Derivatives",
              "2.2 Application of Derivatives",
              "2.3 Introduction to Integration",
            ],
          },
          {
            name: "chapter3",
            subChapters: [
              "3.1 measures of Absolute Dispersions",
              "3.2 Interpretation of Relative Dispersions",
              "3.3 Use of Frequency Curves",
              "3.4 Sampling Techinques",
            ],
          },
          {
            name: "chapter4",
            subChapters: [
              "4.1 Graphical Solutions of System of Linear Inequalities",
              "4.2 Maximum and Minimum Values",
              "4.3 Applications",
            ],
          },
          {
            name: "chapter5",
            subChapters: [
              "5.1 Basic Mathematical Concepts in Business",
              "5.2 Time Value of Money",
              "5.3 Saving, Investing and Borrowing Money",
              "5.4 Taxation",
            ],
          },
        ],
      },
      {
        name: "Economics",
        chapters: [
          {
            name: "chapter1",
            subChapters: [
              "1.1 Definition and Focus Areas of Macroeconomics Revisited",
              "1.2 Key Challenges in Macroeconomics",
              "1.3 The Schools of Thought in Macroeconomics Analysis",
            ],
          },
          {
            name: "chapter2",
            subChapters: [
              "2.1 Aggregate Demand",
              "2.2 Aggregate Supply",
              "2.3 Equilibrium of Aggregate Demand and Aggregate Supply",
            ],
          },
          {
            name: "chapter3",
            subChapters: [
              "3.1 Market Failure",
              "3.2 Public Goods",
              "3.3 Externalities",
              "3.4 Asymmetric Information",
              "3.5 Consumer Protection"
            ],
          },
          {
            name: "chapter4",
            subChapters: [
              "4.1 Definition and Types of Macroeconomic Policies",
              "4.2 Fiscal Policy",
              "4.3 Monetary Policy",
              "4.4 Income Policy and Wage",
              "4.5 Foreign Exchange Policy",
            ],
          },
          {
            name: "chapter5",
            subChapters: [
              "5.1 Taxes: Definition, Principles, Objectives and Classifications",
              "5.2 Approaches to Tax Equity",
              "5.3 Tax System and Structure in Ethiopia",
              "5.4 Types of Tax and Tax Accounting in Ethiopia",
              "5.5 Problems Associated with Taxation in Ethiopia",
            ],
          },
          {
            name: "chapter6",
            subChapters: [
              "6.1 Concept of Poverty and its Measurement",
              "6.2 Concept of Inequality and its Measurements",
              "6.3 Global and Regional Poverty",
              "6.4 Women and Poverty",
              "6.5 Overview of Poverty and Inequalities in Ethiopia",
              "6.6 Role of Indigenous Knowledge in Reducing Poverty"
            ],
          },
          {
            name: "chapter7",
            subChapters: [
              "7.1 National Development Objectives and Strategies- Historical Review",
              "7.2 Overview of Home-grown Economic Reforms in Ethiopia",
              "7.3 Fiscal Decentralization",
            ],
          },
          {
            name: "chapter8",
            subChapters: [
              "8.1 Economy and the Enviroment",
              "8.2 Global Warming and Climate Change",
              "8.3 Green Economy and Green Growth",
              "8.4 Overview of Enviroment and Climate Change in Ethiopia"
            ],
          },
        ],
      },
    ],
  },
];

export function getGrades(): string[] {
  return mockFileSystem.map((grade) => grade.name);
}

export function getSubjects(grade: string): string[] {
  const gradeData = mockFileSystem.find((g) => g.name === grade);
  return gradeData ? gradeData.subjects.map((subject) => subject.name) : [];
}

export function getFolderStructure(grade: string, course: string): Chapter[] {
  const gradeData = mockFileSystem.find((g) => g.name === grade);
  if (!gradeData) return [];

  const subjectData = gradeData.subjects.find((s) => s.name === course);
  return subjectData ? subjectData.chapters : [];
}
