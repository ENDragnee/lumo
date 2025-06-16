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
          name: 'Architecture',
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
                  students: 60,
                  duration: '16 weeks',
                  outcomes: [
                    'Understand core design principles and elements.',
                    'Develop skills in visual composition and spatial ordering.',
                    'Create basic 2D and 3D design projects demonstrating conceptual clarity.',
                    'Effectively use line, shape, form, color, and texture in design exercises.',
                  ],
                  chapters: [
                    {
                      id: 'bd_ch1',
                      title: 'Introduction to Design Principles',
                      description: 'Explores the basic elements of design such as point, line, plane, and volume.',
                      duration: 240,
                      topics: ['Elements of Design', 'Principles of Composition', 'Gestalt Theory', 'Visual Hierarchy'],
                    },
                    {
                      id: 'bd_ch2',
                      title: 'Color and Texture',
                      description: 'A study of color theory and the application of texture to create visual interest and meaning.',
                      duration: 300,
                      topics: ['Color Theory (Hue, Value, Saturation)', 'Color Harmonies', 'Psychology of Color', 'Texture and Pattern'],
                    },
                    {
                      id: 'bd_ch3',
                      title: '2D Composition',
                      description: 'Exercises in two-dimensional space focusing on balance, rhythm, and dynamic equilibrium.',
                      duration: 480,
                      topics: ['Symmetry and Asymmetry', 'Grid Systems', 'Transformation of Shapes', 'Figure-Ground Relationships'],
                    },
                    {
                      id: 'bd_ch4',
                      title: '3D Form and Space',
                      description: 'Transitioning from 2D to 3D, this chapter explores the creation of form and the definition of space.',
                      duration: 600,
                      topics: ['Platonic Solids', 'Additive and Subtractive Forms', 'Spatial Organization', 'Light, Shadow, and Form'],
                    },
                  ],
                },
                {
                  code: 'ARCH2103',
                  name: 'Building Materials and Construction I',
                  description: 'A study of the primary materials used in construction, including wood, masonry, and concrete, focusing on their properties and basic applications.',
                  credits: 3,
                  outcomes: [
                    'Identify common building materials and their primary sources.',
                    'Understand the physical and mechanical properties of wood, masonry, and concrete.',
                    'Recognize basic construction techniques associated with these materials.',
                  ],
                  chapters: [
                    { id: 'bmc1_ch1', title: 'Introduction to Building Materials', topics: ['Material Properties (Physical, Mechanical)', 'Sustainability in Materials', 'Material Life Cycle'] },
                    { id: 'bmc1_ch2', title: 'Wood and Timber Construction', topics: ['Types of Wood', 'Wood Products (Lumber, Plywood)', 'Basic Wood Framing', 'Wood Joinery'] },
                    { id: 'bmc1_ch3', title: 'Masonry Construction', topics: ['Bricks, Blocks, and Stone', 'Mortar and Grout', 'Masonry Bonds', 'Lintels and Arches'] },
                    { id: 'bmc1_ch4', title: 'Concrete Technology', topics: ['Cement, Aggregates, Water', 'Concrete Mix Design', 'Formwork', 'Basic Reinforced Concrete Concepts'] },
                  ],
                },
                {
                  code: 'ARCH2105',
                  name: 'Drawing (Geometric Descriptive and Drafting)',
                  description: 'Develops skills in technical drawing, including orthographic projections, sections, and descriptive geometry as a basis for architectural representation.',
                  credits: 3,
                  outcomes: [
                    'Achieve proficiency in the use of manual drafting tools.',
                    'Construct accurate orthographic projections (plans, elevations, sections).',
                    'Solve 3D geometric problems using descriptive geometry.',
                    'Develop a high standard of line weight, lettering, and graphic clarity.',
                  ],
                  chapters: [
                    { id: 'gdd_ch1', title: 'Drafting Fundamentals', topics: ['Tools and Equipment', 'Line Types and Line Weights', 'Lettering and Dimensioning', 'Scale'] },
                    { id: 'gdd_ch2', title: 'Orthographic Projections', topics: ['Principles of Projection', 'Drawing Plans and Elevations', 'Drawing Sections', 'Relationship between Views'] },
                    { id: 'gdd_ch3', title: 'Paraline and Perspective Drawings', topics: ['Axonometric (Isometric, Dimetric)', 'Oblique Projections', 'One-Point and Two-Point Perspective Construction'] },
                    { id: 'gdd_ch4', title: 'Descriptive Geometry', topics: ['True Length and True Shape', 'Intersections of Planes and Solids', 'Development of Surfaces'] },
                  ],
                },
                {
                  code: 'ARCH2107',
                  name: 'Graphics Communication Skills I (Sketching I)',
                  description: 'Focuses on developing freehand sketching abilities to visually communicate architectural ideas and concepts quickly.',
                  credits: 2,
                  outcomes: [
                    'Develop confidence and control in freehand drawing.',
                    'Quickly sketch objects and spaces from observation and imagination.',
                    'Utilize perspective to create convincing spatial illusions.',
                  ],
                  chapters: [
                    { id: 'gcs1_ch1', title: 'Fundamentals of Sketching', topics: ['Line Control Exercises', 'Contour Drawing', 'Gesture Drawing', 'Basic Geometric Forms'] },
                    { id: 'gcs1_ch2', title: 'Perspective Sketching', topics: ['Observational Perspective', 'Constructing One-Point Perspectives', 'Constructing Two-Point Perspectives'] },
                    { id: 'gcs1_ch3', title: 'Light, Shade, and Texture', topics: ['Hatching and Cross-Hatching', 'Rendering Basic Forms', 'Representing Material Textures', 'Casting Shadows'] },
                  ],
                },
                {
                  code: 'ARCH2109',
                  name: 'Theory and Design of Structures I (Engineering Mechanics)',
                  description: 'Introduction to the principles of statics, including equilibrium of particles and rigid bodies, analysis of trusses, frames, and machines.',
                  credits: 3,
                  outcomes: [
                    'Understand vector representation of forces and moments.',
                    'Apply equations of equilibrium to solve for unknown forces.',
                    'Analyze forces in simple truss and frame structures.',
                  ],
                  chapters: [
                    { id: 'tds1_ch1', title: 'Introduction to Statics and Forces', topics: ['Vectors and Scalars', 'Force Systems', 'Moments and Couples'] },
                    { id: 'tds1_ch2', title: 'Equilibrium of Particles and Rigid Bodies', topics: ['Free Body Diagrams', 'Equations of Equilibrium (2D and 3D)'] },
                    { id: 'tds1_ch3', title: 'Structural Analysis: Trusses', topics: ['Method of Joints', 'Method of Sections', 'Zero-Force Members'] },
                    { id: 'tds1_ch4', title: 'Structural Analysis: Frames and Machines', topics: ['Analysis of Frames', 'Internal Forces (Shear and Moment)'] },
                  ],
                },
              ],
              'Semester II': [
                {
                  code: 'ARCH2102',
                  name: 'Basic Architectural Design',
                  description: 'Application of basic design principles to simple architectural problems, focusing on space, form, and function.',
                  credits: 4,
                  prerequisites: ['ARCH2101'],
                  outcomes: [
                    'Translate abstract design principles into spatial architectural solutions.',
                    'Analyze a simple program and site to inform a design proposal.',
                    'Develop a design through sketches, drawings, and physical models.',
                    'Verbally and graphically present a design concept.',
                  ],
                  chapters: [
                    { id: 'bad_ch1', title: 'Project 1: Spatial Intervention', description: 'Designing a small-scale installation focusing on human scale and experience.', topics: ['Site Observation', 'Conceptual Diagrams', '1:1 Scale Mockups'] },
                    { id: 'bad_ch2', title: 'Project 2: A Pavilion in a Landscape', description: 'Designing a small, single-function structure responding to a natural site.', topics: ['Site Analysis', 'Form and Structure Studies', 'Materiality', 'Presentation Drawings and Models'] },
                    { id: 'bad_ch3', title: 'Elements of Architecture', description: 'A study of fundamental architectural elements.', topics: ['The Wall and Opening', 'The Floor and Roof', 'Circulation: Stairs and Ramps'] },
                  ],
                },
                {
                  code: 'ARCH2104',
                  name: 'Building Materials and Construction II',
                  description: 'A continuation of Building Materials I, with a focus on steel, glass, and composite materials, and their integration into building systems.',
                  credits: 3,
                  prerequisites: ['ARCH2103'],
                  outcomes: [
                    'Understand the production and properties of structural steel and glass.',
                    'Identify and describe various systems for steel framing and glazing.',
                    'Recognize the role of composite materials and plastics in modern construction.',
                  ],
                  chapters: [
                    { id: 'bmc2_ch1', title: 'Structural Steel', topics: ['Steel Production', 'Structural Shapes (W, C, L)', 'Bolted and Welded Connections', 'Steel Framing Systems'] },
                    { id: 'bmc2_ch2', title: 'Light Gauge Steel Framing', topics: ['Cold-Formed Steel Studs and Joists', 'Applications in Walls and Floors'] },
                    { id: 'bmc2_ch3', title: 'Glass and Glazing Systems', topics: ['Types of Glass', 'Window and Curtain Wall Systems', 'Glazing Details'] },
                    { id: 'bmc2_ch4', title: 'Plastics and Composites', topics: ['Types of Plastics in Building', 'Fiber-Reinforced Polymers', 'Finishes and Coatings'] },
                  ],
                },
                {
                  code: 'ARCH2106',
                  name: 'History of Architecture I',
                  description: 'A survey of architectural history from prehistoric times through the Gothic period, examining cultural, technological, and theoretical influences.',
                  credits: 3,
                  outcomes: [
                    'Identify key buildings and characteristics of major historical periods.',
                    'Analyze how geography, religion, and technology shaped architectural form.',
                    'Develop a vocabulary for describing and analyzing historical architecture.',
                  ],
                  chapters: [
                    { id: 'hoa1_ch1', title: 'Prehistoric and Ancient Near East', topics: ['Megalithic Structures', 'Mesopotamian Ziggurats', 'Persian Architecture'] },
                    { id: 'hoa1_ch2', title: 'Ancient Egypt and Greece', topics: ['Egyptian Temples and Tombs', 'The Greek Orders', 'The Parthenon and the Acropolis'] },
                    { id: 'hoa1_ch3', title: 'Roman and Early Christian Architecture', topics: ['The Arch and Vault', 'Roman Public Buildings (Colosseum, Pantheon)', 'Early Christian Basilicas'] },
                    { id: 'hoa1_ch4', title: 'Byzantine, Islamic, and Romanesque', topics: ['Hagia Sophia', 'Mosque Typologies', 'Romanesque Monasteries and Churches'] },
                    { id: 'hoa1_ch5', title: 'Gothic Architecture', topics: ['The Pointed Arch and Ribbed Vault', 'The Flying Buttress', 'Gothic Cathedrals (Chartres, Notre Dame)'] },
                  ],
                },
                {
                  code: 'ARCH2108',
                  name: 'Graphics Communication Skills II (Sketching II, Painting II)',
                  description: 'Advanced techniques in architectural representation, including perspective drawing, rendering, and use of color.',
                  credits: 2,
                  prerequisites: ['ARCH2107'],
                  outcomes: [
                    'Construct complex and accurate multi-point perspective drawings.',
                    'Apply marker and watercolor rendering techniques to architectural drawings.',
                    'Effectively use color to convey mood, materiality, and light.',
                  ],
                  chapters: [
                    { id: 'gcs2_ch1', title: 'Advanced Perspective Drawing', topics: ['Review of Two-Point', 'Three-Point Perspective', 'Sketching Complex Urban Scenes', 'Shadow Casting in Perspective'] },
                    { id: 'gcs2_ch2', title: 'Architectural Rendering Techniques', topics: ['Marker Rendering', 'Watercolor Washes', 'Mixed Media Approaches'] },
                    { id: 'gcs2_ch3', title: 'Color in Representation', topics: ['Color Theory for Architects', 'Creating a Color Palette', 'Representing Time of Day and Atmosphere'] },
                  ],
                },
                {
                  code: 'ARCH2110',
                  name: 'Theory and Design of Structures II (Strength of Materials)',
                  description: 'Covers the internal effects of forces on bodies, including stress, strain, torsion, bending, and shear in structural members.',
                  credits: 3,
                  prerequisites: ['ARCH2109'],
                  outcomes: [
                    'Understand the concepts of stress and strain and their relationship.',
                    'Analyze stresses and deformations in members subject to axial load and torsion.',
                    'Calculate bending and shear stresses in beams and draw shear and moment diagrams.',
                  ],
                  chapters: [
                    { id: 'tds2_ch1', title: 'Stress and Strain', topics: ['Normal Stress and Strain', 'Material Properties and Hooke\'s Law', 'Shear Stress and Strain'] },
                    { id: 'tds2_ch2', title: 'Axial Load and Torsion', topics: ['Deformation of Axially Loaded Members', 'Torsional Stress in Shafts'] },
                    { id: 'tds2_ch3', title: 'Bending in Beams', topics: ['Shear and Moment Diagrams', 'Flexural Stress in Beams', 'Beam Design'] },
                    { id: 'tds2_ch4', title: 'Shear in Beams and Deflection', topics: ['Shear Stress in Beams', 'Beam Deflection Equations', 'Buckling of Columns'] },
                  ],
                },
                {
                  code: 'ARCH2112',
                  name: 'Model Making Technique',
                  description: 'Hands-on studio course on the techniques and materials for creating physical architectural models for study and presentation.',
                  credits: 2,
                  outcomes: [
                    'Gain proficiency with a variety of model-making tools and materials.',
                    'Construct different types of models, including conceptual, study, and presentation models.',
                    'Understand the role of models as a design and communication tool.',
                  ],
                  chapters: [
                    { id: 'mmt_ch1', title: 'Introduction to Model Making', topics: ['Tools, Safety, and Workspace', 'Types of Architectural Models', 'Scale and Abstraction'] },
                    { id: 'mmt_ch2', title: 'Working with Paper and Board', topics: ['Cardboard and Chipboard', 'Foam Core and Museum Board', 'Techniques for Cutting, Scoring, and Joining'] },
                    { id: 'mmt_ch3', title: 'Working with Wood and Plastics', topics: ['Basswood and Balsa', 'Styrene and Acrylic', 'Casting and Molding'] },
                    { id: 'mmt_ch4', title: 'Advanced and Digital Techniques', topics: ['Introduction to Laser Cutting', 'Introduction to 3D Printing', 'Finishing, Painting, and Representing Landscape'] },
                  ],
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
                  outcomes: [
                    'Understand the principles of heat, air, and moisture flow in buildings.',
                    'Design and detail high-performance building envelope assemblies.',
                    'Select appropriate interior finish materials based on performance and aesthetic criteria.',
                  ],
                  chapters: [
                    { id: 'bmc3_ch1', title: 'The Building Envelope', topics: ['Thermal Performance', 'Air Barriers', 'Vapor Retarders', 'Building Science Principles'] },
                    { id: 'bmc3_ch2', title: 'Roofing Systems', topics: ['Low-Slope vs. Steep-Slope Roofs', 'Membrane Roofing', 'Shingles and Tiles', 'Flashing and Drainage'] },
                    { id: 'bmc3_ch3', title: 'Wall Assemblies and Cladding', topics: ['Rainscreen Systems', 'Masonry Veneer', 'Metal Panel Systems', 'EIFS'] },
                    { id: 'bmc3_ch4', title: 'Interior Finishes', topics: ['Flooring Materials', 'Wall Finishes (Paint, Plaster, Tile)', 'Ceiling Systems', 'Millwork and Cabinetry'] },
                  ],
                },
                {
                  code: 'ARCH3115',
                  name: 'History of Architecture II',
                  description: 'A survey of architectural history from the Renaissance to the modern era, tracing major movements and theoretical shifts.',
                  credits: 3,
                  prerequisites: ['ARCH2106'],
                  outcomes: [
                    'Trace the evolution of architectural theory and practice from the 15th to 20th century.',
                    'Identify the key figures and works of the Renaissance, Baroque, and Modern movements.',
                    'Analyze the impact of social, political, and industrial revolutions on architecture.',
                  ],
                  chapters: [
                    { id: 'hoa2_ch1', title: 'The Renaissance', topics: ['Brunelleschi, Alberti, Palladio', 'Humanism and Perspective', 'The Rebirth of Classical Orders'] },
                    { id: 'hoa2_ch2', title: 'Baroque and Rococo', topics: ['Bernini and Borromini', 'Illusion, Movement, and Ornament', 'The Palace of Versailles'] },
                    { id: 'hoa2_ch3', title: 'The Age of Enlightenment and Revolution', topics: ['Neoclassicism', 'The Industrial Revolution and New Materials', 'The École des Beaux-Arts'] },
                    { id: 'hoa2_ch4', title: 'Modernism', topics: ['Early Modernists (Wright, Gropius, Le Corbusier)', 'The International Style', 'The Bauhaus'] },
                    { id: 'hoa2_ch5', title: 'Mid-Century and Beyond', topics: ['Post-War Modernism', 'Critiques of Modernism and Postmodernism', 'Contemporary Trends'] },
                  ],
                },
                {
                  code: 'ARCH3119',
                  name: 'Graphics Communication Skills III (Professional CAD)',
                  description: 'Professional application of Computer-Aided Design (CAD) software for producing construction documents and architectural drawings.',
                  credits: 3,
                  outcomes: [
                    'Efficiently produce a complete set of 2D construction documents using CAD.',
                    'Manage complex drawings using layers, blocks, and external references (XRefs).',
                    'Understand and apply office-level CAD standards and protocols.',
                  ],
                  chapters: [
                    { id: 'cad_ch1', title: 'Advanced CAD Concepts', topics: ['CAD Standards', 'Advanced Layer Management', 'Dynamic Blocks', 'External References (XRefs)'] },
                    { id: 'cad_ch2', title: 'Developing a Drawing Set', topics: ['Sheet Setup and Title Blocks', 'Creating Plans, Sections, Elevations', 'Annotation and Dimensioning Styles'] },
                    { id: 'cad_ch3', title: 'Detailing in CAD', topics: ['Wall Sections and Details', 'Creating a Detail Library', 'Scaling and Annotation'] },
                    { id: 'cad_ch4', title: 'Output and Collaboration', topics: ['Plot Styles and Pen Settings', 'Creating PDFs', 'Introduction to BIM Concepts and Revit'] },
                  ],
                },
                {
                  code: 'ARCH3121',
                  name: 'Theory and Design of Structures III',
                  description: 'Analysis of statically indeterminate structures and an introduction to the design of reinforced concrete and steel members.',
                  credits: 3,
                  prerequisites: ['ARCH2110'],
                  outcomes: [
                    'Analyze statically indeterminate beams and frames.',
                    'Understand the fundamental behavior of reinforced concrete and steel.',
                    'Perform preliminary design of basic concrete and steel structural members.',
                  ],
                  chapters: [
                    { id: 'tds3_ch1', title: 'Analysis of Indeterminate Structures', topics: ['Force Method', 'Slope-Deflection Method', 'Moment Distribution'] },
                    { id: 'tds3_ch2', title: 'Reinforced Concrete Design I', topics: ['Properties of Concrete and Steel', 'Flexural Analysis and Design of Beams', 'Shear and Diagonal Tension'] },
                    { id: 'tds3_ch3', title: 'Reinforced Concrete Design II', topics: ['Design of One-Way Slabs', 'Analysis and Design of Short Columns'] },
                    { id: 'tds3_ch4', title: 'Structural Steel Design', topics: ['Tension Members', 'Compression Members (Columns)', 'Design of Beams for Bending and Shear'] },
                  ],
                },
                {
                  code: 'ARCH3117',
                  name: 'Visual & History of Arts',
                  description: 'An exploration of major movements in art history and their relationship to architectural and cultural developments.',
                  credits: 2,
                  outcomes: [
                    'Identify major periods, styles, and artists in Western art history.',
                    'Analyze artworks in terms of form, content, and context.',
                    'Articulate the relationship between artistic movements and concurrent architectural trends.',
                  ],
                  chapters: [
                    { id: 'vha_ch1', title: 'Classical and Medieval Art', topics: ['Greek and Roman Sculpture/Painting', 'Byzantine Mosaics', 'Gothic Stained Glass'] },
                    { id: 'vha_ch2', title: 'Renaissance to Neoclassicism', topics: ['Italian and Northern Renaissance Painting', 'Baroque Drama', 'The Order of Neoclassicism'] },
                    { id: 'vha_ch3', title: 'The Modern Era', topics: ['Impressionism', 'Cubism and Abstraction', 'Surrealism and Dada'] },
                    { id: 'vha_ch4', title: 'Contemporary Art and Theory', topics: ['Abstract Expressionism', 'Pop Art', 'Minimalism and Conceptual Art', 'Installation Art'] },
                  ],
                },
              ],
              'Semester II': [
                {
                  code: 'ARCH3120',
                  name: 'Architectural Design II',
                  description: 'Focuses on medium-scale buildings with more complex programs and urban contexts.',
                  credits: 5,
                  prerequisites: ['ARCH3111'],
                  outcomes: [
                    'Design a medium-scale building (e.g., library, community center) in an urban setting.',
                    'Integrate structural, environmental, and life-safety systems into a cohesive design.',
                    'Respond to urban design issues such as street edge, public space, and context.',
                  ],
                  chapters: [
                    { id: 'ad2_ch1', title: 'Urban Site Analysis and Precedent Studies', topics: ['Zoning and Building Codes', 'Urban Fabric Analysis', 'Programmatic and Typological Research'] },
                    { id: 'ad2_ch2', title: 'Schematic Design', topics: ['Developing multiple design schemes', 'Integrating Building Systems (Structure, HVAC, Egress)', 'Facade and Material Studies'] },
                    { id: 'ad2_ch3', title: 'Design Development', topics: ['Refining the Building Plan and Section', 'Detailed 3D Modeling', 'Large-Scale Physical Models'] },
                    { id: 'ad2_ch4', title: 'Comprehensive Representation', topics: ['Producing a Cohesive Set of Drawings', 'Detail Drawings', 'Final Juried Presentation'] },
                  ],
                },
                {
                  code: 'ARCH3114',
                  name: 'Architectural Sciences I (Water and sewage)',
                  description: 'Principles of plumbing, water supply, and waste disposal systems in buildings.',
                  credits: 2,
                  outcomes: [
                    'Understand the principles of water pressure, flow, and distribution in buildings.',
                    'Design basic water supply and sanitary drainage systems.',
                    'Incorporate sustainable water management strategies into building design.',
                  ],
                  chapters: [
                    { id: 'as1_ch1', title: 'Water Supply and Distribution', topics: ['Sources of Water', 'Pumps and Pressure', 'Piping and Fixtures', 'Hot Water Systems'] },
                    { id: 'as1_ch2', title: 'Sanitary Drainage Systems', topics: ['Drain, Waste, and Vent (DWV) Principles', 'Traps and Vents', 'Pipe Sizing'] },
                    { id: 'as1_ch3', title: 'Stormwater Management', topics: ['Roof Drainage', 'Site Drainage', 'Sustainable Urban Drainage Systems (SUDS)'] },
                  ],
                },
                {
                  code: 'ARCH3116',
                  name: 'General Building Heritage',
                  description: 'Introduction to the principles of architectural conservation and the study of historical building heritage.',
                  credits: 2,
                  outcomes: [
                    'Understand the theory and ethics of heritage conservation.',
                    'Identify common causes of building deterioration.',
                    'Learn basic methods for surveying and documenting historic structures.',
                  ],
                  chapters: [
                    { id: 'gbh_ch1', title: 'Introduction to Conservation', topics: ['Conservation Charters (Venice, Burra)', 'Values-Based Conservation', 'Theories of Restoration'] },
                    { id: 'gbh_ch2', title: 'Building Pathology', topics: ['Deterioration of Masonry, Wood, and Metals', 'Moisture Problems', 'Structural Defects'] },
                    { id: 'gbh_ch3', title: 'Survey and Documentation', topics: ['Archival Research', 'Measured Drawings', 'Photogrammetry', 'Condition Assessment Reports'] },
                    { id: 'gbh_ch4', title: 'Conservation Techniques', topics: ['Material Cleaning and Repair', 'Introduction to Adaptive Reuse'] },
                  ],
                },
                {
                  code: 'ARCH3118',
                  name: 'Landscape Design',
                  description: 'Fundamentals of landscape architecture, including site grading, planting design, and the relationship between buildings and their sites.',
                  credits: 3,
                  outcomes: [
                    'Analyze a site for landscape design opportunities and constraints.',
                    'Create a basic site grading and drainage plan.',
                    'Develop a planting plan considering aesthetic, ecological, and functional goals.',
                  ],
                  chapters: [
                    { id: 'ld_ch1', title: 'Site Analysis and Design Principles', topics: ['Topography, Climate, and Ecology', 'Principles of Landscape Composition', 'The Building-Site Relationship'] },
                    { id: 'ld_ch2', title: 'Hardscape Design', topics: ['Grading and Earthwork', 'Paving, Walls, and Steps', 'Site Furnishings and Lighting'] },
                    { id: 'ld_ch3', title: 'Softscape and Planting Design', topics: ['Plant Selection and Typologies', 'Planting Composition', 'Ecological Planting Strategies'] },
                    { id: 'ld_ch4', title: 'Site Construction and Documentation', topics: ['Landscape Construction Details', 'Irrigation Basics', 'Creating a Landscape Plan Set'] },
                  ],
                },
                {
                  code: 'ARCH3122',
                  name: 'Professional Practice I',
                  description: 'An introduction to the architectural profession, including ethics, forms of practice, and the roles and responsibilities of an architect.',
                  credits: 2,
                  outcomes: [
                    'Understand the structure of the architectural profession and paths to licensure.',
                    'Recognize the ethical and legal responsibilities of an architect.',
                    'Identify different forms of architectural practice and business structures.',
                  ],
                  chapters: [
                    { id: 'pp1_ch1', title: 'The Profession', topics: ['Role of the Architect', 'Licensure and Regulation', 'Professional Organizations (AIA, etc.)'] },
                    { id: 'pp1_ch2', title: 'Ethics and Professional Conduct', topics: ['Code of Ethics', 'Legal Liability', 'Architect\'s Responsibility to the Public, Client, and Profession'] },
                    { id: 'pp1_ch3', title: 'Firm Organization and Management', topics: ['Types of Practice (Sole Proprietor, Partnership, Corporation)', 'Financial Management Basics', 'Marketing Architectural Services'] },
                    { id: 'pp1_ch4', title: 'Project Delivery Methods', topics: ['Design-Bid-Build', 'Design-Build', 'Construction Management', 'Integrated Project Delivery (IPD)'] },
                  ],
                },
                {
                  code: 'ARCH3124',
                  name: 'Surveying',
                  description: 'Principles and practices of land surveying for architectural and site planning purposes.',
                  credits: 2,
                  outcomes: [
                    'Understand the basic principles of land measurement.',
                    'Operate basic surveying equipment like levels and theodolites.',
                    'Read and create a basic site plan with contours and boundary lines.',
                  ],
                  chapters: [
                    { id: 'surv_ch1', title: 'Surveying Fundamentals', topics: ['Units of Measurement', 'Errors and Precision', 'Surveying Datums'] },
                    { id: 'surv_ch2', title: 'Measurement Techniques', topics: ['Distance Measurement (Taping, EDM)', 'Angle Measurement (Theodolite/Total Station)', 'Leveling'] },
                    { id: 'surv_ch3', title: 'Computations and Mapping', topics: ['Traverse Computations', 'Calculating Areas', 'Contouring and Topographic Maps'] },
                  ],
                },
                {
                  code: 'ARCH3128',
                  name: 'Ethiopian History of Architecture',
                  description: 'A specialized study of the rich architectural traditions and history of Ethiopia from ancient to contemporary times.',
                  credits: 3,
                  outcomes: [
                    'Identify the distinct characteristics of major periods in Ethiopian architecture.',
                    'Analyze the cultural, religious, and technical factors shaping Ethiopian building traditions.',
                    'Appreciate the diversity and significance of Ethiopia\'s architectural heritage.',
                  ],
                  chapters: [
                    { id: 'eha_ch1', title: 'Aksumite Period', topics: ['Stelae and Tombs of Aksum', 'Palatial Complexes', 'Early Christian Churches'] },
                    { id: 'eha_ch2', title: 'Zagwe Dynasty and Lalibela', topics: ['The Rock-Hewn Churches of Lalibela', 'Construction Techniques', 'Symbolism and Typology'] },
                    { id: 'eha_ch3', title: 'Gondarine Period', topics: ['The Fasil Ghebbi Royal Enclosure', 'Influence of Portuguese and Indian Architecture', 'Castle and Church Architecture'] },
                    { id: 'eha_ch4', title: 'Modern and Contemporary Ethiopian Architecture', topics: ['Italian Occupation Influence', 'Post-War Modernism in Addis Ababa', 'Contemporary Developments'] },
                  ],
                },
                {
                  code: 'ARCH3126',
                  name: 'Introduction to Environmental Planning',
                  description: 'An overview of the principles and processes of environmental planning and its impact on community and regional design.',
                  credits: 2,
                  outcomes: [
                    'Understand the relationship between human settlements and natural systems.',
                    'Identify key environmental issues relevant to planning and development.',
                    'Become familiar with the tools and processes of environmental planning.',
                  ],
                  chapters: [
                    { id: 'iep_ch1', title: 'Foundations of Environmental Planning', topics: ['History and Theory', 'Ecology for Planners', 'Sustainability Concepts'] },
                    { id: 'iep_ch2', title: 'Planning Processes and Tools', topics: ['Land Use Planning', 'Environmental Impact Assessment (EIA)', 'Geographic Information Systems (GIS)'] },
                    { id: 'iep_ch3', title: 'Key Issues in Environmental Planning', topics: ['Water Resource Management', 'Climate Change Adaptation', 'Biodiversity and Conservation', 'Waste Management'] },
                  ],
                },
              ],
              'Semester III (Summer)': [
                {
                  code: 'ARCH3130',
                  name: 'Internship-I',
                  description: 'Practical work experience in an architectural firm or a related professional environment. Students are required to document their experience and submit a final report.',
                  credits: 1,
                  outcomes: [
                    'Gain exposure to the daily operations of a professional design office.',
                    'Apply academic knowledge to real-world architectural tasks.',
                    'Develop professional communication and collaboration skills.',
                    'Understand the connection between design, documentation, and construction.',
                  ],
                  chapters: [], // Internships typically do not have a chapter structure
                },
              ],
            },
            // The data for Year 4 and Year 5 would follow here.
          },
        },
        {
          "name": "Civil Engineering",
          "abbreviation": "CEng",
          "coursesByYearSemester": {
            "Year 2": {
              "Semester I": [
                {
                  "code": "MEng2001",
                  "name": "Engineering Drawing",
                  "description": "Fundamental principles of engineering drawing and graphics. Covers orthographic projections, sectional views, dimensioning, and an introduction to computer-aided drafting (CAD) software.",
                  "credits": 3,
                  "outcomes": [
                    "Create and interpret multi-view orthographic projections.",
                    "Apply standard dimensioning and annotation techniques.",
                    "Visualize and represent 3D objects in 2D.",
                    "Use basic CAD tools to create engineering drawings."
                  ],
                  "chapters": [
                    {
                      "id": "ed_ch1",
                      "title": "Introduction to Engineering Graphics",
                      "topics": [
                        "Drafting Instruments and their Use",
                        "Lettering, Line Types, and Scale",
                        "Geometric Constructions"
                      ]
                    },
                    {
                      "id": "ed_ch2",
                      "title": "Orthographic Projections",
                      "topics": [
                        "Theory of Multi-view Projection",
                        "Principal Views of Objects",
                        "Auxiliary Views"
                      ]
                    },
                    {
                      "id": "ed_ch3",
                      "title": "Sectional Views and Dimensioning",
                      "topics": [
                        "Types of Sections (Full, Half, Offset)",
                        "Cutting Plane Lines",
                        "Fundamentals of Dimensioning",
                        "Standard Dimensioning Practices"
                      ]
                    },
                    {
                      "id": "ed_ch4",
                      "title": "Introduction to CAD",
                      "topics": [
                        "CAD Interface and Basic Commands",
                        "Drawing and Modifying Objects",
                        "Layers and Properties"
                      ]
                    }
                  ]
                },
                {
                  "code": "Comp2003",
                  "name": "Introduction to Computer Programming",
                  "description": "Introduces fundamental concepts of computer programming using a high-level language. Focuses on problem-solving, algorithms, data structures, and application to engineering problems.",
                  "credits": 3,
                  "outcomes": [
                    "Write, compile, and debug simple programs.",
                    "Apply programming logic including loops, conditionals, and functions.",
                    "Develop algorithms to solve basic engineering problems.",
                    "Understand fundamental data types and structures."
                  ],
                  "chapters": [
                    {
                      "id": "icp_ch1",
                      "title": "Programming Fundamentals",
                      "topics": [
                        "Algorithms and Flowcharts",
                        "Variables and Data Types",
                        "Operators and Expressions"
                      ]
                    },
                    {
                      "id": "icp_ch2",
                      "title": "Control Structures",
                      "topics": [
                        "Conditional Statements (if, else)",
                        "Loops (for, while)",
                        "Functions and Modular Programming"
                      ]
                    },
                    {
                      "id": "icp_ch3",
                      "title": "Data Structures",
                      "topics": [
                        "Arrays and Strings",
                        "Pointers and Memory Allocation",
                        "File Input/Output"
                      ]
                    },
                    {
                      "id": "icp_ch4",
                      "title": "Applications in Engineering",
                      "topics": [
                        "Solving Mathematical Equations",
                        "Data Analysis and Plotting",
                        "Simple Simulations"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng2005",
                  "name": "Engineering Mechanics I (Statics)",
                  "description": "A study of the equilibrium of particles and rigid bodies under the action of forces. Topics include vector algebra, force systems, equilibrium conditions, structural analysis of trusses and frames, friction, and centroids.",
                  "credits": 3,
                  "outcomes": [
                    "Draw free-body diagrams and apply equilibrium equations.",
                    "Analyze forces in truss and frame members.",
                    "Calculate centroids and moments of inertia for various shapes.",
                    "Solve problems involving friction."
                  ],
                  "chapters": [
                    {
                      "id": "statics_ch1",
                      "title": "Force Systems",
                      "topics": [
                        "Vectors and Scalars",
                        "Resultants of Force Systems",
                        "Moments and Couples"
                      ]
                    },
                    {
                      "id": "statics_ch2",
                      "title": "Equilibrium of Rigid Bodies",
                      "topics": [
                        "Free-Body Diagrams",
                        "Equations of Equilibrium in 2D and 3D",
                        "Constraints and Statically Determinate Systems"
                      ]
                    },
                    {
                      "id": "statics_ch3",
                      "title": "Structural Analysis",
                      "topics": [
                        "Analysis of Trusses (Method of Joints, Method of Sections)",
                        "Analysis of Frames and Machines",
                        "Shear Forces and Bending Moments in Beams"
                      ]
                    },
                    {
                      "id": "statics_ch4",
                      "title": "Friction and Properties of Areas",
                      "topics": [
                        "Laws of Dry Friction",
                        "Wedges and Screws",
                        "Centroids and Center of Gravity",
                        "Moment of Inertia"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "MEng2102",
                  "name": "Engineering Mechanics II (Dynamics)",
                  "description": "A study of the motion of particles and rigid bodies. Covers kinematics (geometry of motion) and kinetics (relation between forces and motion) using Newton's laws, work-energy, and impulse-momentum methods.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng2005"
                  ],
                  "outcomes": [
                    "Analyze the kinematics of particles and rigid bodies.",
                    "Apply Newton's second law to solve dynamics problems.",
                    "Utilize work-energy and impulse-momentum principles.",
                    "Understand the concepts of vibration and mechanical resonance."
                  ],
                  "chapters": [
                    {
                      "id": "dyn_ch1",
                      "title": "Kinematics of Particles",
                      "topics": [
                        "Rectilinear and Curvilinear Motion",
                        "Relative Motion",
                        "Constrained Motion"
                      ]
                    },
                    {
                      "id": "dyn_ch2",
                      "title": "Kinetics of Particles",
                      "topics": [
                        "Newton's Second Law",
                        "Work-Energy Principle",
                        "Impulse-Momentum Principle"
                      ]
                    },
                    {
                      "id": "dyn_ch3",
                      "title": "Kinematics of Rigid Bodies",
                      "topics": [
                        "Translation and Rotation",
                        "General Plane Motion",
                        "Instantaneous Center of Zero Velocity"
                      ]
                    },
                    {
                      "id": "dyn_ch4",
                      "title": "Kinetics of Rigid Bodies",
                      "topics": [
                        "Equations of Motion for a Rigid Body",
                        "Work and Energy Methods for Rigid Bodies",
                        "Introduction to Mechanical Vibrations"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng2104",
                  "name": "Strength of Materials",
                  "description": "Analyzes the internal effects of forces on deformable bodies. Covers concepts of stress, strain, torsion, bending, shear in beams, stress transformation, and column buckling.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng2005"
                  ],
                  "outcomes": [
                    "Calculate stresses and strains in structural members.",
                    "Analyze members subjected to axial, torsional, and bending loads.",
                    "Draw shear and moment diagrams for beams.",
                    "Determine critical buckling loads for columns."
                  ],
                  "chapters": [
                    {
                      "id": "som_ch1",
                      "title": "Stress and Strain",
                      "topics": [
                        "Normal and Shear Stress",
                        "Hooke's Law and Material Properties",
                        "Axial Loading and Deformation"
                      ]
                    },
                    {
                      "id": "som_ch2",
                      "title": "Torsion and Bending",
                      "topics": [
                        "Torsional Deformation of Shafts",
                        "Shear and Moment Diagrams",
                        "Flexural Stress in Beams"
                      ]
                    },
                    {
                      "id": "som_ch3",
                      "title": "Shear and Combined Loadings",
                      "topics": [
                        "Transverse Shear in Beams",
                        "Stress Transformation and Mohr's Circle",
                        "Design of Beams and Shafts"
                      ]
                    },
                    {
                      "id": "som_ch4",
                      "title": "Deflection and Buckling",
                      "topics": [
                        "Deflection of Beams",
                        "Statically Indeterminate Beams",
                        "Buckling of Columns"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng2106",
                  "name": "Hydraulics",
                  "description": "Introduction to the mechanics of fluids. Topics include fluid properties, hydrostatics, buoyancy, fluid kinematics, and the principles of conservation of mass, momentum, and energy for fluid flow in pipes and networks.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng2005"
                  ],
                  "outcomes": [
                    "Calculate hydrostatic forces on submerged surfaces.",
                    "Apply the Bernoulli and energy equations to pipe flow problems.",
                    "Analyze energy losses in pipe systems.",
                    "Design simple pipe networks."
                  ],
                  "chapters": [
                    {
                      "id": "hyd_ch1",
                      "title": "Fluid Properties and Hydrostatics",
                      "topics": [
                        "Density, Viscosity, Surface Tension",
                        "Pressure Measurement (Manometry)",
                        "Hydrostatic Forces on Plane and Curved Surfaces"
                      ]
                    },
                    {
                      "id": "hyd_ch2",
                      "title": "Fluid Flow Concepts",
                      "topics": [
                        "Continuity Equation",
                        "Bernoulli's Equation",
                        "Energy Equation"
                      ]
                    },
                    {
                      "id": "hyd_ch3",
                      "title": "Pipe Flow",
                      "topics": [
                        "Laminar and Turbulent Flow",
                        "Major and Minor Losses",
                        "Moody Diagram"
                      ]
                    },
                    {
                      "id": "hyd_ch4",
                      "title": "Pipe Networks and Pumps",
                      "topics": [
                        "Pipes in Series and Parallel",
                        "Introduction to Pump Performance",
                        "Flow Measurement"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng2108",
                  "name": "Engineering Surveying I",
                  "description": "Fundamentals of surveying for civil engineering applications. Covers principles of measurement, leveling, traversing, topographic surveying, and the use of surveying instruments like levels and theodolites.",
                  "credits": 3,
                  "outcomes": [
                    "Perform differential and profile leveling.",
                    "Execute and adjust a closed traverse.",
                    "Collect data to produce a topographic map.",
                    "Operate basic surveying equipment correctly."
                  ],
                  "chapters": [
                    {
                      "id": "surv1_ch1",
                      "title": "Surveying Fundamentals",
                      "topics": [
                        "Introduction to Surveying",
                        "Units, Significant Figures, Errors",
                        "Distance Measurement (Taping, EDM)"
                      ]
                    },
                    {
                      "id": "surv1_ch2",
                      "title": "Leveling",
                      "topics": [
                        "Theory of Leveling",
                        "Differential Leveling",
                        "Profile and Cross-Section Leveling"
                      ]
                    },
                    {
                      "id": "surv1_ch3",
                      "title": "Angle and Direction Measurement",
                      "topics": [
                        "Bearings and Azimuths",
                        "Theodolite and Total Station",
                        "Traversing and Traverse Computations"
                      ]
                    },
                    {
                      "id": "surv1_ch4",
                      "title": "Topographic Surveying",
                      "topics": [
                        "Stadia Surveying",
                        "Contouring",
                        "Area and Volume Calculations"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng2110",
                  "name": "General Workshop Practice",
                  "description": "A hands-on introduction to basic manufacturing processes and workshop safety. Includes practical experience in areas such as welding, machining, casting, and sheet metal work.",
                  "credits": 1,
                  "outcomes": [
                    "Adhere to workshop safety protocols.",
                    "Gain practical skills in basic fabrication techniques.",
                    "Understand the capabilities and limitations of common workshop tools."
                  ],
                  "chapters": [
                    {
                      "id": "gwp_ch1",
                      "title": "Workshop Safety and Hand Tools",
                      "topics": []
                    },
                    {
                      "id": "gwp_ch2",
                      "title": "Machining (Lathe, Drilling, Milling)",
                      "topics": []
                    },
                    {
                      "id": "gwp_ch3",
                      "title": "Welding and Joining",
                      "topics": []
                    },
                    {
                      "id": "gwp_ch4",
                      "title": "Casting and Sheet Metal Work",
                      "topics": []
                    }
                  ]
                },
                {
                  "code": "CEng2112",
                  "name": "Engineering Geology",
                  "description": "Study of earth materials and processes relevant to civil engineering. Covers rock and mineral identification, geological structures, weathering, soil formation, and geological site investigation.",
                  "credits": 2,
                  "outcomes": [
                    "Identify common rocks and minerals.",
                    "Interpret geological maps and identify geological hazards.",
                    "Understand the influence of geology on engineering projects.",
                    "Describe basic methods of subsurface exploration."
                  ],
                  "chapters": [
                    {
                      "id": "eg_ch1",
                      "title": "Introduction to Geology",
                      "topics": [
                        "Earth Structure",
                        "Plate Tectonics",
                        "Geological Time Scale"
                      ]
                    },
                    {
                      "id": "eg_ch2",
                      "title": "Minerals and Rocks",
                      "topics": [
                        "Rock-Forming Minerals",
                        "Igneous, Sedimentary, and Metamorphic Rocks",
                        "The Rock Cycle"
                      ]
                    },
                    {
                      "id": "eg_ch3",
                      "title": "Geological Structures and Maps",
                      "topics": [
                        "Folds, Faults, and Joints",
                        "Interpretation of Geological Maps",
                        "Geological Hazards (Earthquakes, Landslides)"
                      ]
                    },
                    {
                      "id": "eg_ch4",
                      "title": "Geology for Civil Engineering",
                      "topics": [
                        "Weathering and Soil Formation",
                        "Groundwater Geology",
                        "Geological Site Investigation"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 3": {
              "Semester I": [
                {
                  "code": "CEng3101",
                  "name": "Transport Engineering",
                  "description": "An introduction to the field of transportation engineering, focusing on system characteristics, traffic flow fundamentals, transportation planning, and safety.",
                  "credits": 3,
                  "outcomes": [
                    "Understand the components of transportation systems.",
                    "Analyze traffic flow characteristics (speed, volume, density).",
                    "Grasp the four-step transportation planning process.",
                    "Identify key principles of traffic safety."
                  ],
                  "chapters": [
                    {
                      "id": "te_ch1",
                      "title": "Introduction to Transportation Systems",
                      "topics": [
                        "Modes of Transportation",
                        "System Components",
                        "Vehicle and Driver Characteristics"
                      ]
                    },
                    {
                      "id": "te_ch2",
                      "title": "Traffic Engineering and Analysis",
                      "topics": [
                        "Traffic Stream Parameters",
                        "Traffic Studies (Volume, Speed)",
                        "Introduction to Capacity and Level of Service"
                      ]
                    },
                    {
                      "id": "te_ch3",
                      "title": "Transportation Planning",
                      "topics": [
                        "The Four-Step Model (Trip Generation, Distribution, Mode Choice, Assignment)",
                        "Data Collection Methods",
                        "Sustainable Transportation"
                      ]
                    },
                    {
                      "id": "te_ch4",
                      "title": "Traffic Safety and Control",
                      "topics": [
                        "Accident Analysis",
                        "Traffic Control Devices (Signs, Signals, Markings)",
                        "Intersection Control"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng3103",
                  "name": "Soil Mechanics I",
                  "description": "Introduction to the engineering properties of soils. Covers soil composition, phase relationships, classification, compaction, permeability, and seepage.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng2112"
                  ],
                  "outcomes": [
                    "Classify soils using standard systems (USCS, AASHTO).",
                    "Determine key index properties of soils in the laboratory.",
                    "Analyze one-dimensional water flow (seepage) through soils.",
                    "Understand the principles and application of soil compaction."
                  ],
                  "chapters": [
                    {
                      "id": "sm1_ch1",
                      "title": "Soil Composition and Index Properties",
                      "topics": [
                        "Soil Formation",
                        "Phase Relationships (Weight-Volume)",
                        "Atterberg Limits",
                        "Soil Classification"
                      ]
                    },
                    {
                      "id": "sm1_ch2",
                      "title": "Soil Compaction",
                      "topics": [
                        "Principles of Compaction",
                        "Proctor Compaction Test",
                        "Field Compaction and Control"
                      ]
                    },
                    {
                      "id": "sm1_ch3",
                      "title": "Water in Soils: Permeability and Seepage",
                      "topics": [
                        "Bernoulli's Equation for Soils",
                        "Darcy's Law and Hydraulic Conductivity",
                        "Flow Nets",
                        "Effective Stress Concept"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng3105",
                  "name": "Theory of Structures I",
                  "description": "Analysis of statically determinate and indeterminate structures. Focuses on classical methods for calculating deflections and analyzing indeterminate beams, frames, and trusses.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng2104"
                  ],
                  "outcomes": [
                    "Calculate deflections of beams and trusses using energy methods.",
                    "Analyze indeterminate structures using force methods (consistent deformations).",
                    "Analyze indeterminate structures using displacement methods (slope-deflection).",
                    "Construct influence lines for determinate structures."
                  ],
                  "chapters": [
                    {
                      "id": "tos1_ch1",
                      "title": "Structural Stability and Determinacy",
                      "topics": [
                        "Classification of Structures",
                        "Stability and Determinacy",
                        "Principle of Superposition"
                      ]
                    },
                    {
                      "id": "tos1_ch2",
                      "title": "Deflections of Structures",
                      "topics": [
                        "Moment-Area Method",
                        "Conjugate Beam Method",
                        "Virtual Work Method"
                      ]
                    },
                    {
                      "id": "tos1_ch3",
                      "title": "Analysis of Indeterminate Structures",
                      "topics": [
                        "Force Method (Method of Consistent Deformations)",
                        "Slope-Deflection Method",
                        "Moment Distribution Method (introduction)"
                      ]
                    },
                    {
                      "id": "tos1_ch4",
                      "title": "Influence Lines",
                      "topics": [
                        "Influence Lines for Beams and Trusses",
                        "Use of Influence Lines for Moving Loads",
                        "Müller-Breslau Principle"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng3107",
                  "name": "Open Channel Hydraulics",
                  "description": "Study of fluid flow with a free surface, primarily in channels and rivers. Covers uniform flow, energy and momentum principles, gradually varied flow, and rapidly varied flow phenomena like hydraulic jumps.",
                  "credits": 2,
                  "prerequisites": [
                    "CEng2106"
                  ],
                  "outcomes": [
                    "Design channels for uniform flow using Manning's equation.",
                    "Analyze specific energy and critical flow conditions.",
                    "Classify and compute gradually varied flow profiles.",
                    "Analyze rapidly varied flow phenomena like hydraulic jumps."
                  ],
                  "chapters": [
                    {
                      "id": "och_ch1",
                      "title": "Principles of Open Channel Flow",
                      "topics": [
                        "Types of Flow",
                        "Channel Geometry",
                        "Velocity and Pressure Distribution"
                      ]
                    },
                    {
                      "id": "och_ch2",
                      "title": "Uniform Flow",
                      "topics": [
                        "Manning's and Chezy's Equations",
                        "Design of Erodible and Non-Erodible Channels",
                        "Best Hydraulic Section"
                      ]
                    },
                    {
                      "id": "och_ch3",
                      "title": "Energy and Momentum",
                      "topics": [
                        "Specific Energy and Specific Force",
                        "Critical, Subcritical, and Supercritical Flow",
                        "Hydraulic Jump"
                      ]
                    },
                    {
                      "id": "och_ch4",
                      "title": "Varied Flow",
                      "topics": [
                        "Gradually Varied Flow Equation",
                        "Classification of Flow Profiles",
                        "Methods for Profile Computation"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng3109",
                  "name": "Construction Materials",
                  "description": "A detailed study of the properties, behavior, and testing of primary civil engineering materials, including Portland cement concrete, asphalt concrete, steel, and timber.",
                  "credits": 3,
                  "outcomes": [
                    "Design concrete mixes to meet strength and workability requirements.",
                    "Understand the properties and testing of fresh and hardened concrete.",
                    "Describe the properties of asphalt binders and mixtures.",
                    "Recognize the mechanical properties and uses of structural steel and timber."
                  ],
                  "chapters": [
                    {
                      "id": "cm_ch1",
                      "title": "Portland Cement Concrete",
                      "topics": [
                        "Cement and Aggregates",
                        "Properties of Fresh Concrete (Workability)",
                        "Properties of Hardened Concrete (Strength, Durability)"
                      ]
                    },
                    {
                      "id": "cm_ch2",
                      "title": "Concrete Mix Design and Testing",
                      "topics": [
                        "ACI Mix Design Method",
                        "Admixtures",
                        "Standard Concrete Tests (Slump, Cylinder)"
                      ]
                    },
                    {
                      "id": "cm_ch3",
                      "title": "Asphalt Concrete",
                      "topics": [
                        "Asphalt Binders and Aggregates",
                        "Marshall and Superpave Mix Design",
                        "Properties of Hot Mix Asphalt"
                      ]
                    },
                    {
                      "id": "cm_ch4",
                      "title": "Steel, Timber, and Masonry",
                      "topics": [
                        "Properties of Structural Steel",
                        "Properties of Wood",
                        "Bricks, Blocks and Mortar"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng3111",
                  "name": "Engineering Surveying II",
                  "description": "Advanced topics in surveying, including route surveying, horizontal and vertical curves, earthwork calculations, and an introduction to modern surveying technologies like GPS and GIS.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng2108"
                  ],
                  "outcomes": [
                    "Design and lay out horizontal and vertical curves for roads.",
                    "Calculate earthwork volumes from cross-sections.",
                    "Understand the principles of Global Positioning System (GPS).",
                    "Be familiar with the concepts of Geographic Information Systems (GIS)."
                  ],
                  "chapters": [
                    {
                      "id": "surv2_ch1",
                      "title": "Route Surveying and Horizontal Curves",
                      "topics": [
                        "Route Location",
                        "Simple, Compound, and Spiral Curves",
                        "Curve Layout"
                      ]
                    },
                    {
                      "id": "surv2_ch2",
                      "title": "Vertical Curves",
                      "topics": [
                        "Properties of Parabolic Curves",
                        "Design of Crest and Sag Curves",
                        "Sight Distance Considerations"
                      ]
                    },
                    {
                      "id": "surv2_ch3",
                      "title": "Earthwork and Mass Haul Diagrams",
                      "topics": [
                        "Cross-Section and Area Calculation",
                        "Volume Computation (Average-End-Area)",
                        "Mass-Haul Diagrams"
                      ]
                    },
                    {
                      "id": "surv2_ch4",
                      "title": "Modern Surveying Technologies",
                      "topics": [
                        "Introduction to GPS",
                        "Introduction to GIS",
                        "Basics of Photogrammetry"
                      ]
                    }
                  ]
                },
                {
                  "code": "Stat3027",
                  "name": "Probability and Statistics",
                  "description": "An introduction to the principles of probability and statistical analysis tailored for engineering applications. Covers descriptive statistics, probability distributions, estimation, hypothesis testing, and regression.",
                  "credits": 3,
                  "outcomes": [
                    "Apply probability theory to model uncertainty.",
                    "Perform statistical data analysis and interpretation.",
                    "Conduct hypothesis tests to make engineering decisions.",
                    "Develop simple regression models from data."
                  ],
                  "chapters": [
                    {
                      "id": "ps_ch1",
                      "title": "Probability",
                      "topics": [
                        "Sample Spaces and Events",
                        "Axioms of Probability",
                        "Conditional Probability"
                      ]
                    },
                    {
                      "id": "ps_ch2",
                      "title": "Random Variables and Distributions",
                      "topics": [
                        "Discrete and Continuous Random Variables",
                        "Common Distributions (Binomial, Poisson, Normal)",
                        "Expected Value and Variance"
                      ]
                    },
                    {
                      "id": "ps_ch3",
                      "title": "Statistical Inference",
                      "topics": [
                        "Sampling Distributions",
                        "Confidence Intervals",
                        "Hypothesis Testing"
                      ]
                    },
                    {
                      "id": "ps_ch4",
                      "title": "Regression Analysis",
                      "topics": [
                        "Simple Linear Regression",
                        "Correlation",
                        "Goodness of Fit"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "CEng3102",
                  "name": "Highway Engineering I",
                  "description": "Focuses on the geometric design of highways, including horizontal and vertical alignment, cross-section design, and intersection design, based on traffic, safety, and economic considerations.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng3101",
                    "CEng3111"
                  ],
                  "outcomes": [
                    "Design the horizontal alignment of a highway, including curves.",
                    "Design the vertical alignment of a highway, including crest and sag curves.",
                    "Develop typical highway cross-sections.",
                    "Analyze and design basic at-grade intersections."
                  ],
                  "chapters": [
                    {
                      "id": "he1_ch1",
                      "title": "Highway Design Principles",
                      "topics": [
                        "Highway Classification",
                        "Design Controls and Criteria",
                        "Driver and Vehicle Performance"
                      ]
                    },
                    {
                      "id": "he1_ch2",
                      "title": "Geometric Design: Horizontal Alignment",
                      "topics": [
                        "Tangents and Circular Curves",
                        "Superelevation",
                        "Transition Curves (Spirals)"
                      ]
                    },
                    {
                      "id": "he1_ch3",
                      "title": "Geometric Design: Vertical Alignment",
                      "topics": [
                        "Grades and Vertical Curves",
                        "Stopping and Passing Sight Distance",
                        "Coordination of Horizontal and Vertical Alignment"
                      ]
                    },
                    {
                      "id": "he1_ch4",
                      "title": "Cross-Section and Intersection Design",
                      "topics": [
                        "Cross-Sectional Elements (Lanes, Shoulders, Slopes)",
                        "Drainage Considerations",
                        "Design of At-Grade Intersections"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng3104",
                  "name": "Soil Mechanics II",
                  "description": "Advanced topics in soil mechanics, including stress distribution in soils, consolidation and settlement theory, shear strength of soils, and an introduction to slope stability analysis.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng3103"
                  ],
                  "outcomes": [
                    "Calculate stress increases in soil from surface loads.",
                    "Predict the magnitude and rate of consolidation settlement.",
                    "Determine the shear strength of soils from lab tests.",
                    "Perform basic stability analysis of soil slopes."
                  ],
                  "chapters": [
                    {
                      "id": "sm2_ch1",
                      "title": "Stresses in Soil Mass",
                      "topics": [
                        "Effective Stress Principle Review",
                        "Geostatic Stresses",
                        "Stress Distribution from Surface Loads (Boussinesq)"
                      ]
                    },
                    {
                      "id": "sm2_ch2",
                      "title": "Consolidation and Settlement",
                      "topics": [
                        "Theory of One-Dimensional Consolidation",
                        "Consolidation Testing",
                        "Settlement Calculation and Time Rate of Settlement"
                      ]
                    },
                    {
                      "id": "sm2_ch3",
                      "title": "Shear Strength of Soil",
                      "topics": [
                        "Mohr-Coulomb Failure Criterion",
                        "Direct Shear Test",
                        "Triaxial Compression Test",
                        "Drained and Undrained Shear Strength"
                      ]
                    },
                    {
                      "id": "sm2_ch4",
                      "title": "Slope Stability",
                      "topics": [
                        "Causes of Slope Failure",
                        "Analysis of Infinite Slopes",
                        "Method of Slices for Finite Slopes (Ordinary Method)"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng3106",
                  "name": "Theory of Structures II",
                  "description": "Advanced methods for structural analysis, with an emphasis on matrix and computer-based methods. Covers the direct stiffness method for analyzing trusses, beams, and frames.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng3105"
                  ],
                  "outcomes": [
                    "Apply the moment distribution method to beams and frames.",
                    "Develop stiffness matrices for truss and beam elements.",
                    "Assemble global stiffness matrices and solve for displacements.",
                    "Use matrix analysis to find member forces in complex structures."
                  ],
                  "chapters": [
                    {
                      "id": "tos2_ch1",
                      "title": "Moment Distribution Method",
                      "topics": [
                        "Stiffness and Carry-Over Factors",
                        "Analysis of Continuous Beams",
                        "Analysis of Frames (Sway and Non-Sway)"
                      ]
                    },
                    {
                      "id": "tos2_ch2",
                      "title": "Introduction to Matrix Structural Analysis",
                      "topics": [
                        "Stiffness Method Concepts",
                        "Coordinate Systems and Transformations"
                      ]
                    },
                    {
                      "id": "tos2_ch3",
                      "title": "Direct Stiffness Method for Trusses",
                      "topics": [
                        "Truss Element Stiffness Matrix",
                        "Assembly of Global Stiffness Matrix",
                        "Solution Procedure"
                      ]
                    },
                    {
                      "id": "tos2_ch4",
                      "title": "Direct Stiffness Method for Beams and Frames",
                      "topics": [
                        "Beam Element Stiffness Matrix",
                        "Analysis of Continuous Beams",
                        "Analysis of Plane Frames"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng3108",
                  "name": "Engineering Hydrology",
                  "description": "The study of the occurrence, movement, and distribution of water on Earth. Focuses on the hydrologic cycle, precipitation analysis, evaporation, infiltration, and surface runoff estimation.",
                  "credits": 2,
                  "prerequisites": [
                    "CEng3107"
                  ],
                  "outcomes": [
                    "Quantify components of the hydrologic cycle.",
                    "Analyze precipitation data and create IDF curves.",
                    "Estimate surface runoff using methods like the SCS-CN method.",
                    "Develop a unit hydrograph for a watershed."
                  ],
                  "chapters": [
                    {
                      "id": "hydro_ch1",
                      "title": "Hydrologic Cycle and Precipitation",
                      "topics": [
                        "The Hydrologic Cycle",
                        "Measurement of Precipitation",
                        "Analysis of Point and Areal Precipitation"
                      ]
                    },
                    {
                      "id": "hydro_ch2",
                      "title": "Abstractions from Precipitation",
                      "topics": [
                        "Evaporation and Transpiration",
                        "Infiltration Processes and Models",
                        "Depression Storage"
                      ]
                    },
                    {
                      "id": "hydro_ch3",
                      "title": "Surface Runoff and Streamflow",
                      "topics": [
                        "Runoff Generation",
                        "Streamflow Measurement",
                        "Hydrograph Analysis"
                      ]
                    },
                    {
                      "id": "hydro_ch4",
                      "title": "Runoff Modeling",
                      "topics": [
                        "Unit Hydrograph Theory",
                        "Synthetic Unit Hydrographs",
                        "Introduction to Hydrologic Routing"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng3110",
                  "name": "Building Construction",
                  "description": "An overview of building systems and construction processes. Covers foundations, wall and floor systems, roofing, finishes, and the integration of mechanical, electrical, and plumbing (MEP) systems.",
                  "credits": 2,
                  "outcomes": [
                    "Identify common types of building foundations and structural systems.",
                    "Understand the sequence of operations in building construction.",
                    "Recognize various materials used for building envelopes and finishes.",
                    "Read and interpret basic architectural and construction drawings."
                  ],
                  "chapters": [
                    {
                      "id": "bc_ch1",
                      "title": "Substructure and Foundations",
                      "topics": [
                        "Shallow and Deep Foundations",
                        "Waterproofing and Dampproofing",
                        "Basement Construction"
                      ]
                    },
                    {
                      "id": "bc_ch2",
                      "title": "Superstructure and Framing Systems",
                      "topics": [
                        "Wood Frame Construction",
                        "Steel Frame Construction",
                        "Concrete Frame Construction"
                      ]
                    },
                    {
                      "id": "bc_ch3",
                      "title": "Building Envelope",
                      "topics": [
                        "Wall Systems (Masonry, Cladding)",
                        "Roofing Systems",
                        "Windows and Doors"
                      ]
                    },
                    {
                      "id": "bc_ch4",
                      "title": "Interior Finishes and Building Services",
                      "topics": [
                        "Stairs, Flooring, and Ceilings",
                        "Introduction to MEP Systems",
                        "Fire Protection Systems"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng3112",
                  "name": "Numerical Methods",
                  "description": "Application of numerical techniques to solve complex engineering problems that are difficult to solve analytically. Includes root finding, solving systems of linear equations, interpolation, numerical integration, and solving ordinary differential equations.",
                  "credits": 2,
                  "prerequisites": [
                    "Comp2003"
                  ],
                  "outcomes": [
                    "Apply numerical methods to find roots of equations.",
                    "Solve systems of linear algebraic equations numerically.",
                    "Perform numerical integration and differentiation.",
                    "Solve initial value problems for ordinary differential equations."
                  ],
                  "chapters": [
                    {
                      "id": "nm_ch1",
                      "title": "Roots of Equations",
                      "topics": [
                        "Bisection Method",
                        "Newton-Raphson Method",
                        "Secant Method"
                      ]
                    },
                    {
                      "id": "nm_ch2",
                      "title": "Systems of Linear Equations",
                      "topics": [
                        "Gauss Elimination",
                        "LU Decomposition",
                        "Iterative Methods (Jacobi, Gauss-Seidel)"
                      ]
                    },
                    {
                      "id": "nm_ch3",
                      "title": "Curve Fitting and Interpolation",
                      "topics": [
                        "Least-Squares Regression",
                        "Newton's and Lagrange Polynomials",
                        "Spline Interpolation"
                      ]
                    },
                    {
                      "id": "nm_ch4",
                      "title": "Numerical Integration and Differentiation",
                      "topics": [
                        "Trapezoidal Rule",
                        "Simpson's Rules",
                        "Runge-Kutta Methods for ODEs"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng3114",
                  "name": "Computer Aided Drafting (CAD)",
                  "description": "Advanced application of CAD software in civil engineering. Focuses on producing professional-quality construction drawings, 3D modeling, and leveraging software for specific civil applications like site layout and grading.",
                  "credits": 2,
                  "prerequisites": [
                    "MEng2001"
                  ],
                  "outcomes": [
                    "Produce a set of civil engineering construction drawings.",
                    "Create and manipulate 3D models of civil infrastructure.",
                    "Use advanced CAD features like blocks, x-refs, and layouts.",
                    "Understand the role of CAD in the overall design process."
                  ],
                  "chapters": [
                    {
                      "id": "cad2_ch1",
                      "title": "Advanced 2D Drafting",
                      "topics": [
                        "Layouts and Viewports",
                        "Annotation Styles",
                        "Dynamic Blocks and External References"
                      ]
                    },
                    {
                      "id":"cad2_ch2",
                      "title": "Introduction to 3D Modeling",
                      "topics": [
                        "3D Coordinate Systems",
                        "Solid Modeling",
                        "Creating 2D Views from 3D Models"
                      ]
                    },
                    {
                      "id": "cad2_ch3",
                      "title": "Civil 3D Fundamentals",
                      "topics": [
                        "Points, Surfaces, and Contours",
                        "Alignments and Profiles",
                        "Corridor Modeling"
                      ]
                    },
                    {
                      "id": "cad2_ch4",
                      "title": "Plotting and Presentation",
                      "topics": [
                        "Plot Styles",
                        "Sheet Set Manager",
                        "Data Exchange Formats"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 4": {
              "Semester I": [
                {
                  "code": "CEng4103",
                  "name": "Highway Engineering II",
                  "description": "Focuses on the structural design of highway pavements. Covers pavement materials, analysis of stresses in flexible and rigid pavements, design methods (AASHTO), and an introduction to pavement management systems.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng3102",
                    "CEng3109"
                  ],
                  "outcomes": [
                    "Characterize pavement materials and subgrade soils.",
                    "Design flexible pavements using the AASHTO method.",
                    "Design rigid pavements using the AASHTO method.",
                    "Understand the principles of pavement evaluation and maintenance."
                  ],
                  "chapters": [
                    {
                      "id": "he2_ch1",
                      "title": "Pavement Types and Materials",
                      "topics": [
                        "Flexible vs. Rigid Pavements",
                        "Subgrade Soil Characterization",
                        "Properties of Base, Subbase, and Pavement Layers"
                      ]
                    },
                    {
                      "id": "he2_ch2",
                      "title": "Stresses in Pavements",
                      "topics": [
                        "Stresses in Flexible Pavements",
                        "Stresses in Rigid Pavements (Westergaard's analysis)",
                        "Traffic and Environmental Effects"
                      ]
                    },
                    {
                      "id": "he2_ch3",
                      "title": "Pavement Design",
                      "topics": [
                        "AASHTO Design Method for Flexible Pavements",
                        "AASHTO Design Method for Rigid Pavements",
                        "Drainage Design"
                      ]
                    },
                    {
                      "id": "he2_ch4",
                      "title": "Pavement Management",
                      "topics": [
                        "Pavement Condition Surveys",
                        "Rehabilitation and Maintenance Strategies",
                        "Introduction to Pavement Management Systems (PMS)"
                      ]
                    }
                  ]
                },
                {
                  "code": "EnEng4105",
                  "name": "Environmental Engineering",
                  "description": "An introduction to environmental engineering principles, covering water quality, water and wastewater treatment fundamentals, air pollution, and solid waste management.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng2106"
                  ],
                  "outcomes": [
                    "Understand water quality parameters and standards.",
                    "Describe the fundamental processes of water and wastewater treatment.",
                    "Identify sources and effects of major air pollutants.",
                    "Analyze the components and management of solid waste."
                  ],
                  "chapters": [
                    {
                      "id": "env_ch1",
                      "title": "Water Quality and Pollution",
                      "topics": [
                        "Water Quality Parameters (Physical, Chemical, Biological)",
                        "Water Pollutants and Sources",
                        "Water Quality Standards"
                      ]
                    },
                    {
                      "id": "env_ch2",
                      "title": "Water and Wastewater Treatment",
                      "topics": [
                        "Overview of Water Treatment Processes (Coagulation, Sedimentation, Filtration, Disinfection)",
                        "Overview of Wastewater Treatment (Primary, Secondary, Tertiary)"
                      ]
                    },
                    {
                      "id": "env_ch3",
                      "title": "Air Pollution",
                      "topics": [
                        "Sources and Types of Air Pollutants",
                        "Atmospheric Dispersion",
                        "Air Pollution Control Technologies"
                      ]
                    },
                    {
                      "id": "env_ch4",
                      "title": "Solid Waste Management",
                      "topics": [
                        "Solid Waste Characterization",
                        "Collection, Transfer, and Disposal",
                        "Landfill Design and Operation",
                        "Recycling and Resource Recovery"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng4107",
                  "name": "Reinforced Concrete Structures I",
                  "description": "Fundamentals of reinforced concrete design. Covers the behavior and design of rectangular and T-beams for flexure and shear, one-way slabs, and an introduction to bond and development length.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng3105",
                    "CEng3109"
                  ],
                  "outcomes": [
                    "Analyze and design rectangular beams for bending moments.",
                    "Design beams for shear using stirrups.",
                    "Design one-way solid slabs.",
                    "Calculate required development lengths for reinforcement."
                  ],
                  "chapters": [
                    {
                      "id": "rc1_ch1",
                      "title": "Introduction to Reinforced Concrete",
                      "topics": [
                        "Properties of Concrete and Steel",
                        "Design Philosophies (WSD, USD/LRFD)",
                        "Building Codes (ACI/EBCS)"
                      ]
                    },
                    {
                      "id": "rc1_ch2",
                      "title": "Flexural Analysis and Design of Beams",
                      "topics": [
                        "Singly Reinforced Rectangular Beams",
                        "Doubly Reinforced Beams",
                        "T-Beams and L-Beams"
                      ]
                    },
                    {
                      "id": "rc1_ch3",
                      "title": "Shear and Diagonal Tension in Beams",
                      "topics": [
                        "Beam Shear Behavior",
                        "Design of Shear Reinforcement (Stirrups)",
                        "Combined Shear and Flexure"
                      ]
                    },
                    {
                      "id": "rc1_ch4",
                      "title": "One-Way Slabs and Development Length",
                      "topics": [
                        "Design of One-Way Slabs",
                        "Bond and Development Length",
                        "Bar Cutoffs and Anchorage"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng4109",
                  "name": "Hydraulic Structures I",
                  "description": "Analysis and design of common hydraulic structures, including dams, spillways, and energy dissipators. Covers forces on dams, seepage analysis, and principles of spillway design.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng3107",
                    "CEng3104"
                  ],
                  "outcomes": [
                    "Analyze the stability of gravity dams.",
                    "Analyze seepage under concrete dams and through earth dams.",
                    "Design spillway profiles.",
                    "Select and design appropriate energy dissipators."
                  ],
                  "chapters": [
                    {
                      "id": "hs1_ch1",
                      "title": "Dams and Reservoirs",
                      "topics": [
                        "Types of Dams",
                        "Reservoir Planning and Storage",
                        "Site Selection"
                      ]
                    },
                    {
                      "id": "hs1_ch2",
                      "title": "Gravity Dams",
                      "topics": [
                        "Forces Acting on Gravity Dams",
                        "Stability Analysis (Overturning, Sliding, Stresses)",
                        "Foundation Treatment"
                      ]
                    },
                    {
                      "id": "hs1_ch3",
                      "title": "Seepage Analysis",
                      "topics": [
                        "Seepage through Earth Dams (Flow Nets)",
                        "Piping and Filter Design",
                        "Seepage under Concrete Dams"
                      ]
                    },
                    {
                      "id": "hs1_ch4",
                      "title": "Spillways and Energy Dissipators",
                      "topics": [
                        "Types of Spillways",
                        "Design of Ogee Spillways",
                        "Stilling Basins and Hydraulic Jumps"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng4111",
                  "name": "Specification and Quantity Survey",
                  "description": "Principles and practices of preparing construction specifications and estimating material quantities. Covers specification writing, measurement standards, and preparation of a bill of quantities (BoQ).",
                  "credits": 2,
                  "outcomes": [
                    "Write clear and enforceable technical specifications.",
                    "Perform quantity take-offs from construction drawings.",
                    "Prepare a bill of quantities in a standard format.",
                    "Understand the role of specifications and BoQ in contracts."
                  ],
                  "chapters": [
                    {
                      "id": "sqs_ch1",
                      "title": "Construction Specifications",
                      "topics": [
                        "Purpose and Types of Specifications",
                        "Specification Writing Principles",
                        "MasterFormat and UniFormat"
                      ]
                    },
                    {
                      "id": "sqs_ch2",
                      "title": "Quantity Take-Off Principles",
                      "topics": [
                        "Methods of Measurement",
                        "Reading Drawings for Take-Off",
                        "Use of Measurement Sheets"
                      ]
                    },
                    {
                      "id": "sqs_ch3",
                      "title": "Measurement of Civil Works",
                      "topics": [
                        "Earthwork and Excavation",
                        "Concrete and Formwork",
                        "Masonry and Finishes"
                      ]
                    },
                    {
                      "id": "sqs_ch4",
                      "title": "Bill of Quantities (BoQ) and Costing",
                      "topics": [
                        "Preparation of BoQ",
                        "Introduction to Unit Rate Analysis",
                        "Preliminary Cost Estimation"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng4115",
                  "name": "Fundamental of Architecture",
                  "description": "An introduction to architectural principles, history, and theory for engineers. Aims to foster a better understanding and appreciation of architectural design and improve collaboration between engineers and architects.",
                  "credits": 2,
                  "outcomes": [
                    "Understand basic principles of architectural form, space, and order.",
                    "Recognize major historical styles of architecture.",
                    "Appreciate the relationship between architectural design and structural/environmental systems."
                  ],
                  "chapters": [
                    {
                      "id": "fa_ch1",
                      "title": "Architectural Principles",
                      "topics": [
                        "Form, Space, and Order",
                        "Scale and Proportion",
                        "Light and Color"
                      ]
                    },
                    {
                      "id": "fa_ch2",
                      "title": "A Brief History of Architecture",
                      "topics": [
                        "Ancient and Classical",
                        "Gothic and Renaissance",
                        "Modernism"
                      ]
                    },
                    {
                      "id": "fa_ch3",
                      "title": "The Architectural Design Process",
                      "topics": [
                        "Programming and Site Analysis",
                        "Schematic Design",
                        "Design Development"
                      ]
                    }
                  ]
                },
                {
                  "code": "IETP4115",
                  "name": "Integrated Engineering Team Project",
                  "description": "A multidisciplinary project course where students from different engineering disciplines work in teams to solve a complex engineering problem, simulating a real-world project environment.",
                  "credits": 2,
                  "outcomes": [
                    "Collaborate effectively in a multidisciplinary team.",
                    "Integrate knowledge from different engineering fields.",
                    "Manage a project from conception to final presentation.",
                    "Communicate technical solutions to a diverse audience."
                  ],
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "CEng4102",
                  "name": "Construction Equipment",
                  "description": "Study of the types, performance characteristics, economics, and selection of heavy construction equipment. Covers earthmoving equipment, cranes, and concrete production equipment.",
                  "credits": 2,
                  "outcomes": [
                    "Identify common types of construction equipment and their applications.",
                    "Estimate equipment productivity.",
                    "Analyze the costs of owning and operating equipment.",
                    "Select appropriate equipment for specific construction tasks."
                  ],
                  "chapters": [
                    {
                      "id": "ce_ch1",
                      "title": "Equipment Economics",
                      "topics": [
                        "Owning and Operating Costs",
                        "Depreciation",
                        "Economic Life"
                      ]
                    },
                    {
                      "id": "ce_ch2",
                      "title": "Earthmoving Equipment",
                      "topics": [
                        "Dozers and Scrapers",
                        "Excavators and Loaders",
                        "Compactors"
                      ]
                    },
                    {
                      "id": "ce_ch3",
                      "title": "Cranes and Lifting Equipment",
                      "topics": [
                        "Types of Cranes",
                        "Crane Capacity Charts",
                        "Lift Planning"
                      ]
                    },
                    {
                      "id": "ce_ch4",
                      "title": "Concrete and Asphalt Production",
                      "topics": [
                        "Concrete Batch Plants",
                        "Concrete Pumps",
                        "Asphalt Mixing Plants"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng4104",
                  "name": "Technical Report Writing & Research Methodology",
                  "description": "Develops skills in technical communication and scientific research methods. Prepares students for their final year thesis project by covering literature review, problem formulation, research design, data analysis, and report writing.",
                  "credits": 2,
                  "outcomes": [
                    "Formulate a research problem and objectives.",
                    "Conduct a comprehensive literature review.",
                    "Understand different research methodologies.",
                    "Write a clear, concise, and well-structured technical report."
                  ],
                  "chapters": [
                    {
                      "id": "trw_ch1",
                      "title": "Introduction to Research",
                      "topics": [
                        "Types of Research",
                        "The Research Process",
                        "Ethics in Research"
                      ]
                    },
                    {
                      "id": "trw_ch2",
                      "title": "Research Design",
                      "topics": [
                        "Problem Formulation",
                        "Literature Review",
                        "Data Collection Methods"
                      ]
                    },
                    {
                      "id": "trw_ch3",
                      "title": "Technical Writing",
                      "topics": [
                        "Structure of a Technical Report",
                        "Clarity, Conciseness, and Objectivity",
                        "Citations and Referencing"
                      ]
                    },
                    {
                      "id": "trw_ch4",
                      "title": "Proposal and Presentation",
                      "topics": [
                        "Writing a Research Proposal",
                        "Data Presentation (Tables, Figures)",
                        "Oral Presentation Skills"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng4106",
                  "name": "Foundation Engineering I",
                  "description": "Application of soil mechanics principles to the design of foundations. Focuses on bearing capacity and settlement analysis for shallow foundations (spread footings, strip footings, and mats).",
                  "credits": 3,
                  "prerequisites": [
                    "CEng3104"
                  ],
                  "outcomes": [
                    "Evaluate site and subsurface conditions for foundation design.",
                    "Calculate the ultimate bearing capacity of shallow foundations.",
                    "Estimate the settlement of shallow foundations.",
                    "Perform structural design of isolated and combined footings."
                  ],
                  "chapters": [
                    {
                      "id": "fe1_ch1",
                      "title": "Site Investigation",
                      "topics": [
                        "Subsurface Exploration Methods (Boring, SPT)",
                        "Geophysical Methods",
                        "Interpretation of Soil Reports"
                      ]
                    },
                    {
                      "id": "fe1_ch2",
                      "title": "Bearing Capacity of Shallow Foundations",
                      "topics": [
                        "Terzaghi's Bearing Capacity Theory",
                        "General Bearing Capacity Equation",
                        "Effect of Water Table"
                      ]
                    },
                    {
                      "id": "fe1_ch3",
                      "title": "Settlement of Shallow Foundations",
                      "topics": [
                        "Elastic (Immediate) Settlement",
                        "Consolidation Settlement Review",
                        "Allowable Settlement"
                      ]
                    },
                    {
                      "id": "fe1_ch4",
                      "title": "Design of Shallow Foundations",
                      "topics": [
                        "Design of Isolated and Wall Footings",
                        "Design of Combined Footings",
                        "Design of Mat Foundations"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng4108",
                  "name": "Reinforced Concrete Structures II",
                  "description": "Continuation of RC I. Covers the design of short and slender columns, two-way slabs, footings, and an introduction to retaining walls and torsion in beams.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng4107"
                  ],
                  "outcomes": [
                    "Design axially and eccentrically loaded short columns.",
                    "Analyze and design two-way slab systems.",
                    "Design isolated and combined footings.",
                    "Understand the design principles for slender columns."
                  ],
                  "chapters": [
                    {
                      "id": "rc2_ch1",
                      "title": "Design of Columns",
                      "topics": [
                        "Axially Loaded Short Columns",
                        "Interaction Diagrams",
                        "Design of Eccentrically Loaded Columns"
                      ]
                    },
                    {
                      "id": "rc2_ch2",
                      "title": "Slender Columns",
                      "topics": [
                        "Buckling and Slenderness Effects",
                        "Moment Magnification Method",
                        "Design of Slender Columns"
                      ]
                    },
                    {
                      "id": "rc2_ch3",
                      "title": "Two-Way Slabs",
                      "topics": [
                        "Behavior of Two-Way Slabs",
                        "Direct Design Method",
                        "Equivalent Frame Method"
                      ]
                    },
                    {
                      "id": "rc2_ch4",
                      "title": "Design of Footings and Retaining Walls",
                      "topics": [
                        "Design of Isolated and Combined Footings",
                        "Introduction to Cantilever Retaining Walls"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng4110",
                  "name": "Hydraulic Structures II",
                  "description": "Design of structures for irrigation and river control. Includes design of irrigation canals, canal regulation structures (head regulators, cross regulators), and cross drainage works.",
                  "credits": 2,
                  "prerequisites": [
                    "CEng4109"
                  ],
                  "outcomes": [
                    "Design stable irrigation canals.",
                    "Design canal headworks and regulation structures.",
                    "Select and design appropriate cross-drainage works.",
                    "Understand the principles of river training."
                  ],
                  "chapters": [
                    {
                      "id": "hs2_ch1",
                      "title": "Design of Irrigation Canals",
                      "topics": [
                        "Canal Alignment",
                        "Kennedy's and Lacey's Silt Theories",
                        "Lined Canals"
                      ]
                    },
                    {
                      "id": "hs2_ch2",
                      "title": "Canal Regulation Works",
                      "topics": [
                        "Head Regulators and Cross Regulators",
                        "Canal Falls and Escapes",
                        "Canal Outlets"
                      ]
                    },
                    {
                      "id": "hs2_ch3",
                      "title": "Cross Drainage Works",
                      "topics": [
                        "Types of Cross Drainage Works (Aqueducts, Siphons)",
                        "Selection of Suitable Type",
                        "Design Principles"
                      ]
                    },
                    {
                      "id": "hs2_ch4",
                      "title": "River Training and Control",
                      "topics": [
                        "River Behavior",
                        "Objectives of River Training",
                        "Methods of River Training (Groynes, Embankments)"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng4112",
                  "name": "Water Supply and Urban Drainage",
                  "description": "Planning and design of municipal water supply and urban drainage systems. Covers water demand estimation, design of distribution networks, and design of storm and sanitary sewer systems.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng2106",
                    "EnEng4105"
                  ],
                  "outcomes": [
                    "Estimate water demand for a community.",
                    "Design water distribution networks.",
                    "Design sanitary sewer systems.",
                    "Design storm sewer systems."
                  ],
                  "chapters": [
                    {
                      "id": "wsud_ch1",
                      "title": "Water Demand and Supply",
                      "topics": [
                        "Population Forecasting",
                        "Water Demand Estimation",
                        "Water Sources and Intake Structures"
                      ]
                    },
                    {
                      "id": "wsud_ch2",
                      "title": "Water Distribution Systems",
                      "topics": [
                        "Pipes, Valves, and Appurtenances",
                        "Layout of Distribution Networks",
                        "Hydraulic Analysis of Networks (Hardy Cross)"
                      ]
                    },
                    {
                      "id": "wsud_ch3",
                      "title": "Sanitary Sewer Systems",
                      "topics": [
                        "Wastewater Flow Estimation",
                        "Sewer Appurtenances (Manholes, Inlets)",
                        "Hydraulic Design of Sanitary Sewers"
                      ]
                    },
                    {
                      "id": "wsud_ch4",
                      "title": "Stormwater Drainage",
                      "topics": [
                        "Rainfall Analysis and Rational Method",
                        "Hydraulic Design of Storm Sewers",
                        "Introduction to Low Impact Development (LID)"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng4114",
                  "name": "Procurement and Contract Administration",
                  "description": "Examines the legal and administrative aspects of construction projects. Covers procurement methods, bidding processes, contract types, contract documents, and contract administration, including claims and dispute resolution.",
                  "credits": 2,
                  "prerequisites": [
                    "CEng4111"
                  ],
                  "outcomes": [
                    "Understand different project delivery and procurement methods.",
                    "Analyze construction contract documents.",
                    "Manage contract administration processes during construction.",
                    "Recognize common causes of claims and disputes."
                  ],
                  "chapters": [
                    {
                      "id": "pca_ch1",
                      "title": "Procurement and Bidding",
                      "topics": [
                        "Project Delivery Methods",
                        "Bidding and Award Process",
                        "Pre-qualification of Bidders"
                      ]
                    },
                    {
                      "id": "pca_ch2",
                      "title": "Construction Contracts",
                      "topics": [
                        "Contract Types (Lump Sum, Unit Price, Cost Plus)",
                        "Contract Documents (Agreement, Conditions, Drawings, Specs)",
                        "Standard Contract Forms (FIDIC, PPA)"
                      ]
                    },
                    {
                      "id": "pca_ch3",
                      "title": "Contract Administration",
                      "topics": [
                        "Roles of Parties (Owner, Engineer, Contractor)",
                        "Submittals, Payments, and Change Orders",
                        "Time Extensions and Liquidated Damages"
                      ]
                    },
                    {
                      "id": "pca_ch4",
                      "title": "Claims and Dispute Resolution",
                      "topics": [
                        "Types of Claims",
                        "Dispute Resolution Methods (Negotiation, Mediation, Arbitration)",
                        "Contract Closeout"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng4116",
                  "name": "Engineering Economics",
                  "description": "Principles of economic analysis for engineering projects. Covers concepts of time value of money, comparison of alternatives (present worth, annual worth, rate of return), depreciation, and benefit-cost analysis.",
                  "credits": 2,
                  "outcomes": [
                    "Apply time value of money concepts to engineering problems.",
                    "Evaluate and compare engineering project alternatives.",
                    "Perform depreciation and after-tax economic analysis.",
                    "Conduct benefit-cost analysis for public projects."
                  ],
                  "chapters": [
                    {
                      "id": "ee_ch1",
                      "title": "Time Value of Money",
                      "topics": [
                        "Interest and Equivalence",
                        "Single Payment, Uniform Series, Gradient Series",
                        "Nominal and Effective Interest Rates"
                      ]
                    },
                    {
                      "id": "ee_ch2",
                      "title": "Comparing Alternatives",
                      "topics": [
                        "Present Worth Analysis",
                        "Annual Worth Analysis",
                        "Rate of Return Analysis"
                      ]
                    },
                    {
                      "id": "ee_ch3",
                      "title": "Depreciation and Taxes",
                      "topics": [
                        "Depreciation Methods",
                        "After-Tax Economic Analysis"
                      ]
                    },
                    {
                      "id": "ee_ch4",
                      "title": "Benefit-Cost Analysis and Risk",
                      "topics": [
                        "Benefit-Cost Ratio for Public Projects",
                        "Breakeven Analysis",
                        "Introduction to Decision Making under Risk"
                      ]
                    }
                  ]
                }
              ],
              "Semester III (Summer)": [
                {
                  "code": "CEng4118",
                  "name": "Internship Practice",
                  "description": "A supervised, full-time practical work experience in a civil engineering related organization (consulting firm, contractor, or government agency). Students apply academic knowledge to real-world problems and submit a comprehensive report on their experience.",
                  "credits": 0,
                  "outcomes": [
                    "Gain practical experience in a professional engineering environment.",
                    "Develop professional skills like teamwork, communication, and problem-solving.",
                    "Bridge the gap between theory and practice.",
                    "Enhance career awareness and professional networking."
                  ],
                  "chapters": []
                }
              ]
            },
            "Year 5": {
              "Semester I": [
                {
                  "code": "CEng5101",
                  "name": "BSc thesis I (Proposal Preparation)",
                  "description": "The first phase of the final year thesis project. Students work with a faculty advisor to identify a research topic, conduct a literature review, define the scope and methodology, and write a detailed research proposal.",
                  "credits": 1,
                  "prerequisites": [
                    "CEng4104"
                  ],
                  "outcomes": [
                    "Identify a relevant civil engineering research topic.",
                    "Formulate clear research questions and objectives.",
                    "Develop a sound research methodology.",
                    "Write a high-quality, defensible research proposal."
                  ],
                  "chapters": []
                },
                {
                  "code": "CEng5103",
                  "name": "Integrated Civil Engineering Design",
                  "description": "A capstone design project that requires students to work in teams to design a comprehensive civil engineering project (e.g., a land development project, a small bridge, a water treatment facility). Integrates knowledge from multiple sub-disciplines.",
                  "credits": 3,
                  "outcomes": [
                    "Apply integrated design principles to a complex project.",
                    "Produce a professional set of design calculations and drawings.",
                    "Consider real-world constraints like economics, environment, and ethics.",
                    "Present and defend the design to a panel of faculty."
                  ],
                  "chapters": []
                },
                {
                  "code": "CEng5105",
                  "name": "Railway Engineering",
                  "description": "Introduction to the planning, design, construction, and maintenance of railway systems. Covers track components, geometric design, track stresses, and an overview of railway operations.",
                  "credits": 2,
                  "prerequisites": [
                    "CEng3102"
                  ],
                  "outcomes": [
                    "Identify the components of a railway track structure.",
                    "Understand the principles of railway geometric design.",
                    "Analyze stresses in rails and sleepers.",
                    "Describe basic railway construction and maintenance practices."
                  ],
                  "chapters": [
                    {
                      "id": "re_ch1",
                      "title": "Introduction to Railways",
                      "topics": [
                        "History and Advantages",
                        "Railway System Components",
                        "Track Gauge"
                      ]
                    },
                    {
                      "id": "re_ch2",
                      "title": "Track Components",
                      "topics": [
                        "Rails",
                        "Sleepers (Ties)",
                        "Ballast and Formation",
                        "Fastenings"
                      ]
                    },
                    {
                      "id": "re_ch3",
                      "title": "Geometric Design",
                      "topics": [
                        "Alignment, Gradients, and Curves",
                        "Superelevation (Cant)",
                        "Points and Crossings (Turnouts)"
                      ]
                    },
                    {
                      "id": "re_ch4",
                      "title": "Track Stresses, Construction, and Maintenance",
                      "topics": [
                        "Stresses in Track",
                        "Track Construction",
                        "Track Maintenance"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng5107",
                  "name": "Foundation Engineering II",
                  "description": "Advanced topics in foundation engineering, focusing on the design of deep foundations (piles and drilled shafts) and earth retaining structures (retaining walls and sheet piles).",
                  "credits": 2,
                  "prerequisites": [
                    "CEng4106"
                  ],
                  "outcomes": [
                    "Calculate the capacity of single piles and pile groups.",
                    "Design deep foundations for axial and lateral loads.",
                    "Analyze the stability of gravity and cantilever retaining walls.",
                    "Design anchored sheet pile walls."
                  ],
                  "chapters": [
                    {
                      "id": "fe2_ch1",
                      "title": "Deep Foundations: Piles",
                      "topics": [
                        "Types of Piles",
                        "Load Capacity of Single Piles (Static formulas, Pile driving formulas)",
                        "Pile Groups"
                      ]
                    },
                    {
                      "id": "fe2_ch2",
                      "title": "Lateral Earth Pressure",
                      "topics": [
                        "At-Rest, Active, and Passive Pressures",
                        "Rankine and Coulomb Theories"
                      ]
                    },
                    {
                      "id": "fe2_ch3",
                      "title": "Retaining Walls",
                      "topics": [
                        "Types of Retaining Walls",
                        "Stability Analysis of Gravity and Cantilever Walls",
                        "Design of Retaining Walls"
                      ]
                    },
                    {
                      "id": "fe2_ch4",
                      "title": "Sheet Pile Walls",
                      "topics": [
                        "Cantilever Sheet Piles",
                        "Anchored Sheet Piles (Free-earth support method)"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng5109",
                  "name": "Structural Design",
                  "description": "A comprehensive structural design course that integrates the design of steel and concrete elements into a complete building system. Focuses on load path determination, modeling, and design of a multi-story building.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng4108",
                    "CEng5111"
                  ],
                  "outcomes": [
                    "Determine design loads (dead, live, wind, seismic) for a building.",
                    "Develop a viable structural system for a multi-story building.",
                    "Design key structural members (beams, columns, slabs) in both steel and concrete.",
                    "Prepare representative structural drawings."
                  ],
                  "chapters": []
                },
                {
                  "code": "CEng5111",
                  "name": "Steel & Timber Structures",
                  "description": "Design of structural members and connections using steel and timber. Covers design of tension and compression members, beams, beam-columns, and bolted/welded connections for steel, and design of timber beams and columns.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng3106"
                  ],
                  "outcomes": [
                    "Design steel tension and compression members.",
                    "Design steel beams and beam-columns.",
                    "Design simple bolted and welded steel connections.",
                    "Design basic timber beams and columns."
                  ],
                  "chapters": [
                    {
                      "id": "sts_ch1",
                      "title": "Introduction to Steel Design",
                      "topics": [
                        "Steel Properties and Shapes",
                        "Design Philosophies (ASD, LRFD)",
                        "Design Loads"
                      ]
                    },
                    {
                      "id": "sts_ch2",
                      "title": "Design of Steel Members",
                      "topics": [
                        "Tension Members",
                        "Compression Members (Columns)",
                        "Beams (Flexure and Shear)",
                        "Beam-Columns"
                      ]
                    },
                    {
                      "id": "sts_ch3",
                      "title": "Design of Steel Connections",
                      "topics": [
                        "Bolted Connections (Shear and Tension)",
                        "Welded Connections (Fillet and Groove Welds)",
                        "Simple Shear Connections"
                      ]
                    },
                    {
                      "id": "sts_ch4",
                      "title": "Design of Timber Structures",
                      "topics": [
                        "Properties of Wood",
                        "Design of Timber Beams",
                        "Design of Timber Columns"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng5113",
                  "name": "Irrigation Engineering",
                  "description": "Principles of irrigation and drainage for agriculture. Covers soil-water-plant relationships, estimation of crop water requirements, and the design and evaluation of surface and pressurized irrigation systems.",
                  "credits": 2,
                  "prerequisites": [
                    "CEng3108"
                  ],
                  "outcomes": [
                    "Estimate crop water requirements.",
                    "Understand soil-water-plant relationships.",
                    "Design surface irrigation systems (border, furrow).",
                    "Understand the principles of sprinkler and drip irrigation systems."
                  ],
                  "chapters": [
                    {
                      "id": "ie_ch1",
                      "title": "Soil-Water-Plant Relationship",
                      "topics": [
                        "Soil Water",
                        "Plant Water Needs",
                        "Evapotranspiration"
                      ]
                    },
                    {
                      "id": "ie_ch2",
                      "title": "Irrigation Water Requirements",
                      "topics": [
                        "Crop Water Requirements",
                        "Irrigation Efficiencies",
                        "Irrigation Scheduling"
                      ]
                    },
                    {
                      "id": "ie_ch3",
                      "title": "Surface Irrigation",
                      "topics": [
                        "Border Irrigation",
                        "Furrow Irrigation",
                        "Basin Irrigation"
                      ]
                    },
                    {
                      "id": "ie_ch4",
                      "title": "Pressurized Irrigation",
                      "topics": [
                        "Sprinkler Irrigation Systems",
                        "Drip (Trickle) Irrigation Systems",
                        "Agricultural Drainage"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "CEng5102",
                  "name": "BSc thesis II (Main Research)",
                  "description": "The second and final phase of the thesis project. Students execute the research plan from their proposal, collect and analyze data, draw conclusions, and write the final thesis document. The work culminates in a final oral defense.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng5101"
                  ],
                  "outcomes": [
                    "Execute an independent research project.",
                    "Analyze and interpret research data.",
                    "Synthesize findings and draw valid conclusions.",
                    "Produce a comprehensive thesis document and defend it orally."
                  ],
                  "chapters": []
                },
                {
                  "code": "CEng5106",
                  "name": "Construction Management",
                  "description": "Principles of managing construction projects. Covers project planning, scheduling (CPM), cost control, quality management, safety management, and resource allocation.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng4114"
                  ],
                  "outcomes": [
                    "Develop a construction project plan.",
                    "Create and analyze a Critical Path Method (CPM) schedule.",
                    "Understand principles of construction cost and quality control.",
                    "Recognize the importance of safety management on construction sites."
                  ],
                  "chapters": [
                    {
                      "id": "cmgt_ch1",
                      "title": "Project Planning",
                      "topics": [
                        "Project Life Cycle",
                        "Work Breakdown Structure (WBS)",
                        "Organizational Structures"
                      ]
                    },
                    {
                      "id": "cmgt_ch2",
                      "title": "Project Scheduling",
                      "topics": [
                        "Bar Charts",
                        "Critical Path Method (CPM)",
                        "Resource Allocation and Leveling"
                      ]
                    },
                    {
                      "id": "cmgt_ch3",
                      "title": "Cost and Quality Management",
                      "topics": [
                        "Cost Estimation and Budgeting",
                        "Cost Control",
                        "Quality Assurance / Quality Control (QA/QC)"
                      ]
                    },
                    {
                      "id": "cmgt_ch4",
                      "title": "Safety and Risk Management",
                      "topics": [
                        "Construction Safety Principles",
                        "Risk Identification and Analysis"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng5112",
                  "name": "Fundamental of Bridge Design",
                  "description": "Introduction to the analysis and design of bridges. Covers bridge types, standard loads (AASHTO), load distribution, and the design of bridge superstructures (slabs and girders) and substructures (piers and abutments).",
                  "credits": 3,
                  "prerequisites": [
                    "CEng4108",
                    "CEng5111"
                  ],
                  "outcomes": [
                    "Identify different types of bridges and their applications.",
                    "Apply AASHTO live loads to bridge structures.",
                    "Perform preliminary design of a bridge superstructure.",
                    "Understand the design considerations for bridge substructures."
                  ],
                  "chapters": [
                    {
                      "id": "fbd_ch1",
                      "title": "Introduction to Bridges",
                      "topics": [
                        "Bridge Types and Components",
                        "Bridge Materials",
                        "Site Selection and Hydraulics"
                      ]
                    },
                    {
                      "id": "fbd_ch2",
                      "title": "Bridge Loads",
                      "topics": [
                        "Dead Loads",
                        "AASHTO Live Loads (Truck, Tandem, Lane)",
                        "Load Combinations"
                      ]
                    },
                    {
                      "id": "fbd_ch3",
                      "title": "Superstructure Design",
                      "topics": [
                        "Load Distribution to Girders",
                        "Design of RC Slab Bridges",
                        "Design of RC T-Beam/Girder Bridges"
                      ]
                    },
                    {
                      "id": "fbd_ch4",
                      "title": "Substructure Design",
                      "topics": [
                        "Design of Piers",
                        "Design of Abutments",
                        "Introduction to Bearings"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng5114",
                  "name": "Waste Water and Solid Waste Treatment",
                  "description": "Detailed study of the design of wastewater treatment plants and solid waste management facilities. Covers physical, chemical, and biological treatment processes, sludge management, and landfill design.",
                  "credits": 2,
                  "prerequisites": [
                    "EnEng4105"
                  ],
                  "outcomes": [
                    "Design primary and secondary wastewater treatment units.",
                    "Understand sludge treatment and disposal methods.",
                    "Design a modern sanitary landfill.",
                    "Analyze options for solid waste resource recovery."
                  ],
                  "chapters": [
                    {
                      "id": "wwt_ch1",
                      "title": "Wastewater Characterization and Primary Treatment",
                      "topics": [
                        "Wastewater Characteristics",
                        "Screening and Grit Removal",
                        "Primary Clarifier Design"
                      ]
                    },
                    {
                      "id": "wwt_ch2",
                      "title": "Biological (Secondary) Treatment",
                      "topics": [
                        "Activated Sludge Process Design",
                        "Trickling Filters",
                        "Secondary Clarifiers"
                      ]
                    },
                    {
                      "id": "wwt_ch3",
                      "title": "Sludge and Tertiary Treatment",
                      "topics": [
                        "Sludge Thickening and Digestion",
                        "Nutrient Removal (Nitrogen, Phosphorus)",
                        "Disinfection"
                      ]
                    },
                    {
                      "id": "wwt_ch4",
                      "title": "Solid Waste Treatment and Disposal",
                      "topics": [
                        "Sanitary Landfill Design",
                        "Leachate and Gas Management",
                        "Composting and Incineration"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng52XX",
                  "name": "Elective I",
                  "description": "Students select one specialized course from a list of approved technical electives to deepen their knowledge in a specific area of civil engineering. Choices include: Highway Engineering III (CEng5204), Tunneling (CEng5206), Reinforced Concrete structures III (CEng5210), Water Resource Development (CEng5212), Geographic Information System (GIS) (CEng5214), or Building Information Modelling (BIM) (CEng5216).",
                  "credits": 2,
                  "outcomes": [
                    "Gain in-depth knowledge in a chosen sub-discipline.",
                    "Apply advanced concepts to solve complex engineering problems.",
                    "Explore current trends and technologies in a specialized field."
                  ],
                  "chapters": []
                }
              ]
            }
          }
        },
        {
          "name": "Software Engineering",
          "abbreviation": "SWEG",
          "coursesByYearSemester": {
            "Year 2": {
              "Semester I": [
                {
                  "code": "SWEG2101",
                  "name": "Introduction to Software Engineering and Computing",
                  "description": "An overview of the software development lifecycle, methodologies (like Agile and Waterfall), and the profession of software engineering, including ethical responsibilities.",
                  "credits": 3,
                  "outcomes": [
                    "Understand the fundamental stages of the software development lifecycle.",
                    "Compare and contrast different software process models.",
                    "Recognize the roles and responsibilities of a software engineer.",
                    "Appreciate the ethical and professional issues in computing."
                  ],
                  "chapters": [
                    {
                      "id": "isec_ch1",
                      "title": "The Software Process",
                      "topics": [
                        "Software Engineering as a discipline",
                        "The Software Development Lifecycle (SDLC)",
                        "Process Models: Waterfall, Incremental, Spiral"
                      ]
                    },
                    {
                      "id": "isec_ch2",
                      "title": "Agile Methodologies",
                      "topics": [
                        "The Agile Manifesto",
                        "Scrum: Roles, Events, Artifacts",
                        "Extreme Programming (XP)"
                      ]
                    },
                    {
                      "id": "isec_ch3",
                      "title": "Core Engineering Activities",
                      "topics": [
                        "Introduction to Requirements Engineering",
                        "Introduction to Software Design",
                        "Introduction to Testing",
                        "Introduction to Maintenance"
                      ]
                    },
                    {
                      "id": "isec_ch4",
                      "title": "The Engineering Profession",
                      "topics": [
                        "Professional and Ethical Responsibility",
                        "Intellectual Property",
                        "Teamwork and Collaboration"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG2103",
                  "name": "Fundamentals of Programming I",
                  "description": "Introduction to programming using a procedural language like C++. Covers fundamental concepts such as variables, control flow, functions, arrays, and basic problem-solving techniques.",
                  "credits": 4,
                  "outcomes": [
                    "Write, compile, and debug simple programs.",
                    "Use fundamental programming constructs like variables, loops, and conditionals.",
                    "Decompose problems into smaller, manageable parts using functions.",
                    "Use arrays to store and manipulate collections of data."
                  ],
                  "chapters": [
                    {
                      "id": "fp1_ch1",
                      "title": "Introduction to Programming",
                      "topics": [
                        "Programming Languages",
                        "Development Environment Setup",
                        "Basic Syntax and Structure"
                      ]
                    },
                    {
                      "id": "fp1_ch2",
                      "title": "Variables and Control Flow",
                      "topics": [
                        "Data Types (int, float, char)",
                        "Conditional Statements (if, else, switch)",
                        "Loops (for, while, do-while)"
                      ]
                    },
                    {
                      "id": "fp1_ch3",
                      "title": "Functions",
                      "topics": [
                        "Defining and Calling Functions",
                        "Parameters and Return Values",
                        "Scope and Lifetime of Variables"
                      ]
                    },
                    {
                      "id": "fp1_ch4",
                      "title": "Arrays and Pointers",
                      "topics": [
                        "Declaring and Initializing Arrays",
                        "Multi-dimensional Arrays",
                        "Introduction to Pointers"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG2105",
                  "name": "Discrete Mathematics for Software Engineering",
                  "description": "Fundamental mathematical concepts required for computer science, including logic, sets, relations, functions, counting principles, and graph theory.",
                  "credits": 3,
                  "outcomes": [
                    "Apply propositional and predicate logic to formalize arguments.",
                    "Use set theory, relations, and functions to model computational problems.",
                    "Apply counting principles to analyze algorithm complexity.",
                    "Use graph theory to model and solve network-related problems."
                  ],
                  "chapters": [
                    {
                      "id": "dm_ch1",
                      "title": "Logic and Proofs",
                      "topics": [
                        "Propositional Logic and Truth Tables",
                        "Logical Equivalence",
                        "Predicate Logic and Quantifiers",
                        "Rules of Inference and Proof Techniques"
                      ]
                    },
                    {
                      "id": "dm_ch2",
                      "title": "Set Theory, Functions, and Relations",
                      "topics": [
                        "Sets and Set Operations",
                        "Functions (Injective, Surjective, Bijective)",
                        "Relations and their Properties",
                        "Equivalence Relations"
                      ]
                    },
                    {
                      "id": "dm_ch3",
                      "title": "Counting and Combinatorics",
                      "topics": [
                        "The Pigeonhole Principle",
                        "Permutations and Combinations",
                        "Recurrence Relations"
                      ]
                    },
                    {
                      "id": "dm_ch4",
                      "title": "Graph Theory",
                      "topics": [
                        "Graph Terminology and Representation",
                        "Connectivity, Paths, and Circuits",
                        "Eulerian and Hamiltonian Paths",
                        "Introduction to Trees"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "SWEG2102",
                  "name": "Fundamentals of Programming II",
                  "description": "Builds on Programming I, introducing object-oriented concepts, fundamental data structures, memory management, and file I/O.",
                  "credits": 4,
                  "prerequisites": [
                    "SWEG2103"
                  ],
                  "outcomes": [
                    "Apply object-oriented principles like encapsulation.",
                    "Implement and use fundamental data structures like linked lists.",
                    "Manage memory using dynamic allocation.",
                    "Perform file input and output operations."
                  ],
                  "chapters": [
                    {
                      "id": "fp2_ch1",
                      "title": "Introduction to Object-Oriented Programming",
                      "topics": [
                        "Structures and Classes",
                        "Objects, Methods, and Member Variables",
                        "Constructors and Destructors",
                        "The 'this' pointer"
                      ]
                    },
                    {
                      "id": "fp2_ch2",
                      "title": "Dynamic Memory Management",
                      "topics": [
                        "Pointers and Memory",
                        "Dynamic Memory Allocation (new, delete)",
                        "Common Memory Errors"
                      ]
                    },
                    {
                      "id": "fp2_ch3",
                      "title": "File I/O and Exception Handling",
                      "topics": [
                        "Streams and File Operations",
                        "Reading from and Writing to Files",
                        "Introduction to Exception Handling (try, catch)"
                      ]
                    },
                    {
                      "id": "fp2_ch4",
                      "title": "Basic Data Structures",
                      "topics": [
                        "Implementing a Dynamic Array (Vector)",
                        "Singly Linked Lists",
                        "Introduction to Stacks and Queues"
                      ]
                    }
                  ]
                },
                {
                  "code": "EEng2004",
                  "name": "Digital Logic Design",
                  "description": "Fundamentals of digital circuits, Boolean algebra, combinational and sequential logic design. Forms the hardware foundation for understanding computer architecture.",
                  "credits": 3,
                  "outcomes": [
                    "Apply Boolean algebra and K-maps to simplify logic expressions.",
                    "Design and analyze combinational logic circuits.",
                    "Design and analyze sequential logic circuits like counters and registers.",
                    "Understand the building blocks of digital computers."
                  ],
                  "chapters": [
                    {
                      "id": "dld_ch1",
                      "title": "Number Systems and Boolean Algebra",
                      "topics": [
                        "Binary, Octal, Hexadecimal Systems",
                        "Logic Gates",
                        "Boolean Algebra and De Morgan's Theorems"
                      ]
                    },
                    {
                      "id": "dld_ch2",
                      "title": "Combinational Logic Design",
                      "topics": [
                        "Karnaugh Maps (K-maps)",
                        "Adders, Subtractors, Decoders, Multiplexers",
                        "HDL for Combinational Circuits"
                      ]
                    },
                    {
                      "id": "dld_ch3",
                      "title": "Sequential Logic",
                      "topics": [
                        "Latches and Flip-Flops (SR, D, JK, T)",
                        "Analysis of Clocked Sequential Circuits",
                        "State Reduction and Assignment"
                      ]
                    },
                    {
                      "id": "dld_ch4",
                      "title": "Registers and Counters",
                      "topics": [
                        "Registers and Shift Registers",
                        "Ripple Counters",
                        "Synchronous Counters"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG2106",
                  "name": "Data Communication and Computer Networks",
                  "description": "Introduction to network protocols, layered architectures (OSI, TCP/IP), data transmission, and key concepts of data communication.",
                  "credits": 3,
                  "outcomes": [
                    "Explain the function of each layer in the OSI and TCP/IP models.",
                    "Understand the basics of signal encoding and data transmission.",
                    "Describe how IP addressing and basic routing work.",
                    "Differentiate between TCP and UDP protocols."
                  ],
                  "chapters": [
                    {
                      "id": "dccn_ch1",
                      "title": "Introduction to Networks",
                      "topics": [
                        "Network Topologies",
                        "OSI Model",
                        "TCP/IP Protocol Suite"
                      ]
                    },
                    {
                      "id": "dccn_ch2",
                      "title": "Physical and Data Link Layers",
                      "topics": [
                        "Data and Signals",
                        "Transmission Media",
                        "Error Detection and Correction",
                        "MAC Protocols (Ethernet)"
                      ]
                    },
                    {
                      "id": "dccn_ch3",
                      "title": "Network Layer",
                      "topics": [
                        "IP Addressing (IPv4, Subnetting)",
                        "Address Resolution Protocol (ARP)",
                        "Routing Algorithms (Distance Vector, Link State)"
                      ]
                    },
                    {
                      "id": "dccn_ch4",
                      "title": "Transport and Application Layers",
                      "topics": [
                        "UDP Protocol",
                        "TCP Protocol (Flow control, Congestion control)",
                        "Application Layer Protocols (HTTP, DNS, FTP)"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG2108",
                  "name": "Database Systems",
                  "description": "Introduction to database design, relational models, SQL, and normalization. Covers both theoretical concepts and practical application.",
                  "credits": 4,
                  "outcomes": [
                    "Design a relational database schema using ER modeling.",
                    "Write complex SQL queries to retrieve and manipulate data.",
                    "Apply normalization principles to reduce data redundancy.",
                    "Understand the role of a DBMS in managing data."
                  ],
                  "chapters": [
                    {
                      "id": "dbs_ch1",
                      "title": "Introduction to Databases",
                      "topics": [
                        "Database Systems vs. File Systems",
                        "Database Architecture",
                        "Data Models"
                      ]
                    },
                    {
                      "id": "dbs_ch2",
                      "title": "Relational Model and ER Diagrams",
                      "topics": [
                        "Relational Algebra",
                        "Entity-Relationship (ER) Modeling",
                        "Mapping ER Diagrams to Relational Schemas"
                      ]
                    },
                    {
                      "id": "dbs_ch3",
                      "title": "Structured Query Language (SQL)",
                      "topics": [
                        "Data Definition Language (DDL)",
                        "Data Manipulation Language (DML)",
                        "Joins, Subqueries, and Aggregate Functions"
                      ]
                    },
                    {
                      "id": "dbs_ch4",
                      "title": "Database Design and Normalization",
                      "topics": [
                        "Functional Dependencies",
                        "Normalization Forms (1NF, 2NF, 3NF, BCNF)",
                        "Introduction to Transaction Management"
                      ]
                    }
                  ]
                },
                {
                  "code": "Stat2091",
                  "name": "Probability and Statistics",
                  "description": "Statistical methods and probability theory with applications in software engineering, data analysis, and performance evaluation.",
                  "credits": 3,
                  "outcomes": [
                    "Apply probability theory to model uncertain events.",
                    "Analyze data using descriptive and inferential statistics.",
                    "Perform hypothesis testing to make data-driven decisions.",
                    "Understand the fundamentals of linear regression."
                  ],
                  "chapters": [
                    {
                      "id": "ps_ch1",
                      "title": "Probability",
                      "topics": [
                        "Sample Spaces, Events",
                        "Axioms of Probability",
                        "Conditional Probability and Bayes' Theorem"
                      ]
                    },
                    {
                      "id": "ps_ch2",
                      "title": "Random Variables and Distributions",
                      "topics": [
                        "Discrete and Continuous Random Variables",
                        "Common Distributions (Binomial, Poisson, Normal, Exponential)",
                        "Expected Value and Variance"
                      ]
                    },
                    {
                      "id": "ps_ch3",
                      "title": "Statistical Inference",
                      "topics": [
                        "Sampling Distributions and the Central Limit Theorem",
                        "Confidence Intervals",
                        "Hypothesis Testing (t-tests, chi-squared tests)"
                      ]
                    },
                    {
                      "id": "ps_ch4",
                      "title": "Regression",
                      "topics": [
                        "Simple Linear Regression",
                        "Correlation Coefficient",
                        "Goodness of Fit"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 3": {
              "Semester I": [
                {
                  "code": "SWEG3101",
                  "name": "Object Oriented Programming",
                  "description": "In-depth study of OOP principles including inheritance, polymorphism, and design patterns using languages like Java or C++.",
                  "credits": 4,
                  "prerequisites": [
                    "SWEG2102"
                  ],
                  "outcomes": [
                    "Effectively use inheritance and polymorphism to create flexible and reusable code.",
                    "Design and implement solutions using abstract classes and interfaces.",
                    "Apply fundamental design patterns to solve common software design problems.",
                    "Develop robust applications with proper exception handling and generics."
                  ],
                  "chapters": [
                    {
                      "id": "oop_ch1",
                      "title": "Core OOP Concepts",
                      "topics": [
                        "Review of Classes and Objects",
                        "Inheritance and Method Overriding",
                        "Polymorphism (Virtual Functions)",
                        "Abstract Classes and Interfaces"
                      ]
                    },
                    {
                      "id": "oop_ch2",
                      "title": "Advanced Features",
                      "topics": [
                        "Exception Handling",
                        "Generics and Templates",
                        "Collections Framework / Standard Template Library (STL)"
                      ]
                    },
                    {
                      "id": "oop_ch3",
                      "title": "Introduction to Design Patterns",
                      "topics": [
                        "Creational Patterns (Singleton, Factory)",
                        "Structural Patterns (Adapter, Decorator)",
                        "Behavioral Patterns (Observer, Strategy)"
                      ]
                    },
                    {
                      "id": "oop_ch4",
                      "title": "Object-Oriented Design Principles",
                      "topics": [
                        "SOLID Principles",
                        "Coupling and Cohesion",
                        "Object-Oriented Case Study"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG3103",
                  "name": "Data Structure and Algorithms",
                  "description": "A fundamental course on the design, analysis, and implementation of data structures and algorithms. Topics include lists, stacks, queues, trees, graphs, sorting, and searching.",
                  "credits": 4,
                  "duration": "16 weeks",
                  "instructor": "Dr. A. Turing",
                  "prerequisites": [
                    "SWEG2102",
                    "SWEG2105"
                  ],
                  "outcomes": [
                    "Analyze the asymptotic performance of algorithms.",
                    "Implement and use major data structures including lists, stacks, queues, trees, and graphs.",
                    "Apply appropriate algorithms to solve computational problems.",
                    "Understand the trade-offs between different data structures and algorithms."
                  ],
                  "chapters": [
                    {
                      "id": "dsa_ch1",
                      "title": "Introduction and Analysis",
                      "description": "Fundamentals of algorithm analysis and complexity.",
                      "duration": 180,
                      "topics": [
                        "Asymptotic Notation (Big O, Omega, Theta)",
                        "Time and Space Complexity",
                        "Recursion Analysis"
                      ]
                    },
                    {
                      "id": "dsa_ch2",
                      "title": "Linear Data Structures",
                      "description": "Exploring sequential data organization.",
                      "duration": 240,
                      "topics": [
                        "Arrays and Dynamic Arrays",
                        "Linked Lists (Singly, Doubly)",
                        "Stacks and their applications",
                        "Queues (Linear, Circular)"
                      ]
                    },
                    {
                      "id": "dsa_ch3",
                      "title": "Non-Linear Data Structures: Trees",
                      "description": "Hierarchical data structures.",
                      "duration": 300,
                      "topics": [
                        "Binary Trees",
                        "Binary Search Trees (BST)",
                        "AVL Trees",
                        "Heaps and Priority Queues"
                      ]
                    },
                    {
                      "id": "dsa_ch4",
                      "title": "Non-Linear Data Structures: Graphs",
                      "description": "Representing and traversing networked data.",
                      "duration": 300,
                      "topics": [
                        "Graph Representation (Adjacency Matrix, Adjacency List)",
                        "Breadth-First Search (BFS)",
                        "Depth-First Search (DFS)",
                        "Topological Sort"
                      ]
                    },
                    {
                      "id": "dsa_ch5",
                      "title": "Sorting and Searching Algorithms",
                      "description": "Core algorithms for ordering and finding data.",
                      "duration": 240,
                      "topics": [
                        "Bubble Sort, Insertion Sort, Selection Sort",
                        "Merge Sort, Quick Sort",
                        "Heap Sort",
                        "Linear Search, Binary Search"
                      ]
                    },
                    {
                      "id": "dsa_ch6",
                      "title": "Hashing",
                      "description": "Techniques for efficient data retrieval.",
                      "duration": 180,
                      "topics": [
                        "Hash Functions",
                        "Collision Resolution (Chaining, Open Addressing)",
                        "Hash Tables"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG3105",
                  "name": "Computer Organization and Architecture",
                  "description": "Study of computer hardware components, instruction set architecture, CPU datapath, control unit, memory hierarchy, and performance.",
                  "credits": 3,
                  "prerequisites": [
                    "EEng2004"
                  ],
                  "outcomes": [
                    "Understand the relationship between hardware and software.",
                    "Explain the fetch-decode-execute cycle and CPU pipelining.",
                    "Analyze the performance impact of memory hierarchies (caches).",
                    "Describe how I/O devices interact with the CPU and memory."
                  ],
                  "chapters": [
                    {
                      "id": "coa_ch1",
                      "title": "Instruction Set Architecture (ISA)",
                      "topics": [
                        "Computer Abstractions and Technology",
                        "MIPS/RISC-V Instruction Set",
                        "Translating C/Java to Machine Language"
                      ]
                    },
                    {
                      "id": "coa_ch2",
                      "title": "Processor Design",
                      "topics": [
                        "Logic Design for Datapath",
                        "Single-Cycle and Multi-Cycle Datapath",
                        "Control Unit Design"
                      ]
                    },
                    {
                      "id": "coa_ch3",
                      "title": "Pipelining",
                      "topics": [
                        "Pipelined Datapath and Control",
                        "Data Hazards and Forwarding",
                        "Control Hazards and Branch Prediction"
                      ]
                    },
                    {
                      "id": "coa_ch4",
                      "title": "Memory Hierarchy",
                      "topics": [
                        "Caches (Direct Mapped, Set Associative)",
                        "Cache Performance",
                        "Virtual Memory and Paging"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG3107",
                  "name": "Internet Programming I",
                  "description": "Client-side web development using modern standards. Covers HTML5, CSS3 for styling and layout, and JavaScript for interactivity and dynamic content.",
                  "credits": 3,
                  "outcomes": [
                    "Create well-structured and semantic web pages using HTML5.",
                    "Style web pages using CSS3, including responsive design with Flexbox and Grid.",
                    "Manipulate the Document Object Model (DOM) with JavaScript.",
                    "Use asynchronous JavaScript (AJAX/Fetch API) to communicate with servers."
                  ],
                  "chapters": [
                    {
                      "id": "ip1_ch1",
                      "title": "HTML5",
                      "topics": [
                        "Document Structure",
                        "Semantic Tags",
                        "Forms and Input Validation"
                      ]
                    },
                    {
                      "id": "ip1_ch2",
                      "title": "CSS3",
                      "topics": [
                        "Selectors and the Cascade",
                        "Box Model",
                        "Layout with Flexbox and Grid",
                        "Responsive Design and Media Queries"
                      ]
                    },
                    {
                      "id": "ip1_ch3",
                      "title": "Core JavaScript",
                      "topics": [
                        "Variables, Data Types, and Operators",
                        "Functions and Scope",
                        "ES6+ Features (Arrow Functions, let/const)"
                      ]
                    },
                    {
                      "id": "ip1_ch4",
                      "title": "JavaScript in the Browser",
                      "topics": [
                        "DOM Manipulation and Events",
                        "Asynchronous JavaScript (Callbacks, Promises, Async/Await)",
                        "Using the Fetch API for AJAX"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG3109",
                  "name": "System Analysis and Modeling",
                  "description": "Techniques for analyzing and modeling software systems using UML. Focuses on bridging the gap between requirements and design.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG2101"
                  ],
                  "outcomes": [
                    "Analyze a system's functional requirements using use cases.",
                    "Model the static structure of a system using Class Diagrams.",
                    "Model the dynamic behavior of a system using Sequence and Activity Diagrams.",
                    "Create a cohesive set of UML models to describe a software system."
                  ],
                  "chapters": [
                    {
                      "id": "sam_ch1",
                      "title": "Introduction to System Modeling",
                      "topics": [
                        "The Role of Modeling in SE",
                        "Introduction to UML",
                        "The System Development Process"
                      ]
                    },
                    {
                      "id": "sam_ch2",
                      "title": "Functional Modeling",
                      "topics": [
                        "Use Case Diagrams",
                        "Writing Effective Use Cases",
                        "Activity Diagrams"
                      ]
                    },
                    {
                      "id": "sam_ch3",
                      "title": "Structural Modeling",
                      "topics": [
                        "Class Diagrams (Classes, Attributes, Operations)",
                        "Relationships (Association, Aggregation, Composition)",
                        "Object Diagrams"
                      ]
                    },
                    {
                      "id": "sam_ch4",
                      "title": "Behavioral Modeling",
                      "topics": [
                        "Sequence Diagrams",
                        "Communication Diagrams",
                        "State Machine Diagrams"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "SWEG3102",
                  "name": "Internet Programming II",
                  "description": "Server-side web development, focusing on backend frameworks, databases, and building RESTful APIs.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG3107",
                    "SWEG2108"
                  ],
                  "outcomes": [
                    "Develop a server-side application using a modern framework (e.g., Node.js/Express).",
                    "Design and implement RESTful APIs.",
                    "Integrate a backend application with a database.",
                    "Implement user authentication and session management."
                  ],
                  "chapters": [
                    {
                      "id": "ip2_ch1",
                      "title": "Server-Side Fundamentals",
                      "topics": [
                        "Client-Server Architecture",
                        "Introduction to Node.js and npm",
                        "Building a server with Express.js"
                      ]
                    },
                    {
                      "id": "ip2_ch2",
                      "title": "RESTful APIs",
                      "topics": [
                        "Principles of REST",
                        "Designing API Endpoints",
                        "Handling HTTP Requests and Responses"
                      ]
                    },
                    {
                      "id": "ip2_ch3",
                      "title": "Database Integration",
                      "topics": [
                        "Connecting to a Database (SQL/NoSQL)",
                        "Using an ORM/ODM (e.g., Sequelize/Mongoose)",
                        "CRUD Operations"
                      ]
                    },
                    {
                      "id": "ip2_ch4",
                      "title": "Authentication and Security",
                      "topics": [
                        "Session and Cookie Management",
                        "Token-Based Authentication (JWT)",
                        "Password Hashing"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG3104",
                  "name": "Software Requirements Engineering",
                  "description": "Methods for eliciting, analyzing, specifying, and managing software requirements, a critical phase of the software lifecycle.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG3109"
                  ],
                  "outcomes": [
                    "Apply various techniques to elicit requirements from stakeholders.",
                    "Analyze and negotiate conflicting requirements.",
                    "Write a clear, complete, and verifiable Software Requirements Specification (SRS) document.",
                    "Manage changing requirements throughout the project lifecycle."
                  ],
                  "chapters": [
                    {
                      "id": "sre_ch1",
                      "title": "Introduction to Requirements Engineering",
                      "topics": [
                        "The Requirements Process",
                        "Functional and Non-Functional Requirements",
                        "Stakeholders"
                      ]
                    },
                    {
                      "id": "sre_ch2",
                      "title": "Elicitation and Analysis",
                      "topics": [
                        "Interviewing and Workshops",
                        "Prototyping",
                        "Requirements Analysis and Negotiation"
                      ]
                    },
                    {
                      "id": "sre_ch3",
                      "title": "Specification",
                      "topics": [
                        "The Software Requirements Specification (SRS) Document",
                        "Natural Language vs. Formal Specifications",
                        "Using Models for Specification"
                      ]
                    },
                    {
                      "id": "sre_ch4",
                      "title": "Validation and Management",
                      "topics": [
                        "Requirements Reviews and Inspections",
                        "Requirements Traceability",
                        "Change Management"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG3106",
                  "name": "Operating Systems",
                  "description": "Core concepts of operating systems, including process management, memory management, file systems, and concurrency.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG3105"
                  ],
                  "outcomes": [
                    "Explain how operating systems manage processes and threads.",
                    "Analyze CPU scheduling algorithms.",
                    "Solve concurrency problems using synchronization primitives.",
                    "Describe how memory and file systems are managed."
                  ],
                  "chapters": [
                    {
                      "id": "os_ch1",
                      "title": "Introduction and OS Structures",
                      "topics": [
                        "Operating System Services",
                        "System Calls",
                        "OS Design and Implementation"
                      ]
                    },
                    {
                      "id": "os_ch2",
                      "title": "Process Management",
                      "topics": [
                        "Processes and Threads",
                        "CPU Scheduling Algorithms (FCFS, SJF, Priority, Round Robin)",
                        "Inter-process Communication"
                      ]
                    },
                    {
                      "id": "os_ch3",
                      "title": "Synchronization",
                      "topics": [
                        "The Critical-Section Problem",
                        "Mutex Locks and Semaphores",
                        "Deadlocks"
                      ]
                    },
                    {
                      "id": "os_ch4",
                      "title": "Memory and Storage Management",
                      "topics": [
                        "Main Memory (Paging, Segmentation)",
                        "Virtual Memory (Demand Paging)",
                        "File Systems and Directory Structures"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG3108",
                  "name": "Advanced Programming",
                  "description": "Explores advanced programming paradigms and techniques, such as functional programming, concurrency, and metaprogramming, to write more expressive and efficient code.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG3101"
                  ],
                  "outcomes": [
                    "Apply functional programming concepts in a multi-paradigm language.",
                    "Write concurrent programs using threads and synchronization.",
                    "Utilize reflection and metaprogramming techniques.",
                    "Understand advanced type systems and their benefits."
                  ],
                  "chapters": [
                    {
                      "id": "ap_ch1",
                      "title": "Functional Programming Paradigm",
                      "topics": [
                        "First-Class Functions and Lambdas",
                        "Immutability",
                        "Map, Filter, Reduce",
                        "Streams API (Java) / List Comprehensions (Python)"
                      ]
                    },
                    {
                      "id": "ap_ch2",
                      "title": "Concurrency and Parallelism",
                      "topics": [
                        "Threads and the Runnable Interface",
                        "Synchronization and Thread Safety",
                        "Concurrent Collections",
                        "Futures and Promises"
                      ]
                    },
                    {
                      "id": "ap_ch3",
                      "title": "Metaprogramming and Reflection",
                      "topics": [
                        "Reflection APIs",
                        "Dynamic Proxies",
                        "Annotations and Annotation Processing"
                      ]
                    },
                    {
                      "id": "ap_ch4",
                      "title": "Advanced Topics",
                      "topics": [
                        "Advanced Generics and Type Systems",
                        "Design by Contract",
                        "Performance Profiling"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG3110",
                  "name": "Formal Language and Automata Theory",
                  "description": "Study of formal grammars, automata, computability, and complexity, which form the theoretical foundation of computer science.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG2105"
                  ],
                  "outcomes": [
                    "Design finite automata for regular languages.",
                    "Design pushdown automata for context-free languages.",
                    "Understand the capabilities and limitations of Turing machines.",
                    "Classify problems into complexity classes like P and NP."
                  ],
                  "chapters": [
                    {
                      "id": "flat_ch1",
                      "title": "Regular Languages",
                      "topics": [
                        "Deterministic Finite Automata (DFA)",
                        "Nondeterministic Finite Automata (NFA)",
                        "Regular Expressions",
                        "The Pumping Lemma for Regular Languages"
                      ]
                    },
                    {
                      "id": "flat_ch2",
                      "title": "Context-Free Languages",
                      "topics": [
                        "Context-Free Grammars (CFG)",
                        "Pushdown Automata (PDA)",
                        "The Pumping Lemma for Context-Free Languages"
                      ]
                    },
                    {
                      "id": "flat_ch3",
                      "title": "Computability Theory",
                      "topics": [
                        "Turing Machines",
                        "The Church-Turing Thesis",
                        "Decidability and Undecidability (The Halting Problem)"
                      ]
                    },
                    {
                      "id": "flat_ch4",
                      "title": "Complexity Theory",
                      "topics": [
                        "Time Complexity",
                        "The classes P and NP",
                        "NP-Completeness"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 4": {
              "Semester I": [
                {
                  "code": "SWEG4101",
                  "name": "Software Architecture and Design",
                  "description": "Focuses on high-level software design, architectural patterns, quality attributes (like performance and security), and documenting architectural decisions.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG3101",
                    "SWEG3104"
                  ],
                  "outcomes": [
                    "Evaluate and select appropriate architectural styles for a given system.",
                    "Design systems that meet specific quality attributes.",
                    "Document a software architecture effectively.",
                    "Understand the trade-offs involved in architectural decisions."
                  ],
                  "chapters": [
                    {
                      "id": "sad_ch1",
                      "title": "Introduction to Software Architecture",
                      "topics": [
                        "What is Software Architecture?",
                        "Architectural Views and Viewpoints",
                        "Quality Attributes"
                      ]
                    },
                    {
                      "id": "sad_ch2",
                      "title": "Architectural Styles and Patterns",
                      "topics": [
                        "Layered Architecture, MVC",
                        "Client-Server, Peer-to-Peer",
                        "Service-Oriented Architecture (SOA)",
                        "Microservices Architecture"
                      ]
                    },
                    {
                      "id": "sad_ch3",
                      "title": "Designing for Quality Attributes",
                      "topics": [
                        "Designing for Performance",
                        "Designing for Security",
                        "Designing for Modifiability and Testability"
                      ]
                    },
                    {
                      "id": "sad_ch4",
                      "title": "Architectural Documentation and Evaluation",
                      "topics": [
                        "Documenting Architectural Decisions",
                        "Architecture Tradeoff Analysis Method (ATAM)",
                        "Architecture in Agile Projects"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG4103",
                  "name": "Software Testing and Quality Assurance",
                  "description": "Comprehensive study of software testing techniques, levels, and strategies, along with the processes and standards for ensuring software quality.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG3101"
                  ],
                  "outcomes": [
                    "Develop a comprehensive test plan for a software project.",
                    "Apply various black-box and white-box testing techniques.",
                    "Implement automated unit and integration tests.",
                    "Understand the role of SQA processes in the development lifecycle."
                  ],
                  "chapters": [
                    {
                      "id": "stqa_ch1",
                      "title": "Foundations of Software Testing",
                      "topics": [
                        "Testing Principles",
                        "Testing Levels (Unit, Integration, System, Acceptance)",
                        "The V-Model"
                      ]
                    },
                    {
                      "id": "stqa_ch2",
                      "title": "Testing Techniques",
                      "topics": [
                        "Black-Box Testing (Equivalence Partitioning, Boundary Value Analysis)",
                        "White-Box Testing (Statement, Branch, Path Coverage)",
                        "Static vs. Dynamic Testing"
                      ]
                    },
                    {
                      "id": "stqa_ch3",
                      "title": "Test Management and Automation",
                      "topics": [
                        "Test Planning and Documentation",
                        "Test Automation Frameworks (e.g., JUnit, Selenium)",
                        "Regression Testing"
                      ]
                    },
                    {
                      "id": "stqa_ch4",
                      "title": "Software Quality Assurance (SQA)",
                      "topics": [
                        "SQA Processes and Activities",
                        "Software Quality Metrics",
                        "Standards (ISO 9000, CMMI)"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG4105",
                  "name": "Compiler Design",
                  "description": "Study of the theory and practice of compiler construction, from lexical analysis and parsing to code generation and optimization.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG3110"
                  ],
                  "outcomes": [
                    "Design and implement a lexical analyzer for a simple language.",
                    "Design and implement a parser (e.g., recursive descent) for a given grammar.",
                    "Understand semantic analysis and intermediate code generation.",
                    "Implement a simple compiler for a small programming language."
                  ],
                  "chapters": [
                    {
                      "id": "cd_ch1",
                      "title": "Lexical Analysis",
                      "topics": [
                        "The Role of the Lexical Analyzer",
                        "Regular Expressions and Finite Automata",
                        "Building a Lexical Analyzer (Lex/Flex)"
                      ]
                    },
                    {
                      "id": "cd_ch2",
                      "title": "Syntax Analysis (Parsing)",
                      "topics": [
                        "The Role of the Parser",
                        "Context-Free Grammars",
                        "Top-Down Parsing (Recursive Descent, LL)",
                        "Bottom-Up Parsing (LR, Yacc/Bison)"
                      ]
                    },
                    {
                      "id": "cd_ch3",
                      "title": "Semantic Analysis and Intermediate Code",
                      "topics": [
                        "Type Checking",
                        "Symbol Tables",
                        "Three-Address Code"
                      ]
                    },
                    {
                      "id": "cd_ch4",
                      "title": "Code Generation and Optimization",
                      "topics": [
                        "Issues in Code Generation",
                        "A Simple Code Generator",
                        "Introduction to Code Optimization"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG4107",
                  "name": "Mobile Application Development",
                  "description": "Principles and practices of developing applications for mobile platforms like Android or iOS. Covers UI design, platform APIs, data storage, and performance considerations.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG3101"
                  ],
                  "outcomes": [
                    "Design and build a functional mobile application.",
                    "Implement user interfaces that conform to platform guidelines.",
                    "Use platform-specific APIs for features like location and sensors.",
                    "Manage the application lifecycle and handle data persistence."
                  ],
                  "chapters": [
                    {
                      "id": "mad_ch1",
                      "title": "Introduction to Mobile Development (Android/iOS)",
                      "topics": [
                        "Platform Architecture",
                        "Development Environment Setup (Android Studio/Xcode)",
                        "Project Structure"
                      ]
                    },
                    {
                      "id": "mad_ch2",
                      "title": "User Interface and Navigation",
                      "topics": [
                        "UI Components and Layouts",
                        "Handling User Input and Events",
                        "Activity/ViewController Lifecycle",
                        "Navigation between Screens"
                      ]
                    },
                    {
                      "id": "mad_ch3",
                      "title": "Data and Networking",
                      "topics": [
                        "Local Data Storage (Shared Preferences, SQLite, Core Data)",
                        "Consuming REST APIs",
                        "Background Tasks and Services"
                      ]
                    },
                    {
                      "id": "mad_ch4",
                      "title": "Advanced Topics",
                      "topics": [
                        "Using Device Hardware (Camera, GPS)",
                        "Permissions",
                        "Publishing to the App Store"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "SWEG4102",
                  "name": "Software Project Management",
                  "description": "Covers the principles of managing software projects, including planning, estimation, scheduling, risk management, and tracking, with a focus on both traditional and agile approaches.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG2101"
                  ],
                  "outcomes": [
                    "Develop a comprehensive software project plan.",
                    "Estimate project cost and effort using techniques like COCOMO.",
                    "Create and manage a project schedule using CPM.",
                    "Apply agile project management practices like Scrum."
                  ],
                  "chapters": [
                    {
                      "id": "spm_ch1",
                      "title": "Project Planning",
                      "topics": [
                        "Software Project Lifecycle",
                        "Work Breakdown Structure (WBS)",
                        "Process Models"
                      ]
                    },
                    {
                      "id": "spm_ch2",
                      "title": "Estimation and Scheduling",
                      "topics": [
                        "Effort Estimation Models (COCOMO)",
                        "Critical Path Method (CPM)",
                        "Gantt Charts"
                      ]
                    },
                    {
                      "id": "spm_ch3",
                      "title": "Risk and Quality Management",
                      "topics": [
                        "Risk Identification and Mitigation",
                        "Software Quality Assurance",
                        "Configuration Management"
                      ]
                    },
                    {
                      "id": "spm_ch4",
                      "title": "Agile Project Management",
                      "topics": [
                        "Scrum Framework",
                        "Kanban Method",
                        "Agile Metrics (Velocity, Burndown Charts)"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG4104",
                  "name": "Human-Computer Interaction (HCI)",
                  "description": "Study of the design and evaluation of user interfaces. Covers principles of usability, user-centered design processes, prototyping, and evaluation methods.",
                  "credits": 3,
                  "outcomes": [
                    "Apply user-centered design principles to create usable interfaces.",
                    "Conduct user research and create personas.",
                    "Develop and evaluate prototypes of different fidelities.",
                    "Perform usability testing and interpret the results."
                  ],
                  "chapters": [
                    {
                      "id": "hci_ch1",
                      "title": "Foundations of HCI",
                      "topics": [
                        "The Human (Cognition, Perception)",
                        "The Computer (Input/Output Devices)",
                        "The Interaction",
                        "Usability Goals and Principles"
                      ]
                    },
                    {
                      "id": "hci_ch2",
                      "title": "Design Process",
                      "topics": [
                        "User-Centered Design Lifecycle",
                        "User Research (Interviews, Surveys)",
                        "Personas and Scenarios"
                      ]
                    },
                    {
                      "id": "hci_ch3",
                      "title": "Design and Prototyping",
                      "topics": [
                        "Interaction Design Principles (Affordance, Feedback)",
                        "Prototyping (Low-fidelity and High-fidelity)",
                        "Interface Design Guidelines"
                      ]
                    },
                    {
                      "id": "hci_ch4",
                      "title": "Evaluation",
                      "topics": [
                        "Heuristic Evaluation",
                        "Cognitive Walkthrough",
                        "User Testing (Planning and Conducting)"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG4106",
                  "name": "Computer Security",
                  "description": "An introduction to the principles and practices of computer and network security. Covers cryptography, access control, network security protocols, and secure software development.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG2106"
                  ],
                  "outcomes": [
                    "Understand fundamental concepts of confidentiality, integrity, and availability.",
                    "Apply basic cryptographic techniques.",
                    "Identify common web and network security vulnerabilities.",
                    "Incorporate security considerations into the software development process."
                  ],
                  "chapters": [
                    {
                      "id": "cs_ch1",
                      "title": "Security Fundamentals and Cryptography",
                      "topics": [
                        "Security Goals (CIA Triad)",
                        "Symmetric and Asymmetric Cryptography",
                        "Hash Functions and Digital Signatures"
                      ]
                    },
                    {
                      "id": "cs_ch2",
                      "title": "Access Control and Authentication",
                      "topics": [
                        "Authentication Methods",
                        "Access Control Policies (MAC, DAC, RBAC)",
                        "Malware (Viruses, Worms, Trojans)"
                      ]
                    },
                    {
                      "id": "cs_ch3",
                      "title": "Network and Web Security",
                      "topics": [
                        "Firewalls and Intrusion Detection Systems",
                        "SSL/TLS",
                        "Common Web Vulnerabilities (SQL Injection, XSS, CSRF)"
                      ]
                    },
                    {
                      "id": "cs_ch4",
                      "title": "Secure Software Development",
                      "topics": [
                        "Secure Design Principles",
                        "Defensive Programming",
                        "Security Testing"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG4108",
                  "name": "Artificial Intelligence",
                  "description": "An introduction to the fundamental concepts and techniques of artificial intelligence, including problem solving, search, knowledge representation, and machine learning.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG3103"
                  ],
                  "outcomes": [
                    "Apply various search algorithms to solve problems.",
                    "Represent knowledge using logic and other formalisms.",
                    "Understand the principles of game playing algorithms.",
                    "Implement basic machine learning algorithms."
                  ],
                  "chapters": [
                    {
                      "id": "ai_ch1",
                      "title": "Problem Solving and Search",
                      "topics": [
                        "Intelligent Agents",
                        "Uninformed Search (BFS, DFS)",
                        "Informed Search (Greedy, A*)"
                      ]
                    },
                    {
                      "id": "ai_ch2",
                      "title": "Adversarial Search and Constraint Satisfaction",
                      "topics": [
                        "Game Theory",
                        "Minimax Algorithm and Alpha-Beta Pruning",
                        "Constraint Satisfaction Problems (CSP)"
                      ]
                    },
                    {
                      "id": "ai_ch3",
                      "title": "Knowledge Representation and Logic",
                      "topics": [
                        "Propositional and First-Order Logic",
                        "Inference in Logic",
                        "Rule-Based Systems"
                      ]
                    },
                    {
                      "id": "ai_ch4",
                      "title": "Introduction to Machine Learning",
                      "topics": [
                        "Supervised Learning (Linear Regression, Decision Trees)",
                        "Unsupervised Learning (k-Means Clustering)",
                        "Introduction to Neural Networks"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG4112",
                  "name": "Internship",
                  "description": "A supervised practical work experience in a software engineering-related organization. Students apply their academic knowledge in a real-world setting and submit a report on their experience.",
                  "credits": 0,
                  "outcomes": [
                    "Gain practical experience in a professional software development environment.",
                    "Develop professional skills like teamwork, communication, and problem-solving.",
                    "Bridge the gap between academic theory and industry practice."
                  ],
                  "chapters": []
                }
              ]
            },
            "Year 5": {
              "Semester I": [
                {
                  "code": "SWEG5101",
                  "name": "B.Sc. Thesis I",
                  "description": "The first phase of the final year thesis project. Students work with a faculty advisor to identify a research or development topic, conduct a literature survey, define the scope and methodology, and prepare a detailed proposal.",
                  "credits": 2,
                  "outcomes": [
                    "Identify a relevant software engineering problem.",
                    "Conduct a comprehensive literature review.",
                    "Develop a sound methodology for the project.",
                    "Write and defend a formal project proposal."
                  ],
                  "chapters": []
                },
                {
                  "code": "SWEG5103",
                  "name": "Distributed Systems",
                  "description": "Covers the principles of designing and building systems that are spread across multiple computers, focusing on communication, consistency, and fault tolerance.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG3106",
                    "SWEG2106"
                  ],
                  "outcomes": [
                    "Understand the challenges and trade-offs in distributed systems.",
                    "Analyze different inter-process communication mechanisms.",
                    "Describe algorithms for achieving consistency and replication.",
                    "Design a simple fault-tolerant distributed application."
                  ],
                  "chapters": [
                    {
                      "id": "ds_ch1",
                      "title": "Characterization of Distributed Systems",
                      "topics": [
                        "Goals and Challenges",
                        "System Models (Architectural, Fundamental)",
                        "Interprocess Communication (Sockets, RPC, RMI)"
                      ]
                    },
                    {
                      "id": "ds_ch2",
                      "title": "Time and Coordination",
                      "topics": [
                        "Logical Clocks (Lamport, Vector)",
                        "Mutual Exclusion Algorithms",
                        "Election Algorithms"
                      ]
                    },
                    {
                      "id": "ds_ch3",
                      "title": "Consistency and Replication",
                      "topics": [
                        "Data-Centric and Client-Centric Consistency Models",
                        "Replica Management",
                        "Consistency Protocols"
                      ]
                    },
                    {
                      "id": "ds_ch4",
                      "title": "Fault Tolerance",
                      "topics": [
                        "Failure Models",
                        "Process Resilience",
                        "Consensus and The Two-Phase Commit Protocol"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG5105",
                  "name": "Professional Ethics and Practices",
                  "description": "Exploration of the ethical, legal, and social issues in computing. Covers professional codes of conduct, intellectual property, privacy, and the impact of technology on society.",
                  "credits": 2,
                  "outcomes": [
                    "Analyze ethical dilemmas in software engineering using established frameworks.",
                    "Understand and apply professional codes of ethics (e.g., ACM/IEEE).",
                    "Evaluate the social impact of technological solutions.",
                    "Recognize legal issues related to software, such as copyright and licensing."
                  ],
                  "chapters": [
                    {
                      "id": "pep_ch1",
                      "title": "Introduction to Professional Ethics",
                      "topics": [
                        "Ethical Theories",
                        "Professionalism and Codes of Conduct",
                        "Analyzing Ethical Scenarios"
                      ]
                    },
                    {
                      "id": "pep_ch2",
                      "title": "Intellectual Property and Privacy",
                      "topics": [
                        "Copyright, Patents, and Trade Secrets",
                        "Software Licensing (Open Source, Proprietary)",
                        "Privacy and Data Protection"
                      ]
                    },
                    {
                      "id": "pep_ch3",
                      "title": "Social and Global Impact",
                      "topics": [
                        "The Digital Divide",
                        "Social Networking and its Effects",
                        "Automation, AI, and the Future of Work"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG52XX",
                  "name": "Elective I",
                  "description": "Students select a specialized course from a list of approved electives, such as Machine Learning, Computer Graphics, or Natural Language Processing.",
                  "credits": 3,
                  "outcomes": [
                    "Gain in-depth knowledge in a chosen sub-discipline.",
                    "Apply advanced concepts to solve complex problems.",
                    "Explore current trends and technologies in a specialized field."
                  ],
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "SWEG5102",
                  "name": "B.Sc. Thesis II",
                  "description": "The second and final phase of the thesis project. Students execute their research or development plan, analyze the results, and write the final thesis document, culminating in a final oral defense.",
                  "credits": 4,
                  "prerequisites": [
                    "SWEG5101"
                  ],
                  "outcomes": [
                    "Successfully complete an independent research or development project.",
                    "Analyze and interpret project results.",
                    "Synthesize findings and draw valid conclusions.",
                    "Produce a comprehensive thesis document and defend it orally."
                  ],
                  "chapters": []
                },
                {
                  "code": "SWEG5104",
                  "name": "Software Evolution and Maintenance",
                  "description": "Study of the processes and techniques for managing software change after its initial release. Covers refactoring, reverse engineering, and managing legacy systems.",
                  "credits": 3,
                  "prerequisites": [
                    "SWEG4101"
                  ],
                  "outcomes": [
                    "Understand the different types of software maintenance.",
                    "Apply refactoring techniques to improve code quality.",
                    "Use reverse engineering to understand legacy systems.",
                    "Analyze software metrics to assess maintainability."
                  ],
                  "chapters": [
                    {
                      "id": "sem_ch1",
                      "title": "Foundations of Software Maintenance",
                      "topics": [
                        "Types of Maintenance (Corrective, Adaptive, Perfective)",
                        "Lehman's Laws of Software Evolution",
                        "Maintenance Process Models"
                      ]
                    },
                    {
                      "id": "sem_ch2",
                      "title": "Code Improvement",
                      "topics": [
                        "Code Smells",
                        "Refactoring Techniques",
                        "Technical Debt"
                      ]
                    },
                    {
                      "id": "sem_ch3",
                      "title": "Understanding and Changing Systems",
                      "topics": [
                        "Program Comprehension",
                        "Reverse Engineering",
                        "Impact Analysis"
                      ]
                    },
                    {
                      "id": "sem_ch4",
                      "title": "Maintenance Management",
                      "topics": [
                        "Software Metrics for Maintenance",
                        "Managing Legacy Systems",
                        "Tool Support for Maintenance"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG5108",
                  "name": "Entrepreneurship for Engineers",
                  "description": "Introduction to the principles of entrepreneurship, including opportunity recognition, business model development, funding, and intellectual property strategy, tailored for technology ventures.",
                  "credits": 2,
                  "outcomes": [
                    "Identify and evaluate business opportunities.",
                    "Develop a business model for a technology startup.",
                    "Understand the basics of startup financing.",
                    "Create a concise business plan or pitch deck."
                  ],
                  "chapters": [
                    {
                      "id": "ent_ch1",
                      "title": "The Entrepreneurial Mindset",
                      "topics": [
                        "Opportunity Recognition",
                        "Innovation and Creativity",
                        "The Lean Startup Methodology"
                      ]
                    },
                    {
                      "id": "ent_ch2",
                      "title": "Business Models and Strategy",
                      "topics": [
                        "The Business Model Canvas",
                        "Value Proposition Design",
                        "Customer Discovery and Validation"
                      ]
                    },
                    {
                      "id": "ent_ch3",
                      "title": "Startup Funding and Finance",
                      "topics": [
                        "Bootstrapping",
                        "Angel Investors and Venture Capital",
                        "Basic Financial Projections"
                      ]
                    }
                  ]
                },
                {
                  "code": "SWEG52XY",
                  "name": "Elective II",
                  "description": "Students select a second specialized course from a list of approved electives, such as Cloud Computing, Big Data Technologies, or Internet of Things (IoT).",
                  "credits": 3,
                  "outcomes": [
                    "Gain further in-depth knowledge in a chosen sub-discipline.",
                    "Apply advanced concepts to solve complex problems.",
                    "Explore current trends and technologies in a specialized field."
                  ],
                  "chapters": []
                }
              ]
            }
          }
        },
        {
          "name": "Mining Engineering",
          "abbreviation": "MinE",
          "coursesByYearSemester": {
            "Year 2": {
              "Semester I": [
                {
                  "code": "MinE2101",
                  "name": "Introduction to Mining Engineering",
                  "description": "An overview of the global mining industry, the complete life cycle of a mine from exploration to closure, fundamental mining terminology, and an introduction to surface and underground mining methods.",
                  "credits": 3,
                  "outcomes": [
                    "Describe the stages of a mine's life cycle.",
                    "Identify and define basic mining terminology.",
                    "Differentiate between major surface and underground mining methods.",
                    "Understand the role of mining in the global economy."
                  ],
                  "chapters": [
                    {
                      "id": "intro_mine_ch1",
                      "title": "The Mining Industry and its Importance",
                      "topics": [
                        "Role of Minerals in Society",
                        "Global Mining Landscape",
                        "Sustainable Development in Mining"
                      ]
                    },
                    {
                      "id": "intro_mine_ch2",
                      "title": "Mine Life Cycle",
                      "topics": [
                        "Exploration and Prospecting",
                        "Feasibility Studies and Mine Development",
                        "Production Operations",
                        "Mine Reclamation and Closure"
                      ]
                    },
                    {
                      "id": "intro_mine_ch3",
                      "title": "Overview of Mining Methods",
                      "topics": [
                        "Introduction to Surface Mining",
                        "Introduction to Underground Mining",
                        "Introduction to Solution Mining"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng2005",
                  "name": "Engineering Mechanics I (Statics)",
                  "description": "A study of the equilibrium of particles and rigid bodies under the action of forces. Topics include vector algebra, force systems, equilibrium conditions, structural analysis of trusses and frames, friction, and centroids.",
                  "credits": 3,
                  "chapters": []
                },
                {
                  "code": "MEng2001",
                  "name": "Engineering Drawing",
                  "description": "Fundamental principles of engineering drawing and graphics. Covers orthographic projections, sectional views, dimensioning, and an introduction to computer-aided drafting (CAD) software.",
                  "credits": 3,
                  "chapters": []
                },
                {
                  "code": "Geol2103",
                  "name": "Engineering Geology",
                  "description": "Study of earth materials, processes, and geological structures relevant to mining and civil engineering applications, with a focus on site investigation and hazard assessment.",
                  "credits": 3,
                  "outcomes": [
                    "Identify common rock-forming minerals and rock types.",
                    "Interpret geological maps and identify major geological structures.",
                    "Understand the influence of geology on engineering projects.",
                    "Describe basic methods of subsurface exploration."
                  ],
                  "chapters": [
                    {
                      "id": "eg_ch1",
                      "title": "Introduction to Geology",
                      "topics": [
                        "Earth Structure and Plate Tectonics",
                        "The Rock Cycle",
                        "Geological Time"
                      ]
                    },
                    {
                      "id": "eg_ch2",
                      "title": "Minerals and Rocks",
                      "topics": [
                        "Mineral Identification",
                        "Igneous, Sedimentary, and Metamorphic Rocks",
                        "Rock Weathering and Soil Formation"
                      ]
                    },
                    {
                      "id": "eg_ch3",
                      "title": "Structural Geology",
                      "topics": [
                        "Stress, Strain, and Deformation",
                        "Folds, Faults, and Joints",
                        "Interpretation of Geological Maps"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "MinE2102",
                  "name": "Mine Surveying I",
                  "description": "Fundamentals of surveying measurement and computation as applied to mining operations. Covers the use of levels, theodolites, total stations, and basic traverse calculations for both surface and underground environments.",
                  "credits": 3,
                  "outcomes": [
                    "Operate basic surveying instruments correctly.",
                    "Perform differential leveling and traversing.",
                    "Compute and adjust survey measurements.",
                    "Understand the specific challenges of surveying underground."
                  ],
                  "chapters": [
                    {
                      "id": "ms1_ch1",
                      "title": "Surveying Fundamentals",
                      "topics": [
                        "Units, Errors, and Precision",
                        "Distance Measurement",
                        "Angle Measurement"
                      ]
                    },
                    {
                      "id": "ms1_ch2",
                      "title": "Leveling and Traversing",
                      "topics": [
                        "Differential Leveling",
                        "Theodolite and Total Station Operations",
                        "Traverse Computations and Adjustment"
                      ]
                    },
                    {
                      "id": "ms1_ch3",
                      "title": "Underground Surveying",
                      "topics": [
                        "Survey Control Transfer (Shafts, Adits)",
                        "Underground Traverse Techniques",
                        "Stope and Development Surveying"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng2104",
                  "name": "Strength of Materials",
                  "description": "Analyzes the internal effects of forces on deformable bodies. Covers concepts of stress, strain, torsion, bending, shear in beams, stress transformation, and column buckling.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng2005"
                  ],
                  "chapters": []
                },
                {
                  "code": "MinE2104",
                  "name": "Mineralogy and Petrology",
                  "description": "Identification and classification of common ore and gangue minerals and host rocks. Covers crystallography, physical and optical properties of minerals, and the genesis of mineral deposits.",
                  "credits": 3,
                  "prerequisites": [
                    "Geol2103"
                  ],
                  "outcomes": [
                    "Identify major rock-forming and ore minerals in hand specimens.",
                    "Use a petrographic microscope for mineral identification.",
                    "Classify igneous, sedimentary, and metamorphic rocks.",
                    "Relate rock and mineral assemblages to their geological environment."
                  ],
                  "chapters": [
                    {
                      "id": "mp_ch1",
                      "title": "Crystallography and Mineral Properties",
                      "topics": [
                        "Crystal Systems",
                        "Physical Properties of Minerals",
                        "Optical Mineralogy"
                      ]
                    },
                    {
                      "id": "mp_ch2",
                      "title": "Systematic Mineralogy",
                      "topics": [
                        "Silicates",
                        "Sulfides and Sulfates",
                        "Oxides and Carbonates"
                      ]
                    },
                    {
                      "id": "mp_ch3",
                      "title": "Petrology",
                      "topics": [
                        "Igneous Rocks and Processes",
                        "Sedimentary Rocks and Processes",
                        "Metamorphic Rocks and Processes"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng2103",
                  "name": "Engineering Thermodynamics",
                  "description": "Principles of thermodynamics, energy conversion, and their application in mining systems such as ventilation, compressed air, and power generation.",
                  "credits": 3,
                  "chapters": []
                }
              ]
            },
            "Year 3": {
              "Semester I": [
                {
                  "code": "MinE3101",
                  "name": "Rock Mechanics I",
                  "description": "Study of the mechanical behavior of rock and rock masses. Covers fundamental concepts of stress and strain, rock properties, rock mass classification, and failure criteria.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng2104",
                    "Geol2103"
                  ],
                  "outcomes": [
                    "Analyze stress and strain in a rock mass.",
                    "Determine the mechanical properties of intact rock from laboratory tests.",
                    "Classify rock masses using standard systems (RMR, Q).",
                    "Apply rock failure criteria to predict rock strength."
                  ],
                  "chapters": [
                    {
                      "id": "rm1_ch1",
                      "title": "Stress, Strain, and Rock Properties",
                      "topics": [
                        "In-situ Stress",
                        "Elastic Properties of Rock",
                        "Laboratory Testing of Rock"
                      ]
                    },
                    {
                      "id": "rm1_ch2",
                      "title": "Rock Mass Characterization",
                      "topics": [
                        "Discontinuities in Rock Masses",
                        "Rock Mass Rating (RMR)",
                        "Q-System"
                      ]
                    },
                    {
                      "id": "rm1_ch3",
                      "title": "Rock Failure",
                      "topics": [
                        "Mohr-Coulomb Failure Criterion",
                        "Hoek-Brown Failure Criterion",
                        "Tensile Failure"
                      ]
                    }
                  ]
                },
                {
                  "code": "MinE3103",
                  "name": "Surface Mining Methods",
                  "description": "Detailed study of surface mining techniques including open pit, strip mining, and quarrying. Covers unit operations, equipment selection, and production planning.",
                  "credits": 3,
                  "prerequisites": [
                    "MinE2101"
                  ],
                  "outcomes": [
                    "Select an appropriate surface mining method based on deposit characteristics.",
                    "Describe the sequence of unit operations in open pit mining.",
                    "Perform basic calculations for equipment selection and productivity.",
                    "Understand the principles of pit planning and design."
                  ],
                  "chapters": [
                    {
                      "id": "smm_ch1",
                      "title": "Open Pit Mining",
                      "topics": [
                        "Mine Elements and Terminology",
                        "Drilling and Blasting",
                        "Loading and Haulage"
                      ]
                    },
                    {
                      "id": "smm_ch2",
                      "title": "Strip Mining and Quarrying",
                      "topics": [
                        "Area and Contour Strip Mining",
                        "Dragline and Shovel Operations",
                        "Quarrying of Dimension Stone and Aggregates"
                      ]
                    },
                    {
                      "id": "smm_ch3",
                      "title": "Equipment Selection",
                      "topics": [
                        "Truck-Shovel Systems",
                        "Conveyor Systems",
                        "Hydraulic Mining"
                      ]
                    }
                  ]
                },
                {
                  "code": "MinE3105",
                  "name": "Mine Ventilation I",
                  "description": "Principles of airflow in underground mines. Covers air quality and quantity requirements, analysis of ventilation networks, and selection of fans.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng2103"
                  ],
                  "outcomes": [
                    "Determine the required air quantity for an underground mine.",
                    "Calculate pressure losses in ventilation circuits.",
                    "Analyze simple ventilation networks.",
                    "Select appropriate fans based on performance curves."
                  ],
                  "chapters": [
                    {
                      "id": "mv1_ch1",
                      "title": "Mine Atmosphere and Air Quality",
                      "topics": [
                        "Gases, Dusts, and Heat",
                        "Air Quality Standards",
                        "Psychrometry"
                      ]
                    },
                    {
                      "id": "mv1_ch2",
                      "title": "Physics of Mine Airflow",
                      "topics": [
                        "Bernoulli's Equation",
                        "Frictional Losses (Atkinson's Equation)",
                        "Shock Losses"
                      ]
                    },
                    {
                      "id": "mv1_ch3",
                      "title": "Ventilation Systems",
                      "topics": [
                        "Ventilation Network Analysis (Kirchhoff's Laws)",
                        "Natural and Mechanical Ventilation",
                        "Axial and Centrifugal Fans"
                      ]
                    }
                  ]
                },
                {
                  "code": "MinE3107",
                  "name": "Mineral Processing I",
                  "description": "Introduction to mineral beneficiation. Covers the theory and practice of comminution (crushing and grinding), screening, classification, and physical separation methods.",
                  "credits": 3,
                  "prerequisites": [
                    "MinE2104"
                  ],
                  "outcomes": [
                    "Analyze and interpret particle size distributions.",
                    "Describe the operation of crushers and grinding mills.",
                    "Select appropriate physical separation techniques based on mineral properties.",
                    "Develop a basic mineral processing flowsheet."
                  ],
                  "chapters": [
                    {
                      "id": "mp1_ch1",
                      "title": "Ore Characterization and Comminution",
                      "topics": [
                        "Sampling and Liberation",
                        "Crushing Circuits",
                        "Grinding Circuits"
                      ]
                    },
                    {
                      "id": "mp1_ch2",
                      "title": "Sizing and Classification",
                      "topics": [
                        "Screening",
                        "Hydraulic and Mechanical Classifiers",
                        "Hydrocyclones"
                      ]
                    },
                    {
                      "id": "mp1_ch3",
                      "title": "Physical Separation",
                      "topics": [
                        "Gravity Separation",
                        "Magnetic and Electrostatic Separation",
                        "Dewatering"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "MinE3102",
                  "name": "Underground Mining Methods",
                  "description": "Detailed study of underground mining methods for coal and hard rock deposits. Covers selection criteria, layout, and operation of supported, unsupported, and caving methods.",
                  "credits": 3,
                  "prerequisites": [
                    "MinE2101"
                  ],
                  "outcomes": [
                    "Select an appropriate underground mining method for a given orebody.",
                    "Describe the development and production cycle for various methods.",
                    "Compare the advantages and disadvantages of different mining methods.",
                    "Understand the role of backfill in supported methods."
                  ],
                  "chapters": [
                    {
                      "id": "umm_ch1",
                      "title": "Unsupported and Supported Methods",
                      "topics": [
                        "Room and Pillar Mining",
                        "Sublevel Stoping",
                        "Cut-and-Fill and Shrinkage Stoping"
                      ]
                    },
                    {
                      "id": "umm_ch2",
                      "title": "Caving Methods",
                      "topics": [
                        "Longwall Mining",
                        "Sublevel Caving",
                        "Block Caving"
                      ]
                    },
                    {
                      "id": "umm_ch3",
                      "title": "Method Selection",
                      "topics": [
                        "Influence of Orebody Geometry and Rock Mechanics",
                        "Economic Considerations",
                        "Comparison of Methods"
                      ]
                    }
                  ]
                },
                {
                  "code": "MinE3104",
                  "name": "Explosives Engineering",
                  "description": "Theory and application of commercial explosives in rock fragmentation. Covers blast design principles for surface and underground mining and construction.",
                  "credits": 2,
                  "outcomes": [
                    "Understand the properties and selection of commercial explosives.",
                    "Design blasting patterns for surface benching.",
                    "Design blasting rounds for underground development.",
                    "Analyze blast performance and control adverse effects like vibration."
                  ],
                  "chapters": [
                    {
                      "id": "ee_ch1",
                      "title": "Explosives and Initiation Systems",
                      "topics": [
                        "Types of Commercial Explosives",
                        "Initiation Systems (Detonators, Cords, Electronic)",
                        "Safety in Handling Explosives"
                      ]
                    },
                    {
                      "id": "ee_ch2",
                      "title": "Rock Breakage and Blast Design",
                      "topics": [
                        "Mechanics of Rock Fragmentation",
                        "Surface Blast Design Parameters",
                        "Underground Development and Production Blasting"
                      ]
                    },
                    {
                      "id": "ee_ch3",
                      "title": "Blast Control and Monitoring",
                      "topics": [
                        "Ground Vibration and Airblast",
                        "Flyrock Control",
                        "Blast Monitoring"
                      ]
                    }
                  ]
                },
                {
                  "code": "MinE3106",
                  "name": "Mine Power and Drainage",
                  "description": "Design of electrical power distribution systems and mine dewatering systems, including pump selection, pipeline design, and management of mine water.",
                  "credits": 2,
                  "outcomes": [
                    "Design a basic power distribution layout for a mine.",
                    "Estimate dewatering requirements.",
                    "Select pumps and design pipeline systems for mine drainage.",
                    "Understand the principles of slurry transport."
                  ],
                  "chapters": [
                    {
                      "id": "mpd_ch1",
                      "title": "Mine Electrical Systems",
                      "topics": [
                        "Power Distribution in Surface and Underground Mines",
                        "Switchgear and Protection",
                        "Electrical Safety"
                      ]
                    },
                    {
                      "id": "mpd_ch2",
                      "title": "Mine Dewatering",
                      "topics": [
                        "Sources of Mine Water",
                        "Pumping Systems",
                        "Pipeline Hydraulics"
                      ]
                    }
                  ]
                },
                {
                  "code": "MinE3108",
                  "name": "Rock Mechanics II",
                  "description": "Application of rock mechanics principles to the design of underground openings. Covers pillar design, ground support systems, and subsidence engineering.",
                  "credits": 3,
                  "prerequisites": [
                    "MinE3101"
                  ],
                  "outcomes": [
                    "Analyze stresses around underground excavations.",
                    "Design stable pillars for room-and-pillar and stope mining.",
                    "Select and design appropriate ground support systems.",
                    "Predict and analyze mining-induced subsidence."
                  ],
                  "chapters": [
                    {
                      "id": "rm2_ch1",
                      "title": "Underground Stress and Pillar Design",
                      "topics": [
                        "Stresses around Underground Openings",
                        "Pillar Strength Formulas",
                        "Design of Rib and Stope Pillars"
                      ]
                    },
                    {
                      "id": "rm2_ch2",
                      "title": "Ground Support and Reinforcement",
                      "topics": [
                        "Rockbolts and Cable Bolts",
                        "Shotcrete and Liners",
                        "Support Design Methods"
                      ]
                    },
                    {
                      "id": "rm2_ch3",
                      "title": "Subsidence and Rockbursts",
                      "topics": [
                        "Mechanics of Subsidence",
                        "Subsidence Prediction and Control",
                        "Introduction to Rockbursts"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 4": {
              "Semester I": [
                {
                  "code": "MinE4101",
                  "name": "Surface Mine Design",
                  "description": "A capstone design course focusing on the engineering design of a surface mine. Integrates geological modeling, pit optimization, mine planning, equipment selection, and economic analysis.",
                  "credits": 3,
                  "prerequisites": [
                    "MinE3103",
                    "MinE3101"
                  ],
                  "chapters": []
                },
                {
                  "code": "MinE4103",
                  "name": "Rock Slope Engineering",
                  "description": "Analysis and design of stable rock slopes in open pit mines and large civil engineering projects. Covers failure mechanisms, stability analysis methods, and stabilization techniques.",
                  "credits": 3,
                  "prerequisites": [
                    "MinE3101"
                  ],
                  "outcomes": [
                    "Identify potential modes of slope failure.",
                    "Perform kinematic analysis using stereonets.",
                    "Apply limit equilibrium methods for slope stability analysis.",
                    "Design slope stabilization and monitoring systems."
                  ],
                  "chapters": [
                    {
                      "id": "rse_ch1",
                      "title": "Slope Failure Mechanisms",
                      "topics": [
                        "Planar, Wedge, and Toppling Failures",
                        "Circular Failure",
                        "Influence of Groundwater"
                      ]
                    },
                    {
                      "id": "rse_ch2",
                      "title": "Stability Analysis",
                      "topics": [
                        "Stereographic Projection Analysis",
                        "Limit Equilibrium Methods",
                        "Introduction to Numerical Modeling"
                      ]
                    },
                    {
                      "id": "rse_ch3",
                      "title": "Slope Design and Control",
                      "topics": [
                        "Acceptable Factors of Safety",
                        "Slope Reinforcement and Drainage",
                        "Slope Monitoring"
                      ]
                    }
                  ]
                },
                {
                  "code": "MinE4105",
                  "name": "Mine Valuation and Economics",
                  "description": "Methods for the economic evaluation of mineral projects. Covers mineral resource and reserve estimation, cash flow analysis, risk assessment, and the impact of taxation.",
                  "credits": 3,
                  "outcomes": [
                    "Distinguish between mineral resources and reserves.",
                    "Develop a discounted cash flow (DCF) model for a mining project.",
                    "Calculate key economic indicators (NPV, IRR).",
                    "Perform sensitivity and risk analysis on project economics."
                  ],
                  "chapters": [
                    {
                      "id": "mve_ch1",
                      "title": "Resource and Reserve Estimation",
                      "topics": [
                        "International Reporting Codes (JORC, NI 43-101)",
                        "Cut-off Grade Strategy"
                      ]
                    },
                    {
                      "id": "mve_ch2",
                      "title": "Project Cash Flow Analysis",
                      "topics": [
                        "Capital and Operating Cost Estimation",
                        "Discounted Cash Flow (DCF) Analysis",
                        "Net Present Value (NPV), Internal Rate of Return (IRR)"
                      ]
                    },
                    {
                      "id": "mve_ch3",
                      "title": "Risk and Uncertainty",
                      "topics": [
                        "Sensitivity Analysis",
                        "Monte Carlo Simulation",
                        "Decision Tree Analysis"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "MinE4102",
                  "name": "Underground Mine Design",
                  "description": "A capstone design course focusing on the engineering design of an underground mine. Involves stope design, mine layout and sequencing, ventilation planning, and materials handling.",
                  "credits": 3,
                  "prerequisites": [
                    "MinE3102",
                    "MinE3108"
                  ],
                  "chapters": []
                },
                {
                  "code": "MinE4104",
                  "name": "Mine Safety and Health Management",
                  "description": "Principles of safety and health management systems in mining. Covers hazard identification, risk assessment, accident investigation, emergency preparedness, and occupational health.",
                  "credits": 3,
                  "outcomes": [
                    "Develop and implement components of a safety management system.",
                    "Conduct a formal risk assessment.",
                    "Investigate accidents to determine root causes.",
                    "Identify and control common occupational health hazards in mining."
                  ],
                  "chapters": [
                    {
                      "id": "mshm_ch1",
                      "title": "Safety Management Systems",
                      "topics": [
                        "Principles of Safety Management",
                        "Hazard Identification and Risk Assessment",
                        "Safety Culture"
                      ]
                    },
                    {
                      "id": "mshm_ch2",
                      "title": "Occupational Health",
                      "topics": [
                        "Mine Gases and Dust Control",
                        "Noise and Vibration Control",
                        "Ergonomics"
                      ]
                    },
                    {
                      "id": "mshm_ch3",
                      "title": "Emergency Preparedness",
                      "topics": [
                        "Mine Rescue",
                        "Fire Prevention and Control",
                        "Emergency Response Planning"
                      ]
                    }
                  ]
                },
                {
                  "code": "MinE4106",
                  "name": "Mine Haulage and Hoisting",
                  "description": "Design and analysis of material transport systems in mines, including truck-shovel systems, conveyor belts, rail haulage, and hoisting systems.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "MinE4108",
                  "name": "Geostatistics",
                  "description": "Statistical methods for spatial data analysis. Focuses on the application of variograms and kriging for unbiased mineral resource estimation.",
                  "credits": 2,
                  "prerequisites": [
                    "MinE4105"
                  ],
                  "chapters": []
                }
              ],
              "Semester III (Summer)": [
                {
                  "code": "MinE4112",
                  "name": "Internship",
                  "description": "Supervised practical work experience in a mining or related organization. Students apply their academic knowledge in a real-world setting and submit a report on their experience.",
                  "credits": 0,
                  "outcomes": [
                    "Gain practical experience in a professional engineering environment.",
                    "Develop professional skills like teamwork and communication.",
                    "Bridge the gap between academic theory and industry practice."
                  ],
                  "chapters": []
                }
              ]
            },
            "Year 5": {
              "Semester I": [
                {
                  "code": "MinE5101",
                  "name": "B.Sc. Thesis I",
                  "description": "The first phase of the final year capstone project. Students work in teams with a faculty advisor to define an engineering problem, conduct a literature review and feasibility study, and prepare a detailed project proposal.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "MinE5103",
                  "name": "Mining Law and Ethics",
                  "description": "A study of the legal framework governing mining operations, including mineral rights, environmental regulations, and codes of professional engineering ethics.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "MinE5105",
                  "name": "Mine Environmental Management",
                  "description": "Management of the environmental impacts of mining, focusing on waste rock and tailings disposal, acid rock drainage (ARD) prediction and control, and mine closure planning.",
                  "credits": 3,
                  "prerequisites": [
                    "MinE4104"
                  ],
                  "outcomes": [
                    "Conduct a basic environmental impact assessment for a mining project.",
                    "Design systems for managing mine waste and tailings.",
                    "Propose strategies for preventing or mitigating acid rock drainage.",
                    "Develop a conceptual mine closure and reclamation plan."
                  ],
                  "chapters": [
                    {
                      "id": "mem_ch1",
                      "title": "Environmental Impact and Assessment",
                      "topics": [
                        "Mining's Environmental Footprint",
                        "Environmental Impact Assessment (EIA) Process"
                      ]
                    },
                    {
                      "id": "mem_ch2",
                      "title": "Mine Waste Management",
                      "topics": [
                        "Waste Rock and Tailings Characterization",
                        "Tailings Storage Facilities Design",
                        "Acid Rock Drainage (ARD) Prediction and Control"
                      ]
                    },
                    {
                      "id": "mem_ch3",
                      "title": "Mine Reclamation and Closure",
                      "topics": [
                        "Reclamation Principles",
                        "Re-vegetation and Landform Design",
                        "Mine Closure Planning and Costing"
                      ]
                    }
                  ]
                },
                {
                  "code": "MinE5201",
                  "name": "Elective I",
                  "description": "Students select a specialized course from a list of approved technical electives to deepen their knowledge in a specific area of mining engineering, such as Coal Preparation, Solution Mining, or Tunneling.",
                  "credits": 3,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "MinE5102",
                  "name": "B.Sc. Thesis II",
                  "description": "The second and final phase of the capstone project. Students execute their design project, analyze the results, and prepare a final engineering report and oral defense.",
                  "credits": 4,
                  "prerequisites": [
                    "MinE5101"
                  ],
                  "chapters": []
                },
                {
                  "code": "MinE5104",
                  "name": "Mineral Project Management",
                  "description": "Application of project management principles (PMBOK) to the planning, execution, and control of mineral exploration and mining projects, from feasibility through to construction.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "MinE5106",
                  "name": "Mine Automation and Robotics",
                  "description": "A study of current and emerging technologies for automating mining processes, including autonomous vehicles, remote control operation, and the use of data analytics for process optimization.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "SWEG5108",
                  "name": "Entrepreneurship for Engineers",
                  "description": "Introduction to the principles of entrepreneurship, including opportunity recognition, business model development, funding, and intellectual property strategy, tailored for technology ventures.",
                  "credits": 2,
                  "chapters": []
                }
              ]
            }
          }
        },
        {
          "name": "Chemical Engineering",
          "abbreviation": "ChEE",
          "coursesByYearSemester": {
            "Year 2": {
              "Semester I": [
                {
                  "code": "ChEE2101",
                  "name": "Introduction to Chemical Engineering",
                  "description": "An introduction to the chemical engineering profession, fundamental concepts of process variables, units and dimensions, and basic material balance calculations.",
                  "credits": 2,
                  "outcomes": [
                    "Understand the role and impact of chemical engineers in various industries.",
                    "Perform unit conversions and dimensional analysis on process variables.",
                    "Draw and label a process flow diagram.",
                    "Set up and solve simple material balance problems on single units."
                  ],
                  "chapters": [
                    {
                      "id": "intro_chee_ch1",
                      "title": "The Chemical Engineering Profession",
                      "topics": [
                        "History of Chemical Engineering",
                        "Roles in Industry (Energy, Pharma, Food, Materials)",
                        "Ethics and Professionalism"
                      ]
                    },
                    {
                      "id": "intro_chee_ch2",
                      "title": "Units, Dimensions, and Process Variables",
                      "topics": [
                        "SI and American Engineering Units",
                        "Dimensional Homogeneity",
                        "Temperature, Pressure, and Flow Rate Measurement"
                      ]
                    },
                    {
                      "id": "intro_chee_ch3",
                      "title": "Introduction to Material Balances",
                      "topics": [
                        "Process Flow Diagrams",
                        "The General Balance Equation",
                        "Balances on Single Non-Reactive Processes"
                      ]
                    }
                  ]
                },
                {
                  "code": "ChEE2103",
                  "name": "Material and Energy Balances",
                  "description": "A core course covering the principles of conservation of mass and energy applied to chemical processes. Includes balances on reactive and non-reactive systems, single and multiple units.",
                  "credits": 3,
                  "prerequisites": [
                    "ChEE2101"
                  ],
                  "outcomes": [
                    "Formulate and solve material balance problems for systems with reaction, recycle, and purge streams.",
                    "Perform energy balance calculations using steam tables and heat capacities.",
                    "Combine material and energy balances to solve complex process problems.",
                    "Understand the concepts of stoichiometry, limiting reactants, and extent of reaction."
                  ],
                  "chapters": [
                    {
                      "id": "meb_ch1",
                      "title": "Material Balances on Non-Reactive Systems",
                      "topics": [
                        "Degree of Freedom Analysis",
                        "Balances on Multiple-Unit Processes",
                        "Recycle, Bypass, and Purge Streams"
                      ]
                    },
                    {
                      "id": "meb_ch2",
                      "title": "Material Balances on Reactive Systems",
                      "topics": [
                        "Stoichiometry",
                        "Limiting and Excess Reactants",
                        "Extent of Reaction and Atomic Balances",
                        "Combustion Reactions"
                      ]
                    },
                    {
                      "id": "meb_ch3",
                      "title": "Single-Phase Systems and Gas Laws",
                      "topics": [
                        "Ideal Gas Law",
                        "Real Gas Equations of State",
                        "Vapor Pressure and Saturation"
                      ]
                    },
                    {
                      "id": "meb_ch4",
                      "title": "Energy Balances",
                      "topics": [
                        "Forms of Energy",
                        "Enthalpy and Internal Energy",
                        "Energy Balances on Closed and Open Systems",
                        "Standard Heats of Reaction and Formation"
                      ]
                    }
                  ]
                },
                {
                  "code": "Chem2105",
                  "name": "Organic Chemistry I",
                  "description": "Study of the structure, properties, and reactions of organic compounds, focusing on alkanes, alkenes, alkynes, and stereochemistry. Essential for understanding petrochemical and polymer processes.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "org1_ch1",
                      "title": "Structure and Bonding",
                      "topics": [
                        "Atomic and Molecular Orbitals",
                        "Alkanes and Cycloalkanes",
                        "Conformational Analysis"
                      ]
                    },
                    {
                      "id": "org1_ch2",
                      "title": "Stereochemistry",
                      "topics": [
                        "Chirality",
                        "Enantiomers and Diastereomers",
                        "Optical Activity"
                      ]
                    },
                    {
                      "id": "org1_ch3",
                      "title": "Alkenes and Alkynes",
                      "topics": [
                        "Nomenclature and Structure",
                        "Addition Reactions (Electrophilic, Radical)",
                        "Synthesis of Alkenes and Alkynes"
                      ]
                    }
                  ]
                },
                {
                  "code": "Math2101",
                  "name": "Differential Equations",
                  "description": "Mathematical methods for solving ordinary differential equations (ODEs), which are fundamental for modeling transient behavior in chemical engineering processes.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "de_ch1",
                      "title": "First-Order Ordinary Differential Equations",
                      "topics": [
                        "Separable Equations",
                        "Linear Equations",
                        "Exact Equations"
                      ]
                    },
                    {
                      "id": "de_ch2",
                      "title": "Second-Order Linear ODEs",
                      "topics": [
                        "Homogeneous Equations with Constant Coefficients",
                        "Method of Undetermined Coefficients",
                        "Variation of Parameters"
                      ]
                    },
                    {
                      "id": "de_ch3",
                      "title": "The Laplace Transform",
                      "topics": [
                        "Definition and Properties",
                        "Solving Initial Value Problems",
                        "Step Functions and Impulse Functions"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "ChEE2102",
                  "name": "Chemical Engineering Thermodynamics I",
                  "description": "Fundamental principles of thermodynamics from a chemical engineering perspective. Covers the First and Second Laws, properties of pure fluids, and heat effects.",
                  "credits": 3,
                  "prerequisites": [
                    "ChEE2103"
                  ],
                  "outcomes": [
                    "Apply the First Law of Thermodynamics to closed and open systems.",
                    "Use equations of state to calculate thermodynamic properties of fluids.",
                    "Understand the concepts of entropy, reversibility, and the Second Law.",
                    "Analyze heat engines, refrigeration cycles, and power cycles."
                  ],
                  "chapters": [
                    {
                      "id": "thermo1_ch1",
                      "title": "The First Law of Thermodynamics",
                      "topics": [
                        "Energy, Heat, and Work",
                        "Enthalpy and Internal Energy",
                        "Control Volume Analysis"
                      ]
                    },
                    {
                      "id": "thermo1_ch2",
                      "title": "Volumetric Properties of Pure Fluids",
                      "topics": [
                        "Ideal Gas Law",
                        "Equations of State (van der Waals, Redlich-Kwong)",
                        "Compressibility Factor Charts"
                      ]
                    },
                    {
                      "id": "thermo1_ch3",
                      "title": "The Second Law of Thermodynamics",
                      "topics": [
                        "Statements of the Second Law",
                        "Entropy and Reversibility",
                        "Thermodynamic Temperature Scales"
                      ]
                    },
                    {
                      "id": "thermo1_ch4",
                      "title": "Thermodynamic Analysis of Processes",
                      "topics": [
                        "Power Cycles (Carnot, Rankine)",
                        "Refrigeration Cycles",
                        "Thermodynamic Efficiency"
                      ]
                    }
                  ]
                },
                {
                  "code": "ChEE2104",
                  "name": "Fluid Mechanics for Chemical Engineers",
                  "description": "Study of fluid behavior and its application in chemical processes. Covers fluid statics, conservation laws for fluid flow, and flow in pipes and around submerged objects.",
                  "credits": 3,
                  "outcomes": [
                    "Calculate forces on submerged surfaces and use manometers.",
                    "Apply the continuity, momentum, and Bernoulli equations to flow problems.",
                    "Analyze frictional losses in pipe flow and size pumps.",
                    "Understand boundary layers and flow past immersed bodies."
                  ],
                  "chapters": [
                    {
                      "id": "fm_ch1",
                      "title": "Fluid Statics",
                      "topics": [
                        "Pressure Variation in a Fluid",
                        "Manometry",
                        "Hydrostatic Forces on Submerged Surfaces"
                      ]
                    },
                    {
                      "id": "fm_ch2",
                      "title": "Integral Balances for Fluid Flow",
                      "topics": [
                        "Continuity Equation",
                        "Momentum Balance",
                        "Bernoulli and Mechanical Energy Equations"
                      ]
                    },
                    {
                      "id": "fm_ch3",
                      "title": "Flow in Pipes and Channels",
                      "topics": [
                        "Laminar and Turbulent Flow",
                        "Friction Factor and Moody Chart",
                        "Minor Losses"
                      ]
                    },
                    {
                      "id": "fm_ch4",
                      "title": "Pumps and Compressors",
                      "topics": [
                        "Pump Types and Performance Curves",
                        "Net Positive Suction Head (NPSH)",
                        "System Curve and Operating Point"
                      ]
                    }
                  ]
                },
                {
                  "code": "Chem2106",
                  "name": "Physical Chemistry",
                  "description": "Focuses on the physical principles underlying chemical systems, including quantum mechanics, spectroscopy, and chemical kinetics, providing a molecular-level understanding for thermodynamics and reaction engineering.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "pchem_ch1",
                      "title": "Quantum Mechanics and Atomic Structure",
                      "topics": [
                        "Wave-Particle Duality",
                        "The Schrödinger Equation",
                        "Atomic Orbitals"
                      ]
                    },
                    {
                      "id": "pchem_ch2",
                      "title": "Molecular Spectroscopy",
                      "topics": [
                        "Rotational and Vibrational Spectroscopy",
                        "UV-Visible Spectroscopy",
                        "Nuclear Magnetic Resonance (NMR)"
                      ]
                    },
                    {
                      "id": "pchem_ch3",
                      "title": "Chemical Kinetics",
                      "topics": [
                        "Rate Laws and Reaction Order",
                        "Arrhenius Equation and Activation Energy",
                        "Reaction Mechanisms"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 3": {
              "Semester I": [
                {
                  "code": "ChEE3101",
                  "name": "Chemical Engineering Thermodynamics II",
                  "description": "Advanced topics in thermodynamics focusing on the properties of mixtures, phase equilibria (VLE, LLE), and chemical reaction equilibria.",
                  "credits": 3,
                  "prerequisites": [
                    "ChEE2102"
                  ],
                  "outcomes": [
                    "Apply activity coefficient models to describe non-ideal liquid mixtures.",
                    "Perform vapor-liquid equilibrium (VLE) calculations for ideal and non-ideal systems.",
                    "Calculate equilibrium constants and conversions for chemical reactions.",
                    "Understand and apply the concepts of fugacity and Gibbs energy."
                  ],
                  "chapters": [
                    {
                      "id": "thermo2_ch1",
                      "title": "Solution Thermodynamics",
                      "topics": [
                        "Fundamental Property Relations",
                        "Fugacity and Fugacity Coefficient",
                        "Ideal and Non-ideal Solutions"
                      ]
                    },
                    {
                      "id": "thermo2_ch2",
                      "title": "Phase Equilibria",
                      "topics": [
                        "Vapor-Liquid Equilibrium (VLE)",
                        "Raoult's Law and Modified Raoult's Law",
                        "Activity Coefficient Models (Wilson, NRTL)"
                      ]
                    },
                    {
                      "id": "thermo2_ch3",
                      "title": "Chemical Reaction Equilibria",
                      "topics": [
                        "The Reaction Coordinate",
                        "Equilibrium Constant (K)",
                        "Effect of Temperature and Pressure on K",
                        "Equilibrium in Multireaction Systems"
                      ]
                    }
                  ]
                },
                {
                  "code": "ChEE3103",
                  "name": "Heat Transfer",
                  "description": "Study of the modes of heat transfer (conduction, convection, radiation) and their application in the design of chemical process equipment, particularly heat exchangers.",
                  "credits": 3,
                  "prerequisites": [
                    "ChEE2104"
                  ],
                  "outcomes": [
                    "Solve one-dimensional steady-state and transient conduction problems.",
                    "Use correlations to calculate heat transfer coefficients for forced and natural convection.",
                    "Design and analyze the performance of shell-and-tube heat exchangers.",
                    "Analyze radiative heat transfer between surfaces."
                  ],
                  "chapters": [
                    {
                      "id": "ht_ch1",
                      "title": "Conduction",
                      "topics": [
                        "Fourier's Law",
                        "Thermal Resistance Networks",
                        "Extended Surfaces (Fins)",
                        "Transient Conduction"
                      ]
                    },
                    {
                      "id": "ht_ch2",
                      "title": "Convection",
                      "topics": [
                        "Boundary Layers",
                        "Forced Convection (Internal and External Flow)",
                        "Natural Convection"
                      ]
                    },
                    {
                      "id": "ht_ch3",
                      "title": "Heat Exchangers",
                      "topics": [
                        "Types of Heat Exchangers",
                        "Log Mean Temperature Difference (LMTD) Method",
                        "Effectiveness-NTU Method"
                      ]
                    },
                    {
                      "id": "ht_ch4",
                      "title": "Radiation",
                      "topics": [
                        "Blackbody Radiation",
                        "View Factors",
                        "Radiation Exchange between Surfaces"
                      ]
                    }
                  ]
                },
                {
                  "code": "ChEE3105",
                  "name": "Mass Transfer and Separation Processes I",
                  "description": "Fundamentals of molecular and convective mass transfer, with applications to the design of key separation equipment like gas absorbers and distillation columns.",
                  "credits": 3,
                  "outcomes": [
                    "Apply Fick's law to solve molecular diffusion problems.",
                    "Use correlations to calculate mass transfer coefficients.",
                    "Design staged gas absorption and stripping columns.",
                    "Design binary distillation columns using the McCabe-Thiele method."
                  ],
                  "chapters": [
                    {
                      "id": "mt_ch1",
                      "title": "Fundamentals of Mass Transfer",
                      "topics": [
                        "Molecular Diffusion (Fick's Law)",
                        "Convective Mass Transfer",
                        "Mass Transfer Coefficients"
                      ]
                    },
                    {
                      "id": "mt_ch2",
                      "title": "Gas Absorption and Stripping",
                      "topics": [
                        "Equilibrium Relations",
                        "Stagewise Contact (Tray Towers)",
                        "Continuous Contact (Packed Towers)"
                      ]
                    },
                    {
                      "id": "mt_ch3",
                      "title": "Distillation",
                      "topics": [
                        "Vapor-Liquid Equilibrium (VLE)",
                        "Flash Distillation",
                        "Binary Distillation: McCabe-Thiele Method"
                      ]
                    },
                    {
                      "id": "mt_ch4",
                      "title": "Multi-Component Distillation",
                      "topics": [
                        "Key Components",
                        "Minimum Reflux and Minimum Stages",
                        "Introduction to Rigorous Methods"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "ChEE3102",
                  "name": "Chemical Reaction Engineering",
                  "description": "The study of chemical reaction rates and the design of chemical reactors. Covers rate laws, design equations for ideal reactors, and analysis of temperature and pressure effects.",
                  "credits": 3,
                  "prerequisites": [
                    "ChEE3101"
                  ],
                  "outcomes": [
                    "Determine reaction rate laws from experimental data.",
                    "Design ideal isothermal batch reactors, CSTRs, and PFRs.",
                    "Analyze the effects of temperature on reactor performance.",
                    "Understand the fundamentals of catalysis and catalytic reactor design."
                  ],
                  "chapters": [
                    {
                      "id": "cre_ch1",
                      "title": "Kinetics and Rate Laws",
                      "topics": [
                        "Reaction Rate Definition",
                        "Rate Law and Reaction Order",
                        "Analysis of Batch Reactor Data"
                      ]
                    },
                    {
                      "id": "cre_ch2",
                      "title": "Isothermal Reactor Design",
                      "topics": [
                        "Design Equations for Batch, CSTR, PFR",
                        "Reactors in Series and Parallel",
                        "Multiple Reactions"
                      ]
                    },
                    {
                      "id": "cre_ch3",
                      "title": "Non-Isothermal Reactor Design",
                      "topics": [
                        "The Energy Balance",
                        "Adiabatic Reactor Operation",
                        "Reactors with Heat Exchange"
                      ]
                    },
                    {
                      "id": "cre_ch4",
                      "title": "Catalysis",
                      "topics": [
                        "Catalyst Properties",
                        "External and Internal Diffusion Effects",
                        "Design of Catalytic Reactors"
                      ]
                    }
                  ]
                },
                {
                  "code": "ChEE3104",
                  "name": "Separation Processes II",
                  "description": "Continuation of separation processes, covering methods like liquid-liquid extraction, adsorption, membrane separations, and crystallization.",
                  "credits": 2,
                  "prerequisites": [
                    "ChEE3105"
                  ],
                  "outcomes": [
                    "Design liquid-liquid extraction systems using ternary diagrams.",
                    "Analyze adsorption processes and design fixed-bed adsorbers.",
                    "Understand the principles of membrane separation techniques like reverse osmosis.",
                    "Describe the fundamentals of crystallization."
                  ],
                  "chapters": [
                    {
                      "id": "sep2_ch1",
                      "title": "Liquid-Liquid Extraction",
                      "topics": [
                        "Equilibrium in Ternary Systems",
                        "Single-Stage and Multistage Extraction",
                        "Countercurrent Extraction"
                      ]
                    },
                    {
                      "id": "sep2_ch2",
                      "title": "Adsorption, Ion Exchange, and Chromatography",
                      "topics": [
                        "Adsorbents and Adsorption Isotherms",
                        "Fixed-Bed Adsorbers",
                        "Principles of Chromatography"
                      ]
                    },
                    {
                      "id": "sep2_ch3",
                      "title": "Membrane Separations",
                      "topics": [
                        "Reverse Osmosis",
                        "Ultrafiltration and Nanofiltration",
                        "Gas Permeation"
                      ]
                    }
                  ]
                },
                {
                  "code": "ChEE3106",
                  "name": "Unit Operations Laboratory I",
                  "description": "Hands-on experience with key chemical engineering equipment. Experiments focus on fluid flow, heat transfer, and basic separations, emphasizing data collection, analysis, and technical report writing.",
                  "credits": 2,
                  "outcomes": [
                    "Safely operate bench-scale and pilot-scale chemical process equipment.",
                    "Collect and analyze experimental data to verify theoretical principles.",
                    "Work effectively in a team to conduct experiments.",
                    "Write a formal engineering laboratory report."
                  ],
                  "chapters": [
                    {
                      "id": "uolab1_ch1",
                      "title": "Laboratory Safety and Data Analysis",
                      "topics": [
                        "Chemical Safety and PPE",
                        "Error Analysis",
                        "Technical Report Writing"
                      ]
                    },
                    {
                      "id": "uolab1_ch2",
                      "title": "Fluid Mechanics Experiments",
                      "topics": [
                        "Pressure Drop in Pipes and Fittings",
                        "Pump Performance Curves",
                        "Flow Measurement"
                      ]
                    },
                    {
                      "id": "uolab1_ch3",
                      "title": "Heat Transfer Experiments",
                      "topics": [
                        "Shell-and-Tube Heat Exchanger Performance",
                        "Conduction and Convection Measurements"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 4": {
              "Semester I": [
                {
                  "code": "ChEE4101",
                  "name": "Process Dynamics and Control",
                  "description": "Modeling the dynamic behavior of chemical processes and designing feedback control systems to ensure safe and efficient operation. Focuses on PID controllers.",
                  "credits": 3,
                  "prerequisites": [
                    "Math2101",
                    "ChEE3102"
                  ],
                  "outcomes": [
                    "Develop dynamic models of chemical processes using conservation laws.",
                    "Analyze the response of first and second-order systems.",
                    "Design and tune PID controllers for common processes.",
                    "Analyze the stability of feedback control systems."
                  ],
                  "chapters": [
                    {
                      "id": "pdc_ch1",
                      "title": "Dynamic Modeling and Laplace Transforms",
                      "topics": [
                        "Modeling of Chemical Processes",
                        "Laplace Transforms and Transfer Functions",
                        "Linearization of Nonlinear Models"
                      ]
                    },
                    {
                      "id": "pdc_ch2",
                      "title": "Dynamic Behavior of Processes",
                      "topics": [
                        "First-Order Systems",
                        "Second-Order Systems",
                        "Dynamic Response to Standard Inputs"
                      ]
                    },
                    {
                      "id": "pdc_ch3",
                      "title": "Feedback Control Systems",
                      "topics": [
                        "PID Controller Algorithms",
                        "Block Diagram Representation",
                        "Closed-Loop Transfer Functions"
                      ]
                    },
                    {
                      "id": "pdc_ch4",
                      "title": "Controller Tuning and Stability",
                      "topics": [
                        "Concept of Stability",
                        "Controller Tuning Methods (Ziegler-Nichols)",
                        "Introduction to Frequency Response"
                      ]
                    }
                  ]
                },
                {
                  "code": "ChEE4103",
                  "name": "Chemical Engineering Plant Design I",
                  "description": "The first course in a two-part capstone design sequence. Focuses on process synthesis, flowsheet development, preliminary economic analysis, and safety and environmental considerations for a chemical plant.",
                  "credits": 3,
                  "prerequisites": [
                    "ChEE3102",
                    "ChEE3105"
                  ],
                  "outcomes": [
                    "Develop and synthesize a process flowsheet to produce a specified chemical.",
                    "Perform a preliminary economic evaluation of a process.",
                    "Incorporate safety and environmental considerations into the initial design.",
                    "Work in a design team and produce a preliminary design report."
                  ],
                  "chapters": [
                    {
                      "id": "design1_ch1",
                      "title": "Process Synthesis and Flowsheet Development",
                      "topics": [
                        "The Design Process",
                        "Choice of Reactor and Separation System",
                        "Process Flow Diagrams (PFDs)"
                      ]
                    },
                    {
                      "id": "design1_ch2",
                      "title": "Preliminary Economic Analysis",
                      "topics": [
                        "Capital Cost Estimation",
                        "Operating Cost Estimation",
                        "Initial Profitability Analysis"
                      ]
                    },
                    {
                      "id": "design1_ch3",
                      "title": "Health, Safety, and Environmental Considerations",
                      "topics": [
                        "Inherent Safety",
                        "Environmental Regulations",
                        "Material Safety Data Sheets (MSDS)"
                      ]
                    }
                  ]
                },
                {
                  "code": "ChEE4105",
                  "name": "Transport Phenomena",
                  "description": "A theoretical course that provides a unified treatment of momentum, heat, and mass transfer from a microscopic perspective, based on shell balances and the equations of change.",
                  "credits": 3,
                  "prerequisites": [
                    "ChEE2104",
                    "ChEE3103",
                    "ChEE3105"
                  ],
                  "outcomes": [
                    "Derive velocity profiles for laminar flow using shell momentum balances.",
                    "Derive temperature profiles for conduction using shell energy balances.",
                    "Derive concentration profiles for diffusion using shell mass balances.",
                    "Understand the analogies between momentum, heat, and mass transfer."
                  ],
                  "chapters": [
                    {
                      "id": "tp_ch1",
                      "title": "Momentum Transport",
                      "topics": [
                        "Viscosity and Newton's Law",
                        "Shell Momentum Balances",
                        "The Equations of Change"
                      ]
                    },
                    {
                      "id": "tp_ch2",
                      "title": "Energy Transport",
                      "topics": [
                        "Thermal Conductivity and Fourier's Law",
                        "Shell Energy Balances",
                        "The Equation of Energy"
                      ]
                    },
                    {
                      "id": "tp_ch3",
                      "title": "Mass Transport",
                      "topics": [
                        "Diffusivity and Fick's Law",
                        "Shell Mass Balances",
                        "The Equation of Continuity for a Binary Mixture"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "ChEE4102",
                  "name": "Chemical Engineering Plant Design II",
                  "description": "The conclusion of the capstone design sequence. Students complete a detailed design of a chemical plant, including equipment sizing, detailed costing, plant layout, and a comprehensive final report and presentation.",
                  "credits": 3,
                  "prerequisites": [
                    "ChEE4103"
                  ],
                  "outcomes": [
                    "Perform detailed design and sizing calculations for major process equipment.",
                    "Develop a Piping and Instrumentation Diagram (P&ID).",
                    "Conduct a detailed economic analysis and profitability assessment.",
                    "Prepare and defend a comprehensive, professional-quality design report."
                  ],
                  "chapters": [
                    {
                      "id": "design2_ch1",
                      "title": "Equipment Design and Sizing",
                      "topics": [
                        "Reactor Design",
                        "Heat Exchanger Design",
                        "Distillation Column Sizing",
                        "Pump and Vessel Sizing"
                      ]
                    },
                    {
                      "id": "design2_ch2",
                      "title": "Piping and Instrumentation",
                      "topics": [
                        "Piping and Instrumentation Diagrams (P&IDs)",
                        "Control System Design",
                        "Plant Layout and Spacing"
                      ]
                    },
                    {
                      "id": "design2_ch3",
                      "title": "Detailed Economic Analysis",
                      "topics": [
                        "Detailed Capital Costing",
                        "Profitability Metrics (NPV, DCFROR)",
                        "Sensitivity Analysis"
                      ]
                    }
                  ]
                },
                {
                  "code": "ChEE4104",
                  "name": "Process Safety Engineering",
                  "description": "A critical study of process safety, focusing on hazard identification, risk assessment, and the design of protective systems to prevent and mitigate industrial accidents.",
                  "credits": 3,
                  "outcomes": [
                    "Identify potential hazards using methods like HAZOP and What-If analysis.",
                    "Analyze accident toxicology and source models.",
                    "Design pressure relief systems for process vessels.",
                    "Understand the principles of inherent safety and risk management."
                  ],
                  "chapters": [
                    {
                      "id": "pse_ch1",
                      "title": "Hazard Identification",
                      "topics": [
                        "Toxicology",
                        "Fires and Explosions",
                        "Hazard and Operability Studies (HAZOP)"
                      ]
                    },
                    {
                      "id": "pse_ch2",
                      "title": "Risk Assessment",
                      "topics": [
                        "Source Models for Releases",
                        "Dispersion Modeling",
                        "Frequency Analysis (Fault Trees, Event Trees)"
                      ]
                    },
                    {
                      "id": "pse_ch3",
                      "title": "Design for Safety",
                      "topics": [
                        "Pressure Relief System Design",
                        "Inerting and Purging",
                        "Case Studies (Bhopal, Flixborough)"
                      ]
                    }
                  ]
                },
                {
                  "code": "ChEE4106",
                  "name": "Unit Operations Laboratory II",
                  "description": "Advanced laboratory experiments focusing on mass transfer, reaction engineering, and process control, culminating in an open-ended project.",
                  "credits": 2,
                  "prerequisites": [
                    "ChEE3106"
                  ],
                  "outcomes": [
                    "Analyze the performance of distillation and absorption columns.",
                    "Determine kinetic parameters from experimental reactor data.",
                    "Implement and tune a feedback control loop on a physical system.",
                    "Independently design and execute a simple experiment."
                  ],
                  "chapters": [
                    {
                      "id": "uolab2_ch1",
                      "title": "Mass Transfer Experiments",
                      "topics": [
                        "Distillation Column Performance",
                        "Gas Absorption",
                        "Liquid-Liquid Extraction"
                      ]
                    },
                    {
                      "id": "uolab2_ch2",
                      "title": "Reaction Engineering Experiments",
                      "topics": [
                        "Batch Reactor Kinetics",
                        "CSTR and PFR Performance"
                      ]
                    },
                    {
                      "id": "uolab2_ch3",
                      "title": "Process Control Experiments",
                      "topics": [
                        "Tuning a PID Controller",
                        "System Identification"
                      ]
                    }
                  ]
                }
              ],
              "Semester III (Summer)": [
                {
                  "code": "ChEE4112",
                  "name": "Internship",
                  "description": "Supervised practical work experience in a chemical engineering or related organization. Students apply their academic knowledge in a real-world setting and submit a report on their experience.",
                  "credits": 0,
                  "outcomes": [
                    "Gain practical experience in a professional engineering environment.",
                    "Develop professional skills like teamwork, communication, and project management.",
                    "Bridge the gap between academic theory and industry practice."
                  ],
                  "chapters": []
                }
              ]
            },
            "Year 5": {
              "Semester I": [
                {
                  "code": "ChEE5101",
                  "name": "B.Sc. Thesis I",
                  "description": "The first phase of the final year thesis project. Students work with a faculty advisor to identify a research topic, conduct a literature survey, define the scope and methodology, and write a detailed research proposal.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "ChEE5103",
                  "name": "Process Modeling and Simulation",
                  "description": "Use of commercial software packages (like Aspen HYSYS or Plus) to model, simulate, and optimize chemical processes. Covers steady-state and dynamic simulation.",
                  "credits": 3,
                  "outcomes": [
                    "Build a steady-state process simulation in a commercial software package.",
                    "Select appropriate thermodynamic property packages.",
                    "Use simulation tools for process optimization and sensitivity analysis.",
                    "Understand the principles of dynamic simulation."
                  ],
                  "chapters": [
                    {
                      "id": "pms_ch1",
                      "title": "Introduction to Process Simulation",
                      "topics": [
                        "The Role of Simulation in Design",
                        "Introduction to Aspen HYSYS/Plus",
                        "Defining Components and Property Packages"
                      ]
                    },
                    {
                      "id": "pms_ch2",
                      "title": "Steady-State Simulation",
                      "topics": [
                        "Modeling Unit Operations (Reactors, Separators)",
                        "Flowsheet Convergence",
                        "Recycle Loops"
                      ]
                    },
                    {
                      "id": "pms_ch3",
                      "title": "Optimization and Analysis",
                      "topics": [
                        "Sensitivity Analysis",
                        "Case Studies",
                        "Process Optimization"
                      ]
                    }
                  ]
                },
                {
                  "code": "ChEE5201",
                  "name": "Elective I",
                  "description": "Students select a specialized course from a list of approved technical electives such as Polymer Engineering, Biochemical Engineering, or Petroleum Refining.",
                  "credits": 3,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "ChEE5102",
                  "name": "B.Sc. Thesis II",
                  "description": "The second and final phase of the thesis project. Students execute their research plan, collect and analyze data, draw conclusions, and write the final thesis document, culminating in a final oral defense.",
                  "credits": 4,
                  "prerequisites": [
                    "ChEE5101"
                  ],
                  "chapters": []
                },
                {
                  "code": "ChEE5104",
                  "name": "Professional Ethics and Law for Engineers",
                  "description": "Exploration of the ethical, legal, and social issues facing engineers. Covers professional codes of conduct, liability, intellectual property, and the engineer's role in society.",
                  "credits": 2,
                  "chapters": [
                    {
                      "id": "ethics_ch1",
                      "title": "Codes of Conduct and Ethical Frameworks",
                      "topics": [
                        "NSPE/AIChE Codes of Ethics",
                        "Utilitarianism vs. Deontology",
                        "Case Study Analysis"
                      ]
                    },
                    {
                      "id": "ethics_ch2",
                      "title": "Legal Aspects of Engineering",
                      "topics": [
                        "Contract Law",
                        "Tort and Liability",
                        "Intellectual Property (Patents, Copyrights)"
                      ]
                    }
                  ]
                },
                {
                  "code": "ChEE5202",
                  "name": "Elective II",
                  "description": "Students select a second specialized course from a list of approved technical electives such as Advanced Process Control, Catalysis, or Environmental Engineering.",
                  "credits": 3,
                  "chapters": []
                }
              ]
            }
          }
        },
        {
          "name": "Environmental Engineering",
          "abbreviation": "EnVE",
          "coursesByYearSemester": {
            "Year 2": {
              "Semester I": [
                {
                  "code": "EnVE2101",
                  "name": "Introduction to Environmental Engineering",
                  "description": "An overview of environmental systems and the role of engineers in addressing pollution. Covers fundamental principles of mass and energy balance applied to environmental problems.",
                  "credits": 3,
                  "outcomes": [
                    "Identify major environmental challenges (water, air, land pollution).",
                    "Apply mass and energy balance principles to environmental systems.",
                    "Understand the basic concepts of environmental risk assessment.",
                    "Describe the legislative and ethical context of environmental engineering."
                  ],
                  "chapters": [
                    {
                      "id": "iee_ch1",
                      "title": "Environmental Systems and Sustainability",
                      "topics": [
                        "The Earth's Systems (Hydrosphere, Atmosphere, Lithosphere)",
                        "Sustainability Concepts",
                        "Environmental Ethics and Regulations"
                      ]
                    },
                    {
                      "id": "iee_ch2",
                      "title": "Mass and Energy Balance",
                      "topics": [
                        "The General Balance Equation",
                        "Control Volumes in Environmental Systems",
                        "Simple Reactor Models (Batch, CSTR, PFR)"
                      ]
                    },
                    {
                      "id": "iee_ch3",
                      "title": "Overview of Water and Air Pollution",
                      "topics": [
                        "Major Water Pollutants and Sources",
                        "Major Air Pollutants and Sources",
                        "Introduction to Pollution Control Strategies"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng2005",
                  "name": "Engineering Mechanics I (Statics)",
                  "description": "A study of the equilibrium of particles and rigid bodies under the action of forces. Topics include vector algebra, force systems, equilibrium conditions, structural analysis of trusses and frames, friction, and centroids.",
                  "credits": 3,
                  "chapters": []
                },
                {
                  "code": "Chem2101",
                  "name": "Analytical Chemistry",
                  "description": "Principles of chemical analysis, including titrimetry, electrochemistry, spectroscopy, and chromatography, with a focus on environmental sample analysis.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "ac_ch1",
                      "title": "Fundamentals of Chemical Analysis",
                      "topics": [
                        "Errors in Chemical Analysis",
                        "Statistical Data Treatment",
                        "Gravimetric and Titrimetric Methods"
                      ]
                    },
                    {
                      "id": "ac_ch2",
                      "title": "Spectroscopic Methods",
                      "topics": [
                        "UV-Visible Spectroscopy",
                        "Atomic Absorption/Emission Spectroscopy"
                      ]
                    },
                    {
                      "id": "ac_ch3",
                      "title": "Chromatographic Methods",
                      "topics": [
                        "Gas Chromatography (GC)",
                        "High-Performance Liquid Chromatography (HPLC)"
                      ]
                    }
                  ]
                },
                {
                  "code": "Math2101",
                  "name": "Differential Equations",
                  "description": "Mathematical methods for solving ordinary differential equations (ODEs), fundamental for modeling transient behavior in environmental systems.",
                  "credits": 3,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "EnVE2102",
                  "name": "Environmental Chemistry",
                  "description": "Application of chemical principles to understand the composition and reactions occurring in natural waters, the atmosphere, and soils.",
                  "credits": 3,
                  "prerequisites": [
                    "Chem2101"
                  ],
                  "outcomes": [
                    "Analyze acid-base and carbonate chemistry in aquatic systems.",
                    "Understand oxidation-reduction reactions relevant to environmental fate.",
                    "Describe key chemical reactions occurring in the atmosphere.",
                    "Evaluate the partitioning of chemicals between environmental phases."
                  ],
                  "chapters": [
                    {
                      "id": "ec_ch1",
                      "title": "Aquatic Chemistry",
                      "topics": [
                        "Chemical Equilibrium",
                        "Acid-Base Chemistry and Alkalinity",
                        "The Carbonate System"
                      ]
                    },
                    {
                      "id": "ec_ch2",
                      "title": "Redox Chemistry and Contaminant Fate",
                      "topics": [
                        "Oxidation-Reduction Reactions",
                        "Eh-pH Diagrams",
                        "Chemical Partitioning (Adsorption, Volatilization)"
                      ]
                    },
                    {
                      "id": "ec_ch3",
                      "title": "Atmospheric Chemistry",
                      "topics": [
                        "Tropospheric Chemistry (Smog Formation)",
                        "Stratospheric Chemistry (Ozone Depletion)",
                        "Acid Rain"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng2106",
                  "name": "Hydraulics",
                  "description": "Introduction to the mechanics of fluids, including fluid properties, hydrostatics, and the principles of fluid flow in pipes and open channels, essential for water and wastewater systems.",
                  "credits": 3,
                  "chapters": []
                },
                {
                  "code": "MEng2103",
                  "name": "Engineering Thermodynamics",
                  "description": "Principles of thermodynamics and energy conversion, with applications in waste-to-energy systems and thermal pollution analysis.",
                  "credits": 3,
                  "chapters": []
                }
              ]
            },
            "Year 3": {
              "Semester I": [
                {
                  "code": "EnVE3101",
                  "name": "Water Supply and Treatment",
                  "description": "Design of systems for producing potable water from various sources. Covers unit operations like coagulation, flocculation, sedimentation, filtration, and disinfection.",
                  "credits": 3,
                  "prerequisites": [
                    "EnVE2101",
                    "CEng2106"
                  ],
                  "outcomes": [
                    "Assess source water quality and determine treatment objectives.",
                    "Design coagulation, flocculation, and sedimentation basins.",
                    "Design rapid sand filters.",
                    "Design disinfection systems and analyze disinfection kinetics."
                  ],
                  "chapters": [
                    {
                      "id": "wst_ch1",
                      "title": "Water Quality and Standards",
                      "topics": [
                        "Sources of Water",
                        "Drinking Water Quality Parameters and Regulations"
                      ]
                    },
                    {
                      "id": "wst_ch2",
                      "title": "Coagulation and Flocculation",
                      "topics": [
                        "Colloid Stability",
                        "Coagulant Chemistry",
                        "Design of Rapid Mix and Flocculation Basins"
                      ]
                    },
                    {
                      "id": "wst_ch3",
                      "title": "Sedimentation and Filtration",
                      "topics": [
                        "Theory of Sedimentation",
                        "Clarifier Design",
                        "Rapid and Slow Sand Filtration"
                      ]
                    },
                    {
                      "id": "wst_ch4",
                      "title": "Disinfection and Advanced Treatment",
                      "topics": [
                        "Chlorination and Disinfection Byproducts",
                        "UV Disinfection",
                        "Membrane Filtration and Adsorption"
                      ]
                    }
                  ]
                },
                {
                  "code": "EnVE3103",
                  "name": "Environmental Microbiology",
                  "description": "Study of microorganisms and their role in natural environmental cycles and engineered treatment processes, including wastewater treatment and bioremediation.",
                  "credits": 3,
                  "outcomes": [
                    "Identify key groups of microorganisms in environmental systems.",
                    "Understand microbial metabolism and kinetics.",
                    "Describe the role of microbes in nutrient cycling (N, P, S).",
                    "Analyze the microbial basis of biological treatment processes."
                  ],
                  "chapters": [
                    {
                      "id": "em_ch1",
                      "title": "Microbial Fundamentals",
                      "topics": [
                        "Cell Structure and Function",
                        "Microbial Metabolism and Energetics",
                        "Microbial Growth Kinetics"
                      ]
                    },
                    {
                      "id": "em_ch2",
                      "title": "Aquatic and Soil Microbiology",
                      "topics": [
                        "Nutrient Cycles (Carbon, Nitrogen, Phosphorus)",
                        "Microbiology of Natural Waters and Soils"
                      ]
                    },
                    {
                      "id": "em_ch3",
                      "title": "Applied Microbiology",
                      "topics": [
                        "Microbiology of Wastewater Treatment",
                        "Bioremediation",
                        "Waterborne Pathogens"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng3108",
                  "name": "Engineering Hydrology",
                  "description": "Study of the hydrologic cycle, including precipitation, evaporation, infiltration, and surface runoff, with applications in stormwater management and water resource analysis.",
                  "credits": 2,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "EnVE3102",
                  "name": "Wastewater Engineering",
                  "description": "Design of municipal wastewater collection and treatment systems. Covers preliminary, primary, secondary (biological), and advanced treatment processes, as well as sludge management.",
                  "credits": 3,
                  "prerequisites": [
                    "EnVE3101",
                    "EnVE3103"
                  ],
                  "outcomes": [
                    "Characterize municipal wastewater and estimate flow rates.",
                    "Design preliminary and primary treatment units.",
                    "Design activated sludge and other biological treatment systems.",
                    "Develop a process for sludge treatment and disposal."
                  ],
                  "chapters": [
                    {
                      "id": "wwe_ch1",
                      "title": "Wastewater Characterization and Collection",
                      "topics": [
                        "Wastewater Characteristics (BOD, COD, N, P)",
                        "Flow Rate Estimation",
                        "Sewer System Design"
                      ]
                    },
                    {
                      "id": "wwe_ch2",
                      "title": "Primary and Secondary Treatment",
                      "topics": [
                        "Screening and Grit Removal",
                        "Primary Clarifier Design",
                        "Activated Sludge Process Design"
                      ]
                    },
                    {
                      "id": "wwe_ch3",
                      "title": "Advanced Treatment and Nutrient Removal",
                      "topics": [
                        "Biological Nutrient Removal (BNR)",
                        "Tertiary Filtration",
                        "Disinfection"
                      ]
                    },
                    {
                      "id": "wwe_ch4",
                      "title": "Sludge Processing and Disposal",
                      "topics": [
                        "Thickening and Dewatering",
                        "Anaerobic Digestion",
                        "Sludge Disposal Options"
                      ]
                    }
                  ]
                },
                {
                  "code": "EnVE3104",
                  "name": "Air Pollution Control",
                  "description": "Study of the sources, effects, dispersion, and control of air pollutants. Includes the design of control equipment for particulate and gaseous pollutants.",
                  "credits": 3,
                  "outcomes": [
                    "Identify major air pollutants and their sources.",
                    "Apply atmospheric dispersion models to estimate pollutant concentrations.",
                    "Design control devices for particulate matter (e.g., cyclones, ESPs).",
                    "Design control devices for gaseous pollutants (e.g., absorbers, adsorbers)."
                  ],
                  "chapters": [
                    {
                      "id": "apc_ch1",
                      "title": "Air Pollution Fundamentals",
                      "topics": [
                        "Sources and Effects of Air Pollutants",
                        "Air Quality Regulations",
                        "Atmospheric Dispersion Modeling (Gaussian Plume)"
                      ]
                    },
                    {
                      "id": "apc_ch2",
                      "title": "Particulate Matter Control",
                      "topics": [
                        "Cyclones",
                        "Electrostatic Precipitators (ESPs)",
                        "Baghouses",
                        "Scrubbers"
                      ]
                    },
                    {
                      "id": "apc_ch3",
                      "title": "Gaseous Pollutant Control",
                      "topics": [
                        "Absorption (Packed Towers)",
                        "Adsorption (Carbon Beds)",
                        "Incineration and Catalytic Conversion"
                      ]
                    }
                  ]
                },
                {
                  "code": "EnVE3106",
                  "name": "Solid and Hazardous Waste Management",
                  "description": "Principles of managing municipal solid waste and hazardous waste, including collection, treatment, recycling, and disposal in engineered landfills.",
                  "credits": 3,
                  "outcomes": [
                    "Characterize solid waste and design collection systems.",
                    "Design a modern sanitary landfill, including liners and leachate collection.",
                    "Understand the regulatory framework for hazardous waste.",
                    "Evaluate waste-to-energy and recycling technologies."
                  ],
                  "chapters": [
                    {
                      "id": "shwm_ch1",
                      "title": "Municipal Solid Waste (MSW)",
                      "topics": [
                        "Waste Characterization and Generation Rates",
                        "Collection and Transfer Systems",
                        "Recycling and Composting"
                      ]
                    },
                    {
                      "id": "shwm_ch2",
                      "title": "Sanitary Landfills",
                      "topics": [
                        "Site Selection",
                        "Design of Liners and Covers",
                        "Leachate and Gas Management"
                      ]
                    },
                    {
                      "id": "shwm_ch3",
                      "title": "Hazardous Waste Management",
                      "topics": [
                        "Hazardous Waste Definition and Regulations (RCRA)",
                        "Treatment Technologies (Physical, Chemical, Thermal)",
                        "Secure Landfills"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 4": {
              "Semester I": [
                {
                  "code": "EnVE4101",
                  "name": "Environmental Impact Assessment (EIA)",
                  "description": "Methodologies and legal frameworks for assessing the potential environmental impacts of proposed projects, plans, and policies.",
                  "credits": 3,
                  "outcomes": [
                    "Understand the legal requirements for EIA.",
                    "Conduct scoping and baseline studies.",
                    "Apply methods for predicting and evaluating impacts.",
                    "Develop mitigation measures and monitoring plans."
                  ],
                  "chapters": [
                    {
                      "id": "eia_ch1",
                      "title": "EIA Framework",
                      "topics": [
                        "Legal Basis and Process Overview",
                        "Public Participation",
                        "Strategic Environmental Assessment (SEA)"
                      ]
                    },
                    {
                      "id": "eia_ch2",
                      "title": "Impact Identification and Prediction",
                      "topics": [
                        "Scoping and Baseline Data Collection",
                        "Impact Matrices and Checklists",
                        "Predictive Models (Air, Water, Noise)"
                      ]
                    },
                    {
                      "id": "eia_ch3",
                      "title": "Mitigation and Reporting",
                      "topics": [
                        "Impact Significance and Evaluation",
                        "Development of Mitigation Measures",
                        "Environmental Management Plans (EMP)"
                      ]
                    }
                  ]
                },
                {
                  "code": "EnVE4103",
                  "name": "Groundwater Hydrology and Remediation",
                  "description": "Study of groundwater flow, contaminant transport in the subsurface, and the design of systems for the remediation of contaminated sites.",
                  "credits": 3,
                  "prerequisites": [
                    "CEng3108"
                  ],
                  "outcomes": [
                    "Apply Darcy's Law to solve groundwater flow problems.",
                    "Analyze contaminant transport via advection, dispersion, and reaction.",
                    "Design groundwater monitoring well networks.",
                    "Select and design appropriate remediation technologies."
                  ],
                  "chapters": [
                    {
                      "id": "ghr_ch1",
                      "title": "Groundwater Flow",
                      "topics": [
                        "Aquifers and Aquitards",
                        "Darcy's Law and Hydraulic Conductivity",
                        "Flow Nets and Well Hydraulics"
                      ]
                    },
                    {
                      "id": "ghr_ch2",
                      "title": "Contaminant Transport",
                      "topics": [
                        "Advection-Dispersion Equation",
                        "Sorption and Biodegradation",
                        "Non-Aqueous Phase Liquids (NAPLs)"
                      ]
                    },
                    {
                      "id": "ghr_ch3",
                      "title": "Site Characterization and Remediation",
                      "topics": [
                        "Subsurface Investigation",
                        "Pump-and-Treat Systems",
                        "In-Situ Remediation (Bioremediation, Chemical Oxidation)"
                      ]
                    }
                  ]
                },
                {
                  "code": "EnVE4105",
                  "name": "Environmental Engineering Laboratory",
                  "description": "Practical experiments covering water and wastewater analysis (BOD, COD, nutrients, solids), treatability studies, and air and soil sampling techniques.",
                  "credits": 2,
                  "outcomes": [
                    "Perform standard analytical procedures for environmental samples.",
                    "Conduct bench-scale treatability tests for water and wastewater.",
                    "Calibrate and use air and soil sampling equipment.",
                    "Analyze and present laboratory data in a professional report."
                  ],
                  "chapters": [
                    {
                      "id": "eel_ch1",
                      "title": "Water Quality Analysis",
                      "topics": [
                        "Biochemical Oxygen Demand (BOD)",
                        "Chemical Oxygen Demand (COD)",
                        "Solids Analysis (TSS, VSS)"
                      ]
                    },
                    {
                      "id": "eel_ch2",
                      "title": "Treatability Studies",
                      "topics": [
                        "Jar Testing for Coagulation",
                        "Batch Reactor Kinetics",
                        "Adsorption Isotherms"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "EnVE4102",
                  "name": "Environmental Engineering Design I",
                  "description": "The first course in a capstone design sequence where student teams address a real-world environmental engineering problem, covering problem definition, alternatives analysis, and preliminary design.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "EnVE4104",
                  "name": "Industrial Waste Management",
                  "description": "Focuses on the management and treatment of liquid and solid wastes from specific industries, emphasizing pollution prevention and resource recovery.",
                  "credits": 2,
                  "chapters": [
                    {
                      "id": "iwm_ch1",
                      "title": "Pollution Prevention and Waste Minimization",
                      "topics": [
                        "Waste Audits",
                        "Life Cycle Assessment (LCA)",
                        "Green Engineering Principles"
                      ]
                    },
                    {
                      "id": "iwm_ch2",
                      "title": "Industrial Wastewater Treatment",
                      "topics": [
                        "Pretreatment Requirements",
                        "Advanced Oxidation Processes",
                        "Case Studies: Food, Chemical, Textile Industries"
                      ]
                    }
                  ]
                },
                {
                  "code": "CEng4116",
                  "name": "Engineering Economics",
                  "description": "Principles of economic analysis for engineering projects, including time value of money, comparison of alternatives, depreciation, and benefit-cost analysis.",
                  "credits": 2,
                  "chapters": []
                }
              ],
              "Semester III (Summer)": [
                {
                  "code": "EnVE4112",
                  "name": "Internship",
                  "description": "Supervised practical work experience in an environmental engineering organization. Students apply academic knowledge in a real-world setting and submit a report on their experience.",
                  "credits": 0,
                  "chapters": []
                }
              ]
            },
            "Year 5": {
              "Semester I": [
                {
                  "code": "EnVE5101",
                  "name": "Environmental Engineering Design II",
                  "description": "Continuation and completion of the capstone design project, including detailed design of selected alternatives, economic analysis, and preparation of a final report and presentation.",
                  "credits": 3,
                  "prerequisites": [
                    "EnVE4102"
                  ],
                  "chapters": []
                },
                {
                  "code": "EnVE5103",
                  "name": "Environmental Law and Policy",
                  "description": "Study of major environmental laws and regulations and the policymaking process, providing context for engineering solutions.",
                  "credits": 2,
                  "chapters": [
                    {
                      "id": "elp_ch1",
                      "title": "Foundations of Environmental Law",
                      "topics": [
                        "Legal Systems and Administrative Law",
                        "Major Environmental Statutes (e.g., NEPA, Clean Air Act)"
                      ]
                    },
                    {
                      "id": "elp_ch2",
                      "title": "Regulatory Compliance and Enforcement",
                      "topics": [
                        "Permitting Processes",
                        "Enforcement Actions",
                        "Liability and Citizen Suits"
                      ]
                    }
                  ]
                },
                {
                  "code": "EnVE5201",
                  "name": "Elective I",
                  "description": "Students select a specialized course from a list of approved technical electives such as Water Resources Management, Renewable Energy Systems, or Environmental Modeling.",
                  "credits": 3,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "EnVE5102",
                  "name": "B.Sc. Thesis",
                  "description": "An independent research or design project supervised by a faculty member, culminating in a formal thesis document and an oral defense.",
                  "credits": 3,
                  "chapters": []
                },
                {
                  "code": "EnVE5104",
                  "name": "Professional Ethics and Practice",
                  "description": "Examines the ethical responsibilities and professional conduct of engineers, using case studies relevant to environmental engineering practice.",
                  "credits": 2,
                  "chapters": [
                    {
                      "id": "pep_ch1",
                      "title": "Engineering Ethics",
                      "topics": [
                        "Professional Codes of Conduct",
                        "Ethical Decision-Making Frameworks",
                        "Conflict of Interest"
                      ]
                    },
                    {
                      "id": "pep_ch2",
                      "title": "Professional Practice",
                      "topics": [
                        "Licensure and Professional Registration",
                        "Consulting Engineering",
                        "Lifelong Learning"
                      ]
                    }
                  ]
                },
                {
                  "code": "EnVE5202",
                  "name": "Elective II",
                  "description": "Students select a second specialized course from a list of approved technical electives such as Contaminant Transport Modeling, Ecological Engineering, or Climate Change Adaptation.",
                  "credits": 3,
                  "chapters": []
                }
              ]
            }
          }
        },
        {
          "name": "Electrical and Computer Engineering",
          "abbreviation": "ECEG",
          "coursesByYearSemester": {
            "Year 2": {
              "Semester I": [
                {
                  "code": "ECEG2101",
                  "name": "Electric Circuits I",
                  "description": "Fundamental principles of electric circuit analysis. Covers basic circuit laws, analysis techniques for resistive circuits, and the behavior of capacitors and inductors.",
                  "credits": 4,
                  "outcomes": [
                    "Apply Kirchhoff's laws and Ohm's law to solve DC circuits.",
                    "Use nodal and mesh analysis to analyze complex resistive circuits.",
                    "Understand the transient behavior of first-order RL and RC circuits.",
                    "Apply network theorems like Thevenin's and Norton's to simplify circuits."
                  ],
                  "chapters": [
                    {
                      "id": "ec1_ch1",
                      "title": "Basic Concepts and Resistive Circuits",
                      "topics": [
                        "Voltage, Current, Power, and Energy",
                        "Ohm's Law",
                        "Kirchhoff's Current Law (KCL)",
                        "Kirchhoff's Voltage Law (KVL)"
                      ]
                    },
                    {
                      "id": "ec1_ch2",
                      "title": "Methods of Analysis",
                      "topics": [
                        "Nodal Analysis",
                        "Mesh Analysis",
                        "Source Transformation",
                        "Superposition"
                      ]
                    },
                    {
                      "id": "ec1_ch3",
                      "title": "Circuit Theorems",
                      "topics": [
                        "Thevenin's Theorem",
                        "Norton's Theorem",
                        "Maximum Power Transfer"
                      ]
                    },
                    {
                      "id": "ec1_ch4",
                      "title": "Energy Storage Elements",
                      "topics": [
                        "Capacitors and their V-I relationships",
                        "Inductors and their V-I relationships",
                        "First-Order RL and RC Circuits"
                      ]
                    }
                  ]
                },
                {
                  "code": "Comp2003",
                  "name": "Introduction to Computer Programming",
                  "description": "Introduces fundamental concepts of computer programming using a high-level language like C++. Focuses on problem-solving, algorithms, control structures, and basic data types.",
                  "credits": 3,
                  "chapters": []
                },
                {
                  "code": "Math2101",
                  "name": "Differential Equations",
                  "description": "Mathematical methods for solving ordinary differential equations (ODEs), essential for analyzing transient circuits, signals, and systems.",
                  "credits": 3,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "ECEG2102",
                  "name": "Electric Circuits II",
                  "description": "Analysis of AC circuits in steady state. Covers phasors, impedance, AC power calculations, frequency response, and magnetically coupled circuits.",
                  "credits": 4,
                  "prerequisites": [
                    "ECEG2101",
                    "Math2101"
                  ],
                  "outcomes": [
                    "Analyze single-phase AC circuits using phasors and impedance.",
                    "Calculate AC power, power factor, and perform power factor correction.",
                    "Analyze the frequency response of circuits and understand resonance.",
                    "Analyze three-phase circuits and magnetically coupled circuits."
                  ],
                  "chapters": [
                    {
                      "id": "ec2_ch1",
                      "title": "AC Circuit Analysis",
                      "topics": [
                        "Sinusoids and Phasors",
                        "Impedance and Admittance",
                        "Nodal and Mesh Analysis in the Frequency Domain"
                      ]
                    },
                    {
                      "id": "ec2_ch2",
                      "title": "AC Power Analysis",
                      "topics": [
                        "Instantaneous and Average Power",
                        "Complex Power, Apparent Power, and Power Factor",
                        "Power Factor Correction"
                      ]
                    },
                    {
                      "id": "ec2_ch3",
                      "title": "Frequency Response",
                      "topics": [
                        "Transfer Functions",
                        "Bode Plots",
                        "Series and Parallel Resonance"
                      ]
                    },
                    {
                      "id": "ec2_ch4",
                      "title": "Three-Phase and Magnetically Coupled Circuits",
                      "topics": [
                        "Balanced Three-Phase Systems (Wye-Delta)",
                        "Mutual Inductance and Transformers"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG2104",
                  "name": "Digital Logic Design",
                  "description": "Fundamentals of digital circuits, Boolean algebra, combinational and sequential logic design. Forms the hardware foundation for computer engineering.",
                  "credits": 3,
                  "outcomes": [
                    "Apply Boolean algebra and K-maps to simplify logic expressions.",
                    "Design and analyze combinational logic circuits.",
                    "Design and analyze sequential logic circuits like counters and registers.",
                    "Understand the building blocks of digital computers."
                  ],
                  "chapters": [
                    {
                      "id": "dld_ch1",
                      "title": "Number Systems and Boolean Algebra",
                      "topics": [
                        "Binary and Hexadecimal Systems",
                        "Logic Gates",
                        "Boolean Algebra and De Morgan's Theorems"
                      ]
                    },
                    {
                      "id": "dld_ch2",
                      "title": "Combinational Logic Design",
                      "topics": [
                        "Karnaugh Maps (K-maps)",
                        "Adders, Decoders, Multiplexers",
                        "Introduction to Hardware Description Languages (HDL)"
                      ]
                    },
                    {
                      "id": "dld_ch3",
                      "title": "Sequential Logic",
                      "topics": [
                        "Latches and Flip-Flops (SR, D, JK, T)",
                        "Analysis of Clocked Sequential Circuits",
                        "State Diagrams and Tables"
                      ]
                    },
                    {
                      "id": "dld_ch4",
                      "title": "Registers and Counters",
                      "topics": [
                        "Registers and Shift Registers",
                        "Asynchronous and Synchronous Counters"
                      ]
                    }
                  ]
                },
                {
                  "code": "Stat2091",
                  "name": "Probability and Statistics for Engineers",
                  "description": "Statistical methods and probability theory with applications in communications, signal processing, and system reliability.",
                  "credits": 3,
                  "chapters": []
                }
              ]
            },
            "Year 3": {
              "Semester I": [
                {
                  "code": "ECEG3101",
                  "name": "Signals and Systems",
                  "description": "Analysis of continuous-time and discrete-time signals and systems. Covers fundamental concepts like convolution, Fourier series, and Fourier and Laplace transforms.",
                  "credits": 3,
                  "prerequisites": [
                    "ECEG2102"
                  ],
                  "outcomes": [
                    "Classify signals and systems based on their properties.",
                    "Apply convolution to determine the output of linear time-invariant (LTI) systems.",
                    "Analyze signals in the frequency domain using Fourier series and transforms.",
                    "Use Laplace and Z-transforms to analyze system behavior."
                  ],
                  "chapters": [
                    {
                      "id": "ss_ch1",
                      "title": "Signals and Systems Fundamentals",
                      "topics": [
                        "Continuous and Discrete-Time Signals",
                        "System Properties (Linearity, Time-Invariance)",
                        "Linear Time-Invariant (LTI) Systems and Convolution"
                      ]
                    },
                    {
                      "id": "ss_ch2",
                      "title": "Fourier Series",
                      "topics": [
                        "Response of LTI Systems to Complex Exponentials",
                        "Continuous-Time Fourier Series (CTFS)",
                        "Discrete-Time Fourier Series (DTFS)"
                      ]
                    },
                    {
                      "id": "ss_ch3",
                      "title": "Fourier Transform",
                      "topics": [
                        "Continuous-Time Fourier Transform (CTFT)",
                        "Discrete-Time Fourier Transform (DTFT)",
                        "Properties and Applications"
                      ]
                    },
                    {
                      "id": "ss_ch4",
                      "title": "Laplace and Z-Transforms",
                      "topics": [
                        "The Laplace Transform and System Analysis",
                        "The Z-Transform for Discrete-Time Systems"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG3103",
                  "name": "Electronic Circuits I",
                  "description": "Introduction to semiconductor devices, including diodes and transistors (BJTs and MOSFETs). Covers the analysis and design of basic amplifier circuits.",
                  "credits": 3,
                  "prerequisites": [
                    "ECEG2101"
                  ],
                  "outcomes": [
                    "Analyze and design circuits using diodes.",
                    "Understand the operating principles of BJT and MOSFET transistors.",
                    "Design and analyze single-stage BJT and MOSFET amplifiers.",
                    "Perform DC biasing and small-signal analysis of amplifier circuits."
                  ],
                  "chapters": [
                    {
                      "id": "ec3_ch1",
                      "title": "Semiconductor Diodes",
                      "topics": [
                        "Semiconductor Physics",
                        "The p-n Junction Diode",
                        "Diode Models and Circuits (Rectifiers, Clippers)"
                      ]
                    },
                    {
                      "id": "ec3_ch2",
                      "title": "Bipolar Junction Transistors (BJTs)",
                      "topics": [
                        "Device Structure and Operation",
                        "DC Biasing of BJT Circuits",
                        "BJT Small-Signal Amplifiers (CE, CB, CC)"
                      ]
                    },
                    {
                      "id": "ec3_ch3",
                      "title": "Metal-Oxide-Semiconductor Field-Effect Transistors (MOSFETs)",
                      "topics": [
                        "Device Structure and I-V Characteristics",
                        "DC Biasing of MOSFET Circuits",
                        "MOSFET Small-Signal Amplifiers (CS, CG, CD)"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG3105",
                  "name": "Computer Organization and Architecture",
                  "description": "Study of computer hardware components, instruction set architecture (ISA), CPU datapath, control unit, pipelining, and memory hierarchy.",
                  "credits": 3,
                  "prerequisites": [
                    "ECEG2104"
                  ],
                  "outcomes": [
                    "Understand the relationship between hardware and software through the ISA.",
                    "Explain the fetch-decode-execute cycle and CPU pipelining.",
                    "Analyze the performance impact of memory hierarchies (caches).",
                    "Design a simple datapath and control unit."
                  ],
                  "chapters": [
                    {
                      "id": "coa_ch1",
                      "title": "Instruction Set Architecture (ISA)",
                      "topics": [
                        "Computer Abstractions and Technology",
                        "RISC-V/MIPS Instruction Set",
                        "Machine Language"
                      ]
                    },
                    {
                      "id": "coa_ch2",
                      "title": "Processor Design",
                      "topics": [
                        "Logic Design for Datapath",
                        "Single-Cycle and Multi-Cycle Datapath",
                        "Control Unit Design"
                      ]
                    },
                    {
                      "id": "coa_ch3",
                      "title": "Pipelining",
                      "topics": [
                        "Pipelined Datapath and Control",
                        "Data Hazards and Forwarding",
                        "Control Hazards and Branch Prediction"
                      ]
                    },
                    {
                      "id": "coa_ch4",
                      "title": "Memory Hierarchy",
                      "topics": [
                        "Caches and Cache Performance",
                        "Virtual Memory and Paging"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG3107",
                  "name": "Electromagnetics",
                  "description": "Study of static and dynamic electric and magnetic fields. Covers Maxwell's equations, plane wave propagation, and transmission lines.",
                  "credits": 3,
                  "outcomes": [
                    "Apply vector calculus to solve problems in electromagnetics.",
                    "Solve for electric and magnetic fields in static scenarios.",
                    "Understand and apply Maxwell's equations.",
                    "Analyze wave propagation on transmission lines."
                  ],
                  "chapters": [
                    {
                      "id": "em_ch1",
                      "title": "Vector Analysis and Electrostatics",
                      "topics": [
                        "Vector Calculus (Gradient, Divergence, Curl)",
                        "Coulomb's Law and Electric Field",
                        "Gauss's Law"
                      ]
                    },
                    {
                      "id": "em_ch2",
                      "title": "Magnetostatics",
                      "topics": [
                        "Biot-Savart Law",
                        "Ampere's Law",
                        "Magnetic Forces"
                      ]
                    },
                    {
                      "id": "em_ch3",
                      "title": "Maxwell's Equations and Plane Waves",
                      "topics": [
                        "Faraday's Law of Induction",
                        "Maxwell's Equations in Integral and Differential Form",
                        "Uniform Plane Waves"
                      ]
                    },
                    {
                      "id": "em_ch4",
                      "title": "Transmission Lines",
                      "topics": [
                        "Lumped-Element Circuit Model",
                        "Transmission Line Equations",
                        "Impedance Matching and Smith Chart"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "ECEG3102",
                  "name": "Electronic Circuits II",
                  "description": "Advanced topics in electronic circuits, including differential amplifiers, frequency response, feedback, stability, and operational amplifier (Op-Amp) circuits.",
                  "credits": 3,
                  "prerequisites": [
                    "ECEG3103"
                  ],
                  "outcomes": [
                    "Analyze the frequency response of amplifiers.",
                    "Design and analyze differential and multistage amplifiers.",
                    "Apply feedback principles to improve amplifier performance.",
                    "Design and analyze circuits using operational amplifiers."
                  ],
                  "chapters": [
                    {
                      "id": "ec3102_ch1",
                      "title": "Frequency Response of Amplifiers",
                      "topics": [
                        "Low-Frequency and High-Frequency Models (BJT, MOSFET)",
                        "Miller's Theorem",
                        "Frequency Response of CS and CE Amplifiers"
                      ]
                    },
                    {
                      "id": "ec3102_ch2",
                      "title": "Differential and Multistage Amplifiers",
                      "topics": [
                        "MOS and BJT Differential Pairs",
                        "Common-Mode Rejection Ratio (CMRR)",
                        "Multistage Amplifier Analysis"
                      ]
                    },
                    {
                      "id": "ec3102_ch3",
                      "title": "Feedback and Stability",
                      "topics": [
                        "Feedback Topologies",
                        "Effect of Feedback on Gain, Input/Output Resistance",
                        "Stability and Frequency Compensation"
                      ]
                    },
                    {
                      "id": "ec3102_ch4",
                      "title": "Operational Amplifier Circuits",
                      "topics": [
                        "The Ideal Op-Amp",
                        "Inverting and Non-inverting Configurations",
                        "Integrators, Differentiators, and Active Filters"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG3104",
                  "name": "Microprocessors and Microcontrollers",
                  "description": "Architecture, programming, and interfacing of microprocessors and microcontrollers. Covers assembly language, memory systems, and I/O peripherals.",
                  "credits": 4,
                  "prerequisites": [
                    "ECEG3105"
                  ],
                  "outcomes": [
                    "Understand the architecture of a typical microcontroller.",
                    "Write programs in both assembly language and C.",
                    "Interface microcontrollers with external devices like sensors and actuators.",
                    "Use peripherals such as timers, ADCs, and serial communication ports."
                  ],
                  "chapters": [
                    {
                      "id": "mm_ch1",
                      "title": "Microcontroller Architecture",
                      "topics": [
                        "Introduction to Embedded Systems",
                        "AVR/ARM Cortex-M Architecture",
                        "Memory Organization"
                      ]
                    },
                    {
                      "id": "mm_ch2",
                      "title": "Programming",
                      "topics": [
                        "Instruction Set and Assembly Language",
                        "Programming in C for Embedded Systems",
                        "Interrupts and Interrupt Service Routines"
                      ]
                    },
                    {
                      "id": "mm_ch3",
                      "title": "I/O and Peripherals",
                      "topics": [
                        "General Purpose I/O (GPIO)",
                        "Timers and Counters",
                        "Analog-to-Digital Converters (ADC)"
                      ]
                    },
                    {
                      "id": "mm_ch4",
                      "title": "Communication Interfaces",
                      "topics": [
                        "UART (Serial Communication)",
                        "SPI Protocol",
                        "I2C Protocol"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG3108",
                  "name": "Introduction to Communication Systems",
                  "description": "Fundamental principles of analog and digital communication systems. Covers amplitude, frequency, and phase modulation, as well as digital modulation techniques and noise analysis.",
                  "credits": 3,
                  "prerequisites": [
                    "ECEG3101"
                  ],
                  "outcomes": [
                    "Analyze and compare analog modulation schemes (AM, FM).",
                    "Understand the process of sampling, quantization, and digital encoding.",
                    "Analyze the performance of digital modulation schemes (ASK, FSK, PSK) in noise.",
                    "Describe the components of a basic communication system."
                  ],
                  "chapters": [
                    {
                      "id": "ics_ch1",
                      "title": "Analog Modulation",
                      "topics": [
                        "Amplitude Modulation (AM)",
                        "Frequency Modulation (FM)",
                        "Phase Modulation (PM)"
                      ]
                    },
                    {
                      "id": "ics_ch2",
                      "title": "From Analog to Digital",
                      "topics": [
                        "Sampling Theorem",
                        "Quantization",
                        "Pulse Code Modulation (PCM)"
                      ]
                    },
                    {
                      "id": "ics_ch3",
                      "title": "Digital Modulation",
                      "topics": [
                        "Amplitude-Shift Keying (ASK)",
                        "Frequency-Shift Keying (FSK)",
                        "Phase-Shift Keying (PSK)"
                      ]
                    },
                    {
                      "id": "ics_ch4",
                      "title": "Noise in Communication Systems",
                      "topics": [
                        "Additive White Gaussian Noise (AWGN)",
                        "Signal-to-Noise Ratio (SNR)",
                        "Bit Error Rate (BER)"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 4": {
              "Semester I": [
                {
                  "code": "ECEG4101",
                  "name": "Control Systems",
                  "description": "Analysis and design of feedback control systems. Covers system modeling, time-domain and frequency-domain analysis, stability, and controller design.",
                  "credits": 3,
                  "prerequisites": [
                    "ECEG3101"
                  ],
                  "outcomes": [
                    "Model physical systems using transfer functions and state-space representations.",
                    "Analyze the transient and steady-state response of systems.",
                    "Determine system stability using Routh-Hurwitz and Nyquist criteria.",
                    "Design PID controllers using root locus and frequency response methods."
                  ],
                  "chapters": [
                    {
                      "id": "cs_ch1",
                      "title": "System Modeling",
                      "topics": [
                        "Transfer Functions",
                        "Block Diagrams and Signal-Flow Graphs",
                        "State-Space Representation"
                      ]
                    },
                    {
                      "id": "cs_ch2",
                      "title": "Time-Domain Analysis",
                      "topics": [
                        "Transient Response of First and Second-Order Systems",
                        "Steady-State Errors",
                        "Routh-Hurwitz Stability Criterion"
                      ]
                    },
                    {
                      "id": "cs_ch3",
                      "title": "Root Locus Analysis",
                      "topics": [
                        "Sketching the Root Locus",
                        "Controller Design using Root Locus"
                      ]
                    },
                    {
                      "id": "cs_ch4",
                      "title": "Frequency-Domain Analysis",
                      "topics": [
                        "Bode Plots",
                        "Nyquist Stability Criterion",
                        "Gain and Phase Margins"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG4103",
                  "name": "Introduction to Power Systems",
                  "description": "Fundamentals of electric power generation, transmission, and distribution. Covers power system components, per-unit systems, and load flow analysis.",
                  "credits": 3,
                  "prerequisites": [
                    "ECEG2102"
                  ],
                  "outcomes": [
                    "Describe the structure and components of a modern power system.",
                    "Represent power system components using per-unit quantities.",
                    "Develop models for transmission lines and transformers.",
                    "Formulate and understand the principles of power flow analysis."
                  ],
                  "chapters": [
                    {
                      "id": "ips_ch1",
                      "title": "Power System Components",
                      "topics": [
                        "Generation, Transmission, and Distribution",
                        "Transformers and Synchronous Machines",
                        "Per-Unit System"
                      ]
                    },
                    {
                      "id": "ips_ch2",
                      "title": "Transmission Line Parameters",
                      "topics": [
                        "Resistance, Inductance, and Capacitance",
                        "Short, Medium, and Long Line Models"
                      ]
                    },
                    {
                      "id": "ips_ch3",
                      "title": "Power Flow Analysis",
                      "topics": [
                        "The Power Flow Problem",
                        "Formulation of the Admittance Matrix (Ybus)",
                        "Gauss-Seidel and Newton-Raphson Methods"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG4105",
                  "name": "Digital Signal Processing (DSP)",
                  "description": "Analysis and design of digital filters and processing of discrete-time signals. Covers the DFT, FFT, and design techniques for FIR and IIR filters.",
                  "credits": 3,
                  "prerequisites": [
                    "ECEG3101"
                  ],
                  "outcomes": [
                    "Analyze signals in the frequency domain using the Discrete Fourier Transform (DFT) and Fast Fourier Transform (FFT).",
                    "Design Finite Impulse Response (FIR) digital filters.",
                    "Design Infinite Impulse Response (IIR) digital filters.",
                    "Understand the effects of finite wordlength in digital systems."
                  ],
                  "chapters": [
                    {
                      "id": "dsp_ch1",
                      "title": "Discrete-Time Signals and Systems Review",
                      "topics": [
                        "Z-Transform",
                        "Frequency Analysis of Discrete-Time Signals"
                      ]
                    },
                    {
                      "id": "dsp_ch2",
                      "title": "The Discrete Fourier Transform (DFT)",
                      "topics": [
                        "Properties of the DFT",
                        "Circular Convolution",
                        "The Fast Fourier Transform (FFT) Algorithm"
                      ]
                    },
                    {
                      "id": "dsp_ch3",
                      "title": "FIR Filter Design",
                      "topics": [
                        "Linear Phase FIR Filters",
                        "Windowing Method",
                        "Frequency Sampling Method"
                      ]
                    },
                    {
                      "id": "dsp_ch4",
                      "title": "IIR Filter Design",
                      "topics": [
                        "Design from Analog Filters (Impulse Invariance, Bilinear Transform)",
                        "Butterworth and Chebyshev Approximations"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "ECEG4102",
                  "name": "Power Electronics",
                  "description": "Study of electronic circuits for the conversion and control of electric power. Covers power semiconductor devices and converter topologies like rectifiers, inverters, and DC-DC converters.",
                  "credits": 3,
                  "prerequisites": [
                    "ECEG3102",
                    "ECEG4103"
                  ],
                  "outcomes": [
                    "Understand the characteristics of power semiconductor devices (Diodes, SCRs, MOSFETs, IGBTs).",
                    "Analyze and design AC-DC rectifiers.",
                    "Analyze and design DC-DC converters (Buck, Boost, Buck-Boost).",
                    "Analyze and design DC-AC inverters."
                  ],
                  "chapters": [
                    {
                      "id": "pe_ch1",
                      "title": "Power Semiconductor Devices",
                      "topics": [
                        "Power Diodes, Thyristors (SCRs)",
                        "Power BJT, MOSFET, IGBT",
                        "Switching Characteristics and Gate Drive Circuits"
                      ]
                    },
                    {
                      "id": "pe_ch2",
                      "title": "AC-DC Converters (Rectifiers)",
                      "topics": [
                        "Uncontrolled Rectifiers",
                        "Controlled Rectifiers (Phase-Controlled)"
                      ]
                    },
                    {
                      "id": "pe_ch3",
                      "title": "DC-DC Converters",
                      "topics": [
                        "Buck Converter",
                        "Boost Converter",
                        "Buck-Boost Converter"
                      ]
                    },
                    {
                      "id": "pe_ch4",
                      "title": "DC-AC Converters (Inverters)",
                      "topics": [
                        "Single-Phase Inverters",
                        "Pulse Width Modulation (PWM) Techniques"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG4104",
                  "name": "Data Communication and Computer Networks",
                  "description": "In-depth study of computer network architectures, protocols, and technologies. Covers the OSI and TCP/IP models, with emphasis on the data link, network, and transport layers.",
                  "credits": 3,
                  "prerequisites": [
                    "ECEG3108"
                  ],
                  "chapters": [
                    {
                      "id": "dccn_ch1",
                      "title": "Data Link Layer",
                      "topics": [
                        "Error Detection and Correction",
                        "Multiple Access Protocols (ALOHA, CSMA/CD)",
                        "Ethernet and Switching"
                      ]
                    },
                    {
                      "id": "dccn_ch2",
                      "title": "Network Layer",
                      "topics": [
                        "IP Addressing (IPv4, IPv6, Subnetting)",
                        "Routing Algorithms (Distance Vector, Link State)",
                        "Internet Protocol (IP) and ICMP"
                      ]
                    },
                    {
                      "id": "dccn_ch3",
                      "title": "Transport Layer",
                      "topics": [
                        "User Datagram Protocol (UDP)",
                        "Transmission Control Protocol (TCP)",
                        "Congestion Control"
                      ]
                    },
                    {
                      "id": "dccn_ch4",
                      "title": "Application Layer",
                      "topics": [
                        "Domain Name System (DNS)",
                        "HTTP",
                        "Introduction to Network Security"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG4106",
                  "name": "Operating Systems",
                  "description": "Core concepts of operating systems, including process and thread management, CPU scheduling, memory management, file systems, and concurrency.",
                  "credits": 3,
                  "prerequisites": [
                    "ECEG3105"
                  ],
                  "chapters": []
                },
                {
                  "code": "ECEG4112",
                  "name": "Internship",
                  "description": "Supervised practical work experience in an electrical or computer engineering organization. Students apply academic knowledge in a real-world setting and submit a report.",
                  "credits": 0,
                  "chapters": []
                }
              ]
            },
            "Year 5": {
              "Semester I": {
                "Computer Engineering Stream": [
                  {
                    "code": "ECEG5211",
                    "name": "Embedded Systems Design",
                    "description": "Design and implementation of software for embedded systems. Covers real-time operating systems (RTOS), hardware/software co-design, and system-level design methodologies.",
                    "credits": 3,
                    "prerequisites": ["ECEG3104"],
                    "chapters": [
                      {
                        "id": "esd_ch1",
                        "title": "Introduction to Embedded Systems",
                        "topics": ["Characteristics and Challenges", "Design Metrics", "Embedded System Architecture"]
                      },
                      {
                        "id": "esd_ch2",
                        "title": "Real-Time Operating Systems (RTOS)",
                        "topics": ["Task Scheduling", "Inter-task Communication", "Kernel Services"]
                      }
                    ]
                  },
                  {
                    "code": "ECEG5213",
                    "name": "Advanced Computer Architecture",
                    "description": "Advanced topics in processor design, including superscalar and out-of-order execution, VLIW, multi-core processors, and cache coherence protocols.",
                    "credits": 3,
                    "prerequisites": ["ECEG3105"],
                    "chapters": []
                  }
                ],
                "Communications Engineering Stream": [
                  {
                    "code": "ECEG5221",
                    "name": "Wireless Communications",
                    "description": "Principles of wireless communication systems, including channel modeling, cellular concepts, and multiple access techniques.",
                    "credits": 3,
                    "prerequisites": ["ECEG3108"],
                    "chapters": [
                      {
                        "id": "wc_ch1",
                        "title": "The Wireless Channel",
                        "topics": ["Path Loss", "Shadowing", "Fading (Multipath)"]
                      },
                      {
                        "id": "wc_ch2",
                        "title": "Cellular Systems",
                        "topics": ["Frequency Reuse", "Handoff", "Capacity and Coverage"]
                      }
                    ]
                  },
                  {
                    "code": "ECEG5223",
                    "name": "Information Theory and Coding",
                    "description": "Study of the fundamental limits of data compression and communication, covering entropy, channel capacity, and error-correcting codes.",
                    "credits": 3,
                    "prerequisites": ["Stat2091"],
                    "chapters": []
                  }
                ],
                "Power Engineering Stream": [
                  {
                    "code": "ECEG5231",
                    "name": "Power System Analysis",
                    "description": "Advanced analysis of power systems, including fault analysis (symmetrical and unsymmetrical faults) and system stability (transient and steady-state).",
                    "credits": 3,
                    "prerequisites": ["ECEG4103"],
                    "chapters": [
                      {
                        "id": "psa_ch1",
                        "title": "Fault Analysis",
                        "topics": ["Symmetrical Components", "Symmetrical Faults", "Unsymmetrical Faults"]
                      },
                      {
                        "id": "psa_ch2",
                        "title": "Power System Stability",
                        "topics": ["The Swing Equation", "Equal-Area Criterion", "Transient Stability"]
                      }
                    ]
                  },
                  {
                    "code": "ECEG5233",
                    "name": "Electrical Machines",
                    "description": "Principles, construction, and performance analysis of DC machines, transformers, induction motors, and synchronous machines.",
                    "credits": 3,
                    "prerequisites": ["ECEG4103"],
                    "chapters": []
                  }
                ],
                "Control Engineering Stream": [
                  {
                    "code": "ECEG5241",
                    "name": "Digital Control Systems",
                    "description": "Analysis and design of control systems in the discrete-time domain. Covers Z-transform, digital controller design, and state-space methods.",
                    "credits": 3,
                    "prerequisites": ["ECEG4101"],
                    "chapters": [
                      {"id": "dcs_ch1", "title": "Discrete-Time Systems", "topics": ["Z-Transform", "Pulse Transfer Function"]},
                      {"id": "dcs_ch2", "title": "Digital Controller Design", "topics": ["Digital PID Controller", "Design via Emulation"]}
                    ]
                  },
                  {
                    "code": "ECEG5243",
                    "name": "Robotics and Automation",
                    "description": "Introduction to robotics, covering manipulator kinematics, dynamics, trajectory planning, and control.",
                    "credits": 3,
                    "prerequisites": ["ECEG4101"],
                    "chapters": []
                  }
                ]
              },
              "Semester II": [
                {
                  "code": "ECEG5102",
                  "name": "B.Sc. Thesis / Capstone Design",
                  "description": "A culminating project where students work in teams to design, build, and test a system that solves a real-world problem, integrating knowledge from across the curriculum.",
                  "credits": 4,
                  "chapters": []
                },
                {
                  "code": "ECEG5104",
                  "name": "Professional Ethics and Law",
                  "description": "Examines the ethical responsibilities and professional conduct of engineers, as well as legal aspects such as contracts, liability, and intellectual property.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "ECEG5106",
                  "name": "Entrepreneurship for Engineers",
                  "description": "Introduction to the principles of entrepreneurship, including opportunity recognition, business model development, funding, and intellectual property strategy, tailored for technology ventures.",
                  "credits": 2,
                  "chapters": []
                }
              ]
            }
          }
        },
        {
          "name": "Electromechanical Engineering",
          "abbreviation": "EMEC",
          "coursesByYearSemester": {
            "Year 2": {
              "Semester I": [
                {
                  "code": "EMEC2101",
                  "name": "Introduction to Electromechanical Engineering",
                  "description": "An introductory course providing a broad overview of the electromechanical engineering discipline, covering fundamental concepts from mechanics, electronics, and control systems, and their integration.",
                  "credits": 2,
                  "outcomes": [
                    "Understand the synergy between mechanical and electrical components in a system.",
                    "Identify basic mechanical and electrical components.",
                    "Describe the role of sensors, actuators, and controllers.",
                    "Appreciate the multidisciplinary nature of electromechanical systems."
                  ],
                  "chapters": [
                    {
                      "id": "iemec_ch1",
                      "title": "Fundamentals of Electromechanical Systems",
                      "topics": [
                        "Definition and Scope of Electromechanical Engineering",
                        "System Components: Mechanical, Electrical, Computer",
                        "Energy Conversion Principles"
                      ]
                    },
                    {
                      "id": "iemec_ch2",
                      "title": "Basic Mechanical Components",
                      "topics": [
                        "Levers, Gears, and Linkages",
                        "Bearings and Shafts",
                        "Basic Stress and Strain Concepts"
                      ]
                    },
                    {
                      "id": "iemec_ch3",
                      "title": "Basic Electrical Components",
                      "topics": [
                        "Resistors, Capacitors, Inductors",
                        "Basic DC/AC Circuit Concepts",
                        "Introduction to Diodes and Transistors"
                      ]
                    },
                    {
                      "id": "iemec_ch4",
                      "title": "Integration and Simple Systems",
                      "topics": [
                        "Introduction to Sensors and Actuators",
                        "Simple System Diagrams",
                        "Case Study: DC Motor Speed Control"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng2005",
                  "name": "Engineering Mechanics I (Statics)",
                  "description": "A study of the equilibrium of particles and rigid bodies under the action of forces. Covers force systems, equilibrium conditions, analysis of trusses and frames, friction, and centroids.",
                  "credits": 3,
                  "chapters": []
                },
                {
                  "code": "ECEG2101",
                  "name": "Electric Circuits I",
                  "description": "Fundamental principles of electric circuit analysis. Covers basic circuit laws (Ohm's, KVL, KCL), analysis techniques for resistive circuits, and the behavior of capacitors and inductors.",
                  "credits": 4,
                  "chapters": []
                },
                {
                  "code": "MEng2001",
                  "name": "Engineering Drawing",
                  "description": "Fundamental principles of engineering drawing, orthographic projections, sectional views, dimensioning, and an introduction to computer-aided drafting (CAD) software.",
                  "credits": 3,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "MEng2102",
                  "name": "Engineering Mechanics II (Dynamics)",
                  "description": "A study of the motion of particles and rigid bodies. Covers kinematics (geometry of motion) and kinetics (relation between forces and motion).",
                  "credits": 3,
                  "prerequisites": [
                    "MEng2005"
                  ],
                  "chapters": []
                },
                {
                  "code": "MEng2104",
                  "name": "Strength of Materials",
                  "description": "Analyzes the internal effects of forces on deformable bodies. Covers concepts of stress, strain, torsion, bending, shear in beams, and column buckling.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng2005"
                  ],
                  "chapters": []
                },
                {
                  "code": "EMEC2102",
                  "name": "Materials Science and Engineering",
                  "description": "Study of the structure, properties, and processing of engineering materials, including metals, ceramics, polymers, and composites, with an emphasis on their mechanical and electrical properties.",
                  "credits": 3,
                  "outcomes": [
                    "Relate the microstructure of materials to their macroscopic properties.",
                    "Interpret phase diagrams to predict material behavior.",
                    "Select appropriate materials for specific electromechanical applications.",
                    "Understand how processing alters material properties."
                  ],
                  "chapters": [
                    {
                      "id": "mse_ch1",
                      "title": "Material Structure and Bonding",
                      "topics": [
                        "Crystal Structures",
                        "Imperfections in Solids",
                        "Diffusion"
                      ]
                    },
                    {
                      "id": "mse_ch2",
                      "title": "Mechanical Properties",
                      "topics": [
                        "Stress-Strain Behavior",
                        "Hardness and Toughness",
                        "Fatigue and Creep"
                      ]
                    },
                    {
                      "id": "mse_ch3",
                      "title": "Electrical and Thermal Properties",
                      "topics": [
                        "Electrical Conductivity and Resistivity",
                        "Semiconductors",
                        "Thermal Conductivity and Expansion"
                      ]
                    },
                    {
                      "id": "mse_ch4",
                      "title": "Material Families",
                      "topics": [
                        "Phase Diagrams and Steels",
                        "Polymers",
                        "Ceramics and Composites"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG2104",
                  "name": "Digital Logic Design",
                  "description": "Fundamentals of digital circuits, Boolean algebra, combinational and sequential logic design. Forms the hardware foundation for control systems and embedded computing.",
                  "credits": 3,
                  "chapters": []
                }
              ]
            },
            "Year 3": {
              "Semester I": [
                {
                  "code": "EMEC3101",
                  "name": "Sensors and Actuators",
                  "description": "Study of the principles, selection, and application of various sensors and actuators used in electromechanical systems. Covers transducers for measuring physical quantities and devices for producing motion or action.",
                  "credits": 3,
                  "outcomes": [
                    "Understand the operating principles of common sensors and actuators.",
                    "Select appropriate sensors and actuators for a given application.",
                    "Interface sensors and actuators with data acquisition and control systems.",
                    "Analyze sensor and actuator specifications."
                  ],
                  "chapters": [
                    {
                      "id": "sa_ch1",
                      "title": "Sensor Fundamentals",
                      "topics": [
                        "Sensor Characteristics (Sensitivity, Range, Accuracy)",
                        "Transduction Principles",
                        "Signal Conditioning"
                      ]
                    },
                    {
                      "id": "sa_ch2",
                      "title": "Common Sensing Technologies",
                      "topics": [
                        "Position, Displacement, and Velocity Sensors (Encoders, Potentiometers)",
                        "Force, Pressure, and Temperature Sensors",
                        "Proximity and Vision Sensors"
                      ]
                    },
                    {
                      "id": "sa_ch3",
                      "title": "Actuator Fundamentals",
                      "topics": [
                        "Principles of Actuation",
                        "Performance Metrics",
                        "Drive Electronics"
                      ]
                    },
                    {
                      "id": "sa_ch4",
                      "title": "Common Actuation Technologies",
                      "topics": [
                        "DC and AC Electric Motors",
                        "Solenoids and Relays",
                        "Hydraulic and Pneumatic Actuators"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng3107",
                  "name": "Fluid Mechanics",
                  "description": "Study of fluid behavior and its application in engineering. Covers fluid statics, conservation laws for fluid flow, pipe flow, and an introduction to turbomachinery.",
                  "credits": 3,
                  "chapters": []
                },
                {
                  "code": "ECEG3101",
                  "name": "Signals and Systems",
                  "description": "Analysis of continuous-time and discrete-time signals and systems. Covers convolution, Fourier series, and Fourier and Laplace transforms.",
                  "credits": 3,
                  "chapters": []
                },
                {
                  "code": "MEng3105",
                  "name": "Machine Elements I",
                  "description": "Analysis and design of common mechanical components. Covers stress analysis, failure theories, and the design of shafts, bearings, and keys.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "me1_ch1",
                      "title": "Stress and Failure Analysis",
                      "topics": [
                        "Static and Fatigue Stresses",
                        "Static Failure Theories (Ductile, Brittle)",
                        "Fatigue Failure Theories"
                      ]
                    },
                    {
                      "id": "me1_ch2",
                      "title": "Shafts and Associated Parts",
                      "topics": [
                        "Shaft Design for Stress and Deflection",
                        "Keys, Set Screws, and Splines"
                      ]
                    },
                    {
                      "id": "me1_ch3",
                      "title": "Bearings and Lubrication",
                      "topics": [
                        "Rolling-Contact Bearings",
                        "Journal Bearings",
                        "Lubrication Principles"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "EMEC3102",
                  "name": "Control Systems",
                  "description": "Analysis and design of linear feedback control systems. Covers system modeling, time-domain and frequency-domain analysis, stability, and PID controller design.",
                  "credits": 4,
                  "prerequisites": [
                    "ECEG3101"
                  ],
                  "outcomes": [
                    "Model physical systems using transfer functions.",
                    "Analyze the transient and steady-state response of systems.",
                    "Determine system stability using various criteria.",
                    "Design PID controllers to meet performance specifications."
                  ],
                  "chapters": [
                    {
                      "id": "cs1_ch1",
                      "title": "System Modeling",
                      "topics": [
                        "Laplace Transforms and Transfer Functions",
                        "Modeling of Mechanical and Electrical Systems",
                        "Block Diagrams"
                      ]
                    },
                    {
                      "id": "cs1_ch2",
                      "title": "Time-Domain Analysis",
                      "topics": [
                        "Transient Response of First and Second-Order Systems",
                        "Steady-State Errors"
                      ]
                    },
                    {
                      "id": "cs1_ch3",
                      "title": "Stability and Root Locus",
                      "topics": [
                        "Routh-Hurwitz Stability Criterion",
                        "Root Locus Analysis and Design"
                      ]
                    },
                    {
                      "id": "cs1_ch4",
                      "title": "Frequency-Domain Analysis",
                      "topics": [
                        "Bode Plots",
                        "Nyquist Stability Criterion",
                        "Gain and Phase Margins"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng3108",
                  "name": "Heat Transfer",
                  "description": "Study of the modes of heat transfer (conduction, convection, radiation) and their application in the thermal management of electromechanical systems.",
                  "credits": 3,
                  "chapters": []
                },
                {
                  "code": "MEng3106",
                  "name": "Machine Elements II",
                  "description": "Continuation of Machine Elements I. Covers the design of gears, fasteners, welds, brakes, clutches, and springs.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng3105"
                  ],
                  "chapters": [
                    {
                      "id": "me2_ch1",
                      "title": "Gears",
                      "topics": [
                        "Spur Gears and Helical Gears",
                        "Bending and Surface Strength",
                        "Gear Train Analysis"
                      ]
                    },
                    {
                      "id": "me2_ch2",
                      "title": "Fasteners and Joints",
                      "topics": [
                        "Screws and Fasteners",
                        "Welded Joints",
                        "Adhesive Bonding"
                      ]
                    },
                    {
                      "id": "me2_ch3",
                      "title": "Energy Storage and Absorption",
                      "topics": [
                        "Spring Design (Helical, Leaf)",
                        "Clutches and Brakes"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG3104",
                  "name": "Microcontrollers and Interfacing",
                  "description": "Architecture, programming, and interfacing of microcontrollers for embedded control applications. Covers C programming, timers, ADCs, and communication protocols.",
                  "credits": 4,
                  "chapters": []
                }
              ]
            },
            "Year 4": {
              "Semester I": [
                {
                  "code": "EMEC4101",
                  "name": "Mechatronics System Design",
                  "description": "An integrative course on the design of mechatronic systems. Emphasizes the seamless integration of mechanical elements, electronics, sensors, actuators, and computer control.",
                  "credits": 3,
                  "prerequisites": [
                    "EMEC3101",
                    "EMEC3102",
                    "ECEG3104"
                  ],
                  "outcomes": [
                    "Apply a systematic approach to mechatronic design.",
                    "Model and simulate the behavior of integrated systems.",
                    "Implement a microcontroller-based solution involving sensors and actuators.",
                    "Manage hardware and software integration challenges."
                  ],
                  "chapters": [
                    {
                      "id": "msd_ch1",
                      "title": "The Mechatronic Design Process",
                      "topics": [
                        "System Modeling and Requirements",
                        "Conceptual Design and Selection",
                        "Hardware-in-the-Loop Simulation"
                      ]
                    },
                    {
                      "id": "msd_ch2",
                      "title": "Data Acquisition and Control",
                      "topics": [
                        "Real-time Data Acquisition",
                        "Digital Control Implementation",
                        "Signal Processing for Sensors"
                      ]
                    },
                    {
                      "id": "msd_ch3",
                      "title": "System Integration",
                      "topics": [
                        "Integrating Mechanical and Electronic Components",
                        "Power and Drive Electronics",
                        "Software/Hardware Co-design"
                      ]
                    },
                    {
                      "id": "msd_ch4",
                      "title": "Mechatronics Case Studies",
                      "topics": [
                        "Automotive Systems (ABS, Active Suspension)",
                        "Consumer Electronics (Printers, Cameras)",
                        "Manufacturing Automation"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG5233",
                  "name": "Electrical Machines",
                  "description": "Principles, construction, and performance analysis of DC machines, transformers, induction motors, and synchronous machines used as actuators and generators.",
                  "credits": 3,
                  "chapters": []
                },
                {
                  "code": "EMEC4103",
                  "name": "Hydraulic and Pneumatic Systems",
                  "description": "Study of fluid power systems. Covers the design and analysis of hydraulic and pneumatic circuits, components (pumps, motors, valves, cylinders), and their control.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng3107"
                  ],
                  "outcomes": [
                    "Understand the principles of fluid power generation and transmission.",
                    "Design basic hydraulic and pneumatic circuits.",
                    "Select appropriate fluid power components for an application.",
                    "Analyze the performance of fluid power systems."
                  ],
                  "chapters": [
                    {
                      "id": "hps_ch1",
                      "title": "Fluid Power Fundamentals",
                      "topics": [
                        "Pascal's Law and Energy Transmission",
                        "Hydraulic Fluids and Pneumatic Gases",
                        "System Components Overview"
                      ]
                    },
                    {
                      "id": "hps_ch2",
                      "title": "Hydraulic Systems",
                      "topics": [
                        "Pumps, Motors, and Cylinders",
                        "Valves (Directional, Pressure, Flow Control)",
                        "Hydraulic Circuit Design"
                      ]
                    },
                    {
                      "id": "hps_ch3",
                      "title": "Pneumatic Systems",
                      "topics": [
                        "Compressors and Air Treatment",
                        "Pneumatic Actuators and Valves",
                        "Pneumatic Circuit Design and Logic"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "EMEC4102",
                  "name": "Industrial Automation",
                  "description": "Study of automation technologies used in manufacturing. Focuses on Programmable Logic Controllers (PLCs), ladder logic programming, Human-Machine Interfaces (HMI), and SCADA systems.",
                  "credits": 3,
                  "prerequisites": [
                    "ECEG2104"
                  ],
                  "outcomes": [
                    "Program PLCs using ladder logic to control industrial processes.",
                    "Design and implement HMI screens for system monitoring and control.",
                    "Understand the architecture of SCADA systems.",
                    "Describe the role of industrial networks and sensors in automation."
                  ],
                  "chapters": [
                    {
                      "id": "ia_ch1",
                      "title": "Introduction to Automation",
                      "topics": [
                        "Levels of Automation",
                        "Sensors and Actuators in Automation",
                        "Programmable Logic Controllers (PLCs) vs. Microcontrollers"
                      ]
                    },
                    {
                      "id": "ia_ch2",
                      "title": "PLC Programming",
                      "topics": [
                        "PLC Hardware and I/O Modules",
                        "Ladder Logic Programming",
                        "Timers, Counters, and Math Instructions"
                      ]
                    },
                    {
                      "id": "ia_ch3",
                      "title": "HMI and SCADA Systems",
                      "topics": [
                        "Human-Machine Interface (HMI) Design",
                        "Supervisory Control and Data Acquisition (SCADA)",
                        "Data Logging and Alarming"
                      ]
                    }
                  ]
                },
                {
                  "code": "EMEC4104",
                  "name": "Introduction to Robotics",
                  "description": "Fundamentals of industrial and mobile robotics. Covers robot kinematics, dynamics, trajectory planning, control, and programming.",
                  "credits": 3,
                  "prerequisites": [
                    "EMEC3102"
                  ],
                  "outcomes": [
                    "Perform forward and inverse kinematic analysis of robotic manipulators.",
                    "Develop robot trajectories for path planning.",
                    "Understand the principles of robot dynamics and control.",
                    "Program a robot for a simple task."
                  ],
                  "chapters": [
                    {
                      "id": "robo_ch1",
                      "title": "Robot Kinematics",
                      "topics": [
                        "Robot Configurations",
                        "Homogeneous Transformations",
                        "Forward and Inverse Kinematics"
                      ]
                    },
                    {
                      "id": "robo_ch2",
                      "title": "Robot Dynamics and Control",
                      "topics": [
                        "Lagrange-Euler Formulation",
                        "Independent Joint Control (PID)",
                        "Force Control"
                      ]
                    },
                    {
                      "id": "robo_ch3",
                      "title": "Trajectory Planning and Mobile Robots",
                      "topics": [
                        "Joint-Space and Cartesian-Space Trajectories",
                        "Introduction to Mobile Robots",
                        "Sensing and Navigation"
                      ]
                    }
                  ]
                },
                {
                  "code": "ECEG4102",
                  "name": "Power Electronics",
                  "description": "Study of electronic circuits for the conversion and control of electric power, essential for motor drives, power supplies, and renewable energy interfaces.",
                  "credits": 3,
                  "chapters": []
                },
                {
                  "code": "EMEC4112",
                  "name": "Internship",
                  "description": "Supervised practical work experience in an electromechanical engineering organization. Students apply academic knowledge in a real-world setting and submit a report.",
                  "credits": 0,
                  "chapters": []
                }
              ]
            },
            "Year 5": {
              "Semester I": [
                {
                  "code": "EMEC5101",
                  "name": "Capstone Design Project I",
                  "description": "The first phase of a culminating design experience. Student teams identify an electromechanical engineering problem, develop specifications, evaluate concepts, and complete a detailed preliminary design and project plan.",
                  "credits": 3,
                  "prerequisites": [
                    "EMEC4101"
                  ],
                  "chapters": []
                },
                {
                  "code": "EMEC5103",
                  "name": "Professional Practice and Ethics",
                  "description": "Examines the professional and ethical responsibilities of engineers, covering codes of conduct, legal aspects like liability and contracts, and the societal impact of technology.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "EMEC5201",
                  "name": "Elective I",
                  "description": "Students select a specialized course from a list of approved technical electives such as Digital Control Systems, Advanced Robotics, or Vehicle Dynamics.",
                  "credits": 3,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "EMEC5102",
                  "name": "Capstone Design Project II",
                  "description": "The second phase of the capstone design project. Teams build, test, and refine their prototype, culminating in a final written report, a public presentation, and a demonstration of the working system.",
                  "credits": 4,
                  "prerequisites": [
                    "EMEC5101"
                  ],
                  "chapters": []
                },
                {
                  "code": "ECEG5106",
                  "name": "Entrepreneurship for Engineers",
                  "description": "Introduction to the principles of entrepreneurship, including opportunity recognition, business model development, funding, and intellectual property strategy, tailored for technology ventures.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "EMEC5202",
                  "name": "Elective II",
                  "description": "Students select a second specialized course from a list of approved technical electives such as HVAC Systems, Machine Vision, or Control of Electric Drives.",
                  "credits": 3,
                  "chapters": []
                }
              ]
            }
          }
        },
        {
          "name": "Mechanical Engineering",
          "abbreviation": "MEng",
          "coursesByYearSemester": {
            "Year 2": {
              "Semester I": [
                {
                  "code": "MEng2005",
                  "name": "Engineering Mechanics I (Statics)",
                  "description": "A study of the equilibrium of particles and rigid bodies under the action of forces. Covers force systems, equilibrium conditions, analysis of trusses and frames, friction, and centroids.",
                  "credits": 3,
                  "outcomes": [
                    "Draw free-body diagrams and apply equilibrium equations to solve for unknown forces.",
                    "Analyze forces in truss and frame members.",
                    "Calculate centroids and moments of inertia for various shapes.",
                    "Solve problems involving static and kinetic friction."
                  ],
                  "chapters": [
                    {
                      "id": "statics_ch1",
                      "title": "Force Systems and Resultants",
                      "topics": [
                        "Vectors and Scalars",
                        "Moments and Couples",
                        "Equivalent Force-Couple Systems"
                      ]
                    },
                    {
                      "id": "statics_ch2",
                      "title": "Equilibrium of Rigid Bodies",
                      "topics": [
                        "Free-Body Diagrams",
                        "Equations of Equilibrium in 2D and 3D",
                        "Constraints and Statically Determinate Systems"
                      ]
                    },
                    {
                      "id": "statics_ch3",
                      "title": "Structural Analysis",
                      "topics": [
                        "Analysis of Trusses (Method of Joints, Method of Sections)",
                        "Analysis of Frames and Machines"
                      ]
                    },
                    {
                      "id": "statics_ch4",
                      "title": "Distributed Forces and Friction",
                      "topics": [
                        "Centroids and Center of Gravity",
                        "Moments of Inertia",
                        "Laws of Dry Friction"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng2001",
                  "name": "Engineering Drawing",
                  "description": "Fundamental principles of engineering drawing, orthographic projections, sectional views, tolerancing, and an introduction to computer-aided design (CAD) software.",
                  "credits": 3,
                  "outcomes": [
                    "Create and interpret multi-view orthographic projections.",
                    "Apply standard dimensioning and tolerancing techniques (GD&T).",
                    "Produce assembly drawings with parts lists.",
                    "Use basic CAD tools to create 2D and 3D engineering models."
                  ],
                  "chapters": [
                    {
                      "id": "ed_ch1",
                      "title": "Drafting Fundamentals",
                      "topics": [
                        "Lettering, Line Types, and Scale",
                        "Geometric Constructions",
                        "Orthographic Projections"
                      ]
                    },
                    {
                      "id": "ed_ch2",
                      "title": "Sectional and Auxiliary Views",
                      "topics": [
                        "Types of Sections",
                        "Auxiliary Views",
                        "Dimensioning and Tolerancing"
                      ]
                    },
                    {
                      "id": "ed_ch3",
                      "title": "3D Modeling with CAD",
                      "topics": [
                        "Introduction to CAD Interface",
                        "Part Modeling (Extrude, Revolve, Cut)",
                        "Creating Assemblies"
                      ]
                    },
                    {
                      "id": "ed_ch4",
                      "title": "Working Drawings",
                      "topics": [
                        "Detail Drawings",
                        "Assembly Drawings and Bills of Materials",
                        "Introduction to GD&T"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng2103",
                  "name": "Engineering Thermodynamics I",
                  "description": "Introduction to the principles of thermodynamics. Covers properties of pure substances, the First and Second Laws of Thermodynamics, and their application to engineering systems.",
                  "credits": 3,
                  "outcomes": [
                    "Apply the First Law of Thermodynamics to closed and open systems.",
                    "Use property tables (e.g., steam tables) to determine fluid states.",
                    "Understand the concepts of entropy, reversibility, and the Second Law.",
                    "Analyze basic power and refrigeration cycles."
                  ],
                  "chapters": [
                    {
                      "id": "thermo1_ch1",
                      "title": "Concepts and Properties",
                      "topics": [
                        "Systems and Control Volumes",
                        "Properties of a Pure Substance",
                        "Use of Property Tables"
                      ]
                    },
                    {
                      "id": "thermo1_ch2",
                      "title": "The First Law of Thermodynamics",
                      "topics": [
                        "Energy, Heat, and Work",
                        "Energy Balance for Closed Systems",
                        "Energy Balance for Open Systems (Control Volumes)"
                      ]
                    },
                    {
                      "id": "thermo1_ch3",
                      "title": "The Second Law of Thermodynamics",
                      "topics": [
                        "Heat Engines and Refrigerators",
                        "Reversible and Irreversible Processes",
                        "The Carnot Cycle"
                      ]
                    },
                    {
                      "id": "thermo1_ch4",
                      "title": "Entropy",
                      "topics": [
                        "The Clausius Inequality",
                        "Principle of Increase of Entropy",
                        "Isentropic Processes"
                      ]
                    }
                  ]
                },
                {
                  "code": "EMEC2102",
                  "name": "Materials Science and Engineering",
                  "description": "Study of the structure, properties, and processing of engineering materials, including metals, ceramics, polymers, and composites.",
                  "credits": 3,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "MEng2102",
                  "name": "Engineering Mechanics II (Dynamics)",
                  "description": "A study of the motion of particles and rigid bodies. Covers kinematics (geometry of motion) and kinetics (relation between forces and motion) using Newton's laws, work-energy, and impulse-momentum methods.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng2005"
                  ],
                  "outcomes": [
                    "Analyze the kinematics of particles and rigid bodies in plane motion.",
                    "Apply Newton's second law to solve dynamics problems.",
                    "Utilize work-energy and impulse-momentum principles.",
                    "Understand the fundamentals of mechanical vibrations."
                  ],
                  "chapters": [
                    {
                      "id": "dyn_ch1",
                      "title": "Kinematics of Particles",
                      "topics": [
                        "Rectilinear and Curvilinear Motion",
                        "Relative Motion"
                      ]
                    },
                    {
                      "id": "dyn_ch2",
                      "title": "Kinetics of Particles",
                      "topics": [
                        "Newton's Second Law",
                        "Work-Energy Principle",
                        "Impulse-Momentum Principle"
                      ]
                    },
                    {
                      "id": "dyn_ch3",
                      "title": "Kinematics of Rigid Bodies",
                      "topics": [
                        "Translation and Rotation",
                        "General Plane Motion",
                        "Instantaneous Center of Zero Velocity"
                      ]
                    },
                    {
                      "id": "dyn_ch4",
                      "title": "Kinetics of Rigid Bodies",
                      "topics": [
                        "Equations of Motion for a Rigid Body",
                        "Work and Energy for Rigid Bodies"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng2104",
                  "name": "Strength of Materials",
                  "description": "Analyzes the internal effects of forces on deformable bodies. Covers concepts of stress, strain, torsion, bending, shear in beams, stress transformation, and column buckling.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng2005"
                  ],
                  "outcomes": [
                    "Calculate stresses and strains in structural members under various loads.",
                    "Analyze members subjected to axial, torsional, and bending loads.",
                    "Draw shear and moment diagrams for beams.",
                    "Apply stress transformation equations and Mohr's circle."
                  ],
                  "chapters": [
                    {
                      "id": "som_ch1",
                      "title": "Stress and Strain",
                      "topics": [
                        "Normal and Shear Stress",
                        "Hooke's Law and Material Properties",
                        "Axial Loading and Deformation"
                      ]
                    },
                    {
                      "id": "som_ch2",
                      "title": "Torsion and Bending",
                      "topics": [
                        "Torsional Deformation of Shafts",
                        "Shear and Moment Diagrams",
                        "Flexural Stress in Beams"
                      ]
                    },
                    {
                      "id": "som_ch3",
                      "title": "Stress Transformation and Combined Loadings",
                      "topics": [
                        "Transverse Shear in Beams",
                        "Stress Transformation and Mohr's Circle"
                      ]
                    },
                    {
                      "id": "som_ch4",
                      "title": "Deflection and Buckling",
                      "topics": [
                        "Deflection of Beams",
                        "Buckling of Columns"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng2106",
                  "name": "Manufacturing Technology I",
                  "description": "An introduction to manufacturing processes, including metal casting, forming, machining, and joining, with an emphasis on process capabilities and limitations.",
                  "credits": 3,
                  "outcomes": [
                    "Identify and describe a wide range of manufacturing processes.",
                    "Understand the fundamentals of metal cutting and machining operations.",
                    "Compare different casting, forming, and joining techniques.",
                    "Select appropriate manufacturing processes based on material and geometry."
                  ],
                  "chapters": [
                    {
                      "id": "mfg1_ch1",
                      "title": "Casting Processes",
                      "topics": [
                        "Solidification of Metals",
                        "Sand Casting",
                        "Investment Casting and Die Casting"
                      ]
                    },
                    {
                      "id": "mfg1_ch2",
                      "title": "Metal Forming",
                      "topics": [
                        "Fundamentals of Metal Forming",
                        "Bulk Deformation (Forging, Rolling, Extrusion)",
                        "Sheet Metalworking"
                      ]
                    },
                    {
                      "id": "mfg1_ch3",
                      "title": "Machining Processes",
                      "topics": [
                        "Theory of Metal Cutting",
                        "Turning, Drilling, and Milling Operations",
                        "Cutting Tools and Fluids"
                      ]
                    },
                    {
                      "id": "mfg1_ch4",
                      "title": "Joining Processes",
                      "topics": [
                        "Welding (Arc, Gas, Resistance)",
                        "Brazing and Soldering",
                        "Mechanical Fastening"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng2108",
                  "name": "Fluid Mechanics I",
                  "description": "Introduction to the mechanics of fluids. Topics include fluid properties, hydrostatics, buoyancy, and the principles of conservation of mass, momentum, and energy for fluid flow.",
                  "credits": 3,
                  "chapters": []
                }
              ]
            },
            "Year 3": {
              "Semester I": [
                {
                  "code": "MEng3101",
                  "name": "Machine Elements I",
                  "description": "Analysis and design of common mechanical components. Covers stress analysis under various loading conditions, failure theories, and the design of shafts, bearings, and keys.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng2104"
                  ],
                  "outcomes": [
                    "Apply static and fatigue failure theories to machine component design.",
                    "Design shafts for stress and deflection.",
                    "Select appropriate rolling-contact bearings for an application.",
                    "Design permanent and detachable joints."
                  ],
                  "chapters": [
                    {
                      "id": "me1_ch1",
                      "title": "Fundamentals of Mechanical Design",
                      "topics": [
                        "The Design Process",
                        "Materials Selection",
                        "Load and Stress Analysis"
                      ]
                    },
                    {
                      "id": "me1_ch2",
                      "title": "Failure Prevention",
                      "topics": [
                        "Static Failure Theories (Ductile, Brittle)",
                        "Fatigue Failure Theories (S-N Diagrams, Goodman, Soderberg)"
                      ]
                    },
                    {
                      "id": "me1_ch3",
                      "title": "Design of Shafts and Associated Parts",
                      "topics": [
                        "Shaft Design for Static and Fatigue Loading",
                        "Keys and Couplings"
                      ]
                    },
                    {
                      "id": "me1_ch4",
                      "title": "Bearings and Joints",
                      "topics": [
                        "Rolling-Contact Bearings",
                        "Screws and Fasteners",
                        "Welded Joints"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng3103",
                  "name": "Heat Transfer",
                  "description": "Study of the modes of heat transfer (conduction, convection, radiation) and their application in the design of engineering systems and thermal management.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng2108",
                    "MEng2103"
                  ],
                  "outcomes": [
                    "Solve one-dimensional steady-state and transient conduction problems.",
                    "Use correlations to calculate heat transfer coefficients for forced and natural convection.",
                    "Design and analyze the performance of heat exchangers.",
                    "Analyze radiative heat transfer between surfaces."
                  ],
                  "chapters": [
                    {
                      "id": "ht_ch1",
                      "title": "Conduction",
                      "topics": [
                        "Fourier's Law",
                        "Thermal Resistance Networks",
                        "Extended Surfaces (Fins)",
                        "Transient Conduction (Lumped Capacitance)"
                      ]
                    },
                    {
                      "id": "ht_ch2",
                      "title": "Convection",
                      "topics": [
                        "Boundary Layers",
                        "Forced Convection (Internal and External Flow)",
                        "Natural Convection"
                      ]
                    },
                    {
                      "id": "ht_ch3",
                      "title": "Heat Exchangers",
                      "topics": [
                        "Types of Heat Exchangers",
                        "Log Mean Temperature Difference (LMTD) Method",
                        "Effectiveness-NTU Method"
                      ]
                    },
                    {
                      "id": "ht_ch4",
                      "title": "Radiation",
                      "topics": [
                        "Blackbody Radiation",
                        "View Factors",
                        "Radiation Exchange between Gray Surfaces"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng3105",
                  "name": "Theory of Machines I (Kinematics)",
                  "description": "Kinematic analysis of mechanisms. Covers the study of motion in linkages, cams, and gear trains without regard to the forces causing the motion.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng2102"
                  ],
                  "chapters": [
                    {
                      "id": "tom1_ch1",
                      "title": "Kinematic Fundamentals",
                      "topics": [
                        "Mechanisms and Kinematic Chains",
                        "Mobility (Gruebler's Equation)",
                        "Position and Displacement Analysis"
                      ]
                    },
                    {
                      "id": "tom1_ch2",
                      "title": "Velocity and Acceleration Analysis",
                      "topics": [
                        "Graphical and Analytical Methods",
                        "Instantaneous Center of Rotation",
                        "Coriolis Acceleration"
                      ]
                    },
                    {
                      "id": "tom1_ch3",
                      "title": "Cams and Gears",
                      "topics": [
                        "Cam Design and Follower Motion",
                        "Fundamental Law of Gearing",
                        "Analysis of Gear Trains (Simple, Compound, Epicyclic)"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng3109",
                  "name": "Control Systems",
                  "description": "Introduction to the analysis and design of linear feedback control systems. Covers system modeling, time-domain and frequency-domain analysis, stability, and controller design.",
                  "credits": 3,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "MEng3102",
                  "name": "Machine Elements II",
                  "description": "Continuation of Machine Elements I. Covers the design of more complex components, including gears, brakes, clutches, and flexible mechanical elements like belts and chains.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng3101"
                  ],
                  "chapters": [
                    {
                      "id": "me2_ch1",
                      "title": "Spur and Helical Gears",
                      "topics": [
                        "Gear Kinematics and Nomenclature",
                        "Bending Strength (Lewis Equation)",
                        "Surface Strength (AGMA Standards)"
                      ]
                    },
                    {
                      "id": "me2_ch2",
                      "title": "Bevel and Worm Gears",
                      "topics": [
                        "Analysis of Bevel Gears",
                        "Analysis of Worm Gearing"
                      ]
                    },
                    {
                      "id": "Clutches, Brakes, and Springs",
                      "topics": [
                        "Design of Clutches and Brakes",
                        "Spring Design (Helical, Leaf)",
                        "Flywheels"
                      ]
                    },
                    {
                      "id": "me2_ch4",
                      "title": "Flexible Mechanical Elements",
                      "topics": [
                        "Belt Drives",
                        "Chain Drives",
                        "Wire Ropes"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng3104",
                  "name": "Mechanical Vibrations",
                  "description": "Analysis of the oscillatory motion of mechanical systems. Covers free and forced vibration of single and multiple degree-of-freedom systems, and vibration control.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng2102"
                  ],
                  "chapters": [
                    {
                      "id": "vib_ch1",
                      "title": "Single Degree-of-Freedom Systems",
                      "topics": [
                        "Free Undamped Vibration",
                        "Free Damped Vibration",
                        "Forced Vibration and Resonance"
                      ]
                    },
                    {
                      "id": "vib_ch2",
                      "title": "Vibration Control",
                      "topics": [
                        "Vibration Isolation",
                        "Vibration Absorbers"
                      ]
                    },
                    {
                      "id": "vib_ch3",
                      "title": "Two Degree-of-Freedom Systems",
                      "topics": [
                        "Equations of Motion",
                        "Natural Frequencies and Mode Shapes"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng3108",
                  "name": "Engineering Thermodynamics II",
                  "description": "Application of thermodynamics to power and refrigeration cycles. Covers gas and vapor power cycles, psychrometry, and combustion.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng2103"
                  ],
                  "chapters": [
                    {
                      "id": "thermo2_ch1",
                      "title": "Gas Power Cycles",
                      "topics": [
                        "Otto Cycle",
                        "Diesel Cycle",
                        "Brayton Cycle (Gas Turbines)"
                      ]
                    },
                    {
                      "id": "thermo2_ch2",
                      "title": "Vapor Power Cycles",
                      "topics": [
                        "Rankine Cycle",
                        "Reheat and Regeneration"
                      ]
                    },
                    {
                      "id": "thermo2_ch3",
                      "title": "Refrigeration and Psychrometry",
                      "topics": [
                        "Vapor-Compression Refrigeration",
                        "Properties of Moist Air (Psychrometrics)"
                      ]
                    },
                    {
                      "id": "thermo2_ch4",
                      "title": "Chemical Reactions and Combustion",
                      "topics": [
                        "Enthalpy of Formation",
                        "First Law Analysis of Reacting Systems"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng3110",
                  "name": "Measurement and Instrumentation",
                  "description": "Principles and practices of engineering measurement. Covers instrument characteristics, data acquisition, and techniques for measuring common physical quantities.",
                  "credits": 3,
                  "chapters": []
                }
              ]
            },
            "Year 4": {
              "Semester I": [
                {
                  "code": "MEng4101",
                  "name": "Mechanical Engineering Design I",
                  "description": "The first course in a two-part capstone design sequence. Focuses on the engineering design process, problem definition, concept generation, and project planning.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng3102"
                  ],
                  "chapters": [
                    {
                      "id": "design1_ch1",
                      "title": "The Design Process",
                      "topics": [
                        "Problem Identification and Specification",
                        "Concept Generation and Evaluation",
                        "Design for X (Manufacturability, Assembly, etc.)"
                      ]
                    },
                    {
                      "id": "design1_ch2",
                      "title": "Project Management",
                      "topics": [
                        "Project Planning and Scheduling (Gantt Charts)",
                        "Teamwork and Communication",
                        "Engineering Ethics"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng4103",
                  "name": "Finite Element Analysis",
                  "description": "Introduction to the theory and application of the finite element method for solving engineering problems, particularly in stress analysis and heat transfer.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "fea_ch1",
                      "title": "FEA Fundamentals",
                      "topics": [
                        "The Finite Element Method Concept",
                        "Discretization and Meshing",
                        "Shape Functions"
                      ]
                    },
                    {
                      "id": "fea_ch2",
                      "title": "Structural Analysis",
                      "topics": [
                        "Analysis of Trusses and Beams",
                        "2D Plane Stress and Plane Strain",
                        "3D Solid Elements"
                      ]
                    },
                    {
                      "id": "fea_ch3",
                      "title": "Thermal and Dynamic Analysis",
                      "topics": [
                        "Steady-State Heat Transfer Analysis",
                        "Introduction to Modal Analysis"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng4105",
                  "name": "Power Plant Engineering",
                  "description": "Study of various types of power generation systems, including thermal (steam, gas), hydroelectric, and nuclear power plants, along with their components and performance.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng3108"
                  ],
                  "chapters": []
                },
                {
                  "code": "MEng4107",
                  "name": "Mechatronics",
                  "description": "An integrative course on the design of mechatronic systems, combining mechanical elements, electronics, sensors, actuators, and computer control.",
                  "credits": 3,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "MEng4102",
                  "name": "Mechanical Engineering Design II",
                  "description": "The conclusion of the capstone design sequence. Students work in teams to complete the detailed design, fabrication, and testing of their project, culminating in a final report and presentation.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng4101"
                  ],
                  "chapters": []
                },
                {
                  "code": "MEng4104",
                  "name": "HVAC Systems",
                  "description": "Design and analysis of heating, ventilating, and air-conditioning (HVAC) systems. Covers psychrometrics, load calculations, and system design.",
                  "credits": 3,
                  "prerequisites": [
                    "MEng3108"
                  ],
                  "chapters": [
                    {
                      "id": "hvac_ch1",
                      "title": "Psychrometrics and Comfort",
                      "topics": [
                        "Properties of Moist Air",
                        "The Psychrometric Chart",
                        "Thermal Comfort"
                      ]
                    },
                    {
                      "id": "hvac_ch2",
                      "title": "Load Calculations",
                      "topics": [
                        "Heating Load Calculation",
                        "Cooling Load Calculation",
                        "Ventilation Requirements"
                      ]
                    },
                    {
                      "id": "hvac_ch3",
                      "title": "HVAC Systems and Components",
                      "topics": [
                        "Vapor-Compression Cycle",
                        "Duct Design",
                        "Air Distribution Systems"
                      ]
                    }
                  ]
                },
                {
                  "code": "MEng4108",
                  "name": "Introduction to Computational Fluid Dynamics (CFD)",
                  "description": "An introduction to the principles and application of CFD for solving fluid flow and heat transfer problems.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "MEng4112",
                  "name": "Internship",
                  "description": "Supervised practical work experience in a mechanical engineering organization. Students apply academic knowledge in a real-world setting and submit a report.",
                  "credits": 0,
                  "chapters": []
                }
              ]
            },
            "Year 5": {
              "Semester I": [
                {
                  "code": "MEng5101",
                  "name": "B.Sc. Thesis I",
                  "description": "The first phase of the final year thesis project. Students work with a faculty advisor to identify a research topic, conduct a literature survey, and write a detailed research proposal.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "MEng5103",
                  "name": "Engineering Ethics and Law",
                  "description": "Examines the professional and ethical responsibilities of engineers, covering codes of conduct, liability, intellectual property, and the societal impact of technology.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "MEng5201",
                  "name": "Elective I",
                  "description": "Students select a specialized course from a list of approved technical electives such as Automotive Engineering, Renewable Energy Systems, or Advanced Materials.",
                  "credits": 3,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "MEng5102",
                  "name": "B.Sc. Thesis II",
                  "description": "The second and final phase of the thesis project. Students execute their research plan, analyze data, and write the final thesis document, culminating in an oral defense.",
                  "credits": 4,
                  "prerequisites": [
                    "MEng5101"
                  ],
                  "chapters": []
                },
                {
                  "code": "ECEG5106",
                  "name": "Entrepreneurship for Engineers",
                  "description": "Introduction to the principles of entrepreneurship, including opportunity recognition, business model development, funding, and intellectual property strategy, tailored for technology ventures.",
                  "credits": 2,
                  "chapters": []
                },
                {
                  "code": "MEng5202",
                  "name": "Elective II",
                  "description": "Students select a second specialized course from a list of approved technical electives such as Robotics, Fracture Mechanics, or Turbomachinery.",
                  "credits": 3,
                  "chapters": []
                }
              ]
            }
          }
        },
        // ... Other departments in Engineering ...
      ],
    },
    {
      name: 'College of Natural and Applied Sciences',
      departments: [
        {
          "name": "Food Sciences and Applied Nutrition",
          "abbreviation": "FSAN",
          "coursesByYearSemester": {
            "Year 2": {
              "Semester I": [
                {
                  "code": "FSAN2101",
                  "name": "Introduction to Food Science and Nutrition",
                  "description": "A foundational course covering the interdisciplinary nature of food science and the fundamental principles of human nutrition, food composition, and the food system.",
                  "credits": 3,
                  "outcomes": [
                    "Describe the major disciplines within food science.",
                    "Identify the key macronutrients and micronutrients and their functions.",
                    "Understand the basic components of the food supply chain.",
                    "Recognize the relationship between food, nutrition, and health."
                  ],
                  "chapters": [
                    {
                      "id": "ifsan_ch1",
                      "title": "Overview of Food Science",
                      "topics": [
                        "Introduction to Food Chemistry",
                        "Introduction to Food Microbiology",
                        "Introduction to Food Processing",
                        "Introduction to Food Engineering"
                      ]
                    },
                    {
                      "id": "ifsan_ch2",
                      "title": "Fundamentals of Human Nutrition",
                      "topics": [
                        "Energy Metabolism",
                        "Dietary Reference Intakes (DRIs)",
                        "Digestion and Absorption"
                      ]
                    },
                    {
                      "id": "ifsan_ch3",
                      "title": "Macronutrients and Micronutrients",
                      "topics": [
                        "Carbohydrates, Lipids, and Proteins",
                        "Vitamins (Fat-soluble, Water-soluble)",
                        "Minerals (Major, Trace)"
                      ]
                    },
                    {
                      "id": "ifsan_ch4",
                      "title": "The Food System",
                      "topics": [
                        "From Farm to Fork: The Food Supply Chain",
                        "Food Security and Sustainability",
                        "Global Food Issues"
                      ]
                    }
                  ]
                },
                {
                  "code": "Chem2101",
                  "name": "General Chemistry",
                  "description": "Covers fundamental principles of chemistry, including atomic structure, chemical bonding, stoichiometry, and solution chemistry, providing a basis for food chemistry.",
                  "credits": 4,
                  "outcomes": [
                    "Solve stoichiometric problems.",
                    "Understand atomic theory and chemical bonding.",
                    "Calculate concentrations of solutions.",
                    "Apply principles of chemical equilibrium."
                  ],
                  "chapters": [
                    {
                      "id": "gchem_ch1",
                      "title": "Atomic Structure and Periodicity",
                      "topics": [
                        "Atoms, Molecules, and Ions",
                        "Quantum Theory",
                        "Periodic Trends"
                      ]
                    },
                    {
                      "id": "gchem_ch2",
                      "title": "Chemical Bonding",
                      "topics": [
                        "Ionic and Covalent Bonding",
                        "Lewis Structures and VSEPR Theory",
                        "Molecular Orbital Theory"
                      ]
                    },
                    {
                      "id": "gchem_ch3",
                      "title": "Stoichiometry and Reactions",
                      "topics": [
                        "Chemical Equations and Stoichiometry",
                        "Reactions in Aqueous Solutions",
                        "Redox Reactions"
                      ]
                    },
                    {
                      "id": "gchem_ch4",
                      "title": "Gases and Solutions",
                      "topics": [
                        "The Ideal Gas Law",
                        "Intermolecular Forces",
                        "Solution Concentration"
                      ]
                    }
                  ]
                },
                {
                  "code": "Biol2103",
                  "name": "General Biology and Physiology",
                  "description": "An introduction to the principles of biology, including cell structure and function, genetics, and an overview of human physiology relevant to digestion and metabolism.",
                  "credits": 4,
                  "outcomes": [
                    "Describe the structure and function of cells.",
                    "Understand basic principles of genetics and inheritance.",
                    "Explain the major functions of human organ systems.",
                    "Describe the physiological processes of digestion and absorption."
                  ],
                  "chapters": [
                    {
                      "id": "gbio_ch1",
                      "title": "The Cell",
                      "topics": [
                        "Cellular Organelles",
                        "Cell Membranes and Transport",
                        "Cellular Respiration"
                      ]
                    },
                    {
                      "id": "gbio_ch2",
                      "title": "Genetics and Molecular Biology",
                      "topics": [
                        "DNA Replication",
                        "Transcription and Translation",
                        "Mendelian Genetics"
                      ]
                    },
                    {
                      "id": "gbio_ch3",
                      "title": "Human Physiology I: Digestion",
                      "topics": [
                        "The Digestive System",
                        "Enzymatic Breakdown of Food",
                        "Nutrient Absorption"
                      ]
                    },
                    {
                      "id": "gbio_ch4",
                      "title": "Human Physiology II: Metabolism",
                      "topics": [
                        "Hormonal Control of Metabolism",
                        "The Circulatory System",
                        "The Excretory System"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "FSAN2102",
                  "name": "Food Chemistry",
                  "description": "A study of the chemical composition of foods and the chemical and biochemical reactions that occur during handling, processing, and storage.",
                  "credits": 4,
                  "prerequisites": [
                    "Chem2101"
                  ],
                  "outcomes": [
                    "Understand the role of water and its effect on food stability.",
                    "Describe the structure and reactions of carbohydrates, lipids, and proteins in foods.",
                    "Analyze the causes and effects of food browning reactions.",
                    "Recognize the function of food additives."
                  ],
                  "chapters": [
                    {
                      "id": "fchem_ch1",
                      "title": "Water in Foods",
                      "topics": [
                        "Structure and Properties of Water",
                        "Water Activity and Food Stability",
                        "Sorption Isotherms"
                      ]
                    },
                    {
                      "id": "fchem_ch2",
                      "title": "Carbohydrates",
                      "topics": [
                        "Monosaccharides and Disaccharides",
                        "Polysaccharides (Starch, Pectin, Gums)",
                        "Non-enzymatic Browning (Maillard Reaction, Caramelization)"
                      ]
                    },
                    {
                      "id": "fchem_ch3",
                      "title": "Lipids",
                      "topics": [
                        "Fatty Acids and Triglycerides",
                        "Lipid Oxidation and Rancidity",
                        "Emulsions and Emulsifiers"
                      ]
                    },
                    {
                      "id": "fchem_ch4",
                      "title": "Proteins, Enzymes, and Additives",
                      "topics": [
                        "Protein Structure and Denaturation",
                        "Enzymatic Reactions in Foods",
                        "Food Additives (Preservatives, Colorants, Flavors)"
                      ]
                    }
                  ]
                },
                {
                  "code": "FSAN2104",
                  "name": "Food Microbiology",
                  "description": "Study of microorganisms important in foods, including spoilage organisms, pathogens, and beneficial microbes used in fermentations. Includes methods for enumeration and control.",
                  "credits": 4,
                  "prerequisites": [
                    "Biol2103"
                  ],
                  "outcomes": [
                    "Identify the major types of microorganisms found in food.",
                    "Understand the intrinsic and extrinsic factors affecting microbial growth.",
                    "Describe common foodborne pathogens and spoilage organisms.",
                    "Apply principles of microbial control in food systems."
                  ],
                  "chapters": [
                    {
                      "id": "fm_ch1",
                      "title": "Fundamentals of Food Microbiology",
                      "topics": [
                        "Bacteria, Yeasts, Molds, and Viruses",
                        "Microbial Growth and Enumeration",
                        "Factors Affecting Microbial Growth"
                      ]
                    },
                    {
                      "id": "fm_ch2",
                      "title": "Beneficial Microorganisms",
                      "topics": [
                        "Microorganisms in Food Fermentations (Dairy, Meat, Vegetables)",
                        "Probiotics and Prebiotics"
                      ]
                    },
                    {
                      "id": "fm_ch3",
                      "title": "Food Spoilage",
                      "topics": [
                        "Spoilage of Different Food Groups",
                        "Predictive Microbiology"
                      ]
                    },
                    {
                      "id": "fm_ch4",
                      "title": "Foodborne Pathogens and Control",
                      "topics": [
                        "Major Foodborne Pathogens (Salmonella, E. coli, Listeria)",
                        "Foodborne Illness Outbreaks",
                        "Principles of HACCP"
                      ]
                    }
                  ]
                },
                {
                  "code": "FSAN2106",
                  "name": "Principles of Food Processing",
                  "description": "An introduction to the unit operations used in the food industry to transform raw agricultural commodities into processed food products.",
                  "credits": 3,
                  "prerequisites": [
                    "FSAN2101"
                  ],
                  "outcomes": [
                    "Describe the principles of heat transfer and fluid flow in food processing.",
                    "Understand the theory behind major food processing operations.",
                    "Draw a process flow diagram for a simple food product.",
                    "Recognize the impact of processing on food quality."
                  ],
                  "chapters": [
                    {
                      "id": "pfp_ch1",
                      "title": "Engineering Fundamentals",
                      "topics": [
                        "Units and Dimensions",
                        "Material and Energy Balances",
                        "Basic Fluid Flow"
                      ]
                    },
                    {
                      "id": "pfp_ch2",
                      "title": "Heat Transfer in Food Processing",
                      "topics": [
                        "Conduction, Convection, and Radiation",
                        "Heat Exchangers",
                        "Thermal Processing Calculations"
                      ]
                    },
                    {
                      "id": "pfp_ch3",
                      "title": "Preservation Operations",
                      "topics": [
                        "Thermal Processing (Pasteurization, Sterilization)",
                        "Refrigeration and Freezing",
                        "Dehydration"
                      ]
                    },
                    {
                      "id": "pfp_ch4",
                      "title": "Other Unit Operations",
                      "topics": [
                        "Mixing and Emulsification",
                        "Size Reduction (Grinding, Milling)",
                        "Separation Processes (Filtration, Centrifugation)"
                      ]
                    }
                  ]
                },
                {
                  "code": "Stat2101",
                  "name": "Statistics for Life Sciences",
                  "description": "An introduction to statistical methods, experimental design, and data analysis relevant to biological, food, and nutritional sciences.",
                  "credits": 3,
                  "outcomes": [
                    "Calculate and interpret descriptive statistics.",
                    "Apply basic probability concepts.",
                    "Perform hypothesis testing (t-tests, ANOVA).",
                    "Conduct simple linear regression and correlation analysis."
                  ],
                  "chapters": [
                    {
                      "id": "statls_ch1",
                      "title": "Descriptive Statistics",
                      "topics": [
                        "Types of Data",
                        "Measures of Central Tendency and Dispersion",
                        "Graphical Data Representation"
                      ]
                    },
                    {
                      "id": "statls_ch2",
                      "title": "Probability and Distributions",
                      "topics": [
                        "Basic Probability",
                        "The Normal Distribution",
                        "Sampling Distributions"
                      ]
                    },
                    {
                      "id": "statls_ch3",
                      "title": "Hypothesis Testing",
                      "topics": [
                        "Confidence Intervals",
                        "t-Tests (One-sample, Two-sample)",
                        "Analysis of Variance (ANOVA)"
                      ]
                    },
                    {
                      "id": "statls_ch4",
                      "title": "Regression and Correlation",
                      "topics": [
                        "Correlation",
                        "Simple Linear Regression",
                        "Chi-Square Test"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 3": {
              "Semester I": [
                {
                  "code": "FSAN3101",
                  "name": "Food Analysis",
                  "description": "Principles and application of modern analytical techniques for the chemical and physical analysis of food components and properties.",
                  "credits": 4,
                  "prerequisites": [
                    "FSAN2102"
                  ],
                  "outcomes": [
                    "Apply principles of sampling and sample preparation.",
                    "Perform classic wet chemistry methods for food analysis.",
                    "Understand the principles of instrumental analysis techniques.",
                    "Select appropriate analytical methods for specific food matrices."
                  ],
                  "chapters": [
                    {
                      "id": "fa_ch1",
                      "title": "Fundamentals of Food Analysis",
                      "topics": [
                        "Sampling and Sample Preparation",
                        "Data Analysis and Quality Assurance",
                        "Official Methods of Analysis (AOAC)"
                      ]
                    },
                    {
                      "id": "fa_ch2",
                      "title": "Compositional Analysis",
                      "topics": [
                        "Moisture Analysis",
                        "Ash and Mineral Analysis",
                        "Lipid Analysis (Soxhlet)",
                        "Protein Analysis (Kjeldahl)"
                      ]
                    },
                    {
                      "id": "fa_ch3",
                      "title": "Instrumental Analysis",
                      "topics": [
                        "Spectroscopy (UV-Vis, AAS)",
                        "Chromatography (HPLC, GC)",
                        "Mass Spectrometry"
                      ]
                    },
                    {
                      "id": "fa_ch4",
                      "title": "Physical Property Analysis",
                      "topics": [
                        "Rheology and Texture Analysis",
                        "Color Measurement",
                        "Thermal Analysis"
                      ]
                    }
                  ]
                },
                {
                  "code": "FSAN3103",
                  "name": "Nutritional Biochemistry",
                  "description": "A study of the metabolic pathways of macronutrients and the biochemical roles of micronutrients in maintaining human health.",
                  "credits": 3,
                  "prerequisites": [
                    "FSAN2102"
                  ],
                  "outcomes": [
                    "Describe the major metabolic pathways for carbohydrates, lipids, and proteins.",
                    "Understand the integration and hormonal regulation of metabolism.",
                    "Explain the biochemical functions of vitamins and minerals.",
                    "Relate nutrient metabolism to common metabolic diseases."
                  ],
                  "chapters": [
                    {
                      "id": "nbiochem_ch1",
                      "title": "Metabolism of Carbohydrates",
                      "topics": [
                        "Glycolysis",
                        "Gluconeogenesis",
                        "Glycogen Metabolism",
                        "Citric Acid Cycle"
                      ]
                    },
                    {
                      "id": "nbiochem_ch2",
                      "title": "Metabolism of Lipids",
                      "topics": [
                        "Fatty Acid Oxidation",
                        "Fatty Acid Synthesis",
                        "Cholesterol Metabolism"
                      ]
                    },
                    {
                      "id": "nbiochem_ch3",
                      "title": "Metabolism of Proteins and Amino Acids",
                      "topics": [
                        "Amino Acid Catabolism",
                        "The Urea Cycle",
                        "Protein Synthesis"
                      ]
                    },
                    {
                      "id": "nbiochem_ch4",
                      "title": "Integration and Regulation",
                      "topics": [
                        "Hormonal Regulation (Insulin, Glucagon)",
                        "Metabolism in the Fed and Fasted States",
                        "Biochemical Role of Vitamins and Minerals"
                      ]
                    }
                  ]
                },
                {
                  "code": "FSAN3105",
                  "name": "Food Engineering Principles",
                  "description": "Application of engineering principles, including fluid mechanics and heat transfer, to the design and analysis of food processing operations.",
                  "credits": 3,
                  "prerequisites": [
                    "FSAN2106"
                  ],
                  "outcomes": [
                    "Analyze fluid flow behavior in food processing systems.",
                    "Design and analyze heat exchangers for food applications.",
                    "Understand the principles of mass transfer in food systems.",
                    "Apply thermodynamic principles to food processing."
                  ],
                  "chapters": [
                    {
                      "id": "fep_ch1",
                      "title": "Fluid Mechanics in Food Processing",
                      "topics": [
                        "Rheology of Food Materials",
                        "Flow of Newtonian and Non-Newtonian Fluids in Pipes",
                        "Pump Selection"
                      ]
                    },
                    {
                      "id": "fep_ch2",
                      "title": "Heat Transfer in Food Processing",
                      "topics": [
                        "Steady-State and Unsteady-State Heat Transfer",
                        "Design of Heat Exchangers",
                        "Thermal Process Calculations"
                      ]
                    },
                    {
                      "id": "fep_ch3",
                      "title": "Mass Transfer in Food Processing",
                      "topics": [
                        "Molecular Diffusion",
                        "Convective Mass Transfer",
                        "Application in Drying and Extraction"
                      ]
                    },
                    {
                      "id": "fep_ch4",
                      "title": "Thermodynamics in Food Processing",
                      "topics": [
                        "Psychrometrics and Humidification",
                        "Refrigeration Cycles",
                        "Energy Use in Food Plants"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "FSAN3102",
                  "name": "Sensory Evaluation of Foods",
                  "description": "Principles and methods for the sensory evaluation of food products, including analytical and affective testing, panelist training, and data analysis.",
                  "credits": 3,
                  "prerequisites": [
                    "Stat2101"
                  ],
                  "outcomes": [
                    "Design appropriate sensory tests to answer specific research questions.",
                    "Set up and conduct sensory evaluation sessions.",
                    "Statistically analyze and interpret sensory data.",
                    "Understand the physiological and psychological basis of sensory perception."
                  ],
                  "chapters": [
                    {
                      "id": "se_ch1",
                      "title": "Principles of Sensory Science",
                      "topics": [
                        "The Senses: Taste, Smell, Touch, Sight, Hearing",
                        "Factors Influencing Sensory Perception",
                        "Sensory Laboratory Setup"
                      ]
                    },
                    {
                      "id": "se_ch2",
                      "title": "Analytical Sensory Tests",
                      "topics": [
                        "Discrimination Tests (Triangle, Duo-Trio)",
                        "Descriptive Analysis",
                        "Panelist Screening and Training"
                      ]
                    },
                    {
                      "id": "se_ch3",
                      "title": "Affective (Consumer) Tests",
                      "topics": [
                        "Preference and Acceptance Tests",
                        "Hedonic Scaling",
                        "Consumer Test Design"
                      ]
                    },
                    {
                      "id": "se_ch4",
                      "title": "Data Analysis and Interpretation",
                      "topics": [
                        "Statistical Analysis of Sensory Data (ANOVA, t-tests)",
                        "Relating Sensory and Instrumental Data",
                        "Reporting Sensory Results"
                      ]
                    }
                  ]
                },
                {
                  "code": "FSAN3104",
                  "name": "Community Nutrition",
                  "description": "An examination of nutrition issues from a community and public health perspective, including nutritional assessment of populations and the design of community-based nutrition interventions.",
                  "credits": 3,
                  "prerequisites": [
                    "FSAN2101"
                  ],
                  "outcomes": [
                    "Conduct a community needs assessment.",
                    "Identify major nutritional problems in different population groups.",
                    "Design and evaluate a community nutrition program.",
                    "Understand the role of public policy in nutrition."
                  ],
                  "chapters": [
                    {
                      "id": "cnut_ch1",
                      "title": "Principles of Community Nutrition",
                      "topics": [
                        "Community Needs Assessment",
                        "Health Behavior Theories",
                        "Program Planning and Evaluation"
                      ]
                    },
                    {
                      "id": "cnut_ch2",
                      "title": "Nutrition Across the Lifespan",
                      "topics": [
                        "Maternal and Infant Nutrition",
                        "Childhood and Adolescent Nutrition",
                        "Nutrition for Older Adults"
                      ]
                    },
                    {
                      "id": "cnut_ch3",
                      "title": "Food and Nutrition Policy",
                      "topics": [
                        "National Nutrition Monitoring",
                        "Food Assistance Programs",
                        "Dietary Guidelines"
                      ]
                    },
                    {
                      "id": "cnut_ch4",
                      "title": "Global Nutrition Issues",
                      "topics": [
                        "Malnutrition (Undernutrition, Overnutrition)",
                        "Food Security",
                        "International Nutrition Programs"
                      ]
                    }
                  ]
                },
                {
                  "code": "FSAN3106",
                  "name": "Food Safety and Quality Management",
                  "description": "Principles of food safety management systems, including HACCP, and quality management systems like ISO 9000, as applied to the food industry.",
                  "credits": 3,
                  "prerequisites": [
                    "FSAN2104"
                  ],
                  "outcomes": [
                    "Identify and control major food safety hazards.",
                    "Develop a Hazard Analysis and Critical Control Point (HACCP) plan.",
                    "Understand the principles of quality assurance and quality control.",
                    "Apply statistical process control (SPC) to food manufacturing."
                  ],
                  "chapters": [
                    {
                      "id": "fsqm_ch1",
                      "title": "Food Safety Hazards",
                      "topics": [
                        "Biological, Chemical, and Physical Hazards",
                        "Allergens",
                        "Prerequisite Programs (GMPs, SSOPs)"
                      ]
                    },
                    {
                      "id": "fsqm_ch2",
                      "title": "HACCP System",
                      "topics": [
                        "The 7 Principles of HACCP",
                        "Conducting a Hazard Analysis",
                        "Establishing Critical Limits, Monitoring, and Corrective Actions"
                      ]
                    },
                    {
                      "id": "fsqm_ch3",
                      "title": "Quality Management",
                      "topics": [
                        "Quality Control vs. Quality Assurance",
                        "Total Quality Management (TQM)",
                        "ISO 9000 Series"
                      ]
                    },
                    {
                      "id": "fsqm_ch4",
                      "title": "Quality Tools",
                      "topics": [
                        "Statistical Process Control (SPC)",
                        "Six Sigma",
                        "Supplier Quality Assurance"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 4": {
              "Semester I": [
                {
                  "code": "FSAN4101",
                  "name": "Food Product Development",
                  "description": "A capstone, project-based course integrating food science principles in the development of a new food product from concept generation to bench-top prototype.",
                  "credits": 3,
                  "prerequisites": [
                    "FSAN3102",
                    "FSAN3106"
                  ],
                  "outcomes": [
                    "Generate and screen new food product ideas.",
                    "Develop a product formulation and process.",
                    "Understand the role of packaging and shelf-life testing.",
                    "Work effectively in a team to manage a product development project."
                  ],
                  "chapters": [
                    {
                      "id": "fpd_ch1",
                      "title": "Concept Development",
                      "topics": [
                        "The Product Development Process",
                        "Market Research and Ideation",
                        "Concept Screening"
                      ]
                    },
                    {
                      "id": "fpd_ch2",
                      "title": "Formulation and Ingredient Technology",
                      "topics": [
                        "Ingredient Functionality",
                        "Bench-top Formulation",
                        "Costing and Sourcing"
                      ]
                    },
                    {
                      "id": "fpd_ch3",
                      "title": "Prototyping and Evaluation",
                      "topics": [
                        "Lab-scale and Pilot Plant Production",
                        "Sensory and Consumer Testing",
                        "Shelf-life Evaluation"
                      ]
                    },
                    {
                      "id": "fpd_ch4",
                      "title": "Commercialization Considerations",
                      "topics": [
                        "Process Scale-up",
                        "Packaging Design",
                        "Regulatory Compliance"
                      ]
                    }
                  ]
                },
                {
                  "code": "FSAN4103",
                  "name": "Advanced Human Nutrition",
                  "description": "An in-depth study of the role of nutrition in the prevention and management of chronic diseases, such as cardiovascular disease, diabetes, and cancer.",
                  "credits": 3,
                  "prerequisites": [
                    "FSAN3103"
                  ],
                  "outcomes": [
                    "Understand the pathophysiology of major chronic diseases.",
                    "Critically evaluate scientific literature on diet-disease relationships.",
                    "Describe evidence-based dietary strategies for disease prevention.",
                    "Understand the role of functional foods and nutraceuticals."
                  ],
                  "chapters": [
                    {
                      "id": "ahn_ch1",
                      "title": "Nutrition and Cardiovascular Disease",
                      "topics": [
                        "Atherosclerosis",
                        "Dietary Lipids and Cholesterol",
                        "Hypertension and Dietary Sodium"
                      ]
                    },
                    {
                      "id": "ahn_ch2",
                      "title": "Nutrition and Metabolic Diseases",
                      "topics": [
                        "Diabetes Mellitus (Type 1 and Type 2)",
                        "Obesity and Weight Management",
                        "Metabolic Syndrome"
                      ]
                    },
                    {
                      "id": "ahn_ch3",
                      "title": "Nutrition and Cancer",
                      "topics": [
                        "Dietary Carcinogens and Anticarcinogens",
                        "Role of Antioxidants",
                        "Nutrition during Cancer Treatment"
                      ]
                    },
                    {
                      "id": "ahn_ch4",
                      "title": "Other Diet-Disease Relationships",
                      "topics": [
                        "Osteoporosis and Bone Health",
                        "Nutrition and Immunity",
                        "Nutrigenomics"
                      ]
                    }
                  ]
                },
                {
                  "code": "FSAN4105",
                  "name": "Food Laws and Regulations",
                  "description": "An overview of national and international food laws, regulations, and governing bodies responsible for ensuring a safe and honestly represented food supply.",
                  "credits": 2,
                  "outcomes": [
                    "Identify the major food regulatory agencies and their jurisdictions.",
                    "Understand the legal requirements for food labeling.",
                    "Describe regulations related to food additives and contaminants.",
                    "Recognize the importance of food standards and trade."
                  ],
                  "chapters": [
                    {
                      "id": "flr_ch1",
                      "title": "National Food Regulatory Framework",
                      "topics": [
                        "History of Food Law",
                        "Authority and Role of National Food Agencies",
                        "Food Adulteration and Misbranding"
                      ]
                    },
                    {
                      "id": "flr_ch2",
                      "title": "Food Labeling and Claims",
                      "topics": [
                        "Mandatory Labeling Requirements",
                        "Nutritional Labeling",
                        "Health and Nutrient Content Claims"
                      ]
                    },
                    {
                      "id": "flr_ch3",
                      "title": "Regulations for Food Safety",
                      "topics": [
                        "Food Additive Regulations",
                        "Contaminant and Residue Limits",
                        "Allergen Labeling"
                      ]
                    },
                    {
                      "id": "flr_ch4",
                      "title": "International Food Law",
                      "topics": [
                        "Codex Alimentarius",
                        "World Trade Organization (WTO) and SPS/TBT Agreements",
                        "Import and Export Regulations"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "FSAN4102",
                  "name": "B.Sc. Thesis/Project",
                  "description": "An independent research or development project supervised by a faculty member, integrating knowledge and skills acquired throughout the program, and culminating in a formal thesis and oral defense.",
                  "credits": 4,
                  "prerequisites": [
                    "FSAN4101"
                  ],
                  "outcomes": [
                    "Formulate a research question or project objective.",
                    "Design and conduct experiments or a development project.",
                    "Analyze and interpret results.",
                    "Communicate findings effectively in written and oral formats."
                  ],
                  "chapters": [
                    {
                      "id": "thesis_ch1",
                      "title": "Proposal Development and Literature Review",
                      "topics": [
                        "Identifying a Research Topic",
                        "Writing a Research Proposal",
                        "Conducting a Literature Search"
                      ]
                    },
                    {
                      "id": "thesis_ch2",
                      "title": "Methodology and Experimentation",
                      "topics": [
                        "Experimental Design",
                        "Data Collection",
                        "Laboratory Work/Project Execution"
                      ]
                    },
                    {
                      "id": "thesis_ch3",
                      "title": "Data Analysis and Interpretation",
                      "topics": [
                        "Statistical Analysis",
                        "Drawing Conclusions",
                        "Discussing Limitations and Future Work"
                      ]
                    },
                    {
                      "id": "thesis_ch4",
                      "title": "Thesis Writing and Defense",
                      "topics": [
                        "Structuring the Thesis Document",
                        "Scientific Writing",
                        "Preparing for Oral Defense"
                      ]
                    }
                  ]
                },
                {
                  "code": "FSAN4104",
                  "name": "Food Packaging",
                  "description": "A study of packaging materials, their properties, and their interaction with food products to enhance shelf life, safety, and marketability.",
                  "credits": 2,
                  "outcomes": [
                    "Identify and describe common food packaging materials.",
                    "Understand the role of packaging in food preservation.",
                    "Select appropriate packaging for different food systems.",
                    "Recognize trends in active, intelligent, and sustainable packaging."
                  ],
                  "chapters": [
                    {
                      "id": "fpkg_ch1",
                      "title": "Introduction to Food Packaging",
                      "topics": [
                        "Functions of Packaging",
                        "Packaging Materials: Glass, Metal, Paper, Plastics"
                      ]
                    },
                    {
                      "id": "fpkg_ch2",
                      "title": "Packaging and Shelf Life",
                      "topics": [
                        "Permeability and Mass Transfer",
                        "Food-Package Interactions",
                        "Shelf-life Modeling"
                      ]
                    },
                    {
                      "id": "fpkg_ch3",
                      "title": "Advanced Packaging Technologies",
                      "topics": [
                        "Modified Atmosphere Packaging (MAP)",
                        "Active Packaging",
                        "Intelligent Packaging"
                      ]
                    },
                    {
                      "id": "fpkg_ch4",
                      "title": "Packaging Sustainability and Safety",
                      "topics": [
                        "Sustainable Packaging",
                        "Recycling and Biodegradability",
                        "Packaging Safety and Migration"
                      ]
                    }
                  ]
                },
                {
                  "code": "FSAN4112",
                  "name": "Internship/Professional Practice",
                  "description": "Supervised practical work experience in the food industry, a public health organization, or a research institution, applying academic knowledge in a real-world setting.",
                  "credits": 2,
                  "outcomes": [
                    "Gain practical experience in a professional environment.",
                    "Develop professional skills like teamwork and communication.",
                    "Apply theoretical knowledge to solve real-world problems.",
                    "Enhance career awareness and professional networking."
                  ],
                  "chapters": [
                    {
                      "id": "intern_ch1",
                      "title": "Professional Development",
                      "topics": [
                        "Resume Writing and Interview Skills",
                        "Workplace Ethics",
                        "Professional Communication"
                      ]
                    },
                    {
                      "id": "intern_ch2",
                      "title": "Practical Application",
                      "topics": [
                        "On-the-Job Training",
                        "Project Work",
                        "Applying Classroom Knowledge"
                      ]
                    },
                    {
                      "id": "intern_ch3",
                      "title": "Reflection and Reporting",
                      "topics": [
                        "Documenting Work Experience",
                        "Preparing Internship Report",
                        "Final Presentation"
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          "name": "Geology",
          "abbreviation": "Geol",
          "coursesByYearSemester": {
            "Year 2": {
              "Semester I": [
                {
                  "code": "Geol2101",
                  "name": "Physical Geology",
                  "description": "An introduction to the Earth's materials, the processes that shape its surface and interior, and the concept of geologic time. This course provides a foundation for all other geology disciplines.",
                  "credits": 4,
                  "outcomes": [
                    "Identify common minerals and rocks.",
                    "Understand the theory of plate tectonics and its role in shaping the Earth.",
                    "Describe the processes of volcanism, earthquakes, weathering, and erosion.",
                    "Interpret basic geological maps and cross-sections."
                  ],
                  "chapters": [
                    {
                      "id": "pg_ch1",
                      "title": "Introduction to Earth Systems",
                      "topics": [
                        "The Geologic Time Scale",
                        "Earth's Structure and Composition",
                        "The Theory of Plate Tectonics",
                        "Continental Drift and Seafloor Spreading"
                      ]
                    },
                    {
                      "id": "pg_ch2",
                      "title": "Earth Materials",
                      "topics": [
                        "Matter and Minerals",
                        "Igneous Rocks and Volcanic Activity",
                        "Sedimentary Rocks and Processes",
                        "Metamorphic Rocks"
                      ]
                    },
                    {
                      "id": "pg_ch3",
                      "title": "Internal Processes",
                      "topics": [
                        "Earthquakes and Seismology",
                        "Mountain Building and Crustal Deformation",
                        "Geologic Structures (Folds, Faults)"
                      ]
                    },
                    {
                      "id": "pg_ch4",
                      "title": "Surface Processes",
                      "topics": [
                        "Weathering and Soil Formation",
                        "Mass Wasting",
                        "Running Water (Streams and Rivers)",
                        "Groundwater, Glaciers, and Deserts"
                      ]
                    }
                  ]
                },
                {
                  "code": "Geol2103",
                  "name": "Historical Geology",
                  "description": "A study of the Earth's 4.6-billion-year history, focusing on the evolution of continents, oceans, atmosphere, and life as recorded in the rock and fossil records.",
                  "credits": 4,
                  "prerequisites": [
                    "Geol2101"
                  ],
                  "outcomes": [
                    "Apply principles of stratigraphy to interpret Earth history.",
                    "Understand methods of relative and absolute dating.",
                    "Describe the major events in the history of life, including mass extinctions.",
                    "Relate tectonic events to the geologic history of major continents."
                  ],
                  "chapters": [
                    {
                      "id": "hg_ch1",
                      "title": "Principles of Interpreting Earth History",
                      "topics": [
                        "Relative Dating Principles (Superposition, Cross-Cutting)",
                        "Stratigraphy and Correlation",
                        "Geologic Time and Absolute Dating (Radiometric Methods)"
                      ]
                    },
                    {
                      "id": "hg_ch2",
                      "title": "Precambrian Earth and the Origin of Life",
                      "topics": [
                        "Hadean and Archean Eons",
                        "Proterozoic Eon and the Rise of Eukaryotes",
                        "Precambrian Tectonics and Supercontinents"
                      ]
                    },
                    {
                      "id": "hg_ch3",
                      "title": "The Paleozoic Era",
                      "topics": [
                        "The Cambrian Explosion",
                        "Paleozoic Life (Invertebrates, Fish, Amphibians)",
                        "Paleozoic Tectonics and Climate"
                      ]
                    },
                    {
                      "id": "hg_ch4",
                      "title": "The Mesozoic and Cenozoic Eras",
                      "topics": [
                        "The Age of Reptiles (Dinosaurs)",
                        "The Breakup of Pangea",
                        "The Age of Mammals and Human Evolution",
                        "Cenozoic Climate Change and Ice Ages"
                      ]
                    }
                  ]
                },
                {
                  "code": "Chem2101",
                  "name": "General Chemistry I",
                  "description": "Covers fundamental principles of chemistry, including atomic structure, chemical bonding, stoichiometry, and solution chemistry, providing a basis for geochemistry and mineralogy.",
                  "credits": 4,
                  "chapters": []
                }
              ],
              "Semester II": [
                {
                  "code": "Geol2102",
                  "name": "Mineralogy",
                  "description": "Principles of crystallography, crystal chemistry, and systematic identification of minerals using physical properties and optical microscopy.",
                  "credits": 4,
                  "prerequisites": [
                    "Geol2101",
                    "Chem2101"
                  ],
                  "outcomes": [
                    "Identify over 100 common rock-forming and ore minerals in hand samples.",
                    "Understand the principles of crystallography and crystal systems.",
                    "Use a petrographic microscope to identify minerals in thin section.",
                    "Relate mineral chemistry and structure to physical properties."
                  ],
                  "chapters": [
                    {
                      "id": "min_ch1",
                      "title": "Crystallography and Crystal Chemistry",
                      "topics": [
                        "Symmetry Operations and Point Groups",
                        "Crystal Systems and Lattices",
                        "Chemical Bonding in Minerals",
                        "Isomorphism and Polymorphism"
                      ]
                    },
                    {
                      "id": "min_ch2",
                      "title": "Optical Mineralogy",
                      "topics": [
                        "The Petrographic Microscope",
                        "Properties of Light in Crystals",
                        "Identification of Isotropic and Anisotropic Minerals",
                        "Interference Figures"
                      ]
                    },
                    {
                      "id": "min_ch3",
                      "title": "Systematic Mineralogy: Silicates",
                      "topics": [
                        "Nesosilicates, Sorosilicates, Cyclosilicates",
                        "Inosilicates (Pyroxenes, Amphiboles)",
                        "Phyllosilicates (Micas, Clays)",
                        "Tectosilicates (Quartz, Feldspars)"
                      ]
                    },
                    {
                      "id": "min_ch4",
                      "title": "Systematic Mineralogy: Non-silicates",
                      "topics": [
                        "Native Elements",
                        "Sulfides and Sulfates",
                        "Oxides and Hydroxides",
                        "Carbonates and Halides"
                      ]
                    }
                  ]
                },
                {
                  "code": "Geol2104",
                  "name": "Geology Field Methods",
                  "description": "Introduction to geological fieldwork techniques, including the use of a Brunton compass, topographic map reading, description of rocks in outcrops, and the construction of geologic maps and cross-sections.",
                  "credits": 3,
                  "prerequisites": [
                    "Geol2101"
                  ],
                  "outcomes": [
                    "Accurately measure the orientation of planar and linear geologic features.",
                    "Navigate and locate positions using topographic maps and GPS.",
                    "Create a detailed geologic map of a field area.",
                    "Construct geologically reasonable cross-sections from map data."
                  ],
                  "chapters": [
                    {
                      "id": "gfm_ch1",
                      "title": "Navigation and Measurement",
                      "topics": [
                        "Topographic Map Interpretation",
                        "Use of GPS and Altimeter",
                        "Use of the Brunton Compass",
                        "Measuring Strike and Dip"
                      ]
                    },
                    {
                      "id": "gfm_ch2",
                      "title": "Field Data Collection",
                      "topics": [
                        "Keeping a Field Notebook",
                        "Describing Rocks in Outcrop",
                        "Identifying Geologic Contacts"
                      ]
                    },
                    {
                      "id": "gfm_ch3",
                      "title": "Geologic Mapping",
                      "topics": [
                        "Mapping on a Base Map",
                        "Mapping Geologic Units and Contacts",
                        "Mapping Structural Features"
                      ]
                    },
                    {
                      "id": "gfm_ch4",
                      "title": "Data Synthesis",
                      "topics": [
                        "Constructing Geologic Cross-Sections",
                        "Creating a Stratigraphic Column",
                        "Writing a Geologic Report"
                      ]
                    }
                  ]
                },
                {
                  "code": "Phys2101",
                  "name": "General Physics I (Mechanics)",
                  "description": "Covers classical mechanics, including kinematics, Newton's laws, work, energy, and momentum, providing a basis for geophysics and structural geology.",
                  "credits": 4,
                  "chapters": []
                }
              ]
            },
            "Year 3": {
              "Semester I": [
                {
                  "code": "Geol3101",
                  "name": "Igneous and Metamorphic Petrology",
                  "description": "Study of the origin, composition, and classification of igneous and metamorphic rocks, using hand samples, thin sections, and geochemistry to interpret petrogenesis.",
                  "credits": 4,
                  "prerequisites": [
                    "Geol2102"
                  ],
                  "outcomes": [
                    "Classify igneous and metamorphic rocks based on texture and mineralogy.",
                    "Interpret phase diagrams to understand magma evolution and metamorphic reactions.",
                    "Use geochemical data to determine tectonic settings of rock suites.",
                    "Identify key rock types and textures in thin section."
                  ],
                  "chapters": [
                    {
                      "id": "petro_ch1",
                      "title": "Igneous Petrology",
                      "topics": [
                        "Magma Generation and Properties",
                        "Classification of Igneous Rocks",
                        "Magmatic Differentiation Processes",
                        "Igneous Rocks and Tectonic Settings"
                      ]
                    },
                    {
                      "id": "petro_ch2",
                      "title": "Thermodynamics and Phase Equilibria",
                      "topics": [
                        "Gibbs Phase Rule",
                        "Binary and Ternary Phase Diagrams",
                        "Geothermometry and Geobarometry"
                      ]
                    },
                    {
                      "id": "petro_ch3",
                      "title": "Metamorphic Petrology",
                      "topics": [
                        "Agents of Metamorphism",
                        "Types of Metamorphism (Contact, Regional)",
                        "Classification of Metamorphic Rocks"
                      ]
                    },
                    {
                      "id":'petro_ch4',
                      "title": "Metamorphic Facies and Reactions",
                      "topics": [
                        "The Metamorphic Facies Concept",
                        "Graphical Representation of Mineral Assemblages",
                        "Pressure-Temperature-Time Paths"
                      ]
                    }
                  ]
                },
                {
                  "code": "Geol3103",
                  "name": "Sedimentology and Stratigraphy",
                  "description": "A study of the processes of sedimentation and the interpretation of sedimentary rocks and their arrangements in the stratigraphic record to reconstruct past environments.",
                  "credits": 4,
                  "prerequisites": [
                    "Geol2102"
                  ],
                  "outcomes": [
                    "Identify sedimentary structures and use them to interpret depositional processes.",
                    "Describe major depositional environments (e.g., fluvial, deltaic, marine).",
                    "Apply principles of stratigraphy to correlate rock units.",
                    "Understand the fundamentals of sequence and seismic stratigraphy."
                  ],
                  "chapters": [
                    {
                      "id": "sedstrat_ch1",
                      "title": "Sedimentology",
                      "topics": [
                        "Sediment Transport by Water and Wind",
                        "Physical Sedimentary Structures",
                        "Diagenesis",
                        "Classification of Sedimentary Rocks"
                      ]
                    },
                    {
                      "id": "sedstrat_ch2",
                      "title": "Depositional Environments",
                      "topics": [
                        "Terrestrial Environments (Fluvial, Eolian, Glacial)",
                        "Coastal and Shallow Marine Environments (Deltas, Beaches, Reefs)",
                        "Deep Marine Environments"
                      ]
                    },
                    {
                      "id": "sedstrat_ch3",
                      "title": "Stratigraphy",
                      "topics": [
                        "Lithostratigraphy",
                        "Biostratigraphy",
                        "Chronostratigraphy",
                        "Correlation Techniques"
                      ]
                    },
                    {
                      "id": "sedstrat_ch4",
                      "title": "Modern Stratigraphic Concepts",
                      "topics": [
                        "Sequence Stratigraphy",
                        "Seismic Stratigraphy",
                        "Basin Analysis"
                      ]
                    }
                  ]
                },
                {
                  "code": "Geol3105",
                  "name": "Structural Geology",
                  "description": "Analysis of deformed rocks to understand the geometry, kinematics, and dynamics of rock deformation from the microscopic to the plate-tectonic scale.",
                  "credits": 4,
                  "prerequisites": [
                    "Geol2101",
                    "Phys2101"
                  ],
                  "outcomes": [
                    "Identify and measure geologic structures in the field and on maps.",
                    "Use stereographic projections to solve geometric problems.",
                    "Understand the relationship between stress, strain, and rock rheology.",
                    "Relate structural styles to different tectonic settings."
                  ],
                  "chapters": [
                    {
                      "id": "sg_ch1",
                      "title": "Stress and Strain",
                      "topics": [
                        "Concept of Stress and the Stress Tensor",
                        "Strain Analysis",
                        "Rheology and Rock Deformation Mechanisms"
                      ]
                    },
                    {
                      "id": "sg_ch2",
                      "title": "Brittle Structures",
                      "topics": [
                        "Joints and Veins",
                        "Fault Classification and Geometry",
                        "Fault Rock Analysis"
                      ]
                    },
                    {
                      "id": "sg_ch3",
                      "title": "Ductile Structures",
                      "topics": [
                        "Fold Geometry and Classification",
                        "Foliations and Lineations",
                        "Shear Zones and Mylonites"
                      ]
                    },
                    {
                      "id": "sg_ch4",
                      "title": "Geologic Maps and Tectonics",
                      "topics": [
                        "Advanced Map Interpretation",
                        "Stereographic Projections",
                        "Introduction to Tectonics"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "Geol3102",
                  "name": "Invertebrate Paleontology",
                  "description": "A survey of the major invertebrate fossil groups, focusing on their morphology, evolution, and application in biostratigraphy and paleoecology.",
                  "credits": 3,
                  "prerequisites": [
                    "Geol2103"
                  ],
                  "outcomes": [
                    "Identify major invertebrate phyla from fossil specimens.",
                    "Understand the principles of fossil preservation.",
                    "Use fossils for biostratigraphic correlation.",
                    "Reconstruct ancient environments using fossil assemblages."
                  ],
                  "chapters": [
                    {
                      "id": "paleo_ch1",
                      "title": "Principles of Paleontology",
                      "topics": [
                        "Taphonomy (Fossilization)",
                        "Evolution and Extinction",
                        "Classification and Systematics"
                      ]
                    },
                    {
                      "id": "paleo_ch2",
                      "title": "Major Fossil Groups I",
                      "topics": [
                        "Foraminifera and Radiolaria",
                        "Porifera (Sponges) and Cnidaria (Corals)",
                        "Brachiopods and Bryozoans"
                      ]
                    },
                    {
                      "id": "paleo_ch3",
                      "title": "Major Fossil Groups II",
                      "topics": [
                        "Mollusca (Bivalves, Gastropods, Cephalopods)",
                        "Arthropoda (Trilobites)",
                        "Echinodermata (Crinoids, Echinoids)"
                      ]
                    },
                    {
                      "id": "paleo_ch4",
                      "title": "Applications of Paleontology",
                      "topics": [
                        "Biostratigraphy",
                        "Paleoecology and Paleoclimatology",
                        "Evolutionary Faunas"
                      ]
                    }
                  ]
                },
                {
                  "code": "Geol3104",
                  "name": "Geochemistry",
                  "description": "Application of chemical principles to understand geological processes, including element distribution, isotope geochemistry, and aqueous geochemistry.",
                  "credits": 3,
                  "prerequisites": [
                    "Geol2102"
                  ],
                  "outcomes": [
                    "Apply thermodynamic principles to geological systems.",
                    "Understand the principles of stable and radiogenic isotope geochemistry.",
                    "Analyze the chemistry of natural waters.",
                    "Use geochemical data to model geological processes."
                  ],
                  "chapters": [
                    {
                      "id": "geochem_ch1",
                      "title": "Chemical Thermodynamics in Geology",
                      "topics": [
                        "Gibbs Free Energy and Chemical Equilibrium",
                        "Mineral Stability Diagrams",
                        "Aqueous Solutions and Activities"
                      ]
                    },
                    {
                      "id": "geochem_ch2",
                      "title": "Isotope Geochemistry",
                      "topics": [
                        "Stable Isotopes (O, H, C, S)",
                        "Radiogenic Isotopes and Geochronology (U-Pb, Rb-Sr)",
                        "Isotopes as Tracers"
                      ]
                    },
                    {
                      "id": "geochem_ch3",
                      "title": "Aqueous Geochemistry",
                      "topics": [
                        "Water-Rock Interactions",
                        "Redox Reactions in Natural Waters",
                        "Mineral Dissolution and Precipitation"
                      ]
                    }
                  ]
                },
                {
                  "code": "Geol3106",
                  "name": "Geophysics",
                  "description": "Introduction to geophysical methods used to study the Earth's subsurface, including seismic, gravity, magnetic, and electrical techniques.",
                  "credits": 3,
                  "prerequisites": [
                    "Geol2101",
                    "Phys2101"
                  ],
                  "outcomes": [
                    "Understand the physical principles behind major geophysical methods.",
                    "Interpret basic seismic reflection and refraction data.",
                    "Analyze gravity and magnetic anomalies.",
                    "Select appropriate geophysical methods for specific geological problems."
                  ],
                  "chapters": [
                    {
                      "id": "geophys_ch1",
                      "title": "Seismology and Seismic Methods",
                      "topics": [
                        "Stress, Strain, and Elastic Waves",
                        "Seismic Reflection Method",
                        "Seismic Refraction Method"
                      ]
                    },
                    {
                      "id": "geophys_ch2",
                      "title": "Gravity Methods",
                      "topics": [
                        "Earth's Gravity Field",
                        "Gravity Anomalies",
                        "Data Acquisition and Interpretation"
                      ]
                    },
                    {
                      "id": "geophys_ch3",
                      "title": "Magnetic Methods",
                      "topics": [
                        "Earth's Magnetic Field",
                        "Magnetic Anomalies",
                        "Paleomagnetism"
                      ]
                    },
                    {
                      "id": "geophys_ch4",
                      "title": "Electrical and Electromagnetic Methods",
                      "topics": [
                        "Resistivity Methods",
                        "Self-Potential and Induced Polarization",
                        "Ground-Penetrating Radar (GPR)"
                      ]
                    }
                  ]
                }
              ],
              "Summer": [
                {
                  "code": "Geol3110",
                  "name": "Geology Field Camp",
                  "description": "An intensive, multi-week capstone field course where students apply their geological knowledge to map and interpret complex geologic terrains.",
                  "credits": 6,
                  "prerequisites": [
                    "Geol3101",
                    "Geol3103",
                    "Geol3105"
                  ],
                  "outcomes": [
                    "Independently produce professional-quality geologic maps and reports.",
                    "Synthesize diverse geological data (structural, stratigraphic, petrologic) into a coherent regional history.",
                    "Work effectively in a team under challenging field conditions.",
                    "Develop advanced skills in 3D visualization and problem-solving."
                  ],
                  "chapters": [
                    {
                      "id": "fc_ch1",
                      "title": "Project 1: Mapping Sedimentary and Volcanic Terrains",
                      "topics": [
                        "Measuring Stratigraphic Sections",
                        "Mapping Volcanic Flows and Tuffs",
                        "Constructing a Tectono-stratigraphic History"
                      ]
                    },
                    {
                      "id": "fc_ch2",
                      "title": "Project 2: Mapping Deformed Metamorphic and Igneous Terrains",
                      "topics": [
                        "Mapping in Structurally Complex Areas",
                        "Analyzing Fold and Fault Systems",
                        "Interpreting Plutonic and Metamorphic Relationships"
                      ]
                    },
                    {
                      "id": "fc_ch3",
                      "title": "Project 3: Regional Synthesis and Tectonics",
                      "topics": [
                        "Integrating Multiple Map Areas",
                        "Developing a Regional Tectonic Model",
                        "Final Report Preparation and Presentation"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 4": {
              "Semester I": [
                {
                  "code": "Geol4101",
                  "name": "Hydrogeology",
                  "description": "Study of the occurrence, movement, and chemistry of groundwater, and its role as a resource and in geological processes.",
                  "credits": 3,
                  "prerequisites": [
                    "Geol2101"
                  ],
                  "outcomes": [
                    "Apply Darcy's Law to solve groundwater flow problems.",
                    "Analyze aquifer tests to determine hydraulic properties.",
                    "Understand basic groundwater contamination and transport.",
                    "Delineate wellhead protection areas."
                  ],
                  "chapters": [
                    {
                      "id": "hydro_ch1",
                      "title": "Principles of Groundwater Flow",
                      "topics": [
                        "The Hydrologic Cycle",
                        "Aquifers and Aquitards",
                        "Darcy's Law and Hydraulic Conductivity",
                        "Groundwater Flow Equations"
                      ]
                    },
                    {
                      "id": "hydro_ch2",
                      "title": "Well Hydraulics and Aquifer Testing",
                      "topics": [
                        "Steady-State and Transient Flow to Wells",
                        "The Theis and Cooper-Jacob Methods",
                        "Pumping Test Design and Analysis"
                      ]
                    },
                    {
                      "id": "hydro_ch3",
                      "title": "Groundwater Chemistry",
                      "topics": [
                        "Chemistry of Natural Waters",
                        "Water-Rock Interactions",
                        "Introduction to Contaminant Hydrogeology"
                      ]
                    },
                    {
                      "id": "hydro_ch4",
                      "title": "Groundwater Management",
                      "topics": [
                        "Groundwater Modeling",
                        "Groundwater Management and Sustainability",
                        "Wellhead Protection"
                      ]
                    }
                  ]
                },
                {
                  "code": "Geol4103",
                  "name": "Economic Geology",
                  "description": "Study of the geologic processes that form mineral and energy deposits, and the methods used to explore for and evaluate these resources.",
                  "credits": 3,
                  "prerequisites": [
                    "Geol3101",
                    "Geol3104"
                  ],
                  "outcomes": [
                    "Describe the major types of ore-forming systems.",
                    "Relate mineral deposit types to specific tectonic settings.",
                    "Understand the geology of fossil fuel and geothermal resources.",
                    "Apply exploration techniques to find mineral deposits."
                  ],
                  "chapters": [
                    {
                      "id": "eg_ch1",
                      "title": "Ore-Forming Processes",
                      "topics": [
                        "Magmatic Ore Deposits",
                        "Hydrothermal Systems and Deposits",
                        "Sedimentary and Surficial Ore Deposits"
                      ]
                    },
                    {
                      "id": "eg_ch2",
                      "title": "Mineral Deposit Models",
                      "topics": [
                        "Porphyry and Epithermal Deposits",
                        "Volcanogenic Massive Sulfide (VMS) Deposits",
                        "Sediment-Hosted Deposits"
                      ]
                    },
                    {
                      "id": "eg_ch3",
                      "title": "Energy Resources",
                      "topics": [
                        "Petroleum Geology",
                        "Coal Geology",
                        "Geothermal Energy",
                        "Uranium Deposits"
                      ]
                    },
                    {
                      "id": "eg_ch4",
                      "title": "Exploration and Evaluation",
                      "topics": [
                        "Geochemical and Geophysical Exploration",
                        "Drilling and Sampling",
                        "Resource and Reserve Estimation"
                      ]
                    }
                  ]
                },
                {
                  "code": "Geol4105",
                  "name": "B.Sc. Thesis I / Research Methods",
                  "description": "The first phase of the final year thesis. Students select a research topic, conduct a comprehensive literature review, formulate a hypothesis, and write a detailed research proposal.",
                  "credits": 2,
                  "chapters": [
                    {
                      "id": "thesis1_ch1",
                      "title": "Topic Selection and Literature Review",
                      "topics": [
                        "Identifying a Research Problem",
                        "Using Scientific Databases",
                        "Critically Evaluating Scientific Literature"
                      ]
                    },
                    {
                      "id": "thesis1_ch2",
                      "title": "Proposal Development",
                      "topics": [
                        "Formulating Hypotheses and Objectives",
                        "Developing a Methodology",
                        "Writing the Research Proposal"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "Geol4102",
                  "name": "Tectonics",
                  "description": "A synthesis of structural geology, geophysics, and petrology to understand the large-scale processes that drive plate tectonics and shape the Earth's lithosphere.",
                  "credits": 3,
                  "prerequisites": [
                    "Geol3105"
                  ],
                  "outcomes": [
                    "Describe the driving forces of plate tectonics.",
                    "Analyze the characteristics of different plate boundaries.",
                    "Interpret regional geology in a plate tectonic context.",
                    "Understand the evolution of mountain belts and continental rifts."
                  ],
                  "chapters": [
                    {
                      "id": "tec_ch1",
                      "title": "Plate Kinematics and Rheology",
                      "topics": [
                        "Relative and Absolute Plate Motions",
                        "Lithospheric Rheology",
                        "Driving Forces of Plate Tectonics"
                      ]
                    },
                    {
                      "id": "tec_ch2",
                      "title": "Divergent and Transform Boundaries",
                      "topics": [
                        "Continental Rifting",
                        "Mid-Ocean Ridges",
                        "Transform Faults"
                      ]
                    },
                    {
                      "id": "tec_ch3",
                      "title": "Convergent Boundaries",
                      "topics": [
                        "Subduction Zones",
                        "Volcanic Arcs",
                        "Continental Collision and Orogenesis"
                      ]
                    }
                  ]
                },
                {
                  "code": "Geol4104",
                  "name": "Environmental Geology",
                  "description": "Application of geological principles to understand and mitigate natural hazards and environmental problems arising from human interaction with the geologic environment.",
                  "credits": 3,
                  "outcomes": [
                    "Assess risks associated with geological hazards like earthquakes, landslides, and floods.",
                    "Understand the geological aspects of waste disposal and land use planning.",
                    "Apply geological knowledge to issues of water and soil contamination.",
                    "Evaluate the impact of climate change on geological systems."
                  ],
                  "chapters": [
                    {
                      "id": "envg_ch1",
                      "title": "Geological Hazards",
                      "topics": [
                        "Earthquake and Volcanic Hazards",
                        "Landslides and Mass Wasting",
                        "Flooding and Coastal Processes"
                      ]
                    },
                    {
                      "id": "envg_ch2",
                      "title": "Resources and Pollution",
                      "topics": [
                        "Water Resources and Contamination",
                        "Soils and Soil Degradation",
                        "Geology of Waste Disposal"
                      ]
                    },
                    {
                      "id": "envg_ch3",
                      "title": "Geology and Society",
                      "topics": [
                        "Land-Use Planning",
                        "Medical Geology",
                        "Climate Change and Geology"
                      ]
                    }
                  ]
                },
                {
                  "code": "Geol4106",
                  "name": "B.Sc. Thesis II",
                  "description": "Execution of the research proposal from Thesis I. Students collect and analyze data, interpret results, and write a comprehensive thesis document, culminating in an oral defense.",
                  "credits": 4,
                  "prerequisites": [
                    "Geol4105"
                  ],
                  "chapters": [
                    {
                      "id": "thesis2_ch1",
                      "title": "Data Collection and Analysis",
                      "topics": [
                        "Fieldwork or Laboratory Analysis",
                        "Data Processing and Visualization",
                        "Statistical Analysis"
                      ]
                    },
                    {
                      "id": "thesis2_ch2",
                      "title": "Results, Discussion, and Conclusion",
                      "topics": [
                        "Presenting Results",
                        "Interpreting Data and Discussing Implications",
                        "Drawing Conclusions"
                      ]
                    },
                    {
                      "id": "thesis2_ch3",
                      "title": "Thesis Writing and Defense",
                      "topics": [
                        "Structuring and Writing the Thesis",
                        "Creating Figures and Tables",
                        "Preparing and Delivering the Oral Defense"
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          "name": "Biotechnology",
          "abbreviation": "BIOT",
          "coursesByYearSemester": {
            "Year 2": {
              "Semester I": [
                {
                  "code": "BIOT2101",
                  "name": "Introduction to Biotechnology",
                  "description": "A foundational course covering the interdisciplinary nature of biotechnology, its historical development, major applications in various sectors, and the associated ethical considerations.",
                  "credits": 3,
                  "outcomes": [
                    "Understand the scope and interdisciplinary nature of biotechnology.",
                    "Describe the major historical milestones and key discoveries.",
                    "Identify applications of biotechnology in medicine, agriculture, and industry.",
                    "Recognize the fundamental ethical and social issues related to biotechnology."
                  ],
                  "chapters": [
                    {
                      "id": "biot2101_ch1",
                      "title": "History and Scope of Biotechnology",
                      "topics": [
                        "Definitions of Biotechnology (Old and New)",
                        "Historical Timeline: Fermentation to Genetic Engineering",
                        "Interdisciplinary Nature: Biology, Chemistry, Engineering",
                        "The Biotechnology Industry Landscape"
                      ]
                    },
                    {
                      "id": "biot2101_ch2",
                      "title": "Fundamentals of Molecular Biology",
                      "topics": [
                        "Review of DNA, RNA, and Protein Structure",
                        "The Central Dogma: Replication, Transcription, Translation",
                        "Introduction to Genes and Genomes"
                      ]
                    },
                    {
                      "id": "biot2101_ch3",
                      "title": "Major Areas of Biotechnology",
                      "topics": [
                        "Medical Biotechnology (Pharmaceuticals, Diagnostics)",
                        "Agricultural Biotechnology (GMOs, Crop Improvement)",
                        "Industrial Biotechnology (Enzymes, Biofuels)",
                        "Environmental Biotechnology (Bioremediation)"
                      ]
                    },
                    {
                      "id": "biot2101_ch4",
                      "title": "Ethics and Social Impact",
                      "topics": [
                        "Introduction to Bioethics",
                        "Public Perception of Biotechnology",
                        "Regulatory Agencies and Oversight",
                        "Patenting Life"
                      ]
                    }
                  ]
                },
                {
                  "code": "Chem2101",
                  "name": "General Chemistry",
                  "description": "Covers fundamental principles of chemistry, including atomic structure, chemical bonding, stoichiometry, and solution chemistry, providing a basis for biochemistry and analytical methods.",
                  "credits": 4,
                  "chapters": [
                    {
                      "id": "chem2101_ch1",
                      "title": "Atomic Structure and Periodicity",
                      "topics": [
                        "Atoms, Molecules, and Ions",
                        "Quantum Theory and Electron Configurations",
                        "Periodic Trends"
                      ]
                    },
                    {
                      "id": "chem2101_ch2",
                      "title": "Chemical Bonding",
                      "topics": [
                        "Ionic and Covalent Bonding",
                        "Lewis Structures and VSEPR Theory",
                        "Intermolecular Forces"
                      ]
                    },
                    {
                      "id": "chem2101_ch3",
                      "title": "Stoichiometry and Chemical Reactions",
                      "topics": [
                        "Chemical Equations and Stoichiometry",
                        "Reactions in Aqueous Solutions",
                        "Redox Reactions"
                      ]
                    }
                  ]
                },
                {
                  "code": "Biol2103",
                  "name": "General Biology",
                  "description": "An introduction to the core principles of biology, including cell structure and function, genetics, evolution, and the diversity of life.",
                  "credits": 4,
                  "chapters": [
                    {
                      "id": "biol2103_ch1",
                      "title": "The Cell",
                      "topics": [
                        "Prokaryotic and Eukaryotic Cells",
                        "Cellular Organelles",
                        "Cell Membranes and Transport",
                        "Cellular Respiration and Photosynthesis"
                      ]
                    },
                    {
                      "id": "biol2103_ch2",
                      "title": "Genetics and Molecular Biology",
                      "topics": [
                        "DNA Structure and Replication",
                        "Gene Expression",
                        "Mendelian Genetics",
                        "The Cell Cycle"
                      ]
                    },
                    {
                      "id": "biol2103_ch3",
                      "title": "Evolution and Diversity",
                      "topics": [
                        "Darwinian Evolution and Natural Selection",
                        "The Tree of Life",
                        "Overview of Bacteria, Archaea, Protists, Fungi, Plants, and Animals"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "Chem2102",
                  "name": "Organic Chemistry",
                  "description": "Study of the structure, properties, nomenclature, and reactions of carbon-containing compounds, with a focus on functional groups relevant to biomolecules.",
                  "credits": 4,
                  "prerequisites": [
                    "Chem2101"
                  ],
                  "chapters": [
                    {
                      "id": "chem2102_ch1",
                      "title": "Structure, Bonding, and Stereochemistry",
                      "topics": [
                        "Alkanes, Alkenes, and Alkynes",
                        "Functional Groups",
                        "Chirality and Stereoisomers"
                      ]
                    },
                    {
                      "id": "chem2102_ch2",
                      "title": "Reactions and Mechanisms",
                      "topics": [
                        "Substitution and Elimination Reactions",
                        "Addition Reactions",
                        "Reactions of Aromatic Compounds"
                      ]
                    },
                    {
                      "id": "chem2102_ch3",
                      "title": "Biologically Relevant Molecules",
                      "topics": [
                        "Carbohydrates",
                        "Lipids",
                        "Amino Acids and Peptides",
                        "Nucleic Acids"
                      ]
                    }
                  ]
                },
                {
                  "code": "BIOT2102",
                  "name": "General Microbiology",
                  "description": "Study of microorganisms (bacteria, viruses, fungi, protozoa), their structure, growth, metabolism, and their roles in health, industry, and the environment.",
                  "credits": 4,
                  "prerequisites": [
                    "Biol2103"
                  ],
                  "chapters": [
                    {
                      "id": "biot2102_ch1",
                      "title": "Introduction to the Microbial World",
                      "topics": [
                        "Prokaryotic and Eukaryotic Cell Structure",
                        "Microbial Diversity",
                        "Microscopy and Staining"
                      ]
                    },
                    {
                      "id": "biot2102_ch2",
                      "title": "Microbial Growth and Metabolism",
                      "topics": [
                        "The Microbial Growth Curve",
                        "Nutritional Requirements",
                        "Metabolic Pathways",
                        "Control of Microbial Growth"
                      ]
                    },
                    {
                      "id": "biot2102_ch3",
                      "title": "Virology and Mycology",
                      "topics": [
                        "Virus Structure and Replication",
                        "Bacteriophages",
                        "Biology of Fungi (Yeasts and Molds)"
                      ]
                    },
                    {
                      "id": "biot2102_ch4",
                      "title": "Applied and Environmental Microbiology",
                      "topics": [
                        "Industrial Microbiology and Fermentation",
                        "Medical Microbiology and Infectious Diseases",
                        "Biogeochemical Cycles"
                      ]
                    }
                  ]
                },
                {
                  "code": "BIOT2104",
                  "name": "Biochemistry I: Biomolecules",
                  "description": "A detailed study of the structure, function, and chemistry of the major classes of biological macromolecules: proteins, carbohydrates, and lipids.",
                  "credits": 3,
                  "prerequisites": [
                    "Chem2102"
                  ],
                  "chapters": [
                    {
                      "id": "biot2104_ch1",
                      "title": "Amino Acids and Proteins",
                      "topics": [
                        "Amino Acid Structure and Properties",
                        "Peptide Bonds",
                        "Protein Structure (Primary, Secondary, Tertiary, Quaternary)",
                        "Protein Folding and Denaturation"
                      ]
                    },
                    {
                      "id": "biot2104_ch2",
                      "title": "Enzymes",
                      "topics": [
                        "Enzyme Catalysis",
                        "Michaelis-Menten Kinetics",
                        "Enzyme Inhibition",
                        "Allosteric Regulation"
                      ]
                    },
                    {
                      "id": "biot2104_ch3",
                      "title": "Carbohydrates",
                      "topics": [
                        "Monosaccharides and Disaccharides",
                        "Polysaccharides (Starch, Glycogen, Cellulose)",
                        "Glycoproteins"
                      ]
                    },
                    {
                      "id": "biot2104_ch4",
                      "title": "Lipids and Biological Membranes",
                      "topics": [
                        "Fatty Acids and Triglycerides",
                        "Membrane Lipids (Phospholipids, Sterols)",
                        "Membrane Structure and Fluidity"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 3": {
              "Semester I": [
                {
                  "code": "BIOT3101",
                  "name": "Genetics",
                  "description": "A comprehensive study of the principles of heredity, including Mendelian, molecular, and population genetics.",
                  "credits": 3,
                  "prerequisites": [
                    "Biol2103"
                  ],
                  "chapters": [
                    {
                      "id": "biot3101_ch1",
                      "title": "Mendelian and Chromosomal Inheritance",
                      "topics": [
                        "Laws of Segregation and Independent Assortment",
                        "Gene Linkage and Chromosome Mapping",
                        "Sex-linked Inheritance",
                        "Chromosomal Abnormalities"
                      ]
                    },
                    {
                      "id": "biot3101_ch2",
                      "title": "Molecular Genetics",
                      "topics": [
                        "DNA as the Genetic Material",
                        "Gene Structure and Function",
                        "Mutations and DNA Repair"
                      ]
                    },
                    {
                      "id": "biot3101_ch3",
                      "title": "Population and Quantitative Genetics",
                      "topics": [
                        "Hardy-Weinberg Equilibrium",
                        "Forces of Evolution (Drift, Selection, Migration)",
                        "Quantitative Trait Loci (QTL)"
                      ]
                    }
                  ]
                },
                {
                  "code": "BIOT3103",
                  "name": "Molecular Biology",
                  "description": "An in-depth study of the molecular mechanisms underlying the storage, transmission, and expression of genetic information in prokaryotes and eukaryotes.",
                  "credits": 4,
                  "prerequisites": [
                    "BIOT2104"
                  ],
                  "chapters": [
                    {
                      "id": "biot3103_ch1",
                      "title": "DNA Replication and Repair",
                      "topics": [
                        "Mechanisms of DNA Replication",
                        "Telomeres and Telomerase",
                        "DNA Damage and Repair Pathways"
                      ]
                    },
                    {
                      "id": "biot3103_ch2",
                      "title": "Transcription and RNA Processing",
                      "topics": [
                        "RNA Polymerases",
                        "Promoters and Terminators",
                        "RNA Splicing, Capping, and Polyadenylation"
                      ]
                    },
                    {
                      "id": "biot3103_ch3",
                      "title": "Protein Synthesis",
                      "topics": [
                        "The Genetic Code",
                        "Ribosome Structure and Function",
                        "Mechanism of Translation"
                      ]
                    },
                    {
                      "id": "biot3103_ch4",
                      "title": "Regulation of Gene Expression",
                      "topics": [
                        "The Lac and Trp Operons",
                        "Eukaryotic Transcription Factors and Chromatin Remodeling",
                        "Post-transcriptional Regulation (RNAi)"
                      ]
                    }
                  ]
                },
                {
                  "code": "BIOT3105",
                  "name": "Biochemistry II: Metabolism",
                  "description": "A study of the central metabolic pathways for the breakdown and synthesis of biomolecules and the integration and regulation of these pathways.",
                  "credits": 3,
                  "prerequisites": [
                    "BIOT2104"
                  ],
                  "chapters": [
                    {
                      "id": "biot3105_ch1",
                      "title": "Carbohydrate Metabolism",
                      "topics": [
                        "Glycolysis and Gluconeogenesis",
                        "The Citric Acid Cycle",
                        "Oxidative Phosphorylation and Electron Transport Chain"
                      ]
                    },
                    {
                      "id": "biot3105_ch2",
                      "title": "Lipid Metabolism",
                      "topics": [
                        "Fatty Acid Oxidation (Beta-oxidation)",
                        "Fatty Acid Synthesis",
                        "Cholesterol and Steroid Metabolism"
                      ]
                    },
                    {
                      "id": "biot3105_ch3",
                      "title": "Amino Acid Metabolism",
                      "topics": [
                        "Amino Acid Catabolism and Transamination",
                        "The Urea Cycle",
                        "Synthesis of Non-essential Amino Acids"
                      ]
                    },
                    {
                      "id": "biot3105_ch4",
                      "title": "Integration of Metabolism",
                      "topics": [
                        "Hormonal Regulation (Insulin, Glucagon, Epinephrine)",
                        "Metabolism in the Fed and Fasted States",
                        "Metabolic Basis of Disease"
                      ]
                    }
                  ]
                },
                {
                  "code": "BIOT3107",
                  "name": "Bioprocess Principles",
                  "description": "An introduction to the engineering principles underlying biological processes, including microbial kinetics, reactor design, and downstream processing.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "biot3107_ch1",
                      "title": "Introduction to Bioprocesses",
                      "topics": [
                        "Overview of Bioprocesses and Products",
                        "Material and Energy Balances",
                        "Stoichiometry of Microbial Growth"
                      ]
                    },
                    {
                      "id": "biot3107_ch2",
                      "title": "Microbial Growth Kinetics",
                      "topics": [
                        "Batch Culture",
                        "Continuous Culture (Chemostat)",
                        "Fed-Batch Culture"
                      ]
                    },
                    {
                      "id": "biot3107_ch3",
                      "title": "Bioreactors",
                      "topics": [
                        "Types of Bioreactors",
                        "Agitation and Aeration",
                        "Sterilization"
                      ]
                    },
                    {
                      "id": "biot3107_ch4",
                      "title": "Introduction to Downstream Processing",
                      "topics": [
                        "Cell Separation (Centrifugation, Filtration)",
                        "Cell Disruption",
                        "Product Recovery and Purification Overview"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "BIOT3102",
                  "name": "Immunology",
                  "description": "A study of the immune system, including its cellular and molecular components, the mechanisms of innate and adaptive immunity, and applications in biotechnology.",
                  "credits": 3,
                  "prerequisites": [
                    "BIOT2104"
                  ],
                  "chapters": [
                    {
                      "id": "biot3102_ch1",
                      "title": "Innate Immunity",
                      "topics": [
                        "Cells of the Innate System (Macrophages, Neutrophils)",
                        "Pattern Recognition Receptors",
                        "Inflammation and the Complement System"
                      ]
                    },
                    {
                      "id": "biot3102_ch2",
                      "title": "Adaptive Immunity",
                      "topics": [
                        "Antigens and Antibodies",
                        "B and T Lymphocyte Development and Activation",
                        "Major Histocompatibility Complex (MHC)"
                      ]
                    },
                    {
                      "id": "biot3102_ch3",
                      "title": "The Immune Response in Action",
                      "topics": [
                        "Humoral Immunity (Antibody Response)",
                        "Cell-Mediated Immunity (Cytotoxic T Cells)",
                        "Immunological Memory"
                      ]
                    },
                    {
                      "id": "biot3102_ch4",
                      "title": "Applied Immunology",
                      "topics": [
                        "Vaccines",
                        "Monoclonal Antibodies",
                        "Immunoassays (ELISA, Western Blot)",
                        "Hypersensitivity and Autoimmunity"
                      ]
                    }
                  ]
                },
                {
                  "code": "BIOT3104",
                  "name": "Recombinant DNA Technology",
                  "description": "A comprehensive, hands-on study of the techniques used to isolate, analyze, and manipulate DNA, and to express recombinant proteins.",
                  "credits": 4,
                  "prerequisites": [
                    "BIOT3103"
                  ],
                  "chapters": [
                    {
                      "id": "biot3104_ch1",
                      "title": "Core Tools of Genetic Engineering",
                      "topics": [
                        "Restriction Enzymes and DNA Ligase",
                        "Plasmids, Vectors, and Cloning",
                        "Creating and Screening DNA Libraries"
                      ]
                    },
                    {
                      "id": "biot3104_ch2",
                      "title": "Polymerase Chain Reaction (PCR)",
                      "topics": [
                        "Principles and Methodology",
                        "Reverse Transcriptase PCR (RT-PCR)",
                        "Quantitative PCR (qPCR)"
                      ]
                    },
                    {
                      "id": "biot3104_ch3",
                      "title": "Analysis of Nucleic Acids and Proteins",
                      "topics": [
                        "Gel Electrophoresis",
                        "DNA Sequencing (Sanger, Next-Generation)",
                        "Blotting Techniques (Southern, Northern, Western)"
                      ]
                    },
                    {
                      "id": "biot3104_ch4",
                      "title": "Modern Applications",
                      "topics": [
                        "Expression of Recombinant Proteins",
                        "Genome Editing with CRISPR-Cas9",
                        "Transgenic Animals and Plants"
                      ]
                    }
                  ]
                },
                {
                  "code": "BIOT3106",
                  "name": "Bioinformatics",
                  "description": "An introduction to the use of computational tools to analyze large-scale biological data, including DNA, RNA, and protein sequences.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "biot3106_ch1",
                      "title": "Biological Databases and Sequence Retrieval",
                      "topics": [
                        "Primary and Secondary Databases (GenBank, UniProt)",
                        "Sequence Formats (FASTA)",
                        "Data Retrieval and Management"
                      ]
                    },
                    {
                      "id": "biot3106_ch2",
                      "title": "Sequence Alignment",
                      "topics": [
                        "Pairwise Alignment (BLAST, FASTA)",
                        "Scoring Matrices",
                        "Multiple Sequence Alignment (Clustal)"
                      ]
                    },
                    {
                      "id": "biot3106_ch3",
                      "title": "Genomics and Proteomics",
                      "topics": [
                        "Gene Prediction and Genome Annotation",
                        "Analysis of High-Throughput Sequencing Data",
                        "Protein Structure Prediction and Visualization"
                      ]
                    },
                    {
                      "id": "biot3106_ch4",
                      "title": "Phylogenetics",
                      "topics": [
                        "Molecular Evolution",
                        "Construction of Phylogenetic Trees",
                        "Interpreting Evolutionary Relationships"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 4": {
              "Semester I": [
                {
                  "code": "BIOT4101",
                  "name": "Bioprocess Engineering",
                  "description": "Quantitative analysis and design of bioprocess systems, focusing on bioreactor design, scale-up, and downstream purification processes.",
                  "credits": 3,
                  "prerequisites": [
                    "BIOT3107"
                  ],
                  "chapters": [
                    {
                      "id": "biot4101_ch1",
                      "title": "Bioreactor Design and Analysis",
                      "topics": [
                        "Mass Transfer in Bioreactors (kLa)",
                        "Heat Transfer and Sterilization",
                        "Bioreactor Scale-up"
                      ]
                    },
                    {
                      "id": "biot4101_ch2",
                      "title": "Downstream Processing I: Separation",
                      "topics": [
                        "Filtration and Microfiltration",
                        "Centrifugation",
                        "Aqueous Two-Phase Extraction"
                      ]
                    },
                    {
                      "id": "biot4101_ch3",
                      "title": "Downstream Processing II: Purification",
                      "topics": [
                        "Principles of Chromatography",
                        "Ion Exchange, Size Exclusion, and Affinity Chromatography",
                        "Chromatography Scale-up"
                      ]
                    },
                    {
                      "id": "biot4101_ch4",
                      "title": "Process Economics and Validation",
                      "topics": [
                        "Bioprocess Economics",
                        "Process Instrumentation and Control",
                        "Good Manufacturing Practices (GMP)"
                      ]
                    }
                  ]
                },
                {
                  "code": "BIOT4103",
                  "name": "Cell Culture Technology",
                  "description": "Principles and techniques for the in vitro cultivation of animal and plant cells, and their applications in research and industry.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "biot4103_ch1",
                      "title": "Fundamentals of Cell Culture",
                      "topics": [
                        "Aseptic Technique and Laboratory Design",
                        "Cell Culture Media and Sera",
                        "Cell Lines and Primary Cultures"
                      ]
                    },
                    {
                      "id": "biot4103_ch2",
                      "title": "Animal Cell Culture",
                      "topics": [
                        "Growth of Anchorage-Dependent and Suspension Cells",
                        "Cell Characterization and Cryopreservation",
                        "Scale-up of Animal Cell Cultures"
                      ]
                    },
                    {
                      "id": "biot4103_ch3",
                      "title": "Plant Tissue Culture",
                      "topics": [
                        "Media Formulation and Plant Hormones",
                        "Micropropagation and Somatic Embryogenesis",
                        "Callus and Suspension Cultures"
                      ]
                    },
                    {
                      "id": "biot4103_ch4",
                      "title": "Applications",
                      "topics": [
                        "Production of Recombinant Proteins and Monoclonal Antibodies",
                        "Tissue Engineering",
                        "Production of Secondary Metabolites"
                      ]
                    }
                  ]
                },
                {
                  "code": "BIOT4105",
                  "name": "Thesis I / Research Methodology",
                  "description": "Development of a research proposal for the final year thesis, including literature review, experimental design, and ethical considerations.",
                  "credits": 2,
                  "chapters": [
                    {
                      "id": "biot4105_ch1",
                      "title": "The Scientific Method and Experimental Design",
                      "topics": [
                        "Formulating a Research Hypothesis",
                        "Types of Experimental Designs",
                        "Controls and Variables"
                      ]
                    },
                    {
                      "id": "biot4105_ch2",
                      "title": "Literature Review and Scientific Writing",
                      "topics": [
                        "Critical Evaluation of Scientific Papers",
                        "Citation Management",
                        "Structuring a Literature Review"
                      ]
                    },
                    {
                      "id": "biot4105_ch3",
                      "title": "Proposal Writing",
                      "topics": [
                        "Components of a Research Proposal",
                        "Budgeting and Timelines",
                        "Presenting the Proposal"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "BIOT4102",
                  "name": "Thesis II",
                  "description": "Independent research project involving the execution of the proposal from Thesis I, data analysis, interpretation, and communication of results in a written thesis and oral defense.",
                  "credits": 4,
                  "prerequisites": [
                    "BIOT4105"
                  ],
                  "chapters": [
                    {
                      "id": "biot4102_ch1",
                      "title": "Data Collection and Analysis",
                      "topics": [
                        "Laboratory or Computational Work",
                        "Troubleshooting Experiments",
                        "Statistical Analysis of Data"
                      ]
                    },
                    {
                      "id": "biot4102_ch2",
                      "title": "Thesis Writing",
                      "topics": [
                        "Structuring the Thesis (Introduction, Methods, Results, Discussion)",
                        "Creating Figures and Tables",
                        "Proper Referencing"
                      ]
                    },
                    {
                      "id": "biot4102_ch3",
                      "title": "Scientific Communication",
                      "topics": [
                        "Preparing a Scientific Poster",
                        "Delivering an Oral Presentation",
                        "Preparing for the Thesis Defense"
                      ]
                    }
                  ]
                },
                {
                  "code": "BIOT4104",
                  "name": "Bioethics and Intellectual Property",
                  "description": "An exploration of the ethical, legal, and social issues arising from advances in biotechnology, and an introduction to intellectual property protection.",
                  "credits": 2,
                  "chapters": [
                    {
                      "id": "biot4104_ch1",
                      "title": "Ethical Frameworks in Biotechnology",
                      "topics": [
                        "Principles of Bioethics",
                        "Ethical Issues in Genetic Engineering and Cloning",
                        "Ethics of Stem Cell Research"
                      ]
                    },
                    {
                      "id": "biot4104_ch2",
                      "title": "Intellectual Property Rights (IPR)",
                      "topics": [
                        "Patents, Trademarks, and Copyrights",
                        "Patenting Life Forms and DNA Sequences",
                        "IPR in Developing Countries"
                      ]
                    },
                    {
                      "id":"biot4104_ch3",
                      "title": "Regulatory Affairs",
                      "topics": [
                        "Regulation of GMOs",
                        "Clinical Trial Regulations",
                        "Biosafety Guidelines"
                      ]
                    }
                  ]
                },
                {
                  "code": "BIOT4202",
                  "name": "Elective (e.g., Medical Biotechnology)",
                  "description": "A specialized course focusing on the application of biotechnology in human health, including diagnostics, therapeutics, and regenerative medicine.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "biot4202_ch1",
                      "title": "Pharmaceutical Biotechnology",
                      "topics": [
                        "Production of Recombinant Protein Drugs (Insulin, Antibodies)",
                        "Vaccine Development",
                        "Drug Delivery Systems"
                      ]
                    },
                    {
                      "id": "biot4202_ch2",
                      "title": "Molecular Diagnostics",
                      "topics": [
                        "PCR-based and DNA Microarray Diagnostics",
                        "Immunoassays (ELISA)",
                        "Biosensors"
                      ]
                    },
                    {
                      "id": "biot4202_ch3",
                      "title": "Gene Therapy and Regenerative Medicine",
                      "topics": [
                        "Viral and Non-viral Vectors",
                        "Stem Cell Technology",
                        "Tissue Engineering"
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          "name": "Industrial Chemistry",
          "abbreviation": "ICHE",
          "coursesByYearSemester": {
            "Year 2": {
              "Semester I": [
                {
                  "code": "ICHE2101",
                  "name": "Fundamentals of Industrial Chemistry",
                  "description": "An introduction to the chemical industry, covering raw materials, major industrial processes, process flow diagrams, and the economic and environmental context of chemical manufacturing.",
                  "credits": 3,
                  "outcomes": [
                    "Identify the major sectors of the chemical industry.",
                    "Describe the flow of materials from raw sources to finished products.",
                    "Interpret basic process flow diagrams (PFDs).",
                    "Understand the economic and environmental factors influencing chemical production."
                  ],
                  "chapters": [
                    {
                      "id": "iche2101_ch1",
                      "title": "The Chemical Industry",
                      "topics": [
                        "Structure and Sectors of the Chemical Industry",
                        "Raw Materials (Fossil fuels, Biomass, Minerals)",
                        "Bulk vs. Fine vs. Specialty Chemicals"
                      ]
                    },
                    {
                      "id": "iche2101_ch2",
                      "title": "Chemical Process Fundamentals",
                      "topics": [
                        "Process Flow Diagrams (PFDs)",
                        "Unit Operations and Unit Processes",
                        "Introduction to Material and Energy Balances"
                      ]
                    },
                    {
                      "id": "iche2101_ch3",
                      "title": "Major Inorganic Chemical Industries",
                      "topics": [
                        "Sulfuric Acid Production (Contact Process)",
                        "Ammonia Synthesis (Haber-Bosch Process)",
                        "Chlor-alkali Industry"
                      ]
                    },
                    {
                      "id": "iche2101_ch4",
                      "title": "Major Organic Chemical Industries",
                      "topics": [
                        "Petroleum Refining Overview",
                        "Production of Ethylene and Propylene",
                        "Introduction to Polymers"
                      ]
                    }
                  ]
                },
                {
                  "code": "Chem2101",
                  "name": "Organic Chemistry I",
                  "description": "A study of the structure, nomenclature, properties, and reactions of alkanes, alkenes, alkynes, and alkyl halides, with an emphasis on reaction mechanisms and stereochemistry.",
                  "credits": 4,
                  "chapters": [
                    {
                      "id": "chem2101_ch1",
                      "title": "Structure, Bonding, and Alkanes",
                      "topics": [
                        "Review of General Chemistry Bonding",
                        "Alkanes and Cycloalkanes",
                        "Conformational Analysis"
                      ]
                    },
                    {
                      "id": "chem2101_ch2",
                      "title": "Stereochemistry and Functional Groups",
                      "topics": [
                        "Chirality and Optical Activity",
                        "Nomenclature of Stereoisomers",
                        "Overview of Functional Groups"
                      ]
                    },
                    {
                      "id": "chem2101_ch3",
                      "title": "Reactions of Alkenes and Alkynes",
                      "topics": [
                        "Electrophilic Addition Reactions",
                        "Radical Reactions",
                        "Acidity of Alkynes"
                      ]
                    },
                    {
                      "id": "chem2101_ch4",
                      "title": "Substitution and Elimination Reactions",
                      "topics": [
                        "Alkyl Halides",
                        "The SN1 and SN2 Reactions",
                        "The E1 and E2 Reactions"
                      ]
                    }
                  ]
                },
                {
                  "code": "Chem2103",
                  "name": "Analytical Chemistry",
                  "description": "Introduction to the theory and practice of quantitative chemical analysis, including statistical data treatment, gravimetric analysis, and volumetric analysis (titrations).",
                  "credits": 4,
                  "chapters": [
                    {
                      "id": "chem2103_ch1",
                      "title": "Fundamentals of Analytical Chemistry",
                      "topics": [
                        "The Analytical Process",
                        "Errors in Chemical Analysis",
                        "Statistical Data Treatment (Mean, Std Dev, Confidence Intervals)"
                      ]
                    },
                    {
                      "id": "chem2103_ch2",
                      "title": "Gravimetric Methods of Analysis",
                      "topics": [
                        "Principles of Gravimetry",
                        "Precipitation and Co-precipitation",
                        "Calculation of Results"
                      ]
                    },
                    {
                      "id": "chem2103_ch3",
                      "title": "Volumetric Methods: Acid-Base Titrations",
                      "topics": [
                        "Principles of Volumetric Analysis",
                        "Acid-Base Equilibria and Buffers",
                        "Titration Curves and Indicators"
                      ]
                    },
                    {
                      "id": "chem2103_ch4",
                      "title": "Volumetric Methods: Complexometric and Redox Titrations",
                      "topics": [
                        "Complexation Reactions (EDTA Titrations)",
                        "Redox Titrations",
                        "Potentiometric Titrations"
                      ]
                    }
                  ]
                },
                {
                  "code": "Chem2105",
                  "name": "Physical Chemistry I (Thermodynamics)",
                  "description": "A study of the fundamental principles of chemical thermodynamics, including the laws of thermodynamics, thermochemistry, phase equilibria, and chemical equilibria.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "chem2105_ch1",
                      "title": "The First Law of Thermodynamics",
                      "topics": [
                        "Work, Heat, and Energy",
                        "Enthalpy",
                        "Thermochemistry (Hess's Law)"
                      ]
                    },
                    {
                      "id": "chem2105_ch2",
                      "title": "The Second and Third Laws of Thermodynamics",
                      "topics": [
                        "Entropy and Spontaneity",
                        "Gibbs Free Energy",
                        "The Third Law of Thermodynamics"
                      ]
                    },
                    {
                      "id": "chem2105_ch3",
                      "title": "Phase Equilibria",
                      "topics": [
                        "The Gibbs Phase Rule",
                        "Phase Diagrams of Pure Substances",
                        "Phase Diagrams of Binary Mixtures"
                      ]
                    },
                    {
                      "id": "chem2105_ch4",
                      "title": "Chemical Equilibrium",
                      "topics": [
                        "The Equilibrium Constant",
                        "Response of Equilibria to Conditions (Le Chatelier's Principle)",
                        "Equilibrium Calculations"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "Chem2102",
                  "name": "Organic Chemistry II",
                  "description": "Continuation of Organic Chemistry I, covering spectroscopy, alcohols, ethers, aldehydes, ketones, carboxylic acids, and their derivatives.",
                  "credits": 4,
                  "prerequisites": [
                    "Chem2101"
                  ],
                  "chapters": [
                    {
                      "id": "chem2102_ch1",
                      "title": "Spectroscopy",
                      "topics": [
                        "Mass Spectrometry",
                        "Infrared (IR) Spectroscopy",
                        "Nuclear Magnetic Resonance (NMR) Spectroscopy"
                      ]
                    },
                    {
                      "id": "chem2102_ch2",
                      "title": "Alcohols, Ethers, and Epoxides",
                      "topics": [
                        "Properties and Reactions of Alcohols",
                        "Synthesis and Reactions of Ethers",
                        "Epoxide Chemistry"
                      ]
                    },
                    {
                      "id": "chem2102_ch3",
                      "title": "Aldehydes and Ketones",
                      "topics": [
                        "Nucleophilic Addition Reactions",
                        "The Wittig Reaction",
                        "Acetal Formation"
                      ]
                    },
                    {
                      "id": "chem2102_ch4",
                      "title": "Carboxylic Acids and Derivatives",
                      "topics": [
                        "Acidity of Carboxylic Acids",
                        "Nucleophilic Acyl Substitution",
                        "Chemistry of Esters, Amides, and Acid Chlorides"
                      ]
                    }
                  ]
                },
                {
                  "code": "ICHE2102",
                  "name": "Chemical Engineering Principles",
                  "description": "Application of the principles of conservation of mass and energy to the analysis of chemical processes, including systems with reaction, recycle, and purge streams.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "iche2102_ch1",
                      "title": "Material Balances on Non-Reactive Systems",
                      "topics": [
                        "Degree of Freedom Analysis",
                        "Balances on Multiple-Unit Processes",
                        "Recycle, Bypass, and Purge Streams"
                      ]
                    },
                    {
                      "id": "iche2102_ch2",
                      "title": "Material Balances on Reactive Systems",
                      "topics": [
                        "Stoichiometry",
                        "Limiting and Excess Reactants",
                        "Extent of Reaction",
                        "Combustion Reactions"
                      ]
                    },
                    {
                      "id": "iche2102_ch3",
                      "title": "Properties of Gases, Vapors, and Liquids",
                      "topics": [
                        "Ideal Gas Law",
                        "Real Gas Equations of State",
                        "Vapor Pressure and Saturation"
                      ]
                    },
                    {
                      "id": "iche2102_ch4",
                      "title": "Energy Balances",
                      "topics": [
                        "Forms of Energy",
                        "Energy Balances on Closed and Open Systems",
                        "Standard Heats of Reaction and Formation"
                      ]
                    }
                  ]
                },
                {
                  "code": "ICHE2104",
                  "name": "Introduction to Polymer Science",
                  "description": "An introduction to the chemistry and physics of polymers, including polymerization mechanisms, polymer structure, properties, and major industrial plastics.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "iche2104_ch1",
                      "title": "Fundamentals of Polymers",
                      "topics": [
                        "Basic Concepts and Nomenclature",
                        "Molecular Weight and Distributions",
                        "Polymer Structure and Morphology"
                      ]
                    },
                    {
                      "id": "iche2104_ch2",
                      "title": "Polymerization Mechanisms",
                      "topics": [
                        "Step-Growth Polymerization",
                        "Chain-Growth Polymerization (Free Radical, Ionic)",
                        "Copolymerization"
                      ]
                    },
                    {
                      "id": "iche2104_ch3",
                      "title": "Polymer Properties",
                      "topics": [
                        "Thermal Properties (Tg, Tm)",
                        "Mechanical Properties",
                        "Polymer Solutions"
                      ]
                    },
                    {
                      "id": "iche2104_ch4",
                      "title": "Major Industrial Polymers",
                      "topics": [
                        "Polyethylene, Polypropylene",
                        "Polyvinyl Chloride (PVC), Polystyrene (PS)",
                        "Polyethylene Terephthalate (PET), Nylons"
                      ]
                    }
                  ]
                },
                {
                  "code": "Chem2106",
                  "name": "Physical Chemistry II (Kinetics & Quantum)",
                  "description": "A study of the rates and mechanisms of chemical reactions, and an introduction to quantum mechanics and its application to atomic and molecular structure.",
                  "credits": 3,
                  "prerequisites": [
                    "Chem2105"
                  ],
                  "chapters": [
                    {
                      "id": "chem2106_ch1",
                      "title": "Chemical Kinetics",
                      "topics": [
                        "Rate Laws and Reaction Order",
                        "Integrated Rate Laws",
                        "Arrhenius Equation and Activation Energy"
                      ]
                    },
                    {
                      "id": "chem2106_ch2",
                      "title": "Reaction Mechanisms",
                      "topics": [
                        "Elementary Reactions",
                        "Steady-State Approximation",
                        "Chain Reactions",
                        "Catalysis"
                      ]
                    },
                    {
                      "id": "chem2106_ch3",
                      "title": "Introduction to Quantum Mechanics",
                      "topics": [
                        "The Schrödinger Equation",
                        "Particle in a Box",
                        "The Harmonic Oscillator"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 3": {
              "Semester I": [
                {
                  "code": "ICHE3101",
                  "name": "Instrumental Methods of Analysis",
                  "description": "Theory and practice of modern instrumental techniques used for chemical analysis, including spectroscopy, chromatography, and electrochemistry.",
                  "credits": 4,
                  "prerequisites": [
                    "Chem2103"
                  ],
                  "chapters": [
                    {
                      "id": "iche3101_ch1",
                      "title": "Spectroscopic Methods",
                      "topics": [
                        "UV-Visible Spectroscopy",
                        "Infrared (IR) and Raman Spectroscopy",
                        "Atomic Absorption and Emission Spectroscopy"
                      ]
                    },
                    {
                      "id": "iche3101_ch2",
                      "title": "Chromatographic Separations",
                      "topics": [
                        "Principles of Chromatography",
                        "Gas Chromatography (GC)",
                        "High-Performance Liquid Chromatography (HPLC)"
                      ]
                    },
                    {
                      "id": "iche3101_ch3",
                      "title": "Mass Spectrometry",
                      "topics": [
                        "Ionization Methods",
                        "Mass Analyzers",
                        "Hyphenated Techniques (GC-MS, LC-MS)"
                      ]
                    },
                    {
                      "id": "iche3101_ch4",
                      "title": "Electrochemical and Thermal Methods",
                      "topics": [
                        "Potentiometry",
                        "Voltammetry",
                        "Thermogravimetric Analysis (TGA)"
                      ]
                    }
                  ]
                },
                {
                  "code": "ICHE3103",
                  "name": "Chemical Unit Operations I",
                  "description": "Application of fluid mechanics and heat transfer principles to the analysis and design of equipment used in the chemical industry.",
                  "credits": 3,
                  "prerequisites": [
                    "ICHE2102"
                  ],
                  "chapters": [
                    {
                      "id": "iche3103_ch1",
                      "title": "Fluid Mechanics",
                      "topics": [
                        "Fluid Statics and Dynamics",
                        "Flow in Pipes and Frictional Losses",
                        "Pump Selection and Sizing"
                      ]
                    },
                    {
                      "id": "iche3103_ch2",
                      "title": "Heat Transfer by Conduction and Convection",
                      "topics": [
                        "Fourier's Law of Conduction",
                        "Principles of Convection",
                        "Heat Transfer Coefficients"
                      ]
                    },
                    {
                      "id": "iche3103_ch3",
                      "title": "Heat Exchangers",
                      "topics": [
                        "Types of Heat Exchangers",
                        "Log Mean Temperature Difference (LMTD) Method",
                        "Effectiveness-NTU Method"
                      ]
                    },
                    {
                      "id": "iche3103_ch4",
                      "title": "Heat Transfer with Phase Change",
                      "topics": [
                        "Boiling and Condensation",
                        "Evaporators"
                      ]
                    }
                  ]
                },
                {
                  "code": "ICHE3105",
                  "name": "Industrial Catalysis",
                  "description": "Study of the principles of heterogeneous and homogeneous catalysis, catalyst preparation, characterization, and their application in major industrial processes.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "iche3105_ch1",
                      "title": "Fundamentals of Catalysis",
                      "topics": [
                        "Homogeneous and Heterogeneous Catalysis",
                        "Adsorption and Desorption",
                        "Catalyst Activity, Selectivity, and Deactivation"
                      ]
                    },
                    {
                      "id": "iche3105_ch2",
                      "title": "Catalyst Preparation and Characterization",
                      "topics": [
                        "Preparation Methods (Precipitation, Impregnation)",
                        "Characterization Techniques (BET, XRD, TEM)"
                      ]
                    },
                    {
                      "id": "iche3105_ch3",
                      "title": "Industrial Catalytic Processes",
                      "topics": [
                        "Catalysis in Petrochemical Industry (Cracking, Reforming)",
                        "Synthesis Gas and Ammonia Synthesis",
                        "Polymerization Catalysis (Ziegler-Natta)"
                      ]
                    },
                    {
                      "id": "iche3105_ch4",
                      "title": "Modern Trends in Catalysis",
                      "topics": [
                        "Biocatalysis and Enzymes",
                        "Photocatalysis",
                        "Green Catalysis"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "ICHE3102",
                  "name": "Chemical Reaction Engineering",
                  "description": "The study of chemical reaction rates and the design of chemical reactors, covering rate laws and the design equations for ideal and non-ideal reactors.",
                  "credits": 3,
                  "prerequisites": [
                    "Chem2106"
                  ],
                  "chapters": [
                    {
                      "id": "iche3102_ch1",
                      "title": "Kinetics and Rate Laws",
                      "topics": [
                        "Reaction Rate Definition",
                        "Rate Law and Reaction Order",
                        "Analysis of Batch Reactor Data"
                      ]
                    },
                    {
                      "id": "iche3102_ch2",
                      "title": "Isothermal Reactor Design",
                      "topics": [
                        "Design Equations for Batch, CSTR, PFR",
                        "Reactors in Series and Parallel",
                        "Multiple Reactions"
                      ]
                    },
                    {
                      "id": "iche3102_ch3",
                      "title": "Non-Isothermal Reactor Design",
                      "topics": [
                        "The Energy Balance",
                        "Adiabatic Reactor Operation",
                        "Reactors with Heat Exchange"
                      ]
                    },
                    {
                      "id": "iche3102_ch4",
                      "title": "Catalytic and Multiphase Reactors",
                      "topics": [
                        "Kinetics of Heterogeneous Catalysis",
                        "Design of Packed Bed Reactors (PBR)",
                        "Introduction to Multiphase Reactors"
                      ]
                    }
                  ]
                },
                {
                  "code": "ICHE3104",
                  "name": "Chemical Unit Operations II",
                  "description": "Application of mass transfer principles to the analysis and design of separation equipment such as distillation columns, absorbers, and extractors.",
                  "credits": 3,
                  "prerequisites": [
                    "ICHE3103"
                  ],
                  "chapters": [
                    {
                      "id": "iche3104_ch1",
                      "title": "Fundamentals of Mass Transfer",
                      "topics": [
                        "Molecular Diffusion (Fick's Law)",
                        "Convective Mass Transfer",
                        "Mass Transfer Coefficients"
                      ]
                    },
                    {
                      "id": "iche3104_ch2",
                      "title": "Gas Absorption and Stripping",
                      "topics": [
                        "Equilibrium Relations",
                        "Design of Packed Towers"
                      ]
                    },
                    {
                      "id": "iche3104_ch3",
                      "title": "Distillation",
                      "topics": [
                        "Vapor-Liquid Equilibrium (VLE)",
                        "Design of Tray Towers (McCabe-Thiele Method)"
                      ]
                    },
                    {
                      "id": "iche3104_ch4",
                      "title": "Other Separation Processes",
                      "topics": [
                        "Liquid-Liquid Extraction",
                        "Adsorption",
                        "Drying of Solids"
                      ]
                    }
                  ]
                },
                {
                  "code": "ICHE3106",
                  "name": "Quality Control and Assurance",
                  "description": "Principles and practices of quality management in the chemical industry, including statistical process control (SPC), quality standards, and analytical method validation.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "iche3106_ch1",
                      "title": "Introduction to Quality",
                      "topics": [
                        "Quality Control vs. Quality Assurance",
                        "Total Quality Management (TQM)",
                        "Quality Management Systems (ISO 9001)"
                      ]
                    },
                    {
                      "id": "iche3106_ch2",
                      "title": "Statistical Process Control (SPC)",
                      "topics": [
                        "Control Charts for Variables (X-bar, R charts)",
                        "Control Charts for Attributes (p, c charts)",
                        "Process Capability Analysis"
                      ]
                    },
                    {
                      "id": "iche3106_ch3",
                      "title": "Analytical Method Validation",
                      "topics": [
                        "Accuracy, Precision, Linearity, and Range",
                        "Limits of Detection and Quantitation (LOD/LOQ)",
                        "Method Validation Protocols"
                      ]
                    }
                  ]
                }
              ]
            },
            "Year 4": {
              "Semester I": [
                {
                  "code": "ICHE4101",
                  "name": "Chemical Process Design and Economics",
                  "description": "A capstone course on the design of chemical processes, integrating principles of reaction engineering and separations with economic analysis to evaluate process feasibility.",
                  "credits": 4,
                  "prerequisites": [
                    "ICHE3102",
                    "ICHE3104"
                  ],
                  "chapters": [
                    {
                      "id": "iche4101_ch1",
                      "title": "Process Synthesis and Flowsheet Development",
                      "topics": [
                        "The Design Process",
                        "Developing Process Flow Diagrams (PFDs)",
                        "Heuristics for Process Synthesis"
                      ]
                    },
                    {
                      "id": "iche4101_ch2",
                      "title": "Equipment Sizing and Selection",
                      "topics": [
                        "Reactor Sizing",
                        "Distillation Column Sizing",
                        "Heat Exchanger Sizing"
                      ]
                    },
                    {
                      "id": "iche4101_ch3",
                      "title": "Capital and Operating Cost Estimation",
                      "topics": [
                        "Fixed and Working Capital",
                        "Estimation of Manufacturing Costs",
                        "Depreciation"
                      ]
                    },
                    {
                      "id": "iche4101_ch4",
                      "title": "Profitability Analysis",
                      "topics": [
                        "Time Value of Money",
                        "Net Present Value (NPV) and Internal Rate of Return (IRR)",
                        "Sensitivity Analysis"
                      ]
                    }
                  ]
                },
                {
                  "code": "ICHE4103",
                  "name": "Petrochemical Technology",
                  "description": "A study of the technologies used to convert crude oil and natural gas into fuels and chemical feedstocks, and their subsequent conversion into major petrochemical products.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "iche4103_ch1",
                      "title": "Petroleum Refining Processes",
                      "topics": [
                        "Crude Oil Distillation",
                        "Cracking (Catalytic, Thermal)",
                        "Reforming and Alkylation"
                      ]
                    },
                    {
                      "id": "iche4103_ch2",
                      "title": "Production of C1 and C2 Chemicals",
                      "topics": [
                        "Synthesis Gas Production and Uses",
                        "Ethylene Production (Steam Cracking)",
                        "Ethylene Derivatives (Ethylene Oxide, Vinyl Chloride)"
                      ]
                    },
                    {
                      "id": "iche4103_ch3",
                      "title": "Production of C3 and C4 Chemicals",
                      "topics": [
                        "Propylene Production and Derivatives",
                        "Butadiene and Butenes"
                      ]
                    },
                    {
                      "id": "iche4103_ch4",
                      "title": "Production of Aromatic Chemicals",
                      "topics": [
                        "BTX Production (Benzene, Toluene, Xylenes)",
                        "Styrene and Phenol Production"
                      ]
                    }
                  ]
                },
                {
                  "code": "ICHE4105",
                  "name": "Industrial Chemistry Laboratory",
                  "description": "A hands-on laboratory course focused on pilot-scale unit operations, instrumental analysis, and quality control tests relevant to the chemical industry.",
                  "credits": 2,
                  "chapters": [
                    {
                      "id": "iche4105_ch1",
                      "title": "Pilot-Scale Unit Operations",
                      "topics": [
                        "Distillation Column Experiment",
                        "Batch Reactor Experiment",
                        "Heat Exchanger Performance"
                      ]
                    },
                    {
                      "id": "iche4105_ch2",
                      "title": "Industrial Product Analysis",
                      "topics": [
                        "Analysis of a Commercial Product (e.g., Aspirin, Soap)",
                        "Polymer Characterization (e.g., Viscosity, DSC)",
                        "Quality Control Testing"
                      ]
                    }
                  ]
                }
              ],
              "Semester II": [
                {
                  "code": "ICHE4102",
                  "name": "Environmental Chemistry and Waste Management",
                  "description": "Study of chemical processes in the environment and the technologies used to manage and treat industrial waste and pollution.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "iche4102_ch1",
                      "title": "Chemistry of the Atmosphere, Water, and Soil",
                      "topics": [
                        "Atmospheric Pollutants and Reactions",
                        "Aquatic Chemistry and Water Pollution",
                        "Soil Chemistry and Contamination"
                      ]
                    },
                    {
                      "id": "iche4102_ch2",
                      "title": "Industrial Wastewater Treatment",
                      "topics": [
                        "Primary, Secondary, and Tertiary Treatment",
                        "Advanced Oxidation Processes",
                        "Sludge Management"
                      ]
                    },
                    {
                      "id": "iche4102_ch3",
                      "title": "Air Pollution Control and Solid Waste",
                      "topics": [
                        "Control of Gaseous and Particulate Emissions",
                        "Solid and Hazardous Waste Management",
                        "Recycling and Waste Minimization"
                      ]
                    }
                  ]
                },
                {
                  "code": "ICHE4104",
                  "name": "Process Control and Instrumentation",
                  "description": "Principles of automatic process control, including measurement devices, final control elements, and the design and tuning of feedback controllers.",
                  "credits": 3,
                  "chapters": [
                    {
                      "id": "iche4104_ch1",
                      "title": "Process Dynamics and Modeling",
                      "topics": [
                        "Laplace Transforms and Transfer Functions",
                        "Dynamic Behavior of First and Second-Order Systems"
                      ]
                    },
                    {
                      "id": "iche4104_ch2",
                      "title": "Feedback Control Systems",
                      "topics": [
                        "PID Controller Algorithms",
                        "Block Diagram Analysis",
                        "Stability Analysis"
                      ]
                    },
                    {
                      "id": "iche4104_ch3",
                      "title": "Controller Tuning and Advanced Control",
                      "topics": [
                        "Controller Tuning Methods",
                        "Feedforward and Cascade Control"
                      ]
                    },
                    {
                      "id": "iche4104_ch4",
                      "title": "Process Instrumentation",
                      "topics": [
                        "Sensors for Temperature, Pressure, Flow, Level",
                        "Control Valves",
                        "Piping and Instrumentation Diagrams (P&IDs)"
                      ]
                    }
                  ]
                },
                {
                  "code": "ICHE4106",
                  "name": "B.Sc. Thesis / Project",
                  "description": "An independent research or design project supervised by a faculty member, integrating knowledge from across the curriculum and culminating in a formal thesis and oral defense.",
                  "credits": 4,
                  "chapters": [
                    {
                      "id": "iche4106_ch1",
                      "title": "Project Proposal and Literature Review",
                      "topics": []
                    },
                    {
                      "id": "iche4106_ch2",
                      "title": "Experimental Work / Process Design",
                      "topics": []
                    },
                    {
                      "id": "iche4106_ch3",
                      "title": "Data Analysis and Interpretation",
                      "topics": []
                    },
                    {
                      "id": "iche4106_ch4",
                      "title": "Thesis Writing and Defense",
                      "topics": []
                    }
                  ]
                }
              ]
            }
          }
        }
        // ... Other departments in Natural Sciences ...
      ],
    },
  ],
};