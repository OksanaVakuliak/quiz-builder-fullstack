import styles from './AppLoader.module.css';

interface AppLoaderProps {
  compact?: boolean;
  title?: string;
  subtitle?: string;
}

export function AppLoader({
  compact = false,
  title = 'Composing your quiz workspace...',
  subtitle = 'Synchronizing questions, answers, and detail view',
}: AppLoaderProps) {
  return (
    <section
      className={[styles.wrapper, compact ? styles.compactWrapper : '']
        .filter(Boolean)
        .join(' ')}
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={[styles.stage, compact ? styles.compactStage : '']
          .filter(Boolean)
          .join(' ')}
        role="presentation"
      >
        <div className={styles.aura} />
        <div className={styles.ring} />

        <div
          className={[
            styles.centerMark,
            compact ? styles.compactCenterMark : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span>?</span>
        </div>

        <div
          className={[
            styles.chip,
            compact ? styles.compactChip : '',
            styles.booleanChip,
          ].join(' ')}
        >
          <span>BOOL</span>
        </div>
        <div
          className={[
            styles.chip,
            compact ? styles.compactChip : '',
            styles.inputChip,
          ].join(' ')}
        >
          <span>INPUT</span>
        </div>
        <div
          className={[
            styles.chip,
            compact ? styles.compactChip : '',
            styles.checkboxChip,
          ].join(' ')}
        >
          <span>CHECK</span>
        </div>
      </div>

      <p
        className={[styles.title, compact ? styles.compactTitle : '']
          .filter(Boolean)
          .join(' ')}
      >
        {title}
      </p>
      <p
        className={[styles.subtitle, compact ? styles.compactSubtitle : '']
          .filter(Boolean)
          .join(' ')}
      >
        {subtitle}
      </p>
    </section>
  );
}
