
🎓 Lumo - The Intelligent Learning Platform

![alt text](https://via.placeholder.com/1200x630/4f46e5/ffffff?text=Lumo%20by%20ASCII%20Technologies)

<div align="center">


![alt text](https://img.shields.io/github/actions/workflow/status/your-username/lumo/ci.yml?branch=main&style=for-the-badge)


![alt text](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)


![alt text](https://img.shields.io/badge/Next.js-14+-black.svg?style=for-the-badge&logo=next.js)


![alt text](https://img.shields.io/badge/Prisma-5-3982CE.svg?style=for-the-badge&logo=prisma)

An AI-enhanced learning management system designed to create, share, and track educational content with powerful analytics and personalized feedback. Built by ASCII Technologies.

</div>

✨ About Lumo

Lumo is a modern, full-stack learning platform built with Next.js and the App Router. It empowers both educators and learners by providing tools for dynamic content creation, AI-powered quiz generation, intelligent scoring, and in-depth performance tracking. The platform is designed to be fast, scalable, and intuitive, offering a seamless educational experience.

Key Features

🧠 AI-Powered Quizzes: Automatically generate challenges and evaluate free-text answers using Google Gemini.

📊 Performance Analytics: A dedicated data model tracks user "understanding" based on quiz scores and time spent.

📈 Progress & Position Tracking: Seamlessly saves and restores a user's scroll position and interaction history.

🎨 Dynamic Content Viewer: Supports rich, interactive content created with a block-style editor.

⚙️ Modern Tech Stack: Built with the latest industry-standard tools for a robust and maintainable codebase.

💅 Sleek UI: Utilizes shadcn/ui and Tailwind CSS for a beautiful and responsive design system.

🚀 Tech Stack

Framework: Next.js (App Router)

Database: MongoDB

ODM / ORM:

Mongoose: For flexible, schema-based data modeling.

Prisma: For type-safe database access and migrations.

Authentication: NextAuth.js

UI: React

Styling: Tailwind CSS

Component Library: shadcn/ui

AI: Google Gemini

Validation: Zod

🛠️ Getting Started: Local Development Setup

Follow these steps to get a local instance of Lumo up and running.

1. Prerequisites

Make sure you have the following installed on your machine:

Node.js (v18.x or later recommended)

pnpm (recommended), yarn, or npm

Git

A MongoDB database instance (you can use a free MongoDB Atlas cluster).

2. Clone the Repository
Generated bash
git clone https://github.com/your-username/lumo.git
cd lumo

3. Install Dependencies

Using pnpm is recommended for managing dependencies efficiently.

Generated bash
pnpm install
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END
4. Set Up Environment Variables

Create a .env.local file in the root of the project by copying the example file.

Generated bash
cp .env.example .env.local
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Now, open .env.local and fill in the required values.

Generated ini
# .env.local

# -----------------
# DATABASE
# -----------------
# Connection string for your MongoDB database.
# Used by both Mongoose and Prisma.
# Example for MongoDB Atlas: mongodb+srv://<user>:<password>@<cluster-url>/lumo?retryWrites=true&w=majority
DATABASE_URL="your_mongodb_connection_string"

# -----------------
# AUTHENTICATION (NextAuth.js)
# -----------------
# A secret used to sign and encrypt session data.
# Generate one with: `openssl rand -base64 32` in your terminal
NEXTAUTH_SECRET="your_nextauth_secret"
# The canonical URL of your app. For local development, this is fine.
NEXTAUTH_URL="http://localhost:3000"

# Optional: Add OAuth provider credentials if you use them (e.g., Google, GitHub)
# GOOGLE_CLIENT_ID="your_google_client_id"
# GOOGLE_CLIENT_SECRET="your_google_client_secret"

# -----------------
# AI SERVICES (Google Gemini)
# -----------------
# Your API key for Google's Generative AI services.
# Get one from Google AI Studio: https://ai.google.dev/
GEMINI_API_KEY="your_gemini_api_key"
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Ini
IGNORE_WHEN_COPYING_END
5. Set Up the Database

Lumo uses both Mongoose and Prisma for database interactions.

Mongoose connects automatically using the DATABASE_URL. No extra steps are needed.

Prisma needs to generate its client based on your schema.

Run the following command to generate the Prisma Client, which provides type-safe database access:

Generated bash
npx prisma generate
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

To sync your Prisma schema with your database for the first time in development, use db push:

Generated bash
npx prisma db push
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Note: For production or more complex schema changes, you would typically use npx prisma migrate dev to create versioned migration files. db push is great for getting started quickly.

6. Run the Development Server

You're all set! Start the Next.js development server.

Generated bash
pnpm dev
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Open http://localhost:3000 in your browser to see the Lumo platform in action.

📂 Project Structure

A brief overview of the key directories in the project:

Generated code
/
├── app/                # Next.js App Router: pages, layouts, and API routes
├── components/         # Reusable UI components (shadcn/ui components live here)
├── lib/                # Shared utilities, libraries, and server actions
│   ├── actions/        # Server Actions (e.g., performance.ts, score.ts)
│   ├── auth.ts         # NextAuth.js configuration
│   └── mongodb.ts      # Mongoose connection helper
├── models/             # Mongoose data models (e.g., User.ts, Content.ts)
├── prisma/             # Prisma configuration and schema.prisma file
└── public/             # Static assets like images and fonts
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END

A note on shadcn/ui: Components are not installed as a package. To add a new component, you use the CLI: npx shadcn-ui@latest add <component-name>

📜 Available Scripts

pnpm dev: Starts the development server.

pnpm build: Creates a production-ready build.

pnpm start: Starts the production server.

pnpm lint: Runs ESLint to check for code quality issues.

🤝 Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and open a pull request. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

<div align="center">
Made with ❤️ by ASCII Technologies
</div>
