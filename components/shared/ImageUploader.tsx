'use client'

import { useRef, useState } from 'react'
import styles from './ImageUploader.module.css'

export interface UploadFileItem {
    id: string
    file: File
    preview: string
}

interface ImageUploaderProps {
    files: UploadFileItem[]
    onAddFiles: (files: File[]) => void
    onRemoveFile: (id: string) => void
    onClearAll: () => void
}

export default function ImageUploader({
    files,
    onAddFiles,
    onRemoveFile,
    onClearAll
}: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [dragOver, setDragOver] = useState(false)

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onAddFiles(Array.from(e.dataTransfer.files))
        }
    }

    return (
        <div className="nes-container with-title">
            <p className="title">IMAGES ({files.length}/10)</p>
            <div
                className={`upload-zone nes-pointer ${dragOver ? 'drag-over' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                }}
                onDragLeave={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                }}
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                }}
                onDrop={handleDrop}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        fileInputRef.current?.click()
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label="Upload images"
            >
                <span className={styles.plusIcon}>+</span>
                <p>DROP IMAGES HERE OR CLICK TO BROWSE</p>
                <p className={styles.subtitle}>PNG, JPG, WEBP, GIF</p>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className={styles.hiddenInput}
                onChange={(e) => e.target.files && onAddFiles(Array.from(e.target.files))}
            />

            {files.length > 0 && (
                <div className="previews-grid nes-container is-rounded">
                    {files.map((u) => (
                        <div key={u.id} className="thumb-item">
                            <img src={u.preview} alt={u.file.name} />
                            <button
                                type="button"
                                className={`nes-btn is-error is-small ${styles.removeBtn}`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRemoveFile(u.id)
                                }}
                                aria-label={`Remove ${u.file.name}`}
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <div className={styles.clearRow}>
                        <button type="button" className="nes-btn is-error is-small" onClick={onClearAll}>
                            CLEAR ALL
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
