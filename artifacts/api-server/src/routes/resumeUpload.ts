import { Router, type Request, type Response } from "express";
import multer from "multer";
import { parseResumeText } from "../lib/resumeParser";

const router = Router();

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are supported."));
    }
  },
});

router.post("/upload-resume", upload.single("resume"), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded. Please attach a PDF or DOCX file." });
    return;
  }

  const { mimetype, buffer, originalname } = req.file;
  let extractedText = "";

  try {
    if (mimetype === "application/pdf") {
      // Dynamic import of pdf-parse to avoid top-level issues
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else {
      // DOCX
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }
  } catch (err) {
    req.log.error({ err, originalname }, "Failed to extract text from resume");
    res.status(422).json({
      error: "Could not read the file. Please ensure it is a valid, non-corrupted PDF or DOCX.",
    });
    return;
  }

  if (!extractedText || extractedText.trim().length < 30) {
    res.status(422).json({
      error: "The file appears to be empty or contains no readable text. Try a different file.",
    });
    return;
  }

  const parsed = parseResumeText(extractedText);

  res.json({
    success: true,
    filename: originalname,
    ...parsed,
  });
});

export default router;
