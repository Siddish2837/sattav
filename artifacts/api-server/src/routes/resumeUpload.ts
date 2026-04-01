import { Router, type Request, type Response } from "express";
import multer from "multer";
// Import from internal path to avoid pdf-parse's startup test-file read bug
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse: (buffer: Buffer) => Promise<{ text: string }> = require("pdf-parse/lib/pdf-parse.js");
import mammoth from "mammoth";
import { parseResumeText } from "../lib/resumeParser";

const router = Router();

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.mimetype);
    const isAllowedExt =
      file.originalname.toLowerCase().endsWith(".pdf") ||
      file.originalname.toLowerCase().endsWith(".docx");

    if (isAllowedMime || isAllowedExt) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are supported."));
    }
  },
});

router.post(
  "/upload-resume",
  upload.single("resume"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        error: "No file uploaded. Please attach a PDF or DOCX file.",
      });
      return;
    }

    const { mimetype, buffer, originalname } = req.file;
    let extractedText = "";

    try {
      const isPdf =
        mimetype === "application/pdf" ||
        originalname.toLowerCase().endsWith(".pdf");

      if (isPdf) {
        const data = await pdfParse(buffer);
        extractedText = data.text;
      } else {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      }
    } catch (err) {
      req.log.error({ err, originalname }, "Failed to extract text from resume");
      res.status(422).json({
        error:
          "Could not read the file. Please ensure it is a valid, non-corrupted PDF or DOCX.",
      });
      return;
    }

    if (!extractedText || extractedText.trim().length < 20) {
      res.status(422).json({
        error:
          "The file appears to be empty or image-only. Please upload a text-based PDF or DOCX resume.",
      });
      return;
    }

    const parsed = parseResumeText(extractedText);

    res.json({
      success: true,
      filename: originalname,
      ...parsed,
    });
  }
);

export default router;
