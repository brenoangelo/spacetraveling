import styles from './header.module.scss'
import Image from 'next/image'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Image 
          src="/images/logo.svg" 
          alt="spacetraveling" 
          width={238}
          height={25.63}
        />
      </div>
    </header>
  )
}
