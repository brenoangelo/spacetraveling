import styles from './header.module.scss'
import commonStyles from '../../styles/common.module.scss'
import Image from 'next/image'
import Link from 'next/link';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={commonStyles.container}>
        <Link href="/">
          <a>
            <Image 
              src="/images/logo.svg" 
              alt="logo" 
              width={238}
              height={25.63}
            />
          </a>
        </Link>
      </div>
    </header>
  )
}
