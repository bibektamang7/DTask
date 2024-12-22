

declare global {
    namespace Express {
        interface Request {
            user: string // for now
        }
    }
}