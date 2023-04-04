import { createContext, ReactNode, useState, useEffect } from 'react'
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import { api } from '@/src/services/apiClient'

import { toast } from 'react-toastify'

type AuthContextData = {
    user: UserProps
    isAutenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
    
}


type UserProps = {
    id: string;
    name: string;
    email: string;

}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children:  ReactNode;
} 
 
export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    }catch(err){
        console.log('erro ao deslogar', err)
    }
}

export function AuthProvider({ children }: AuthProviderProps){

    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    useEffect(() => {

        // tentar pegar algum token no cokie, se tiver algum user logado
        const {'@nextauth.token': token } = parseCookies();
        
        if(token){
            api.get('/me').then(response => {
                const {id, name, email } = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(() => {
                // se, erro deslogar o user.
                signOut();
            })
        }

    },[])


    async function signIn({ email, password }: SignInProps){
       try{
            const response = await api.post('./session', {
                email, 
                password
            })

            // console.log(response.data)

            const { id, name, token } = response.data

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // expira com 1 mes
                path: "/" // todos terao acesso ao caminho
            })

            setUser({
                id,
                name,
                email
            })

            // passando o token para as proximas requisicoes
            api.defaults.headers['Autorization'] = `Bearer ${token}`

            toast.success('Logado com sucesso!')

            // redirecionando para dashborad
            Router.push('dashboard')

       }catch(err){
        toast.error('Erro ao acessar!')
        console.log('ERRO AO ACESSAR', err)

       }
    }


    async function signUp({name, email, password}: SignUpProps){
       try{

        const response = await api.post('/users', {
            name,
            email,
            password
        })

        toast.success('Conta criada com sucesso!')

        Router.push('/')

       }catch(err){
        toast.error('Erro ao cadastrar!')
        console.log(err)
       }
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
} 