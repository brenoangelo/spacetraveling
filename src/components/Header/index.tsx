import styles from './header.module.scss'
import Image from 'next/image'
import Link from 'next/link';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/">
          <Image 
            src="/images/logo.svg" 
            alt="spacetraveling" 
            width={238}
            height={25.63}
          />
        </Link>
      </div>
    </header>
  )
}
