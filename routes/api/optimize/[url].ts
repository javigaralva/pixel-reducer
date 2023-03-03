import { HandlerContext } from '$fresh/server.ts'
import { optimizeStaticImagesFrom } from '../../../services/optimize-images/optimize-images.ts'

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    try {
        const { url } = _ctx.params
        const parsedUrl = (new URL(url)).toJSON()
        const optimizeResponse = await optimizeStaticImagesFrom({ url: parsedUrl })
        return new Response(JSON.stringify(optimizeResponse))
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify(error?.message), { status: 400 })
    }
}
