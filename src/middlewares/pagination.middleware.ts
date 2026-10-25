import { Request, Response, NextFunction } from "express"
import { paginationSchema } from "../../utils/zod"
import logger from "../../utils/logger"

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
    const result = paginationSchema.safeParse(req.query)
    if (!result.success) {
        logger.warn({err : result.error.issues})
        return res.status(400).json({
            success: false,
            message: "bad request",
            error: result.error.issues
        })
    }

    res.locals.pagination = result.data
    next()
}