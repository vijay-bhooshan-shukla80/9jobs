import styles from './careers.module.css';

export const metadata = {
  title: {absolute: 'Careers at 9Jobs | Join Our Team'},
  description: 'Explore career opportunities at 9Jobs and join a team helping people build better careers through technology and personalised recruitment solutions.',
};

export default function CareersLayout({children}) {
  return <main className={styles.careers}>{children}</main>;
}
