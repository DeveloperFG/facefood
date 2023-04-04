import { useContext } from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../../img/logo.png'

import { FiLogOut } from 'react-icons/fi'

import { AuthContext } from '../contexts/AuthContext'

export function Header(){

    const { signOut } = useContext(AuthContext)

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href='/'>
                    <Image src={logo} width={300} height={50}/>
                </Link>

                <nav className={styles.menuNav}> 
                    <Link href='/category'>
                        Categoria
                    </Link>

                    <Link href='/product'>
                        Cardapio
                    </Link>

                    <button onClick={signOut}>
                        <FiLogOut color='#fff' size={24}/>
                    </button>

                </nav>
            </div>
        </header>
    )
}