import styles from './careers.module.css';

export const metadata = {
  title: {absolute: 'Careers at 9Jobs | Join Our Team'},
  description: 'Explore internal career opportunities at 9Jobs. Help Australian job seekers with resume writing, LinkedIn and SEEK profiles, job applications and interview support.',
};

export default function CareersLayout({children}) {
  return <main className={styles.careers}>{children}</main>;
}
