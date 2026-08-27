'use client'

import styles from './ProcessingProgress.module.css'

interface ProcessingProgressProps {
    doneCount: number
    total: number
    progressPercent: number
    statusText?: string
}

export default function ProcessingProgress({
    doneCount,
    total,
    progressPercent,
    statusText
}: ProcessingProgressProps) {
    const safeDone = Number.isFinite(doneCount) ? doneCount : 0
    const safeTotal = Number.isFinite(total) && total > 0 ? total : 1
    const safePct = Number.isFinite(progressPercent) ? progressPercent : 0

    const overallPercent = Math.min(
        100,
        Math.round((safeDone * 100 + safePct) / safeTotal)
    )

    const processingNum = Math.min(safeDone + 1, safeTotal)

    return (
        <div className={styles.wrapper}>
            <p className={styles.processingLabel}>
                PROCESSING {processingNum} OF {safeTotal}
            </p>
            <p className={styles.counter}>
                <span className={styles.done}>{safeDone}</span>
                <span className={styles.slash}>/</span>
                <span className={styles.total}>{safeTotal}</span>
                <span className={styles.label}>DONE</span>
            </p>
            <div className={styles.barWrap}>
                <progress
                    className="nes-progress is-primary"
                    value={overallPercent}
                    max={100}
                />
            </div>
            {statusText && <p className={styles.status}>{statusText.toUpperCase()}</p>}
        </div>
    )
}
