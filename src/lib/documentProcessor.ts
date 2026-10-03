import mammoth from "mammoth";

/**
 * Converts a base64 encoded DOCX file to plain text or HTML.
 * Mammoth is specifically designed for DOCX files.
 */
export async function convertDocxToText(base64Content: string): Promise<string> {
  try {
    // Convert base64 to ArrayBuffer
    // Clean base64 input aggressively: remove whitespace, newlines, and non-base64 characters
    const cleanBase64 = base64Content.replace(/^data:.*,/, '').replace(/[^A-Za-z0-9+/=]/g, '');
    const binaryString = atob(cleanBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const arrayBuffer = bytes.buffer;

    // Use mammoth to extract raw text (cleanest for AI analysis)
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    // Sanitize output to remove noise and reduce token usage
    const sanitizedText = result.value
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
    
    console.log("Mammoth extraction result:", {
      textLength: sanitizedText.length,
      messageCount: result.messages.length,
      first100Chars: sanitizedText.substring(0, 100)
    });

    if (result.messages.length > 0) {
      console.warn("Mammoth messages during conversion:", result.messages);
    }
    
    if (sanitizedText.length === 0) {
      throw new Error("Conversion successful but extracted text is empty. The file might be corrupted or in an unsupported DOCX sub-format.");
    }

    // Truncate to a reasonable limit (~250,000 characters is a safe balance)
    return sanitizedText.length > 250000 ? sanitizedText.substring(0, 250000) + "\n\n[...content truncated due to length limits...]" : sanitizedText;
  } catch (error) {
    console.error("Error converting DOCX to text:", error);
    throw new Error(`Failed to process Word document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Checks if a file extension represents a format that needs conversion.
 */
export function isWordDocument(fileName: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext === 'docx';
}

/**
 * Note: Supporting .doc (legacy Word) in a pure browser/Vite environment 
 * is significantly more complex as there aren't many lightweight JS libraries 
 * for the OLE format. Users are encouraged to save .doc as .docx.
 */
