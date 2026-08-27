'use client'

import styles from './ToolSelector.module.css'

export type ToolType = 'resize' | 'bg-remove'

interface ToolSelectorProps {
    activeTool: ToolType
    onSelectTool: (tool: ToolType) => void
}

export default function ToolSelector({ activeTool, onSelectTool }: ToolSelectorProps) {
    return (
        <div className={styles.selectorContainer}>
            <button
                type="button"
                className={`${styles.toolBtn} ${activeTool === 'resize' ? styles.activeTool : ''}`}
                onClick={() => onSelectTool('resize')}
            >
                [ Resize ]
            </button>
            <button
                type="button"
                className={`${styles.toolBtn} ${activeTool === 'bg-remove' ? styles.activeTool : ''}`}
                onClick={() => onSelectTool('bg-remove')}
            >
                [ Remove Background ]
            </button>
        </div>
    )
}
