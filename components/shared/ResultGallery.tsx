'use client'

import { useState } from 'react'
import { downloadDataUrl, downloadResultsAsZip } from '@/lib/download'
import styles from './ResultGallery.module.css'

export interface ResultItem {
    id: string
    imageUrl: string
    filename: string
    width: number
    height: number
}

interface ResultGalleryProps {
    results: ResultItem[]
    browser?: string
    zipNamePrefix?: string
}

export default function ResultGallery({
    results,
    browser = 'export',
    zipNamePrefix = 'extpixel'
}: ResultGalleryProps) {
    const [zipMode, setZipMode] = useState(true)

    if (!results.length) return null

    const downloadAllAsZip = async () => {
        try {
            await downloadResultsAsZip({
                results: results.map((r) => ({ dataUrl: r.imageUrl, filename: r.filename })),
                browser,
                zipNamePrefix
            })
        } catch {
            results.forEach((r, i) => {
                setTimeout(() => downloadDataUrl(r.imageUrl, r.filename), i * 250)
            })
        }
    }

    const downloadAll = () => {
        if (zipMode) {
            void downloadAllAsZip()
            return
        }
        results.forEach((r, i) => {
            setTimeout(() => downloadDataUrl(r.imageUrl, r.filename), i * 250)
        })
    }

    return (
        <div className={`nes-container with-title is-centered ${styles.container}`}>
            <p className="title">RESULTS</p>

            <div className={styles.modeToggle}>
                <button
                    type="button"
                    className={`nes-btn is-small ${zipMode ? 'is-success' : 'is-warning'}`}
                    onClick={() => setZipMode((prev) => !prev)}
                >
                    {zipMode ? 'ZIP MODE ON' : 'PNG MODE ON'}
                </button>
            </div>

            <div className={styles.downloadAll}>
                <button type="button" className="nes-btn is-success" onClick={downloadAll}>
                    {zipMode ? 'DOWNLOAD ALL (.ZIP)' : 'DOWNLOAD ALL (PNGS)'}
                </button>
            </div>

            <div className="results-grid">
                {results.map((r) => (
                    <div key={r.id} className="nes-container is-rounded result-item">
                        <img src={r.imageUrl} alt={r.filename} />
                        <p className={styles.dimensions}>{r.width}x{r.height}px</p>
                        <button
                            type="button"
                            className="nes-btn is-primary is-small"
                            onClick={() => downloadDataUrl(r.imageUrl, r.filename)}
                        >
                            SAVE PNG
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
