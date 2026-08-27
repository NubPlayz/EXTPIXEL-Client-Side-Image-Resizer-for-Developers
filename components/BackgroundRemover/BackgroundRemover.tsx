'use client'

import { useState, useCallback } from 'react'
import ImageUploader, { type UploadFileItem } from '@/components/shared/ImageUploader'
import ProcessingProgress from '@/components/shared/ProcessingProgress'
import ResultGallery, { type ResultItem } from '@/components/shared/ResultGallery'
import { bgRemoveClient, type ProcessingResult } from '@/lib/bgRemoveClient'
import styles from './BackgroundRemover.module.css'

export default function BackgroundRemover() {
    const [files, setFiles] = useState<UploadFileItem[]>([])
    const [results, setResults] = useState<ProcessingResult[]>([])
    const [statusText, setStatusText] = useState('')
    const [progressPercent, setProgressPercent] = useState(0)
    const [doneCount, setDoneCount] = useState(0)
    const [errorText, setErrorText] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleAddFiles = useCallback((newFiles: File[]) => {
        const imageFiles = newFiles.filter((f) => f.type.startsWith('image/'))
        const remainingSlot = 10 - files.length
        const allowed = imageFiles.slice(0, remainingSlot)

        if (!allowed.length) return

        const fileItems: UploadFileItem[] = allowed.map((file) => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            file,
            preview: URL.createObjectURL(file)
        }))

        setFiles((prev) => [...prev, ...fileItems])
        setErrorText(null)
    }, [files.length])

    const handleRemoveFile = useCallback((id: string) => {
        setFiles((prev) => {
            const found = prev.find((item) => item.id === id)
            if (found) URL.revokeObjectURL(found.preview)
            return prev.filter((item) => item.id !== id)
        })
    }, [])

    const handleClearAll = useCallback(() => {
        files.forEach((item) => URL.revokeObjectURL(item.preview))
        results.forEach((item) => URL.revokeObjectURL(item.previewUrl))
        setFiles([])
        setResults([])
        setStatusText('')
        setProgressPercent(0)
        setDoneCount(0)
        setErrorText(null)
    }, [files, results])

    const handleStartRemoval = async () => {
        if (!files.length || isProcessing) return

        setIsProcessing(true)
        setErrorText(null)
        setProgressPercent(0)
        setDoneCount(0)
        setStatusText('Starting...')

        const newResults: ProcessingResult[] = []

        for (let i = 0; i < files.length; i++) {
            const item = files[i]
            setDoneCount(i)
            setProgressPercent(0)
            setStatusText(item.file.name)

            try {
                const result = await bgRemoveClient.processImage(
                    item.file,
                    item.id,
                    (info) => {
                        if (info.status) setStatusText(info.status)
                        if (info.progress !== undefined) setProgressPercent(info.progress)
                    }
                )
                newResults.push(result)
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err)
                setErrorText(msg)
            }
        }

        setResults(newResults)
        setDoneCount(newResults.length)
        setProgressPercent(100)
        setStatusText(newResults.length > 0 ? 'Done' : 'Processing failed')
        setIsProcessing(false)
    }

    return (
        <div>
            {errorText && (
                <div className={`nes-container is-rounded is-dark ${styles.errorBox}`}>
                    <p className={styles.errorText}>{errorText}</p>
                </div>
            )}

            <ImageUploader
                files={files}
                onAddFiles={handleAddFiles}
                onRemoveFile={handleRemoveFile}
                onClearAll={handleClearAll}
            />

            <div className={styles.actionContainer}>
                <button
                    type="button"
                    className={`nes-btn is-primary ${styles.actionButton} ${!files.length || isProcessing ? 'is-disabled' : ''}`}
                    onClick={handleStartRemoval}
                    disabled={isProcessing || !files.length}
                >
                    REMOVE BACKGROUND
                </button>
            </div>

            {isProcessing && (
                <ProcessingProgress
                    doneCount={doneCount}
                    total={files.length}
                    progressPercent={progressPercent}
                    statusText={statusText}
                />
            )}

            <ResultGallery
                results={results.map((r): ResultItem => ({
                    id: r.id,
                    imageUrl: r.previewUrl,
                    filename: r.filename,
                    width: r.width,
                    height: r.height
                }))}
                browser="bg_remove"
                zipNamePrefix="extpixel_no_bg"
            />
        </div>
    )
}
