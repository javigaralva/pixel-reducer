import { HandlerContext, Handlers } from '$fresh/server.ts'
import { BlobWriter, ZipWriter } from 'https://deno.land/x/zipjs@v2.6.75/index.js'
import { ImageContentType } from '../../services/optimize-images/consts.ts'
import { getFileNameInfoFrom } from '../../services/optimize-images/helpers/getFileNameInfoFrom.ts'
import { isOptimizableImage } from '../../services/optimize-images/helpers/isOptimizableImage.ts'
import { uuid } from '../../utils/uuid.ts'

export const handler: Handlers = {
    POST: async (_req: Request, _ctx: HandlerContext) => {
        try {
            const { urls = [] } = JSON.parse(await _req.text()) ?? {}

            const zipFileWriter = new BlobWriter('application/zip')
            const zipWriter = new ZipWriter(zipFileWriter)

            const namesUsed: string[] = []
            await Promise.allSettled(
                urls.map((url: string) =>
                    fetch(url).then(async (response) => {
                        if (!response.body) return

                        const headers = Object.fromEntries(await response.headers)
                        const contentType = headers['content-type'] as ImageContentType
                        const isOptimizable = isOptimizableImage(contentType)
                        if (!isOptimizable) return

                        const info = getFileNameInfoFrom({ url, contentType })

                        // Rename if fileName was already used
                        const { fileName, extension } = info
                        const fileNameExt = namesUsed.includes(info.fileNameExt)
                            ? fileName + '_' + uuid() + extension
                            : info.fileNameExt

                        namesUsed.push(fileNameExt)
                        zipWriter.add(fileNameExt, response.body)
                    })
                ),
            )

            await zipWriter.close()
            const zipFileBlob = await zipFileWriter.getData()

            const response = new Response(zipFileBlob)
            response.headers.append('Content-Type', 'application/zip')
            response.headers.append('Content-disposition', 'attachment; filename=myFile.zip')
            return response
        } catch (_ex) {
            return new Response(JSON.stringify({}), { status: 400 })
        }
    },
}
