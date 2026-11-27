import styles from '@/app/careers/careers.module.css';

export function Asset({name, ...props}) {
  return <img src={`/careers/${name}`} alt="" {...props} />;
}
export function Symbol({children}) {
  return <span className={styles.symbol} aria-hidden="true">{children}</span>;
}
export function IconBox({children}) {
  return <span className={styles.iconBox}><Symbol>{children}</Symbol></span>;
}
export function SectionHeading({eyebrow, children, description}) {
  return <div className={styles.sectionHeading}><span className={styles.eyebrow}>{eyebrow}</span><h2>{children}</h2>{description && <p>{description}</p>}</div>;
}
