import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Attach a viewer User to the request based on X-Viewer-Id header.
// Creates a User row on first use. No auth — replaced by JWT when auth is built.
declare global {
  namespace Express {
    interface Request {
      viewerId?: string;
    }
  }
}

export async function resolveViewer(req: Request, _res: Response, next: NextFunction) {
  const viewerId = req.headers['x-viewer-id'] as string | undefined;
  if (!viewerId) return next();

  const existing = await prisma.user.findUnique({ where: { id: viewerId } });
  if (!existing) {
    const displayName = (req.headers['x-display-name'] as string | undefined) || 'Friend';
    await prisma.user.create({
      data: {
        id: viewerId,
        email: `${viewerId}@guest.local`,
        name: displayName,
      },
    });
  } else {
    // Update name if a new display name is sent
    const displayName = req.headers['x-display-name'] as string | undefined;
    if (displayName && displayName !== existing.name) {
      await prisma.user.update({ where: { id: viewerId }, data: { name: displayName } });
    }
  }

  req.viewerId = viewerId;
  next();
}
