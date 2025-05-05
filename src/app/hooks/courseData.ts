import { Code } from 'lucide-react';

// courseData.js
const parseCourseString = (courseString:string) => {
  if (typeof courseString !== 'string') return courseString; // Avoid processing non-strings

  const parts = courseString.split(':');
  let code = null;
  let name = courseString.trim();
  let isPlaceholder = false;

  // Basic check for a typical course code format (e.g., XXXX1234) at the beginning
  if (parts.length > 1 && parts[0].trim().match(/^[A-Za-z]{2,4}\d{4}$/)) {
    code = parts[0].trim();
    name = parts.slice(1).join(':').trim(); // Join back in case name had colons
  } else if (
    courseString.startsWith('---') ||
    courseString.toLowerCase().includes('elective')
  ) {
    // Identify placeholders or elective markers
    isPlaceholder = true;
    // Keep code null for these, name is the full string
  }
  // For other strings without a clear code: name format, code remains null, name is the full string

  const courseObject = {
    code: code,
    name: name,
    chapters: [], // Initialize with an empty array for chapters
    type: 'course', // Default type
  };

  if (isPlaceholder) {
    courseObject.type = 'placeholder'; // Add an optional type hint
  }

  return courseObject;
};

export const courseData = {
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
                  chapters: [],
                },
                {
                  code: 'ARCH2103',
                  name: 'Building Materials and Construction I',
                  chapters: [],
                },
                {
                  code: 'ARCH2105',
                  name: 'Drawing (Geometric Descriptive and Drafting)',
                  chapters: [],
                },
                {
                  code: 'ARCH2107',
                  name: 'Graphics Communication Skills I (Sketching I)',
                  chapters: [],
                },
                {
                  code: 'ARCH2109',
                  name: 'Theory and Design of Structures I (Engineering Mechanics)',
                  chapters: [],
                },
              ],
              'Semester II': [
                {
                  Code: 'ARCH2102',
                  name: 'Basic Architectural Design',
                  chapters: [],
                },
                {
                  code: 'ARCH2104',
                  name: 'Building Materials and Construction II',
                  chapters: [],
                },
                {
                  code: 'ARCH2106',
                  name: 'History of Architecture I',
                  chapters: [],
                },
                {
                  code: 'ARCH2108',
                  name: 'Graphics Communication Skills II (Sketching II, Painting II)',
                  chapters: [],
                },
                {
                  code: 'ARCH2110',
                  name: 'Theory and Design of Structures II (Strength of Materials)',
                  chapters: [],
                },
                {
                  code: 'ARCH2112',
                  name: 'Model Making Technique',
                  chapters: [],
                },
              ],
            },
            'Year 3': {
              'Semester I': [
                {
                  code: 'ARCH3111',
                  name: 'Architectural Design I',
                  chapters: 5,
                },
                {
                  code: 'ARCH3113',
                  name: 'Building Materials and Construction III',
                  chapters: 5,
                },
                {
                  code: 'ARCH3115',
                  name: 'History of Architecture II',
                  chapters: 5,
                },
                {
                  code: 'ARCH3119',
                  name: 'Graphics Communication Skills III (Professional CAD)',
                  chapters: 5,
                },
                {
                  code: 'ARCH3121',
                  name: 'Theory and Design of Structures III',
                  chapters: 5,
                },
                {
                  code: 'ARCH3117',
                  name: 'Visual & History of Arts',
                  chapters: 5,
                },
              ],
              'Semester II': [
                {
                  code: 'ARCH3120',
                  name: 'Architectural Design II',
                  chapters: 5,
                },
                {
                  code: 'ARCH3114',
                  name: 'Architectural Sciences I (Water and sewage)',
                  chapters: 5,
                },
                {
                  code: 'ARCH3116',
                  name: 'General Building Heritage',
                  chapters: 5,
                },
                {
                  code: 'ARCH3118',
                  name: 'Landscape Design',
                  chapters: 5,
                },
                {
                  code: 'ARCH3122',
                  name: 'Professional Practice I',
                  chapters: 5,
                },
                {
                  code: 'ARCH3124',
                  name: 'Surveying',
                  chapters: 5,
                },
                {
                  code: 'ARCH3128',
                  name: 'Ethiopian History of Architecture',
                  chapters: 5,
                },
                {
                  code: 'ARCH3126',
                  name: 'Introduction to Environmental Planning',
                  chapters: 5,
                },
              ],
              'Semester III (Summer)': [
                {
                  code: 'ARCH3130',
                  name: 'Internship-I',
                  chapters: 5,
                },
              ],
            },
            'Year 4': {
              'Semester I': [
                {
                  code: 'ARCH4125',
                  name: 'Architectural Sciences II (heating, cooling, ventilation)',
                  chapters: 5,
                },
                {
                  code: 'ETP4115',
                  name: 'Integrated Engineering Team Project',
                  chapters: 5,
                },
                {
                  code: 'ARCH4129',
                  name: 'Building Workshop I (Masonry)',
                  chapters: 5,
                },
                {
                  code: 'ARCH4131',
                  name: 'Integrated Design Project I',
                  chapters: 5,
                },
                {
                  code: 'ARCH4133',
                  name: 'Introduction to Urban Planning',
                  chapters: 5,
                },
                {
                  code: 'ARCH4135',
                  name: 'Professional Practice II',
                  chapters: 5,
                },
                {
                  code: 'ARCH4123',
                  name: 'Theory of Architecture I',
                  chapters: 5,
                },
              ],
              'Semester II': [
                'ARCH4142: Appropriate Building Technology',
                'ARCH4144: Architectural Sciences III (Light & Energy)',
                'ARCH4132: Basic Urban Design',
                'ARCH4134: Building Workshop II (Carpentry)',
                'COMP4136: Computer Programming', // Note affiliation
                'ARCH4138: Integrated Design Project II',
                'ARCH4140: Theory of Architecture II',
              ],
              'Semester III (Summer)': ['ARCH4146: Internship-II'],
            },
            'Year 5': {
              'Semester I': [
                'ARCH5137: Architectural Science IV (Acoustics)',
                'ARCH5135: Building Information Modeling (BIM)',
                'ARCH5141: Final Year Project (Research)',
                'ARCH5143: Housing & Inner-City Redevelopment',
                'ARCH5145: Integrated Design Project III',
                'ARCH5152: Urban Sociology', // Original listed ARCH5139, using 5152 as per list
                'ARCH5149: Interior Design',
              ],
              'Semester II': [
                'ARCH5150: Final Year Project (Studio)',
                'ARCH5148: Ecological Architecture & Urbanism',
                'ARCH5152: Construction Management', // Original listed ARCH5152, could be ARCH5147? Using 5152
                '--- Electives ---', // Separator for clarity
                'ARCH5254: Advanced Building Structures',
                'ARCH5251: Advanced Landscape Architecture',
                'ARCH5252: Advanced Urban Design',
                'ARCH5253: Architecture Heritage and Conservation',
              ],
            },
          },
        },
        {
          name: 'Bachelor of Science Degree in Civil Engineering',
          abbreviation: 'CEng',
          coursesByYearSemester: {
            'Year 2': {
              'Semester I (Pre-Engineering)': [
                'MEng2001: Engineering Drawing',
                'Comp2003: Introduction to Computer Programming',
                'CEng2005: Engineering Mechanics I (Statics)',
              ],
              'Semester II': [
                'MEng2102: Engineering Mechanics II (Dynamics)',
                'CEng2104: Strength of Materials',
                'CEng2106: Hydraulics',
                'CEng2108: Engineering Surveying I',
                'CEng2110: General Workshop Practice',
                'CEng2112: Engineering Geology',
              ],
            },
            'Year 3': {
              'Semester I': [
                'CEng3101: Transport Engineering',
                'CEng3103: Soil Mechanics I',
                'CEng3105: Theory of Structures I',
                'CEng3107: Open Channel Hydraulics',
                'CEng3109: Construction Materials',
                'CEng3111: Engineering Surveying II',
                'Stat3027: Probability and Statistics', // Note: Likely National/Supportive but listed here
              ],
              'Semester II': [
                'CEng3102: Highway Engineering I',
                'CEng3104: Soil Mechanics II',
                'CEng3106: Theory of Structures II',
                'CEng3108: Engineering Hydrology',
                'CEng3110: Building Construction',
                'CEng3112: Numerical Methods',
                'CEng3114: Computer Aided Drafting (CAD)',
              ],
            },
            'Year 4': {
              'Semester I': [
                'CEng4103: Highway Engineering II',
                'EnEng4105: Environmental Engineering',
                'CEng4107: Reinforced Concrete Structures I',
                'CEng4109: Hydraulic Structures I',
                'CEng4111: Specification and Quantity Survey',
                'CEng4115: Fundamental of Architecture', // Original listed CEng4113, using 4115 as per list
                'IETP4115: Integrated Engineering Team Project', // Note affiliation
              ],
              'Semester II': [
                'CEng4102: Construction Equipment',
                'CEng4104: Technical Report Writing & Research Methodology',
                'CEng4106: Foundation Engineering I',
                'CEng4108: Reinforced Concrete Structures II',
                'CEng4110: Hydraulic Structures II',
                'CEng4112: Water Supply and Urban Drainage',
                'CEng4114: Procurement and Contract Administration',
                'CEng4116: Engineering Economics', // Note code clarification
              ],
              'Semester III (Summer)': [
                'CEng4118: Internship Practice', // Original listed CEng4116, using 4118 as per list
              ],
            },
            'Year 5': {
              'Semester I': [
                'CEng5101: BSc thesis I (Proposal Preparation)',
                'CEng5103: Integrated Civil Engineering Design',
                'CEng5105: Railway Engineering',
                'CEng5107: Foundation Engineering II',
                'CEng5109: Structural Design',
                'CEng5111: Steel & Timber Structures',
                'CEng5113: Irrigation Engineering',
              ],
              'Semester II': [
                'CEng5102: BSc thesis II (Main Research)',
                'CEng5106: Construction Management',
                'CEng5112: Fundamental of Bridge Design',
                'CEng5114: Waste Water and Solid Waste Treatment',
                'Elective I (Choose from list)',
                // Elective Choices for reference:
                // CEng5204: Highway Engineering III
                // CEng5206: Tunneling
                // CEng5210: Reinforced Concrete structures III
                // CEng5212: Water Resource Development
                // CEng5214: Geographic Information System (GiS)
                // CEng5216: Building Information Modelling (BIM)
              ],
            },
          },
        },
        {
          name: 'Bachelor of Science Degree in Mining Engineering',
          abbreviation: 'MnEg',
          coursesByYearSemester: {
            'Year 2': {
              'Semester I': [
                'MEng2001: Engineering Drawing',
                'Comp2003: Introduction to Computer Programming',
                'CEng2005: Engineering Mechanics I Statics',
              ],
              'Semester II': [
                'MnEg2102: Geology for Mining Engineers I',
                'Chem2004: General Chemistry', // Note: Supportive, but listed here
                'CEng2006: Strength of Materials',
                'EEEg2008: Fundamentals of Electrical Engineering',
                'MEng2010: Engineering Mechanics II (Dynamics)', // Original listed MEng2102, using 2010 as per list
              ],
            },
            'Year 3': {
              'Semester I': [
                'MnEg3101: Introduction to Mining Engineering',
                'MnEg3103: Mine Equipment and Machinery I',
                'MnEg3105: Geology for Mining Engineers II',
                'MEng3007: Fluids Mechanics',
                'MEng3109: Introduction to Surveying',
                'MnEg3111: Rock mechanics',
                'Stat2091: Probability and Statistics', // Note: Supportive, but listed here
              ],
              'Semester II': [
                'MnEg3102: Surface Mining Methods',
                'MnEg3104: Mine Hazards and Rescue',
                'MnEg3106: Structural geology',
                'MnEg 3108: Mining Equipment and Machinery II',
                'MnEg3110: Drilling and Blasting',
                'MnEg3112: Rock Engineering',
              ],
            },
            'Year 4': {
              'Semester I': [
                'MnEg4101: Mine Ground control and Instrumentation',
                'IETP4115: Integrated Engineering Team Project', // Note affiliation
                'MnEg4105: Surface Mine Planning and Design',
                'MnEg4107: Underground coal Mining Methods',
                'MnEg4109: Mine Surveying',
                'MnEg4111: Computer Aided Mine Planning and Design',
              ],
              'Semester II': [
                'MnEg4102: Mine Safety and Health',
                'MnEg4104: Mineral Processing Technology',
                'MnEg4106: Underground Mine Planning and Design',
                'MnEg4108: Underground Metal Mining',
                'MnEg4110: Resource Estimation and Ore Body Modeling',
                'MnEg4112: Environmental aspects of Mining',
              ],
              'Semester III (Summer)': [
                'MnEg4114: Internship', // Original listed MnEg4113, using 4114 as per list
              ],
            },
            'Year 5': {
              'Semester I': [
                'MnEg5101: Mine Ventilation',
                'MnEg5103: Integrated Mining Design Project',
                'MnEg5107: Rock Excavation Engineering',
                'MnEg5109: Mineral Economics',
                'Elective I (Choose from list)',
                // Elective Choices for reference:
                // MnEg5111: Gemstone Mining
                // MnEg5113: Solution mining
                'MnEg5115: PART-I B.Sc Thesis (proposal)',
              ],
              'Semester II': [
                'MnEg5102: Mine law & Regulations',
                'MnEg5104: Energy Resource Exploitation',
                'MnEg5106: Mine Project Management',
                'MnEg5108: PART-II B.Sc. Thesis',
                'Elective II (Choose from list)',
                // Elective Choices for reference:
                // MnEg5210: Dimensional Stone Mining
                // MnEg5212: Mine Automation
              ],
            },
          },
        },
        {
          name: 'Bachelor of Science Degree in Chemical Engineering',
          abbreviation: 'ChEg',
          coursesByYearSemester: {
            'Year 2': {
              'Semester I': [
                'MEng2001: Engineering Drawing',
                'Comp2003: Introduction to Computer programming',
                'CEng2005: Engineering Mechanics I Statics',
              ],
              'Semester II': [
                'MEng2002: Engineering Mechanics II Dynamics',
                'Stat2004: Probability and Statistics', // Note: Supportive, but listed here
                'ChEg2106: Basic Principles of Process Calculations',
                'InCh2108: Applied Inorganic Chemistry',
                'MEng2014: Workshop practice',
              ],
            },
            'Year 3': {
              'Semester I': [
                'ChEg3101: Technical Report Writing', // Note: Supportive, but listed here
                'InCh3103: Applied Organic Chemistry',
                'ChEg3105: Numerical Methods in Chemical Engineering',
                'ChEg3107: Chemical Engineering Thermodynamics I',
                'InCh3109: Fundamentals of Analytical Chemistry',
                'ChEg3111: Transport Phenomena',
                'ChEg3113: Fluid Mechanics',
              ],
              'Semester II': [
                'ChEg3102: Mechanical Unit Operations',
                'ChEg3104: Reaction Engineering I -Reaction Kinetics',
                'ChEg3106: Thermal Unit Operations',
                'ChEg3108: Material Science and Engineering',
                'ChEg3110: Chemical Engineering Thermodynamics II',
                'ChEg3112: Fluid Machines for Chemical Engineers',
                'ChEg3114: Mechanical Unit Operations Laboratory',
              ],
            },
            'Year 4': {
              'Semester I': [
                'ChEg4101: Reaction Engineering II-Reactor Design',
                'ChEg4103: Reaction Engineering Laboratory',
                'IETP4115: Integrated Engineering Team Project', // Note affiliation
                'ChEg4107: Thermal and Mass Transfer Unit Operations Laboratory',
                'EEEg4009: Basic Electrical Circuit and Introduction to Electrical Machine',
                'EnEg4111: Basic Environmental Engineering',
                'ChEg4113: Mass Transfer Unit Operations',
              ],
              'Semester II': [
                'ChEg4102: Process Dynamics and Control',
                'ChEg4104: Process Control Laboratory',
                'ChEg4106: Fundamentals of Biochemical Engineering',
                'ChEg4108: Process Industries',
                'ChEg4110: Chemical Engineering Apparatus Design',
                'MEng4012: Strength of Materials',
              ],
              'Semester III (Summer)': ['ChEg4115: Internship'],
            },
            'Year 5': {
              'Semester I': [
                'ChEg5103: Computer Aided Process Design and Simulation',
                'ChEg5117: Integrated Plant Design Project',
                'ChEg5107: Plant Design and Economics',
                'ChEg5109: Sustainable Resources and Energy Technology',
                'ChEg5111: Research Method and Experimental Design',
                'ChEg5113: Process Integration and optimizations',
                'ChEg5115: Final Year Project-Phase One',
              ],
              'Semester II': [
                'ChEg5102: Electro-chemical Engineering',
                'ChEg5104: Production and Project Management',
                'ChEg5106: Industrial Safety and Loss Management',
                'Elective (Choose from list)',
                // Elective Choices for reference:
                // ChEg5210: Introduction to Food Process Technology
                // ChEg5212: Polymer Science and Engineering
                // ChEg5214: Petroleum Refining Engineering
                // ChEg5216: Fundamentals of Bioprocessing Engineering
                // ChEg5218: Fundamentals of Pharmaceutical Technology
                // ChEg5220: Energy Management and Audit
                // ChEg5222: Fundamentals of Textile Chemical Processing
                // ChEg5224: Fundamental of Nuclear Engineering
                'ChEg5108: Final Year Project –Phase Two',
              ],
            },
          },
        },
        {
          name: 'Bachelor of Science Degree in Environmental Engineering',
          abbreviation: 'EnEg',
          coursesByYearSemester: {
            'Year 2': {
              'Semester I': [
                'MEng2001: Engineering Drawing',
                'Comp 2003: Introduction to Computer Programming',
                'CEng2005: Engineering Mechanics I (Statics)',
              ],
              'Semester II': [
                'EnEg 2102: Environmental Microbiology',
                'MEng2002: Engineering Mechanics II (Dynamics)',
                'ChEg2004: Thermodynamics',
                'CEng2002: Strength of Materials', // Note: Original code, likely supportive CEng
              ],
            },
            'Year 3': {
              'Semester I': [
                'EnEg3103: Environmental Chemistry',
                'ChEg3101: Material and Energy balance',
                'EnEg3105: Environmental Engineering Hydrology',
                'ChEg3103: Fluid Mechanics',
                'EnEg3107: Transport phenomena for environmental engineering',
                'CEng3101: Survey',
                'EnEg3101: Fundamental of Soils and Pollution Control',
              ],
              'Semester II': [
                'Stat3102: Probability and statistics', // Note: Supportive, but listed here
                'EnEg3104: Air pollution Engineering I',
                'CEng3102: Reinforced Concrete Design',
                'EnEg3106: Water Treatment Engineering',
                'ChEg3102: Unit operation',
                'ChEg3104: Reaction Engineering',
              ],
            },
            'Year 4': {
              'Semester I': [
                'EnEg4101: Air pollution engineering II',
                'IETP 4115: Integrated Engineering Team Project', // Note affiliation
                'EnEg4105: Engineering economics',
                'EnEg4103: Numerical analysis for Environmental Engineering',
                'EnEg4107: Energy and the environment',
                'EnEg4109: Wastewater treatment engineering',
              ],
              'Semester II': [
                'EnEg4102: Solid waste engineering',
                'EnEg4104: Sewerage and drainage engineering',
                'EnEg4106: GIS and remote sensing',
                'EnEg4108: Software applications for Environmental Engineering',
                'EnEg4110: Waste to Energy Technology',
                'EnEg4112: Environmental Impact Assessment',
                'EnEg4114: Environmental Policy and Management Systems',
              ],
              'Semester III (Summer)': ['EnEg4116: Internship'],
            },
            'Year 5': {
              'Semester I': [
                'EnEg5111: Integrated Environmental Engineering Project Design',
                'EnEg5101: Renewable Energy Engineering',
                'EnEg5103: Ecological Engineering',
                'EnEg5105: Hazardous and E-waste engineering',
                'EnEg5109: Soil Pollution Remediation Technologies',
                'EnEg52xx: Elective I (Choose from list)',
                'EnEg5107: Final Year Project I',
              ],
              'Semester II': [
                'EnEg5102: Industrial Waste Management Technologies',
                'EnEg5104: Health, Safety and Environment (HSE) Engineering',
                'EnEg5106: Final Year Project II',
                'EnEg5108: Climate Change, Adaptation & Mitigation Technologies',
                'EnEg52xx: Elective II (Choose from list)',
              ],
              // Elective Choices for reference:
              // EnEg5201: Environmental Biotechnology
              // EnEg 5203: Cleaner Production and LCA
              // EnEg 5205: Air Quality Modeling and Forecasting
              // EnEg 5207: Sludge Treatment Technologies
              // EnEg5202: Ecological risk assessment
              // EnEg 5204: Green building and energy conservation
              // EnEg 5206: Emerging technologies for water and wastewater treatment
            },
          },
        },
        {
          name: 'Bachelor of Science Degree in Electrical and Computer Engineering',
          abbreviation: 'ECEg',
          coursesByYearSemester: {
            'Year 2': {
              'Semester I': [
                'MEng2001: Engineering Drawing',
                'Comp2003: Introduction to Computer Programming',
                'CEng2005: Engineering Mechanics I (Statics)',
              ],
              'Semester II': [
                'ECEg2102: Fundamentals of Electrical Engineering',
                'MEng2102: Engineering Mechanics-II (Dynamics)',
                'ECEg2110: Probability and Random Processes',
                'MEng2114: Engineering Thermodynamics',
              ],
            },
            'Year 3': {
              'Semester I': [
                'ECEg3101: Computational Methods',
                'ECEg3103: Applied Electronics I',
                'ECEg3105: Signals and System Analysis',
                'ECEg3107: Electromagnetic Fields',
                'ECEg3109: Object Oriented Programming',
                'ECEg3111: Research Methods and Presentation',
                'ECEg3113: Electrical Workshop Practices I',
              ],
              'Semester II': [
                'ECEg3102: Applied Electronics II',
                'ECEg3104: Digital Logic Design',
                'ECEg3106: Network Analysis and Synthesis',
                'ECEg3108: Digital Signal Processing',
                'ECEg3110: Electrical Machines I',
                'ECEg3112: Electrical Workshop Practices II',
              ],
            },
            'Year 4': {
              'Semester I': [
                'ECEg4101: Introduction to Communication Systems',
                'ECEg4103: Computer Architecture and Organization',
                'ECEg4105: Introduction to Control Systems',
                'ECEg4107: Electrical Measurement and Instrumentation',
                'ECEg4109: Power Systems I',
                'IETP4115: Integrated Engineering Team Project', // Note affiliation
              ],
              'Semester II': {
                // Nested object for streams
                'Communication Engineering Stream': [
                  'ECEg4102: Microprocessors and Interfacing',
                  'ECEg4304: Digital Communication Systems',
                  'ECEg4406: Data Communications and Computer Networks',
                  'ECEg4308: EM waves and Guide Structures',
                  'ECEg4112: Integrated Design Project',
                ],
                'Computer Engineering Stream': [
                  'ECEg4102: Microprocessors and Interfacing',
                  'ECEg4404: Data Structures and Algorithm',
                  'ECEg4410: Database Systems',
                  'ECEg4112: Integrated Design Project',
                  'ECEg4406: Data Communications and Computer Networks',
                ],
                'Control Engineering Stream': [
                  'ECEg4510: Modern Control Systems',
                  'ECEg4704: Electrical Machines II',
                  'ECEg4506: Process Control Fundamentals',
                  'ECEg4112: Integrated Design Project',
                  'ECEg4102: Microprocessors and Interfacing',
                ],
                'Electronics Engineering Stream': [
                  'ECEg4102: Microprocessors and Interfacing',
                  'ECEg4304: Digital Communication Systems',
                  'ECEg4308: EM Waves and Guide Structures',
                  'ECEg4112: Integrated Design Project',
                  'ECEg5606: Analog System Design', // Note: 5xxx code in Year 4
                  'ECEg5608: Power Electronics', // Note: 5xxx code in Year 4
                ],
                'Power Engineering Stream': [
                  'ECEg4510: Modern Control Systems',
                  'ECEg4704: Electrical Machines II',
                  'ECEg4102: Microprocessors and Interfacing',
                  'ECEg4112: Integrated Design Project',
                  'ECEg4708: Power Systems II',
                ],
              },
              Summer: [
                // Assuming this is Semester III (Summer)
                'ECEg4100 / EEEg4100: Industry Internship', // Using consistent ECEg4100
              ],
            },
            'Year 5': {
              'Semester I': {
                // Nested object for streams
                'Communication Engineering Stream': [
                  'ECEg5301: Microwave Devices and Systems',
                  'ECEg5303: Fiber Optics Communications',
                  'ECEg5305: Antennas and Radio Wave Propagations',
                  'ECEg5307: Wireless and Mobile Communications',
                  'ECEg5605: Microelectronic Devices and Circuits',
                  'ECEg5311: Telecommunication Networks',
                  'ECEg5107: Final year project I',
                ],
                'Computer Engineering Stream': [
                  'ECEg5409: Software Engineering',
                  'ECEg5401: Operating Systems',
                  'ECEg5403: Embedded Systems',
                  'ECEg5405: VLSI Design',
                  'ECEg5407: Introduction to Machine Learning',
                  'ECEg5511: Robotics and Computer Vision',
                  'ECEg5107: Final year project I',
                ],
                'Control Engineering Stream': [
                  'ECEg5701: Power Electronics and Electric Drives',
                  'ECEg5705: Electrical Installation',
                  'ECEg5503: Embedded Systems for Control Engineering',
                  'ECEg5507: Digital Control Systems',
                  'ECEg5511: Robotics and Computer Vision',
                  'ECEg5509: Industrial Automation',
                  'ECEg5107: Final year project I',
                ],
                'Electronics Engineering Stream': [
                  'ECEg5301: Microwave Devices and Systems',
                  'ECEg5307: Wireless and Mobile Communications',
                  'ECEg5609: Optoelectronics',
                  'ECEg5605: Microelectronic Devices and Circuits',
                  'ECEg5405: VLSI Design',
                  'ECEg5107: Final year project I',
                ],
                'Power Engineering Stream': [
                  'ECEg5703: Energy Conversion and Rural Electrification',
                  'ECEg5711: Power System Protection',
                  'ECEg5701: Power Electronics and Electric Drives',
                  'ECEg5705: Electrical Installation',
                  'ECEg5709: Power Systems Automation',
                  'ECEg5107: Final year project I',
                ],
              },
              'Semester II': {
                // Nested object for streams
                'Communication Engineering Stream': [
                  'ECEg5302: Switching and Intelligent Networks',
                  'ECEg5410: Advanced Computer Networks',
                  'IEng5104: Industrial Management and Engineering Economy',
                  'ECEg5108: Final year project II',
                ],
                'Computer Engineering Stream': [
                  'ECEg5402: New Trends in Computer Engineering',
                  'ECEg5412: Wireless Communications and Mobile Computing',
                  'IEng5104: Industrial Management and Engineering Economy',
                  'ECEg5108: Final year project II',
                ],
                'Control Engineering Stream': [
                  'ECEg5502: Instrumentation Engineering',
                  'ECEg5510: Artificial Intelligence for Control Engineering',
                  'IEng5104: Industrial Management and Engineering Economy',
                  'ECEg5108: Final year project II',
                ],
                'Electronics Engineering Stream': [
                  'ECEg5602: Digital Systems Design',
                  'ECEg5604: IC Technology',
                  'IEng5104: Industrial Management and Engineering Economy',
                  'ECEg5108: Final year project II',
                ],
                'Power Engineering Stream': [
                  'ECEg5502: Instrumentation Engineering',
                  'ECEg5702: Power Systems Operation and Control',
                  'IEng5104: Industrial Management and Engineering Economy',
                  'ECEg5108: Final year project II',
                ],
              },
            },
          },
        },
        {
          name: 'Bachelor of Science Degree in Electromechanical Engineering',
          abbreviation: 'EMEg',
          coursesByYearSemester: {
            'Year 2': {
              'Semester I': [
                'EMEg2001: Engineering Drawing',
                'Comp2003: Introduction to Computer Programing',
                'CEng2005: Engineering Mechanics I :Statics',
              ],
              'Semester II': [
                'MEng2102: Engineering Mechanics II Dynamics',
                'EMEg3107: Fundamental of Electrical Circuits', // Note: 3xxx code in Year 2
                'Hist2002: History of Ethiopia and the Horn', // Note: Common, but listed here
                'EMEg2106: Mechanical Workshop Practice',
              ],
            },
            'Year 3': {
              'Semester I': [
                'EMEg3101: Engineering Thermodynamics',
                'EMEg2102: Strength of Materials', // Note: Original code, likely typo, should be 3xxx?
                'EMEg3103: Computational Methods',
                'MEng3151: Design of Machine Elements I', // Note affiliation
                'EMEg3104: Electrical Machine',
                'EMEg3105: Workshop for Mechatronics',
              ],
              'Semester II': [
                'EMEg3102: Signals & Systems',
                'MEng3110: Mechanism of Machinery', // Note affiliation
                'EMEg2104: Object Oriented Programming in Python', // Note: Original code, likely typo, should be 3xxx?
                'MEng3112: Design of Machine Elements II', // Note affiliation
                'EMEg3106: Applied Electronics I',
                'EMEg3108: Machine Drawing with CAD',
              ],
            },
            'Year 4': {
              'Semester I': [
                'MEng4109: Mechanical Vibrations', // Note affiliation
                'EMEg4101: Applied Electronics II',
                'EMEg4103: Fluid Mechanics',
                'EMEg4105: Control Systems',
                'EMEg4107: Digital Signal Processing',
                'EMEg4108: Smart Materials & Applications',
              ],
              'Semester II': [
                'EMEg4102: Modern Control System',
                'EMEg4104: Industrial Automation & Process Control',
                'IETP4115: Integrated Engineering Team Project', // Note affiliation
                'EMEg4113: Instrumentation & Measurement Systems',
                'EMEg4110: Power Electronics & Drive',
                'EMEg4112: Digital Logic Design',
              ],
              'Semester III (Summer)': ['EMEg4111: Industrial Internship'],
            },
            'Year 5': {
              'Semester I': [
                'EMEg5101: Design of Mechatronic System',
                'EMEg5103: Virtual Instrumentation',
                'EMEg5105: Embedded systems',
                'EMEg5107: Introduction to Robotics',
                'EMEg5109: Hydraulics & Pneumatics',
                'EMEg4106: Manufacturing Processes & Automation', // Note: Original code, likely typo, should be 5xxx?
                'EMEg5113: B.Sc. Thesis Phase I',
              ],
              'Semester II': [
                'EMEg5102: Industrial Management & Engineering Economy',
                'EMEg5104: Introduction to Machine learning',
                'EMEg5106: Introduction to Computer Vision',
                'EMEg5114: B.Sc. Thesis phase II',
              ],
            },
          },
        },
        {
          name: 'Bachelor of Science Degree in Mechanical Engineering',
          abbreviation: 'MEng',
          coursesByYearSemester: {
            'Year 2': {
              'Semester I': [
                'MEng2101: Engineering Drawing',
                'Comp2103: Introduction to computer programing',
                'CEng2105: Engineering Mechanics I',
              ],
              'Semester II': [
                'MEng2102: Engineering Mechanics II',
                'MEng2104: Strength of Materials I',
                'MEng2106: Engineering Thermodynamics I',
                'MEng2108: Basic Workshop Practice',
                'MEng2110: Machine Drawing with CAD',
              ],
            },
            'Year 3': {
              'Semester I': [
                'MEng3101: Engineering Thermodynamics II',
                'MEng3103: Strength of Materials II',
                'ECEg3101: Basic Electricity and Electronics',
                'MEng3105: Engineering Materials',
                'MEng3107: Fluid Mechanics I',
                'Hist2002: History of Ethiopia and the Horn', // Note: Common, but listed here
              ],
              'Semester II': [
                'MEng3102: IC Engines',
                'MEng3104: Introduction to Numerical methods and FEM',
                'MEng3106: Machine Elements I',
                'MEng3108: Manufacturing Processes',
                'MCEg3110: Introduction to Mechatronics', // Note affiliation
                'MEng3112: Fluid Mechanics II',
              ],
            },
            'Year 4': {
              'Semester I': [
                'MEng4101: Machine Elements II',
                'MEng4103: Heat Transfer',
                'MEng4105: Fluid Power Systems',
                'ECEg4107: Electrical Power and Machines', // Note affiliation
                'MEng4109: Mechanisms of Machinery',
                'IETP4115: Integrated Engineering Team Project', // Note affiliation
              ],
              'Semester II': {
                // Nested object for streams
                'Mechanical Core Stream': [
                  'MEng4102: Material Handling Equipment',
                  'MEng4404: Computer Integrated Manufacturing',
                  'MEng4106: Motor Vehicles Engineering',
                  'MEng4606: Turbomachinery I',
                  'MEng4110: Refrigeration and Air Conditioning',
                  'MEng4112: Machine Design Project',
                ],
                'Automotive Stream': [
                  'MEng4102: Material Handling Equipment',
                  'MEng4106: Motor Vehicles Engineering',
                  'MEng4108: Turbomachinery', // Note: Likely MEng4606?
                  'MEng4110: Refrigeration and Air Conditioning',
                  'MEng4310: Automotive Electrical Systems',
                  'MEng4112: Machine Design Project',
                ],
                'Manufacturing Stream': [
                  'MEng4102: Material Handling Equipment',
                  'MEng4404: Computer Integrated Manufacturing',
                  'MEng4406: Metal Casting Technology',
                  'MEng4402: Machining Technology',
                  'Stat5115: Probability and Statistics for Engineers', // Note: Supportive, listed here
                  'MEng4112: Machine Design Project',
                ],
                'Mechanical Design Stream': [
                  'MEng4102: Material Handling Equipment',
                  'Stat5115: Probability and Statistics for Engineer', // Note: Supportive, listed here
                  'MEng4106: Motor Vehicles Engineering',
                  'MEng4108: Turbomachinery', // Note: Likely MEng4606?
                  'IEng4110: Total Quality Management', // Note affiliation
                  'MEng4112: Machine Design Project',
                ],
                'Thermal Stream': [
                  'MEng4102: Material Handling Equipment',
                  'MEng4106: Motor Vehicles Engineering',
                  'MEng4110: Refrigeration and Air Conditioning',
                  'MEng4606: Turbomachinery I',
                  'MEng4602: Renewable Energy Systems',
                  'Stat5115: Probability and Statistics for Engineer', // Note: Supportive, listed here
                ],
              },
              'Summer Semester (Term III)': ['MEng4114: Industrial Internship'],
            },
            'Year 5': {
              'Semester I': {
                // Nested object for streams
                'Mechanical Core Stream': [
                  'MEng5101: Power Plant Engineering',
                  'MEng5103: Mechanical Vibration',
                  'MEng5105: Maintenance of Machinery',
                  'MEng5607: Turbomachinery II',
                  'MEng5309: Heavy Duty and Construction Equipment',
                  'MEng5111: Integrated Design Project',
                  'MEng5113: Final Year Project Phase I',
                  'Stat5115: Probability and Statistics for Engineers', // Note: Duplicated listing
                ],
                'Automotive Stream': [
                  'Stat 5115: Probability and Statistics for Engineers', // Note: Duplicated listing
                  'MEng5103: Mechanical Vibration',
                  'MEng5305: Automotive Electronics Systems',
                  'MEng5307: Fleet and Transport Management',
                  'MEng5309: Heavy Duty and Construction Equipment',
                  'MEng5311: IC Engines and Motor Vehicles Lab',
                  'MEng5111: Integrated Design Project',
                  'MEng5113: Final Year Project Phase I',
                ],
                'Manufacturing Stream': [
                  'MEng5411: Engineering Measurement and Metrology',
                  'MEng5403: Welding Technology',
                  'MEng5105: Maintenance of Machinery',
                  'MEng5103: Mechanical Vibration',
                  'MEng5405: Tool and Die Design and Manufacturing',
                  'MEng5111: Integrated Design Project',
                  'MEng5113: Final Year Project Phase I',
                ],
                'Mechanical Design Stream': [
                  'MEng5501: Product Design and Development',
                  'MEng5103: Mechanical Vibration',
                  'MEng5105: Maintenance of Machinery',
                  'MEng5503: Introduction to Tribology',
                  'MEng5505: Rotor Dynamics',
                  'MEng5111: Integrated Design Project',
                  'MEng5113: Final Year Project Phase I',
                ],
                'Thermal Stream': [
                  'MEng5101: Power Plant Engineering',
                  'MEng5603: Thermo-Fluid System Design',
                  'MEng5607: Turbomachinery II',
                  'MEng5601: Energy Auditing and Management',
                  'MEng5111: Integrated Design Project',
                  'MEng5103: Mechanical Vibration',
                  'MEng5105: Maintenance of Machinery',
                  'MEng5113: Final Year Project Phase I',
                ],
              },
              'Semester II': {
                // Nested object for streams
                'Mechanical Core Stream': [
                  'IEng5102: Industrial Management and Engineering Economy',
                  'MEng5104: Measurement and Instrumentation',
                  'MEng5106: Control Systems Engineering',
                  'MEng5108: Final Year Project Phase II',
                ],
                'Automotive Stream': [
                  'MEng5102: Industrial Management and Engineering Economy',
                  'MEng5104: Measurement and Instrumentation',
                  'MEng5106: Control Systems Engineering',
                  'MEng5308: Automotive Maintenance',
                  'MEng5108: Final Year Project Phase II',
                ],
                'Manufacturing Stream': [
                  'MEng5102: Industrial Management and Engineering Economy',
                  'MEng5404: Modern Manufacturing Technology',
                  'MEng5106: Control Systems Engineering',
                  'MEng5408: Metal Forming Technology',
                  'MEng5108: Final Year Project Phase II',
                ],
                'Mechanical Design Stream': [
                  'MEng5102: Industrial Management and Engineering Economy',
                  'MEng5504: Introduction to Robotics and Automation',
                  'MEng5106: Control Systems Engineering',
                  'MEng5108: Final Year Project Phase II',
                ],
                'Thermal Stream': [
                  'MEng5102: Industrial Management and Engineering Economy',
                  'MEng5602: Gas Turbines and Jet Propulsion',
                  'MEng5604: Computational Fluid Dynamics (CFD)',
                  'MEng5606: Cryogenic Engineering',
                  'MEng5108: Final Year Project Phase II',
                ],
              },
            },
          },
        },
        {
          name: 'Bachelor of Science Degree in Software Engineering',
          abbreviation: 'SWEG',
          coursesByYearSemester: {
            'Year 2': {
              'Semester I': [
                'SWEG2101: Introduction to Software Engineering and Computing',
                'SWEG2103: Fundamentals of Programming I',
                'SWEG2105: Discrete Mathematics for Software Engineering',
              ],
              'Semester II': [
                'SWEG2102: Fundamentals of Programming II',
                'EEng2004: Digital Logic Design',
                'SWEG2106: Data Communication and Computer Networks',
                'SWEG2108: Database Systems',
                'Stat2091: Probability and Statistics', // Note: Supportive, listed here
              ],
            },
            'Year 3': {
              'Semester I': [
                'SWEG3101: Object Oriented Programming',
                'SWEG3103: Data Structure and Algorithms',
                'SWEG3105: Computer Organization and Architecture',
                'SWEG3107: Internet Programming I',
                'SWEG3109: System Analysis and Modeling',
              ],
              'Semester II': [
                'SWEG3102: Internet Programming II',
                'SWEG3104: Software Requirements Engineering',
                'SWEG3106: Operating Systems',
                'SWEG3108: Advanced Programming',
                'SWEG3110: Formal Language and Automata Theory',
              ],
            },
            'Year 4': {
              'Semester I': [
                {
                  code: 'SWEG4101',
                  name: 'Principles of Compiler Design',
                  chapters: 5,
                },
                {
                  code: 'SWEG4103',
                  name: 'Mobile Computing and Programming',
                  chapters: 5,
                },
                {
                  code: 'SWEG4105',
                  name: 'Software Design and Architecture',
                  chapters: 5,
                },
                {
                  code: 'SWEG4117',
                  name: 'Introduction to Artificial Intelligence',
                  chapters: 5,
                },
                {
                  code: 'SWEG4109',
                  name: 'Computer Graphics',
                  chapters: 5,
                },
                {
                  code: 'IETP4115',
                  name: 'Integrated Engineering team project', // Note affiliation
                  chapters: 5,
                },
              ],
              'Semester II': [
                {
                  code: 'SWEG4102',
                  name: 'Embedded Systems',
                  chapters: 5,
                },
                {
                  code: 'SWEG4104',
                  name: 'Software Project Management',
                  chapters: 5,
                },
                {
                  code: 'SWEG4106',
                  name: 'Software Quality Assurance and Testing',
                  chapters: 5,
                },
                {
                  code: 'SWEG4108',
                  name: 'Research Methods in Software Engineering',
                  chapters: 5,
                },
                {
                  code: 'SWEG4110',
                  name: 'Human Computer Interaction',
                  chapters: 5,
                },
                {
                  code: 'SWEG4112',
                  name: 'Introduction to Machine learning',
                  chapters: 5,
                },
              ],
              'Semester III (Summer)': [
                {
                  code: 'SWEG4114',
                  name: 'Industrial Internship',
                  chapters: 1,
                },
              ],
            },
            'Year 5': {
              'Semester I': [
                'SWEG5101: Senior Research Project Phase I',
                'SWEG5103: Software Configuration Management',
                'SWEG52XX: Elective I (Choose from list)',
                'SWEG5105: Computer System Security',
                'SWEG5107: Software Component Design',
                'SWEG5109: Open Source Software Paradigms',
                'SWEG5111: Distributed Systems',
              ],
              'Semester II': [
                'SWEG5102: Senior Research Project II',
                'SWEG52XX: Elective II (Choose from list)',
                'SWEG5106: Software Evolution and Maintenance',
                'SWEG5108: Software Defined Systems',
                'SWEG5110: Selected Topics in Software Engineering',
              ],
              // Elective Choices for reference:
              // Elective Courses 1:
              // SWEG5201: Introduction to Big Data Analytics
              // SWEG5203: Data Mining and Data Warehousing
              // SWEG5205: Simulation and Modeling
              // Elective Courses 2:
              // SWEG5202: Introduction to Cloud Computing
              // SWEG5204: High Performance Computing
              // SWEG5206: Multimedia Systems
            },
          },
        },
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
                'Inch2205: Fundamentals of Analytical Chemistry',
                'FSAN2101: Introduction to Food Science and Nutrition',
                'FSAN2103: Human Anatomy and Physiology',
                'FSAN2105: Food Chemistry',
                'FSAN2107: Principle of Food Processing and Preservation',
              ],
              'Semester II': [
                'Inch2503: Biochemistry',
                'FSAN2102: Food Microbiology',
                'FSAN2104: Food Toxicology',
                'FSAN2106: Food Analysis and Instrumentation',
                'FSAN2108: Unit Operation in Food Processing',
                'FSAN2110: Indigenous food processing and Biotechnology',
              ],
            },
            'Year 3': {
              'Semester I': [
                'FSAN3109: Biostatistics',
                'FSAN3111: Community Nutrition',
                'FSAN3113: Fruit and Vegetable Science and Technology',
                'FSAN3115: Dairy Science and Technology',
                'FSAN3117: Cereal and Pulse Science and Technology',
                'FSAN3119: Coffee, Tea, Spice and herbs Science and Technology',
              ],
              'Semester II': [
                'ISTP3116: Integrated Science Team Project', // Note affiliation
                'FSAN3112: Sport and Exercise Nutrition',
                'FSAN3114: Beverage Science and Technology',
                'FSAN3118: Food Fortification and Functional Foods',
                'FSAN3120: Research Method in Food Science and Nutrition',
                'FSAN3122: Nutrition Assessment',
                'FSAN3124: Meat, Poultry and Fish Science and Technology',
              ],
              'Summer Semester': ['FSAN3126: Practical Attachment'],
            },
            'Year 4': {
              'Semester I': [
                'FSAN4121: Food Economics, Marketing and Distribution',
                'FSAN4123: Honey, sugar and confectionery Science and Technology',
                'FSAN4125: Fat and oil Science and Technology',
                'FSAN4127: Food Product Development and Sensory Evaluation',
                'FSAN4129: Food and Nutrition Policy and program',
                'FSAN4131: Nutrition Throughout the life cycle',
                'FSAN4133: Senior Seminar',
                'FSAN4135: Final Year Project I',
              ],
              'Semester II': [
                'FSAN4128: Food and Nutrition Security',
                'FSAN4130: Nutrition Education and Counseling',
                'FSAN4132: Nutritional Epidemiology',
                'FSAN4134: Diet Therapy',
                'FSAN4136: Food Safety, Quality Assurance and Legislation',
                'FSAN4138: Food Packaging Technology',
                'FSAN4140: Final Year Project II',
              ],
            },
          },
        },
        {
          name: 'Bachelor of Science Degree in Geology',
          abbreviation: 'Geol',
          coursesByYearSemester: {
            'Year 2': {
              'Semester I': [
                'Geo2101: General Geology',
                'Geol 2103: Paleontology',
                'Geol2105: Crystallography and Mineral Optics',
                'Phys2003: General Physics', // Note: Supportive
              ],
              'Semester II': [
                'InCh2004: Physical Chemistry', // Note: Supportive
                'Stat2006: Introduction to Statistics', // Note: Supportive
                'Geol2102: Stratigraphy and Earth History',
                'Geol2104: Plate Tectonics',
                'Geol2106: Sedimentary Petrology',
                'Geol2108: Mineralogy',
              ],
            },
            'Year 3': {
              'Semester I': [
                'Comp3003: Fundamentals of Programming', // Note: Supportive
                'Geol3101: Structural Geology',
                'Geol3103: Geological mapping and Report Writing',
                'Geol3105: Remote Sensing and GIS',
                'Geol3109: Igneous Petrology',
              ],
              'Semester II': [
                'Geol3102: Mapping Igneous Terrain',
                'Geol3104: Geophysics',
                'Geol3106: Fundamentals of Soil and Rock Mechanics',
                'Geol3108: Principles of Hydrogeology',
                'Geol3110: Metamorphic Petrology',
                'Geol3112: Geochemistry',
              ],
              'Semester III (Summer)': ['Geol4113: Internship'],
            },
            'Year 4': {
              'Semester I': [
                'Geol4101: Groundwater Exploration and Development',
                'Geol4103: Mapping Metamorphic Terrain',
                'Geol4105: Economic Geology',
                'Geol4107: Engineering Geology',
                'Geol4109: Mineral Exploration and Resource Evaluation',
                'Geol4111: Research Methods in Geoscine',
                'Geol4115: Final Year I project Proposal preparation',
              ],
              'Semester II': [
                'Geol4102: Energy resource of the Earth',
                'IGTP4016: Integrated Geological Team Project', // Note affiliation
                'Geol4104: Geology and Geologic Resources of Ethiopia',
                'Geol4106: Environmental Geology',
                'Geol4108: Mining Geology',
                'Geol4110: Final year project',
                'Elective (Choose from list)',
                // Elective Choices for reference:
                // Geol4201: Industrial Minerals and Rocks
                // Geol4203: Introduction to Gemology
                // Geol4204: Introduction to Geohazard Assesment
                // Geol4206: Environmental Impact assessment
                // Geol4202: Groundwater Resources Management
                // Geol4205: Quaternary Geology
              ],
            },
          },
        },
        {
          name: 'Bachelor of Science Degree in Biotechnology',
          abbreviation: 'Biot',
          coursesByYearSemester: {
            'Year 2': {
              'Semester I': [
                'SWENG2109: Introduction to Computer Science', // Note: Supportive
                'Econ2003: Economics', // Note: Supportive
                'Biot2101: General Microbiology',
                'InCh2103: Organic Chemistry',
                'Biot2105: Cell Biology',
                'Biot2107: Principles of Genetics',
              ],
              'Semester II': [
                'Biot2102: Molecular Biology',
                'Biot2104: Techniques in Molecular biology',
                'Biot2110: Microbial Genetics',
                'Biot2112: Fundamentals of Biochemistry',
                'InCh2114: Analytical Chemistry and Instrumentation',
                'Biot2106: Plant Anatomy and Physiology',
                'Biot2108: Animal Anatomy and Physiology',
              ],
            },
            'Year 3': {
              'Semester I': [
                'Biot3111: Principles of Plant Breeding',
                'Biot3101: Immunology and Immunotechnology',
                'Biot3103: Principles of Animal breeding',
                'Biot3105: Microbial Biotechnology',
                'Biot3107: Fundamentals of Bioprocessing Engineering',
                'Biot3109: Biophysics',
                'Biot3115: Genetic Engineering',
                'Biot3113: Biostatistics and Experimental design',
              ],
              'Semester II': [
                'Biot3102: Plant Biotechnology',
                'Biot3104: Molecular Diagnostics',
                'Biot3110: Fungal Biotechnology',
                'Biot3106: Plant Cell and Tissue Culture',
                'Biot3108: Medical Biotechnology',
                'ISTP3116: Integrated Science Team Project', // Note affiliation
                'Biot3118: Aquatic Biotechnology',
                'Biot3114: Introduction to Bioinformatics',
                'Biot3116: Research Methodology and Academic Writing',
              ],
              'Summer I': ['Biot3120: Biotechnology internship'],
            },
            'Year 4': {
              'Semester I': [
                'Biot4101: Enzyme Technology',
                'Biot4103: Industrial Biotechnology',
                'Biot4105: Environmental Biotechnology',
                'Biot4107: Introduction to Omics science',
                'Biot4111: Final year Project I',
                'Biot4115: Animal Biotechnology',
                'Biot4113: Nanobiotechnology',
              ],
              'Semester II': [
                'Biot4112: Final Year Project II',
                'Biot4102: Cancer Biology',
                'Biot4104: Food Biotechnology',
                'Biot4106: Pharmaceutical Biotechnology',
                'Biot4108: Biosafety and Intellectual Property Right in Biotechnology',
                'Biot4110: Introductory System and Synthetic biology',
                'BMgt4116: Project Planning and Management', // Note: Supportive
                'Biot xx: Elective (Choose from list)',
                // Elective Choices for reference:
                // Biot4218: Biodiversity and Conservation of Genetic Resources
                // Biot4222: Forensic Biotechnology
                // Biot4220: Animal cell and Tissue Culture
              ],
            },
          },
        },
        {
          name: 'Bachelor of Science Degree in Industrial Chemistry',
          abbreviation: 'IChem', // Note: Uses codes from multiple prefixes
          coursesByYearSemester: {
            'Year 2': {
              'Semester I': [
                'InCh2101: Analytical Chemistry',
                'InCh2105: Practical Analytical Chemistry',
                'Stat2103: Statistics for Industrial Chemists',
                'InCh2107: Inorganic chemistry I',
                'Econ2003: Economics', // Note: Supportive
                'InCh2109: Organic Chemistry I',
                'InCh2111: Practical Organic Chemistry I',
              ],
              'Semester II': [
                'InCh2102: Instrumental Analysis I',
                'InCh2104: Practical Instrumental Analysis I',
                'Hist2002: History of Ethiopia and the Horn', // Note: Common
                'InCh2106: Physical Chemistry I',
                'InCh2108: Practical Inorganic Qualitative Analysis',
                'Phys2114: Physics for Industrial Chemists',
                'InCh2110: Organic Chemistry II',
                'InCh2112: Practical Organic Chemistry II',
              ],
            },
            'Year 3': {
              'Semester I': [
                'InCh3101: Instrumental Analysis II',
                'InCh3103: Practical Instrumental Analysis II',
                'InCh3105: Industrial organic and consumer Products',
                'InCh3107: Physical Chemistry II',
                'InCh3109: Practical Physical Chemistry I',
                'InCh3111: Inorganic Chemistry II',
                'InCh3113: Practical Inorganic Synthesis',
                'InCh3115: Computer Applications for Chemists',
              ],
              'Semester II': [
                'InCh3102: Physical Chemistry III',
                'InCh3104: Practical Physical Chemistry II',
                'ChEg3106: Unit operations for Industrial Chemists',
                'Biot3108: Industrial Microbiology for Chemists',
                'InCh3110: Systematic Identification of organic compounds',
                'InCh3112: Industrial Inorganic Products',
                'InCh3114: Research methods and scientific writing',
                'ISTP3116: Integrated Science Team Project', // Note affiliation
              ],
              'Semester III (Summer)': ['InCh3117: Industrial Attachment*'],
            },
            'Year 4': {
              'Semester I': [
                'InCh4101: Sugar Processing and Production',
                'InCh4103: Leather Processing and Production',
                'InCh4105: Industrial Pharmacy',
                'InCh4107: Chemistry of Materials',
                'InCh4109: Environmental Chemistry and Waste management',
                'InCh4111: Biochemistry',
                'InCh4114: Student Project*',
              ],
              'Semester II': [
                'InCh4102: Real Sample Analysis',
                'InCh4104: Pharmaceutical Analysis',
                'InCh4106: Quality Assurance and Management systems',
                'InCh4108: Chemistry of paper, pigments and natural products',
                'InCh4110: Industrial safety and loss prevention',
                'InCh4112: Cement, glass and ceramics',
                'InCh4114: Student Project', // Note: Continuation?
              ],
            },
          },
        },
      ],
    },
  ],
};

// --- Automated Transformation (Conceptual) ---
// You could write a script to perform this transformation automatically:
/*
function transformCourseData(data) {
  data.colleges.forEach(college => {
    college.departments.forEach(department => {
      Object.values(department.coursesByYearSemester).forEach(yearData => {
        Object.keys(yearData).forEach(semesterKey => {
          const coursesOrStreams = yearData[semesterKey];
          if (Array.isArray(coursesOrStreams)) {
            // Direct semester list
            yearData[semesterKey] = coursesOrStreams.map(parseCourseString);
          } else if (typeof coursesOrStreams === 'object' && coursesOrStreams !== null) {
             // Handle Streams (e.g., ECEg/MEng Year 4/5 Sem II)
            Object.keys(coursesOrStreams).forEach(streamName => {
               if (Array.isArray(coursesOrStreams[streamName])) {
                   coursesOrStreams[streamName] = coursesOrStreams[streamName].map(parseCourseString);
               }
            });
          }
        });
      });
    });
  });
  return data;
}

// const updatedCourseData = transformCourseData(JSON.parse(JSON.stringify(courseData))); // Use deep copy if needed
// console.log(JSON.stringify(updatedCourseData, null, 2)); // Pretty print to check
*/
