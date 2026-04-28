// TODO(phase-2): PDF text + bbox extraction
// Output type:
//   interface ParsedPdf {
//     pages: Array<{
//       page_number: number;    // 1-indexed
//       text: string;           // full page text
//       spans: Array<{
//         text: string;
//         bbox: [number, number, number, number]; // [x0, y0, x1, y1]
//       }>;
//     }>;
//     total_pages: number;
//     raw_text: string;         // concatenated full-document text
//   }
// Uses pdf-parse for raw text extraction, pdfjs-dist for per-span bbox coords
export {};
