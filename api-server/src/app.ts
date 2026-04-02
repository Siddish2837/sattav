import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { CAREERS, getCareerById } from "./data/careers";
import { computeCareerAnalysis } from "./logic/analysis";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/analyze", (req: Request, res: Response) => {
  try {
    const body = req.body ?? {};
    const skills = Array.isArray(body.skills)
      ? body.skills.map((skill) => String(skill).trim()).filter(Boolean)
      : [];
    const interests = String(body.interests ?? "").trim();
    const careerGoal = String(body.careerGoal ?? "").trim();
    const careerId = String(body.careerId ?? "").trim();

    if (!careerId) {
      return res.status(400).json({ error: "careerId is required." });
    }

    const career = getCareerById(careerId);
    if (!career) {
      return res.status(400).json({ error: `Career not found for id '${careerId}'.` });
    }

    const analysis = computeCareerAnalysis(career, skills, interests, careerGoal);

    return res.json({
      matchScore: analysis.matchScore,
      survivalScore: analysis.survivalScore,
      missingSkills: analysis.missingSkills,
      readinessTime: analysis.readinessTime,
      difficulty: analysis.difficulty,
      recommendation: analysis.recommendation,
      stressFit: analysis.stressFit,
      workHoursFit: analysis.workHoursFit,
      learningCurveFit: analysis.learningCurveFit,
    });
  } catch (error) {
    logger.error({ err: error }, "Analyze route failed");
    return res.status(500).json({ error: "Unable to analyze career inputs." });
  }
});

app.post("/recommend", (req: Request, res: Response) => {
  try {
    const body = req.body ?? {};
    const skills = Array.isArray(body.skills)
      ? body.skills.map((skill) => String(skill).trim()).filter(Boolean)
      : [];
    const interests = String(body.interests ?? "").trim();
    const careerGoal = String(body.careerGoal ?? "").trim();

    const scores = CAREERS.map((career) => {
      const analysis = computeCareerAnalysis(career, skills, interests, careerGoal);

      return {
        careerId: career.id,
        title: career.title,
        matchScore: analysis.matchScore,
        survivalScore: analysis.survivalScore,
        finalScore: analysis.finalScore,
        missingSkills: analysis.missingSkills.slice(0, 3),
        readinessTime: analysis.readinessTime,
        difficulty: analysis.difficulty,
      };
    });

    const topCareers = scores.sort((a, b) => b.finalScore - a.finalScore).slice(0, 3);
    return res.json(topCareers);
  } catch (error) {
    logger.error({ err: error }, "Recommend route failed");
    return res.status(500).json({ error: "Unable to generate career recommendations." });
  }
});

app.use("/api", router);

export default app;
