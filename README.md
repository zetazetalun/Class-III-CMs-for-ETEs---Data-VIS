# Systematic Literature Review (SLR) Visualization Dashboard
### Construction Methods (CMs) in Extraterrestrial Environments (ETEs)

[![Live Visualization Preview](https://img.shields.io/badge/Live%20App-Shared%20Preview-6366f1?style=for-the-badge&logo=google-chrome&logoColor=white)](https://ais-pre-yu7erqga22rpblk5wo73gb-384167759363.asia-east1.run.app)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=for-the-badge)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Academic%20Research-blue.svg?style=for-the-badge)](LICENSE)

An interactive, high-performance data visualization dashboard and scientific exploration tool for a Systematic Literature Review on **Construction Methods in Extraterrestrial Environments** (Lunar, Martian, Orbital, Underground).

---

## 🌐 Live Deployed Application

- **Development Preview (Active Dev Instance)**: [https://ais-dev-yu7erqga22rpblk5wo73gb-384167759363.asia-east1.run.app](https://ais-dev-yu7erqga22rpblk5wo73gb-384167759363.asia-east1.run.app)
- **Shared Visualization URL**: [https://ais-pre-yu7erqga22rpblk5wo73gb-384167759363.asia-east1.run.app](https://ais-pre-yu7erqga22rpblk5wo73gb-384167759363.asia-east1.run.app)
  *(Note: The shared `ais-pre-...` URL is deployed automatically when clicking the **Share** button in the top-right of Google AI Studio).*

---

## 🚀 Core Features & Functions

### 1. Review & Synthesis Dashboard (`Review` Tab)
- **Executive Synthesis**: Comprehensive qualitative review sections including *Synthesis Overview*, *Key Findings*, *Methodology Trends*, and specialized *Class III Habitat Technologies* (In-Situ Resource Utilization - ISRU).
- **Core Metrics Overview**: Total literature corpus size (212+ papers), relevant vs. non-relevant classification ratios, and metadata mapping coverage (2,000+ extracted parameter points).
- **Temporal Distribution**: Interactive publication timeline showing research density and surges from foundational space architecture eras to contemporary Artemis and Mars programs.
- **Categorical Parameter Breakdown**: Visual distributions for:
  - **Research Types**: Primary (original experiments), Secondary (reviews/meta-analyses), and Tertiary literature.
  - **Publication Formats**: Journal articles, conference proceedings, technical notes, preprints, patents, and manuals.
  - **Application Scenarios**: Surface, Underground (lava tubes), and Orbital.
  - **Target Locations**: Moon, Mars, Asteroids, and Deep Space.
  - **Habitat Classification**: Class I (Prefabricated modules), Class II (Deployable / Inflatable structures), Class III (ISRU-based additive construction & sintering).
- **Cross-Tabulation Matrix**: Multi-dimensional heatmaps comparing Habitat Classes against materials science, biotechnology, automated construction, robotics, and life support systems.
- **Export Capabilities**: Single-click downloads for full datasets as structured Excel files (`.xlsx`) and bulk BibTeX citation export.

### 2. Interactive Charts & Cross-Parameter Builder (`Charts` Tab)
- **Dynamic Pivot Matrix**: Compare any two arbitrary research parameters simultaneously (e.g., *Application Location vs. Construction Technology*, or *Year vs. Habitat Class*).
- **Multi-View Visualizations**:
  - Stacked Bar Charts
  - Grouped Comparative Bar Charts
  - Co-occurrence Density Heatmaps
  - Summary Data Tables with marginal totals
- **Multi-Dimensional Filters**: Filter visual dataset by target location, habitat classification, publication format, and operational scenario in real time.
- **Export Tool**: Save generated charts as high-resolution PNG image cards or export the corresponding matrix to Excel.

### 3. Literature & Source Documents Explorer (`Literature` Tab)
- **Corpus Browser**: Full directory of indexed academic literature with real-time fuzzy text search across titles, DOIs, authors, and keywords.
- **Dynamic Grouping**: Group papers flexibly by research parameter (e.g., grouped by *Publication Year*, *Habitat Class*, *Research Focus*, or *Publisher*).
- **Deep Inspection Modal**:
  - Complete paper bibliographic metadata and DOI links.
  - Detailed relevance classification rationale.
  - Granular extracted knowledge and methodology summaries.
  - Parameter mappings with confidence levels.
  - Formatted BibTeX snippet with one-click clipboard copy.

### 4. Grounded Scientific Assistant (`Chatbox` Tab)
- **Grounded AI Q&A**: Powered by Google Gemini (`gemini-3.8-flash`), strictly grounded in the extracted systematic literature review database.
- **Academic Citation Formatting**: Responses automatically cite supporting literature with exact paper titles and DOI links (e.g., `"[Paper Title] (DOI: 10.xxxx/...)"`).
- **Research Querying**: Ask technical questions on sintering techniques (microwave, solar, laser), regolith simulant properties, inflatable-ISRU hybrid shelters, and structural protection against extraterrestrial radiation and micrometeorites.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & UI** | Tailwind CSS, Lucide React Icons, Framer Motion |
| **Data Visualization** | Recharts, D3 Force Network, Custom Heatmap Renderers |
| **Data Engine & Persistence** | Express.js, Better-SQLite3 (WAL mode), SheetJS (`xlsx`) |
| **AI Integration** | Google GenAI SDK (`@google/genai`), Gemini 3.8 Flash |

---

## 📁 Repository Structure

```text
├── src/
│   ├── components/
│   │   ├── InteractiveChartBuilder.tsx # Dynamic cross-parameter matrix & chart engine
│   │   └── KnowledgeGraph.tsx          # D3 force-directed network graph
│   ├── lib/
│   │   ├── normalize.ts                # Parameter taxonomy & data normalization
│   │   └── graphDatabase.ts            # Network graph node/edge builder
│   ├── services/
│   │   └── gemini.ts                   # Gemini client integration for literature chat
│   ├── types.ts                        # Shared TypeScript interfaces & schemas
│   ├── App.tsx                         # Main SPA shell, navigation & dashboard views
│   └── main.tsx                        # Client application entry point
├── server/
│   └── geminiService.ts                # Server-side Gemini proxy with model fallback
├── server.ts                           # Express backend API & SQLite database manager
├── package.json                        # Scripts and dependencies
├── vite.config.ts                      # Vite build & plugin configuration
└── README.md                           # Documentation & user instructions
```

---

## 💻 Local Development & Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/zetazetalun/Space-Architecture-Literature.git
cd Space-Architecture-Literature
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```
*(Note: A Gemini API key is required for the Chatbox literature assistant. The Review, Charts, and Literature explorer tabs work without an API key using the local SQLite dataset).*

### 3. Run Development Server
Start the full-stack server (runs on `http://localhost:3000`):
```bash
npm run dev
```

### 4. Build for Production
To generate a production-ready build:
```bash
npm run build
```

To start the full-stack production server:
```bash
npm start
```

---

## 🚀 Deployment to GitHub Pages (Static Hosting)

The repository is configured for automated deployment to **GitHub Pages** with zero backend infrastructure:

### Method A: Automated GitHub Actions (Recommended)
1. Go to your repository on GitHub: `https://github.com/zetazetalun/SRL-on-Space-Architecture`
2. Navigate to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, change from *Deploy from a branch* to **GitHub Actions**.
4. Whenever you push to the `main` branch, the workflow (`.github/workflows/deploy-pages.yml`) builds and deploys the dashboard automatically.
5. Your live site will be accessible at:
   `https://zetazetalun.github.io/SRL-on-Space-Architecture/`

### Method B: Single-Command Manual Deployment
You can also build and publish directly from your local terminal:
```bash
npm run deploy
```
*(This builds the static bundle and pushes it to the `gh-pages` branch via the `gh-pages` utility).*

### Features Supported in Static Mode:
- **Interactive Visualizations**: Review synthesis, interactive charts, PRISMA flow chart, and force-directed knowledge graphs load instantly from the bundled dataset (`public/data/default_analysis_state.json`).
- **Zero-Server Paper Contribution**: Contributions submitted via the dashboard are formatted into GitHub Issues and processed automatically by the repository's GitHub Action (`.github/workflows/process-contribution.yml`), archiving papers into `Contributions/` with zero server costs.
- **Client-Side DOI Auto-Fill**: Live CrossRef API integration operates directly in the browser with CORS support.

---

## 📄 License & Attribution
Curated and published for systematic space architecture and extraterrestrial construction research.
Developed by [@zetazetalun](https://github.com/zetazetalun).
Live preview accessible at [https://ais-pre-yu7erqga22rpblk5wo73gb-384167759363.asia-east1.run.app](https://ais-pre-yu7erqga22rpblk5wo73gb-384167759363.asia-east1.run.app).
