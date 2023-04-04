import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies, destroyCookie } from 'nookies'
import { AuthTokenError } from '../services/errors/AuthTokenError';

// configurar paginas que so user logados podem acessar

export function canSSRAuth<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cokies = parseCookies(ctx);

        const token = cokies['@nextauth.token']

        if(!token){
            return{
                redirect:{
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }

        try{
            return await fn(ctx)
        }catch(err){
            if(err instanceof AuthTokenError)
            destroyCookie(ctx, '@nextauth.token');

            return{
                redirect:{
                    destination: '/',
                    permanent: false
                }
            }
        }

      
    }
}