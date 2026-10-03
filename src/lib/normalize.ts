import { MappingResult, Paper } from '../types';

/**
 * Normalizes a parameter value based on its parameterId.
 * This ensures consistency across different papers and models, avoiding hallucinations and duplications.
 */
export function normalizeValue(parameterId: string, rawValue: string): string[] {
  if (!rawValue) return [];
  
  // Clean basic noise
  let cleaned = rawValue.trim();
  if (
    !cleaned || 
    cleaned.toLowerCase() === 'n/a' || 
    cleaned.toLowerCase() === 'unknown' || 
    cleaned.toLowerCase() === 'none' ||
    cleaned.toLowerCase() === 'not applicable' ||
    cleaned.toLowerCase() === 'not specified'
  ) {
    return [];
  }

  // Multi-value splitting logic
  let parts: string[] = [];
  if (parameterId === 'authors') {
    // Semicolon is the safest separator for authors
    if (cleaned.includes(';')) {
      parts = cleaned.split(';').map(p => p.trim());
    } else {
      // If comma-separated, be careful not to split "Last, First"
      // A simple heuristic: if a comma is followed by an initial like "A." or "John", 
      // but if we have multiple commas, let's see. Let's split by comma but filter out single initials
      const commaParts = cleaned.split(',').map(p => p.trim());
      if (commaParts.length > 1) {
        // If some parts are very short (1-2 chars, likely initials), don't split by comma
        const hasInitials = commaParts.some(p => p.length <= 2 || (p.length === 3 && p.endsWith('.')));
        if (hasInitials) {
          parts = [cleaned]; // Treat as a single block
        } else {
          parts = commaParts;
        }
      } else {
        parts = [cleaned];
      }
    }
  } else {
    // Standard comma-separated multi-value parameters (foci, locations, etc.)
    parts = cleaned.split(',').map(p => p.trim());
  }

  const results: string[] = [];

  for (let part of parts) {
    if (!part) continue;
    const lower = part.toLowerCase();

    // 1. Year of Publication
    if (parameterId === 'year') {
      const match = part.match(/(19|20)\d{2}/);
      if (match) {
        results.push(match[0]);
      }
      continue;
    }

    // 2. Habitat Class
    if (parameterId === 'habitatClass') {
      if (lower.includes('class iii') || lower.includes('class 3')) {
        results.push('Class III');
      } else if (lower.includes('class ii') || lower.includes('class 2')) {
        results.push('Class II');
      } else if (lower.includes('class i') || lower.includes('class 1')) {
        results.push('Class I');
      } else {
        results.push(toTitleCase(part));
      }
      continue;
    }

    // 3. Research Foci
    if (parameterId === 'foci') {
      if (lower === 'isru' || lower.includes('in situ resource') || lower.includes('in-situ resource')) {
        results.push('ISRU');
      } else if (lower.includes('sustainab')) {
        results.push('Sustainability');
      } else if (lower.includes('geotechnic')) {
        results.push('Geotechnical Engineering');
      } else if (lower.includes('material') && (lower.includes('science') || lower.includes('propert'))) {
        results.push('Materials Science');
      } else if (lower.includes('biotech') || lower.includes('bio-inspired') || lower.includes('biological')) {
        results.push('Biotechnology & Bio-Inspired Materials');
      } else if (lower.includes('additive') || lower.includes('automated construction') || lower.includes('print')) {
        results.push('Additive & Automated Construction');
      } else if (lower.includes('specialized construction') || lower.includes('joining')) {
        results.push('Specialized Construction Techniques');
      } else if (lower.includes('structural design') || lower.includes('deployable') || lower.includes('architectur')) {
        results.push('Structural Design');
      } else if (lower.includes('life support') || lower.includes('human factor') || lower.includes('ergonomic')) {
        results.push('Life Support & Human Factors');
      } else if (lower.includes('systems engineering') || lower.includes('information model') || lower.includes('bim')) {
        results.push('Systems Engineering and Design');
      } else if (lower.includes('management') || lower.includes('planning') || lower.includes('logistics')) {
        results.push('Construction Management & Planning');
      } else if (lower.includes('media') || lower.includes('politics') || lower.includes('discourse') || lower.includes('social')) {
        results.push('Media, Politics & Discourse');
      } else if (lower.includes('transportation') || lower.includes('shipping')) {
        results.push('Transportation/Logistics');
      } else {
        results.push(toTitleCase(part));
      }
      continue;
    }

    // 4. Application Scenario
    if (parameterId === 'scenario') {
      if (lower.includes('orbital') || lower.includes('orbit')) {
        results.push('Orbital');
      } else if (lower.includes('surface')) {
        results.push('Surface');
      } else if (lower.includes('underground') || lower.includes('subsurface') || lower.includes('cave')) {
        results.push('Underground');
      } else {
        results.push(toTitleCase(part));
      }
      continue;
    }

    // 5. Application Location
    if (parameterId === 'location') {
      if (lower.includes('mars')) {
        results.push('Mars');
      } else if (lower.includes('moon') || lower.includes('lunar')) {
        results.push('Moon');
      } else if (lower.includes('asteroid')) {
        results.push('Asteroids');
      } else if (lower.includes('space') || lower.includes('orbit') || lower.includes('deep space')) {
        results.push('Space');
      } else {
        results.push(toTitleCase(part));
      }
      continue;
    }

    // 6. Research Type
    if (parameterId === 'researchType') {
      if (lower.includes('primary')) {
        results.push('Primary Literature');
      } else if (lower.includes('secondary')) {
        results.push('Secondary Literature');
      } else if (lower.includes('tertiary')) {
        results.push('Tertiary Literature');
      } else {
        results.push(toTitleCase(part));
      }
      continue;
    }

    // Standard title casing with uppercase acronyms
    results.push(toTitleCase(part));
  }

  return Array.from(new Set(results));
}

function toTitleCase(str: string): string {
  return str
    .split(/\s+/)
    .map(word => {
      const upper = word.toUpperCase();
      if (upper === 'ISRU' || upper === 'NASA' || upper === 'ESA' || upper === 'BIM' || upper === 'PDF' || upper === 'DOI' || upper === 'II' || upper === 'III' || upper === 'IV') {
        return upper;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Computes the parameter distribution dynamically from papers and mappings.
 * It filters for successfully analyzed and relevant papers to guarantee data integrity and accuracy.
 */
export function getDynamicCounts(
  parameterId: string,
  papers: Paper[],
  mappings: MappingResult[]
): { name: string; value: number }[] {
  const relevantPaperIds = new Set(
    papers
      .filter(p => p.status === 'success' && p.isRelevant !== false)
      .map(p => p.id)
  );

  const counts: Record<string, number> = {};

  mappings
    .filter(m => m.parameterId === parameterId && m.paperId && relevantPaperIds.has(m.paperId))
    .forEach(m => {
      const normalizedVals = normalizeValue(parameterId, m.value);
      normalizedVals.forEach(v => {
        counts[v] = (counts[v] || 0) + 1;
      });
    });

  const result = Object.entries(counts).map(([name, value]) => ({ name, value }));

  if (parameterId === 'year') {
    return result.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }
  return result.sort((a, b) => b.value - a.value);
}

/**
 * Computes a dynamic heatmap cross-tabulation for a parameter compared with Habitat Class.
 */
export function getDynamicHeatmap(
  paramId: string,
  papers: Paper[],
  mappings: MappingResult[]
): { x: string; y: string; value: number }[] {
  const relevantPaperIds = new Set(
    papers
      .filter(p => p.status === 'success' && p.isRelevant !== false)
      .map(p => p.id)
  );

  const matrix: Record<string, Record<string, number>> = {};

  papers.forEach(paper => {
    if (!relevantPaperIds.has(paper.id)) return;

    const m1 = mappings.find(m => m.paperId === paper.id && m.parameterId === 'habitatClass');
    const m2 = mappings.find(m => m.paperId === paper.id && m.parameterId === paramId);

    if (m1 && m2) {
      const v1s = normalizeValue('habitatClass', m1.value);
      const v2s = normalizeValue(paramId, m2.value);

      v1s.forEach(v1 => {
        if (!matrix[v1]) matrix[v1] = {};
        v2s.forEach(v2 => {
          matrix[v1][v2] = (matrix[v1][v2] || 0) + 1;
        });
      });
    }
  });

  const flatData: { x: string; y: string; value: number }[] = [];
  Object.entries(matrix).forEach(([x, yMap]) => {
    Object.entries(yMap).forEach(([y, value]) => {
      flatData.push({ x, y, value });
    });
  });

  return flatData;
}

/**
 * Generates the standardized markdown filename: YearPublication First AuthorLastName, e.g. 2020 Rongfu Lin.md
 */
export function getPaperMarkdownFilename(paper: Paper, mappingsList: MappingResult[]): string {
  let yearStr = '';
  let authorStr = '';

  // 1. Try year from mappings
  const yearMap = mappingsList.find(m => m.paperId === paper.id && m.parameterId === 'year');
  if (yearMap && yearMap.value) {
    const norm = normalizeValue('year', yearMap.value);
    const found = norm.find(y => /^\d{4}$/.test(y));
    if (found) yearStr = found;
  }
  if (!yearStr && paper.bibtex) {
    const m = paper.bibtex.match(/year\s*=\s*[\{\"]?((?:19|20)\d{2})[\}\"]?/i);
    if (m) yearStr = m[1];
  }
  if (!yearStr && paper.path) {
    const m = paper.path.match(/(19|20)\d{2}/);
    if (m) yearStr = m[0];
  }
  if (!yearStr && paper.title) {
    const m = paper.title.match(/(19|20)\d{2}/);
    if (m) yearStr = m[0];
  }
  if (!yearStr) yearStr = '2020';

  // 2. Try first author from mappings
  const authorMap = mappingsList.find(m => m.paperId === paper.id && m.parameterId === 'authors');
  if (authorMap && authorMap.value) {
    const norm = normalizeValue('authors', authorMap.value);
    if (norm.length > 0) authorStr = norm[0];
  }
  if (!authorStr && paper.bibtex) {
    const m = paper.bibtex.match(/author\s*=\s*[\{\"]?([^}\"]+)[\}\"]?/i);
    if (m) {
      const rawAuthor = m[1].split(' and ')[0].trim();
      if (rawAuthor.includes(',')) {
        const parts = rawAuthor.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          authorStr = `${parts[1]} ${parts[0]}`;
        } else {
          authorStr = parts[0];
        }
      } else {
        authorStr = rawAuthor;
      }
    }
  }
  if (!authorStr) {
    authorStr = paper.title.replace(/\.[^/.]+$/, "").split(/[-–—_]/)[0].trim();
    if (!authorStr || authorStr.length > 30) {
      authorStr = "Author";
    }
  }

  yearStr = yearStr.replace(/[^0-9]/g, '');
  authorStr = authorStr.replace(/[\/\\?%*:|"<>]/g, '').trim();

  return `${yearStr} ${authorStr}.md`;
}

/**
 * Robustly retrieves a parameter value for a paper, with fallbacks to bibtex, path, title, and content.
 */
export function getPaperParameterValue(paper: Paper, parameterId: string, mappingsList: MappingResult[]): string {
  const mapping = mappingsList.find(m => m.paperId === paper.id && m.parameterId === parameterId);
  if (mapping && mapping.value !== undefined && mapping.value !== null) {
    let raw = '';
    if (typeof mapping.value === 'string') {
      raw = mapping.value;
    } else if (Array.isArray(mapping.value)) {
      raw = (mapping.value as any[]).join(', ');
    } else {
      raw = JSON.stringify(mapping.value);
    }
    
    // Ignore explicit "not specified" strings from the model to allow fallbacks to trigger
    if (!raw.toLowerCase().includes('not specified') && !raw.toLowerCase().includes('not mentioned') && raw.trim() !== '' && raw !== '[]' && raw !== '{}') {
      const normalized = normalizeValue(parameterId, raw);
      if (normalized.length > 0) {
        return normalized.join(', ');
      }
      return raw.trim();
    }
  }

  // Fallbacks if mapping is missing or empty
  if (parameterId === 'year') {
    if (paper.bibtex) {
      const m = paper.bibtex.match(/year\s*=\s*[\{\"]?((?:19|20)\d{2})[\}\"]?/i);
      if (m) return m[1];
    }
    if (paper.path) {
      const m = paper.path.match(/(19|20)\d{2}/);
      if (m) return m[0];
    }
    if (paper.title) {
      const m = paper.title.match(/(19|20)\d{2}/);
      if (m) return m[0];
    }
  }

  if (parameterId === 'authors') {
    if (paper.bibtex) {
      const m = paper.bibtex.match(/author\s*=\s*[\{\"]?([^}\"]+)[\}\"]?/i);
      if (m) {
        return m[1].replace(/[{}]/g, '').trim();
      }
    }
  }

  if (parameterId === 'publisher') {
    if (paper.bibtex) {
      const m = paper.bibtex.match(/(publisher|journal|booktitle)\s*=\s*[\{\"]?([^}\"]+)[\}\"]?/i);
      if (m) {
        return m[2].replace(/[{}]/g, '').trim();
      }
    }
  }

  return 'Not specified';
}


