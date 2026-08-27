import { removeBackground } from '@imgly/background-removal'

export interface ProgressInfo {
    status: string
    progress?: number
}

export interface ProcessingResult {
    id: string
    blob: Blob
    previewUrl: string
    filename: string
    width: number
    height: number
}

class BgRemoveClient {
    public async processImage(
        file: File,
        id: string,
        onProgress?: (info: ProgressInfo) => void
    ): Promise<ProcessingResult> {
        const imageBitmap = await createImageBitmap(file)
        const width = imageBitmap.width
        const height = imageBitmap.height
        imageBitmap.close()

        const resultBlob = await removeBackground(file, {
            progress: (key: string, current: number, total: number) => {
                const pct = total > 0 ? Math.round((current / total) * 100) : 0
                if (onProgress) {
                    onProgress({
                        status: key.replace(/_/g, ' '),
                        progress: pct
                    })
                }
            }
        })

        const previewUrl = URL.createObjectURL(resultBlob)
        const baseName = file.name.replace(/\.[^/.]+$/, '')
        const filename = `${baseName}_bg_removed.png`

        return {
            id,
            blob: resultBlob,
            previewUrl,
            filename,
            width,
            height
        }
    }
}

export const bgRemoveClient = new BgRemoveClient()
