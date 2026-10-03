# Space Architecture SLR Analysis Tool: Technical & Functional Report

## Chapter 1: Executive Summary & Core Purpose
The **Space Architecture SLR Analysis Tool** is an AI-driven platform designed to automate and enhance the Systematic Literature Review (SLR) process within the field of space architecture. It leverages Large Language Models (LLMs) to ingest research papers, map them against specific architectural parameters (e.g., Habitat Class, Research Foci), and generate interactive visualizations and synthesized summaries. Its core purpose is to transform static research repositories into dynamic, explorable knowledge bases.

---

## Chapter 2: Functional Features

### 2.1 Project Setup & Repository Integration
*   **GitHub Integration**: Users can connect directly to a GitHub repository containing research papers (PDFs).
*   **Parameter Configuration**: A flexible interface allows users to define "Research Parameters" (metadata fields) that the AI should look for in the papers.
*   **Default Presets**: Includes pre-configured parameters specific to space architecture (e.g., Habitat Class I/II/III, Application Location).

### 2.2 AI-Powered Mapping Agent
*   **Automated Extraction**: The system iterates through each paper, extracting relevant data for every defined parameter.
*   **Evidence-Based Results**: For every extracted value, the AI provides a specific "Evidence" snippet from the text to ensure scientific rigor.
*   **Confidence Scoring**: Each mapping includes a confidence score, allowing researchers to identify areas that may require manual verification.

### 2.3 Systematic Literature Review (SLR) Synthesis
*   **Synthesized Overview**: Generates a high-level summary of the entire paper collection.
*   **Key Findings & Trends**: Identifies overarching themes and methodology shifts across the literature.
*   **Automated Referencing**: Extracts DOIs and BibTeX entries to facilitate academic citation.

### 2.4 Interactive Knowledge Graph
*   **Co-occurrence Visualization**: A D3.js-powered force-directed graph showing relationships between research parameters (e.g., which "Research Foci" are most commonly associated with "Class II Habitats").
*   **Interactive Exploration**: Users can drag, zoom, and hover over nodes to highlight specific research clusters.

### 2.5 Interactive Chart Builder
*   **Dynamic Cross-Tabulation**: Users can select any two parameters to generate custom cross-parameter visualizations.
*   **Multi-Chart Support**: Supports Bar Charts, Pie Charts, and Heatmaps.
*   **Real-time Calculation**: Counts are derived dynamically from the AI-mapped data.

### 2.6 Conversational Research Assistant
*   **Context-Aware Chat**: A dedicated chat interface where users can ask questions about the entire literature review.
*   **Grounding**: The assistant uses the mapped data and synthesis results to provide accurate, evidence-based answers.

---

## Chapter 3: Technical Architecture

### 3.1 Frontend Stack
*   **Framework**: React 18+ with TypeScript for type safety.
*   **Styling**: Tailwind CSS for a modern, responsive "Technical Dashboard" aesthetic.
*   **Animations**: Framer Motion for smooth transitions and interactive UI elements.
*   **Icons**: Lucide-React for consistent iconography.

### 3.2 AI Infrastructure (Gemini API)
*   **Model**: Utilizes `gemini-3.1-pro-preview` for complex reasoning and synthesis.
*   **Structured Output**: Uses JSON Schema response types to ensure the AI returns data in a format the frontend can parse reliably.
*   **Concurrency Management**: Implements a concurrency-limited processing loop to handle multiple paper mappings without hitting API rate limits.

### 3.3 Data Visualization Engines
*   **D3.js**: Used for the complex, force-directed Knowledge Graph.
*   **Recharts**: Used for standard statistical distributions (Bar, Pie, Radar).
*   **Custom Heatmap Engine**: A bespoke React-based grid renderer for high-density cross-parameter analysis.

### 3.4 Data Persistence & Export
*   **In-Memory State**: Managed via React hooks for high-speed interactivity.
*   **Excel Export**: Uses the `xlsx` library to generate multi-sheet workbooks containing raw mappings, synthesis results, and heatmap data.

---

## Chapter 4: AI Agent Logic & Scientific Rigor

### 4.1 The Mapping Agent
The mapping agent uses a "Zero-Shot" extraction prompt that forces the model to return a structured JSON object. It is instructed to strictly adhere to the provided text, preventing "hallucinations" by requiring direct quotes as evidence.

### 4.2 The Synthesis Agent
The synthesis agent performs a "Map-Reduce" style operation. It takes the individual mappings of all papers and aggregates them into a coherent narrative. It is specifically tuned to recognize domain-specific categories like "Habitat Class I, II, III" and standardize varied terminology (e.g., grouping "NEA" and "Near Earth Asteroids").

---

## Chapter 5: Strategic Value of the Web-Based Interface
*   **Democratization**: Removes the need for local software installation, allowing global access to research data.
*   **Living SLR**: Unlike static PDFs, the web platform can be updated instantly as new papers are added.
*   **Collaborative Verification**: Provides a shared "Source of Truth" for interdisciplinary teams.
