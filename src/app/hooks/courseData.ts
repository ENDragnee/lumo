import { Code } from 'lucide-react';
import path from 'path';

// --- Define Interfaces/Types for Course Data Structure ---

// A chapter can be a simple string or a more detailed object.
// A ChapterObject can itself contain a list of sub-chapters.
// In courseData.ts
export type ChapterObject = {
  id: string;
  title?: string;
  description?: string;
  path?: string;
  duration?: number; // Duration in minutes
  topics: string[];
};

// Corrected: An array of chapters can contain a mix of strings or ChapterObjects.
export type ChaptersArray = ChapterObject[];

// A course is a detailed object.
export type CourseObject = {
  code: string;
  name:string;
  chapters: ChaptersArray; // Corrected: A course has one list of chapters.
  outcomes?: string[]; // Learning outcomes
  description?: string;
  instructor?: string;
  credits?: number;
  duration?: string;
  students?: number;
  prerequisites?: string[];
  [key: string]: any;
};

// Corrected: An array of courses can contain a mix of strings and CourseObjects.
export type CoursesArray = CourseObject[];

// A semester can either have streams (object mapping stream name to courses)
// or just be an array of courses directly.
export type StreamData = { [streamName: string]: CoursesArray };
export type SemesterData = CoursesArray | StreamData;

// A year maps semester names to semester data
export type YearData = { [semesterName: string]: SemesterData };

// A department has a name and course structure by year/semester
export type Department = {
  name: string;
  coursesByYearSemester: Record<string, YearData>; // Use Record for string keys
  abbreviation: string;
};

// A college has a name and a list of departments
export type College = {
  name: string;
  departments: Department[];
};

// The overall course data structure
export type CourseData = {
  colleges: College[];
};

export const courseData: CourseData = {
  colleges: [
    {
      name: 'College of Engineering',
      departments: [
        {
          name: 'Bachelor of Science Degree in Architecture',
          abbreviation: 'ARCH',
          coursesByYearSemester: {
            'Year 2': {
              'Semester I': [
                {
                  code: 'ARCH2101',
                  name: 'Basic Design',
                  description: 'An introduction to the fundamental principles and elements of 2D and 3D design, exploring form, space, and order.',
                  credits: 4,
                  instructor: 'Prof. A. Lemma',
                  outcomes: ['Understand core design principles.', 'Develop skills in visual composition.', 'Create basic 2D and 3D design projects.'],
                  chapters: [{
                    id: 'bd_ch1',
                    title: 'Introduction to Design Principles',
                    description: 'Explores the basic elements of design such as line, shape, color, and texture.',
                    duration: 240,
                    topics: ['Elements of Design', 'Principles of Composition', 'Color Theory', 'Texture and Pattern'],
                  }],
                },
                {
                  code: 'ARCH2103',
                  name: 'Building Materials and Construction I',
                  description: 'A study of the primary materials used in construction, including wood, masonry, and concrete, focusing on their properties and basic applications.',
                  credits: 3,
                  chapters: [],
                },
                {
                  code: 'ARCH2105',
                  name: 'Drawing (Geometric Descriptive and Drafting)',
                  description: 'Develops skills in technical drawing, including orthographic projections, sections, and descriptive geometry as a basis for architectural representation.',
                  credits: 3,
                  chapters: [],
                },
                {
                  code: 'ARCH2107',
                  name: 'Graphics Communication Skills I (Sketching I)',
                  description: 'Focuses on developing freehand sketching abilities to visually communicate architectural ideas and concepts quickly.',
                  credits: 2,
                  chapters: [],
                },
                {
                  code: 'ARCH2109',
                  name: 'Theory and Design of Structures I (Engineering Mechanics)',
                  description: 'Introduction to the principles of statics, including equilibrium of particles and rigid bodies, analysis of trusses, frames, and machines.',
                  credits: 3,
                  prerequisites: [],
                  chapters: [],
                },
              ],
              'Semester II': [
                {
                  code: 'ARCH2102',
                  name: 'Basic Architectural Design',
                  description: 'Application of basic design principles to simple architectural problems, focusing on space, form, and function.',
                  credits: 4,
                  prerequisites: ['ARCH2101'],
                  chapters: [],
                },
                {
                  code: 'ARCH2104',
                  name: 'Building Materials and Construction II',
                  description: 'A continuation of Building Materials I, with a focus on steel, glass, and composite materials, and their integration into building systems.',
                  credits: 3,
                  prerequisites: ['ARCH2103'],
                  chapters: [],
                },
                {
                  code: 'ARCH2106',
                  name: 'History of Architecture I',
                  description: 'A survey of architectural history from prehistoric times through the Gothic period, examining cultural, technological, and theoretical influences.',
                  credits: 3,
                  chapters: [],
                },
                {
                  code: 'ARCH2108',
                  name: 'Graphics Communication Skills II (Sketching II, Painting II)',
                  description: 'Advanced techniques in architectural representation, including perspective drawing, rendering, and use of color.',
                  credits: 2,
                  prerequisites: ['ARCH2107'],
                  chapters: [],
                },
                {
                  code: 'ARCH2110',
                  name: 'Theory and Design of Structures II (Strength of Materials)',
                  description: 'Covers the internal effects of forces on bodies, including stress, strain, torsion, bending, and shear in structural members.',
                  credits: 3,
                  prerequisites: ['ARCH2109'],
                  chapters: [],
                },
                {
                  code: 'ARCH2112',
                  name: 'Model Making Technique',
                  description: 'Hands-on studio course on the techniques and materials for creating physical architectural models for study and presentation.',
                  credits: 2,
                  chapters: [],
                },
              ],
            },
            'Year 3': {
              'Semester I': [
                {
                  code: 'ARCH3111',
                  name: 'Architectural Design I',
                  description: 'A studio-based course focusing on the design of small-scale buildings. Emphasizes site analysis, program development, and the integration of structural and environmental systems.',
                  credits: 5,
                  instructor: 'Dr. B. Tadesse',
                  prerequisites: ['ARCH2102'],
                  outcomes: [
                    'Analyze a project site and develop a comprehensive program.',
                    'Design a small-scale building that responds to context and user needs.',
                    'Integrate basic structural and environmental concepts into a design proposal.',
                    'Produce a set of architectural drawings to communicate a design.',
                  ],
                  chapters: [
                    {
                      id: 'ad1_ch1',
                      title: 'Site Analysis and Programming',
                      description: 'Techniques for analyzing physical and cultural site characteristics. Developing a detailed architectural program.',
                      duration: 360,
                      topics: ['Topography and Climate Analysis', 'Contextual Studies (Urban/Rural)', 'User Needs and Bubble Diagrams', 'Space Adjacency Requirements'],
                    },
                    {
                      id: 'ad1_ch2',
                      title: 'Conceptual Design',
                      description: 'Exploring initial design ideas through sketching, diagramming, and massing models.',
                      duration: 480,
                      topics: ['Parti Diagrams', 'Form Generation Strategies', 'Massing Studies', 'Circulation and Spatial Organization'],
                    },
                    {
                      id: 'ad1_ch3',
                      title: 'Design Development and Integration',
                      description: 'Refining the design with consideration for structure, materials, and building envelope.',
                      duration: 600,
                      topics: ['Structural Grid Layout', 'Material Selection and Tectonics', 'Facade Design', 'Basic Environmental Systems (Daylighting, Ventilation)'],
                    },
                    {
                      id: 'ad1_ch4',
                      title: 'Architectural Representation and Presentation',
                      description: 'Developing a cohesive set of drawings and models to present the final design project.',
                      duration: 480,
                      topics: ['Floor Plans, Sections, Elevations', 'Axonometric and Perspective Drawings', 'Final Model Construction', 'Verbal and Graphic Presentation Skills'],
                    },
                  ],
                },
                {
                  code: 'ARCH3113',
                  name: 'Building Materials and Construction III',
                  description: 'Advanced topics in construction, including building envelope systems, waterproofing, and interior finishes.',
                  credits: 3,
                  prerequisites: ['ARCH2104'],
                  chapters: [],
                },
                {
                  code: 'ARCH3115',
                  name: 'History of Architecture II',
                  description: 'A survey of architectural history from the Renaissance to the modern era, tracing major movements and theoretical shifts.',
                  credits: 3,
                  prerequisites: ['ARCH2106'],
                  chapters: [],
                },
                {
                  code: 'ARCH3119',
                  name: 'Graphics Communication Skills III (Professional CAD)',
                  description: 'Professional application of Computer-Aided Design (CAD) software for producing construction documents and architectural drawings.',
                  credits: 3,
                  chapters: [],
                },
                {
                  code: 'ARCH3121',
                  name: 'Theory and Design of Structures III',
                  description: 'Analysis of statically indeterminate structures and an introduction to the design of reinforced concrete and steel members.',
                  credits: 3,
                  prerequisites: ['ARCH2110'],
                  chapters: [],
                },
                {
                  code: 'ARCH3117',
                  name: 'Visual & History of Arts',
                  description: 'An exploration of major movements in art history and their relationship to architectural and cultural developments.',
                  credits: 2,
                  chapters: [],
                },
              ],
              'Semester II': [
                {
                  code: 'ARCH3120',
                  name: 'Architectural Design II',
                  description: 'Focuses on medium-scale buildings with more complex programs and urban contexts.',
                  credits: 5,
                  prerequisites: ['ARCH3111'],
                  chapters: [],
                },
                {
                  code: 'ARCH3114',
                  name: 'Architectural Sciences I (Water and sewage)',
                  description: 'Principles of plumbing, water supply, and waste disposal systems in buildings.',
                  credits: 2,
                  chapters: [],
                },
                {
                  code: 'ARCH3116',
                  name: 'General Building Heritage',
                  description: 'Introduction to the principles of architectural conservation and the study of historical building heritage.',
                  credits: 2,
                  chapters: [],
                },
                {
                  code: 'ARCH3118',
                  name: 'Landscape Design',
                  description: 'Fundamentals of landscape architecture, including site grading, planting design, and the relationship between buildings and their sites.',
                  credits: 3,
                  chapters: [],
                },
                {
                  code: 'ARCH3122',
                  name: 'Professional Practice I',
                  description: 'An introduction to the architectural profession, including ethics, forms of practice, and the roles and responsibilities of an architect.',
                  credits: 2,
                  chapters: [],
                },
                {
                  code: 'ARCH3124',
                  name: 'Surveying',
                  description: 'Principles and practices of land surveying for architectural and site planning purposes.',
                  credits: 2,
                  chapters: [],
                },
                {
                  code: 'ARCH3128',
                  name: 'Ethiopian History of Architecture',
                  description: 'A specialized study of the rich architectural traditions and history of Ethiopia from ancient to contemporary times.',
                  credits: 3,
                  chapters: [],
                },
                {
                  code: 'ARCH3126',
                  name: 'Introduction to Environmental Planning',
                  description: 'An overview of the principles and processes of environmental planning and its impact on community and regional design.',
                  credits: 2,
                  chapters: [],
                },
              ],
              'Semester III (Summer)': [
                {
                  code: 'ARCH3130',
                  name: 'Internship-I',
                  description: 'Practical work experience in an architectural firm or a related professional environment.',
                  credits: 1,
                  chapters: [],
                },
              ],
            },
            // ... Other years for ARCH ...
          },
        },
        {
          name: 'Bachelor of Science Degree in Civil Engineering',
          abbreviation: 'CEng',
          coursesByYearSemester: {
            'Year 2': {
                'Semester I (Pre-Engineering)': [
                    { code: 'MEng2001', name: 'Engineering Drawing', description: 'Fundamentals of technical drawing and drafting for engineers.', credits: 3, chapters: [] },
                    { code: 'Comp2003', name: 'Introduction to Computer Programming', description: 'Introduction to programming concepts using a high-level language like Python or C++.', credits: 3, chapters: [] },
                    { code: 'CEng2005', name: 'Engineering Mechanics I (Statics)', description: 'Analysis of forces on particles and rigid bodies in equilibrium.', credits: 3, chapters: [] },
                ],
                'Semester II': [
                    { code: 'MEng2102', name: 'Engineering Mechanics II (Dynamics)', description: 'Study of the motion of bodies under the action of forces.', credits: 3, prerequisites: ['CEng2005'], chapters: [] },
                    { code: 'CEng2104', name: 'Strength of Materials', description: 'Analysis of stress and strain in deformable bodies subjected to axial, torsional, and bending loads.', credits: 3, prerequisites: ['CEng2005'], chapters: [] },
                    { code: 'CEng2106', name: 'Hydraulics', description: 'Principles of fluid mechanics as applied to civil engineering systems, including hydrostatics and pipe flow.', credits: 3, chapters: [] },
                    { code: 'CEng2108', name: 'Engineering Surveying I', description: 'Fundamentals of land surveying, including measurement of distances, angles, and elevations.', credits: 3, chapters: [] },
                    { code: 'CEng2110', name: 'General Workshop Practice', description: 'Hands-on practice with basic manufacturing and construction tools and techniques.', credits: 1, chapters: [] },
                    { code: 'CEng2112', name: 'Engineering Geology', description: 'Study of geological principles and their application to civil engineering projects.', credits: 3, chapters: [] },
                ],
            },
            'Year 3': {
              'Semester I': [
                { code: 'CEng3101', name: 'Transport Engineering', description: 'Introduction to transportation systems, planning, and traffic engineering principles.', credits: 3, chapters: [] },
                { code: 'CEng3103', name: 'Soil Mechanics I', description: 'Study of the physical properties of soils, soil classification, and water flow in soils.', credits: 3, prerequisites: ['CEng2112'], chapters: [] },
                {
                  code: 'CEng3105',
                  name: 'Theory of Structures I',
                  description: 'Analysis of statically determinate structures, including beams, trusses, and frames. Covers influence lines and deflection analysis.',
                  credits: 4,
                  instructor: 'Dr. S. Gebremedhin',
                  prerequisites: ['CEng2104'],
                  outcomes: [
                    'Analyze forces and moments in determinate trusses, beams, and frames.',
                    'Calculate deflections and rotations of structures using various methods.',
                    'Construct influence lines for moving loads on determinate structures.',
                    'Understand the fundamental principles of structural stability and determinacy.',
                  ],
                  chapters: [
                    { id: 'tos1_ch1', title: 'Introduction and Structural Loads', description: 'Overview of structural engineering, types of structures, and calculation of dead, live, and environmental loads.', topics: ['Structural Forms', 'Load Paths', 'ASCE 7 Load Combinations', 'Tributary Areas'], duration: 180 },
                    { id: 'tos1_ch2', title: 'Analysis of Statically Determinate Trusses', description: 'Methods for finding forces in truss members.', topics: ['Method of Joints', 'Method of Sections', 'Zero-Force Members', 'Space Trusses'], duration: 300 },
                    { id: 'tos1_ch3', title: 'Analysis of Statically Determinate Beams and Frames', description: 'Calculating internal shear forces and bending moments.', topics: ['Shear and Moment Diagrams', 'Relationship between Load, Shear, and Moment', 'Analysis of Frames and Machines'], duration: 360 },
                    { id: 'tos1_ch4', title: 'Deflections of Structures', description: 'Methods to compute the displacement and rotation of structural elements.', topics: ['Double Integration Method', 'Moment-Area Theorems', 'Conjugate-Beam Method', 'Principle of Virtual Work'], duration: 420 },
                    { id: 'tos1_ch5', title: 'Influence Lines for Determinate Structures', description: 'Analyzing the effect of moving loads on structures.', topics: ['Influence Lines for Beams', 'Influence Lines for Trusses', 'Müller-Breslau Principle', 'Application for Maximum Shear and Moment'], duration: 300 },
                  ],
                },
                { code: 'CEng3107', name: 'Open Channel Hydraulics', description: 'Study of fluid flow with a free surface, primarily in rivers and canals.', credits: 3, prerequisites: ['CEng2106'], chapters: [] },
                { code: 'CEng3109', name: 'Construction Materials', description: 'In-depth study and laboratory testing of materials like concrete, asphalt, and steel.', credits: 3, chapters: [] },
                { code: 'CEng3111', name: 'Engineering Surveying II', description: 'Advanced surveying techniques including route surveying, construction surveys, and modern mapping.', credits: 3, prerequisites: ['CEng2108'], chapters: [] },
                { code: 'Stat3027', name: 'Probability and Statistics', description: 'Statistical methods for data analysis and probability theory for engineers.', credits: 3, chapters: [] },
              ],
              'Semester II': [
                { code: 'CEng3102', name: 'Highway Engineering I', description: 'Geometric design of highways, including horizontal and vertical alignment.', credits: 3, prerequisites: ['CEng3101'], chapters: [] },
                { code: 'CEng3104', name: 'Soil Mechanics II', description: 'Covers soil consolidation, shear strength, and earth pressure theories.', credits: 3, prerequisites: ['CEng3103'], chapters: [] },
                { code: 'CEng3106', name: 'Theory of Structures II', description: 'Analysis of statically indeterminate structures using classical and matrix methods.', credits: 3, prerequisites: ['CEng3105'], chapters: [] },
                { code: 'CEng3108', name: 'Engineering Hydrology', description: 'Study of the hydrologic cycle, precipitation, runoff, and streamflow analysis.', credits: 3, chapters: [] },
                { code: 'CEng3110', name: 'Building Construction', description: 'Methods and practices for constructing residential and commercial buildings.', credits: 2, chapters: [] },
                { code: 'CEng3112', name: 'Numerical Methods', description: 'Application of numerical techniques to solve complex engineering problems.', credits: 3, chapters: [] },
                { code: 'CEng3114', name: 'Computer Aided Drafting (CAD)', description: 'Using CAD software to produce civil engineering drawings.', credits: 2, chapters: [] },
              ],
            },
            // ... Other years for CEng ...
          },
        },
        {
          name: 'Bachelor of Science Degree in Software Engineering',
          abbreviation: 'SWEG',
          coursesByYearSemester: {
            'Year 2': {
                'Semester I': [
                    { code: 'SWEG2101', name: 'Introduction to Software Engineering and Computing', description: 'An overview of the software development lifecycle, methodologies, and the profession of software engineering.', credits: 3, chapters: [] },
                    { code: 'SWEG2103', name: 'Fundamentals of Programming I', description: 'Introduction to programming using a procedural language. Covers variables, control flow, functions, and basic data types.', credits: 4, chapters: [] },
                    { code: 'SWEG2105', name: 'Discrete Mathematics for Software Engineering', description: 'Fundamental mathematical concepts required for computer science, including logic, sets, relations, and graph theory.', credits: 3, chapters: [] },
                ],
                'Semester II': [
                    { code: 'SWEG2102', name: 'Fundamentals of Programming II', description: 'Builds on Programming I, introducing object-oriented concepts, basic data structures, and file I/O.', credits: 4, prerequisites: ['SWEG2103'], chapters: [] },
                    { code: 'EEng2004', name: 'Digital Logic Design', description: 'Fundamentals of digital circuits, Boolean algebra, combinational and sequential logic design.', credits: 3, chapters: [] },
                    { code: 'SWEG2106', name: 'Data Communication and Computer Networks', description: 'Introduction to network protocols, layered architectures (OSI, TCP/IP), and data transmission.', credits: 3, chapters: [] },
                    { code: 'SWEG2108', name: 'Database Systems', description: 'Introduction to database design, relational models, SQL, and normalization.', credits: 4, chapters: [] },
                    { code: 'Stat2091', name: 'Probability and Statistics', description: 'Statistical methods and probability theory with applications in software engineering and data analysis.', credits: 3, chapters: [] },
                ],
            },
            'Year 3': {
              'Semester I': [
                { code: 'SWEG3101', name: 'Object Oriented Programming', description: 'In-depth study of OOP principles including inheritance, polymorphism, and design patterns using languages like Java or C++.', credits: 4, prerequisites: ['SWEG2102'], chapters: [] },
                {
                  code: 'SWEG3103',
                  name: 'Data Structure and Algorithms',
                  description: 'A fundamental course on the design, analysis, and implementation of data structures and algorithms. Topics include lists, stacks, queues, trees, graphs, sorting, and searching.',
                  credits: 4,
                  duration: '16 weeks',
                  instructor: 'Dr. A. Turing',
                  prerequisites: ['SWEG2102', 'SWEG2105'],
                  outcomes: [
                    'Analyze the asymptotic performance of algorithms.',
                    'Implement and use major data structures including lists, stacks, queues, trees, and graphs.',
                    'Apply appropriate algorithms to solve computational problems.',
                    'Understand the trade-offs between different data structures and algorithms.',
                  ],
                  chapters: [
                    { id: 'dsa_ch1', title: 'Introduction and Analysis', description: 'Fundamentals of algorithm analysis and complexity.', duration: 180, topics: ['Asymptotic Notation (Big O, Omega, Theta)', 'Time and Space Complexity', 'Recursion Analysis'] },
                    { id: 'dsa_ch2', title: 'Linear Data Structures', description: 'Exploring sequential data organization.', duration: 240, topics: ['Arrays and Dynamic Arrays', 'Linked Lists (Singly, Doubly)', 'Stacks and their applications', 'Queues (Linear, Circular)'] },
                    { id: 'dsa_ch3', title: 'Non-Linear Data Structures: Trees', description: 'Hierarchical data structures.', duration: 300, topics: ['Binary Trees', 'Binary Search Trees (BST)', 'AVL Trees', 'Heaps and Priority Queues'] },
                    { id: 'dsa_ch4', title: 'Non-Linear Data Structures: Graphs', description: 'Representing and traversing networked data.', duration: 300, topics: ['Graph Representation (Adjacency Matrix, Adjacency List)', 'Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Topological Sort'] },
                    { id: 'dsa_ch5', title: 'Sorting and Searching Algorithms', description: 'Core algorithms for ordering and finding data.', duration: 240, topics: ['Bubble Sort, Insertion Sort, Selection Sort', 'Merge Sort, Quick Sort', 'Heap Sort', 'Linear Search, Binary Search'] },
                    { id: 'dsa_ch6', title: 'Hashing', description: 'Techniques for efficient data retrieval.', duration: 180, topics: ['Hash Functions', 'Collision Resolution (Chaining, Open Addressing)', 'Hash Tables'] },
                  ],
                },
                { code: 'SWEG3105', name: 'Computer Organization and Architecture', description: 'Study of computer hardware components, instruction set architecture, memory hierarchy, and performance.', credits: 3, prerequisites: ['EEng2004'], chapters: [] },
                { code: 'SWEG3107', name: 'Internet Programming I', description: 'Client-side web development using HTML, CSS, and JavaScript.', credits: 3, chapters: [] },
                { code: 'SWEG3109', name: 'System Analysis and Modeling', description: 'Techniques for analyzing and modeling software systems using UML and other modeling languages.', credits: 3, prerequisites: ['SWEG2101'], chapters: [] },
              ],
              'Semester II': [
                { code: 'SWEG3102', name: 'Internet Programming II', description: 'Server-side web development, focusing on backend frameworks, databases, and APIs.', credits: 3, prerequisites: ['SWEG3107', 'SWEG2108'], chapters: [] },
                { code: 'SWEG3104', name: 'Software Requirements Engineering', description: 'Methods for eliciting, analyzing, specifying, and managing software requirements.', credits: 3, prerequisites: ['SWEG3109'], chapters: [] },
                { code: 'SWEG3106', name: 'Operating Systems', description: 'Core concepts of operating systems, including process management, memory management, file systems, and concurrency.', credits: 3, prerequisites: ['SWEG3105'], chapters: [] },
                { code: 'SWEG3108', name: 'Advanced Programming', description: 'Explores advanced programming paradigms and techniques, such as functional programming, concurrency, and metaprogramming.', credits: 3, prerequisites: ['SWEG3101'], chapters: [] },
                { code: 'SWEG3110', name: 'Formal Language and Automata Theory', description: 'Study of formal grammars, automata, and the theory of computation.', credits: 3, prerequisites: ['SWEG2105'], chapters: [] },
              ],
            },
            // ... Other years for SWEG ...
          },
        },
        // ... Other departments in Engineering ...
      ],
    },
    {
      name: 'College of Natural and Applied Sciences',
      departments: [
        {
          name: 'Bachelor of Science Degree in Food Sciences and Applied Nutrition',
          abbreviation: 'FSAN',
          coursesByYearSemester: {
            'Year 2': {
                'Semester I': [
                    { code: 'Inch2205', name: 'Fundamentals of Analytical Chemistry', description: 'Introduction to the principles and techniques of chemical analysis.', credits: 3, chapters: [] },
                    { code: 'FSAN2101', name: 'Introduction to Food Science and Nutrition', description: 'An overview of the food industry, food components, and the role of nutrition in human health.', credits: 3, chapters: [] },
                    { code: 'FSAN2103', name: 'Human Anatomy and Physiology', description: 'Study of the structure and function of the human body.', credits: 3, chapters: [] },
                    {
                        code: 'FSAN2105',
                        name: 'Food Chemistry',
                        description: 'A detailed study of the chemical composition of foods, including carbohydrates, lipids, proteins, and water, and the chemical changes they undergo during processing and storage.',
                        credits: 4,
                        instructor: 'Dr. M. Pasteur',
                        prerequisites: ['FSAN2101'],
                        outcomes: [
                            'Identify the major chemical components of food.',
                            'Explain the functional properties of food macromolecules.',
                            'Describe key chemical reactions occurring in food, such as Maillard browning and lipid oxidation.',
                            'Analyze the impact of processing on the chemical composition of food.',
                        ],
                        chapters: [
                            { id: 'fchem_ch1', title: 'Water in Food', description: 'The role and properties of water in food systems.', duration: 180, topics: ['Structure of Water', 'Water Activity', 'Moisture Sorption Isotherms', 'Role of Water in Food Stability'] },
                            { id: 'fchem_ch2', title: 'Carbohydrates', description: 'Structure, properties, and reactions of monosaccharides, oligosaccharides, and polysaccharides in food.', duration: 240, topics: ['Sugars and Sweeteners', 'Starch Gelatinization and Retrogradation', 'Dietary Fibers', 'Browning Reactions (Maillard, Caramelization)'] },
                            { id: 'fchem_ch3', title: 'Lipids', description: 'Chemistry of fats and oils, including their structure, properties, and changes during processing.', duration: 240, topics: ['Fatty Acids and Triglycerides', 'Lipid Oxidation', 'Hydrogenation', 'Emulsions and Emulsifiers'] },
                            { id: 'fchem_ch4', title: 'Proteins', description: 'The structure, function, and properties of proteins in food.', duration: 240, topics: ['Amino Acids and Protein Structure', 'Protein Denaturation', 'Enzymatic Reactions', 'Functional Properties (Gelling, Foaming)'] },
                            { id: 'fchem_ch5', title: 'Vitamins, Minerals, and Pigments', description: 'The chemistry of micronutrients and natural colorants in food.', duration: 180, topics: ['Water-Soluble and Fat-Soluble Vitamins', 'Bioavailability of Minerals', 'Chlorophylls, Carotenoids, Anthocyanins', 'Nutrient Stability during Processing'] },
                        ],
                    },
                    { code: 'FSAN2107', name: 'Principle of Food Processing and Preservation', description: 'Fundamental principles of thermal processing, freezing, drying, and other methods used to preserve food.', credits: 3, chapters: [] },
                ],
                'Semester II': [
                    { code: 'Inch2503', name: 'Biochemistry', description: 'Study of the chemical processes within and relating to living organisms.', credits: 3, chapters: [] },
                    { code: 'FSAN2102', name: 'Food Microbiology', description: 'Study of microorganisms in food, including spoilage, pathogenic, and beneficial microbes.', credits: 3, chapters: [] },
                    { code: 'FSAN2104', name: 'Food Toxicology', description: 'Principles of toxicology as applied to natural and man-made toxins in the food supply.', credits: 2, chapters: [] },
                    { code: 'FSAN2106', name: 'Food Analysis and Instrumentation', description: 'Practical methods and instrumentation for the chemical and physical analysis of food.', credits: 3, prerequisites: ['Inch2205'], chapters: [] },
                    { code: 'FSAN2108', name: 'Unit Operation in Food Processing', description: 'Engineering principles of heat transfer, fluid flow, and mass transfer in food processing operations.', credits: 3, chapters: [] },
                    { code: 'FSAN2110', name: 'Indigenous food processing and Biotechnology', description: 'Exploration of traditional food processing techniques and the application of biotechnology in food production.', credits: 2, chapters: [] },
                ],
            },
            // ... Other years for FSAN ...
          },
        },
        // ... Other departments in Natural Sciences ...
      ],
    },
  ],
};