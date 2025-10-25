import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

export const promptInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /ignore\s+previous\s+instructions/i,
    /system\s+prompt/i,
    /jailbreak/i,
    /roleplay/i,
    /pretend\s+to\s+be/i,
    /act\s+as\s+if/i,
    /you\s+are\s+now/i,
    /forget\s+everything/i,
    /new\s+instructions/i,
    /override/i,
    /bypass/i,
    /hack/i,
    /exploit/i
  ];

  const checkText = (text: string): boolean => {
    return suspiciousPatterns.some(pattern => pattern.test(text));
  };

  if (req.body.content && checkText(req.body.content)) {
    return res.status(400).json({
      error: 'Invalid input detected. Please provide valid medical notes only.'
    });
  }

  if (req.body.transcription && checkText(req.body.transcription)) {
    return res.status(400).json({
      error: 'Invalid transcription detected. Please provide valid medical notes only.'
    });
  }

  next();
};

export const inputSanitization = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeString = (str: string): string => {
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  };

  if (req.body.content) {
    req.body.content = sanitizeString(req.body.content);
  }

  if (req.body.transcription) {
    req.body.transcription = sanitizeString(req.body.transcription);
  }

  next();
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many uploads from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
